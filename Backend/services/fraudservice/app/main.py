from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging

from app.database.repository import create_table_if_not_exists
from app.kafka.consumer import BalanceUpdateConsumer
from app.routes.fraud_routes import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

consumer_thread = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Starting up Fraud Detection Service...")
    
    # 1. Initialize Database
    create_table_if_not_exists()
    
    # 2. Start Kafka Consumer in a background thread
    global consumer_thread
    consumer_thread = BalanceUpdateConsumer()
    consumer_thread.start()
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down Fraud Detection Service...")
    if consumer_thread:
        consumer_thread.stop()
        consumer_thread.join()

app = FastAPI(
    title="NexaBank Fraud Detection Service",
    description="AI-powered fraud detection using Isolation Forest",
    version="1.0.0",
    lifespan=lifespan
)

# Register routes
app.include_router(router)
