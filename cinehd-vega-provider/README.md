# CineHD Catalog — Vega Provider (separate repository)

This is a standalone provider-source repository shaped for Vega's provider manager. It is separate from the app's built-in providers: upload this repository to its own GitHub repository, build it, then add the repository/source in Vega.

## What is included

- Vega-compatible `manifest.json` and provider folder (`providers/cinehd/`)
- Public HTML catalog/search parsing using the injected `providerContext.axios` and `providerContext.cheerio`
- Metadata extraction from ordinary Open Graph/title/description tags
- Best-effort episode-link parsing
- Provider settings for the base website URL
- Build script and local development server

## Important limitation

The selected `cinehd.dev` page is a landing page; its “Watch Online” link currently leads to `cinehd.vc`. The public pages inspected expose a client-rendered app shell (the movie route is `/search?type=movie`, and the anime route is `/search/anime`), not server-rendered result cards. Therefore a basic `axios` + `cheerio` provider cannot reliably populate the catalog from the page HTML alone. This package uses those public routes and best-effort parsing, but **has not been live-tested in Vega** and cannot honestly be described as fully working yet.

Playback resolution is deliberately safe-by-default: it does not extract third-party embed streams, bypass DRM/access controls, or call undocumented private APIs. `getStream` only accepts an already-supplied direct HTTPS `.m3u8`, `.mp4`, or `.mpd` URL from a source you are authorized to use. Ordinary CineHD page links will not resolve to playable streams inside Vega. A fully working in-app provider requires a documented/authorized data interface or authorized direct media endpoints from the service; the public landing page does not provide those details.

Use this only for content and sources you have permission to access and redistribute. This project is not affiliated with CineHD or Vega.

## Build on your Mac

Requires Node.js 20+ and npm. A GitHub Actions workflow is included to build `dist/` and commit generated bundles after you push source changes (Actions must be enabled and the repository's workflow permissions must allow writes).

```bash
npm install
npm run build
```

Commit **all** of these to your new GitHub repository, including the generated `dist/` directory.

## Test locally

```bash
npm install
npm run build
npm run dev
```

The server prints a local URL and a mobile URL. In Vega, open **Settings → Provider Manager → Available Providers → Add Provider Source** and add the printed URL while the server is running. For a public GitHub source, push the repository and its built `dist/` files, then add the full repository URL according to your Vega version's provider-manager flow.

## Upload this ZIP to GitHub

1. Create a new, separate GitHub repository, e.g. `cinehd-vega-provider`.
2. Extract this ZIP on your Mac.
3. Upload the **contents** of the extracted folder to the repository root (so `manifest.json` is at the root, not nested inside another folder).
4. In Terminal, run `npm install` and `npm run build` from that folder.
5. Commit and push the generated `dist/` folder too.
6. Add the repository as a provider source in Vega.

## Troubleshooting

- If the provider appears but the catalog is empty, the website markup/routes differ from the generic selectors in `posts.ts`; inspect the public page and update the selectors.
- If titles appear but no playable source appears, that is expected until an authorized direct media source is integrated. A web page or third-party player URL is not the same as a direct media stream.
- Increment `manifest.json`'s `version` when publishing updates.
