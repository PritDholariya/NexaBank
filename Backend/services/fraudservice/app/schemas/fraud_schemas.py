from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FraudScoreResponse(BaseModel):
    transactionId: int
    clientId: Optional[str] = None
    iban: str
    amount: float
    fraudScore: float
    isFraud: bool
    reason: str
    createdAt: datetime

class RetrainResponse(BaseModel):
    status: str
    samplesUsed: int
    modelVersion: str

class HealthResponse(BaseModel):
    status: str
    kafkaConnected: bool
    dbConnected: bool
