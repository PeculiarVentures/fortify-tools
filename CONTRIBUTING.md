# Contributing

## Setup

Install Node.js 24 and npm 11.7 or later, then:

```sh
git clone git@github.com:<username>/fortify-tools.git
cd fortify-tools
npm ci
npm run dev
```

External contributors work from a fork.

## Developing

1. Create a branch from `main`.
2. Write the code and add tests next to it (`*.test.ts(x)`, Vitest + Testing Library; shared helpers are imported from `@testing`).
3. Before pushing, run `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test` and `npm run build`. CI runs the same steps.
4. Open a pull request. A team member reviews it and merges it.

Dialogs are built with `createDialog` from `@peculiar/react-components` (see `src/dialogs/`): the call site passes per-open data and callbacks to `open()`, and the dialogs read the Fortify client and providers from `DialogsContext`.

`src/index.tsx` imports `@abraham/reflection` first: `@peculiar/x509` needs a Reflect polyfill before it loads. Keep that import at the top.

## Commits and pull requests

Pull requests are squash-merged, so the pull request title becomes the commit on `main`. Write it as a [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/), for example `fix(import): accept PEM files with CRLF line endings` or `build(deps): upgrade @peculiar/x509 to 3.2`. Use `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `style`, `build`, `ci`, `chore` or `revert`.

## Deployment

There is no npm package and no release step. Every push to `main` runs the **Deploy** workflow, which runs the **Test** workflow and then publishes `dist/` to GitHub Pages (https://tools.fortifyapp.com). Pull requests run **Test** only. To redeploy `main`, run **Deploy** manually from the Actions tab.
