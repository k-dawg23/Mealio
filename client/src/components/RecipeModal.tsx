import type { Recipe } from "../lib/types";
import { RecipeImage } from "./RecipeImage";

interface RecipeModalProps {
  recipe: Recipe | null;
  isBookmarked: boolean;
  imageUrl?: string;
  isImageLoading: boolean;
  onClose: () => void;
  onToggleBookmark: (recipe: Recipe) => void;
  copy: {
    modalClose: string;
    modalSave: string;
    modalSaved: string;
    removeBookmark: string;
    saveRecipe: string;
    modalEyebrow: string;
    modalIngredients: string;
    modalInstructions: string;
  };
}

export function RecipeModal({
  recipe,
  isBookmarked,
  imageUrl,
  isImageLoading,
  onClose,
  onToggleBookmark,
  copy
}: RecipeModalProps) {
  if (!recipe) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-scroll-area">
          <button className="modal-close" type="button" onClick={onClose} aria-label={copy.modalClose}>
            ×
          </button>
          <button
            className="bookmark-button modal-bookmark-button"
            type="button"
            onClick={() => onToggleBookmark(recipe)}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? copy.removeBookmark : copy.saveRecipe}
          >
            {isBookmarked ? copy.modalSaved : copy.modalSave}
          </button>
          <p className="eyebrow">{copy.modalEyebrow}</p>
          <h2 id="recipe-modal-title">{recipe.title}</h2>
          <p className="modal-description">{recipe.description}</p>
          <RecipeImage title={recipe.title} imageUrl={imageUrl} isLoading={isImageLoading} />

          <div className="modal-grid">
            <section>
              <h3>{copy.modalIngredients}</h3>
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>{copy.modalInstructions}</h3>
              <ol>
                {recipe.instructions.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
