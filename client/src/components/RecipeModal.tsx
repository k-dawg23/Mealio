import { useEffect, useRef } from "react";
import type { Recipe } from "../lib/types";
import { RecipeImage } from "./RecipeImage";

interface RecipeModalProps {
  recipe: Recipe | null;
  isBookmarked: boolean;
  imageUrl?: string;
  imageStatus: "idle" | "loading" | "ready" | "error";
  onClose: () => void;
  onToggleBookmark: (recipe: Recipe) => void;
  onRetryImage: (recipe: Recipe) => void;
  copy: {
    modalClose: string;
    modalSave: string;
    modalSaved: string;
    removeBookmark: string;
    saveRecipe: string;
    modalEyebrow: string;
    modalIngredients: string;
    modalInstructions: string;
    modalDialogLabel: string;
    imageLoadingLabel: string;
    imageUnavailableTitle: string;
    imageUnavailableCopy: string;
    imageUnavailableDetail: string;
    imageRetry: string;
  };
}

export function RecipeModal({
  recipe,
  isBookmarked,
  imageUrl,
  imageStatus,
  onClose,
  onToggleBookmark,
  onRetryImage,
  copy
}: RecipeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!recipe) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, recipe]);

  if (!recipe) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        aria-describedby="recipe-modal-description"
        aria-label={copy.modalDialogLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-scroll-area">
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label={copy.modalClose}
            ref={closeButtonRef}
          >
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
          <p className="modal-description" id="recipe-modal-description">
            {recipe.description}
          </p>
          <RecipeImage
            title={recipe.title}
            imageUrl={imageUrl}
            status={imageStatus}
            copy={copy}
            onRetry={imageStatus === "error" ? () => onRetryImage(recipe) : undefined}
          />

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
