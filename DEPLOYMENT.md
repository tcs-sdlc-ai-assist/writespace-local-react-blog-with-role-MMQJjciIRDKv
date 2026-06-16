# Deployment Guide

This document covers deployment configuration, hosting setup, and troubleshooting for the WriteSpace application.

## Table of Contents

- [Overview](#overview)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
  - [Git Integration (Recommended)](#git-integration-recommended)
  - [Vercel CLI](#vercel-cli)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD via Vercel Git Integration](#cicd-via-vercel-git-integration)
- [Manual / Self-Hosted Deployment](#manual--self-hosted-deployment)
  - [Static File Server](#static-file-server)
  - [Nginx](#nginx)
  - [Apache](#apache)
- [Troubleshooting](#troubleshooting)
  - [SPA Routing Issues](#spa-routing-issues)
  - [Build Failures](#build-failures)
  - [Blank Page After Deployment](#blank-page-after-deployment)
  - [Assets Not Loading](#assets-not-loading)

---

## Overview

WriteSpace is a fully client-side single-page application (SPA) built with **React 18** and **Vite 5**. It has no backend server or database — all data is persisted in the browser's `localStorage`. This means deployment consists of serving static files (HTML, JS, CSS, and assets) from any static hosting provider.

**Key deployment characteristics:**

- **No server-side runtime required** — pure static file hosting
- **No environment variables required** — no API keys, no backend URLs
- **No database setup** — all data lives in the user's browser via `localStorage`
- **SPA routing** — all paths must resolve to `index.html` for client-side routing to work

---

## Build Configuration

The production build is created using Vite's build command:

```bash
npm run build
```

This generates an optimized production bundle in the `dist/` directory:

```
dist/
├── index.html          # Entry HTML file
├── assets/
│   ├── index-[hash].js   # Bundled JavaScript
│   └── index-[hash].css  # Bundled CSS (Tailwind)
└── vite.svg            # Favicon (copied from public/)
```

**Build details:**

| Setting          | Value            |
| ---------------- | ---------------- |
| Build Command    | `npm run build`  |
| Output Directory | `dist`           |
| Node.js Version  | 18 or higher     |
| Package Manager  | npm v9 or higher |

To preview the production build locally before deploying:

```bash
npm run preview
```

This starts a local server (default `http://localhost:4173`) serving the `dist/` directory.

---

## Vercel Deployment

[Vercel](https://vercel.com/) is the recommended hosting platform for WriteSpace. It provides automatic builds, global CDN, and native SPA support.

### Git Integration (Recommended)

The simplest deployment method is connecting your Git repository to Vercel:

1. **Push your code** to a Git provider (GitHub, GitLab, or Bitbucket).

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/new):
   - Click **"Add New Project"**
   - Select your repository
   - Vercel will auto-detect the **Vite** framework

3. **Verify build settings** (Vercel auto-detects these, but confirm):

   | Setting          | Value           |
   | ---------------- | --------------- |
   | Framework Preset | Vite            |
   | Build Command    | `npm run build` |
   | Output Directory | `dist`          |
   | Install Command  | `npm install`   |

4. **Click Deploy**. Vercel will build and deploy the application.

5. **Access your site** at the generated `.vercel.app` URL or configure a custom domain in the Vercel dashboard under **Settings → Domains**.

### Vercel CLI

You can also deploy directly from the command line using the [Vercel CLI](https://vercel.com/docs/cli):

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy from the project root (follows prompts)
vercel

# Deploy directly to production
vercel --prod
```

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router DOM. All URL paths (e.g., `/blogs`, `/admin`, `/blogs/some-id`) must be served by `index.html` so that React Router can handle them.

The project includes a `vercel.json` file at the repository root that configures this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**How it works:**

- Any request to the Vercel server (e.g., `GET /blogs/post-123`) is rewritten to serve `index.html`.
- The browser loads the React application, and React Router reads the URL path to render the correct page component.
- Static assets (JS, CSS, images in `dist/assets/`) are served directly because Vercel serves existing files before applying rewrites.

> **Important:** Do not remove or modify `vercel.json` unless you understand the impact on client-side routing. Without this rewrite rule, direct navigation to any route other than `/` will return a 404 error.

---

## Environment Variables

**WriteSpace does not require any environment variables.**

The application is entirely client-side with no external API calls, no backend services, and no secret keys. All data is stored in the browser's `localStorage`.

There is no `.env` file needed for development or production. The `.gitignore` includes `.env` entries as a precaution, but no environment configuration is necessary.

If you extend the application in the future to include external services, Vite environment variables must be prefixed with `VITE_` and accessed via `import.meta.env.VITE_*`:

```javascript
// Example (not currently used in the project)
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## CI/CD via Vercel Git Integration

When your repository is connected to Vercel via Git integration, Vercel automatically sets up a CI/CD pipeline:

### Automatic Deployments

| Trigger                        | Deployment Type | URL                                      |
| ------------------------------ | --------------- | ---------------------------------------- |
| Push to `main` (or default)    | **Production**  | `your-project.vercel.app`                |
| Push to any other branch       | **Preview**     | `your-project-branch-name.vercel.app`    |
| Pull Request / Merge Request   | **Preview**     | Unique preview URL per PR                |

### Build Pipeline

On every push, Vercel executes the following steps:

1. **Clone** the repository at the pushed commit
2. **Install** dependencies via `npm install`
3. **Build** the project via `npm run build`
4. **Deploy** the contents of `dist/` to the global CDN

### Running Tests in CI

Vercel does not run tests by default. To include tests in your deployment pipeline, you can override the build command in `vercel.json` or in the Vercel dashboard:

**Option 1: Override build command in Vercel dashboard**

Set the Build Command to:

```bash
npm test -- --run && npm run build
```

> The `--run` flag ensures Vitest runs once and exits (non-watch mode).

**Option 2: Add a custom build script in `package.json`**

```json
{
  "scripts": {
    "ci:build": "vitest run && vite build"
  }
}
```

Then set the Vercel Build Command to `npm run ci:build`.

### Branch Protection

For production safety, consider:

- Enabling **branch protection rules** on your `main` branch in your Git provider
- Requiring pull request reviews before merging
- Using Vercel's **Preview Deployments** to verify changes before merging to production

---

## Manual / Self-Hosted Deployment

If you prefer not to use Vercel, WriteSpace can be deployed to any static file hosting service that supports SPA fallback routing.

### Static File Server

Build the project and serve the `dist/` directory:

```bash
npm run build
```

Then serve with any static file server. For example, using the `serve` package:

```bash
npx serve dist -s
```

The `-s` flag enables SPA fallback (rewrites all routes to `index.html`).

### Nginx

Example Nginx configuration for serving WriteSpace:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/writespace/dist;
    index index.html;

    # Serve static assets directly
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — rewrite all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache

Example `.htaccess` file for Apache (place in the `dist/` directory):

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### Other Hosting Providers

| Provider         | SPA Configuration                                                                 |
| ---------------- | --------------------------------------------------------------------------------- |
| **Netlify**      | Add `_redirects` file in `public/`: `/* /index.html 200`                          |
| **GitHub Pages** | Use a `404.html` that redirects to `index.html`, or use a tool like `spa-github-pages` |
| **Cloudflare Pages** | Set **Build output directory** to `dist`; SPA mode is enabled by default      |
| **AWS S3 + CloudFront** | Configure S3 static hosting with error document set to `index.html`      |
| **Firebase Hosting** | Run `firebase init` and configure rewrites to `index.html` in `firebase.json` |

---

## Troubleshooting

### SPA Routing Issues

**Symptom:** Navigating directly to a URL like `/blogs` or `/admin` returns a 404 error, but the app works fine when navigating from the home page.

**Cause:** The hosting server is looking for a file at `/blogs/index.html` which does not exist. SPA routing requires all paths to be served by the root `index.html`.

**Solutions:**

1. **Vercel:** Ensure `vercel.json` exists at the project root with the rewrite rule:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Nginx:** Ensure `try_files $uri $uri/ /index.html;` is in your server configuration.

3. **Netlify:** Add a `public/_redirects` file containing `/* /index.html 200`.

4. **Generic:** Ensure your hosting provider has a "SPA mode" or "fallback to index.html" option enabled.

### Build Failures

**Symptom:** `npm run build` fails with errors.

**Common causes and fixes:**

| Error                              | Fix                                                        |
| ---------------------------------- | ---------------------------------------------------------- |
| `Node.js version not supported`    | Upgrade to Node.js v18 or higher                           |
| `npm ERR! peer dep`                | Delete `node_modules/` and `package-lock.json`, run `npm install` again |
| `Module not found`                 | Run `npm install` to ensure all dependencies are installed |
| `JavaScript heap out of memory`    | Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build` |

**Clean build steps:**

```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Blank Page After Deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Common causes:**

1. **Incorrect output directory:** Ensure the hosting provider is serving from `dist/`, not the project root.

2. **Base path mismatch:** If deploying to a subdirectory (e.g., `https://example.com/app/`), add a `base` option to `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/app/',
   });
   ```
   > WriteSpace is configured for root deployment (`/`) by default. Only change this if deploying to a subdirectory.

3. **Browser console errors:** Open the browser developer tools (F12) and check the Console tab for JavaScript errors. Common issues include failed asset loading or CORS errors.

### Assets Not Loading

**Symptom:** The page loads but styles are missing, or JavaScript files return 404.

**Common causes:**

1. **Incorrect base path:** See the "Blank Page" section above regarding the `base` option in `vite.config.js`.

2. **Caching issues:** Hard refresh the page (`Ctrl+Shift+R` or `Cmd+Shift+R`) to bypass the browser cache.

3. **CDN propagation delay:** After a new deployment, CDN edge nodes may take a few minutes to update. Wait 2–5 minutes and try again.

4. **File path case sensitivity:** Some hosting providers (especially Linux-based) are case-sensitive. Ensure all import paths match the actual file names exactly.

---

## Quick Reference

| Task                        | Command                |
| --------------------------- | ---------------------- |
| Install dependencies        | `npm install`          |
| Start development server    | `npm run dev`          |
| Run tests                   | `npm test`             |
| Run tests (single run)      | `npx vitest run`       |
| Create production build     | `npm run build`        |
| Preview production build    | `npm run preview`      |
| Deploy to Vercel (CLI)      | `vercel --prod`        |