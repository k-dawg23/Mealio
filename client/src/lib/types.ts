export type Difficulty = "Easy" | "Medium" | "Hard";
export type MeasurementSystem = "european" | "american";
export type RecipeImageStatus = "idle" | "loading" | "ready" | "error";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  difficulty: Difficulty;
  ingredients: string[];
  instructions: string[];
}

export interface RecipeImageState {
  status: RecipeImageStatus;
  imageUrl?: string;
}
