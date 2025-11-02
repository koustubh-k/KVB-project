# KVB Backend Documentation

## Overview

The KVB Backend is a Node.js/Express REST API server that provides comprehensive CRM and business management functionality for KVB Green Energies. Built with modern JavaScript, it supports four user roles with secure authentication, email integration, and scalable architecture.

## Technology Stack

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **File Storage**: Cloudinary for media uploads
- **Email Service**: Nodemailer with Mailtrap integration
- **Validation**: Express-validator middleware
- **Security**: bcryptjs for password hashing
- **File Processing**: ExcelJS for bulk import/export

## Project Structure

```
KVBserver/
├── controllers/         # Request handlers and business logic
├── lib/                # Database connection and utilities
├── middleware/         # Authentication, validation, and security
├── models/            # Mongoose schemas and data models
├── routes/            # API route definitions
├── seeds/             # Database seeding scripts
├── utils/             # Helper functions and services
├── images/            # Static file storage
├── index.js           # Application entry point
└── package.json
```

## Core Features by User Role

### Admin API Endpoints

**Authentication:** `/api/admin-auth/*`

- POST `/login` - Admin login
- POST `/register` - Admin registration (initial setup)

**Management:** `/api/admin/*`

- **Users**: CRUD operations for customers, workers, sales users
- **Products**: Full product catalog management
- **Tasks**: Task creation, assignment, and oversight
- **Quotations**: Quotation management and analytics
- **Analytics**: KPI dashboards and reporting
- **Bulk Operations**: Excel import/export for all entities

### Sales API Endpoints

**Authentication:** `/api/sales-auth/*`

- POST `/login` - Sales user login
- POST `/register` - Sales user registration

**Operations:** `/api/sales/*`

- **Leads**: Region-filtered lead management
- **Enquiries**: Customer enquiry processing
- **Quotations**: Create and manage quotations
- **Email Integration**: Follow-up email sending
- **Pipeline**: Sales funnel analytics

### Worker API Endpoints

**Authentication:** `/api/worker-auth/*`

- POST `/login` - Worker login
- POST `/register` - Worker registration

**Operations:** `/api/tasks/*`

- **Kanban Board**: Task status updates (Pending → In Progress → Completed)
- **File Uploads**: Task documentation and photos
- **Comments**: Task updates and communication

### Customer API Endpoints

**Authentication:** `/api/customer-auth/*`

- POST `/login` - Customer login
- POST `/register` - Customer registration

**Operations:** `/api/customer/*`

- **Products**: Browse product catalog
- **Enquiries**: Submit product enquiries
- **Projects**: View past and current projects and enquires
- **Status Updates**: project tracking

## Data Models

### User Management Models

**User** (`user.model.js`)

- Base user schema with role-based fields
- Roles: admin, sales, worker, customer
- Authentication fields: email, password (hashed)
- Profile information: name, contact details

**Admin** (`admin.model.js`)

- Extends User model
- Administrative permissions and settings

**Sales** (`sales.model.js`)

- Region assignment (North, South, East, West, Central)
- Performance metrics and targets

**Worker** (`worker.model.js`)

- Task assignments and workload tracking
- Location and availability status

**Customer** (`customer.model.js`)

- Company information and contact details
- Region classification
- Project history and preferences

### Business Logic Models

**Product** (`product.model.js`)

- Product catalog with specifications
- Pricing and availability information
- Task templates for automatic task creation
- Image galleries and documentation

**Lead** (`lead.model.js`)

- Customer enquiries and prospects
- Status tracking (new, contacted, follow-up, converted)
- Region-based organization
- Sales assignment and follow-up history

**Quotation** (`quotation.model.js`)

- Product quotations with pricing
- Status management (sent, accepted, rejected)
- Product snapshots for data integrity
- Automatic task generation triggers

**Task** (`task.model.js`)

- Kanban-style task management
- Location information (textual addresses)
- File attachments and documentation
- Customer contact details (conditional)
- Priority and deadline tracking

## API Architecture

### Authentication & Security

**JWT Implementation:**

- Access tokens with 15-minute expiration
- Refresh tokens for session management
- HTTP-only cookies for secure storage
- Role-based middleware protection

**Security Features:**

- Password hashing with bcryptjs
- Input validation with express-validator
- # Rate limiting and request throttling
- CORS configuration for frontend integration

### File Upload & Media Management

**Cloudinary Integration:**

- Image storage and optimization
- Secure file access with signed URLs
- Automatic format conversion and compression
- CDN delivery for performance

**File Processing:**

