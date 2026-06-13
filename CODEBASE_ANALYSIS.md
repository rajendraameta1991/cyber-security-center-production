# Hospital Cyber Security Center - Codebase Analysis

## 1. Executive Summary
The Hospital Cyber Security Center is a Single Page Application (SPA) designed to provide a comprehensive security operations dashboard for hospital IT and security teams. Built with a modern React frontend and a Node.js/Express backend, it offers features for endpoint monitoring, IT asset management, help desk ticketing, and security alerts. The current implementation provides a robust authentication foundation but heavily relies on mock data for its operational modules, indicating it is currently in a prototype or early development phase.

## 2. Technology Stack
*   **Frontend:** React 18, React Router DOM (v7), Vite, Tailwind CSS (v3), Lucide React (for iconography), Recharts (for data visualization).
*   **Backend:** Node.js, Express 5.
*   **Database:** PostgreSQL (accessed via the `pg` driver).
*   **Security & Middleware:** `express-rate-limit` (login protection), `helmet` (security headers), `cookie-parser`, and Node.js native `crypto` module (`scrypt` for hashing, `randomBytes` for salts/tokens).

## 3. Frontend Architecture
*   **Routing:** Handled client-side using React Router in `App.jsx`. The application operates as a Single Page Application (SPA) with a fallback to `index.html` configured on the Express backend for production.
*   **State Management:** React Context API is heavily utilized. `AuthContext.jsx` manages session state, CSRF tokens, and wraps API calls (`apiRequest`). `SecurityContext.jsx` manages security stats, activities, and threat lists.
*   **Component Structure:** Modularized architecture consisting of layout wrappers (`Layout`, `Sidebar`, `Header`), reusable UI elements (`UI.jsx` containing `Panel`, `StatCard`, `Badge`, `DataTable`), and distinct page components under `src/pages/` (e.g., `Dashboard`, `ITOperations`, `Pages`).
*   **Data Flow:** While authentication and Help Desk ticket features fetch data dynamically from the backend APIs, most operational tracking modules (IT Assets, AMC, Networking, Email Logs) currently rely on static JSON representations sourced from `src/data/mockData.js`.

## 4. Backend Architecture
*   **Server Setup:** A single Express application (`server/index.js`) processes API requests and conditionally serves the Vite frontend build in production mode.
*   **Authentication & Session Middleware:** Custom middleware (`requireAuth`) inspects the `csc_session` HTTP-only cookie, hashes the token using SHA-256, and validates it against the PostgreSQL database.
*   **CSRF Middleware:** `requireCsrf` validates the `x-csrf-token` header against the CSRF token stored in the current user's session record.
*   **Modularization:** Database connection, pool setup, and table initialization are separated into `server/db.js`. Cryptography and session utilities (password hashing, token generation) are encapsulated in `server/security.js`.

## 5. Database Schema Analysis
The application uses PostgreSQL and auto-initializes the following tables:
*   `app_users`: Stores user accounts with fields for `id` (Primary Key), `username` (Unique), `display_name`, `role`, `password_hash`, `is_active`, and timestamps.
*   `user_sessions`: Manages active sessions, linking back to `app_users` via a foreign key with cascading deletes. It includes `token_hash` (Unique), `csrf_token`, and `expires_at` to invalidate idle or expired sessions. Indexed by `expires_at`.
*   `helpdesk_tickets`: Contains IT support ticket data, including `ticket_no` (Unique, auto-generated sequence), `requester`, `department`, `subject`, `description`, `category`, `priority`, `status`, `assigned_to`, `sla`, `created_by` (Foreign Key to `app_users`), and resolution timestamps. Indexed by `status` and `created_at`.

## 6. Authentication & Authorization Flow
*   **Setup:** On the first launch, the system prompts for a one-time setup requiring the server's private `SETUP_KEY` (from `.env`). This provisions the initial administrator account.
*   **Login:** The user submits credentials to `/api/auth/login`. The server verifies the password using the `scrypt` hashing algorithm. Upon success, it generates a random session token and a CSRF token.
*   **Session Storage:** The raw session token is sent to the client via an `HttpOnly`, `SameSite=Strict` cookie, while its SHA-256 hash is saved to the database. The client is given the CSRF token in the JSON response payload.
*   **Authenticated Requests:** The frontend's `apiRequest` utility automatically attaches the CSRF token via the `x-csrf-token` header to all non-GET requests. The server validates both the session cookie and the CSRF header.

