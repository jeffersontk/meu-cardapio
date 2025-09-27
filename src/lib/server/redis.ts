import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
  if (client && client.isOpen) return client;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL não definida");
  client = createClient({ url });
  client.on("error", (err) => console.error("Redis error:", err));
  await client.connect();
  return client;
}

// helpers JSON simples
export async function rgetJSON<T>(key: string, fallback: T): Promise<T> {
  const r = await getRedis();
  const raw = await r.get(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}
export async function rsetJSON<T>(key: string, value: T) {
  const r = await getRedis();
  await r.set(key, JSON.stringify(value));
}
