# CareerFlow

**Reach the right people. Track every conversation.**

CareerFlow is a premium, dark-themed Career Outreach CRM for managing recruiter and job outreach — contacts, email composition, send tracking, and analytics.

## Frontend-only architecture

This project has **no backend**. There is no Express server, no database, no API server. Everything runs in the browser:

- **Application data** (contacts, outreach history, settings) is stored in `localStorage` via `src/services/storageService.ts`.
- **Authentication** is Local Authentication — accounts and passwords (hashed client-side) live only in this browser. It is explicitly *not* production-grade server authentication.
- **Real Gmail sending** uses browser-based Google OAuth (Google Identity Services) and the Gmail API directly from the client. No backend proxy, no client secret.

Because every feature is wrapped in a service module (`authService`, `contactService`, `outreachService`, `analyticsService`, `gmailService`, `storageService`), the UI never talks to `localStorage` or Gmail directly — so the storage layer could later be swapped for a real backend without touching components.

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

## Building

```bash
npm run build
npm run preview   # optional, serves the production build locally
```

## Environment variables

Copy `.env.example` to `.env` and set:

```
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

No other variables are needed. **Never** add a `GOOGLE_CLIENT_SECRET` — client secrets must never live in a frontend app, and this project has nowhere safe to put one since it has no backend.

### Setting up Google OAuth for real Gmail sending

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create (or select) a project.
2. Enable the **Gmail API** for the project.
3. Configure the OAuth consent screen (External or Internal, depending on your Google Workspace status). Add the `gmail.send` and `userinfo.email` scopes.
4. Create an **OAuth 2.0 Client ID** of type "Web application".
5. Add your dev URL (e.g. `http://localhost:5173`) and your production URL to **Authorized JavaScript origins**. Authorized redirect URIs are not needed — this app uses the GIS token client (implicit flow), not a redirect-based flow.
6. Copy the generated Client ID into `VITE_GOOGLE_CLIENT_ID`.
7. While your app is in "Testing" publishing status, only test users you add in the consent screen can connect Gmail. Publish the app (or verify it) for broader access.

## Local storage

All data lives under a handful of `localStorage` keys, namespaced with a `careerflow_` prefix (see `src/services/storageService.ts`). Nothing is sent anywhere except Google's own OAuth/Gmail endpoints, and only when you explicitly connect Gmail and send an email.

Use **Settings → Export Data** to download a JSON backup, and **Settings → Import Data** to restore it (e.g. in a different browser).

## Demo Mode vs. Real Gmail Mode

- **Development Mode** (no `VITE_GOOGLE_CLIENT_ID` configured): the entire app — contacts, dashboard, compose, tracking, analytics, search, settings — works normally. Sending an email from Compose saves it locally with status `demo` and shows *"Demo email saved locally."* It is never labeled as sent.
- **Real Gmail Mode** (`VITE_GOOGLE_CLIENT_ID` configured and Gmail connected): sending calls the Gmail API directly. Only on a confirmed API response does the app record status `sent` and show *"Email sent successfully ✓"*. A failed API call is recorded as `failed` and never silently treated as a success.

## Limitations

- This is a single-browser, single-device app. Data does not sync across devices — use Export/Import to move it.
- Gmail's access token is kept in memory only (not persisted), so reconnecting is required after every page reload — this is intentional, to avoid storing a live credential in `localStorage`.
- Because there is no backend, there's no true delivery/open/read tracking. Statuses are limited to what the browser can actually know: `sent`, `failed`, `demo`, `replied` (manually reflected), and `unknown`.

## Build command

```bash
npm run build
```

This runs `tsc -b && vite build` and outputs static files to `dist/`, which can be hosted on any static host (Vercel, Netlify, GitHub Pages, S3, etc.).
