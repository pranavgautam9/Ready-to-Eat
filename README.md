# Ready-to-Eat 🍽️

A comprehensive food ordering system designed specifically for Medi-Caps University cafeteria. This full-stack application provides a seamless ordering experience for students and faculty with features like real-time order tracking, rewards system, and admin management.

## 🌟 Features

### For Students & Faculty
- **User Authentication**: Secure login/register with password recovery
- **Menu Browsing**: Browse available food items with images and pricing
- **Order Management**: Add items to cart, place orders, and track order status
- **Rewards System**: Earn points with every order and redeem rewards
- **Order History**: View past orders and current order status
- **Guest Access**: Order without registration (limited features)
- **Responsive Design**: Works perfectly on desktop and mobile devices

### For Administrators
- **Admin Dashboard**: Complete order management system
- **Menu Management**: Add, edit, or remove food items and pricing
- **Order Tracking**: Monitor current orders and update status
- **User Management**: View user accounts and order history
- **Real-time Updates**: Orders automatically update based on estimated time

## 🏗️ Project Structure

```
Ready-to-Eat/
├── backend/                 # Flask REST API
│   ├── app.py              # Main Flask application
│   ├── config.py           # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── routes.py           # API endpoints
│   └── requirements.txt    # Python dependencies
├── frontend/               # React.js application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── data/           # Static data files
│   │   └── assets/         # Images and media
│   └── package.json        # Node.js dependencies
├── database/               # Database setup
│   └── setup.sql           # MySQL schema and sample data
└── venv/                   # Python virtual environment
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- MySQL 5.7+ or MySQL 8.0+
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Ready-to-Eat
```

### 2. Backend Setup

#### Option A: Using Virtual Environment (Recommended)
```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

#### Option B: Using System Python
```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup
1. **Install MySQL** and start the service
2. **Create database**:
   ```sql
   CREATE DATABASE ready_to_eat;
   ```
3. **Run setup script**:
   ```bash
   mysql -u root -p ready_to_eat < ../database/setup.sql
   ```
4. **Update database credentials** in `backend/config.py` if needed

### 4. Start Backend Server
```bash
cd backend
python app.py
```
The API will be available at `http://localhost:5000`

### 5. Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm start
```
The application will open at `http://localhost:3000`

## 👥 Test Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `Admin123!`
- **Role**: Super Admin
- **Full Name**: System Administrator

### Test User
- **Email**: `testuser@gmail.com`
- **Password**: `Password123!`
- **Name**: Test User
- **Mobile**: 9999999999

## 🔧 Configuration

### Backend Configuration
Edit `backend/config.py` to modify:
- Database connection settings
- Secret key for sessions
- CORS origins

### Frontend Configuration
The frontend automatically connects to `http://localhost:5000` for API calls. To change this, update the proxy setting in `frontend/package.json`.

## 📱 Usage

1. **As a Student/Faculty**:
   - Register a new account or use guest access
   - Browse the menu and add items to cart
   - Place your order and track its status
   - Earn points and redeem rewards

2. **As an Administrator**:
   - Login with admin credentials
   - Manage menu items and pricing
   - Monitor and update order status
   - View order history and user data

## 🛠️ Technologies Used

- **Backend**: Python Flask, SQLAlchemy, PyMySQL
- **Frontend**: React.js, React Router, Axios
- **Database**: MySQL
- **Styling**: CSS3 with modern design principles
- **Authentication**: Session-based with password hashing
- **API**: RESTful API with JSON responses

## 📋 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/admin/login` - Admin login
- `POST /api/guest/access` - Guest access

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/<id>` - Get specific order
- `PUT /api/orders/<id>/status` - Update order status

### Admin
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/menu` - Get menu items
- `POST /api/admin/menu` - Add menu item
- `PUT /api/admin/menu/<id>` - Update menu item
- `DELETE /api/admin/menu/<id>` - Delete menu item

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/points` - Get user points
- `PUT /api/user/points` - Update user points
- `PUT /api/user/change-password` - Change password

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection Error**: Ensure MySQL is running and credentials are correct
2. **Port Already in Use**: Change ports in `app.py` (backend) or `package.json` (frontend)
3. **CORS Issues**: Check that frontend is running on port 3000 and backend on port 5000
4. **Module Not Found**: Ensure virtual environment is activated and dependencies are installed

### Getting Help
- Check the console for error messages
- Verify all services are running
- Ensure database is properly set up
- Check network connectivity between frontend and backend

## 🚀 Deployment

This application can be deployed completely free using:

- **Frontend**: GitHub Pages
- **Backend**: Railway (free tier)
- **Database**: Railway MySQL (free tier)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Steps:

1. **Backend**: Deploy to Railway with MySQL database
2. **Frontend**: Enable GitHub Pages with GitHub Actions
3. **Configuration**: Update API URLs and CORS settings
4. **Database**: Run setup script to initialize tables

**Total Cost**: $0/month! 🎉

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Ready-to-Eat** - Making campus dining convenient and efficient! 🎓🍕
