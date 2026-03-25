import { translateDifficulty } from "../lib/i18n";
import type { LanguageCode, Recipe, RecipeImageStatus } from "../lib/types";
import { RecipeImage } from "./RecipeImage";

interface RecipeCardProps {
  recipe: Recipe;
  onOpen: (recipe: Recipe) => void;
  imageUrl?: string;
  imageStatus: RecipeImageStatus;
  extraIngredients: string[];
  language: LanguageCode;
  extraIngredientsAria: string;
  copy: {
    imageLoadingLabel: string;
    imageUnavailableTitle: string;
    imageUnavailableCopy: string;
    imageRetry: string;
  };
}

export function RecipeCard({
  recipe,
  onOpen,
  imageUrl,
  imageStatus,
  extraIngredients,
  language,
  extraIngredientsAria,
  copy
}: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <button className="recipe-card-hitbox" type="button" onClick={() => onOpen(recipe)}>
        <RecipeImage
          title={recipe.title}
          imageUrl={imageUrl}
          status={imageStatus}
          copy={copy}
          fallbackBadge={imageStatus === "error" ? recipe.cookTime : null}
        />
        <div className="recipe-meta">
          <span className="time-pill">{recipe.cookTime}</span>
          <span className={`difficulty-badge difficulty-${recipe.difficulty.toLowerCase()}`}>
            {translateDifficulty(language, recipe.difficulty)}
          </span>
        </div>
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        {extraIngredients.length > 0 ? (
          <div className="extra-ingredients" aria-label={extraIngredientsAria}>
            {extraIngredients.map((ingredient) => (
              <span key={ingredient} className="extra-ingredient-badge">
                {ingredient}
              </span>
            ))}
          </div>
        ) : null}
      </button>
    </article>
  );
}
