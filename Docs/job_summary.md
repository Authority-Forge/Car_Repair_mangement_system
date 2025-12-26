Summary
Project Overview
I am looking for a Full-Stack Developer to build a functional MVP of a mobile-first garage management application.

We have a complete Drizzle ORM database schema ready. Your job is to build the Backend API (NestJS) to serve this data and the Frontend (React) to interact with it.

Goal: A working application connected to a real database. This is an MVP, so we value functionality and speed over complex architecture, but the code should be clean enough to build upon later.

The Tech Stack
Backend: NestJS (Node.js)

Frontend: React (Vite preferred) + Tailwind CSS

Database: PostgreSQL

ORM: Drizzle ORM (Schema provided)

UI Library: shadcn/ui

API: REST (preferred) or GraphQL

Scope of Work
1. Backend (NestJS)

Database Setup: Initialize the PostgreSQL database using the provided Drizzle schema (Users, Garages, Vehicles, Jobs, Comments).

Authentication: Implement JWT-based Auth (Passport.js strategy).

Guards: Role-based access control (e.g., Only Mechanics can update job status; Customers can only read their own data).

API Development: Create CRUD endpoints for:

Jobs (Create, Update Status, Assign Mechanic)

Vehicles (Search by VIN, View History)

Comments (Post internal vs. public notes)

File Uploads: Simple endpoint to handle image uploads (Local storage or S3) for job attachments.

2. Frontend (React)

Mobile-First Design: The UI must be optimized for mobile viewports (max-width layout).

Integration: Consume the NestJS API (using Axios or TanStack Query).

Key Views:

Login: Role selection support.

Mechanic Dashboard: List of active jobs with status badges.

Job Details: The core view. Edit status, view vehicle info, add work records, and chat interface for comments.

Customer View: Read-only list of their vehicles and repair status.

3. Data Logic

Implement the business logic defined in the schema (e.g., Status transitions: Scheduled - In Progress - Completed).

Handle the distinction between "Internal" and "Public" comments in the API response.

Provided Resources
I will provide the full Drizzle ORM Schema code which defines:

All tables (users, garages, repair_jobs, work_records, etc.)

Enums (job_state, user_role)

Relations

You do not need to design the database from scratch, just implement the provided code.

Deliverables
Repo: Source code (Monorepo or separate folders for Client/Server).