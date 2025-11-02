# KVB CRM Deployment Guide

This guide provides instructions for deploying the KVB CRM system to various platforms.

## Architecture Overview

The application consists of:

- **Frontend**: React + TypeScript + Vite (deployable to Vercel, Netlify, etc.)
- **Backend**: Node.js + Express + MongoDB (deployable to Railway, Render, Heroku, etc.)

## Vercel Deployment (Frontend)

### Prerequisites

- Vercel account
- GitHub repository connected to Vercel

### Frontend Deployment Steps

1. **Connect Repository to Vercel**
   - Import your GitHub repository in Vercel dashboard
   - Vercel will automatically detect the `vercel.json` configuration

2. **Environment Variables**
   Set these environment variables in Vercel dashboard:

   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_IMAGE_BASE_URL=https://your-image-hosting-url.com
   ```

3. **Deploy**
   - Vercel will automatically build and deploy the frontend
   - The build command is: `cd KVB-frontend && npm run build`
   - Output directory: `KVB-frontend/dist`

### Backend Deployment Options

Choose one of the following platforms for the backend:

#### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Sign up at https://railway.app

2. **Deploy Backend**

   ```bash
   # Clone repository
   git clone https://github.com/your-username/your-repo.git
   cd your-repo/KVBserver

   # Create Railway project
   railway login
   railway init
   railway up
   ```

3. **Environment Variables for Railway**
   Set these in Railway dashboard:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

#### Option 2: Render

1. **Create Render Account**
   - Sign up at https://render.com

2. **Deploy Backend**
   - Connect GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set environment variables as above

#### Option 3: Heroku

1. **Create Heroku Account**
   - Sign up at https://heroku.com

2. **Deploy Backend**

   ```bash
   # Install Heroku CLI
   # Create Heroku app
   heroku create your-app-name

   # Set environment variables
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   # ... set other variables

   # Deploy
   git push heroku main
   ```

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create a cluster
3. Get connection string
4. Whitelist IP addresses (0.0.0.0/0 for development)

### Option 2: Local MongoDB

- Install MongoDB locally
- Use connection string: `mongodb://localhost:27017/kvb-crm`

## Email Configuration

### Gmail SMTP Setup

1. Enable 2-factor authentication on Gmail
2. Generate an App Password
3. Use App Password in `EMAIL_PASS` environment variable

### Alternative: Mailtrap (Development)

- Sign up at https://mailtrap.io
- Get SMTP credentials
- Use for testing email functionality

## Cloudinary Setup (File Uploads)

1. Create account at https://cloudinary.com
2. Get cloud name, API key, and API secret
3. Set environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Environment Variables Summary

### Frontend (.env)

```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_IMAGE_BASE_URL=https://your-image-hosting-url.com
```

### Backend (.env)

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secure-jwt-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-url.com
PORT=5001
```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and responding to API calls
- [ ] Database connection working
- [ ] File uploads working (Cloudinary)
- [ ] Email functionality working
- [ ] User authentication working
- [ ] All CRUD operations working
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness tested

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend allows requests from frontend domain
   - Check CORS configuration in backend

2. **API Connection Issues**
   - Verify environment variables are set correctly
   - Check backend logs for errors

3. **Build Failures**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

4. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access and firewall rules

## Security Considerations

- Use HTTPS in production
- Store sensitive data as environment variables
- Implement proper authentication and authorization
- Regularly update dependencies
- Use secure headers and CORS policies

## Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize images and assets
- Monitor performance metrics

## Monitoring and Maintenance

- Set up error tracking (Sentry, etc.)
- Monitor server logs
- Set up automated backups
- Regularly update dependencies
- Monitor performance and usage
