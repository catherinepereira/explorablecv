# Explorables

Interactive, in-browser explainers for computer vision ideas. Each demo is a
standalone React app that runs entirely client-side, served together under one
domain with a shared landing page.

## The demos

| Demo                                                            | What it covers                                 | Dev port |
| --------------------------------------------------------------- | ---------------------------------------------- | -------- |
| [cnn-playground](apps/cnn-playground)                           | Convolution, kernels, and pooling              | 5502     |
| [cnn-visualizer](apps/cnn-visualizer)                           | Per-layer activations on CIFAR-10              | 5503     |
| [cnn-architecture-comparison](apps/cnn-architecture-comparison) | LeNet through VGG, run in the browser via ONNX | 5504     |
| [cv-interpretability](apps/cv-interpretability)                 | Where image classifiers look when they decide  | 5505     |

The [hub](apps/hub) is the landing page that links to all of them, on port 5500.

Each app runs on its own `5xxx` dev port (so several can run at once) and is
served under `/<demo>/` in production. `pnpm --filter <demo> dev` starts one,
`pnpm dev` starts them all.

## Layout

```
explorables/
  packages/
    ui/            shared components (header, nav, section primitives, theme toggle)
    theme/         shared base CSS and the no-flash dark-mode bootstrap
    catalog/       the demo list, the single source of truth for nav + hub + sitemap
    vite-config/   the defineAppConfig factory each app's vite.config uses
  apps/
    hub/           landing page, served at /
    <demo>/        each demo, served at /<demo>/
```

Demos share their chrome through the `packages`, so a fix to the header or nav
lands everywhere at once. Each app stays its own Vite build, so visiting one
demo never downloads another demo's code.

## Setup

```bash
git clone https://github.com/catherinepereira/explorables.git
cd explorables
corepack enable
pnpm install
```

This repo uses [pnpm](https://pnpm.io) workspaces, pinned via the
`packageManager` field and provisioned by Corepack.

## Running

Start every app at once:

```bash
pnpm dev
```

Or run a single app:

```bash
pnpm --filter bpe-playground dev
```

## Building

```bash
pnpm build        # build every package and app
pnpm typecheck    # type-check the whole workspace
pnpm --filter @explorables/catalog test
```

## How it works

The whole site is served from one domain. The `hub` answers `/`, and each demo
answers `/<demo>/`. In production a Vercel proxy project rewrites each path
prefix to that app's own deployment (see `vercel.json`), so every demo keeps an
independent build and the proxy stitches them together.

Shared state across demos (the light/dark theme) is a `dark` class set on
`<html>` before React mounts, written by the no-flash bootstrap in each
`index.html` and read by the shared `ThemeToggle`. There is no shared React
tree across demos, so the theme persists through `localStorage` rather than
context.

Adding a demo means adding one entry to `packages/catalog` and one app under
`apps/`. The nav, the hub grid, and the sitemap all read the catalog, so they
stay in sync.

## License

MIT, see [LICENSE](LICENSE).
