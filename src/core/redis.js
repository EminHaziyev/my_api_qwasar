import Redis from 'ioredis';

let client;

function isCacheEnabled() {
  const url = process.env.REDIS_URL;
  if (!url) return true; // default to local redis if not set
  if (url === 'disable') return false; // allow disabling via env
  return true;
}

export function getRedis() {
  if (!isCacheEnabled()) return null;
  if (!client) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    client = new Redis(url);
    client.on('error', (e) => console.error('Redis error', e));
  }
  return client;
}

export async function cacheGet(key) {
  try {
    const c = getRedis();
    if (!c) return null;
    const val = await c.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = 60) {
  try {
    const c = getRedis();
    if (!c) return;
    await c.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // fail-soft
  }
}

export async function cacheDel(patternOrKey) {
  try {
    const c = getRedis();
    if (!c) return;
    if (!patternOrKey.includes('*')) {
      await c.del(patternOrKey);
      return;
    }
    const keys = await c.keys(patternOrKey);
    if (keys.length) await c.del(keys);
  } catch {
    // fail-soft
  }
}


