# PROJECT_HISTORY

## Additional enhancements

### Phase 1

- Restore language and measurement format when rerunning recent searches
- Cancel in-flight recipe suggestion requests so repeated searches cannot overwrite newer results
- Improve section-specific loading and error states for recipe suggestions
- Add clearer recipe image fallback states with a retry path

### Phase 2

- Improve modal accessibility with focus trapping, `Escape` support, and focus restoration
- Add `aria-live` feedback for loading states and recent-search actions
- Refine labels and accessible names around dynamic controls and status content
- Tighten the mobile information hierarchy in the ingredients panel

### Phase 3

- Introduce stable app-generated recipe identity beyond AI-provided ids
- Add versioned bookmark persistence for safer future migrations
- Normalize identity rules across bookmarks, image caching, and saved recipe state
- Harden server-side validation around AI output length and structure

### Phase 4

- Reduce repeated recipe and image state mapping in the client
- Move translations into a more scalable locale-file structure
- Add targeted unit tests for ingredient comparison, bookmark matching, recent searches, and language preference behavior
- Add structured logging hooks for production troubleshooting

### Phase 5

- Explain extra-ingredient logic more clearly in the UI
- Make pantry-staple assumptions more transparent
- Improve user-facing transparency when recipe or image generation fails

## 2026-03-24

### Project creation

- Created a new project at `Recipe-App/Mealio`
- Chose a deployable Node.js architecture with a Vite React frontend and Express backend
- Added the provided Mealio logo and icon assets to the frontend public folder

### Frontend

- Built a mobile-first React interface for adding ingredients as tags
- Added recipe suggestion, recipe listing, recipe detail modal, and bookmark flows
- Implemented bookmark persistence using browser `localStorage`
- Styled the app around the Mealio orange, gold, cream, and green palette inspired by the supplied branding assets
- Updated the interface to follow the Stitch `mealio_azure` design system with Plus Jakarta Sans, warm/azure tonal layering, oversized radii, glassmorphism accents, and editorial asymmetry

### Backend

- Added an Express API endpoint for recipe suggestions
- Implemented ingredient normalization and cache-key generation so equivalent ingredient sets reuse cached responses
- Added a server-side persistent JSON cache to reduce duplicate OpenAI requests
- Integrated OpenAI `gpt-5-nano` using the Responses API and a strict JSON schema requiring exactly 4 recipes

### Documentation and operations

- Added `.env.example` for secure API key configuration
- Added `README.md` with setup, build, and deployment notes
- Prepared the project to be committed to its own GitHub repository later
- Added the Mealio logo to the README for repository presentation
- Added a project note to keep future repo-facing wording and commit messaging in English only

### Visual refinement and UX fixes

- Updated the frontend to follow the Stitch `mealio_azure` design system more closely
- Lightened the hero background and aligned the hero stat panels with the azure secondary style
- Simplified the hero panel messaging to stay user-facing and recipe-relevant
- Reduced the mobile hero so ingredient entry is visible without scrolling
- Moved recipe save actions into the recipe details modal and fixed modal layering above page content
- Updated long recipe detail modals to scroll inside the rounded card so full content stays accessible without the scrollbar breaking the card edge

### OpenAI reliability

- Switched the recipe request to the SDK parser-backed structured output flow
- Reduced model reasoning effort and increased the output token budget so `gpt-5-nano` reliably returns the full 4-recipe JSON payload

### Recipe formatting and generation preferences

- Added a recipe format preference with `European` as the default output style
- Implemented a user-facing European/American format switch in the ingredients panel so measurement preference is chosen before generating recipes
- Saved the format preference in browser `localStorage` for repeat visits
- Updated the server request and prompt so OpenAI generates recipes in the selected measurement style
- Added measurement preference to the cache key so different format variants do not collide

### Language support

- Added a flag-based language selector for English (UK), French, German, Italian, Portuguese (Portugal), and Spanish (Spain)
- Localized app UI copy including headings, labels, buttons, placeholders, tabs, and modal text
- Saved the selected language in browser `localStorage` so the language choice persists across sessions
- Sent the selected language to the server and OpenAI request so recipe content is generated in the chosen language
- Refined the hero placement of the flag selector so it sits naturally in the hero layout and stays on a single row across breakpoints

### Ingredient comparison

- Added recipe ingredient comparison against the user-entered ingredient list for each suggestion batch
- Ignored common pantry staples such as salt, pepper, oil, butter, garlic, onion, sugar, and flour during extra-ingredient detection
- Displayed non-pantry extra ingredients as compact azure badges on recipe cards so users can quickly see what they still need to buy
- Switched bookmark identity to recipe content instead of AI-provided recipe ids so fresh suggestions do not incorrectly appear as already saved when the model reuses ids

### Search history

- Added recent searches below the ingredient input with a mobile-friendly and desktop-friendly layout
- Stored the last 20 ingredient combinations in browser `localStorage`
- Added de-duplication so repeated ingredient combinations do not create duplicate history entries
- Added click-to-rerun behavior for previous searches and a clear-history control

## 2026-03-25

### Phase 1 enhancements

- Expanded recent-search storage so each entry now restores the original language and recipe measurement preference when rerun
- Added cancellation for in-flight recipe suggestion requests so newer searches are not replaced by slower older responses
- Reworked recipe results states so loading and failure feedback is shown in the suggestions section instead of relying on one generic error banner
- Added clearer image fallback handling with an explicit unavailable state and retry support in the recipe details modal

### Phase 2 enhancements

- Added keyboard-friendly modal behavior with focus trapping, `Escape` support, and focus returning to the previously selected recipe card
- Added polite live-region announcements for recipe loading, recipe results, recent-search reruns, and search-history clearing
- Improved accessible labels for ingredient removal, recent-search metadata, language selection, and segmented recipe/bookmark controls
- Tightened the mobile ingredients panel hierarchy with more compact spacing and a touch-friendly horizontal recent-search layout

### Recipe images

- Added background recipe image generation using OpenAI `gpt-image-1-mini`
- Implemented non-blocking client image loading so recipe cards appear immediately while images generate in the background
- Added loading placeholders that swap to generated food photography when ready
- Reused generated images across suggested recipes, bookmarked recipes, and the recipe details modal
- Added persistent image cache metadata plus generated image file storage on the server
- Added Vite dev-server proxy support for `/generated-images` so cached images load correctly during local development
- Updated bookmarked recipe persistence so generated image URLs are written back into saved recipes for reliable image restore after reopening the app
