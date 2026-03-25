import { useEffect, useMemo, useRef, useState } from "react";
import { IngredientInput } from "./components/IngredientInput";
import { RecipeCard } from "./components/RecipeCard";
import { RecipeModal } from "./components/RecipeModal";
import { getExtraIngredients } from "./lib/ingredientComparison";
import { getTranslations, languageOptions } from "./lib/i18n";
import { collectUniqueRecipes, replaceRecipeImage, toggleRecipeBookmark } from "./lib/recipeCollections";
import { getRecipeImageKey } from "./lib/recipeImageKey";
import { normalizeRecipeIdentity } from "./lib/recipeIdentity";
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
import type {
  LanguageCode,
  MeasurementSystem,
  Recipe,
  RecipeImageState,
  RecentSearchEntry
} from "./lib/types";

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
  const [recentSearches, setRecentSearches] = useState<RecentSearchEntry[]>(() => loadRecentSearches());
  const [liveMessage, setLiveMessage] = useState("");
  const suggestAbortRef = useRef<AbortController | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const copy = getTranslations(language);

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

  useEffect(() => () => suggestAbortRef.current?.abort(), []);

  useEffect(() => {
    if (isLoading) {
      setLiveMessage(copy.resultsLoadingTitle);
    }
  }, [copy.resultsLoadingTitle, isLoading]);

  useEffect(() => {
    const uniqueRecipes = collectUniqueRecipes(recipes, bookmarks, selectedRecipe);

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
  const visibleRecipes = viewMode === "saved" ? bookmarks : recipes;
  const showSuggestionsLoadingState = viewMode === "suggested" && isLoading && recipes.length === 0;
  const showSuggestionsErrorState = viewMode === "suggested" && !isLoading && !!error && recipes.length === 0;
  const showSuggestionsStaleNotice = viewMode === "suggested" && !!error && recipes.length > 0;
  const errorDetail = error && error !== copy.fetchError ? error : null;

  function createRecentSearchKey(searchIngredients: string[]) {
    return [...searchIngredients]
      .map((ingredient) => ingredient.trim().toLowerCase())
      .sort()
      .join("|");
  }

  async function suggestRecipes(search: RecentSearchEntry = {
    ingredients,
    measurementSystem,
    language
  }) {
    if (search.ingredients.length === 0) {
      return;
    }

    suggestAbortRef.current?.abort();
    const controller = new AbortController();
    suggestAbortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setViewMode("suggested");

    try {
      const response = await fetch("/api/recipes/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(search),
        signal: controller.signal
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to fetch recipes right now.");
      }

      const payload = (await response.json()) as { recipes: Recipe[] };
      setRecipes(
        payload.recipes.map((recipe) => ({
          ...normalizeRecipeIdentity(recipe),
          requestedIngredients: [...search.ingredients]
        }))
      );
      setLiveMessage(copy.recipesLoadedAnnouncement.replace("{count}", String(payload.recipes.length)));
      const normalizedSearch = [...search.ingredients];
      const searchKey = createRecentSearchKey(normalizedSearch);

      setRecentSearches((current) => {
        const deduped = current.filter((entry) => createRecentSearchKey(entry.ingredients) !== searchKey);

        return [{ ...search, ingredients: normalizedSearch }, ...deduped].slice(0, 20);
      });
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        return;
      }

      const message =
        fetchError instanceof Error
          ? fetchError.message
          : copy.fetchError;
      setError(message);
      setLiveMessage(message);
    } finally {
      if (suggestAbortRef.current === controller) {
        suggestAbortRef.current = null;
        setIsLoading(false);
      }
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

  function runRecentSearch(search: RecentSearchEntry) {
    setIngredients(search.ingredients);
    setMeasurementSystem(search.measurementSystem);
    setLanguage(search.language);
    setLiveMessage(
      copy.recentSearchRestoredAnnouncement.replace("{ingredients}", search.ingredients.join(", "))
    );
    void suggestRecipes(search);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    setLiveMessage(copy.recentSearchesClearedAnnouncement);
  }

  function toggleBookmark(recipe: Recipe) {
    setBookmarks((current) => toggleRecipeBookmark(current, recipe));
  }

  function retryRecipeImage(recipe: Recipe) {
    const key = getRecipeImageKey(recipe);
    setRecipeImages((current) => ({
      ...current,
      [key]: { status: "loading" }
    }));
    void ensureRecipeImage(recipe, key);
  }

  function openRecipe(recipe: Recipe, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setSelectedRecipe(recipe);
  }

  function closeRecipeModal() {
    setSelectedRecipe(null);
    window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
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
        const imageUrl = payload.imageUrl;

        setRecipeImages((current) => ({
          ...current,
          [key]: { status: "ready", imageUrl }
        }));
        setRecipes((current) => replaceRecipeImage(current, key, imageUrl));
        setBookmarks((current) => replaceRecipeImage(current, key, imageUrl));
        setSelectedRecipe((current) =>
          current && getRecipeImageKey(current) === key
            ? { ...current, imageUrl }
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

  return (
    <div className="app-shell">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
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
                  aria-pressed={language === option.code}
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
          <div className="results-header" aria-live="polite" aria-busy={viewMode === "suggested" && isLoading}>
            <div>
              <p className="eyebrow">{copy.recipesEyebrow}</p>
              <h2>{viewMode === "saved" ? copy.savedTitle : copy.suggestedTitle}</h2>
            </div>
            <div className="segmented-control">
              <button
                type="button"
                className={viewMode === "suggested" ? "active" : ""}
                onClick={() => setViewMode("suggested")}
                aria-pressed={viewMode === "suggested"}
              >
                {copy.suggestionsTab}
              </button>
              <button
                type="button"
                className={viewMode === "saved" ? "active" : ""}
                onClick={() => setViewMode("saved")}
                aria-pressed={viewMode === "saved"}
              >
                {copy.bookmarksTab} ({bookmarks.length})
              </button>
            </div>
          </div>

          {showSuggestionsStaleNotice ? <p className="error-banner">{copy.resultsStaleError}</p> : null}

          {showSuggestionsLoadingState ? (
            <div className="empty-state section-state">
              <img src="/assets/mealio-icon.png" alt="" aria-hidden="true" />
              <h3>{copy.resultsLoadingTitle}</h3>
              <p>{copy.resultsLoadingCopy}</p>
            </div>
          ) : showSuggestionsErrorState ? (
            <div className="empty-state section-state section-state-error">
              <img src="/assets/mealio-icon.png" alt="" aria-hidden="true" />
              <h3>{copy.resultsErrorTitle}</h3>
              <p>{copy.resultsErrorCopy}</p>
              {errorDetail ? (
                <p className="section-state-detail">
                  <strong>{copy.resultsErrorDetailLabel}:</strong> {errorDetail}
                </p>
              ) : null}
              <button className="azure-button section-state-action" type="button" onClick={() => void suggestRecipes()}>
                {copy.resultsRetry}
              </button>
            </div>
          ) : visibleRecipes.length === 0 ? (
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
            <>
              {viewMode === "suggested" ? (
                <div className="recipe-trust-note">
                  <p className="eyebrow">{copy.recipeTrustTitle}</p>
                  <p>{copy.recipeTrustCopy}</p>
                  <p className="recipe-trust-detail">{copy.pantryStaplesNote}</p>
                </div>
              ) : null}
              <div className="recipe-grid">
                {visibleRecipes.map((recipe) => (
                  (() => {
                    const imageState = recipeImages[getRecipeImageKey(recipe)] ?? { status: "idle" as const };

                    return (
                  <RecipeCard
                    key={getRecipeImageKey(recipe)}
                    recipe={recipe}
                    onOpen={openRecipe}
                    imageUrl={imageState?.imageUrl ?? recipe.imageUrl}
                    imageStatus={imageState.status}
                    extraIngredients={getExtraIngredients(recipe)}
                    language={language}
                    extraIngredientsAria={copy.extraIngredientsAria}
                    copy={copy}
                  />
                    );
                  })()
                ))}
              </div>
            </>
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
        imageStatus={
          selectedRecipe
            ? recipeImages[getRecipeImageKey(selectedRecipe)]?.status ?? "idle"
            : "idle"
        }
        onClose={closeRecipeModal}
        onToggleBookmark={toggleBookmark}
        onRetryImage={retryRecipeImage}
        copy={copy}
      />
    </div>
  );
}
