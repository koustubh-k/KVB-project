# KVB Management System - Frontend

A modern, responsive frontend application built with React, TypeScript, and Tailwind CSS for the KVB Management System. This application provides different interfaces for customers, workers, and administrators.

## Features

### 🔐 Authentication System

- **Multi-role login/signup**: Customers, Workers, and Admins
- **Secure authentication** with JWT tokens and HTTP-only cookies
- **Role-based access control** and protected routes

### 🛍️ Customer Portal (CRM)

- **Public product catalog** - Browse products without login
- **Enhanced customer view** - Full product details, pricing, and specifications for logged-in customers
- **Responsive product cards** with grid/list view options
- **Advanced search and filtering**

### 👨‍💼 Admin Dashboard

- **Customer Management** - View and manage all registered customers
- **Worker Management** - Manage worker accounts and specializations
- **Product Management** - Full CRUD operations for products with images and specifications
- **Task Management** - Create, assign, and track tasks
- **Dashboard Analytics** - Real-time statistics and alerts

### 👷‍♂️ Worker Dashboard

- **Jira-style Kanban board** - Drag-and-drop task management
- **Task status tracking** - Pending, In Progress, Completed, Cancelled
- **Real-time updates** - Auto-refresh every 30 seconds
- **Task comments** - Add updates and communicate with team
- **Priority indicators** - Visual priority levels and overdue alerts

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **React Beautiful DND** - Drag and drop functionality
- **Axios** - HTTP client
- **Date-fns** - Date manipulation
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- KVB Backend server running on port 3000

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd KVB-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── worker/          # Worker-specific components
│   ├── Navbar.tsx       # Navigation component
│   ├── ProtectedRoute.tsx # Route protection
│   ├── ProductCard.tsx  # Product display card
│   └── ProductModal.tsx # Product details modal
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utilities and configurations
│   └── api.ts          # API client and endpoints
├── pages/              # Page components
│   ├── AdminDashboard.tsx
│   ├── WorkerDashboard.tsx
│   ├── CRMPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── LandingPage.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## API Integration

The frontend integrates with the KVB backend API running on `http://localhost:3000`. Key API endpoints include:

- **Authentication**: `/api/customer-auth`, `/api/worker-auth`, `/api/admin-auth`
- **Products**: `/api/products`
- **Admin Operations**: `/api/admin`
- **Tasks**: `/api/tasks`

## User Roles & Features

### 🔵 Customer

- Browse public product catalog
- Access detailed product information when logged in
- View pricing, specifications, and availability
- Contact sales for products

### 🟢 Worker

- View assigned tasks in Kanban board
- Drag and drop tasks between status columns
- Update task status and add comments
- Real-time task synchronization
- Priority-based task filtering

### 🔴 Admin

- Complete system overview with analytics
- Manage customers, workers, and products
- Create and assign tasks to workers
- Monitor system alerts and notifications
- Full CRUD operations on all entities

## Key Features

### 🎨 Modern UI/UX

- **Responsive design** - Works on desktop, tablet, and mobile
- **Dark/Light theme support** - Consistent color scheme
- **Smooth animations** - CSS transitions and loading states
- **Accessible design** - WCAG compliant components

### 🔄 Real-time Updates

- **Auto-refresh** - Tasks update automatically
- **Optimistic updates** - Immediate UI feedback
- **Error handling** - Graceful error recovery

### 🛡️ Security

- **JWT authentication** - Secure token-based auth
- **Role-based access** - Granular permission system
- **Protected routes** - Unauthorized access prevention

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
