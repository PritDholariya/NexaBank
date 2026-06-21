import os
from dotenv import load_dotenv

load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://nexa:nexa_password@localhost:5433/nexa_bank")
FRAUD_THRESHOLD = float(os.getenv("FRAUD_THRESHOLD", "0.5"))
MODEL_PATH = os.getenv("MODEL_PATH", "ml/isolation_forest.pkl")
