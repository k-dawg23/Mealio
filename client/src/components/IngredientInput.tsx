import { FormEvent, KeyboardEvent, useState } from "react";

import type { MeasurementSystem } from "../lib/types";

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onSuggestRecipes: () => void;
  isLoading: boolean;
  measurementSystem: MeasurementSystem;
  onMeasurementSystemChange: (system: MeasurementSystem) => void;
}

export function IngredientInput({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onSuggestRecipes,
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
    </section>
  );
}
