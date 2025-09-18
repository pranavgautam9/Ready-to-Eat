#!/usr/bin/env python3
"""
Script to set up the production database with initial data
Run this after deploying to Railway to initialize your database
"""

import os
import sys
import pymysql
from dotenv import load_dotenv

def setup_database():
    """Set up the production database with initial data"""
    
    # Load environment variables
    load_dotenv()
    
    # Get database connection details
    db_host = os.getenv('DB_HOST')
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_name = os.getenv('DB_NAME')
    
    if not all([db_host, db_user, db_password, db_name]):
        print("Error: Database environment variables not set!")
        print("Please set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME")
        return False
    
    try:
        # Connect to MySQL
        print("Connecting to database...")
        connection = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Read and execute setup.sql
            print("Reading database setup script...")
            with open('database/setup.sql', 'r', encoding='utf-8') as f:
                sql_script = f.read()
            
            # Split script into individual statements
            statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]
            
            print("Executing database setup...")
            for statement in statements:
                if statement:
                    cursor.execute(statement)
            
            connection.commit()
            print("Database setup completed successfully!")
            
    except Exception as e:
        print(f"Error setting up database: {e}")
        return False
    
    finally:
        if 'connection' in locals():
            connection.close()
    
    return True

if __name__ == "__main__":
    print("Setting up production database...")
    if setup_database():
        print("✅ Database setup completed!")
    else:
        print("❌ Database setup failed!")
        sys.exit(1)
