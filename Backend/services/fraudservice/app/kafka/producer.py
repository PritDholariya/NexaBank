import json
import logging
from kafka import KafkaProducer
from app.config import KAFKA_BOOTSTRAP_SERVERS

logger = logging.getLogger(__name__)
producer = None

def get_producer():
    global producer
    if not producer:
        try:
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            logger.info("Kafka Producer initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Kafka Producer: {e}")
    return producer

def publish_fraud_alert(event):
    p = get_producer()
    if p:
        p.send('fraud-alerts', value=event)
        p.flush()
        logger.info(f"Published FraudAlertEvent for transaction {event['transactionId']}")
