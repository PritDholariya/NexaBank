import psycopg2
from psycopg2 import pool
from app.config import DATABASE_URL
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a connection pool
try:
    connection_pool = psycopg2.pool.SimpleConnectionPool(1, 10, DATABASE_URL)
    if connection_pool:
        logger.info("Connection pool created successfully")
except Exception as e:
    logger.error(f"Error creating connection pool: {e}")
    connection_pool = None

def get_connection():
    if connection_pool:
        return connection_pool.getconn()
    raise Exception("Database connection pool is not initialized")

def release_connection(conn):
    if connection_pool and conn:
        connection_pool.putconn(conn)
