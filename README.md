# Mealio

![Mealio logo](client/public/assets/mealio-logo.png)

Mealio is an AI-powered recipe suggestion app built for real use, not just a demo. Users add ingredients as tags, ask for suggestions, and receive exactly four structured recipe ideas generated server-side with OpenAI `gpt-5-nano`.

## Features

- Add ingredients one at a time as removable tags
- Request exactly 4 AI-generated recipes from the server
- Display recipe cards with title, description, cook time, and difficulty
- Show extra ingredients to buy as small azure badges on recipe cards, based on the ingredients entered for that recipe search
- Open a modal for ingredients and step-by-step instructions
- Keep long recipe details scrollable within the rounded modal card so full ingredients and instructions remain accessible on mobile and desktop
- Bookmark recipes in `localStorage`
- Show recent searches below the ingredient input, keep the latest 20 in localStorage, and allow one-tap reruns with a clear-history option
- Default recipe measurements to European format with a user switch for European or American recipe output
- Support six app languages with a persisted flag selector and localized UI labels, buttons, headings, and placeholders
- Generate recipe photos in the background with loading placeholders, then reuse cached images on later views
- Cache repeated ingredient combinations on the server to avoid duplicate OpenAI calls
- Keep the API key server-side only via environment variables
- Mobile-first UI using the provided Mealio branding assets

## Branding Assets

- Logo: `client/public/assets/mealio-logo.png`
- App icon: `client/public/assets/mealio-icon.png`
- Favicon: `client/public/favicon.ico`

## Tech Stack

- React + Vite + TypeScript for the frontend
- Express + TypeScript for the backend
- OpenAI Responses API with structured JSON schema output
- OpenAI image generation with `gpt-image-1-mini`
- Persistent JSON file caches at `server/data/recipe-cache.json` and `server/data/recipe-image-cache.json`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

4. Start the app in development mode:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- API server: `http://localhost:3001`

## Build For Production

```bash
npm run build
npm start
```

The production server serves the built frontend from `dist/client` and exposes the API from the same Node process, which keeps deployment simpler for shared hosting environments that support Node.js apps.

## Deployment Notes

- Keep `OPENAI_API_KEY` in the hosting platform environment settings, never in frontend code.
- For this cPanel target, use the Node App environment-variable UI to set the real `OPENAI_API_KEY`.
- Ensure the hosting environment allows Node.js 20+.
- Confirmed cPanel Node versions available include `20.20.0` and `22.22.0`.
- Recommended default Node version for Mealio is `20.20.0`.
- Set `NODE_ENV=production` for hosted runtime.
- Confirmed working deployment path: local build/package, upload to the cPanel Node app root, then use cPanel `Run NPM Install` and restart the app.
- During the confirmed deployment, `npm` was not available in SSH and cPanel exposed `Run NPM Install` but not a general `npm run build` command.
- Recipe data is cached in `server/data/recipe-cache.json`.
- Generated recipe image metadata is cached in `server/data/recipe-image-cache.json`, and the image files are stored in `server/data/generated-images/`.
- If the host has ephemeral storage, recipe and image caches may reset between deployments or restarts.
- For cPanel deployments, use the Node App feature and point the startup file to `dist/server/index.js`.
- Use `npm run preflight:cpanel` to check the current environment when SSH access is available.
- Use `npm run package:cpanel` to create a local upload bundle if server-side builds are restricted.
- See `DEPLOYMENT.md` for the full cPanel migration workflow.

Confirmed production validation on cPanel:

- homepage loads successfully
- recipe generation works
- image generation works
- app restart works cleanly

## OpenAI Integration

Mealio uses the Responses API with a strict JSON schema so the model returns a structured object containing:

- `id`
- `title`
- `description`
- `cookTime`
- `difficulty`
- `ingredients`
- `instructions`

The model request is made server-side only with `gpt-5-nano`.

Mealio also sends the selected recipe measurement preference with each request:

- `European` by default: metric-first amounts using `g` and `kg`, with cups in brackets where helpful, and `C` with `F` in brackets for temperatures
- `American`: American-style recipe measurements when the user switches formats

The selected format is included in the server cache key so cached European and American responses stay separate.

Mealio also sends the selected app language with each request so recipe titles, descriptions, ingredients, and instructions come back in the chosen language.

## Languages

Mealio supports six languages:

- English (UK)
- French
- German
- Italian
- Portuguese (Portugal)
- Spanish (Spain)

The language selector uses flag buttons, remembers the selected language across sessions, and translates the visible UI including headings, labels, buttons, placeholders, tabs, and modal text.

## Ingredient Comparison

When recipes are returned from the AI, Mealio compares each recipe ingredient list against the ingredients entered for that search.

- Ingredients the user already entered are treated as available, even when the recipe uses a more specific phrasing like `chicken breast` vs `chicken`
- Common pantry staples such as salt, pepper, oil, butter, garlic, onion, sugar, and flour are ignored
- Any remaining extras are shown on the recipe card as small azure badges so it is easy to see what still needs buying
- Bookmark matching uses recipe content rather than the model-provided `id`, so newly generated recipes do not collide with older saved recipes that happen to reuse the same AI id values

## Recent Searches

Mealio stores the last 20 ingredient combinations in browser `localStorage`.

- Repeated searches are de-duplicated so the same ingredient combination only appears once
- Each recent search can be tapped to repopulate the ingredients and rerun the request
- A clear-history button removes the saved recent searches

## Recipe Images

Mealio generates a food photo for each recipe on the server using `gpt-image-1-mini`.

- Recipe cards appear immediately without waiting for image generation.
- A loading placeholder is shown while each image is being created.
- Generated images are reused across recipe suggestions, bookmarks, and the recipe details modal.
- Image requests are cached so the same recipe does not trigger another generation call.
- When an image is ready, the bookmarked recipe entry is updated too, so saved recipes can reopen later with their image already available.
