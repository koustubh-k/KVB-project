Project statement

Build a secure, scalable, mobile-first CRM and business management web application for KVB Green Energies to manage the full sales-to-installation life cycle (inquiry → quotation → production → installation). The app must support four roles — Admin, Sales, Worker, Customer — with strict role-based access, real-time worker task updates (Kanban), Gmail follow-ups for sales, bulk Excel import, and an admin overview of all departments and KPIs.

Project description (high level)

KVB’s web app provides:

A Customer Portal to browse products (solar cookers, solar dishes, solar tunnel dryer), request \enquiry(with message comments), and view past projects.

A Sales Dashboard to manage leads(potenial customer and customer enquiry) by region, run follow-ups (Gmail integration), convert inquiries into quotations and into production/installation tasks.

A Worker Dashboard with a Jira-style Kanban for production & installation tasks; project locations; real-time status & comments.

An Admin Dashboard offering full CRUD, analytics, bulk imports via Excel, pipeline visibility and cross-department tracking(customers,leads,enquiry,quotations,tasks,products,sales,overview).

Detailed functional requirements (per user type)
1. Admin (full access)

Authentication & secure session via JWT stored in HTTP-only cookie.

CRUD for users (customers, workers, sales), products, tasks, quotations, leads.

Admin dashboard:

KPIs: active customers, pipeline summary (counts by status), tasks by status & overdue, sales by region, revenue by product,quotations, new enquiries.

Real-time view(REST API only): live updates of task status, quotations, and sales pipeline.

Import/export:

Upload Excel/CSV to bulk create/update products ,tasks,quotations.

Download reports (CSV) for sales, tasks, customers.

Permission management:

Assign roles and regions to users(sales,custoomers).

Configure email templates and follow-up schedules for Sales using nodemailer and API+mailtrap integration and config.

2. Sales

Access to leads/enquries list filtered by region (North/South/East/West/Central) of customer and status.

Create / Update leads; log follow-up notes.

Gmail integration:

use Nodemailer to send follow up mails

Schedule weekly re-check emails (or trigger manual send)-LOW Priority.

Convert lead/enquiries → quotation: create quotation with product snapshot, pricing, terms.

Change quotation status (sent, accepted, rejected). On acceptance, convert to production (create tasks)(make predefined set of tasks for some products like solor cooker).

View sales pipeline visualization (funnel).

Notifications for follow-up reminders and lead assignment.

3. Worker

Login to worker dashboard.

Kanban board (Pending, In Progress, Completed(only top 5 latest ,remove rest), Cancelled) with drag/drop.

Real-time updates on task assignments and status changes using REST API only.

View project location ( textual address).

Comment on tasks; upload images/documents (installation photos) REST API only .

Priority indicators and overdue markers.

Task details show linked product snapshot, customer contact (only if required, else limited), and associated quotation ID.

Filter tasks by date, priority.

4. Customer

Public product catalog (unauthenticated).

Logged-in customers:

View product details (pricing & specs).

Request enquiry/qoutation: fill details & attach docs.

Submit inquiries for sales follow-up (this creates leads/contacts visible to Sales).

View past projects and current project status (read-only) for that customer.

Receive email notifications on quotation status changes and installation dates.

Important non-functional requirements (NFRs)

Scalability

Design APIs to handle thousands of concurrent users. Use pagination, indexes, and horizontal scaling.

Security

JWT stored in HTTP-Only secure cookies; use refresh tokens and short-lived access tokens.

Input validation & sanitization (Joi / express-validator).

Role-based access middleware; verify scopes on important endpoints.


Performance

Aim API p95 response < 200ms for common endpoints. Optimize DB queries and add indexes.

Use React Query caching, pagination, and server-side filtering.

Reliability

Retry strategies for failed API calls.

Usability

Mobile-first and accessible (WCAG). Keyboard accessible Kanban and forms.

Meaningful error messages and validation feedback.

Maintainability

Clear code separation: controllers/services/models/routes.

TypeScript types for frontend + backend DTOs (use zod or shared types).

Unit + integration tests; E2E tests for critical flows.

Observability

Centralized logging and metrics (request latency, error rates) in log directorty in backend.
