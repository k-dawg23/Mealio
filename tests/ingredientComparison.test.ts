import test from "node:test";
import assert from "node:assert/strict";
import { getExtraIngredients } from "../client/src/lib/ingredientComparison";
import { normalizeRecipeIdentity } from "../client/src/lib/recipeIdentity";
import type { Recipe } from "../client/src/lib/types";

function createRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return normalizeRecipeIdentity({
    id: "temp",
    recipeKey: "temp",
    title: "Spinach Rice Bowl",
    description: "A simple bowl.",
    cookTime: "25 mins",
    difficulty: "Easy",
    ingredients: ["chicken breast", "rice", "spinach", "olive oil", "lemon"],
    instructions: ["Cook the rice.", "Finish the bowl."],
    requestedIngredients: ["chicken", "rice", "spinach"],
    ...overrides
  });
}

test("getExtraIngredients ignores pantry staples and matches broader ingredient names", () => {
  const recipe = createRecipe();

  assert.deepEqual(getExtraIngredients(recipe), ["lemon"]);
});
