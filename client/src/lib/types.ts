export type Difficulty = "Easy" | "Medium" | "Hard";
export type MeasurementSystem = "european" | "american";
export type RecipeImageStatus = "idle" | "loading" | "ready" | "error";
export type LanguageCode = "en-GB" | "fr-FR" | "de-DE" | "it-IT" | "pt-PT" | "es-ES";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  difficulty: Difficulty;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  requestedIngredients?: string[];
}

export interface RecipeImageState {
  status: RecipeImageStatus;
  imageUrl?: string;
}
