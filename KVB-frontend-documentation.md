# KVB Frontend Documentation

## Overview

The KVB Frontend is a modern React-based web application built with TypeScript, providing a comprehensive CRM and business management interface for KVB Green Energies. The application supports four user roles: Admin, Sales, Worker, and Customer, with role-based access control and responsive design.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **HTTP Client**: Axios (via custom API utilities)
- **UI Components**: Custom component library with shadcn/ui
- **Routing**: React Router
- **Icons**: Lucide React

## Project Structure

```
KVB-frontend/
├── public/
│   ├── images/          # Static product images
│   └── ...
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (buttons, forms, etc.)
│   │   ├── admin/      # Admin-specific components
│   │   ├── worker/     # Worker-specific components
│   │   └── ...
│   ├── contexts/       # React contexts for state management
│   ├── lib/           # Utilities and configurations
│   ├── pages/         # Main page components
│   ├── types/         # TypeScript type definitions
│   └── ...
├── package.json
└── vite.config.ts
```

## Core Features by User Role

### Customer Portal

**Pages:**

- `LandingPage.tsx` - Public product catalog and company information
- `CRMPage.tsx` - Customer dashboard (authenticated users only)

**Functionality:**

- Browse solar products (cookers, dishes, tunnel dryers)
- Product search and filtering
- Enquiry submission with optional file attachments
- View past and current project status
- Real-time updates on quotation and task status

**Components:**

- `ProductCard.tsx` - Individual product display
- `ProductModal.tsx` - Detailed product view with enquiry form

### Sales Dashboard

**Page:** `SalesDashboard.tsx`

**Functionality:**

- Lead/enquiry management with region-based filtering
- Email integration for follow-up communications
- Quotation creation and status management
- Pipeline visualization and analytics
- Automatic task creation upon quotation acceptance

**Key Features:**

- Region filtering (North, South, East, West, Central)
- Status tracking (New, Contacted, Follow-up, Converted)
- Gmail/Nodemailer integration for email follow-ups
- Quotation workflow management

### Worker Dashboard

**Page:** `WorkerDashboard.tsx`

**Functionality:**

- Kanban-style task management board
- Drag-and-drop task status updates
- Task details with location and customer information
- File upload capabilities for documentation
- Real-time status updates via REST API polling

**Components:**

- `TaskCard.tsx` - Individual task display
- `TaskModal.tsx` - Detailed task view with updates

**Kanban Columns:**

- Pending
- In Progress
- Completed (shows top 5 latest tasks)

### Admin Dashboard

**Page:** `AdminDashboard.tsx`

**Functionality:**

- Complete CRUD operations for all entities
- User role and region management
- Analytics and KPI dashboards
- Bulk import/export operations
- Email template and notification management

**Tabs:**

- Customers - User management
- Products - Product catalog management
- Tasks - Task oversight
- Sales - Sales performance metrics
- Quotations - Quotation management
- Workers - Worker management

## Authentication & Security

### Authentication Flow

- JWT-based authentication with HTTP-only cookies
- Role-based access control middleware
- Protected routes for authenticated users
- Automatic token refresh handling

### User Roles

1. **Admin** - Full system access, user management, analytics
2. **Sales** - Lead management, quotations, email communications
3. **Worker** - Task management, Kanban board, file uploads
4. **Customer** - Product browsing, enquiry submission, project tracking

## API Integration

### API Client

- Centralized API utilities in `src/lib/api.ts`
- Axios-based HTTP client with interceptors
- Automatic error handling and retry logic
- Environment-based configuration

### Key API Endpoints

- `/api/products` - Product management
- `/api/tasks` - Task CRUD operations
- `/api/admin/*` - Administrative functions
- `/api/sales/*` - Sales-specific operations
- `/api/customer/*` - Customer-facing operations

## State Management

### Context Providers

- `AuthContext.tsx` - User authentication and role management
- Global state for user session, permissions, and profile data

### Data Flow

- RESTful API calls for data fetching and mutations
- Optimistic updates for better UX
- Error boundaries for graceful error handling

## UI/UX Design

### Design System

- Consistent component library using shadcn/ui
- Tailwind CSS for responsive styling
- Mobile-first design approach
- Accessible components (WCAG compliant)

### Key UI Patterns

- Dashboard layouts with tabbed navigation
- Modal dialogs for detailed views and forms
- Toast notifications for user feedback
- Loading states and error handling

## File Upload & Media Management

### Image Handling

- Cloudinary integration for image storage
- File validation (size, type, format)
- Progressive image loading
- Responsive image display

### Document Management

- Task attachment uploads
- Enquiry document submissions
- Secure file storage with access controls

## Email Integration

### Email Service

- Nodemailer integration for outbound emails
- Template-based email composition
- SMTP configuration with Mailtrap for testing
- Automated email triggers for status changes

### Email Templates

- Quotation status notifications
- Task assignment and updates
- Customer enquiry confirmations
- Sales follow-up reminders

## Testing Strategy

### Unit Tests

- Component testing with React Testing Library
- Utility function testing
- API integration testing

### Integration Tests

- End-to-end user workflow testing
- Email integration verification
- File upload functionality testing

### User Acceptance Testing

- Role-specific functionality validation
- Cross-browser compatibility
- Mobile responsiveness testing

## Performance Optimization

### Code Splitting

- Route-based code splitting with React.lazy
- Component lazy loading for better initial load times

### Caching Strategy

- Browser caching for static assets
- API response caching where appropriate
- Image optimization and lazy loading

### Bundle Optimization

- Tree shaking for unused code removal
- Minification and compression
- CDN integration for static assets

## Deployment & Build

### Build Process

- Vite-based build system
- TypeScript compilation and type checking
- CSS optimization and purging
- Asset optimization and bundling

### Environment Configuration

- Development, staging, and production environments
- Environment-specific API endpoints
- Secure credential management

## Future Enhancements

### Planned Features

- Real-time notifications (WebSocket integration)
- Advanced analytics and reporting
- Mobile native app companion
- Multi-language support
- Advanced email automation and scheduling

### Scalability Considerations

- Component modularization for easier maintenance
- API rate limiting and optimization
- Database query optimization
- CDN integration for global performance
