from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import json
import sqlite3
from datetime import datetime
from typing import Optional, Dict, Any, List
import asyncio
import subprocess
import shutil
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(title="AI Training System", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("models", exist_ok=True)
os.makedirs("outputs", exist_ok=True)
os.makedirs("logs", exist_ok=True)

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS datasets (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            size INTEGER,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'uploaded'
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS models (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            size TEXT,
            parameters TEXT,
            download_url TEXT,
            is_downloaded BOOLEAN DEFAULT FALSE,
            download_date TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS training_jobs (
            id TEXT PRIMARY KEY,
            model_id TEXT,
            dataset_id TEXT,
            config TEXT,
            status TEXT DEFAULT 'pending',
            start_time TIMESTAMP,
            end_time TIMESTAMP,
            output_path TEXT,
            logs TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_deployments (
            id TEXT PRIMARY KEY,
            model_id TEXT,
            endpoint_url TEXT,
            status TEXT DEFAULT 'inactive',
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Global training status
training_status = {
    "is_training": False,
    "current_job": None,
    "progress": 0,
    "logs": []
}

@app.get("/")
async def root():
    return {"message": "AI Training System API", "status": "running"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    
    # Get counts
    cursor.execute("SELECT COUNT(*) FROM datasets")
    total_datasets = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM models WHERE is_downloaded = TRUE")
    trained_models = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM training_jobs WHERE status = 'running'")
    active_training = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM api_deployments WHERE status = 'active'")
    deployed_apis = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "totalDatasets": total_datasets,
        "trainedModels": trained_models,
        "activeTraining": active_training,
        "deployedAPIs": deployed_apis
    }

@app.post("/api/upload/dataset")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = f"uploads/{filename}"
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Save to database
        conn = sqlite3.connect('training_system.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO datasets (id, name, file_path, size)
            VALUES (?, ?, ?, ?)
        ''', (timestamp, file.filename, file_path, file_size))
        conn.commit()
        conn.close()
        
        return {"message": "Dataset uploaded successfully", "file_id": timestamp}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models/available")
async def get_available_models():
    # Return predefined models (in real implementation, this could fetch from HuggingFace)
    models = [
        {
            "id": "llama-7b",
            "name": "Llama 2 7B",
            "description": "Meta's Llama 2 model with 7 billion parameters. Great for general text generation and fine-tuning.",
            "size": "13.5 GB",
            "parameters": "7B",
            "type": "text",
            "popularity": 95,
            "downloadUrl": "meta-llama/Llama-2-7b-hf",
            "isDownloaded": False,
            "isDownloading": False
        },
        {
            "id": "mistral-7b",
            "name": "Mistral 7B",
            "description": "High-performance language model with excellent instruction following capabilities.",
            "size": "14.2 GB",
            "parameters": "7B",
            "type": "text",
            "popularity": 88,
            "downloadUrl": "mistralai/Mistral-7B-v0.1",
            "isDownloaded": True,
            "isDownloading": False
        }
    ]
    
    # Check database for download status
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, is_downloaded FROM models")
    db_models = dict(cursor.fetchall())
    conn.close()
    
    # Update download status from database
    for model in models:
        if model["id"] in db_models:
            model["isDownloaded"] = db_models[model["id"]]
    
    return models

@app.post("/api/models/download")
async def download_model(request: Dict[str, str]):
    model_id = request.get("model_id")
    
    # Simulate model download (in real implementation, use huggingface_hub)
    await asyncio.sleep(2)  # Simulate download time
    
    # Update database
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO models (id, is_downloaded, download_date)
        VALUES (?, TRUE, CURRENT_TIMESTAMP)
    ''', (model_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Model downloaded successfully"}

@app.get("/api/training/config")
async def get_training_config():
    # Return saved configuration (implement file-based or database storage)
    default_config = {
        "config": {
            "learning_rate": 2e-4,
            "batch_size": 4,
            "epochs": 3,
            "max_length": 512,
            "warmup_steps": 100,
            "save_steps": 500,
            "eval_steps": 500,
            "gradient_accumulation_steps": 4,
            "use_peft": True,
            "peft_config": {
                "r": 16,
                "lora_alpha": 32,
                "lora_dropout": 0.1,
                "target_modules": ["q_proj", "v_proj", "k_proj", "o_proj"]
            },
            "optimizer": "adamw_torch",
            "scheduler": "cosine",
            "fp16": True,
            "gradient_checkpointing": True
        },
        "selected_model": "",
        "selected_dataset": ""
    }
    
    # Try to load from file
    config_file = "training_config.json"
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            return json.load(f)
    
    return default_config

@app.post("/api/training/config")
async def save_training_config(config_data: Dict[str, Any]):
    # Save configuration to file
    config_file = "training_config.json"
    with open(config_file, 'w') as f:
        json.dump(config_data, f, indent=2)
    
    return {"message": "Configuration saved successfully"}

@app.post("/api/training/start")
async def start_training(background_tasks: BackgroundTasks, request: Dict[str, Any]):
    global training_status
    
    if training_status["is_training"]:
        raise HTTPException(status_code=400, detail="Training already in progress")
    
    # Create training job
    job_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save job to database
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO training_jobs (id, model_id, dataset_id, config, status, start_time)
        VALUES (?, ?, ?, ?, 'running', CURRENT_TIMESTAMP)
    ''', (job_id, request.get("model_id"), request.get("dataset_id"), json.dumps(request.get("config"))))
    conn.commit()
    conn.close()
    
    # Start training in background
    background_tasks.add_task(run_training, job_id, request)
    
    training_status["is_training"] = True
    training_status["current_job"] = job_id
    training_status["progress"] = 0
    training_status["logs"] = []
    
    return {"message": "Training started", "job_id": job_id}

async def run_training(job_id: str, config: Dict[str, Any]):
    """Simulate training process"""
    global training_status
    
    try:
        # Simulate training steps
        total_steps = 100
        for step in range(total_steps):
            await asyncio.sleep(0.1)  # Simulate training time
            
            progress = (step + 1) / total_steps * 100
            training_status["progress"] = progress
            
            # Add log entry
            if step % 10 == 0:
                log_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "step": step,
                    "loss": 2.5 - (step * 0.02),
                    "learning_rate": 2e-4 * (1 - step / total_steps)
                }
                training_status["logs"].append(log_entry)
        
        # Update job status
        conn = sqlite3.connect('training_system.db')
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE training_jobs 
            SET status = 'completed', end_time = CURRENT_TIMESTAMP, output_path = ?
            WHERE id = ?
        ''', (f"outputs/{job_id}", job_id))
        conn.commit()
        conn.close()
        
        training_status["is_training"] = False
        training_status["current_job"] = None
        
    except Exception as e:
        # Handle training error
        conn = sqlite3.connect('training_system.db')
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE training_jobs 
            SET status = 'failed', end_time = CURRENT_TIMESTAMP, logs = ?
            WHERE id = ?
        ''', (str(e), job_id))
        conn.commit()
        conn.close()
        
        training_status["is_training"] = False
        training_status["current_job"] = None

@app.get("/api/training/status")
async def get_training_status():
    return training_status

@app.post("/api/training/stop")
async def stop_training():
    global training_status
    
    if not training_status["is_training"]:
        raise HTTPException(status_code=400, detail="No training in progress")
    
    # Update job status
    if training_status["current_job"]:
        conn = sqlite3.connect('training_system.db')
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE training_jobs 
            SET status = 'stopped', end_time = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (training_status["current_job"],))
        conn.commit()
        conn.close()
    
    training_status["is_training"] = False
    training_status["current_job"] = None
    
    return {"message": "Training stopped"}

@app.get("/api/training/jobs")
async def get_training_jobs():
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, model_id, dataset_id, status, start_time, end_time, output_path
        FROM training_jobs
        ORDER BY start_time DESC
    ''')
    
    jobs = []
    for row in cursor.fetchall():
        jobs.append({
            "id": row[0],
            "model_id": row[1],
            "dataset_id": row[2],
            "status": row[3],
            "start_time": row[4],
            "end_time": row[5],
            "output_path": row[6]
        })
    
    conn.close()
    return jobs

@app.post("/api/deploy/model")
async def deploy_model(request: Dict[str, str]):
    model_id = request.get("model_id")
    endpoint_name = request.get("endpoint_name", f"api-{model_id}")
    
    # Create deployment record
    deployment_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    endpoint_url = f"http://localhost:8000/api/inference/{deployment_id}"
    
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO api_deployments (id, model_id, endpoint_url, status)
        VALUES (?, ?, ?, 'active')
    ''', (deployment_id, model_id, endpoint_url))
    conn.commit()
    conn.close()
    
    return {
        "message": "Model deployed successfully",
        "deployment_id": deployment_id,
        "endpoint_url": endpoint_url
    }

@app.get("/api/deployments")
async def get_deployments():
    conn = sqlite3.connect('training_system.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, model_id, endpoint_url, status, created_date
        FROM api_deployments
        ORDER BY created_date DESC
    ''')
    
    deployments = []
    for row in cursor.fetchall():
        deployments.append({
            "id": row[0],
            "model_id": row[1],
            "endpoint_url": row[2],
            "status": row[3],
            "created_date": row[4]
        })
    
    conn.close()
    return deployments

@app.post("/api/inference/{deployment_id}")
async def model_inference(deployment_id: str, request: Dict[str, str]):
    """Handle model inference requests"""
    prompt = request.get("prompt", "")
    
    # Simulate model inference
    response = f"This is a simulated response to: {prompt}"
    
    return {
        "response": response,
        "model_id": deployment_id,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)