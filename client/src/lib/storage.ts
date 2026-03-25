import type { LanguageCode, MeasurementSystem, Recipe } from "./types";

const BOOKMARKS_KEY = "mealio.bookmarks";
const MEASUREMENT_KEY = "mealio.measurement-system";
const RECENT_SEARCHES_KEY = "mealio.recent-searches";
const LANGUAGE_KEY = "mealio.language";

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

export function loadRecentSearches(): string[][] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[][]) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearches(searches: string[][]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

export function loadLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return "en-GB";
  }

  const raw = window.localStorage.getItem(LANGUAGE_KEY);
  return raw === "fr-FR" ||
    raw === "de-DE" ||
    raw === "it-IT" ||
    raw === "pt-PT" ||
    raw === "es-ES"
    ? raw
    : "en-GB";
}

export function saveLanguage(language: LanguageCode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_KEY, language);
}
