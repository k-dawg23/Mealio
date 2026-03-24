import type { MeasurementSystem, Recipe } from "./types";

const BOOKMARKS_KEY = "mealio.bookmarks";
const MEASUREMENT_KEY = "mealio.measurement-system";

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

export function loadMeasurementSystem(): MeasurementSystem {
  if (typeof window === "undefined") {
    return "european";
  }

  const raw = window.localStorage.getItem(MEASUREMENT_KEY);
  return raw === "american" ? "american" : "european";
}

export function saveMeasurementSystem(system: MeasurementSystem) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MEASUREMENT_KEY, system);
}