- Excel import/export with ExcelJS
- Bulk data operations for efficiency
- File validation and size limits
- Secure temporary file handling

### Email Integration

**Nodemailer Service:**

- SMTP configuration with Mailtrap
- Template-based email composition
- Automated triggers for status changes
- Follow-up email scheduling

**Email Templates:**

- Quotation status notifications
- Task assignments and updates
- Customer enquiry confirmations
- Sales follow-up reminders

## Database Design

### MongoDB Collections

**Users Collection:**

- Unified user storage with role discrimination
- Indexed fields for performance
- Relationship mappings between entities

**Business Entities:**

- Products, Leads, Quotations, Tasks
- Proper referencing and population
- Optimized queries with indexes

### Data Relationships

**Customer → Enquiry → Lead → Quotation → Tasks**

- Linear workflow progression
- Automatic data propagation
- Status synchronization across entities

**User Role Assignments:**

- Region-based filtering for sales
- Task assignments for workers
- Permission-based access control

## API Endpoints Reference

### Authentication Endpoints

```
POST   /api/admin-auth/login
POST   /api/admin-auth/register
POST   /api/sales-auth/login
POST   /api/sales-auth/register
POST   /api/worker-auth/login
POST   /api/worker-auth/register
POST   /api/customer-auth/login
POST   /api/customer-auth/register
```

### Product Management

```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get product details
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Task Management

```
GET    /api/tasks                 # Get tasks (filtered by role)
GET    /api/tasks/:id             # Get task details
PUT    /api/tasks/:id             # Update task status
POST   /api/tasks/:id/upload      # Upload task files
POST   /api/tasks/:id/comments    # Add task comments
```

### Admin Operations

```
GET    /api/admin/dashboard        # Dashboard analytics
GET    /api/admin/users            # User management
POST   /api/admin/bulk-import      # Excel bulk import
GET    /api/admin/export/:type     # Data export
PUT    /api/admin/users/:id/region # Region assignment
```

### Sales Operations

```
GET    /api/sales/leads            # Get leads by region
POST   /api/sales/quotations       # Create quotation
PUT    /api/sales/quotations/:id   # Update quotation
POST   /api/sales/send-email       # Send follow-up email
GET    /api/sales/pipeline         # Pipeline analytics
```

### Customer Operations

```
GET    /api/customer/products      # Browse products
POST   /api/customer/enquiries     # Submit enquiry
GET    /api/customer/projects      # View projects
GET    /api/customer/quotations    # View quotations
```

## Middleware Architecture

### Authentication Middleware

- `protectRoute.js` - JWT token verification
- `roleMiddleware.js` - Role-based access control
- `customerAuthMiddleware.js` - Customer-specific auth

### Validation Middleware

- `validation.js` - Input validation rules
- `multer.js` - File upload handling

### Security Middleware

- CORS configuration
- Helmet for security headers
- Rate limiting implementation

## Email Service Integration

### Service Configuration

```javascript
// utils/emailService.js
- Nodemailer transporter setup
- Mailtrap SMTP configuration
- Template rendering functions
- Automated email triggers
```

### Email Templates

- Welcome emails for new users
- Quotation status updates
- Task notifications
- Follow-up reminders

## File Upload System

### Multer Configuration

- File type validation
- Size limits and restrictions
- Cloudinary upload integration
- Secure file naming and storage

### Bulk Import/Export

- ExcelJS for spreadsheet processing
- Data validation and error handling
- Progress tracking for large files
- Template generation for exports

## Testing Strategy

### Unit Tests

- Controller function testing
- Model validation testing
- Utility function testing
- Middleware testing

### Integration Tests

- API endpoint testing
- Database operation testing
- Email service testing
- File upload testing

### End-to-End Testing

- User workflow validation
- Cross-role interaction testing
- Email integration verification
- Bulk operation testing

## Performance Optimization

### Database Optimization

- Strategic indexing on query fields
- Query optimization and aggregation
- Connection pooling configuration
- Read/write separation where applicable

### API Performance

- Response caching strategies
- Pagination for large datasets
- Background job processing
- Rate limiting and throttling

### File Handling

- Cloudinary CDN integration
- Image optimization and compression
- Lazy loading implementation
- Secure access controls

## Deployment & Scaling

### Environment Configuration

- Development, staging, production setups
- Environment variable management
- Database connection strings
- Service credential handling

### Scalability Features

- Horizontal scaling capabilities
- Load balancing configuration
- Database sharding considerations
- CDN integration for assets

### Monitoring & Logging

- Request/response logging
- Error tracking and reporting
- Performance metrics collection
- Health check endpoints
