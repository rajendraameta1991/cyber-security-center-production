# Hospital Cyber Security Center - Codebase Analysis

## 1. Executive Summary
The Hospital Cyber Security Center is a full-stack web application designed to monitor IT operations, network performance, and cybersecurity threats within a hospital environment. It features a modern, responsive single-page application (SPA) frontend and a Node.js backend integrated with a PostgreSQL database. The application currently employs a robust initial setup process for administrator creation, session-based authentication using secure cookies, and role-based access control. The dashboard provides comprehensive views of computer status, network traffic, malware alerts, and helpdesk operations, primarily populated by mock data for demonstration purposes. The codebase is well-structured, utilizing modern JavaScript/React paradigms and a clear separation of concerns between the client and server.

## 2. Technology Stack
*   **Frontend:**
    *   **Framework:** React 18
    *   **Routing:** React Router DOM v7
    *   **Styling:** Tailwind CSS with Autoprefixer and PostCSS
    *   **Icons:** Lucide React
    *   **Charting:** Recharts
    *   **Build Tool:** Vite
*   **Backend:**
    *   **Runtime:** Node.js
    *   **Framework:** Express 5
    *   **Database:** PostgreSQL (via `pg` driver)
    *   **Security:** Helmet, Express Rate Limit
    *   **Authentication:** Node.js native `crypto` module (`scrypt` for password hashing), custom session management with CSRF tokens.
*   **Other Tools:**
    *   **Environment Variables:** `dotenv`
    *   **Cookie Parsing:** `cookie-parser`

## 3. Frontend Architecture
The frontend is a React Single Page Application (SPA) structured around functional components and hooks.
*   **Entry Point (`src/main.jsx`):** Bootstraps the application, wrapping it in `BrowserRouter`, `AuthProvider`, and `SecurityProvider`.
*   **Routing (`src/App.jsx`):** Defines the application's routes using `react-router-dom`. Routes are protected; unauthenticated users are redirected to the `AuthPage`.
*   **Context API:**
    *   **`AuthContext.jsx`:** Manages user authentication state, session refreshing, login, logout, and the initial setup process. It also handles CSRF token inclusion for API requests.
    *   **`SecurityContext.jsx`:** Provides application-wide state for search, sidebar visibility, selected computers, and distributes mock data (activities, computers, threats, stats) to components.
*   **Components (`src/components/`):** Reusable UI elements like `Layout`, `Sidebar`, `Header`, modals (`ComputerModal`, `LiveTrafficModal`), and generic UI wrappers (`PageTitle`, `Panel`, `StatCard`, `Badge`).
*   **Pages (`src/pages/`):** Represents specific views (e.g., `Dashboard`, `Computers`, `NetworkMonitor`, `HelpDesk`, `AuthPage`).
*   **Data Layer:** Currently relies heavily on `src/data/mockData.js` for populating tables and charts, indicating that real API integrations for telemetry are pending.

## 4. Backend Architecture
The backend is a monolithic Express application built to serve API endpoints and, in production, the built React static files.
*   **Entry Point (`server/index.js`):** Configures middleware (Helmet, rate limiting, JSON parsing, cookie parsing), defines API routes, serves static files in production, and starts the server.
*   **Database Layer (`server/db.js`):** Establishes the PostgreSQL connection pool and contains the `initializeDatabase` function, which automatically creates necessary tables (`app_users`, `user_sessions`, `helpdesk_tickets`) and seeds initial data on startup.
*   **Security & Authentication (`server/security.js`):** Contains utility functions for password hashing (using `scrypt`), verifying passwords, generating secure random session tokens, and managing CSRF tokens.
*   **API Routes:** Includes endpoints for authentication (`/api/auth/*`), user management (`/api/users`), and helpdesk operations (`/api/helpdesk/tickets`).

## 5. Database Schema Analysis
The application uses PostgreSQL with the following core tables:
*   **`app_users`:** Stores user credentials and roles.
    *   `id` (BIGSERIAL, Primary Key)
    *   `username` (VARCHAR(64), Unique)
    *   `display_name` (VARCHAR(120))
    *   `role` (VARCHAR(32), Default 'admin')
    *   `password_hash` (TEXT)
    *   `is_active` (BOOLEAN, Default TRUE)
    *   Timestamps: `created_at`, `updated_at`
*   **`user_sessions`:** Manages active user sessions.
    *   `id` (BIGSERIAL, Primary Key)
    *   `user_id` (BIGINT, Foreign Key to `app_users`)
    *   `token_hash` (CHAR(64), Unique)
    *   `csrf_token` (CHAR(64))
    *   `expires_at` (TIMESTAMPTZ)
    *   Timestamps: `created_at`
*   **`helpdesk_tickets`:** Stores IT support tickets.
    *   `id` (BIGSERIAL, Primary Key)
    *   `ticket_no` (VARCHAR(24), Unique)
    *   `requester`, `department`, `subject`, `description`, `category`, `priority`, `status`, `assigned_to`, `sla` (Various VARCHAR/TEXT fields)
    *   `created_by` (BIGINT, Foreign Key to `app_users`)
    *   Timestamps: `created_at`, `updated_at`, `resolved_at`
*   **Indexes:** Created on `user_sessions.expires_at`, `helpdesk_tickets.status`, and `helpdesk_tickets.created_at` for performance optimization.

