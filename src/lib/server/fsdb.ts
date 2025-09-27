import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "src", "data");

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const p = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(p, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

export async function writeJSON<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  const p = path.join(DATA_DIR, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}
