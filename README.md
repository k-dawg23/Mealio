# Mealio

![Mealio logo](client/public/assets/mealio-logo.png)

Mealio is an AI-powered recipe suggestion app built for real use, not just a demo. Users add ingredients as tags, ask for suggestions, and receive exactly four structured recipe ideas generated server-side with OpenAI `gpt-5-nano`.

## Features

- Add ingredients one at a time as removable tags
- Request exactly 4 AI-generated recipes from the server
- Display recipe cards with title, description, cook time, and difficulty
- Open a modal for ingredients and step-by-step instructions
- Bookmark recipes in `localStorage`
- Default recipe measurements to European format with a user switch for European or American recipe output
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
- Persistent JSON file cache at `server/data/recipe-cache.json`

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
- Ensure the hosting environment allows Node.js 20+.
- The recipe cache is stored in `server/data/recipe-cache.json`. If the host has ephemeral storage, cache persistence may reset between deployments or restarts.
- A GitHub repository can be created from this folder once network access and Git credentials are available.

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
