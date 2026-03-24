import { useEffect, useMemo, useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeModal } from "./components/RecipeModal";
import { loadBookmarks, saveBookmarks } from "./lib/storage";
import type { Recipe } from "./lib/types";

type ViewMode = "suggested" | "saved";

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [bookmarks, setBookmarks] = useState<Recipe[]>(() => loadBookmarks());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("suggested");

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((recipe) => recipe.id)),
    [bookmarks]
  );

  async function suggestRecipes() {
    if (ingredients.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setViewMode("suggested");

    try {
      const response = await fetch("/api/recipes/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ingredients })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to fetch recipes right now.");
      }

      const payload = (await response.json()) as { recipes: Recipe[] };
      setRecipes(payload.recipes);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Something went wrong while suggesting recipes.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function addIngredient(ingredient: string) {
    setIngredients((current) => {
      const normalized = ingredient.trim().toLowerCase();

      if (!normalized || current.some((item) => item.toLowerCase() === normalized)) {
        return current;
      }

      return [...current, ingredient.trim()];
    });
  }

  function removeIngredient(ingredient: string) {
    setIngredients((current) => current.filter((item) => item !== ingredient));
  }

  function toggleBookmark(recipe: Recipe) {
    setBookmarks((current) => {
      const exists = current.some((item) => item.id === recipe.id);
      return exists
        ? current.filter((item) => item.id !== recipe.id)
        : [recipe, ...current];
    });
  }

  const visibleRecipes = viewMode === "saved" ? bookmarks : recipes;

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-brand">
          <div className="hero-copy-wrap">
            <p className="eyebrow">AI recipe suggestion app</p>
            <h1>Cook from what you already have.</h1>
            <p className="hero-copy">
              Add ingredients, get four structured recipe ideas, and save the
              ones you want to make later.
            </p>
            <div className="hero-note">
              <span className="hero-note-dot" aria-hidden="true" />
              Azure highlights mark Mealio's AI-powered guidance.
            </div>
          </div>
          <div className="hero-art">
            <img className="hero-logo" src="/assets/mealio-logo.png" alt="Mealio" />
            <div className="hero-floating-card">
              <p className="stat-label">Magic mode</p>
              <strong>Ingredient-led ideas with practical pantry staples</strong>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div>
            <p className="stat-label">Suggestions made simple</p>
            <strong>4 recipes every time</strong>
          </div>
          <div>
            <p className="stat-label">Azure assistance</p>
            <strong>Helpful AI cues for smarter ingredient-led ideas</strong>
          </div>
          <div>
            <p className="stat-label">Built for real kitchens</p>
            <strong>Flexible recipe ideas based on what you already have</strong>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <IngredientInput
          ingredients={ingredients}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onSuggestRecipes={suggestRecipes}
          isLoading={isLoading}
        />

        <section className="results-panel">
          <div className="results-header">
            <div>
              <p className="eyebrow">Recipes</p>
              <h2>{viewMode === "saved" ? "Saved recipes" : "Suggested for you"}</h2>
            </div>
            <div className="segmented-control">
              <button
                type="button"
                className={viewMode === "suggested" ? "active" : ""}
                onClick={() => setViewMode("suggested")}
              >
                Suggestions
              </button>
              <button
                type="button"
                className={viewMode === "saved" ? "active" : ""}
                onClick={() => setViewMode("saved")}
              >
                Bookmarks ({bookmarks.length})
              </button>
            </div>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          {visibleRecipes.length === 0 ? (
            <div className="empty-state">
              <img src="/assets/mealio-icon.png" alt="" aria-hidden="true" />
              <h3>
                {viewMode === "saved" ? "No bookmarks yet" : "Ready when you are"}
              </h3>
              <p>
                {viewMode === "saved"
                  ? "Save recipes you want to revisit and they’ll stay on this device."
                  : "Add a few ingredients and Mealio will suggest recipes you can actually make."}
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {visibleRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={setSelectedRecipe}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        isBookmarked={selectedRecipe ? bookmarkedIds.has(selectedRecipe.id) : false}
        onClose={() => setSelectedRecipe(null)}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
