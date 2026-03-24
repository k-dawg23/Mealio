import type { Recipe } from "../lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onOpen: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onOpen }: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <button className="recipe-card-hitbox" type="button" onClick={() => onOpen(recipe)}>
        <div className="recipe-card-accent" aria-hidden="true" />
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
