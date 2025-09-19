import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Railway MySQL connection configuration
    # Priority: DATABASE_URL > MYSQL_URL (converted to PyMySQL) > localhost fallback
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # If DATABASE_URL is not set, try to convert MYSQL_URL to PyMySQL format
    if not DATABASE_URL:
        mysql_url = os.environ.get('MYSQL_URL')
        if mysql_url:
            # Convert mysql:// to mysql+pymysql:// for SQLAlchemy
            DATABASE_URL = mysql_url.replace('mysql://', 'mysql+pymysql://')
        else:
            # Fallback to localhost for development
            DATABASE_URL = 'mysql+pymysql://root:rootpassword@localhost/ready_to_eat'
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True
    }
    
    # Database connection parameters for direct MySQL access
    DB_HOST = os.environ.get('DB_HOST', os.environ.get('MYSQL_HOST', 'localhost'))
    DB_USER = os.environ.get('DB_USER', os.environ.get('MYSQL_USER', 'root'))
    DB_PASSWORD = os.environ.get('DB_PASSWORD', os.environ.get('MYSQL_PASSWORD', 'rootpassword'))
    DB_NAME = os.environ.get('DB_NAME', os.environ.get('MYSQL_DATABASE', 'ready_to_eat'))
    
    # Production settings
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
