import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { RecipesPayload } from "./types.js";

const cacheFilePath = path.join(process.cwd(), "server", "data", "recipe-cache.json");

type CacheStore = Record<string, RecipesPayload>;

let memoryCache: CacheStore | null = null;

async function ensureCacheLoaded() {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const raw = await readFile(cacheFilePath, "utf8");
    memoryCache = JSON.parse(raw) as CacheStore;
  } catch {
    memoryCache = {};
  }

  return memoryCache;
}

export async function getCachedRecipes(cacheKey: string) {
  const cache = await ensureCacheLoaded();
  return cache[cacheKey] ?? null;
}

export async function setCachedRecipes(cacheKey: string, payload: RecipesPayload) {
  const cache = await ensureCacheLoaded();
  cache[cacheKey] = payload;

  try {
    await mkdir(path.dirname(cacheFilePath), { recursive: true });
    await writeFile(cacheFilePath, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // Keep the cache in memory if the hosting environment does not allow writes.
  }
}
