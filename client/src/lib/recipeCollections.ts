import { getRecipeKey } from "./recipeIdentity";
import type { Recipe } from "./types";

export function collectUniqueRecipes(recipes: Recipe[], bookmarks: Recipe[], selectedRecipe: Recipe | null) {
  const uniqueRecipes = new Map<string, Recipe>();

  for (const recipe of [...recipes, ...bookmarks]) {
    uniqueRecipes.set(getRecipeKey(recipe), recipe);
  }

  if (selectedRecipe) {
    uniqueRecipes.set(getRecipeKey(selectedRecipe), selectedRecipe);
  }

  return uniqueRecipes;
}

export function replaceRecipeImage(collection: Recipe[], recipeKey: string, imageUrl: string) {
  return collection.map((recipe) =>
    getRecipeKey(recipe) === recipeKey ? { ...recipe, imageUrl } : recipe
  );
}

export function toggleRecipeBookmark(collection: Recipe[], recipe: Recipe) {
  const recipeKey = getRecipeKey(recipe);
  const exists = collection.some((item) => getRecipeKey(item) === recipeKey);

  return exists
    ? collection.filter((item) => getRecipeKey(item) !== recipeKey)
    : [recipe, ...collection];
}
