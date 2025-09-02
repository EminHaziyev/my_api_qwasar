import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const animalsFile = path.join(dataDir, 'animals.json');
const usersFile = path.join(dataDir, 'users.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function loadJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getAnimalsFilePath() { return animalsFile; }
export function getUsersFilePath() { return usersFile; }


