# CV Interpretability Explorer

Compare three image classifiers (Custom CNN, ResNet-18, ViT-S) trained on ImageNette. For any sample image it shows Grad-CAM, Score-CAM, saliency, LIME, and (for ViT) attention rollout attributions from every model side by side, plus a UMAP projection of each model's penultimate-layer features.

The viewer is a static site. All interpretability outputs are precomputed in the [cv-interpretability-model](../cv-interpretability-model) repo and shipped as JSON.

## Setup

```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:5444`.

## Data setup

The viewer expects these files under `public/`:

| Path                       | Source                                                |
| -------------------------- | ----------------------------------------------------- |
| `data/classes.json`        | ordered class labels (single source of truth)         |
| `data/samples.json`        | sample manifest                                       |
| `data/models.json`         | per-model accuracy + param counts                     |
| `data/cams.json`           | Grad-CAM / Score-CAM / saliency maps for each sample  |
| `data/lime.json`           | LIME heatmaps for each sample                         |
| `data/rollout.json`        | attention rollout maps (ViT only)                     |
| `data/umap.json`           | UMAP point clouds per model                           |
| `samples/*.jpg`            | thumbnail images                                      |

Generate them from the training repo:

```bash
cd ../cv-interpretability-model
python scripts/bundle_for_frontend.py --frontend ../cv-interpretability/public
```