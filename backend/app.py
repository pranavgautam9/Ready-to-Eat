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
    
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=15)
    is_production = os.environ.get('FLASK_ENV') == 'production'
    app.config['SESSION_COOKIE_SECURE'] = is_production
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None' if is_production else 'Lax'
    app.config['SESSION_COOKIE_DOMAIN'] = None
    db.init_app(app)
    allowed_origins = [
        'http://localhost:3000',
        'https://pranavgautam.com',
    ]
    CORS(app, supports_credentials=True, origins=allowed_origins)
    app.register_blueprint(api, url_prefix='/api')
    with app.app_context():
        db.create_all()
        test_user = User.query.filter_by(email='testuser@gmail.com').first()
        if not test_user:
            test_user = User(
                first_name='Test',
                last_name='User',
                email='testuser@gmail.com',
                mobile='7894561230',
                points=13
            )
            test_user.set_password('Password123!')
            db.session.add(test_user)
            db.session.commit()
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
    
    @app.route('/')
    def index():
        return {'message': 'Ready-to-Eat API is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
