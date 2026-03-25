import type { Recipe } from "./types";

function normalizeIdentityPart(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function createRecipeIdentity(recipe: Pick<Recipe, "title" | "description" | "cookTime" | "difficulty" | "ingredients" | "instructions">) {
  return [
    normalizeIdentityPart(recipe.title),
    normalizeIdentityPart(recipe.description),
    normalizeIdentityPart(recipe.cookTime),
    normalizeIdentityPart(recipe.difficulty),
    recipe.ingredients.map((ingredient) => normalizeIdentityPart(ingredient)).join("|"),
    recipe.instructions.map((instruction) => normalizeIdentityPart(instruction)).join("|")
  ].join("::");
}

export function getRecipeKey(recipe: Recipe) {
  return recipe.recipeKey || createRecipeIdentity(recipe);
}

export function normalizeRecipeIdentity(recipe: Recipe): Recipe {
  const recipeKey = getRecipeKey(recipe);

  return {
    ...recipe,
    id: recipeKey,
    recipeKey
  };
}
