# Mealio cPanel Deployment

This guide is for deploying Mealio to a cPanel account with the Node.js App feature enabled.

## Confirmed Working Setup

Mealio has now been successfully deployed on cPanel with this confirmed setup:

- URL: `mealio.k-dawg.uk`
- Hosting model: cPanel Node.js App
- Node versions available: `20.20.0`, `22.22.0`
- Node version used: `20.20.0`
- Real `OPENAI_API_KEY` entered through the cPanel Node App environment-variable UI
- `Run NPM Install` available in cPanel
- `npm` not available in the SSH session used during deployment
- local-build upload flow used successfully because build commands were not exposed through the cPanel UI
- recipe generation, image generation, and restart validation all passed

## Preflight

Verify these first:

- cPanel includes `Setup Node.js App` or similar Node app management
- Node.js version is `20.19+`
  - confirmed available versions: `20.20.0` and `22.22.0`
  - recommended default for Mealio: `20.20.0`
- SSH access works
- Outbound HTTPS is allowed
- The application root can write to:
  - `server/data/`
  - `server/data/generated-images/`

Optional helper:

```bash
npm run preflight:cpanel
```

## Required Environment Variables

Set these in the cPanel Node app environment:

```env
OPENAI_API_KEY=your_real_openai_api_key_set_in_cpanel
NODE_ENV=production
PORT=provided_by_cpanel_or_host
```

Notes:

- Enter the real `OPENAI_API_KEY` directly in the cPanel Node App environment-variable UI.
- Do not commit the real API key.
- Do not put the real API key in any frontend file.
- Use a server-side `.env` file only if your host specifically requires that instead of cPanel-managed environment variables.
- If cPanel injects a port automatically, use that value instead of forcing `3001`.

## Recommended App Setup

Use a dedicated subdomain such as `mealio.yourdomain.com`.

In cPanel Node App:

- Application root: the Mealio project directory
- Application URL: your chosen subdomain or app path
- Startup file: `dist/server/index.js`
- Environment: `production`
- Node.js version: `20.20.0` recommended

## Live Setup Checklist

Use this as the practical order of operations in cPanel and SSH:

1. Log in to cPanel.
2. Open `Setup Node.js App`.
3. Create a new Node app.
4. Choose Node version `20.20.0`.
5. Set the app environment to `Production` if cPanel offers it.
6. Choose the application root directory.
7. Choose the application URL or subdomain.
8. Save or create the app.
9. In the Node app settings, add environment variables:
   - `OPENAI_API_KEY` = your real OpenAI API key
   - `NODE_ENV` = `production`
   - `PORT` only if cPanel requires you to set it manually
10. SSH into the server.
11. Change into the cPanel application root directory.
12. Clone or upload Mealio into that exact directory.
13. Confirm `package.json` exists in the app root.
14. Run `npm install`.
15. Run `npm run build`.
16. Confirm `dist/server/index.js` exists.
17. In cPanel, set the startup file to `dist/server/index.js`.
18. Restart the Node app from cPanel.
19. Open the app URL and test the site.

If building on the server fails:

1. Build locally with Node `20.20.0`.
2. Run `npm run package:cpanel`.
3. Upload `artifacts/mealio-cpanel-deploy.tar.gz` to the application root.
4. Extract it there.
5. Run `npm install --omit=dev` if the server needs runtime dependencies installed.
6. Restart the Node app from cPanel.

Notes from the confirmed deployment:

- The Node app should be created first in cPanel.
- The application root should be separate from the subdomain web root.
- A cPanel-created scaffold in the application root may prevent `git clone ... .` from working cleanly.
- If `npm` is not available in SSH and cPanel only offers `Run NPM Install`, prefer the local-build packaging flow.

## Deployment Mode A: Build On Server

Use this when SSH + npm builds work on the host.

1. Clone or upload the full repo to the app root.
2. Install dependencies:

```bash
npm install
```

3. Build the app:

```bash
npm run build
```

4. Configure environment variables in cPanel.
5. Restart the Node app from cPanel.

## Deployment Mode B: Build Locally, Upload Package

Use this when the host can run Node apps but building on the server is restricted or unreliable.

1. Build and package locally:

```bash
npm run package:cpanel
```

2. Upload `artifacts/mealio-cpanel-deploy.tar.gz` to the cPanel app root.
3. Extract the archive in the app root.
4. Run this on the server if required:

```bash
npm install --omit=dev
```

5. Configure environment variables in cPanel.
6. Restart the Node app from cPanel.

## Writable Runtime Storage

Mealio uses file-based storage for cache and generated images:

- `server/data/recipe-cache.json`
- `server/data/recipe-image-cache.json`
- `server/data/generated-images/`

If cPanel storage is persistent, these survive restarts and redeploys.

If writes are blocked or storage is ephemeral:

- the app still runs
- recipe/image cache persistence may be lost
- images and cache entries may regenerate after restart

## Post-Deploy Validation

After restart, verify:

1. The homepage loads.
2. `GET /api/health` returns `{ "ok": true }`.
3. Recipe suggestions work.
4. Image generation works.
5. `/generated-images/...` URLs load correctly.
6. Bookmarks and recent searches still work in the browser.
7. Restarting the app in cPanel does not break the app.

Confirmed validation results for the live deployment:

- homepage loaded successfully
- recipe generation worked
- image generation worked
- restart completed cleanly and the app reloaded successfully afterward

## Logs

Mealio emits structured JSON logs for:

- server startup
- recipe generation
- recipe cache hits
- image preparation
- generation failures

Use the cPanel Node app logs or SSH-accessible logs to inspect them.
