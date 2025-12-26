# Architecture Design Document (ADD)
## Garage Management Application MVP

### 1. System Architecture
*   **Client**: React (Vite) SPA.
*   **Server**: NestJS REST API.
*   **Database**: PostgreSQL.

### 2. Database Design (Drizzle)
*   **Entities**: Users, Garages, Vehicles, RepairJobs, WorkRecords, Comments, Invoices, SupportTickets.
*   **Relations**:
    *   User -> Vehicles (1:N)
    *   Vehicle -> RepairJobs (1:N)
    *   Job -> Invoices (1:1)

### 3. API Design (REST)

#### 3.1 Auth
*   `POST /auth/login`

#### 3.2 Jobs (Staff)
*   `GET /dashboard/metrics`
*   `GET /jobs` (List)
*   `GET /jobs/:id` (Details)
*   `PATCH /jobs/:id/status`
*   `POST /jobs/:id/records` (Billing)

#### 3.3 Customer Portal
*   **Vehicles**:
    *   `GET /vehicles/mine`: List owned vehicles with status.
    *   `POST /vehicles`: Register new vehicle (Multipart for photo).
*   **Invoices**:
    *   `GET /invoices/mine`: List user invoices with stats.
    *   `GET /invoices/:id/pdf`: Download.
    *   `POST /invoices/:id/pay`: Mock payment.
*   **Support**:
    *   `POST /support/contact`: Submit ticket.
    *   `GET /support/faqs`: (Optional) Dynamic FAQs.

#### 3.4 Shared
*   `POST /uploads`: File upload (Vehicle photos, Attachments).

### 4. Frontend Architecture
*   **Layouts**:
    *   `AuthLayout`: Login/Register.
    *   `StaffLayout`: Sidebar, TopBar.
    *   `CustomerLayout`: Top Nav (Dashboard, Vehicles, Invoices, Support).
*   **New Components**:
    *   `VehicleCard`: Status variants (Service Due, OK, Repair).
    *   `InvoiceTable`: With Status Pills and Actions.
    *   `FAQAccordion`: Interactive details/summary.
    *   `ContactForm`: Validated inputs.

### 5. Security
*   **RBAC**:
    *   `POST /vehicles`: Customer only.
    *   `GET /jobs`: Staff sees all, Customer sees own (via ID check).
*   **Validation**: Zod schemas for all forms.
