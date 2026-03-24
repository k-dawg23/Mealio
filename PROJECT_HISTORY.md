# PROJECT_HISTORY

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

### Visual refinement and UX fixes

- Updated the frontend to follow the Stitch `mealio_azure` design system more closely
- Lightened the hero background and aligned the hero stat panels with the azure secondary style
- Simplified the hero panel messaging to stay user-facing and recipe-relevant
- Reduced the mobile hero so ingredient entry is visible without scrolling
- Moved recipe save actions into the recipe details modal and fixed modal layering above page content

### OpenAI reliability

- Switched the recipe request to the SDK parser-backed structured output flow
- Reduced model reasoning effort and increased the output token budget so `gpt-5-nano` reliably returns the full 4-recipe JSON payload

### Recipe formatting and generation preferences

- Added a recipe format preference with `European` as the default output style
- Implemented a user-facing European/American format switch in the ingredients panel so measurement preference is chosen before generating recipes
- Saved the format preference in browser `localStorage` for repeat visits
- Updated the server request and prompt so OpenAI generates recipes in the selected measurement style
- Added measurement preference to the cache key so different format variants do not collide
