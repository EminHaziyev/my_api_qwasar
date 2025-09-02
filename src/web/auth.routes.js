import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { loadJsonSafe, saveJson, getUsersFilePath } from '../core/store.js';

export const router = express.Router();

function signToken(user) {
  const payload = { sub: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1h' });
}

export function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const users = loadJsonSafe(getUsersFilePath(), []);
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token });
});

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const users = loadJsonSafe(getUsersFilePath(), []);
  if (users.find(u => u.username === username)) return res.status(400).json({ error: 'username taken' });
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const passwordHash = bcrypt.hashSync(password, 10);
  users.push({ id, username, passwordHash, role: 'user' });
  saveJson(getUsersFilePath(), users);
  res.status(201).json({ id, username });
});

export default router;


