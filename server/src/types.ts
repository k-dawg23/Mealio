import { z } from "zod";

function trimmedString(min: number, max: number) {
  return z.string().trim().min(min).max(max);
}

export const rawRecipeSchema = z.object({
  id: z.string().trim().min(1),
  title: trimmedString(1, 120),
  description: trimmedString(1, 240),
  cookTime: trimmedString(1, 40),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  ingredients: z.array(trimmedString(1, 140)).min(1).max(24),
  instructions: z.array(trimmedString(1, 320)).min(1).max(16)
});

export const recipeSchema = rawRecipeSchema.extend({
  recipeKey: trimmedString(1, 2000)
});

export const rawRecipesPayloadSchema = z.object({
  recipes: z.array(rawRecipeSchema).length(4)
});

export const recipesPayloadSchema = z.object({
  recipes: z.array(recipeSchema).length(4)
});

export type Recipe = z.infer<typeof recipeSchema>;
export type RawRecipe = z.infer<typeof rawRecipeSchema>;
export type RecipesPayload = z.infer<typeof recipesPayloadSchema>;
