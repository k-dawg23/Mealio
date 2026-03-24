import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCachedRecipes, setCachedRecipes } from "./cache.js";
import { generateRecipesFromIngredients } from "./openai.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const clientDistPath = path.resolve(currentDir, "../client");

app.use(express.json());

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

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/recipes/suggest", async (request, response) => {
  const ingredients = normalizeIngredients(request.body?.ingredients);

  if (ingredients.length === 0) {
    response.status(400).json({ error: "Add at least one ingredient first." });
    return;
  }

  const cacheKey = ingredients.join("|");

  try {
    const cached = await getCachedRecipes(cacheKey);

    if (cached) {
      response.json(cached);
      return;
    }

    const payload = await generateRecipesFromIngredients(ingredients);
    await setCachedRecipes(cacheKey, payload);
    response.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate recipes right now.";
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
