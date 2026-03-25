import test from "node:test";
import assert from "node:assert/strict";
import { createRecipeIdentity, normalizeRecipeIdentity } from "../client/src/lib/recipeIdentity";
import type { Recipe } from "../client/src/lib/types";

const recipe: Recipe = {
  id: "random-ai-id",
  recipeKey: "random-ai-id",
  title: "Tomato Pasta",
  description: "Quick and comforting.",
  cookTime: "20 mins",
  difficulty: "Easy",
  ingredients: ["Pasta", "Tomatoes", "Basil"],
  instructions: ["Boil pasta.", "Stir in sauce."]
};

test("createRecipeIdentity is stable across casing and whitespace", () => {
  const first = createRecipeIdentity(recipe);
  const second = createRecipeIdentity({
    ...recipe,
    title: "  tomato   pasta ",
    ingredients: [" pasta ", "tomatoes", "basil "]
  });

  assert.equal(first, second);
});

test("normalizeRecipeIdentity replaces AI ids with the stable recipe key", () => {
  const normalized = normalizeRecipeIdentity(recipe);

  assert.equal(normalized.id, normalized.recipeKey);
  assert.equal(normalized.recipeKey, createRecipeIdentity(recipe));
});
