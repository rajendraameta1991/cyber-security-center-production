# Cyber Security Center

Hospital cybersecurity monitoring dashboard with production-ready authentication foundations.

## Authentication features

- PostgreSQL-backed users and sessions
- One-time initial administrator creation
- Password hashing with Node.js `scrypt` and random salts
- Random server-side session tokens stored as SHA-256 hashes
- Secure `httpOnly`, `sameSite=strict` session cookie
- CSRF token verification for logout and user creation
- Login rate limiting and Helmet security headers
- Protected dashboard routes and authenticated profile menu

## Local setup

### 1. Install PostgreSQL

Install PostgreSQL, then create an empty database:

```sql
CREATE DATABASE cyber_security_center;
```

### 2. Configure environment

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Open `.env` and update:

```text
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@127.0.0.1:5432/cyber_security_center
SETUP_KEY=CREATE_A_PRIVATE_RANDOM_KEY_WITH_AT_LEAST_16_CHARACTERS
```

Do not share `.env` or commit it to source control.

### 3. Install packages

```powershell
npm install
```

### 4. Start the backend

Open the first VS Code terminal:

```powershell
npm run dev:server
```

The backend creates the required PostgreSQL tables automatically.

### 5. Start the frontend

Open a second VS Code terminal:

```powershell
npm run dev
```

Open `http://localhost:5173`.

### 6. Create the initial admin

The first screen asks for:

- Server setup key: the private `SETUP_KEY` value from `.env`
- Display name
- Username
- Password: at least 12 characters with uppercase, lowercase, and a number

After the first admin is created, the one-time setup screen is disabled.

## Production deployment

Build the frontend:

```powershell
npm run build
```

Configure `NODE_ENV=production`, a production PostgreSQL connection, TLS termination through a reverse proxy, and a private `SETUP_KEY`. Start the unified server:

```powershell
npm start
```

Use HTTPS in production. Restrict database access to the backend host and store secrets in the hosting provider's secret manager.

## Monitoring modules

- SOC dashboard with charts and endpoint status
- Computer inventory and details modal
- Activity monitor, email uploads, malware alerts, and USB logs
- Software inventory and network analytics
- Reports, user access UI, audit logs, and settings

Monitoring telemetry is still demo data. Authentication is connected to PostgreSQL, but endpoint agents and live security APIs must be integrated before hospital deployment.