## 6. Authentication & Authorization Flow
The application implements a robust, custom session-based authentication system:
1.  **Initial Setup:** If no users exist, a one-time `/api/auth/setup` endpoint allows creating the first admin user, requiring a server-side `SETUP_KEY` defined in the environment.
2.  **Login:** The `/api/auth/login` endpoint verifies credentials. Upon success, it generates a random session token and a CSRF token.
3.  **Session Storage:** The session token's hash and the CSRF token are stored in the `user_sessions` table.
4.  **Cookie Management:** The raw session token is sent to the client via an `httpOnly`, `sameSite=strict` cookie (`csc_session`). In production, it is marked as `secure`.
5.  **Authorization:** The `requireAuth` middleware validates the session cookie against the database on protected routes.
6.  **CSRF Protection:** The `requireCsrf` middleware verifies that the `x-csrf-token` header sent by the frontend matches the token stored in the user's active session for state-changing requests (POST, PATCH).
7.  **Role-Based Access Control (RBAC):** Minimal RBAC is present (e.g., creating users requires the 'admin' role).

## 7. API Structure
The RESTful API is structured under the `/api` namespace:
*   **Auth (`/api/auth`):**
    *   `GET /status`: Checks if the initial admin setup is complete.
    *   `POST /setup`: Creates the initial administrator account.
    *   `POST /login`: Authenticates a user and creates a session.
    *   `GET /me`: Returns the current authenticated user's profile and CSRF token.
    *   `POST /logout`: Invalidates the current session.
*   **Users (`/api/users`):**
    *   `POST /`: Creates a new user (requires 'admin' role).
*   **Helpdesk (`/api/helpdesk/tickets`):**
    *   `GET /`: Retrieves all tickets.
    *   `POST /`: Creates a new ticket.
    *   `PATCH /:ticketNo`: Updates ticket status or assignment.

## 8. Security Assessment
*   **Strengths:**
    *   Custom, strong password hashing using `scrypt` with random salts.
    *   Secure session management using `httpOnly` and `sameSite=strict` cookies.
    *   Explicit CSRF token implementation for mutating requests.
    *   Use of `helmet` for HTTP security headers.
    *   Rate limiting on authentication endpoints (`/setup`, `/login`) to mitigate brute-force attacks.
    *   Database connection enforces SSL in production.
*   **Areas for Improvement:**
    *   Lack of explicit input validation/sanitization libraries (e.g., Joi, Zod) for comprehensive payload checking, although manual checks are present.
    *   The `SETUP_KEY` mechanism relies entirely on the security of the environment file.
    *   The application currently lacks comprehensive logging for security events (login failures, authorization errors).

## 9. Missing Features & Modules
*   **Live Telemetry Integration:** Most dashboard data (computers, malware, network traffic) is currently mocked. Integration with actual endpoint agents (e.g., OSSEC, Wazuh) or network appliances is required.
*   **Comprehensive RBAC:** While roles ('admin', 'staff', 'analyst') exist, enforcement across all relevant endpoints and UI components is limited.
*   **Reporting Engine:** The "Reports" section currently displays UI elements without backend logic to generate actual PDF or Excel exports based on live data.
*   **Audit Logging Backend:** The UI has an "Audit Logs" section with mock data, but the backend does not actively log administrative actions or system events to a dedicated audit table.
*   **Asset Management Backend:** IT Asset and AMC tracking data are mocked. Database tables and API endpoints are needed to manage this inventory.

## 10. Performance Recommendations
*   **Database Indexing:** Ensure all foreign keys and frequently queried columns in future tables (e.g., telemetry data) are indexed.
*   **Query Optimization:** As data grows, monitor and optimize complex queries. Consider caching frequently accessed, rarely changing data.
*   **Frontend Data Fetching:** Implement data fetching libraries like React Query or SWR to manage caching, background updates, and pagination for large datasets (e.g., logs, computer lists).
*   **Code Splitting:** The Vite configuration handles this generally, but ensure lazy loading (`React.lazy`) is used for routes to reduce the initial bundle size.

## 11. Deployment Architecture
The recommended deployment involves a unified Node.js server handling both the API and serving the static React build.
*   **Environment:** A server running Node.js and an accessible PostgreSQL instance.
*   **Proxy:** A reverse proxy (e.g., Nginx, HAProxy) or load balancer is required to handle TLS/SSL termination (HTTPS) and route traffic to the Node.js application.
*   **Process Management:** Use a process manager like PM2 or Docker containers to ensure application uptime and restart on failure.
*   **Secrets Management:** Store `DATABASE_URL` and `SETUP_KEY` securely in a secrets manager or environment variables, not in version control.

## 12. Development Roadmap
1.  **Phase 1: Backend Data Integration (Next Steps)**
    *   Implement database models and API endpoints for IT Assets, AMC Contracts, and Maintenance Logs, replacing frontend mock data.
    *   Develop a comprehensive backend Audit Logging service.
2.  **Phase 2: Live Telemetry & Monitoring**
    *   Design and implement an API for receiving telemetry data from external agents (endpoints, network sensors).
    *   Update the frontend dashboards to consume live WebSockets or polled data instead of static mock files.
3.  **Phase 3: Advanced Features**
    *   Implement the Reporting engine for PDF/Excel generation.
    *   Refine Role-Based Access Control across all UI elements and API endpoints.
    *   Add alert notification integrations (e.g., Email, Slack, SMS).
4.  **Phase 4: Security & Scale**
    *   Conduct a comprehensive penetration test.
    *   Optimize database queries for high-volume telemetry ingestion.
    *   Implement horizontal scaling strategies if required.