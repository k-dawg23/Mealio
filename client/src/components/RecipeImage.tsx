import type { ReactNode } from "react";
import type { RecipeImageStatus } from "../lib/types";

interface RecipeImageProps {
  title: string;
  imageUrl?: string;
  status: RecipeImageStatus;
  copy: {
    imageLoadingLabel: string;
    imageUnavailableTitle: string;
    imageUnavailableCopy: string;
    imageRetry: string;
  };
  onRetry?: () => void;
  fallbackBadge?: ReactNode;
}

export function RecipeImage({ title, imageUrl, status, copy, onRetry, fallbackBadge }: RecipeImageProps) {
  if (imageUrl) {
    return (
      <div className="recipe-image-frame">
        <img className="recipe-image" src={imageUrl} alt={title} loading="lazy" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="recipe-image-frame recipe-image-fallback" role="img" aria-label={copy.imageUnavailableTitle}>
        <div className="recipe-image-fallback-copy">
          {fallbackBadge ? <div className="recipe-image-badge">{fallbackBadge}</div> : null}
          <strong>{copy.imageUnavailableTitle}</strong>
          <p>{copy.imageUnavailableCopy}</p>
          {onRetry ? (
            <button className="recipe-image-retry" type="button" onClick={onRetry}>
              {copy.imageRetry}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`recipe-image-frame recipe-image-placeholder ${status === "loading" ? "is-loading" : ""}`}
      aria-label={copy.imageLoadingLabel}
      role="img"
    >
      <div className="recipe-image-sheen" />
      {fallbackBadge ? <div className="recipe-image-badge">{fallbackBadge}</div> : null}
    </div>
  );
}
