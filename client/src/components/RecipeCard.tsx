import type { Recipe } from "../lib/types";
import { RecipeImage } from "./RecipeImage";

interface RecipeCardProps {
  recipe: Recipe;
  onOpen: (recipe: Recipe) => void;
  imageUrl?: string;
  isImageLoading: boolean;
}

export function RecipeCard({ recipe, onOpen, imageUrl, isImageLoading }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <button className="recipe-card-hitbox" type="button" onClick={() => onOpen(recipe)}>
        <RecipeImage title={recipe.title} imageUrl={imageUrl} isLoading={isImageLoading} />
        <div className="recipe-meta">
          <span className="time-pill">{recipe.cookTime}</span>
          <span className={`difficulty-badge difficulty-${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
      </button>
    </article>
  );
}
