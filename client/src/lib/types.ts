export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  difficulty: Difficulty;
  ingredients: string[];
  instructions: string[];
}
