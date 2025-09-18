# Ready-to-Eat Deployment Guide 🚀

This guide will help you deploy your Ready-to-Eat application completely free using:
- **Frontend**: GitHub Pages (free)
- **Backend**: Railway (free tier)
- **Database**: Railway MySQL (free tier)

## Prerequisites

1. GitHub account with repository access
2. Railway account (free at [railway.app](https://railway.app))
3. Your domain connected to GitHub Pages (as mentioned)

## Step 1: Deploy the Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email

### 1.2 Deploy Backend
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your Ready-to-Eat repository
4. Railway will automatically detect it's a Python app
5. In the deployment settings:
   - **Root Directory**: Set to `/backend`
   - **Build Command**: Leave empty (Railway will auto-detect)
   - **Start Command**: `python app.py`

### 1.3 Set Up Database
1. In your Railway project, click "New" → "Database" → "MySQL"
2. Railway will create a MySQL database
3. Copy the connection details (you'll need these for environment variables)

### 1.4 Configure Environment Variables
In your Railway project, go to Variables tab and add:

```
SECRET_KEY=your-super-secret-key-change-this-in-production
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@mysql.railway.internal:3306/railway
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
```

**Note**: Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password from Railway. The standard Railway MySQL connection details are:
- **Host**: `mysql.railway.internal`
- **Port**: `3306`
- **Database**: `railway`
- **Username**: `root`
- **Password**: (Get this from your MySQL service variables in Railway)

### 1.5 Get Backend URL
1. After deployment completes, Railway will provide a URL like: `https://your-app-name.railway.app`
2. Copy this URL - you'll need it for frontend configuration

## Step 2: Update Frontend Configuration

### 2.1 Update API Configuration
1. Open `frontend/src/config.js`
2. Replace the placeholder URL with your Railway backend URL:

```javascript
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'https://your-app-name.railway.app', // Your actual Railway URL
  }
};
```

### 2.2 Update CORS Configuration
1. Open `backend/app.py`
2. Update the allowed origins:

```python
allowed_origins = [
    'http://localhost:3000',
    'https://yourusername.github.io',  # Your GitHub Pages URL
    'https://yourdomain.com'  # Your custom domain
]
```

## Step 3: Deploy Frontend to GitHub Pages

### 3.1 Enable GitHub Pages
1. Go to your GitHub repository
2. Click Settings → Pages
3. Under "Source", select "GitHub Actions"
4. The workflow file is already created at `.github/workflows/deploy-frontend.yml`

### 3.2 Trigger Deployment
1. Commit and push your changes to the main branch
2. GitHub Actions will automatically build and deploy your frontend
3. Your site will be available at: `https://yourusername.github.io/your-repo-name`

### 3.3 Custom Domain (Optional)
If you have a custom domain:
1. In GitHub Pages settings, add your custom domain
2. Update your DNS records to point to GitHub Pages
3. Update the CORS configuration in `backend/app.py`

## Step 4: Database Setup

### 4.1 Run Database Setup Script
1. Access your Railway MySQL database
2. Run the SQL commands from `database/setup.sql`
3. This will create the necessary tables and sample data

### 4.2 Verify Database Connection
1. Check your Railway deployment logs
2. Look for "Database tables created successfully" message
3. If there are errors, verify your DATABASE_URL environment variable

## Step 5: Test Your Deployment

### 5.1 Test Backend API
1. Visit `https://your-app-name.railway.app/api/health`
2. You should see: `{"message": "Ready-to-Eat API is running", "status": "healthy"}`

### 5.2 Test Frontend
1. Visit your GitHub Pages URL or custom domain
2. Try registering a new account
3. Test the login functionality
4. Verify that orders can be placed

## Step 6: Monitor and Maintain

### 6.1 Railway Monitoring
- Check Railway dashboard for deployment status
- Monitor logs for any errors
- Railway free tier includes 500 hours of usage per month

### 6.2 GitHub Pages
- Monitor GitHub Actions for build status
- Check Pages settings for deployment status

## Troubleshooting

### Common Issues

1. **Database Connection Issues - "Can't connect to MySQL server on 'localhost'"**
   - **Problem**: Railway created a malformed DATABASE_URL with placeholder text
   - **Solution**: Delete the auto-generated DATABASE_URL and create a new one manually:
     ```
     DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@mysql.railway.internal:3306/railway
     ```
   - Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password from Railway

2. **Database Connection Issues - "invalid literal for int() with base 10: 'MYSQL_PORT'"**
   - **Problem**: Railway's auto-generated DATABASE_URL contains literal text instead of values
   - **Solution**: Use the standard Railway MySQL connection format:
     - **Host**: `mysql.railway.internal`
     - **Port**: `3306`
     - **Database**: `railway`
     - **Username**: `root`

3. **CORS Errors**
   - Verify CORS origins in `backend/app.py` include your frontend URL
   - Check that your frontend is using HTTPS in production

4. **Frontend Build Failures**
   - Check GitHub Actions logs for specific errors
   - Ensure all dependencies are properly listed in `package.json`

5. **API Calls Failing**
   - Verify `frontend/src/config.js` has the correct production URL
   - Check that the backend is deployed and accessible

### Getting Help

1. Check Railway deployment logs
2. Check GitHub Actions logs
3. Verify all environment variables are set correctly
4. Test API endpoints directly using tools like Postman

## Security Considerations

1. **Change Default Passwords**: Update admin credentials after deployment
2. **Environment Variables**: Never commit sensitive data to Git
3. **HTTPS**: Both Railway and GitHub Pages provide HTTPS by default
4. **CORS**: Only allow necessary origins in production

## Cost Breakdown (Free!)

- **Railway**: Free tier includes 500 hours/month, $5 credit
- **GitHub Pages**: Completely free
- **MySQL Database**: Included in Railway free tier
- **Total Cost**: $0/month

## Next Steps

1. Set up monitoring and alerts
2. Configure automatic backups for your database
3. Consider upgrading Railway plan for higher limits if needed
4. Set up custom domain with SSL certificate

---

**Your Ready-to-Eat app is now live and ready to serve! 🎉**

For support, check the logs in Railway and GitHub Actions, or refer to the troubleshooting section above.
