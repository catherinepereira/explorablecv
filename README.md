# Explorables

Interactive, in-browser explainers for computer vision ideas. Each demo is a
standalone React app that runs entirely client-side, served together under one
domain with a shared landing page.

## The demos

| Demo                                                            | What it covers                                         | Dev port |
| --------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| [cnn-playground](apps/cnn-playground)                           | Convolution, kernels, and pooling                      | 5501     |
| [cnn-visualizer](apps/cnn-visualizer)                           | Per-layer activations on CIFAR-10                      | 5502     |
| [cnn-architecture-comparison](apps/cnn-architecture-comparison) | LeNet through VGG, run in the browser via ONNX         | 5503     |
| [cv-interpretability](apps/cv-interpretability)                 | Where image classifiers look when they decide          | 5504     |
| [vit-playground](apps/vit-playground)                           | Patchify, embeddings, and attention with a real ViT    | 5505     |
| [backbone-benchmark](apps/backbone-benchmark)                   | Accuracy vs latency across backbones, with constraints | 5506     |
| [cv-detection-playground](apps/cv-detection-playground)         | Object detection, IoU, NMS, precision and recall       | 5507     |
| [cv-segmentation-playground](apps/cv-segmentation-playground)   | Thresholding, region growing, and trained segmentation | 5508     |

The [home](apps/home) page is the landing page that links to all of them, on port 5500.

Each app runs on its own `5xxx` dev port (so several can run at once) and is
served under `/<demo>/` in production. `pnpm --filter <demo> dev` starts one,
`pnpm dev` starts them all.

## Layout

```
explorables/
  packages/
    ui/            shared components (header, nav, section primitives, theme toggle)
    theme/         shared base CSS and the no-flash dark-mode bootstrap
    catalog/       the demo list, the single source of truth for nav + home + sitemap
    vite-config/   the defineAppConfig factory each app's vite.config uses
  apps/
    home/          landing page, served at /
    <demo>/        each demo, served at /<demo>/
```

Demos share their header, nav, and section components through the `packages`, so
a fix to one updates every demo. Each app stays its own Vite build, so visiting
one demo never downloads another demo's code.

## Setup

```bash
git clone https://github.com/catherinepereira/explorablecv.git
cd explorablecv
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
pnpm --filter cnn-playground dev
```

## Building

```bash
pnpm build        # build every package and app
pnpm typecheck    # type-check the whole workspace
pnpm --filter @explorables/catalog test
```

## How it works

The whole site is served from one domain. The `home` page is served at `/`, and
each demo at `/<demo>/`. `pnpm build:site` runs every app's build and combines
them into one `dist-site` tree (see `scripts/build-site.mjs`), which Vercel
serves as static files. Each demo keeps an independent build, so its assets stay
under its own path prefix.

Shared state across demos (the light/dark theme) is a `dark` class set on
`<html>` before React mounts, written by the no-flash bootstrap in each
`index.html` and read by the shared `ThemeToggle`. There is no shared React
tree across demos, so the theme persists through `localStorage` rather than
context.

Adding a demo means adding one entry to `packages/catalog` and one app under
`apps/`. The nav, the home grid, and the sitemap all read the catalog, so they
stay in sync.

## License

MIT, see [LICENSE](LICENSE).
