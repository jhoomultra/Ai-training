import os
import json
import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from datasets import Dataset, load_dataset
from peft import LoraConfig, get_peft_model, TaskType
import logging
from typing import Dict, Any, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AITrainer:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.model = None
        self.tokenizer = None
        self.dataset = None
        
    def load_model(self, model_name: str):
        """Load the base model and tokenizer"""
        logger.info(f"Loading model: {model_name}")
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
            
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16 if self.config.get('fp16', True) else torch.float32,
            device_map="auto",
            trust_remote_code=True
        )
        
        # Apply PEFT if enabled
        if self.config.get('use_peft', True):
            peft_config = LoraConfig(
                task_type=TaskType.CAUSAL_LM,
                r=self.config['peft_config']['r'],
                lora_alpha=self.config['peft_config']['lora_alpha'],
                lora_dropout=self.config['peft_config']['lora_dropout'],
                target_modules=self.config['peft_config']['target_modules'],
                bias="none"
            )
            self.model = get_peft_model(self.model, peft_config)
            
        logger.info("Model loaded successfully")
        
    def load_dataset(self, dataset_path: str):
        """Load and preprocess the dataset"""
        logger.info(f"Loading dataset: {dataset_path}")
        
        # Determine file format and load accordingly
        if dataset_path.endswith('.jsonl'):
            dataset = load_dataset('json', data_files=dataset_path, split='train')
        elif dataset_path.endswith('.csv'):
            dataset = load_dataset('csv', data_files=dataset_path, split='train')
        else:
            raise ValueError(f"Unsupported file format: {dataset_path}")
            
        # Preprocess dataset
        def preprocess_function(examples):
            # Combine instruction and output for training
            texts = []
            for i in range(len(examples['instruction'])):
                text = f"### Instruction:\n{examples['instruction'][i]}\n\n### Response:\n{examples['output'][i]}"
                texts.append(text)
            
            # Tokenize
            tokenized = self.tokenizer(
                texts,
                truncation=True,
                padding=True,
                max_length=self.config.get('max_length', 512),
                return_tensors="pt"
            )
            
            # Set labels for language modeling
            tokenized["labels"] = tokenized["input_ids"].clone()
            
            return tokenized
            
        self.dataset = dataset.map(
            preprocess_function,
            batched=True,
            remove_columns=dataset.column_names
        )
        
        logger.info(f"Dataset loaded with {len(self.dataset)} examples")
        
    def train(self, output_dir: str):
        """Start the training process"""
        logger.info("Starting training...")
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=self.config.get('epochs', 3),
            per_device_train_batch_size=self.config.get('batch_size', 4),
            gradient_accumulation_steps=self.config.get('gradient_accumulation_steps', 4),
            warmup_steps=self.config.get('warmup_steps', 100),
            learning_rate=self.config.get('learning_rate', 2e-4),
            fp16=self.config.get('fp16', True),
            logging_steps=10,
            save_steps=self.config.get('save_steps', 500),
            eval_steps=self.config.get('eval_steps', 500),
            save_total_limit=3,
            remove_unused_columns=False,
            push_to_hub=False,
            report_to=None,
            gradient_checkpointing=self.config.get('gradient_checkpointing', True),
            optim=self.config.get('optimizer', 'adamw_torch'),
            lr_scheduler_type=self.config.get('scheduler', 'cosine'),
        )
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=self.dataset,
            data_collator=data_collator,
            tokenizer=self.tokenizer,
        )
        
        # Start training
        trainer.train()
        
        # Save the final model
        trainer.save_model()
        self.tokenizer.save_pretrained(output_dir)
        
        logger.info(f"Training completed. Model saved to {output_dir}")
        
        return output_dir

def run_training_job(job_config: Dict[str, Any]) -> str:
    """Main function to run a training job"""
    try:
        # Initialize trainer
        trainer = AITrainer(job_config['config'])
        
        # Load model
        model_mapping = {
            'llama-7b': 'meta-llama/Llama-2-7b-hf',
            'mistral-7b': 'mistralai/Mistral-7B-v0.1',
            'phi-3-mini': 'microsoft/Phi-3-mini-4k-instruct',
            'gemma-7b': 'google/gemma-7b'
        }
        
        model_name = model_mapping.get(job_config['model_id'])
        if not model_name:
            raise ValueError(f"Unknown model: {job_config['model_id']}")
            
        trainer.load_model(model_name)
        
        # Load dataset
        trainer.load_dataset(job_config['dataset_path'])
        
        # Start training
        output_dir = f"outputs/{job_config['job_id']}"
        os.makedirs(output_dir, exist_ok=True)
        
        result_path = trainer.train(output_dir)
        
        return result_path
        
    except Exception as e:
        logger.error(f"Training failed: {str(e)}")
        raise e