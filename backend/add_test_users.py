from app import app, get_db_connection, init_database
from werkzeug.security import generate_password_hash
from mysql.connector import Error

def add_test_users():
    # First initialize the database
    print("Initializing database...")
    init_database()
    
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database")
        return
    
    cursor = connection.cursor()
    
    # Add test users
    test_users = [
        ('John Doe', 'john@example.com', 'password123', 'user'),
        ('Jane Smith', 'jane@example.com', 'password123', 'user'),
        ('Admin User', 'admin@example.com', 'admin123', 'admin')
    ]
    
    for name, email, password, role in test_users:
        hashed_password = generate_password_hash(password)
        try:
            cursor.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)", 
                       (name, email, hashed_password, role))
            print(f"Added user: {name} ({email})")
        except Error as e:
            print(f"Error adding {name}: {e}")
    
    # Add test admins
    test_admins = [
        ('admin001', 'admin123', 'Super Admin'),
        ('admin002', 'admin456', 'Cafeteria Manager')
    ]
    
    for admin_id, password, name in test_admins:
        hashed_password = generate_password_hash(password)
        try:
            cursor.execute("INSERT INTO admins (admin_id, password, name) VALUES (%s, %s, %s)", 
                       (admin_id, hashed_password, name))
            print(f"Added admin: {name} (ID: {admin_id})")
        except Error as e:
            print(f"Error adding admin {name}: {e}")
    
    connection.commit()
    cursor.close()
    connection.close()
    print("\nTest users added successfully!")
    print("\nTest Credentials:")
    print("User Login:")
    print("- Email: john@example.com, Password: password123")
    print("- Email: jane@example.com, Password: password123")
    print("\nAdmin Login:")
    print("- Admin ID: admin001, Password: admin123")
    print("- Admin ID: admin002, Password: admin456")

if __name__ == '__main__':
    add_test_users()