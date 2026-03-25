import test from "node:test";
import assert from "node:assert/strict";
import {
  loadBookmarks,
  loadLanguage,
  loadRecentSearches,
  saveBookmarks
} from "../client/src/lib/storage";
import { normalizeRecipeIdentity } from "../client/src/lib/recipeIdentity";
import type { Recipe } from "../client/src/lib/types";

class MemoryStorage {
  private store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

const localStorage = new MemoryStorage();

Object.defineProperty(globalThis, "window", {
  value: { localStorage },
  configurable: true
});

function createRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return normalizeRecipeIdentity({
    id: "legacy-id",
    recipeKey: "legacy-id",
    title: "Soup",
    description: "Warming soup.",
    cookTime: "30 mins",
    difficulty: "Easy",
    ingredients: ["Carrot", "Stock"],
    instructions: ["Cook gently."],
    ...overrides
  });
}

test.beforeEach(() => {
  localStorage.clear();
});

test("loadBookmarks migrates legacy bookmark arrays into normalized recipes", () => {
  localStorage.setItem("mealio.bookmarks", JSON.stringify([{ ...createRecipe(), recipeKey: undefined }]));

  const bookmarks = loadBookmarks();

  assert.equal(bookmarks.length, 1);
  assert.equal(bookmarks[0].id, bookmarks[0].recipeKey);
});

test("saveBookmarks writes versioned bookmark storage", () => {
  saveBookmarks([createRecipe()]);

  const stored = JSON.parse(localStorage.getItem("mealio.bookmarks") ?? "{}") as {
    version?: number;
    recipes?: Recipe[];
  };

  assert.equal(stored.version, 2);
  assert.equal(stored.recipes?.length, 1);
});

test("loadRecentSearches migrates legacy ingredient arrays and loadLanguage defaults to English", () => {
  localStorage.setItem("mealio.recent-searches", JSON.stringify([["rice", "spinach"]]));

  const recentSearches = loadRecentSearches();

  assert.deepEqual(recentSearches[0], {
    ingredients: ["rice", "spinach"],
    measurementSystem: "european",
    language: "en-GB"
  });
  assert.equal(loadLanguage(), "en-GB");
});
