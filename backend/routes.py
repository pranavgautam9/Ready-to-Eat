from flask import Blueprint, request, jsonify, session
from models import db, User, Admin, Order, OrderItem, FoodItem
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

# Order-related endpoints
@api.route('/orders', methods=['GET'])
def get_orders():
    """Get all orders for the current user"""
    try:
        user_id = session.get('user_id')
        guest_id = session.get('guest_id')
        user_type = session.get('user_type')
        
        if user_type == 'guest' and guest_id:
            # For guest users, we'll return empty orders for now
            # In a real app, you might want to store guest orders temporarily
            return jsonify({'orders': []}), 200
        
        elif user_type == 'user' and user_id:
            # Get all orders for the authenticated user
            orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_time.desc()).all()
            return jsonify({'orders': [order.to_dict() for order in orders]}), 200
        
        else:
            return jsonify({'error': 'Not authenticated'}), 401
            
    except Exception as e:
        print(f"Get orders error: {str(e)}")
        return jsonify({'error': 'Failed to fetch orders'}), 500

@api.route('/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    try:
        user_id = session.get('user_id')
        guest_id = session.get('guest_id')
        user_type = session.get('user_type')
        
        if user_type not in ['user', 'guest']:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['items', 'total_amount', 'tax_amount', 'grand_total', 'points_earned', 'estimated_time', 'payment_method']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field.replace("_", " ").title()} is required'}), 400
        
        # Generate unique order number
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        # For guest users, we'll use a temporary user_id
        # In a real app, you might want to handle guest orders differently
        actual_user_id = user_id if user_type == 'user' else 1  # Using test user for guests
        
        # Create the order
        order = Order(
            order_number=order_number,
            user_id=actual_user_id,
            total_amount=data['total_amount'],
            tax_amount=data['tax_amount'],
            grand_total=data['grand_total'],
            points_earned=data['points_earned'],
            estimated_time=data['estimated_time'],
            payment_method=data['payment_method'],
            payment_details=data.get('payment_details', {})
        )
        
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        # Create order items
        for item in data['items']:
            food_item = FoodItem.query.get(item['foodId'])
            if not food_item:
                return jsonify({'error': f'Food item with ID {item["foodId"]} not found'}), 400
            
            order_item = OrderItem(
                order_id=order.id,
                food_id=item['foodId'],
                food_name=food_item.name,
                food_price=food_item.price,
                quantity=item['quantity'],
                has_extra=item.get('hasExtra', False),
                item_total=food_item.price * item['quantity']
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Create order error: {str(e)}")
        return jsonify({'error': 'Failed to create order'}), 500

@api.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order by ID"""
    try:
        user_id = session.get('user_id')
        guest_id = session.get('guest_id')
        user_type = session.get('user_type')
        
        if user_type not in ['user', 'guest']:
            return jsonify({'error': 'Not authenticated'}), 401
        
        # For guest users, we'll use a temporary user_id
        actual_user_id = user_id if user_type == 'user' else 1
        
        order = Order.query.filter_by(id=order_id, user_id=actual_user_id).first()
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({'order': order.to_dict()}), 200
        
    except Exception as e:
        print(f"Get order error: {str(e)}")
        return jsonify({'error': 'Failed to fetch order'}), 500

@api.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (for admin use)"""
    try:
        admin_id = session.get('admin_id')
        user_type = session.get('user_type')
        
        if user_type != 'admin' or not admin_id:
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['current', 'ready', 'completed']:
            return jsonify({'error': 'Invalid status'}), 400
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        order.status = new_status
        
        # Set timestamps based on status
        if new_status == 'ready' and not order.ready_time:
            order.ready_time = datetime.utcnow()
        elif new_status == 'completed' and not order.completed_time:
            order.completed_time = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Update order status error: {str(e)}")
        return jsonify({'error': 'Failed to update order status'}), 500

@api.route('/orders/update-status', methods=['POST'])
def update_order_statuses():
    """Update order statuses based on time (can be called by frontend or scheduled job)"""
    try:
        current_time = datetime.utcnow()
        updated_orders = []
        
        # Get all current orders
        current_orders = Order.query.filter_by(status='current').all()
        
        for order in current_orders:
            order_time = order.order_time
            elapsed_minutes = (current_time - order_time).total_seconds() / 60
            
            # If elapsed time >= estimated time, mark as ready
            if elapsed_minutes >= order.estimated_time:
                order.status = 'ready'
                if not order.ready_time:
                    order.ready_time = current_time
                order.updated_at = current_time
                updated_orders.append(order.id)
        
        # Get all ready orders that should become past orders (1 hour after ready)
        ready_orders = Order.query.filter_by(status='ready').all()
        
        for order in ready_orders:
            if order.ready_time:
                time_since_ready = (current_time - order.ready_time).total_seconds() / 60
                # Move to past orders after 1 hour of being ready
                if time_since_ready >= 60:
                    order.status = 'completed'
                    if not order.completed_time:
                        order.completed_time = current_time
                    order.updated_at = current_time
                    updated_orders.append(order.id)
        
        if updated_orders:
            db.session.commit()
            return jsonify({
                'message': f'Updated {len(updated_orders)} orders',
                'updated_order_ids': updated_orders
            }), 200
        else:
            return jsonify({
                'message': 'No orders needed updating',
                'updated_order_ids': []
            }), 200
            
    except Exception as e:
        db.session.rollback()
        print(f"Update order statuses error: {str(e)}")
        return jsonify({'error': 'Failed to update order statuses'}), 500

@api.route('/user/points', methods=['GET'])
def get_user_points():
    """Get total points for the current user"""
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if user_type != 'user' or not user_id:
            return jsonify({'error': 'Not authenticated as user'}), 401
        
        # Get user from database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Return the points from the users table
        return jsonify({'points': user.points or 0}), 200
        
    except Exception as e:
        print(f"Error fetching user points: {str(e)}")
        return jsonify({'error': f'Failed to fetch points: {str(e)}'}), 500

@api.route('/user/points', methods=['PUT'])
def update_user_points():
    """Update user points (for reward redemption)"""
    try:
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if user_type != 'user' or not user_id:
            return jsonify({'error': 'Not authenticated as user'}), 401
        
        data = request.get_json()
        new_points = data.get('points')
        
        if new_points is None or new_points < 0:
            return jsonify({'error': 'Invalid points value'}), 400
        
        # Update user points in the database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.points = new_points
        db.session.commit()
        
        return jsonify({'message': 'Points updated successfully', 'points': new_points}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Update user points error: {str(e)}")
        return jsonify({'error': 'Failed to update user points'}), 500

@api.route('/food-items', methods=['GET'])
def get_food_items():
    """Get all available food items"""
    try:
        food_items = FoodItem.query.filter_by(is_available=True).all()
        return jsonify({'food_items': [item.to_dict() for item in food_items]}), 200
        
    except Exception as e:
        print(f"Get food items error: {str(e)}")
        return jsonify({'error': 'Failed to fetch food items'}), 500
