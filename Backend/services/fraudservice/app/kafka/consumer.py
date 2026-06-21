import json
import threading
import logging
from datetime import datetime
from kafka import KafkaConsumer
from app.config import KAFKA_BOOTSTRAP_SERVERS
from app.models.fraud_model import FraudDetector
from app.database.repository import save_score
from app.kafka.producer import publish_fraud_alert

logger = logging.getLogger(__name__)

class BalanceUpdateConsumer(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.daemon = True
        self.stop_event = threading.Event()
        self.detector = FraudDetector.get_instance()
        try:
            self.consumer = KafkaConsumer(
                'balance-updates',
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                group_id='fraud-service-group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest'
            )
            logger.info("Kafka Consumer initialized for balance-updates topic.")
        except Exception as e:
            logger.error(f"Failed to initialize Kafka Consumer: {e}")
            self.consumer = None

    def stop(self):
        self.stop_event.set()

    def run(self):
        if not self.consumer:
            return

        while not self.stop_event.is_set():
            try:
                # Poll for messages
                messages = self.consumer.poll(timeout_ms=1000)
                for tp, msgs in messages.items():
                    for msg in msgs:
                        self.process_message(msg.value)
            except Exception as e:
                logger.error(f"Error consuming message: {e}")

        self.consumer.close()
        logger.info("Kafka Consumer stopped.")

    def process_message(self, event):
        txn_id = event.get('transactionId')
        iban = event.get('iban')
        amount = event.get('amount')
        operation = event.get('operation')
        client_id = event.get('clientId')
        txn_type = event.get('transactionType')

        if not txn_id or not amount:
            return

        now = datetime.now()
        
        # Predict
        score, is_fraud, reason = self.detector.predict(
            amount=amount, 
            operation=operation, 
            txn_type=txn_type,
            hour_of_day=now.hour,
            day_of_week=now.weekday()
        )

        logger.info(f"Transaction {txn_id} scored: {score:.4f} (Fraud: {is_fraud})")

        # Save to DB
        save_score(txn_id, client_id, iban, amount, operation, txn_type, score, is_fraud, reason)

        # Publish alert
        alert_event = {
            "transactionId": txn_id,
            "clientId": client_id,
            "iban": iban,
            "amount": amount,
            "fraudScore": score,
            "isFraud": is_fraud,
            "reason": reason,
            "timestamp": now.isoformat()
        }
        publish_fraud_alert(alert_event)
