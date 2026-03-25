import type { Difficulty } from "./types";

export type LanguageCode = "en-GB" | "fr-FR" | "de-DE" | "it-IT" | "pt-PT" | "es-ES";

interface TranslationSet {
  languageSelectorLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroCopy: string;
  heroNote: string;
  heroMagicLabel: string;
  heroMagicText: string;
  heroSimpleLabel: string;
  heroSimpleText: string;
  heroAssistLabel: string;
  heroAssistText: string;
  heroKitchenLabel: string;
  heroKitchenText: string;
  ingredientsEyebrow: string;
  ingredientsTitle: string;
  ingredientsCopy: string;
  addButton: string;
  ingredientPlaceholder: string;
  noIngredients: string;
  recipeFormatLabel: string;
  formatEuropean: string;
  formatAmerican: string;
  suggestButton: string;
  suggestLoading: string;
  recipesEyebrow: string;
  suggestedTitle: string;
  savedTitle: string;
  suggestionsTab: string;
  bookmarksTab: string;
  noBookmarksTitle: string;
  noBookmarksCopy: string;
  readyTitle: string;
  readyCopy: string;
  modalEyebrow: string;
  modalIngredients: string;
  modalInstructions: string;
  modalClose: string;
  modalSave: string;
  modalSaved: string;
  removeBookmark: string;
  saveRecipe: string;
  extraIngredientsAria: string;
  recentSearchesLabel: string;
  recentSearchesCopy: string;
  recentSearchesEmpty: string;
  clearHistory: string;
  recentSearchFormatEuropeanShort: string;
  recentSearchFormatAmericanShort: string;
  recentSearchRestoreLabel: string;
  resultsLoadingTitle: string;
  resultsLoadingCopy: string;
  resultsErrorTitle: string;
  resultsErrorCopy: string;
  resultsRetry: string;
  resultsStaleError: string;
  imageLoadingLabel: string;
  imageUnavailableTitle: string;
  imageUnavailableCopy: string;
  imageRetry: string;
  fetchError: string;
}

export const languageOptions: Array<{ code: LanguageCode; flag: string; label: string }> = [
  { code: "en-GB", flag: "🇬🇧", label: "English" },
  { code: "fr-FR", flag: "🇫🇷", label: "French" },
  { code: "de-DE", flag: "🇩🇪", label: "German" },
  { code: "it-IT", flag: "🇮🇹", label: "Italian" },
  { code: "pt-PT", flag: "🇵🇹", label: "Portuguese" },
  { code: "es-ES", flag: "🇪🇸", label: "Spanish" }
];

