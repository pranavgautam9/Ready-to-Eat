from flask import Blueprint, request, jsonify, session
from models import db, User, Admin
from werkzeug.security import generate_password_hash
import re
import uuid
from datetime import datetime, timedelta

api = Blueprint('api', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'password', 'mobile']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid_password, password_message = validate_password(data['password'])
        if not is_valid_password:
            return jsonify({'error': password_message}), 400
        
        # Validate mobile number (basic validation)
        if not re.match(r'^\d{10,15}$', data['mobile']):
            return jsonify({'error': 'Invalid mobile number format'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            mobile=data['mobile']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Set session
        session['user_id'] = user.id
        session['user_type'] = 'user'
        session.permanent = True  # Enable session persistence (15 days)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Set session with persistence for regular users
        session['user_id'] = user.id
        session['user_type'] = 'user'
        session.permanent = True  # Enable session persistence (15 days)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # Add logging for debugging
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@api.route('/logout', methods=['POST'])
def logout():
    # Clear all session data
    session.pop('user_id', None)
    session.pop('admin_id', None)
    session.pop('guest_id', None)
    session.pop('user_type', None)
    return jsonify({'message': 'Logged out successfully'}), 200

@api.route('/user/profile', methods=['GET'])
def get_user_profile():
    user_id = session.get('user_id')
    admin_id = session.get('admin_id')
    guest_id = session.get('guest_id')
    user_type = session.get('user_type')
    
    if user_type == 'admin' and admin_id:
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404
        return jsonify({'user': admin.to_dict()}), 200
    
    elif user_type == 'guest' and guest_id:
        # Return guest user data
        guest_user = {
            'id': guest_id,
            'first_name': 'Guest',
            'last_name': 'User',
            'email': f'{guest_id}@guest.local',
            'mobile': 'N/A',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'is_guest': True
        }
        return jsonify({'user': guest_user}), 200
    
    elif user_type == 'user' and user_id:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    
    else:
        return jsonify({'error': 'Not authenticated'}), 401

@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Ready-to-Eat API is running'}), 200

@api.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find admin by username
        admin = Admin.query.filter_by(username=data['username']).first()
        
        if not admin or not admin.check_password(data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Set admin session with longer expiry
        session['admin_id'] = admin.id
        session['user_type'] = 'admin'
        session.permanent = True  # Enable session persistence
        
        return jsonify({
            'message': 'Admin login successful',
            'admin': admin.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Admin login error: {str(e)}")
        return jsonify({'error': f'Admin login failed: {str(e)}'}), 500

@api.route('/guest/access', methods=['POST'])
def guest_access():
    try:
        # Generate unique guest ID
        guest_id = f"guest_{uuid.uuid4().hex[:8]}"
        
        # Create guest session (will be destroyed when browser closes)
        session['guest_id'] = guest_id
        session['user_type'] = 'guest'
        session.permanent = False  # Session ends when browser closes
        
        # Create temporary guest user data
        guest_user = {
            'id': guest_id,
            'first_name': 'Guest',
            'last_name': 'User',
            'email': f'{guest_id}@guest.local',
            'mobile': 'N/A',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'is_guest': True
        }
        
        return jsonify({
            'message': 'Guest access granted',
            'user': guest_user
        }), 200
        
    except Exception as e:
        print(f"Guest access error: {str(e)}")
        return jsonify({'error': f'Guest access failed: {str(e)}'}), 500

@api.route('/admin/profile', methods=['GET'])
def get_admin_profile():
    admin_id = session.get('admin_id')
    user_type = session.get('user_type')
    
    if not admin_id or user_type != 'admin':
        return jsonify({'error': 'Not authenticated as admin'}), 401
    
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    
    return jsonify({'admin': admin.to_dict()}), 200
