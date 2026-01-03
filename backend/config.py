import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if not DATABASE_URL:
        mysql_url = os.environ.get('MYSQL_URL')
        if mysql_url:
            DATABASE_URL = mysql_url.replace('mysql://', 'mysql+pymysql://')
        else:
            DATABASE_URL = 'mysql+pymysql://root:rootpassword@localhost/ready_to_eat'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True
    }
    DB_HOST = os.environ.get('DB_HOST', os.environ.get('MYSQL_HOST', 'localhost'))
    DB_USER = os.environ.get('DB_USER', os.environ.get('MYSQL_USER', 'root'))
    DB_PASSWORD = os.environ.get('DB_PASSWORD', os.environ.get('MYSQL_PASSWORD', 'rootpassword'))
    DB_NAME = os.environ.get('DB_NAME', os.environ.get('MYSQL_DATABASE', 'ready_to_eat'))
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
