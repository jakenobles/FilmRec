import os
import psycopg2

#Environment Variables
# Database connection parameters should be in environment variables or a config file
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

class DB:
    # Establish conneciton with our database
    @staticmethod
    def get_db_connection():
        return psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD)

    #Reusable method that allows queries to run through to DB
    @staticmethod
    def execute_db_query(query, params=None):
        with DB.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, params)
                return cur.fetchall()  # Returns a list of rows

    #Reusable method that allows queries to run through to DB
    @staticmethod
    def execute_db_insert(query, params=None):
        with DB.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, params)