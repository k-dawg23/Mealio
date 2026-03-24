interface RecipeImageProps {
  title: string;
  imageUrl?: string;
  isLoading: boolean;
}

export function RecipeImage({ title, imageUrl, isLoading }: RecipeImageProps) {
  if (imageUrl) {
    return (
      <div className="recipe-image-frame">
        <img className="recipe-image" src={imageUrl} alt={title} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`recipe-image-frame recipe-image-placeholder ${isLoading ? "is-loading" : ""}`}
      aria-hidden="true"
    >
      <div className="recipe-image-sheen" />
    </div>
  );
}
