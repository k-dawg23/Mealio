import { FormEvent, KeyboardEvent, useState } from "react";
import { languageOptions } from "../lib/i18n";

import type { MeasurementSystem, RecentSearchEntry } from "../lib/types";

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onSuggestRecipes: () => void;
  recentSearches: RecentSearchEntry[];
  onRunRecentSearch: (search: RecentSearchEntry) => void;
  onClearRecentSearches: () => void;
  isLoading: boolean;
  measurementSystem: MeasurementSystem;
  onMeasurementSystemChange: (system: MeasurementSystem) => void;
  copy: {
    ingredientsEyebrow: string;
    ingredientsTitle: string;
    ingredientsCopy: string;
    ingredientInputLabel: string;
    addButton: string;
    ingredientPlaceholder: string;
    noIngredients: string;
    removeIngredientLabel: string;
    recipeFormatLabel: string;
    formatEuropean: string;
    formatAmerican: string;
    suggestButton: string;
    suggestLoading: string;
    recentSearchesLabel: string;
    recentSearchesCopy: string;
    recentSearchesEmpty: string;
    clearHistory: string;
    recentSearchFormatEuropeanShort: string;
    recentSearchFormatAmericanShort: string;
    recentSearchRestoreLabel: string;
    recentSearchFormatLabel: string;
    recentSearchLanguageLabel: string;
  };
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
  onMeasurementSystemChange,
  copy
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
        <p className="eyebrow">{copy.ingredientsEyebrow}</p>
        <h2>{copy.ingredientsTitle}</h2>
        <p>{copy.ingredientsCopy}</p>
      </div>

      <form className="ingredient-form" onSubmit={submitIngredient}>
        <label className="sr-only" htmlFor="ingredient-input">
          {copy.ingredientInputLabel}
        </label>
        <input
          id="ingredient-input"
          className="ingredient-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={copy.ingredientPlaceholder}
        />
        <button className="azure-button" type="submit">
          {copy.addButton}
        </button>
      </form>

      <div className="ingredient-tags" aria-live="polite">
        {ingredients.length === 0 ? (
          <p className="empty-hint">{copy.noIngredients}</p>
        ) : (
          ingredients.map((ingredient) => (
            <button
              key={ingredient}
              className="ingredient-tag"
              type="button"
              onClick={() => onRemoveIngredient(ingredient)}
              aria-label={copy.removeIngredientLabel.replace("{ingredient}", ingredient)}
            >
              <span>{ingredient}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))
        )}
      </div>

      <div className="format-picker ingredient-format-picker">
        <p className="eyebrow">{copy.recipeFormatLabel}</p>
        <div className="segmented-control">
          <button
            type="button"
            className={measurementSystem === "european" ? "active" : ""}
            onClick={() => onMeasurementSystemChange("european")}
            aria-pressed={measurementSystem === "european"}
          >
            {copy.formatEuropean}
          </button>
          <button
            type="button"
            className={measurementSystem === "american" ? "active" : ""}
            onClick={() => onMeasurementSystemChange("american")}
            aria-pressed={measurementSystem === "american"}
          >
            {copy.formatAmerican}
          </button>
        </div>
      </div>

      <button
        className="primary-button"
        type="button"
        onClick={onSuggestRecipes}
        disabled={isLoading || ingredients.length === 0}
      >
        {isLoading ? copy.suggestLoading : copy.suggestButton}
      </button>

      <div className="recent-searches">
        <div className="recent-searches-header">
          <div>
            <p className="eyebrow">{copy.recentSearchesLabel}</p>
            <p className="recent-searches-copy">{copy.recentSearchesCopy}</p>
          </div>
          <button
            className="recent-searches-clear"
            type="button"
            onClick={onClearRecentSearches}
            disabled={recentSearches.length === 0}
          >
            {copy.clearHistory}
          </button>
        </div>

        {recentSearches.length === 0 ? (
          <p className="empty-hint">{copy.recentSearchesEmpty}</p>
        ) : (
          <div className="recent-search-list">
            {recentSearches.map((search) => (
              <button
                key={`${search.ingredients.join("|")}::${search.language}::${search.measurementSystem}`}
                type="button"
                className="recent-search-chip"
                onClick={() => onRunRecentSearch(search)}
                aria-label={`${copy.recentSearchRestoreLabel}: ${search.ingredients.join(", ")}. ${copy.recentSearchLanguageLabel}: ${languageOptions.find((option) => option.code === search.language)?.label}. ${copy.recentSearchFormatLabel}: ${
                  search.measurementSystem === "european"
                    ? copy.recentSearchFormatEuropeanShort
                    : copy.recentSearchFormatAmericanShort
                }.`}
              >
                <span className="recent-search-chip-title">{search.ingredients.join(", ")}</span>
                <span className="recent-search-chip-meta">
                  <span className="recent-search-chip-badge" aria-hidden="true">
                    {languageOptions.find((option) => option.code === search.language)?.flag}
                  </span>
                  <span className="recent-search-chip-badge">
                    {search.measurementSystem === "european"
                      ? copy.recentSearchFormatEuropeanShort
                      : copy.recentSearchFormatAmericanShort}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
