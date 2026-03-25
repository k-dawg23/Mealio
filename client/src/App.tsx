import { useEffect, useMemo, useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeModal } from "./components/RecipeModal";
import { getExtraIngredients } from "./lib/ingredientComparison";
import { getTranslations, languageOptions } from "./lib/i18n";
import { getRecipeImageKey } from "./lib/recipeImageKey";
import {
  loadBookmarks,
  loadLanguage,
  loadMeasurementSystem,
  loadRecentSearches,
  saveBookmarks,
  saveLanguage,
  saveMeasurementSystem,
  saveRecentSearches
} from "./lib/storage";
import type { LanguageCode, MeasurementSystem, Recipe, RecipeImageState } from "./lib/types";

type ViewMode = "suggested" | "saved";

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [bookmarks, setBookmarks] = useState<Recipe[]>(() => loadBookmarks());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("suggested");
  const [language, setLanguage] = useState<LanguageCode>(() => loadLanguage());
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>(() =>
    loadMeasurementSystem()
  );
  const [recipeImages, setRecipeImages] = useState<Record<string, RecipeImageState>>({});
  const [recentSearches, setRecentSearches] = useState<string[][]>(() => loadRecentSearches());

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveMeasurementSystem(measurementSystem);
  }, [measurementSystem]);

  useEffect(() => {
    saveLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    saveRecentSearches(recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    const uniqueRecipes = new Map<string, Recipe>();

    for (const recipe of [...recipes, ...bookmarks]) {
      uniqueRecipes.set(getRecipeImageKey(recipe), recipe);
    }

    if (selectedRecipe) {
      uniqueRecipes.set(getRecipeImageKey(selectedRecipe), selectedRecipe);
    }

    for (const [key, recipe] of uniqueRecipes) {
      const currentState = recipeImages[key];

      if (recipe.imageUrl && currentState?.status !== "ready") {
        setRecipeImages((current) => ({
          ...current,
          [key]: { status: "ready", imageUrl: recipe.imageUrl }
        }));
        continue;
      }

      if (
        currentState?.status === "loading" ||
        currentState?.status === "ready" ||
        currentState?.status === "error"
      ) {
        continue;
      }

      setRecipeImages((current) => ({
        ...current,
        [key]: { status: "loading" }
      }));

      void ensureRecipeImage(recipe, key);
    }
  }, [bookmarks, recipeImages, recipes, selectedRecipe]);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((recipe) => getRecipeImageKey(recipe))),
    [bookmarks]
  );
  const copy = getTranslations(language);

  async function suggestRecipes(searchIngredients = ingredients) {
    if (searchIngredients.length === 0) {
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
        body: JSON.stringify({ ingredients: searchIngredients, measurementSystem, language })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to fetch recipes right now.");
      }

      const payload = (await response.json()) as { recipes: Recipe[] };
      setRecipes(
        payload.recipes.map((recipe) => ({
          ...recipe,
          requestedIngredients: [...searchIngredients]
        }))
      );
      const normalizedSearch = [...searchIngredients];
      const searchKey = normalizedSearch
        .map((ingredient) => ingredient.trim().toLowerCase())
        .sort()
        .join("|");

      setRecentSearches((current) => {
        const deduped = current.filter((entry) => {
          const entryKey = [...entry]
            .map((ingredient) => ingredient.trim().toLowerCase())
            .sort()
            .join("|");
          return entryKey !== searchKey;
        });

        return [normalizedSearch, ...deduped].slice(0, 20);
      });
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : copy.fetchError;
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

  function runRecentSearch(searchIngredients: string[]) {
    setIngredients(searchIngredients);
    void suggestRecipes(searchIngredients);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
  }

  function toggleBookmark(recipe: Recipe) {
    setBookmarks((current) => {
      const recipeKey = getRecipeImageKey(recipe);
      const exists = current.some((item) => getRecipeImageKey(item) === recipeKey);
      return exists
        ? current.filter((item) => getRecipeImageKey(item) !== recipeKey)
        : [recipe, ...current];
    });
  }

  async function ensureRecipeImage(recipe: Recipe, key: string, attempt = 0): Promise<void> {
    try {
      const response = await fetch("/api/recipe-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ recipe })
      });

      if (!response.ok) {
        throw new Error("Unable to prepare recipe image.");
      }

      const payload = (await response.json()) as {
        status: "ready" | "pending";
        imageUrl?: string;
      };

      if (payload.status === "ready" && payload.imageUrl) {
        setRecipeImages((current) => ({
          ...current,
          [key]: { status: "ready", imageUrl: payload.imageUrl }
        }));
        setRecipes((current) =>
          current.map((item) => (getRecipeImageKey(item) === key ? { ...item, imageUrl: payload.imageUrl } : item))
        );
        setBookmarks((current) =>
          current.map((item) => (getRecipeImageKey(item) === key ? { ...item, imageUrl: payload.imageUrl } : item))
        );
        setSelectedRecipe((current) =>
          current && getRecipeImageKey(current) === key
            ? { ...current, imageUrl: payload.imageUrl }
            : current
        );
        return;
      }

      if (attempt < 12) {
        window.setTimeout(() => {
          void ensureRecipeImage(recipe, key, attempt + 1);
        }, 1800);
        return;
      }
    } catch {
      // Fall through to the error state below.
    }

    setRecipeImages((current) => ({
      ...current,
      [key]: { status: "error" }
    }));
  }

  const visibleRecipes = viewMode === "saved" ? bookmarks : recipes;

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-brand">
          <div className="hero-copy-wrap">
            <p className="eyebrow">{copy.heroEyebrow}</p>
            <h1>{copy.heroTitle}</h1>
            <p className="hero-copy">{copy.heroCopy}</p>
            <div className="hero-note">
              <span className="hero-note-dot" aria-hidden="true" />
              {copy.heroNote}
            </div>
          </div>
          <div className="hero-art">
            <img className="hero-logo" src="/assets/mealio-logo.png" alt="Mealio" />
            <div className="hero-floating-card">
              <p className="stat-label">{copy.heroMagicLabel}</p>
              <strong>{copy.heroMagicText}</strong>
            </div>
            <div className="hero-language-picker" aria-label={copy.languageSelectorLabel}>
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={`language-flag-button ${language === option.code ? "active" : ""}`}
                  onClick={() => setLanguage(option.code)}
                  aria-label={option.label}
                  title={option.label}
                >
                  <span aria-hidden="true">{option.flag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div>
            <p className="stat-label">{copy.heroSimpleLabel}</p>
            <strong>{copy.heroSimpleText}</strong>
          </div>
          <div>
            <p className="stat-label">{copy.heroAssistLabel}</p>
            <strong>{copy.heroAssistText}</strong>
          </div>
          <div>
            <p className="stat-label">{copy.heroKitchenLabel}</p>
            <strong>{copy.heroKitchenText}</strong>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <IngredientInput
          ingredients={ingredients}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onSuggestRecipes={() => void suggestRecipes()}
          recentSearches={recentSearches}
          onRunRecentSearch={runRecentSearch}
          onClearRecentSearches={clearRecentSearches}
          isLoading={isLoading}
          measurementSystem={measurementSystem}
          onMeasurementSystemChange={setMeasurementSystem}
          copy={copy}
        />

        <section className="results-panel">
          <div className="results-header">
            <div>
              <p className="eyebrow">{copy.recipesEyebrow}</p>
              <h2>{viewMode === "saved" ? copy.savedTitle : copy.suggestedTitle}</h2>
            </div>
            <div className="segmented-control">
              <button
                type="button"
                className={viewMode === "suggested" ? "active" : ""}
                onClick={() => setViewMode("suggested")}
              >
                {copy.suggestionsTab}
              </button>
              <button
                type="button"
                className={viewMode === "saved" ? "active" : ""}
                onClick={() => setViewMode("saved")}
              >
                {copy.bookmarksTab} ({bookmarks.length})
              </button>
            </div>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          {visibleRecipes.length === 0 ? (
            <div className="empty-state">
              <img src="/assets/mealio-icon.png" alt="" aria-hidden="true" />
              <h3>
                {viewMode === "saved" ? copy.noBookmarksTitle : copy.readyTitle}
              </h3>
              <p>
                {viewMode === "saved"
                  ? copy.noBookmarksCopy
                  : copy.readyCopy}
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {visibleRecipes.map((recipe) => (
                (() => {
                  const imageState = recipeImages[getRecipeImageKey(recipe)];

                  return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={setSelectedRecipe}
                  imageUrl={imageState?.imageUrl ?? recipe.imageUrl}
                  isImageLoading={imageState?.status === "loading"}
                  extraIngredients={getExtraIngredients(recipe)}
                  language={language}
                  extraIngredientsAria={copy.extraIngredientsAria}
                />
                  );
                })()
              ))}
            </div>
          )}
        </section>
      </main>

      <RecipeModal
        recipe={selectedRecipe}
        isBookmarked={
          selectedRecipe ? bookmarkedIds.has(getRecipeImageKey(selectedRecipe)) : false
        }
        imageUrl={
          selectedRecipe
            ? recipeImages[getRecipeImageKey(selectedRecipe)]?.imageUrl ?? selectedRecipe.imageUrl
            : undefined
        }
        isImageLoading={
          selectedRecipe
            ? recipeImages[getRecipeImageKey(selectedRecipe)]?.status === "loading"
            : false
        }
        onClose={() => setSelectedRecipe(null)}
        onToggleBookmark={toggleBookmark}
        copy={copy}
      />
    </div>
  );
}
