import express from 'express';
import { authRequired } from './auth.routes.js';
import { loadJsonSafe, saveJson, getAnimalsFilePath } from '../core/store.js';
import { ensureSeeded } from '../core/seed.js';
import { cacheGet, cacheSet, cacheDel } from '../core/redis.js';

export const router = express.Router();

ensureSeeded();

function readAll() {
  return loadJsonSafe(getAnimalsFilePath(), []);
}

function writeAll(data) {
  saveJson(getAnimalsFilePath(), data);
}

/**
 * @openapi
 * /api/animals:
 *   get:
 *     summary: List animals (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, maximum: 20 }
 *     responses:
 *       200:
 *         description: List of animals
 */
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 20));
  const key = `animals:list:page=${page}:limit=${limit}`;

  const cached = await cacheGet(key);
  if (cached) return res.json(cached);

  const items = readAll();
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  const payload = { page, limit, total: items.length, data: paged };
  await cacheSet(key, payload, 60);
  res.json(payload);
});

/**
 * @openapi
 * /api/animals/{id}:
 *   get:
 *     summary: Get animal by id
 */
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const key = `animals:item:${id}`;
  const cached = await cacheGet(key);
  if (cached) return res.json(cached);
  const items = readAll();
  const found = items.find(a => a.id === id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  await cacheSet(key, found, 60);
  res.json(found);
});

/**
 * @openapi
 * /api/animals:
 *   post:
 *     summary: Create animal (auth required)
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authRequired, async (req, res) => {
  const { name, species, habitat, weightKg } = req.body || {};
  if (!name || !species) return res.status(400).json({ error: 'name and species required' });
  const items = readAll();
  const id = items.length ? Math.max(...items.map(a => a.id)) + 1 : 1;
  const created = { id, name, species, habitat: habitat || null, weightKg: weightKg ?? null, createdAt: new Date().toISOString() };
  items.push(created);
  writeAll(items);
  await cacheDel('animals:list:*');
  res.status(201).json(created);
});

/**
 * @openapi
 * /api/animals/{id}:
 *   put:
 *     summary: Update animal (auth required)
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authRequired, async (req, res) => {
  const id = parseInt(req.params.id);
  const items = readAll();
  const idx = items.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const current = items[idx];
  const updated = { ...current, ...req.body };
  items[idx] = updated;
  writeAll(items);
  await cacheDel(`animals:item:${id}`);
  await cacheDel('animals:list:*');
  res.json(updated);
});

/**
 * @openapi
 * /api/animals/{id}:
 *   delete:
 *     summary: Delete animal (auth required)
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authRequired, async (req, res) => {
  const id = parseInt(req.params.id);
  const items = readAll();
  const idx = items.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [removed] = items.splice(idx, 1);
  writeAll(items);
  await cacheDel(`animals:item:${id}`);
  await cacheDel('animals:list:*');
  res.json({ deleted: removed.id });
});

export default router;


