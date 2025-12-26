# Product Requirements Document (PRD)
## Garage Management Application MVP

### 1. Project Overview
This project aims to build a functional MVP of a mobile-first garage management application. The system will allow mechanics to track repair jobs, manage vehicle histories, and communicate with customers. Customers will have a detailed self-service portal.

### 2. User Roles
*   **Mechanic**: Full job management, work recording, internal/public notes.
*   **Advisor**: Customer communication, job creation, scheduling.
*   **Customer**: Self-service vehicle management, invoice payment, support access.
*   **Admin**: System management.

### 3. Functional Requirements

#### 3.1 Authentication
*   **Login**: Role selection, Email/Pass, JWT.
*   **Registration**: (Implied) Sign up flow for new customers.

#### 3.2 Mechanic Dashboard
*   **Metrics**: Active Jobs, Daily Revenue, Pending Parts.
*   **Job List**: Filter/Sort/Search. Status Badges.

#### 3.3 Job Details (Staff View)
*   **Workflow**: Check-in -> Diagnostics -> Repair -> QA -> Ready.
*   **Records**: Labor/Parts line items with auto-calc.
*   **Chat**: Internal vs Public feeds. Attachment support.

#### 3.4 Customer Portal
*   **Dashboard**: Active Repair progress (%) and quick actions.
*   **My Garage**:
    *   **List**: Grid view of vehicles with health status (No Issues, Service Due, In Repair).
    *   **Add Vehicle**: Form to register new car (Photo Upload, VIN Scan, Make/Model/Year).
*   **Invoices**:
    *   **List**: History of all payments. Status: Paid/Pending.
    *   **Actions**: Export All, Download PDF, Pay Now (Pending only).
    *   **Stats**: Total Spent YTD, Upcoming Payments.
*   **Support Center**:
    *   **FAQ**: Accordion list of common questions.
    *   **Contact Form**: Ticket submission (Subject differentiation).
    *   **Info**: Operating hours, Phone/Email/Location details.

#### 3.5 Vehicle Management
*   **Data**: VIN, Mileage, Plate, Specs.
*   **History**: Complete service timeline.

### 4. Non-Functional Requirements
*   **Mobile-First**: Fully responsive.
*   **Design**: Light/Dark mode. "AutoFix Garage" branding.
*   **Performance**: Optimized assets/images.

### 5. Technical Stack
*   **Backend**: NestJS + PostgreSQL + Drizzle.
*   **Frontend**: React + Tailwind + shadcn/ui.
