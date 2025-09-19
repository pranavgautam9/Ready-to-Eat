from flask import Flask, session
from flask_cors import CORS
from models import db, User, Admin
from routes import api
from config import Config
import os
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure session persistence (15 days)
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=15)
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS - allow both development and production origins
    allowed_origins = [
        'http://localhost:3000',
        'https://pranavgautam9.github.io',  # Replace with your actual GitHub Pages URL
        'https://pranavgautam.com'  # Replace with your custom domain if you have one
    ]
    CORS(app, supports_credentials=True, origins=allowed_origins)
    
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
        
        # Add test admin if it doesn't exist
        test_admin = Admin.query.filter_by(username='admin').first()
        if not test_admin:
            test_admin = Admin(
                username='admin',
                full_name='System Administrator',
                role='super_admin'
            )
            test_admin.set_password('Admin123!')
            db.session.add(test_admin)
            db.session.commit()
            print("Test admin created successfully!")
    
    @app.route('/')
    def index():
        return {'message': 'Ready-to-Eat API is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
