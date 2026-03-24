import type { Recipe } from "./types";

const BOOKMARKS_KEY = "mealio.bookmarks";

export function loadBookmarks(): Recipe[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(recipes: Recipe[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(recipes));
}
