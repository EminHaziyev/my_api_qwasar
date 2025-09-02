import { loadJsonSafe, saveJson, getAnimalsFilePath, getUsersFilePath } from './store.js';
import bcrypt from 'bcryptjs';

function pseudoRandom(seed) {
  let x = seed;
  return () => (x = (x * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

export function ensureSeeded() {
  // Seed users with one admin
  const usersFile = getUsersFilePath();
  const users = loadJsonSafe(usersFile, null);
  if (!users) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    saveJson(usersFile, [
      { id: 1, username: 'admin', passwordHash, role: 'admin' }
    ]);
    console.log('Seeded default user: admin / admin123');
  }

  // Seed animals with >=1500 entries if not present
  const animalsFile = getAnimalsFilePath();
  const animals = loadJsonSafe(animalsFile, null);
  if (!animals) {
    const rand = pseudoRandom(42);
    const species = ['Lion','Tiger','Bear','Elephant','Giraffe','Zebra','Wolf','Fox','Deer','Kangaroo'];
    const habitats = ['Savannah','Jungle','Forest','Desert','Mountains','Plains'];
    const items = [];
    const total = 1500;
    for (let i = 1; i <= total; i++) {
      const s = species[Math.floor(rand() * species.length)];
      const h = habitats[Math.floor(rand() * habitats.length)];
      items.push({
        id: i,
        name: `${s} ${i}`,
        species: s,
        habitat: h,
        weightKg: Math.round(rand() * 400 + 20),
        createdAt: new Date().toISOString()
      });
    }
    saveJson(animalsFile, items);
    console.log(`Seeded animals dataset with ${total} items`);
  }
}


