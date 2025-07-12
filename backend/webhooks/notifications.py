import requests
import json
import os
from typing import Dict, Any, Optional
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.slack_webhook_url = os.getenv('SLACK_WEBHOOK_URL')
        self.email_api_key = os.getenv('EMAIL_API_KEY')
        self.discord_webhook_url = os.getenv('DISCORD_WEBHOOK_URL')
    
    def send_slack_notification(self, message: str, channel: str = "#ai-training") -> bool:
        """Send notification to Slack"""
        if not self.slack_webhook_url:
            logger.warning("Slack webhook URL not configured")
            return False
        
        try:
            payload = {
                "channel": channel,
                "username": "AI Training Bot",
                "text": message,
                "icon_emoji": ":robot_face:"
            }
            
            response = requests.post(
                self.slack_webhook_url,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info("Slack notification sent successfully")
                return True
            else:
                logger.error(f"Failed to send Slack notification: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending Slack notification: {str(e)}")
            return False
    
    def send_discord_notification(self, message: str) -> bool:
        """Send notification to Discord"""
        if not self.discord_webhook_url:
            logger.warning("Discord webhook URL not configured")
            return False
        
        try:
            payload = {
                "content": message,
                "username": "AI Training Bot"
            }
            
            response = requests.post(
                self.discord_webhook_url,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 204:
                logger.info("Discord notification sent successfully")
                return True
            else:
                logger.error(f"Failed to send Discord notification: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending Discord notification: {str(e)}")
            return False
    
    def send_email_notification(self, to_email: str, subject: str, message: str) -> bool:
        """Send email notification (using SendGrid or similar service)"""
        if not self.email_api_key:
            logger.warning("Email API key not configured")
            return False
        
        try:
            # Example using SendGrid API
            headers = {
                'Authorization': f'Bearer {self.email_api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "personalizations": [{"to": [{"email": to_email}]}],
                "from": {"email": "noreply@aitraining.com", "name": "AI Training System"},
                "subject": subject,
                "content": [{"type": "text/plain", "value": message}]
            }
            
            response = requests.post(
                'https://api.sendgrid.com/v3/mail/send',
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 202:
                logger.info("Email notification sent successfully")
                return True
            else:
                logger.error(f"Failed to send email notification: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending email notification: {str(e)}")
            return False
    
    def notify_training_started(self, job_id: str, model_name: str, dataset_name: str):
        """Send notification when training starts"""
        message = f"🚀 Training Started!\n\nJob ID: {job_id}\nModel: {model_name}\nDataset: {dataset_name}\nStarted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        self.send_slack_notification(message)
        self.send_discord_notification(message)
    
    def notify_training_completed(self, job_id: str, model_name: str, training_time: str, accuracy: Optional[float] = None):
        """Send notification when training completes"""
        message = f"✅ Training Completed!\n\nJob ID: {job_id}\nModel: {model_name}\nTraining Time: {training_time}"
        
        if accuracy:
            message += f"\nFinal Accuracy: {accuracy:.2f}%"
        
        message += f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        self.send_slack_notification(message)
        self.send_discord_notification(message)
    
    def notify_training_failed(self, job_id: str, model_name: str, error_message: str):
        """Send notification when training fails"""
        message = f"❌ Training Failed!\n\nJob ID: {job_id}\nModel: {model_name}\nError: {error_message}\nFailed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        self.send_slack_notification(message)
        self.send_discord_notification(message)
    
    def notify_model_deployed(self, model_name: str, endpoint_url: str):
        """Send notification when model is deployed"""
        message = f"🚀 Model Deployed!\n\nModel: {model_name}\nEndpoint: {endpoint_url}\nDeployed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        self.send_slack_notification(message)
        self.send_discord_notification(message)
    
    def notify_api_request(self, endpoint: str, request_count: int, threshold: int = 1000):
        """Send notification for high API usage"""
        if request_count >= threshold:
            message = f"📊 High API Usage Alert!\n\nEndpoint: {endpoint}\nRequests: {request_count}\nThreshold: {threshold}\nTime: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            
            self.send_slack_notification(message)

# Global notification service instance
notification_service = NotificationService()

def send_webhook_notification(event_type: str, data: Dict[str, Any]):
    """Send webhook notification to external systems"""
    webhook_urls = os.getenv('WEBHOOK_URLS', '').split(',')
    
    if not webhook_urls or webhook_urls == ['']:
        logger.info("No webhook URLs configured")
        return
    
    payload = {
        "event_type": event_type,
        "timestamp": datetime.now().isoformat(),
        "data": data
    }
    
    for webhook_url in webhook_urls:
        webhook_url = webhook_url.strip()
        if not webhook_url:
            continue
            
        try:
            response = requests.post(
                webhook_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"Webhook notification sent to {webhook_url}")
            else:
                logger.error(f"Failed to send webhook to {webhook_url}: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error sending webhook to {webhook_url}: {str(e)}")

# Example usage functions
def notify_training_event(event_type: str, job_data: Dict[str, Any]):
    """Unified function to handle training event notifications"""
    
    if event_type == "training_started":
        notification_service.notify_training_started(
            job_data.get('job_id'),
            job_data.get('model_name'),
            job_data.get('dataset_name')
        )
    elif event_type == "training_completed":
        notification_service.notify_training_completed(
            job_data.get('job_id'),
            job_data.get('model_name'),
            job_data.get('training_time'),
            job_data.get('accuracy')
        )
    elif event_type == "training_failed":
        notification_service.notify_training_failed(
            job_data.get('job_id'),
            job_data.get('model_name'),
            job_data.get('error_message')
        )
    elif event_type == "model_deployed":
        notification_service.notify_model_deployed(
            job_data.get('model_name'),
            job_data.get('endpoint_url')
        )
    
    # Also send webhook notification
    send_webhook_notification(event_type, job_data)