## 7. API Structure
The backend exposes a REST-like API:
*   **Auth Endpoints:**
    *   `GET /api/auth/status` (Check if initialized)
    *   `POST /api/auth/setup` (Initial admin creation)
    *   `POST /api/auth/login` (Create session)
    *   `GET /api/auth/me` (Get current user)
    *   `POST /api/auth/logout` (Destroy session)
*   **User Management:**
    *   `POST /api/users` (Create new user - Admin only)
*   **Help Desk:**
    *   `GET /api/helpdesk/tickets` (List all tickets)
    *   `POST /api/helpdesk/tickets` (Create ticket)
    *   `PATCH /api/helpdesk/tickets/:ticketNo` (Update ticket status/assignment)

## 8. Security Assessment
*   **Strengths:** Uses strong password hashing (`scrypt`), secure `HttpOnly` cookies for session management, hashed session tokens in the database, and strict CSRF protection.
*   **Lack of Broad Rate Limiting:** While login and setup endpoints use `express-rate-limit`, the rest of the API lacks rate-limiting, increasing vulnerability to DoS attacks.
*   **Missing Role-Based Access Control (RBAC):** Although a `role` field exists, operational endpoints (like Help Desk ticket updates) do not enforce role checks. Any authenticated user can modify ticket statuses.
*   **Pagination:** Database queries fetch entire tables without pagination (`LIMIT`/`OFFSET`), posing a performance and DoS risk as data grows.
*   **Mock Data Dependency:** The reliance on frontend mock data obscures the fact that key security monitoring features are not actually processing or validating real telemetry.

## 9. Missing Features & Modules
*   **Telemetry Ingestion APIs:** No backend endpoints exist to receive live data from endpoint agents (USB events, malware alerts, network traffic).
*   **Backend CRUD for Assets & Operations:** IT Assets, AMC Tracking, Maintenance Logs, and Audit Logs lack corresponding database tables and API endpoints; they exist solely as frontend UI components.
*   **User Management UI Integration:** The "Users & Access" page uses mock data and is not connected to the `/api/users` backend endpoint or database user lists.
*   **Notification Engine:** No integration for email (SMTP) or SMS notifications for critical alerts or ticket updates.
*   **Third-Party Integrations:** Missing connections to external Active Directory/LDAP, SIEM, or EDR systems.

## 10. Performance Recommendations
*   **Implement Database Pagination:** Add limit/offset or cursor-based pagination to the `/api/helpdesk/tickets` endpoint and any future data-heavy endpoints.
*   **Frontend Data Fetching:** Replace raw `useEffect`/`fetch` calls with a dedicated data-fetching library like React Query or SWR to handle caching, deduplication, and background updates efficiently.
*   **Asset Optimization:** Ensure Vite build optimizations are tuned for production, potentially implementing code splitting by route (React.lazy) to reduce the initial JS bundle size.
*   **Database Indexing:** As tables for logs and telemetry are added, ensure comprehensive indexing strategies on timestamp and foreign key columns to maintain read performance.

## 11. Deployment Architecture
*   **Current State:** Designed to run as a unified Node.js server where Express serves both the APIs and the static Vite build artifacts.
*   **Production Recommendation:**
    *   **Reverse Proxy:** Place the Node.js server behind an Nginx or HAProxy instance for TLS termination and static file serving.
    *   **Process Management:** Use PM2 or a Docker container orchestration system (Kubernetes/ECS) to manage and scale the Node.js process.
    *   **Database Host:** Deploy PostgreSQL on a managed service (e.g., AWS RDS, GCP Cloud SQL) outside of the application server with strict firewall rules.
    *   **Secrets:** Move `.env` configurations to a secure Secret Manager.

## 12. Development Roadmap
*   **Phase 1: Backend Data Parity:** Design PostgreSQL schema and build REST APIs for IT Assets, AMC Contracts, Maintenance Logs, and Audit Logs to replace all frontend mock data.
*   **Phase 2: RBAC & Validation:** Implement robust schema validation (e.g., Zod) and formalize role-based access control middleware (Admin vs. Staff vs. Analyst) across all modifying endpoints. Implement API pagination.
*   **Phase 3: User Management Completion:** Wire the frontend "Users & Access" page to live backend APIs to permit dynamic onboarding and role assignment.
*   **Phase 4: Telemetry Ingestion APIs:** Build secure, high-throughput ingestion endpoints for endpoint agents to report telemetry, secured via API keys or mTLS.
*   **Phase 5: Notification Services:** Integrate a mailing service (e.g., NodeMailer, SendGrid) to dispatch alerts for critical security events and IT SLA breaches.
*   **Phase 6: Live Threat Integrations:** Develop polling or webhook mechanisms to ingest real alerts from existing hospital security infrastructure (firewalls, EDR solutions).
