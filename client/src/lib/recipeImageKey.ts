import type { Recipe } from "./types";
import { getRecipeKey } from "./recipeIdentity";

export function getRecipeImageKey(recipe: Recipe) {
  return getRecipeKey(recipe);
}
