import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const KEY_LENGTH = 64
const SESSION_COOKIE = 'csc_session'

export function cleanUsername(value = '') {
  return String(value).trim().toLowerCase()
}

export function validateAccount({ username, displayName, password }) {
  if (!/^[a-z0-9._-]{3,64}$/.test(cleanUsername(username))) {
    return 'Username must be 3-64 characters and use letters, numbers, dot, underscore, or hyphen.'
  }
  if (String(displayName || '').trim().length < 2) return 'Display name is required.'
  if (String(password || '').length < 12) return 'Password must contain at least 12 characters.'
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include uppercase, lowercase, and numeric characters.'
  }
  return null
}

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const derivedKey = await scrypt(password, salt, KEY_LENGTH)
  return `scrypt:${salt.toString('hex')}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password, storedHash = '') {
  const [algorithm, saltHex, keyHex] = storedHash.split(':')
  if (algorithm !== 'scrypt' || !saltHex || !keyHex) return false
  const storedKey = Buffer.from(keyHex, 'hex')
  const derivedKey = await scrypt(password, Buffer.from(saltHex, 'hex'), storedKey.length)
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey)
}

export function createSessionValues() {
  const token = randomBytes(32).toString('hex')
  return { token, tokenHash: hashToken(token), csrfToken: randomBytes(32).toString('hex') }
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

export function setSessionCookie(res, token, expiresAt) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  })
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
}

export function getSessionToken(req) {
  return req.cookies[SESSION_COOKIE]
}
