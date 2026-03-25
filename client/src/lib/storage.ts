import type { LanguageCode, MeasurementSystem, Recipe, RecentSearchEntry } from "./types";

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

export function loadRecentSearches(): RecentSearchEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((entry) => {
      if (Array.isArray(entry)) {
        const ingredients = entry.filter((item): item is string => typeof item === "string");

        return ingredients.length > 0
          ? [{
              ingredients,
              measurementSystem: loadMeasurementSystem(),
              language: loadLanguage()
            }]
          : [];
      }

      if (typeof entry !== "object" || !entry) {
        return [];
      }

      const candidate = entry as {
        ingredients?: unknown;
        measurementSystem?: unknown;
        language?: unknown;
      };

      const ingredients = Array.isArray(candidate.ingredients)
        ? candidate.ingredients.filter((item): item is string => typeof item === "string")
        : [];

      if (ingredients.length === 0) {
        return [];
      }

      const language: LanguageCode =
        candidate.language === "fr-FR" ||
        candidate.language === "de-DE" ||
        candidate.language === "it-IT" ||
        candidate.language === "pt-PT" ||
        candidate.language === "es-ES"
          ? candidate.language
          : "en-GB";

      return [{
        ingredients,
        measurementSystem:
          candidate.measurementSystem === "american" ? ("american" as const) : ("european" as const),
        language
      }];
    }).slice(0, 20);
  } catch {
    return [];
  }
}

export function saveRecentSearches(searches: RecentSearchEntry[]) {
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
