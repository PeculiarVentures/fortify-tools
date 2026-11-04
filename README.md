<p align="center">
  <a href="https://fortifyapp.com/" rel="noopener" target="_blank"><img width="128" src="./public/assets/favicons/android-chrome-192x192.png" alt="Fortify logo"></a>
</p>

<h1 align="center">Fortify Tools</h1>

<p align="center">
  <a href="https://github.com/PeculiarVentures/fortify-tools/actions/workflows/deploy.yml"><img src="https://github.com/PeculiarVentures/fortify-tools/actions/workflows/deploy.yml/badge.svg?branch=main" alt="Deploy status"></a>
  <a href="https://github.com/PeculiarVentures/fortify-tools/blob/main/LICENSE"><img src="https://img.shields.io/github/license/PeculiarVentures/fortify-tools" alt="License"></a>
</p>

[Fortify](https://fortifyapp.com/) enables web applications to use smart cards, local certificate stores and do certificate enrollment. This repository contains a sample [application](https://tools.fortifyapp.com/) based on Fortify that is also useful as tool to enable users view the contents of certificate stores, and create certificate requests/self signed certificates.

## Development

You need Node.js 24 and npm 11.7 or later (see `devEngines` in `package.json`). To use the app against real certificate stores, install and start the [Fortify app](https://fortifyapp.com/); without it, the app shows the "connection not detected" screen.

```sh
git clone https://github.com/PeculiarVentures/fortify-tools.git
cd fortify-tools
npm ci
npm run dev
```

| Script                 | What it does                                                 |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Starts the Vite dev server on http://localhost:3003          |
| `npm run build`        | Builds the site into `dist/`                                 |
| `npm run preview`      | Serves `dist/` on http://localhost:3005                      |
| `npm test`             | Runs the Vitest tests                                        |
| `npm run typecheck`    | Type-checks with `tsc --noEmit`                              |
| `npm run lint`         | Lints with oxlint (type-aware rules through oxlint-tsgolint) |
| `npm run lint:fix`     | Lints and applies the safe fixes                             |
| `npm run format`       | Formats with oxfmt                                           |
| `npm run format:check` | Checks the formatting                                        |

## Deployment

Every push to `main` runs the **Deploy** workflow (`.github/workflows/deploy.yml`): it runs the **Test** workflow (lint, format check, typecheck, tests, build), then publishes `dist/` to GitHub Pages at https://tools.fortifyapp.com. `public/CNAME` is copied into `dist/`. Pull requests run **Test** only. To redeploy `main`, run **Deploy** manually from the Actions tab.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and commit conventions.

## Thanks

Thanks to the [CA Security Council](https://casecurity.org/) for their support of this project and the many individuals from [Twitter](https://twitter.com/rmhrisk) who provided feedback and testing.
