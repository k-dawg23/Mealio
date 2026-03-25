import { FormEvent, KeyboardEvent, useState } from "react";

import type { MeasurementSystem } from "../lib/types";

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onSuggestRecipes: () => void;
  recentSearches: string[][];
  onRunRecentSearch: (ingredients: string[]) => void;
  onClearRecentSearches: () => void;
  isLoading: boolean;
  measurementSystem: MeasurementSystem;
  onMeasurementSystemChange: (system: MeasurementSystem) => void;
}

export function IngredientInput({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onSuggestRecipes,
  recentSearches,
  onRunRecentSearch,
  onClearRecentSearches,
  isLoading,
  measurementSystem,
  onMeasurementSystemChange
}: IngredientInputProps) {
  const [value, setValue] = useState("");

  function submitIngredient(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    onAddIngredient(trimmed);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      submitIngredient();
    }
  }

  return (
    <section className="panel">
      <div className="panel-copy">
        <p className="eyebrow">Your ingredients</p>
        <h2>Build your basket one ingredient at a time.</h2>
        <p>
          Add what you already have in the kitchen. Mealio will suggest four
          realistic recipe ideas that make use of those ingredients.
        </p>
      </div>

      <form className="ingredient-form" onSubmit={submitIngredient}>
        <label className="sr-only" htmlFor="ingredient-input">
          Add ingredient
        </label>
        <input
          id="ingredient-input"
          className="ingredient-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Try chicken, spinach, rice..."
        />
        <button className="azure-button" type="submit">
          Add
        </button>
      </form>

      <div className="ingredient-tags" aria-live="polite">
        {ingredients.length === 0 ? (
          <p className="empty-hint">No ingredients added yet.</p>
        ) : (
          ingredients.map((ingredient) => (
            <button
              key={ingredient}
              className="ingredient-tag"
              type="button"
              onClick={() => onRemoveIngredient(ingredient)}
              aria-label={`Remove ${ingredient}`}
            >
              <span>{ingredient}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))
        )}
      </div>

      <div className="format-picker ingredient-format-picker">
        <p className="eyebrow">Recipe format</p>
        <div className="segmented-control">
          <button
            type="button"
            className={measurementSystem === "european" ? "active" : ""}
            onClick={() => onMeasurementSystemChange("european")}
          >
            European
          </button>
          <button
            type="button"
            className={measurementSystem === "american" ? "active" : ""}
            onClick={() => onMeasurementSystemChange("american")}
          >
            American
          </button>
        </div>
      </div>

      <button
        className="primary-button"
        type="button"
        onClick={onSuggestRecipes}
        disabled={isLoading || ingredients.length === 0}
      >
        {isLoading ? "Finding recipes..." : "Suggest Recipes"}
      </button>

      <div className="recent-searches">
        <div className="recent-searches-header">
          <div>
            <p className="eyebrow">Recent searches</p>
            <p className="recent-searches-copy">
              Tap a previous ingredient combination to run it again.
            </p>
          </div>
          <button
            className="recent-searches-clear"
            type="button"
            onClick={onClearRecentSearches}
            disabled={recentSearches.length === 0}
          >
            Clear history
          </button>
        </div>

        {recentSearches.length === 0 ? (
          <p className="empty-hint">Your last 20 searches will appear here.</p>
        ) : (
          <div className="recent-search-list">
            {recentSearches.map((search) => (
              <button
                key={search.join("|")}
                type="button"
                className="recent-search-chip"
                onClick={() => onRunRecentSearch(search)}
              >
                {search.join(", ")}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
