import type { Recipe } from "./types";

const pantryStaples = [
  "salt",
  "pepper",
  "oil",
  "olive oil",
  "vegetable oil",
  "butter",
  "garlic",
  "onion",
  "sugar",
  "flour"
];

function normalizeIngredient(value: string) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ingredientMatches(available: string, recipeIngredient: string) {
  return (
    recipeIngredient.includes(available) ||
    available.includes(recipeIngredient) ||
    available.split(" ").every((part) => recipeIngredient.includes(part)) ||
    recipeIngredient.split(" ").every((part) => available.includes(part))
  );
}

function isPantryStaple(ingredient: string) {
  return pantryStaples.some((staple) => ingredientMatches(normalizeIngredient(staple), ingredient));
}

export function getExtraIngredients(recipe: Recipe) {
  const requested = (recipe.requestedIngredients ?? []).map(normalizeIngredient).filter(Boolean);

  return recipe.ingredients.filter((ingredient) => {
    const normalizedIngredient = normalizeIngredient(ingredient);

    if (!normalizedIngredient || isPantryStaple(normalizedIngredient)) {
      return false;
    }

    return !requested.some((availableIngredient) =>
      ingredientMatches(availableIngredient, normalizedIngredient)
    );
  });
}
