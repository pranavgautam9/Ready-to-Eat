import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Railway automatically provides DATABASE_URL when you add MySQL
    # Priority: Railway's DATABASE_URL > Custom DATABASE_URL > localhost fallback
    DATABASE_URL = os.environ.get('DATABASE_URL') or os.environ.get('MYSQL_URL')
    
    # If DATABASE_URL is not set, construct it from individual components
    if not DATABASE_URL:
        # Try to construct from Railway MySQL variables
        mysql_host = os.environ.get('MYSQL_HOST') or os.environ.get('MYSQLHOST')
        mysql_port = os.environ.get('MYSQL_PORT') or os.environ.get('MYSQLPORT', '3306')
        mysql_database = os.environ.get('MYSQL_DATABASE') or os.environ.get('MYSQLDATABASE', 'railway')
        mysql_user = os.environ.get('MYSQL_USER') or os.environ.get('MYSQLUSER', 'root')
        mysql_password = os.environ.get('MYSQL_PASSWORD') or os.environ.get('MYSQLPASSWORD')
        
        if mysql_host and mysql_password:
            DATABASE_URL = f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_database}"
        else:
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