const translations: Record<LanguageCode, TranslationSet> = {
  "en-GB": {
    languageSelectorLabel: "App language",
    heroEyebrow: "AI recipe suggestion app",
    heroTitle: "Cook from what you already have.",
    heroCopy: "Add ingredients, get four structured recipe ideas, and save the ones you want to make later.",
    heroNote: "Azure highlights mark Mealio's AI-powered guidance.",
    heroMagicLabel: "Magic mode",
    heroMagicText: "Ingredient-led ideas with practical pantry staples",
    heroSimpleLabel: "Suggestions made simple",
    heroSimpleText: "4 recipes every time",
    heroAssistLabel: "Azure assistance",
    heroAssistText: "Helpful AI cues for smarter ingredient-led ideas",
    heroKitchenLabel: "Built for real kitchens",
    heroKitchenText: "Flexible recipe ideas based on what you already have",
    ingredientsEyebrow: "Your ingredients",
    ingredientsTitle: "Build your basket one ingredient at a time.",
    ingredientsCopy: "Add what you already have in the kitchen. Mealio will suggest four realistic recipe ideas that make use of those ingredients.",
    addButton: "Add",
    ingredientPlaceholder: "Try chicken, spinach, rice...",
    noIngredients: "No ingredients added yet.",
    recipeFormatLabel: "Recipe format",
    formatEuropean: "European",
    formatAmerican: "American",
    suggestButton: "Suggest Recipes",
    suggestLoading: "Finding recipes...",
    recipesEyebrow: "Recipes",
    suggestedTitle: "Suggested for you",
    savedTitle: "Saved recipes",
    suggestionsTab: "Suggestions",
    bookmarksTab: "Bookmarks",
    noBookmarksTitle: "No bookmarks yet",
    noBookmarksCopy: "Save recipes you want to revisit and they’ll stay on this device.",
    readyTitle: "Ready when you are",
    readyCopy: "Add a few ingredients and Mealio will suggest recipes you can actually make.",
    modalEyebrow: "Recipe details",
    modalIngredients: "Ingredients",
    modalInstructions: "Instructions",
    modalClose: "Close recipe",
    modalSave: "Save",
    modalSaved: "Saved",
    removeBookmark: "Remove bookmark",
    saveRecipe: "Save recipe",
    extraIngredientsAria: "Extra ingredients needed",
    recentSearchesLabel: "Recent searches",
    recentSearchesCopy: "Tap a previous ingredient combination to run it again.",
    recentSearchesEmpty: "Your last 20 searches will appear here.",
    clearHistory: "Clear history",
    recentSearchFormatEuropeanShort: "EU",
    recentSearchFormatAmericanShort: "US",
    recentSearchRestoreLabel: "Restore search",
    resultsLoadingTitle: "Finding recipe ideas",
    resultsLoadingCopy: "Mealio is building four recipes from your ingredients.",
    resultsErrorTitle: "Recipes could not be refreshed",
    resultsErrorCopy: "Try the same ingredients again or adjust your basket and rerun the search.",
    resultsRetry: "Try again",
    resultsStaleError: "Mealio could not refresh recipes right now. Showing your last results.",
    imageLoadingLabel: "Generating recipe image",
    imageUnavailableTitle: "Image unavailable",
    imageUnavailableCopy: "The recipe is ready even if the photo is not.",
    imageRetry: "Retry image",
    fetchError: "Something went wrong while suggesting recipes."
  },
  "fr-FR": {
    languageSelectorLabel: "Langue de l'application",
    heroEyebrow: "Application de suggestions de recettes par IA",
    heroTitle: "Cuisinez avec ce que vous avez déjà.",
    heroCopy: "Ajoutez des ingrédients, obtenez quatre idées de recettes structurées et enregistrez celles que vous voulez refaire.",
    heroNote: "Les touches azur mettent en avant l'aide IA de Mealio.",
    heroMagicLabel: "Mode magique",
    heroMagicText: "Des idées guidées par vos ingrédients avec des basiques du placard",
    heroSimpleLabel: "Suggestions simplifiées",
    heroSimpleText: "4 recettes à chaque fois",
    heroAssistLabel: "Assistance azur",
    heroAssistText: "Des repères IA utiles pour des idées plus pertinentes",
    heroKitchenLabel: "Pensé pour la vraie cuisine",
    heroKitchenText: "Des idées souples basées sur ce que vous avez déjà",
    ingredientsEyebrow: "Vos ingrédients",
    ingredientsTitle: "Composez votre panier un ingrédient à la fois.",
    ingredientsCopy: "Ajoutez ce que vous avez déjà dans votre cuisine. Mealio proposera quatre idées de recettes réalistes qui utilisent ces ingrédients.",
    addButton: "Ajouter",
    ingredientPlaceholder: "Par exemple poulet, épinards, riz...",
    noIngredients: "Aucun ingrédient ajouté pour le moment.",
    recipeFormatLabel: "Format des recettes",
    formatEuropean: "Européen",
    formatAmerican: "Américain",
    suggestButton: "Suggérer des recettes",
    suggestLoading: "Recherche des recettes...",
    recipesEyebrow: "Recettes",
    suggestedTitle: "Suggestions pour vous",
    savedTitle: "Recettes enregistrées",
    suggestionsTab: "Suggestions",
    bookmarksTab: "Favoris",
    noBookmarksTitle: "Aucun favori pour le moment",
    noBookmarksCopy: "Enregistrez les recettes à revoir et elles resteront sur cet appareil.",
    readyTitle: "Prêt quand vous l’êtes",
    readyCopy: "Ajoutez quelques ingrédients et Mealio suggérera des recettes que vous pouvez vraiment cuisiner.",
    modalEyebrow: "Détails de la recette",
    modalIngredients: "Ingrédients",
    modalInstructions: "Instructions",
    modalClose: "Fermer la recette",
    modalSave: "Enregistrer",
    modalSaved: "Enregistrée",
    removeBookmark: "Retirer le favori",
    saveRecipe: "Enregistrer la recette",
    extraIngredientsAria: "Ingrédients supplémentaires nécessaires",
    recentSearchesLabel: "Recherches récentes",
    recentSearchesCopy: "Touchez une combinaison précédente pour la relancer.",
    recentSearchesEmpty: "Vos 20 dernières recherches apparaîtront ici.",
    clearHistory: "Effacer l’historique",
    recentSearchFormatEuropeanShort: "UE",
    recentSearchFormatAmericanShort: "US",
    recentSearchRestoreLabel: "Relancer la recherche",
    resultsLoadingTitle: "Recherche d’idées de recettes",
    resultsLoadingCopy: "Mealio prépare quatre recettes à partir de vos ingrédients.",
    resultsErrorTitle: "Les recettes n’ont pas pu être actualisées",
    resultsErrorCopy: "Réessayez avec les mêmes ingrédients ou modifiez votre panier puis relancez la recherche.",
    resultsRetry: "Réessayer",
    resultsStaleError: "Mealio n’a pas pu actualiser les recettes pour le moment. Les derniers résultats restent affichés.",
    imageLoadingLabel: "Création de l’image de la recette",
    imageUnavailableTitle: "Image indisponible",
    imageUnavailableCopy: "La recette est prête même si la photo ne l’est pas.",
    imageRetry: "Réessayer l’image",
    fetchError: "Un problème est survenu lors de la suggestion des recettes."
  },
  "de-DE": {
    languageSelectorLabel: "App-Sprache",
    heroEyebrow: "KI-Rezeptvorschlags-App",
    heroTitle: "Koche mit dem, was du schon hast.",
    heroCopy: "Füge Zutaten hinzu, erhalte vier strukturierte Rezeptideen und speichere die, die du später kochen möchtest.",
    heroNote: "Azurfarbene Highlights markieren Mealios KI-Hilfe.",
    heroMagicLabel: "Magischer Modus",
    heroMagicText: "Zutatenbasierte Ideen mit praktischen Vorratszutaten",
    heroSimpleLabel: "Einfach vorgeschlagen",
    heroSimpleText: "Jedes Mal 4 Rezepte",
    heroAssistLabel: "Azur-Unterstützung",
    heroAssistText: "Hilfreiche KI-Hinweise für passendere Ideen",
    heroKitchenLabel: "Für echte Küchen gemacht",
    heroKitchenText: "Flexible Rezeptideen basierend auf dem, was du schon hast",
    ingredientsEyebrow: "Deine Zutaten",
    ingredientsTitle: "Baue deinen Vorrat eine Zutat nach der anderen auf.",
    ingredientsCopy: "Füge hinzu, was du bereits in der Küche hast. Mealio schlägt vier realistische Rezeptideen vor, die diese Zutaten nutzen.",
    addButton: "Hinzufügen",
    ingredientPlaceholder: "Zum Beispiel Hähnchen, Spinat, Reis...",
    noIngredients: "Noch keine Zutaten hinzugefügt.",
    recipeFormatLabel: "Rezeptformat",
    formatEuropean: "Europäisch",
    formatAmerican: "Amerikanisch",
    suggestButton: "Rezepte vorschlagen",
    suggestLoading: "Rezepte werden gesucht...",
    recipesEyebrow: "Rezepte",
    suggestedTitle: "Für dich vorgeschlagen",
    savedTitle: "Gespeicherte Rezepte",
    suggestionsTab: "Vorschläge",
    bookmarksTab: "Gespeichert",
    noBookmarksTitle: "Noch keine Lesezeichen",
    noBookmarksCopy: "Speichere Rezepte, die du später wiedersehen möchtest; sie bleiben auf diesem Gerät.",
    readyTitle: "Bereit, wenn du es bist",
    readyCopy: "Füge ein paar Zutaten hinzu und Mealio schlägt Rezepte vor, die du wirklich kochen kannst.",
    modalEyebrow: "Rezeptdetails",
    modalIngredients: "Zutaten",
    modalInstructions: "Anleitung",
    modalClose: "Rezept schließen",
    modalSave: "Speichern",
    modalSaved: "Gespeichert",
    removeBookmark: "Lesezeichen entfernen",
    saveRecipe: "Rezept speichern",
    extraIngredientsAria: "Zusätzliche benötigte Zutaten",
    recentSearchesLabel: "Letzte Suchen",
    recentSearchesCopy: "Tippe auf eine frühere Zutatenkombination, um sie erneut auszuführen.",
    recentSearchesEmpty: "Deine letzten 20 Suchen erscheinen hier.",
    clearHistory: "Verlauf löschen",
    recentSearchFormatEuropeanShort: "EU",
    recentSearchFormatAmericanShort: "US",
    recentSearchRestoreLabel: "Suche wiederherstellen",
    resultsLoadingTitle: "Rezeptideen werden gesucht",
    resultsLoadingCopy: "Mealio erstellt vier Rezepte aus deinen Zutaten.",
    resultsErrorTitle: "Rezepte konnten nicht aktualisiert werden",
    resultsErrorCopy: "Versuche dieselben Zutaten erneut oder passe deinen Vorrat an und starte die Suche noch einmal.",
    resultsRetry: "Erneut versuchen",
    resultsStaleError: "Mealio konnte die Rezepte gerade nicht aktualisieren. Die letzten Ergebnisse werden weiter angezeigt.",
    imageLoadingLabel: "Rezeptbild wird erstellt",
    imageUnavailableTitle: "Bild nicht verfügbar",
    imageUnavailableCopy: "Das Rezept ist bereit, auch wenn das Foto fehlt.",
    imageRetry: "Bild erneut laden",
    fetchError: "Beim Vorschlagen der Rezepte ist ein Fehler aufgetreten."
  },
  "it-IT": {
    languageSelectorLabel: "Lingua dell'app",
    heroEyebrow: "App di suggerimenti di ricette con IA",
    heroTitle: "Cucina con quello che hai già.",
    heroCopy: "Aggiungi ingredienti, ottieni quattro idee di ricette strutturate e salva quelle che vuoi preparare più tardi.",
    heroNote: "Gli accenti azzurri evidenziano la guida IA di Mealio.",
    heroMagicLabel: "Modalità magica",
    heroMagicText: "Idee guidate dagli ingredienti con dispensa pratica",
    heroSimpleLabel: "Suggerimenti semplificati",
    heroSimpleText: "4 ricette ogni volta",
    heroAssistLabel: "Assistenza azzurra",
    heroAssistText: "Indicazioni IA utili per idee più mirate",
    heroKitchenLabel: "Pensato per cucine vere",
    heroKitchenText: "Idee flessibili basate su quello che hai già",
    ingredientsEyebrow: "I tuoi ingredienti",
    ingredientsTitle: "Crea il tuo assortimento un ingrediente alla volta.",
    ingredientsCopy: "Aggiungi ciò che hai già in cucina. Mealio suggerirà quattro idee di ricette realistiche che usano questi ingredienti.",
    addButton: "Aggiungi",
    ingredientPlaceholder: "Prova pollo, spinaci, riso...",
    noIngredients: "Nessun ingrediente aggiunto ancora.",
    recipeFormatLabel: "Formato ricette",
    formatEuropean: "Europeo",
    formatAmerican: "Americano",
    suggestButton: "Suggerisci ricette",
    suggestLoading: "Ricette in ricerca...",
    recipesEyebrow: "Ricette",
    suggestedTitle: "Suggerite per te",
    savedTitle: "Ricette salvate",
    suggestionsTab: "Suggerimenti",
    bookmarksTab: "Salvati",
    noBookmarksTitle: "Nessun salvataggio ancora",
    noBookmarksCopy: "Salva le ricette che vuoi rivedere e resteranno su questo dispositivo.",
    readyTitle: "Pronto quando lo sei tu",
    readyCopy: "Aggiungi qualche ingrediente e Mealio suggerirà ricette che puoi davvero preparare.",
    modalEyebrow: "Dettagli ricetta",
    modalIngredients: "Ingredienti",
    modalInstructions: "Istruzioni",
    modalClose: "Chiudi ricetta",
    modalSave: "Salva",
    modalSaved: "Salvata",
    removeBookmark: "Rimuovi salvataggio",
    saveRecipe: "Salva ricetta",
    extraIngredientsAria: "Ingredienti extra necessari",
    recentSearchesLabel: "Ricerche recenti",
    recentSearchesCopy: "Tocca una combinazione precedente per ripeterla.",
    recentSearchesEmpty: "Le tue ultime 20 ricerche appariranno qui.",
    clearHistory: "Cancella cronologia",
    recentSearchFormatEuropeanShort: "EU",
    recentSearchFormatAmericanShort: "US",
    recentSearchRestoreLabel: "Ripristina ricerca",
    resultsLoadingTitle: "Ricerca di idee ricette",
    resultsLoadingCopy: "Mealio sta preparando quattro ricette dai tuoi ingredienti.",
    resultsErrorTitle: "Non è stato possibile aggiornare le ricette",
    resultsErrorCopy: "Riprova con gli stessi ingredienti oppure modifica ciò che hai e rilancia la ricerca.",
    resultsRetry: "Riprova",
    resultsStaleError: "Mealio non è riuscito ad aggiornare le ricette in questo momento. Gli ultimi risultati restano visibili.",
    imageLoadingLabel: "Generazione immagine ricetta",
    imageUnavailableTitle: "Immagine non disponibile",
    imageUnavailableCopy: "La ricetta è pronta anche se la foto non lo è.",
    imageRetry: "Riprova immagine",
    fetchError: "Si è verificato un problema nel suggerire le ricette."
  },
  "pt-PT": {
    languageSelectorLabel: "Idioma da aplicação",
    heroEyebrow: "Aplicação de sugestões de receitas com IA",
    heroTitle: "Cozinhe com o que já tem.",
    heroCopy: "Adicione ingredientes, receba quatro ideias de receitas estruturadas e guarde as que quiser fazer mais tarde.",
    heroNote: "Os destaques em azul assinalam a ajuda de IA do Mealio.",
    heroMagicLabel: "Modo mágico",
    heroMagicText: "Ideias guiadas pelos ingredientes com básicos de despensa",
    heroSimpleLabel: "Sugestões simplificadas",
    heroSimpleText: "4 receitas de cada vez",
    heroAssistLabel: "Assistência azul",
    heroAssistText: "Pistas de IA úteis para ideias mais acertadas",
    heroKitchenLabel: "Feito para cozinhas reais",
    heroKitchenText: "Ideias flexíveis com base no que já tem",
    ingredientsEyebrow: "Os seus ingredientes",
    ingredientsTitle: "Construa o seu conjunto um ingrediente de cada vez.",
    ingredientsCopy: "Adicione o que já tem na cozinha. O Mealio vai sugerir quatro ideias de receitas realistas que usem esses ingredientes.",
    addButton: "Adicionar",
    ingredientPlaceholder: "Experimente frango, espinafres, arroz...",
    noIngredients: "Ainda não adicionou ingredientes.",
    recipeFormatLabel: "Formato da receita",
    formatEuropean: "Europeu",
    formatAmerican: "Americano",
    suggestButton: "Sugerir receitas",
    suggestLoading: "A procurar receitas...",
    recipesEyebrow: "Receitas",
    suggestedTitle: "Sugeridas para si",
    savedTitle: "Receitas guardadas",
    suggestionsTab: "Sugestões",
    bookmarksTab: "Guardados",
    noBookmarksTitle: "Ainda sem guardados",
    noBookmarksCopy: "Guarde receitas para rever mais tarde e elas ficarão neste dispositivo.",
    readyTitle: "Pronto quando quiser",
    readyCopy: "Adicione alguns ingredientes e o Mealio irá sugerir receitas que pode realmente fazer.",
    modalEyebrow: "Detalhes da receita",
    modalIngredients: "Ingredientes",
    modalInstructions: "Instruções",
    modalClose: "Fechar receita",
    modalSave: "Guardar",
    modalSaved: "Guardada",
    removeBookmark: "Remover guardado",
    saveRecipe: "Guardar receita",
    extraIngredientsAria: "Ingredientes extra necessários",
    recentSearchesLabel: "Pesquisas recentes",
    recentSearchesCopy: "Toque numa combinação anterior para a voltar a executar.",
    recentSearchesEmpty: "As suas últimas 20 pesquisas aparecerão aqui.",
    clearHistory: "Limpar histórico",
    recentSearchFormatEuropeanShort: "UE",
    recentSearchFormatAmericanShort: "US",
    recentSearchRestoreLabel: "Repor pesquisa",
    resultsLoadingTitle: "A procurar ideias de receitas",
    resultsLoadingCopy: "O Mealio está a preparar quatro receitas com os seus ingredientes.",
    resultsErrorTitle: "Não foi possível atualizar as receitas",
    resultsErrorCopy: "Tente novamente com os mesmos ingredientes ou ajuste o conjunto e volte a pesquisar.",
    resultsRetry: "Tentar novamente",
    resultsStaleError: "O Mealio não conseguiu atualizar as receitas neste momento. Os últimos resultados continuam visíveis.",
    imageLoadingLabel: "A gerar imagem da receita",
    imageUnavailableTitle: "Imagem indisponível",
    imageUnavailableCopy: "A receita está pronta mesmo que a fotografia não esteja.",
    imageRetry: "Tentar imagem novamente",
    fetchError: "Ocorreu um problema ao sugerir receitas."
  },
  "es-ES": {
    languageSelectorLabel: "Idioma de la aplicación",
    heroEyebrow: "Aplicación de sugerencias de recetas con IA",
    heroTitle: "Cocina con lo que ya tienes.",
    heroCopy: "Añade ingredientes, obtén cuatro ideas de recetas estructuradas y guarda las que quieras preparar más tarde.",
    heroNote: "Los toques azules destacan la ayuda de IA de Mealio.",
    heroMagicLabel: "Modo mágico",
    heroMagicText: "Ideas guiadas por ingredientes con básicos de despensa",
    heroSimpleLabel: "Sugerencias simplificadas",
    heroSimpleText: "4 recetas cada vez",
    heroAssistLabel: "Asistencia azul",
    heroAssistText: "Pistas de IA útiles para ideas más acertadas",
    heroKitchenLabel: "Pensado para cocinas reales",
    heroKitchenText: "Ideas flexibles basadas en lo que ya tienes",
    ingredientsEyebrow: "Tus ingredientes",
    ingredientsTitle: "Construye tu cesta un ingrediente cada vez.",
    ingredientsCopy: "Añade lo que ya tienes en la cocina. Mealio sugerirá cuatro ideas de recetas realistas que aprovechen esos ingredientes.",
    addButton: "Añadir",
    ingredientPlaceholder: "Prueba pollo, espinacas, arroz...",
    noIngredients: "Aún no has añadido ingredientes.",
    recipeFormatLabel: "Formato de receta",
    formatEuropean: "Europeo",
    formatAmerican: "Americano",
    suggestButton: "Sugerir recetas",
    suggestLoading: "Buscando recetas...",
    recipesEyebrow: "Recetas",
    suggestedTitle: "Sugeridas para ti",
    savedTitle: "Recetas guardadas",
    suggestionsTab: "Sugerencias",
    bookmarksTab: "Guardados",
    noBookmarksTitle: "Todavía no hay guardados",
    noBookmarksCopy: "Guarda recetas para volver a ellas y seguirán en este dispositivo.",
    readyTitle: "Listo cuando tú lo estés",
    readyCopy: "Añade algunos ingredientes y Mealio sugerirá recetas que realmente puedes preparar.",
    modalEyebrow: "Detalles de la receta",
    modalIngredients: "Ingredientes",
    modalInstructions: "Instrucciones",
    modalClose: "Cerrar receta",
    modalSave: "Guardar",
    modalSaved: "Guardada",
    removeBookmark: "Quitar guardado",
    saveRecipe: "Guardar receta",
    extraIngredientsAria: "Ingredientes extra necesarios",
    recentSearchesLabel: "Búsquedas recientes",
    recentSearchesCopy: "Toca una combinación anterior para volver a ejecutarla.",
    recentSearchesEmpty: "Tus últimas 20 búsquedas aparecerán aquí.",
    clearHistory: "Borrar historial",
    recentSearchFormatEuropeanShort: "UE",
    recentSearchFormatAmericanShort: "US",
    recentSearchRestoreLabel: "Recuperar búsqueda",
    resultsLoadingTitle: "Buscando ideas de recetas",
    resultsLoadingCopy: "Mealio está preparando cuatro recetas con tus ingredientes.",
    resultsErrorTitle: "No se pudieron actualizar las recetas",
    resultsErrorCopy: "Vuelve a intentarlo con los mismos ingredientes o ajusta tu selección y repite la búsqueda.",
    resultsRetry: "Intentar de nuevo",
    resultsStaleError: "Mealio no pudo actualizar las recetas ahora mismo. Se muestran tus últimos resultados.",
    imageLoadingLabel: "Generando imagen de la receta",
    imageUnavailableTitle: "Imagen no disponible",
    imageUnavailableCopy: "La receta está lista aunque la foto no lo esté.",
    imageRetry: "Reintentar imagen",
    fetchError: "Se produjo un problema al sugerir las recetas."
  }
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
