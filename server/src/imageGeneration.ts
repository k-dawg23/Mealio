import OpenAI from "openai";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  generatedImagesDir,
  getCachedRecipeImage,
  getRecipeImageFileName,
  getRecipeImageKey,
  setCachedRecipeImage
} from "./imageCache.js";

const recipeSchema = z.object({
  id: z.string(),
  recipeKey: z.string().optional(),
  title: z.string(),
  description: z.string(),
  cookTime: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string())
});

type Recipe = z.infer<typeof recipeSchema>;

const inFlightGenerations = new Map<string, Promise<void>>();

function createImagePrompt(recipe: Recipe) {
  return [
    "Create an appetizing editorial food photograph of the finished dish.",
    `Dish: ${recipe.title}.`,
    `Description: ${recipe.description}.`,
    `Key ingredients: ${recipe.ingredients.slice(0, 8).join(", ")}.`,
    "Natural lighting, plated meal, realistic textures, no text, no labels, no people, no collage."
  ].join(" ");
}

async function generateRecipeImage(recipe: Recipe, cacheKey: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const client = new OpenAI({ apiKey });
  const result = await client.images.generate({
    model: "gpt-image-1-mini",
    prompt: createImagePrompt(recipe),
    size: "1024x1024",
    quality: "low",
    output_format: "webp"
  });

  const imageBase64 = result.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("OpenAI did not return image data.");
  }

  const fileName = getRecipeImageFileName(cacheKey);
  const filePath = path.join(generatedImagesDir, fileName);

  await mkdir(generatedImagesDir, { recursive: true });
  await writeFile(filePath, Buffer.from(imageBase64, "base64"));
  await setCachedRecipeImage(cacheKey, fileName);
}

export async function ensureRecipeImage(rawRecipe: unknown) {
  const recipe = recipeSchema.parse(rawRecipe);
  const cacheKey = getRecipeImageKey(recipe);
  const cached = await getCachedRecipeImage(cacheKey);

  if (cached) {
    return {
      status: "ready" as const,
      imageUrl: cached.relativeUrl
    };
  }

  if (!inFlightGenerations.has(cacheKey)) {
    const generationPromise = generateRecipeImage(recipe, cacheKey)
      .catch(() => undefined)
      .finally(() => {
        inFlightGenerations.delete(cacheKey);
      });

    inFlightGenerations.set(cacheKey, generationPromise);
  }

  return {
    status: "pending" as const
  };
}
