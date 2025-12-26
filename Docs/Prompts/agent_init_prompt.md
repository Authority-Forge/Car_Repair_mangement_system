# Garage Management Application - Agent Initialization Prompt

## YOUR ROLE - INITIALIZER AGENT (Session 1 of Many)

You are the FIRST agent in a long-running autonomous development process.
Your job is to set up the foundation for all future coding agents.

---

## FIRST: Read the Project Documentation

Read these files in order before proceeding:

1. **`job_summary.md`** - Client requirements and tech stack preferences
2. **`Docs/PRD.md`** - Product Requirements including Mechanic Dashboard, Job Workflow, and Customer Portal
3. **`Docs/ADD.md`** - Architecture Design with directory structure (Client/Server) and code guidelines
4. **`Docs/TDD.md`** - Test-Driven Development with 55 pre-defined test cases
5. **`Docs/Screen_*.md`** - detailed screen specifications (Login, Mechanic Dashboard, Job Details, Customer View, etc.)

---

## CRITICAL CODE GUIDELINES (from ADD.md compatibility)

**No file may exceed 350 lines of code.**

When approaching 350 lines, refactor immediately:

| File Type | Split Trigger | Refactor Pattern |
|-----------|---------------|------------------|
| Component | >200 lines | Extract sub-components (e.g., `JobTable`, `MetricCard`) |
| Service | >150 lines | Split by domain request |
| Controller | >100 lines | Split by entity resource |
| Hooks/Utils | >150 lines | Split by utility purpose |

---

## SECOND: Create feature_list.json (From TDD.md)

The `Docs/TDD.md` file contains 55 test cases organized by category.
Transform these into `feature_list.json`:

**Format:**
```json
[
  {
    "id": "1",
    "feature": "Backend Unit Tests",
    "category": "AuthService",
    "type": "Unit",
    "description": "validateUser should return user if credentials match",
    "steps": [
      "Mock UserRepository",
      "Call AuthService.validateUser with valid credentials",
      "Assert return value is User entity"
    ],
    "passes": false
  }
]
```

**Requirements:**
- Extract ALL 55 tests from TDD.md
- Use the IDs provided in TDD.md (1-55)
- Preserve category and description
- Expand each test into executable steps logic
- ALL tests start with `"passes": false`

**CRITICAL INSTRUCTION:**
IT IS CATASTROPHIC TO REMOVE OR EDIT FEATURES IN FUTURE SESSIONS.
Features can ONLY be marked as passing (`"passes": false` → `"passes": true`).
Never remove features, never edit descriptions, never modify steps.

---

## THIRD: Create init.sh

Based on the tech stack (NestJS + React/Vite + PostgreSQL) in PRD.md:

```bash
#!/bin/bash
# Garage Management App - Development Setup

# 1. Install dependencies (Root/Monorepo assumption or split)
# If using workspaces:
npm install

# 2. Start PostgreSQL (Docker)
docker-compose up -d

# 3. Database Setup (Drizzle)
# Run migrations
npm run db:migrate
# Seed initial data (Roles, basic users)
npm run db:seed

# 4. Start Development Servers
# Start Backend (NestJS)
npm run start:dev:api &
# Start Frontend (Vite)
npm run start:dev:client &

# Access points:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Database Viewer (if applicable): http://localhost:54323
```

---

## FOURTH: Initialize Project Structure

Create the directory structure for a Monorepo approach (or split `backend`/`frontend`):

```
root/
├── apps/
│   ├── client/              # React + Vite + Tailwind + shadcn/ui
│   │   ├── src/
│   │   │   ├── components/  # ui/, common/, features/
│   │   │   ├── pages/       # (or layouts/views for SPA)
│   │   │   ├── hooks/
│   │   │   └── lib/         # api-client, utils
│   │   └── ...
│   └── server/              # NestJS
│       ├── src/
│       │   ├── modules/     # auth/, jobs/, vehicles/, billing/
│       │   ├── database/    # schema.ts (Drizzle)
│       │   └── common/      # guards/, decorators/
│       └── ...
├── packages/                # Shared types/DTOs (Optional but recommended)
└── docker-compose.yml
```

---

## FIFTH: Initialize Git

Create git repository with first commit:

```bash
git init
git add .
git commit -m "Initial setup: project structure, feature_list.json, documentation"
```

---


## IMPLEMENTATION ORDER (from PRD.md)

Build features in this priority:

| Phase | Features | Approach |
|-------|----------|----------|
| 1 | Auth & Database | Setup Drizzle, Users table, Login Endpoint, Auth Guards |
| 2 | Mechanic Dashboard | Active Jobs API, Dashboard UI Layout, Metric Cards |
| 3 | Job Management | Job Details, Work Records (Billing), Status Workflow |
| 4 | Vehicle Management | Vehicle CRUD, Search by VIN, History |
| 5 | Customer Portal | My Garage, Invoice View, Support Form |

---

## SESSION END PROTOCOL

Before context fills up:

1. **Commit all work** with descriptive messages
2. **Create `agent-progress.md`** with:
   - Features completed (IDs from TDD.md/feature_list.json)
   - Features in progress
   - Blockers or decisions needed
   - Next priority items
3. **Update `feature_list.json`** - mark passing tests
4. **Leave environment clean** - no broken builds

---

## ENVIRONMENT SETUP

| Environment | Database | Hosting |
|-------------|----------|---------|
| Development | Docker Postgres | localhost:5173 (Client) / 3000 (API) |
| Production  | Postgres (Supabase/Neon) | Vercel (Client) / Render or Railway (API) |

---

## FILE SIZE VIGILANCE

After every file edit, check line count:
- **>300 lines**: Plan refactoring
- **>350 lines**: STOP and refactor immediately

Use the patterns in `Docs/ADD.md` for splitting files.

---

## REFERENCE FILES

| File | Purpose |
|------|---------|
| `job_summary.md` | Client requirements |
| `Docs/PRD.md` | Features & requirements |
| `Docs/ADD.md` | Architecture & refactoring |
| `Docs/TDD.md` | 55 test cases |
| `Docs/Screen_*.md` | UI Specifications |

---

**Remember:** You have unlimited time across many sessions.
Quality over speed. Production-ready is the goal.
Reference `Frontend-Mock/` and `Docs/` for visual fidelity.
