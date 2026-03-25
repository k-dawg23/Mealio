import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Recipe } from "./types.js";
import { createRecipeIdentity } from "./recipeIdentity.js";

const cacheFilePath = path.join(process.cwd(), "server", "data", "recipe-image-cache.json");
export const generatedImagesDir = path.join(process.cwd(), "server", "data", "generated-images");

interface RecipeImageCacheEntry {
  fileName: string;
  relativeUrl: string;
}

type ImageCacheStore = Record<string, RecipeImageCacheEntry>;

let memoryCache: ImageCacheStore | null = null;

async function ensureCacheLoaded() {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const raw = await readFile(cacheFilePath, "utf8");
    memoryCache = JSON.parse(raw) as ImageCacheStore;
  } catch {
    memoryCache = {};
  }

  return memoryCache;
}

type ImageIdentityRecipe = Omit<Recipe, "recipeKey"> & { recipeKey?: string };

export function getRecipeImageKey(recipe: ImageIdentityRecipe) {
  return recipe.recipeKey || createRecipeIdentity(recipe);
}

export function getRecipeImageFileName(cacheKey: string) {
  const digest = createHash("sha1").update(cacheKey).digest("hex");
  return `${digest}.webp`;
}

export async function getCachedRecipeImage(cacheKey: string) {
  const cache = await ensureCacheLoaded();
  return cache[cacheKey] ?? null;
}

export async function setCachedRecipeImage(cacheKey: string, fileName: string) {
  const cache = await ensureCacheLoaded();
  cache[cacheKey] = {
    fileName,
    relativeUrl: `/generated-images/${fileName}`
  };

  try {
    await mkdir(path.dirname(cacheFilePath), { recursive: true });
    await writeFile(cacheFilePath, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // Keep the image cache in memory if the host cannot persist files.
  }

  return cache[cacheKey];
}
