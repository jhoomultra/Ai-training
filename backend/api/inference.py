import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import logging
from typing import Dict, Any, Optional
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelInference:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.load_model()
        
    def load_model(self):
        """Load the trained model for inference"""
        logger.info(f"Loading model from: {self.model_path}")
        
        try:
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load model
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                torch_dtype=torch.float16,
                device_map="auto",
                trust_remote_code=True
            )
            
            self.model.eval()
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise e
    
    def generate_response(self, prompt: str, max_length: int = 512, temperature: float = 0.7) -> str:
        """Generate response for a given prompt"""
        try:
            # Format prompt
            formatted_prompt = f"### Instruction:\n{prompt}\n\n### Response:\n"
            
            # Tokenize input
            inputs = self.tokenizer(
                formatted_prompt,
                return_tensors="pt",
                truncation=True,
                max_length=max_length
            )
            
            # Move to device
            inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
            
            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=256,
                    temperature=temperature,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                )
            
            # Decode response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the generated part
            response = response.split("### Response:\n")[-1].strip()
            
            return response
            
        except Exception as e:
            logger.error(f"Generation failed: {str(e)}")
            return f"Error generating response: {str(e)}"
    
    def batch_generate(self, prompts: list, max_length: int = 512, temperature: float = 0.7) -> list:
        """Generate responses for multiple prompts"""
        responses = []
        for prompt in prompts:
            response = self.generate_response(prompt, max_length, temperature)
            responses.append(response)
        return responses

# Global model cache
model_cache: Dict[str, ModelInference] = {}

def get_model(model_id: str) -> ModelInference:
    """Get or load model for inference"""
    if model_id not in model_cache:
        model_path = f"outputs/{model_id}"
        if not os.path.exists(model_path):
            raise ValueError(f"Model not found: {model_id}")
        
        model_cache[model_id] = ModelInference(model_path)
    
    return model_cache[model_id]

def clear_model_cache():
    """Clear the model cache to free memory"""
    global model_cache
    model_cache.clear()
    torch.cuda.empty_cache() if torch.cuda.is_available() else None