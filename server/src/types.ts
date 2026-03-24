import { z } from "zod";

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  cookTime: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  ingredients: z.array(z.string().min(1)).min(1),
  instructions: z.array(z.string().min(1)).min(1)
});

export const recipesPayloadSchema = z.object({
  recipes: z.array(recipeSchema).length(4)
});

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipesPayload = z.infer<typeof recipesPayloadSchema>;
