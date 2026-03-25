import type { MouseEvent } from "react";
import { translateDifficulty } from "../lib/i18n";
import type { LanguageCode, Recipe, RecipeImageStatus } from "../lib/types";
import { RecipeImage } from "./RecipeImage";

interface RecipeCardProps {
  recipe: Recipe;
  onOpen: (recipe: Recipe, trigger: HTMLButtonElement) => void;
  imageUrl?: string;
  imageStatus: RecipeImageStatus;
  extraIngredients: string[];
  language: LanguageCode;
  extraIngredientsAria: string;
  copy: {
    imageLoadingLabel: string;
    imageUnavailableTitle: string;
    imageUnavailableCopy: string;
    imageUnavailableDetail: string;
    imageRetry: string;
    extraIngredientsLabel: string;
    extraIngredientsHint: string;
    noExtraIngredientsLabel: string;
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
  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    onOpen(recipe, event.currentTarget);
  }

  return (
    <article className="recipe-card">
      <button className="recipe-card-hitbox" type="button" onClick={handleOpen}>
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
          <div className="extra-ingredients-wrap">
            <p className="extra-ingredients-label">{copy.extraIngredientsLabel}</p>
            <div className="extra-ingredients" aria-label={extraIngredientsAria}>
              {extraIngredients.map((ingredient) => (
                <span key={ingredient} className="extra-ingredient-badge">
                  {ingredient}
                </span>
              ))}
            </div>
            <p className="extra-ingredients-hint">{copy.extraIngredientsHint}</p>
          </div>
        ) : (
          <p className="extra-ingredients-clear">{copy.noExtraIngredientsLabel}</p>
        )}
      </button>
    </article>
  );
}
