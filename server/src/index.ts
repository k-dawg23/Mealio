import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCachedRecipes, setCachedRecipes } from "./cache.js";
import { generatedImagesDir } from "./imageCache.js";
import { ensureRecipeImage } from "./imageGeneration.js";
import { generateRecipesFromIngredients, type MeasurementSystem } from "./openai.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const clientDistPath = path.resolve(currentDir, "../client");

app.use(express.json());
app.use("/generated-images", express.static(generatedImagesDir));

function normalizeIngredients(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return [...new Set(
    input
      .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
      .filter(Boolean)
  )].sort();
}

function normalizeMeasurementSystem(input: unknown): MeasurementSystem {
  return input === "american" ? "american" : "european";
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/recipes/suggest", async (request, response) => {
  const ingredients = normalizeIngredients(request.body?.ingredients);
  const measurementSystem = normalizeMeasurementSystem(request.body?.measurementSystem);

  if (ingredients.length === 0) {
    response.status(400).json({ error: "Add at least one ingredient first." });
    return;
  }

  const cacheKey = `${measurementSystem}:${ingredients.join("|")}`;

  try {
    const cached = await getCachedRecipes(cacheKey);

    if (cached) {
      response.json(cached);
      return;
    }

    const payload = await generateRecipesFromIngredients(ingredients, measurementSystem);
    await setCachedRecipes(cacheKey, payload);
    response.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate recipes right now.";
    response.status(500).json({ error: message });
  }
});

app.post("/api/recipe-images", async (request, response) => {
  try {
    const payload = await ensureRecipeImage(request.body?.recipe);
    response.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate recipe image right now.";
    response.status(500).json({ error: message });
  }
});

app.use(express.static(clientDistPath));

app.get("*", (_request, response) => {
  response.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Mealio server listening on http://localhost:${port}`);
});
