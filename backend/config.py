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
            # Clean the URL - remove any variable name prefix (e.g., "MYSQL_URL=")
            if '=' in mysql_url and mysql_url.startswith('MYSQL_URL='):
                mysql_url = mysql_url.split('=', 1)[1]
            
            # Convert mysql:// to mysql+pymysql:// for SQLAlchemy
            DATABASE_URL = mysql_url.replace('mysql://', 'mysql+pymysql://')
        else:
            # Fallback to localhost for development
            DATABASE_URL = 'mysql+pymysql://root:rootpassword@localhost/ready_to_eat'
    
    # Debug: Print the database URL (hide password for security)
    if DATABASE_URL and '@' in DATABASE_URL:
        # Hide password in logs
        parts = DATABASE_URL.split('@')
        if len(parts) == 2:
            user_pass = parts[0]
            if ':' in user_pass:
                user = user_pass.split(':')[0]
                safe_url = DATABASE_URL.replace(user_pass, f"{user}:***")
                print(f"Database URL: {safe_url}")
            else:
                print(f"Database URL: {DATABASE_URL}")
        else:
            print(f"Database URL: {DATABASE_URL}")
    else:
        print(f"Database URL: {DATABASE_URL}")
    
    # Debug: Print environment variables
    print(f"DATABASE_URL env: {'SET' if os.environ.get('DATABASE_URL') else 'NOT SET'}")
    print(f"MYSQL_URL env: {'SET' if os.environ.get('MYSQL_URL') else 'NOT SET'}")
    if os.environ.get('MYSQL_URL'):
        mysql_url = os.environ.get('MYSQL_URL')
        if '@' in mysql_url:
            parts = mysql_url.split('@')
            if len(parts) == 2:
                user_pass = parts[0]
                if ':' in user_pass:
                    user = user_pass.split(':')[0]
                    safe_mysql_url = mysql_url.replace(user_pass, f"{user}:***")
                    print(f"MYSQL_URL: {safe_mysql_url}")
                else:
                    print(f"MYSQL_URL: {mysql_url}")
            else:
                print(f"MYSQL_URL: {mysql_url}")
        else:
            print(f"MYSQL_URL: {mysql_url}")
    
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
