# Ready-to-Eat

A food ordering website for Medi-Caps University cafeteria.

## Project Structure

```
Ready-to-Eat/
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── config.py           # Database configuration
│   ├── models.py           # Database models
│   ├── routes.py           # API routes
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   ├── package.json        # Node dependencies
│   └── README.md           # Frontend setup
└── database/               # Database setup scripts
    └── setup.sql           # MySQL database setup
```

## Features

- User authentication (login/register)
- Password recovery (UI only)
- Responsive design with Medi-Caps University branding
- MySQL database integration
- RESTful API backend

## Setup Instructions

### Backend Setup

1. **Set up Python virtual environment (Recommended):**
   ```bash
   # Windows
   setup_venv.bat
   
   # Or manually:
   python -m venv venv
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. Navigate to the backend directory:
   ```bash
   cd backend
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up MySQL database:
   - Create a MySQL database named `ready_to_eat`
   - Run the SQL script in `database/setup.sql`

6. Update database configuration in `config.py`

7. Run the Flask application:
   ```bash
   # Windows (with virtual environment)
   activate_and_run.bat
   
   # Or manually:
   python app.py
   ```

**Quick Start (Windows):**
- Run `setup_venv.bat` once for initial setup
- Use `activate_and_run.bat` every time you want to start the server

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Test User

The following test user is pre-loaded in the database:
- First Name: Test
- Last Name: User
- Email: testuser@gmail.com
- Password: Password123!
- Mobile: 9999999999

## Technologies Used

- **Backend**: Python Flask
- **Database**: MySQL
- **Frontend**: React.js
- **Styling**: CSS3 with modern design principles
