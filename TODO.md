# TODO List for KVB CRM System Implementation

## Current Task: Add Sales Routes to Frontend API Lib

- [x] Add sales auth endpoints (signup, login, logout, forgotPassword, resetPassword) to authAPI in KVB-frontend/src/lib/api.ts
- [x] Create salesAPI object with leads (getLeads, createLead, updateLead), sendFollowUpEmail, and quotations (getQuotations, createQuotation, updateQuotation) endpoints in KVB-frontend/src/lib/api.ts

## Completed Tasks

- [x] Add "sales" user type to SignupPage.tsx
- [x] Update navigation logic in SignupPage to redirect sales users to /sales
- [x] Add Sales tab to AdminDashboard with SalesTab component
- [x] Create SalesTab component with leads and quotations management
- [x] Implement sales user type functionality (signup, navigation, admin management)
- [x] Add Quotations tab to AdminDashboard with QuotationsTab component
- [x] Create QuotationsTab component with quotations management table and statistics

## Next Pending Tasks (from overall plan)

- [x] Update AuthContext to support sales role
- [x] Create SalesDashboard page with lead table, follow-up panel
- [x] Create QuotationPage for customers and sales
- Implement KanbanBoard component for workers
- Add Gmail API integration (Google API Client)
- Add Excel parsing (XLSX/SheetJS) for bulk uploads
- Implement WebSockets for real-time updates
- Add mobile-first responsive design
- Ensure WCAG accessibility compliance
- Add React Query caching and optimistic updates
- Implement retry mechanism for failed API calls
- Add auto-refresh and optimistic UI updates
