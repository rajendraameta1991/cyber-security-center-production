import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { initializeDatabase, pool } from './db.js'
import {
  cleanUsername, clearSessionCookie, createSessionValues, getSessionToken, hashPassword,
  hashToken, setSessionCookie, validateAccount, verifyPassword,
} from './security.js'

const app = express()
const port = Number(process.env.PORT || 3001)
const sessionHours = Math.max(1, Number(process.env.SESSION_HOURS || 8))
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(__dirname, '..', 'dist')

app.disable('x-powered-by')
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json({ limit: '32kb' }))
app.use(cookieParser())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
})

async function deleteExpiredSessions() {
  await pool.query('DELETE FROM user_sessions WHERE expires_at <= NOW()')
}

async function readSession(req) {
  const token = getSessionToken(req)
  if (!token) return null
  const { rows } = await pool.query(`
    SELECT s.id AS session_id, s.csrf_token, s.expires_at,
      u.id, u.username, u.display_name, u.role
    FROM user_sessions s
    JOIN app_users u ON u.id = s.user_id
    WHERE s.token_hash = $1 AND s.expires_at > NOW() AND u.is_active = TRUE
  `, [hashToken(token)])
  return rows[0] || null
}

async function requireAuth(req, res, next) {
  try {
    const session = await readSession(req)
    if (!session) return res.status(401).json({ error: 'Authentication required.' })
    req.session = session
    next()
  } catch (error) {
    next(error)
  }
}

function requireCsrf(req, res, next) {
  if (req.get('x-csrf-token') !== req.session.csrf_token) {
    return res.status(403).json({ error: 'Invalid CSRF token.' })
  }
  next()
}

function publicUser(user) {
  return { id: user.id, username: user.username, displayName: user.display_name, role: user.role }
}

function ticketResponse(row) {
  if (!row) throw new Error('Ticket database operation did not return a row.')
  return {
    id: row.ticket_no,
    requester: row.requester,
    department: row.department,
    subject: row.subject,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    assignedTo: row.assigned_to,
    sla: row.sla,
    created: row.created,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
  }
}

function cleanTicketPayload(body) {
  const ticket = {
    requester: String(body.requester || '').trim(),
    department: String(body.department || '').trim(),
    subject: String(body.subject || '').trim(),
    description: String(body.description || '').trim(),
    category: String(body.category || '').trim(),
    priority: String(body.priority || '').trim(),
    assignedTo: String(body.assignedTo || 'Unassigned').trim() || 'Unassigned',
  }
  if (ticket.requester.length < 2) return { error: 'Requester name is required.' }
  if (ticket.department.length < 2) return { error: 'Department is required.' }
  if (ticket.subject.length < 5) return { error: 'Complaint subject must contain at least 5 characters.' }
  if (!['PC', 'Printer', 'Camera', 'Biometric', 'Network', 'Software', 'Other'].includes(ticket.category)) return { error: 'Invalid category.' }
  if (!['Critical', 'High', 'Medium', 'Low'].includes(ticket.priority)) return { error: 'Invalid priority.' }
  return { ticket }
}

function slaForPriority(priority) {
  return { Critical: '30m left', High: '2h 00m left', Medium: '4h 00m left', Low: '8h 00m left' }[priority] || '4h 00m left'
}

function assertValidStatus(status) {
  return ['Open', 'In Progress', 'Working', 'Resolved', 'Escalated'].includes(status)
}

app.get('/api/auth/status', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT EXISTS(SELECT 1 FROM app_users) AS initialized')
    res.json({ initialized: rows[0].initialized })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/setup', authLimiter, async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { setupKey, username, displayName, password } = req.body
    if (!process.env.SETUP_KEY || process.env.SETUP_KEY.length < 16) {
      return res.status(503).json({ error: 'Server SETUP_KEY must be configured with at least 16 characters.' })
    }
    if (setupKey !== process.env.SETUP_KEY) return res.status(403).json({ error: 'Invalid setup key.' })
    const validationError = validateAccount({ username, displayName, password })
    if (validationError) return res.status(400).json({ error: validationError })
    await client.query('BEGIN')
    await client.query('LOCK TABLE app_users IN EXCLUSIVE MODE')
    const { rows: existing } = await client.query('SELECT EXISTS(SELECT 1 FROM app_users) AS initialized')
    if (existing[0].initialized) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Initial administrator already exists.' })
    }
    const passwordHash = await hashPassword(password)
    const { rows } = await client.query(`
      INSERT INTO app_users (username, display_name, role, password_hash)
      VALUES ($1, $2, 'admin', $3)
      RETURNING id, username, display_name, role
    `, [cleanUsername(username), String(displayName).trim(), passwordHash])
    await client.query('COMMIT')
    res.status(201).json({ user: publicUser(rows[0]) })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    next(error)
  } finally {
    client.release()
  }
})

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const username = cleanUsername(req.body.username)
    const { rows } = await pool.query('SELECT * FROM app_users WHERE username = $1 AND is_active = TRUE', [username])
    const user = rows[0]
    if (!user || !(await verifyPassword(String(req.body.password || ''), user.password_hash))) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }
    await deleteExpiredSessions()
    const { token, tokenHash, csrfToken } = createSessionValues()
    const expiresAt = new Date(Date.now() + sessionHours * 60 * 60 * 1000)
    await pool.query('INSERT INTO user_sessions (user_id, token_hash, csrf_token, expires_at) VALUES ($1, $2, $3, $4)', [user.id, tokenHash, csrfToken, expiresAt])
    setSessionCookie(res, token, expiresAt)
    res.json({ user: publicUser(user), csrfToken })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.session), csrfToken: req.session.csrf_token })
})

