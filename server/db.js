import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
})

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id BIGSERIAL PRIMARY KEY,
      username VARCHAR(64) NOT NULL UNIQUE,
      display_name VARCHAR(120) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'admin',
      password_hash TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      token_hash CHAR(64) NOT NULL UNIQUE,
      csrf_token CHAR(64) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx
      ON user_sessions(expires_at);

    CREATE TABLE IF NOT EXISTS helpdesk_tickets (
      id BIGSERIAL PRIMARY KEY,
      ticket_no VARCHAR(24) UNIQUE,
      requester VARCHAR(120) NOT NULL,
      department VARCHAR(80) NOT NULL,
      subject VARCHAR(220) NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category VARCHAR(40) NOT NULL,
      priority VARCHAR(16) NOT NULL,
      status VARCHAR(24) NOT NULL DEFAULT 'Open',
      assigned_to VARCHAR(120) NOT NULL DEFAULT 'Unassigned',
      sla VARCHAR(40) NOT NULL DEFAULT '4h 00m left',
      created_by BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      resolved_at TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS helpdesk_tickets_status_idx
      ON helpdesk_tickets(status);

    CREATE INDEX IF NOT EXISTS helpdesk_tickets_created_at_idx
      ON helpdesk_tickets(created_at DESC);
  `)

  await pool.query(`
    UPDATE helpdesk_tickets
    SET ticket_no = 'HD-' || LPAD(id::TEXT, 4, '0')
    WHERE ticket_no IS NULL;
  `)

  await pool.query(`
    INSERT INTO helpdesk_tickets
      (ticket_no, requester, department, subject, description, category, priority, status, assigned_to, sla, created_at)
    SELECT * FROM (VALUES
      ('HD-1028', 'Dr. Maya Patel', 'Outpatient', 'OPD printer not printing prescriptions', 'Prescription printer is showing queue pending and staff cannot print OPD prescriptions.', 'Printer', 'High', 'Open', 'Riya Malhotra', '1h 50m left', NOW() - INTERVAL '10 minutes'),
      ('HD-1027', 'Nurse Leah Kim', 'Emergency', 'Workstation login slow after update', 'Emergency workstation takes too long after latest Windows update.', 'PC', 'Medium', 'In Progress', 'Kabir Verma', '3h 18m left', NOW() - INTERVAL '42 minutes'),
      ('HD-1026', 'Security Desk', 'Security', 'Emergency gate camera feed offline', 'Camera stream is unavailable in security room monitoring wall.', 'Camera', 'Critical', 'Escalated', 'Aarav Sharma', '28m left', NOW() - INTERVAL '1 hour'),
      ('HD-1025', 'HR Team', 'HR', 'Biometric attendance mismatch', 'Attendance records are not matching staff punch timing.', 'Biometric', 'Medium', 'Open', 'Priya Nair', '2h 05m left', NOW() - INTERVAL '2 hours'),
      ('HD-1024', 'Billing Counter', 'Billing', 'Billing printer toner low', 'Printer toner was replaced and billing team confirmed printing is restored.', 'Printer', 'Low', 'Resolved', 'Riya Malhotra', 'Completed', NOW() - INTERVAL '1 day')
    ) AS sample(ticket_no, requester, department, subject, description, category, priority, status, assigned_to, sla, created_at)
    WHERE NOT EXISTS (SELECT 1 FROM helpdesk_tickets);
  `)
}
