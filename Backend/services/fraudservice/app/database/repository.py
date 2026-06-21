from app.database.connection import get_connection, release_connection
import logging

logger = logging.getLogger(__name__)

def create_table_if_not_exists():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS fraud_scores (
                    id SERIAL PRIMARY KEY,
                    transaction_id BIGINT,
                    client_id VARCHAR(255),
                    iban VARCHAR(255),
                    amount DECIMAL(15, 2),
                    operation VARCHAR(50),
                    transaction_type VARCHAR(50),
                    fraud_score DOUBLE PRECISION,
                    is_fraud BOOLEAN,
                    reason TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            logger.info("fraud_scores table ensured in DB.")
    except Exception as e:
        logger.error(f"Failed to create table: {e}")
        conn.rollback()
    finally:
        release_connection(conn)

def save_score(txn_id, client_id, iban, amount, operation, txn_type, score, is_fraud, reason):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO fraud_scores 
                (transaction_id, client_id, iban, amount, operation, transaction_type, fraud_score, is_fraud, reason)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (txn_id, client_id, iban, amount, operation, txn_type, score, is_fraud, reason))
            conn.commit()
            return cur.fetchone()[0]
    except Exception as e:
        logger.error(f"Failed to save score: {e}")
        conn.rollback()
        raise e
    finally:
        release_connection(conn)

def get_all_scores(limit=50, offset=0):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT transaction_id, client_id, iban, amount, fraud_score, is_fraud, reason, created_at
                FROM fraud_scores
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s;
            """, (limit, offset))
            rows = cur.fetchall()
            return [{"transactionId": r[0], "clientId": r[1], "iban": r[2], "amount": r[3], 
                     "fraudScore": r[4], "isFraud": r[5], "reason": r[6], "createdAt": r[7]} for r in rows]
    finally:
        release_connection(conn)

def get_scores_by_client(client_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT transaction_id, client_id, iban, amount, fraud_score, is_fraud, reason, created_at
                FROM fraud_scores
                WHERE client_id = %s
                ORDER BY created_at DESC;
            """, (client_id,))
            rows = cur.fetchall()
            return [{"transactionId": r[0], "clientId": r[1], "iban": r[2], "amount": r[3], 
                     "fraudScore": r[4], "isFraud": r[5], "reason": r[6], "createdAt": r[7]} for r in rows]
    finally:
        release_connection(conn)

def get_score_by_transaction(txn_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT transaction_id, client_id, iban, amount, fraud_score, is_fraud, reason, created_at
                FROM fraud_scores
                WHERE transaction_id = %s;
            """, (txn_id,))
            r = cur.fetchone()
            if r:
                return {"transactionId": r[0], "clientId": r[1], "iban": r[2], "amount": r[3], 
                        "fraudScore": r[4], "isFraud": r[5], "reason": r[6], "createdAt": r[7]}
            return None
    finally:
        release_connection(conn)

def get_all_records_for_training():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT amount, operation, transaction_type, EXTRACT(HOUR FROM created_at) as hour_of_day, EXTRACT(DOW FROM created_at) as day_of_week
                FROM fraud_scores;
            """)
            rows = cur.fetchall()
            return [{"amount": r[0], "operation": r[1], "transaction_type": r[2], "hour_of_day": int(r[3]), "day_of_week": int(r[4])} for r in rows]
    finally:
        release_connection(conn)
