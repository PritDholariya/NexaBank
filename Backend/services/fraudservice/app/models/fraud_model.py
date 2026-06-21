import joblib
import pandas as pd
from datetime import datetime
import logging
from app.config import MODEL_PATH, FRAUD_THRESHOLD

logger = logging.getLogger(__name__)

class FraudDetector:
    _instance = None

    def __init__(self):
        self.model = None
        self.load_model()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_model(self):
        try:
            self.model = joblib.load(MODEL_PATH)
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model from {MODEL_PATH}: {e}")
            self.model = None

    def predict(self, amount, operation, txn_type, hour_of_day, day_of_week):
        if not self.model:
            logger.error("Model not loaded, defaulting to safe.")
            return 0.0, False, "Model unavailable"

        # Preprocess features
        op_encoded = 0 if operation == 'CREDIT' else 1
        type_encoded = 0 if txn_type == 'DEPOSIT' else (1 if txn_type == 'WITHDRAWAL' else 2)

        df = pd.DataFrame([{
            'amount': float(amount),
            'operation_encoded': op_encoded,
            'type_encoded': type_encoded,
            'hour_of_day': int(hour_of_day),
            'day_of_week': int(day_of_week)
        }])

        # Predict
        # Isolation Forest returns -1 for outliers and 1 for inliers.
        # decision_function returns average anomaly score, typically negative for outliers.
        raw_score = self.model.decision_function(df)[0]
        
        # Normalize score to 0.0 - 1.0. Lower raw score = higher fraud probability.
        # We'll map something like [-0.3, 0.3] to [1.0, 0.0]
        # This is a simple linear scaling for demonstration.
        normalized_score = 0.5 - (raw_score * 2) 
        normalized_score = max(0.0, min(1.0, float(normalized_score)))

        is_fraud = normalized_score >= FRAUD_THRESHOLD

        reason = "Normal transaction"
        if is_fraud:
            if amount > 5000:
                reason = "Unusually high amount for this profile"
            elif hour_of_day < 6 or hour_of_day > 22:
                reason = "Transaction occurred during unusual hours"
            else:
                reason = "Anomaly detected by ML model"

        return normalized_score, is_fraud, reason

    def retrain(self, records):
        from sklearn.ensemble import IsolationForest
        if not records or len(records) < 100:
            raise ValueError("Not enough records to retrain (need at least 100).")

        df = pd.DataFrame(records)
        df['operation_encoded'] = df['operation'].map({'CREDIT': 0, 'DEBIT': 1})
        df['type_encoded'] = df['transaction_type'].map({'DEPOSIT': 0, 'WITHDRAWAL': 1, 'TRANSFER': 2})
        
        X = df[['amount', 'operation_encoded', 'type_encoded', 'hour_of_day', 'day_of_week']]

        logger.info(f"Retraining model on {len(X)} records...")
        new_model = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
        new_model.fit(X)

        joblib.dump(new_model, MODEL_PATH)
        self.model = new_model # Hot reload
        logger.info("Model retrained and saved.")
        
        return len(X)
