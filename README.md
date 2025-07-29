# Ready-to-Eat Cafeteria Management System

A modern cafeteria management system with user authentication, built with React frontend and Flask backend.

## Features

- User and Admin authentication
- Modern, responsive UI with beautiful gradient design
- MySQL database integration
- Secure password hashing
- Error handling and validation
- Real-time form validation and error messages
- Guest login option

## Project Structure

```
Ready-to-Eat/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginScreen.js
│   │   │   ├── LoginScreen.css
│   │   │   ├── HomeScreen.js
│   │   │   └── HomeScreen.css
│   │   ├── assets/
│   │   │   ├── MediCaps-Logo-no-bg.png
│   │   │   └── MediCaps-Logo.png
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── package.json
├── backend/           # Flask backend
│   ├── app.py
│   ├── requirements.txt
│   ├── add_test_users.py
│   ├── app_sqlite.py (alternative SQLite version)
│   ├── add_test_users_sqlite.py
│   └── venv/ (virtual environment)
└── README.md
```

## Quick Start Guide

### Prerequisites

1. **MySQL Server** - Make sure MySQL is installed and running
2. **Python 3.7+** - For the Flask backend
3. **Node.js 14+** - For the React frontend

### Step-by-Step Setup

#### 1. Start MySQL Server
```bash
# Windows
# Open services.msc and start MySQL80 if not running already
# Or check if MySQL is running:
net start | findstr MySQL

# macOS/Linux
sudo systemctl start mysql
# or
sudo service mysql start
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and add test users
python add_test_users.py

# Run the backend server
python app.py
```

**Expected Output:**
```
Initializing database...
Database and tables created successfully!
Added user: John Doe (john@example.com)
Added user: Jane Smith (jane@example.com)
Added user: Admin User (admin@example.com)
Added admin: Super Admin (ID: admin001)
Added admin: Cafeteria Manager (ID: admin002)

Test users added successfully!
```

Then:
```
Database and tables created successfully!
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

#### 3. Frontend Setup

Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view ready-to-eat in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Testing the Application

### 1. Test Backend Connection
Open your browser and go to: `http://localhost:5000/api/test`
You should see: `{"message": "Backend is working!"}`

### 2. Test User Login
1. Open `http://localhost:3000` in your browser
2. You should see the login screen with "Ready-to-Eat" title and Medi-Caps University logo
3. Try logging in with test credentials:
   - **Email:** `john@example.com`
   - **Password:** `password123`
4. Click "Login" button
5. You should be redirected to the home screen showing user information

### 3. Test Admin Login
1. On the login screen, click the "Admin Login" tab
2. Try logging in with admin credentials:
   - **Admin ID:** `admin001`
   - **Password:** `admin123`
3. Click "Admin Login" button
4. You should be redirected to the home screen

### 4. Test Invalid Credentials
1. Try logging in with wrong password
2. You should see "Invalid credentials" error message

### 5. Test User Registration
1. Click "Create New Account" on the login screen
2. Fill in the registration form:
   - **Full Name:** `Test User`
   - **Email:** `test@example.com`
   - **Password:** `test123`
   - **Confirm Password:** `test123`
3. Click "Register"
4. You should see a success message and be redirected to login
5. Try logging in with the new credentials

## Database Configuration

### MySQL Configuration
The backend is configured to connect to MySQL with these settings:
- **Host:** localhost
- **User:** root
- **Password:** Secreterrier2!@# (as configured in your setup)
- **Database:** ready_to_eat_db

If you need to change the MySQL password, update it in `backend/app.py`:
```python
MYSQL_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_new_password',
    'database': 'ready_to_eat_db'
}
```

### Alternative: SQLite Setup
If you prefer to use SQLite instead of MySQL (no installation required):
```bash
cd backend
venv\Scripts\activate
python add_test_users_sqlite.py
python app_sqlite.py
```

## Database Verification

### Check Database in MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. You should see a database called `ready_to_eat_db`
4. Check the tables:
   - `users` table - contains registered users
   - `admins` table - contains admin accounts

### Manual Database Commands
```sql
-- View all users
SELECT * FROM ready_to_eat_db.users;

-- View all admins
SELECT * FROM ready_to_eat_db.admins;

-- Add a new user manually
INSERT INTO ready_to_eat_db.users (name, email, password, role) 
VALUES ('Manual User', 'manual@example.com', 'hashed_password', 'user');
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Backend Won't Start
**Error:** `ModuleNotFoundError: No module named 'flask'`
**Solution:**
```bash
cd backend
venv\Scripts\activate  # Make sure virtual environment is activated
pip install -r requirements.txt
```

#### 2. Database Connection Error
**Error:** `Access denied for user 'root'@'localhost'`
**Solution:**
- Make sure MySQL server is running
- Check MySQL credentials in `backend/app.py`
- Update password if needed in the MYSQL_CONFIG section

#### 3. Frontend Won't Start
**Error:** `'react-scripts' is not recognized`
**Solution:**
```bash
cd frontend
npm install
npm start
```

#### 4. CORS Error
**Error:** `Access to fetch at 'http://localhost:5000/api/login' from origin 'http://localhost:3000' has been blocked`
**Solution:**
- Make sure backend is running on port 5000
- Check that Flask-CORS is installed and configured

#### 5. Port Already in Use
**Error:** `Port 3000 is already in use`
**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000
# or
lsof -ti:3000 | xargs kill -9
```

#### 6. Virtual Environment Issues
**Error:** `'venv' is not recognized`
**Solution:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 7. MySQL Import Issues
**Error:** `Import "flask_mysqldb" could not be resolved`
**Solution:**
The project now uses `mysql-connector-python` instead of `Flask-MySQLdb` for better Windows compatibility.

## Development Commands

### Backend Development
```bash
cd backend
venv\Scripts\activate
python app.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### Add Test Users
```bash
cd backend
venv\Scripts\activate
python add_test_users.py
```

### Check Database
```bash
# Connect to MySQL
mysql -u root -p
USE ready_to_eat_db;
SHOW TABLES;
SELECT * FROM users;
```

## API Endpoints

- `POST /api/login` - User login
- `POST /api/admin/login` - Admin login
- `POST /api/register` - User registration
- `GET /api/test` - Test endpoint

## Test Credentials

### Users
- **Email:** `john@example.com`, **Password:** `password123`
- **Email:** `jane@example.com`, **Password:** `password123`
- **Email:** `admin@example.com`, **Password:** `admin123`

### Admins
- **Admin ID:** `admin001`, **Password:** `admin123`
- **Admin ID:** `admin002`, **Password:** `admin456`

## Stopping the Application

1. **Stop Frontend:** Press `Ctrl+C` in the frontend terminal
2. **Stop Backend:** Press `Ctrl+C` in the backend terminal
3. **Deactivate Virtual Environment:** `deactivate` in the backend terminal

## Next Steps

After successful testing, you can:
1. Add more features to the HomeScreen
2. Implement menu management
3. Add order processing
4. Create admin dashboard
5. Add payment integration

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Make sure MySQL server is running
4. Check that both frontend and backend are running on correct ports
5. Ensure the virtual environment is activated when working with the backend