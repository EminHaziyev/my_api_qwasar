import Redis from 'ioredis';

let client;

export function getRedis() {
  if (!client) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    client = new Redis(url);
    client.on('error', (e) => console.error('Redis error', e));
  }
  return client;
}

export async function cacheGet(key) {
  const c = getRedis();
  const val = await c.get(key);
  return val ? JSON.parse(val) : null;
}

export async function cacheSet(key, value, ttlSeconds = 60) {
  const c = getRedis();
  await c.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function cacheDel(patternOrKey) {
  const c = getRedis();
  if (!patternOrKey.includes('*')) {
    await c.del(patternOrKey);
    return;
  }
  const keys = await c.keys(patternOrKey);
  if (keys.length) await c.del(keys);
}


