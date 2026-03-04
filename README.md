
# MaintainOps — Maintenance Scheduling, Downtime Planning, and Productivity Analytics  
  
MaintainOps is a full-stack web app for tracking **equipment maintenance schedules**, managing **planned downtime**, and coordinating **technician staffing**. It starts as a practical CRUD application (assets, tasks, work orders, logs) and is designed to scale into **analytics** and **capacity planning** features that mirror real operational workflows.  
  
> **Goal:** A resume-ready project that demonstrates end-to-end engineering: schema design, auth/RBAC, scheduling workflows, data integrity, and analytics dashboards.  
  
---  
  
## Table of Contents  
- [Core Use Case](#core-use-case)  
- [Key Features](#key-features)  
- [Tech Stack](#tech-stack)  
- [Architecture Overview](#architecture-overview)  
- [Domain Model](#domain-model)  
- [Workflows](#workflows)  
- [Analytics Roadmap](#analytics-roadmap)  
- [Data Integrity & Business Rules](#data-integrity--business-rules)  
- [Repo Structure (Proposed)](#repo-structure-proposed)  
- [Environment Variables](#environment-variables)  
- [Local Development](#local-development)  
- [Testing](#testing)  
- [Deployment Notes](#deployment-notes)  
- [Project Roadmap](#project-roadmap)  
  
---  
  
## Core Use Case  
  
Teams that maintain physical assets (labs, facilities, fleets, manufacturing) need a single place to:  
- Track **equipment** and its service requirements  
- Define **preventive maintenance task templates**  
- Generate and schedule **work orders**  
- Record **actual time spent** per task  
- Plan **downtime windows** and verify sufficient **staffing**  
- Analyze which tasks run long/short and how staffing matches workload  
  
MaintainOps models these workflows with an extensible architecture that supports deeper features over time.  
  
---  
  
## Key Features  
  
### MVP (CRUD + Operational Value)  
- **Equipment management**  
 - Create/update assets with location, category, criticality, and status  
- **Maintenance task templates**  
 - Define repeatable tasks with `expected_minutes` and recurrence (time-based initially)  
- **Work orders**  
 - Create work orders from templates or ad-hoc requests  
 - Assign priority/status/due dates  
 - Schedule a work order into a time window  
- **Technicians**  
 - Track technicians, skills, teams, and active status  
- **Work logs**  
 - Technicians log start/end times and notes  
 - System computes `actual_minutes` for reporting/analytics  
- **Downtime planning**  
 - Work orders can be marked as requiring **planned downtime** with a downtime start/end  
  
### Near-Term Enhancements  
- **Shift scheduling**  
 - Define shifts and assign technicians to shifts  
- **Work order assignment**  
 - Assign specific technicians to a work order and compare against expected capacity  
- **RBAC**  
 - Roles such as `Admin`, `Planner`, `Technician`  
- **Audit log**  
 - Track who changed schedules/status/downtime windows  
  
---  
  
## Tech Stack  
  
This stack is chosen to be **common in industry** while keeping things **open source** where practical.  
  
### Core  
- **TypeScript** — shared types across app  
- **Next.js (React)** — full-stack framework (UI + server actions/route handlers)  
- **PostgreSQL** — relational database for operational data  
- **Prisma ORM** — schema migrations + type-safe DB access  
  
### Auth & Security  
- **Auth.js / NextAuth** — authentication (open source)  
- **RBAC (application-level)** — enforced in server actions/route handlers  
  
### UI  
- **Tailwind CSS** — styling  
- **shadcn/ui** — accessible UI primitives  
- **Recharts** (planned) — charts for analytics dashboards  
  
### Validation & Forms  
- **Zod** — shared validation for inputs  
- **React Hook Form** — form state + client validation  
  
### Quality & DevEx  
- **ESLint + Prettier** — linting/formatting  
- **Husky + lint-staged** — pre-commit checks (optional)  
- **GitHub Actions** — CI for lint/test (optional)  
  
### Testing  
- **Vitest** — unit/integration tests  
- **Playwright** — end-to-end tests  
  
### Optional Infrastructure (later)  
- **Cron** (Vercel Cron or node-cron) — generate recurring work orders  
- **BullMQ + Redis** — background jobs at higher scale (notifications, reminders)  
  
---  
  
## Architecture Overview  
  
MaintainOps is a **single-repo** full-stack application:  
  
- **UI layer (Next.js App Router)**   
 Pages and components render the app and call server actions for mutations.  
  
- **Server layer (Next.js server actions / route handlers)**   
 All writes go through validated, authorized server-side logic.  
  
- **Data layer (PostgreSQL + Prisma)**   
 A relational schema supports scheduling, logs, and analytics queries.  
  
- **Analytics layer (dashboards + queries)**   
 Aggregations are computed from normalized tables and displayed with charts/tables.  
  
> Design principle: Keep all “source of truth” in Postgres and derive analytics from durable logs.  
  
---  
  
## Domain Model  
  
### Core Entities  
- **Equipment**  
  - The asset being maintained (e.g., pump, microscope, HVAC unit)  
  
- **TaskTemplate**  
  - Defines a repeatable maintenance task  
  - Includes an `expected_minutes` baseline for planning and comparisons  
  
- **WorkOrder**  
  - A scheduled or planned instance of maintenance work  
  - Can be generated from a template or created ad-hoc  
  - Can include **planned downtime** windows  
  
- **WorkLog**  
  - Records actual execution time (technician start/end)  
  - Used to compute `actual_minutes` and analytics  
  
- **Technician**  
  - People who perform work  
  
### Planning Entities (Phase 2)  
- **Shift**  
  - A time window representing an operational shift (site + start/end)  
- **ShiftAssignment**  
  - Which technicians are working a given shift  
- **WorkOrderAssignment** (optional)  
  - Which technicians are assigned to a work order (and in what role)  
  
---  
  
## Workflows  
  
### 1) Preventive Maintenance Setup  
1. Create Equipment  
2. Create Task Templates (expected time, frequency, notes)  
3. Generate Work Orders from templates (manual first, automated later)  
  
### 2) Scheduling & Downtime Planning  
1. Planner schedules a work order (start/end)  
2. If required, planner sets a downtime window (start/end)  
3. Conflicts can be flagged (optional): overlapping downtime for the same equipment  
  
### 3) Execution & Logging  
1. Technician moves work order to `in_progress`  
2. Technician logs start/end + notes  
3. Work order marked `done` once logs completed  
  
---  
  
## Analytics Roadmap  
  
Analytics are derived from **expected vs actual** durations and from shift staffing counts.  
  
### Task Duration Analytics  
- Average actual duration per task template  
- P50 / P90 durations (planning confidence)  
- Overrun rate (e.g., `% actual > expected * 1.2`)  
- Trend lines over time by equipment or location  
  
### Technician & Team Analytics (use thoughtfully)  
- Workload distribution (minutes per shift/week)  
- On-time completion rate  
- Actual vs expected ratios (contextual; not a single “score”)  
  
### Downtime & Staffing Capacity  
- For each shift:  
 - Total planned downtime workload (minutes)  
 - Estimated required tech capacity  
 - Comparison to staffed technicians for that shift  
- Identify understaffed shifts and peak downtime periods  
  
---  
  
## Data Integrity & Business Rules  
  
These rules keep the system realistic and analytics reliable:  
  
- **Expected minutes snapshot**  
  - When a work order is created from a template, copy `expected_minutes` into the work order  
  - This preserves historical “expected at the time” even if templates change later  
- **Capacity constraints**  
  - A work order cannot be both `done` and missing required logs (enforced at the app level)  
- **Time window consistency**  
  - WorkLog `end_time` must be after `start_time`  
  - WorkOrder scheduled_end must be after scheduled_start  
  - Downtime window must be within scheduled window (optional strict rule)  
- **Authorization**  
  - Only planners/admins can schedule work or set downtime windows  
  - Technicians can log work and update status for assigned work orders  
  
---  
  
## Repo Structure (Proposed)  

.
├── app
│   ├── (auth)
│   ├── (dashboard)
│   ├── api
│   ├── equipment
│   ├── task-templates
│   ├── work-orders
│   ├── technicians
│   ├── shifts
│   └── analytics
├── components
│   ├── ui
│   ├── forms
│   ├── tables
│   ├── charts
│   └── layout
├── lib
│   ├── db
│   │   ├── prisma.ts
│   │   └── queries.ts
│   ├── auth
│   │   ├── auth.ts
│   │   └── rbac.ts
│   ├── validation
│   │   ├── equipment.ts
│   │   ├── taskTemplate.ts
│   │   ├── workOrder.ts
│   │   ├── workLog.ts
│   │   ├── technician.ts
│   │   └── shift.ts
│   └── utils
│       ├── dates.ts
│       ├── time.ts
│       └── formatting.ts
├── prisma
│   ├── schema.prisma
│   └── migrations
├── tests
│   ├── unit
│   ├── integration
│   └── e2e
├── public
│   └── images
├── scripts
│   ├── seed.ts
│   └── generate-pm.ts
├── .github
│   └── workflows
│       └── ci.yml
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md

---  
  
## Environment Variables  
  
Example `.env` keys (names may vary depending on deployment):  
  
- `DATABASE_URL` — Postgres connection string  
- `AUTH_SECRET` — session/encryption secret for auth  
- `AUTH_URL` — base URL for auth callbacks (prod)  
- OAuth provider keys (optional)  
 - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (or other providers)  
  
---  
  
## Local Development  
  
High-level steps:  
1. Install dependencies  
2. Start Postgres (Docker recommended)  
3. Run Prisma migrations  
4. Run the dev server  
5. Open the app and sign in  
  
*(Commands are intentionally omitted until the repo is scaffolded; add them once package scripts exist.)*  
  
---  
  
## Testing  
  
- **Unit/integration (Vitest)**  
 - Validate scheduling rules and duration computations  
 - Ensure RBAC checks behave correctly  
  
- **E2E (Playwright)**  
 - Create equipment → create template → create/schedule work order → log time → verify analytics updates  
  
---  
  
## Deployment Notes  
  
Common deployment options:  
- **App:** Vercel (fastest for Next.js) or Docker on a VPS  
- **Database:** Managed Postgres (Neon/Supabase) or self-hosted Postgres  
  
---  
  
## Project Roadmap  
  
### Phase 1 — CRUD Foundation  
- Equipment, Task Templates, Work Orders, Work Logs, Technicians  
- Basic auth + protected routes  
  
### Phase 2 — Scheduling + Shifts  
- Shifts + shift staffing  
- Assign work orders to technicians  
- Downtime conflict detection (optional)  
  
### Phase 3 — Analytics Dashboards  
- Task duration charts (avg, P50/P90, overruns)  
- Staffing vs downtime workload view by shift  
  
### Phase 4 — Production Polish  
- RBAC, audit logs, notifications, exports, CI, deeper test coverage  
  
---  
  
## License  
TBD (recommend MIT for open-source friendliness).