app.post('/api/auth/logout', requireAuth, requireCsrf, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM user_sessions WHERE id = $1', [req.session.session_id])
    clearSessionCookie(res)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/users', requireAuth, requireCsrf, async (req, res, next) => {
  try {
    if (req.session.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' })
    const { username, displayName, password, role = 'staff' } = req.body
    const validationError = validateAccount({ username, displayName, password })
    if (validationError) return res.status(400).json({ error: validationError })
    if (!['admin', 'staff', 'analyst'].includes(role)) return res.status(400).json({ error: 'Invalid role.' })
    const passwordHash = await hashPassword(password)
    const { rows } = await pool.query(`
      INSERT INTO app_users (username, display_name, role, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, display_name, role
    `, [cleanUsername(username), String(displayName).trim(), role, passwordHash])
    res.status(201).json({ user: publicUser(rows[0]) })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Username already exists.' })
    next(error)
  }
})

app.get('/api/helpdesk/tickets', requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT *, CASE
        WHEN created_at > NOW() - INTERVAL '1 minute' THEN 'Just now'
        WHEN created_at > NOW() - INTERVAL '1 hour' THEN FLOOR(EXTRACT(EPOCH FROM (NOW() - created_at)) / 60)::INT || ' min ago'
        WHEN created_at > NOW() - INTERVAL '1 day' THEN FLOOR(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600)::INT || ' hr ago'
        ELSE TO_CHAR(created_at, 'Mon DD, YYYY')
      END AS created
      FROM helpdesk_tickets
      ORDER BY created_at DESC
    `)
    res.json({ tickets: rows.map(ticketResponse) })
  } catch (error) {
    next(error)
  }
})

app.post('/api/helpdesk/tickets', requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const { ticket, error } = cleanTicketPayload(req.body)
    if (error) return res.status(400).json({ error })
    const createdBy = req.session?.id || null
    const { rows } = await pool.query(`
      WITH next_ticket AS (
        SELECT nextval(pg_get_serial_sequence('helpdesk_tickets', 'id')) AS id
      )
      INSERT INTO helpdesk_tickets
        (id, ticket_no, requester, department, subject, description, category, priority, assigned_to, sla, created_by)
      SELECT
        next_ticket.id,
        'HD-' || LPAD(next_ticket.id::TEXT, 4, '0'),
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      FROM next_ticket
      RETURNING *, 'Just now' AS created
    `, [ticket.requester, ticket.department, ticket.subject, ticket.description, ticket.category, ticket.priority, ticket.assignedTo, slaForPriority(ticket.priority), createdBy])
    res.status(201).json({ ticket: ticketResponse(rows[0]) })
  } catch (error) {
    next(error)
  }
})

app.patch('/api/helpdesk/tickets/:ticketNo', requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const ticketNo = String(req.params.ticketNo || '').trim().toUpperCase()
    const status = String(req.body.status || '').trim()
    const assignedTo = String(req.body.assignedTo || '').trim()
    if (status && !assertValidStatus(status)) return res.status(400).json({ error: 'Invalid ticket status.' })
    const { rows } = await pool.query(`
      UPDATE helpdesk_tickets
      SET
        status = COALESCE(NULLIF($2, ''), status),
        assigned_to = COALESCE(NULLIF($3, ''), assigned_to),
        resolved_at = CASE WHEN $2 = 'Resolved' THEN NOW() ELSE resolved_at END,
        updated_at = NOW()
      WHERE ticket_no = $1
      RETURNING *, CASE
        WHEN created_at > NOW() - INTERVAL '1 minute' THEN 'Just now'
        WHEN created_at > NOW() - INTERVAL '1 hour' THEN FLOOR(EXTRACT(EPOCH FROM (NOW() - created_at)) / 60)::INT || ' min ago'
        WHEN created_at > NOW() - INTERVAL '1 day' THEN FLOOR(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600)::INT || ' hr ago'
        ELSE TO_CHAR(created_at, 'Mon DD, YYYY')
      END AS created
    `, [ticketNo, status, assignedTo])
    if (!rows[0]) return res.status(404).json({ error: 'Ticket not found.' })
    res.json({ ticket: ticketResponse(rows[0]) })
  } catch (error) {
    next(error)
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(dist, { maxAge: '1h' }))
  app.get('*splat', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : error.message,
  })
})

await initializeDatabase()
app.listen(port, '127.0.0.1', () => console.log(`Cyber Security Center API listening on http://127.0.0.1:${port}`))
