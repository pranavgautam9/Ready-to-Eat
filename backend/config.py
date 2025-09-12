import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql+pymysql://root:rootpassword@localhost/ready_to_eat'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True
    }
    
    # Database connection parameters for direct MySQL access
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASSWORD = 'rootpassword'
    DB_NAME = 'ready_to_eat'
