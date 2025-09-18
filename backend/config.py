import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Railway automatically provides DATABASE_URL when you add MySQL
    # Priority: Railway's DATABASE_URL > Custom DATABASE_URL > localhost fallback
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get('DATABASE_URL') or  # Railway's automatic DATABASE_URL
        os.environ.get('MYSQL_URL') or     # Alternative Railway variable
        'mysql+pymysql://root:rootpassword@localhost/ready_to_eat'
    )
    
    # Debug: Print database URI (without password for security)
    @classmethod
    def print_db_info(cls):
        db_uri = cls.SQLALCHEMY_DATABASE_URI
        # Hide password in logs
        if '@' in db_uri and ':' in db_uri:
            parts = db_uri.split('@')
            if len(parts) == 2:
                user_pass = parts[0]
                if ':' in user_pass:
                    user = user_pass.split(':')[0]
                    safe_uri = db_uri.replace(user_pass, f"{user}:***")
                    print(f"Database URI: {safe_uri}")
                else:
                    print(f"Database URI: {db_uri}")
            else:
                print(f"Database URI: {db_uri}")
        else:
            print(f"Database URI: {db_uri}")
        
        # Print environment variables for debugging
        print(f"DATABASE_URL env var: {'SET' if os.environ.get('DATABASE_URL') else 'NOT SET'}")
        print(f"MYSQL_URL env var: {'SET' if os.environ.get('MYSQL_URL') else 'NOT SET'}")
        print(f"MYSQL_HOST env var: {'SET' if os.environ.get('MYSQL_HOST') else 'NOT SET'}")
        print(f"FLASK_ENV: {os.environ.get('FLASK_ENV', 'NOT SET')}")
    
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
