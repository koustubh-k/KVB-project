# KVB Green Energies CRM System

A comprehensive Customer Relationship Management (CRM) system built for KVB Green Energies, specializing in solar energy solutions including solar cookers, dryers, and photovoltaic systems.

## 🌟 Features

### Customer Portal

- **Product Catalog**: Browse solar products with detailed specifications
- **Enquiry System**: Submit product enquiries with file attachments
- **Project Tracking**: Monitor quotations and installation progress
- **User Authentication**: Secure login/signup system

### Sales Dashboard

- **Lead Management**: Track and manage customer enquiries by region
- **Quotation Management**: Create and send professional quotations
- **Email Integration**: Automated email notifications
- **Pipeline Analytics**: Sales performance tracking

### Worker Dashboard

- **Task Management**: Kanban-style task board with status updates
- **Location Tracking**: GPS-based task location display
- **File Upload**: Document and image management for tasks
- **Customer Communication**: Conditional access to customer contact info

### Admin Dashboard

- **User Management**: Complete CRUD operations for all user types
- **Product Management**: Manage solar product catalog with Cloudinary integration
- **Analytics & KPIs**: Comprehensive dashboard statistics
- **Bulk Operations**: Import/export functionality for data management
- **Task Assignment**: Automated task creation and worker assignment

## 🛠️ Technology Stack

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with bcrypt password hashing
- **Cloudinary** for file upload and management
- **Nodemailer** for email notifications
- **ExcelJS** for bulk import/export operations

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Query** for state management and API calls
- **React Router** for client-side routing
- **Lucide React** for icons

### Development Tools

- **ESLint** for code linting
- **Prettier** for code formatting
- **Nodemon** for backend development
- **Vite Dev Server** for frontend development

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/kvb-crm.git
   cd kvb-crm
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd KVBserver
   npm install

   # Install frontend dependencies
   cd ../KVB-frontend
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment file
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB (if using local instance)
   mongod

   # Seed initial data (optional)
   cd KVBserver
   node seeds/seedData.js
   ```

5. **Start the application**

   ```bash
   # Start backend server (from KVBserver directory)
   npm start

   # Start frontend (from KVB-frontend directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 📁 Project Structure

```
KVB2/
├── KVB-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utility functions and API calls
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── KVBserver/              # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── lib/                # Library configurations
│   └── package.json
├── other/                  # Sample data and documentation
├── test-api.js             # API testing script
├── test-customer-ui.js     # Frontend testing script
├── .env.example            # Environment variables template
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `KVBserver` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/kvb-crm

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=noreply@kvbenergies.com

# Email Configuration (Development)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-username
MAILTRAP_PASS=your-mailtrap-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

### API Testing

```bash
# Run API tests
node test-api.js
```

### Frontend Testing

```bash
# Run customer UI tests
node test-customer-ui.js
```

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/customer-auth/login` - Customer login
- `POST /api/worker-auth/login` - Worker login
- `POST /api/admin-auth/login` - Admin login
- `POST /api/sales-auth/login` - Sales login

### Public Endpoints

- `GET /api/products/public` - Get all products
- `GET /api/products/public/:id` - Get product details

### Protected Endpoints

- Customer: `/api/customer/*`
- Worker: `/api/tasks/worker/*`
- Sales: `/api/sales/*`
- Admin: `/api/admin/*`

## 🔄 Data Import/Export

### Sample Data Files

- `other/sample-products.csv` - Product catalog sample
- `other/sample-customers.csv` - Customer data sample
- `other/sample-tasks.csv` - Task data sample

### Bulk Import Endpoints

- `POST /api/admin/bulk-import/products` - Import products
- `POST /api/admin/bulk-import/customers` - Import customers
- `POST /api/admin/bulk-import/tasks` - Import tasks

### Export Endpoints

- `GET /api/admin/export/customers` - Export customers
- `GET /api/admin/export/products` - Export products
- `GET /api/admin/export/tasks` - Export tasks
- `GET /api/admin/export/sales` - Export sales data

## 📧 Email Notifications

The system includes automated email notifications for:

- Enquiry confirmations
- Quotation sent/accepted notifications
- Task assignments and completions
- Follow-up communications

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd KVB-frontend
npm run build

# The dist folder contains production-ready files
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up Gmail SMTP or other email service
4. Configure Cloudinary for file storage
5. Set up reverse proxy (nginx recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📝 License

This project is proprietary software for KVB Green Energies.

## 🆘 Support

For support and questions, contact the development team or create an issue in the repository.

## 🎯 Roadmap

### Version 2.0 Features

- Mobile application
- Advanced analytics dashboard
- Integration with solar monitoring systems
- Multi-language support
- Advanced reporting and business intelligence

---

**Built with ❤️ for sustainable energy solutions**
