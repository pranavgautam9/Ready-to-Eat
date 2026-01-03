#!/usr/bin/env python3
"""
Script to set up the production database with test user, orders, and order items.
This ensures the database has the correct test data.

Usage:
    python setup_production_db.py
"""

import sys
import os
from datetime import datetime, timedelta

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from backend.models import db, User, Admin, Order, OrderItem, FoodItem
from backend.config import Config
from flask import Flask

def create_app_for_script():
    """Create a Flask app context for database operations"""
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

def setup_database():
    """Set up the database with test user, orders, and order items"""
    app = create_app_for_script()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created/verified")
        
        # Set up test user
        test_user = User.query.filter_by(email='testuser@gmail.com').first()
        if test_user:
            print(f"📝 Updating existing test user (ID: {test_user.id})")
            test_user.first_name = 'Test'
            test_user.last_name = 'User'
            test_user.mobile = '7894561230'
            test_user.points = 13
            test_user.set_password('Password123!')
        else:
            print("➕ Creating new test user")
            test_user = User(
                first_name='Test',
                last_name='User',
                email='testuser@gmail.com',
                mobile='7894561230',
                points=13
            )
            test_user.set_password('Password123!')
            db.session.add(test_user)
        
        db.session.flush()  # Get the user ID
        
        # Ensure user has ID 1 (for consistency with orders)
        if test_user.id != 1:
            print(f"⚠️  Warning: Test user ID is {test_user.id}, but orders reference ID 1")
            print("   You may need to update order user_id references")
        
        user_id = test_user.id
        db.session.commit()
        print(f"✅ Test user set up: {test_user.email} (ID: {user_id}, Points: {test_user.points})")
        
        # Set up test admin
        test_admin = Admin.query.filter_by(username='admin').first()
        if not test_admin:
            print("➕ Creating test admin")
            test_admin = Admin(
                username='admin',
                full_name='System Administrator',
                role='super_admin'
            )
            test_admin.set_password('Admin123!')
            db.session.add(test_admin)
            db.session.commit()
            print("✅ Test admin created")
        else:
            print("✅ Test admin already exists")
        
        # Ensure food items exist (they should be created by app.py, but let's verify)
        food_items_needed = {
            1: {'name': 'Samosa', 'price': 15.00},
            6: {'name': 'Veg Burger', 'price': 50.00},
            9: {'name': 'Cup of Tea', 'price': 10.00},
            10: {'name': 'Cold Coffee', 'price': 20.00}
        }
        
        for food_id, food_data in food_items_needed.items():
            food_item = FoodItem.query.get(food_id)
            if not food_item:
                print(f"⚠️  Warning: Food item ID {food_id} ({food_data['name']}) not found")
                print("   Make sure food items are created first")
        
        # Set up Order 1: Samosa (2x) + Tea (1x)
        order1 = Order.query.filter_by(order_number='ORD-20240101-ABC123').first()
        if order1:
            print("📝 Updating existing Order 1")
            order1.user_id = user_id
            order1.total_amount = 40.00
            order1.tax_amount = 2.00
            order1.grand_total = 42.00
            order1.points_earned = 4
            order1.estimated_time = 15
            order1.status = 'completed'
            order1.payment_method = 'cash'
            order1.order_time = datetime.utcnow() - timedelta(days=2)
        else:
            print("➕ Creating Order 1")
            order1 = Order(
                order_number='ORD-20240101-ABC123',
                user_id=user_id,
                total_amount=40.00,
                tax_amount=2.00,
                grand_total=42.00,
                points_earned=4,
                estimated_time=15,
                status='completed',
                payment_method='cash',
                order_time=datetime.utcnow() - timedelta(days=2)
            )
            db.session.add(order1)
        
        db.session.flush()  # Get order ID
        
        # Set up Order 1 items
        # Delete existing items for this order
        OrderItem.query.filter_by(order_id=order1.id).delete()
        
        order1_items = [
            OrderItem(order_id=order1.id, food_id=1, food_name='Samosa', food_price=15.00, quantity=2, has_extra=False, item_total=30.00),
            OrderItem(order_id=order1.id, food_id=9, food_name='Cup of Tea', food_price=10.00, quantity=1, has_extra=False, item_total=10.00)
        ]
        for item in order1_items:
            db.session.add(item)
        
        print(f"✅ Order 1 set up: {order1.order_number} with {len(order1_items)} items")
        
        # Set up Order 2: Veg Burger (1x) + Cold Coffee (2x)
        order2 = Order.query.filter_by(order_number='ORD-20240102-XYZ789').first()
        if order2:
            print("📝 Updating existing Order 2")
            order2.user_id = user_id
            order2.total_amount = 90.00
            order2.tax_amount = 4.50
            order2.grand_total = 94.50
            order2.points_earned = 9
            order2.estimated_time = 20
            order2.status = 'ready'
            order2.payment_method = 'card'
            order2.order_time = datetime.utcnow() - timedelta(days=1)
        else:
            print("➕ Creating Order 2")
            order2 = Order(
                order_number='ORD-20240102-XYZ789',
                user_id=user_id,
                total_amount=90.00,
                tax_amount=4.50,
                grand_total=94.50,
                points_earned=9,
                estimated_time=20,
                status='ready',
                payment_method='card',
                order_time=datetime.utcnow() - timedelta(days=1)
            )
            db.session.add(order2)
        
        db.session.flush()  # Get order ID
        
        # Set up Order 2 items
        # Delete existing items for this order
        OrderItem.query.filter_by(order_id=order2.id).delete()
        
        order2_items = [
            OrderItem(order_id=order2.id, food_id=6, food_name='Veg Burger', food_price=50.00, quantity=1, has_extra=False, item_total=50.00),
            OrderItem(order_id=order2.id, food_id=10, food_name='Cold Coffee', food_price=20.00, quantity=2, has_extra=False, item_total=40.00)
        ]
        for item in order2_items:
            db.session.add(item)
        
        print(f"✅ Order 2 set up: {order2.order_number} with {len(order2_items)} items")
        
        # Commit all changes
        db.session.commit()
        
        print("\n" + "="*60)
        print("✅ Database setup complete!")
        print("="*60)
        print(f"\nTest User:")
        print(f"  Email: testuser@gmail.com")
        print(f"  Password: Password123!")
        print(f"  Points: {test_user.points}")
        print(f"\nOrders created:")
        print(f"  Order 1: {order1.order_number} (Status: {order1.status})")
        print(f"  Order 2: {order2.order_number} (Status: {order2.status})")
        print("\n")

if __name__ == '__main__':
    try:
        setup_database()
    except Exception as e:
        print(f"\n❌ Error setting up database: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
