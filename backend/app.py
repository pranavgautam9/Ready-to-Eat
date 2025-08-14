from flask import Flask, session
from flask_cors import CORS
from models import db, User
from routes import api
from config import Config
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS
    CORS(app, supports_credentials=True, origins=['http://localhost:3000'])
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
        # Add test user if it doesn't exist
        test_user = User.query.filter_by(email='pranavgautam27@gmail.com').first()
        if not test_user:
            test_user = User(
                first_name='Pranav',
                last_name='Gautam',
                email='pranavgautam27@gmail.com',
                mobile='3527406203'
            )
            test_user.set_password('Password123!')
            db.session.add(test_user)
            db.session.commit()
            print("Test user created successfully!")
    
    @app.route('/')
    def index():
        return {'message': 'Ready-to-Eat API is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
