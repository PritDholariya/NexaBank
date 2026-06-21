from fastapi import APIRouter, Header, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from app.schemas.fraud_schemas import FraudScoreResponse, RetrainResponse, HealthResponse
from app.database.repository import get_all_scores, get_scores_by_client, get_score_by_transaction, get_all_records_for_training
from app.models.fraud_model import FraudDetector

router = APIRouter(prefix="/api/fraud", tags=["Fraud Detection"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    # In a real app, you'd check DB and Kafka connections here
    return {"status": "UP", "kafkaConnected": True, "dbConnected": True}

@router.get("/scores", response_model=List[FraudScoreResponse])
def get_scores_admin(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    x_client_role: Optional[str] = Header(None, alias="X-Client-Role")
):
    if x_client_role != "ROLE_ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return get_all_scores(limit, offset)

@router.get("/scores/me", response_model=List[FraudScoreResponse])
def get_my_scores(
    x_client_id: Optional[str] = Header(None, alias="X-Client-Id")
):
    if not x_client_id:
        raise HTTPException(status_code=401, detail="Client ID required")
    
    return get_scores_by_client(x_client_id)

@router.get("/scores/{transaction_id}", response_model=FraudScoreResponse)
def get_score_by_txn(
    transaction_id: int,
    x_client_id: Optional[str] = Header(None, alias="X-Client-Id"),
    x_client_role: Optional[str] = Header(None, alias="X-Client-Role")
):
    if not x_client_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    score = get_score_by_transaction(transaction_id)
    if not score:
        raise HTTPException(status_code=404, detail="Fraud score not found")

    # Access control: Admin or the owner of the transaction
    if x_client_role != "ROLE_ADMIN" and score["clientId"] != x_client_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this transaction score")

    return score

@router.post("/retrain", response_model=RetrainResponse)
def retrain_model(
    x_client_role: Optional[str] = Header(None, alias="X-Client-Role")
):
    if x_client_role != "ROLE_ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    records = get_all_records_for_training()
    
    try:
        detector = FraudDetector.get_instance()
        num_samples = detector.retrain(records)
        return {
            "status": "SUCCESS",
            "samplesUsed": num_samples,
            "modelVersion": datetime.now().isoformat()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
