# CNN Architecture Comparison

Walk through the major CNN architectures from LeNet (1998) to DenseNet (2016) side by side on the same image.
Six small networks trained on CIFAR-10 run client-side via ONNX Runtime Web, so you can compare predictions, feature maps, and architecture diagrams!

## Architectures

| Arch | Year | Params (this variant) | What it changed |
| --- | --- | --- | --- |
| LeNet-5 | 1998 | 83k | Showed conv+pool+FC end-to-end works |
| AlexNet | 2012 | 7.0M | ReLU, dropout, GPU training |
| VGG-11 | 2014 | 9.2M | Depth via stacks of 3x3 convs |
| Inception-mini | 2014 | 397k | Multi-scale features, 1x1 bottleneck |
| ResNet-20 | 2015 | 272k | Skip connections |
| DenseNet-BC | 2016 | 630k | Concat all prior layers |

Param counts above are for the small CIFAR variants shipped with this demo. The original ImageNet / paper versions are larger (AlexNet ~60M, Inception/GoogLeNet ~6.8M, etc.).


## How it works

The user uploads an image, which the browser resizes to 32×32 and normalizes with CIFAR-10 statistics. The same Float32Array is fed to all six ONNX sessions in parallel. 
Each ONNX export includes the final logits plus a handful of intermediate feature map tensors (one per stage), which are rendered as small grayscale tiles per channel.

ONNX Runtime Web uses WASM by default. Sessions are cached at module level so re-runs are fast after the first load.