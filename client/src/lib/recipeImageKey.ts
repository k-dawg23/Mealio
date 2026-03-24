import type { Recipe } from "./types";

export function getRecipeImageKey(recipe: Recipe) {
  return [
    recipe.title.trim().toLowerCase(),
    recipe.description.trim().toLowerCase(),
    recipe.cookTime.trim().toLowerCase(),
    recipe.difficulty.trim().toLowerCase(),
    recipe.ingredients.map((ingredient) => ingredient.trim().toLowerCase()).join("|")
  ].join("::");
}
