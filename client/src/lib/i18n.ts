import type { Difficulty, LanguageCode } from "./types";
import { deDE } from "./locales/de-DE";
import { enGB } from "./locales/en-GB";
import { esES } from "./locales/es-ES";
import { frFR } from "./locales/fr-FR";
import { itIT } from "./locales/it-IT";
import { ptPT } from "./locales/pt-PT";
import type { TranslationSet } from "./locales/types";

export type { TranslationSet } from "./locales/types";

export const languageOptions: Array<{ code: LanguageCode; flag: string; label: string }> = [
  { code: "en-GB", flag: "🇬🇧", label: "English" },
  { code: "fr-FR", flag: "🇫🇷", label: "French" },
  { code: "de-DE", flag: "🇩🇪", label: "German" },
  { code: "it-IT", flag: "🇮🇹", label: "Italian" },
  { code: "pt-PT", flag: "🇵🇹", label: "Portuguese" },
  { code: "es-ES", flag: "🇪🇸", label: "Spanish" }
];

const translations: Record<LanguageCode, TranslationSet> = {
  "en-GB": enGB,
  "fr-FR": frFR,
  "de-DE": deDE,
  "it-IT": itIT,
  "pt-PT": ptPT,
  "es-ES": esES
};

const difficultyTranslations: Record<LanguageCode, Record<Difficulty, string>> = {
  "en-GB": { Easy: "Easy", Medium: "Medium", Hard: "Hard" },
  "fr-FR": { Easy: "Facile", Medium: "Moyen", Hard: "Difficile" },
  "de-DE": { Easy: "Leicht", Medium: "Mittel", Hard: "Schwer" },
  "it-IT": { Easy: "Facile", Medium: "Media", Hard: "Difficile" },
  "pt-PT": { Easy: "Fácil", Medium: "Médio", Hard: "Difícil" },
  "es-ES": { Easy: "Fácil", Medium: "Media", Hard: "Difícil" }
};

export function getTranslations(language: LanguageCode) {
  return translations[language];
}

export function translateDifficulty(language: LanguageCode, difficulty: Difficulty) {
  return difficultyTranslations[language][difficulty];
}
