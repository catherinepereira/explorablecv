# CNN Visualizer

A one-pager site that shows what the trained `SmallCNN` from [`cnn-from-scratch-model`](https://github.com/catherinepereira/cnn-from-scratch-model/) "sees" at each layer for a few CIFAR-10 images.

## Setup

```bash
npm install

# Generate activations from the sibling repo (after training a model there):
cd ../cnn-from-scratch-model
python scripts/export_activations.py \
    --ckpt checkpoints/run1/best.pt \
    --out ../cnn-visualizer/public/activations

cd ../cnn-visualizer
npm run dev
```

The site reads `public/activations/manifest.json` and renders:
- A strip of sample images you can click between
- Each conv/pool layer's feature maps as a grid of grayscale tiles
- The model's predicted class probabilities

If `manifest.json` is missing it shows instructions for generating it.

## Credits

The favicon is the "framed picture" emoji from [Twemoji](https://github.com/twitter/twemoji) by Twitter, Inc. and other contributors, licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
