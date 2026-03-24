import type { Recipe } from "../lib/types";

interface RecipeModalProps {
  recipe: Recipe | null;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (recipe: Recipe) => void;
}

export function RecipeModal({
  recipe,
  isBookmarked,
  onClose,
  onToggleBookmark
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
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close recipe">
          ×
        </button>
        <button
          className="bookmark-button modal-bookmark-button"
          type="button"
          onClick={() => onToggleBookmark(recipe)}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "Remove bookmark" : "Save recipe"}
        >
          {isBookmarked ? "Saved" : "Save"}
        </button>
        <p className="eyebrow">Recipe details</p>
        <h2 id="recipe-modal-title">{recipe.title}</h2>
        <p className="modal-description">{recipe.description}</p>

        <div className="modal-grid">
          <section>
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Instructions</h3>
            <ol>
              {recipe.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
