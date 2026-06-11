export type LayerKind =
  | "conv"
  | "pool"
  | "fc"
  | "relu"
  | "norm"
  | "concat"
  | "add"
  | "dense-block";

export interface LayerBlock {
  id: string;
  kind: LayerKind;
  label: string;
  detail?: string;
  out?: string;
}

export interface Architecture {
  id: string;
  name: string;
  year: number;
  authors: string;
  params: string;
  paperUrl: string;
  paperCite: string;
  problemSolved: {
    headline: string;
    before: string;
    fixed: string;
    mechanism: string;
  };
  diagram: LayerBlock[];
  onnxFile: string;
}

export const ARCHITECTURES: Architecture[] = [
  {
    id: "lenet",
    name: "LeNet-5",
    year: 1998,
    authors: "LeCun et al.",
    params: "83k (this variant)",
    paperUrl: "http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf",
    paperCite:
      "LeCun, Bottou, Bengio, Haffner (1998). Gradient-Based Learning Applied to Document Recognition. Proc. IEEE.",
    problemSolved: {
      headline: "Showed that conv + pool + FC could learn end-to-end",
      before:
        "Image recognition relied on hand-crafted features (SIFT, HOG) fed into shallow classifiers.",
      fixed:
        "End-to-end gradient descent over a small stack of convolutions and subsampling layers, trained on digits.",
      mechanism:
        "Local receptive fields and weight sharing slashed parameter count vs fully connected nets, making training tractable on 1990s hardware.",
    },
    diagram: [
      { id: "c1", kind: "conv", label: "Conv 5x5", out: "6@28x28" },
      { id: "p1", kind: "pool", label: "AvgPool 2x2", out: "6@14x14" },
      { id: "c2", kind: "conv", label: "Conv 5x5", out: "16@10x10" },
      { id: "p2", kind: "pool", label: "AvgPool 2x2", out: "16@5x5" },
      { id: "f1", kind: "fc", label: "FC 120" },
      { id: "f2", kind: "fc", label: "FC 84" },
      { id: "f3", kind: "fc", label: "FC 10" },
    ],
    onnxFile: "models/lenet.onnx",
  },
  {
    id: "alexnet",
    name: "AlexNet",
    year: 2012,
    authors: "Krizhevsky, Sutskever, Hinton",
    params: "7.0M (CIFAR variant; original ImageNet AlexNet was ~60M)",
    paperUrl:
      "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
    paperCite:
      "Krizhevsky, Sutskever, Hinton (2012). ImageNet Classification with Deep Convolutional Neural Networks. NeurIPS.",
    problemSolved: {
      headline: "ReLU + dropout + GPUs made deep CNNs practical",
      before:
        "Networks deeper than a few layers trained slowly with tanh/sigmoid and overfit badly.",
      fixed:
        "ReLU activations sped up training by ~6x. Dropout regularized the huge FC head. Two GPUs split the model.",
      mechanism:
        "Non-saturating ReLU avoided vanishing gradients, dropout randomly zeroed activations during training, and local response normalization smoothed activations across channels.",
    },
    diagram: [
      { id: "c1", kind: "conv", label: "Conv 11x11 s4", out: "96" },
      { id: "r1", kind: "relu", label: "ReLU + LRN" },
      { id: "p1", kind: "pool", label: "MaxPool 3x3" },
      { id: "c2", kind: "conv", label: "Conv 5x5", out: "256" },
      { id: "p2", kind: "pool", label: "MaxPool" },
      { id: "c3", kind: "conv", label: "Conv 3x3 x3", out: "384/384/256" },
      { id: "p3", kind: "pool", label: "MaxPool" },
      { id: "f1", kind: "fc", label: "FC 4096 + Dropout" },
      { id: "f2", kind: "fc", label: "FC 4096 + Dropout" },
      { id: "f3", kind: "fc", label: "FC 10" },
    ],
    onnxFile: "models/alexnet.onnx",
  },
  {
    id: "vgg",
    name: "VGG-11",
    year: 2014,
    authors: "Simonyan & Zisserman",
    params: "9.2M (CIFAR variant)",
    paperUrl: "https://arxiv.org/abs/1409.1556",
    paperCite:
      "Simonyan & Zisserman (2014). Very Deep Convolutional Networks for Large-Scale Image Recognition. ICLR 2015.",
    problemSolved: {
      headline: "Depth via stacks of small 3x3 convs",
      before:
        "AlexNet used mixed large kernels (11x11, 5x5). Unclear which choices mattered.",
      fixed:
        "Stacked 3x3 convs with stride 1 plus 2x2 max pooling. Two 3x3 convs have the same receptive field as one 5x5 with fewer parameters and an extra non-linearity.",
      mechanism:
        "Uniform building blocks let depth scale predictably. Three 3x3 convs match a 7x7 receptive field with about 45% fewer params and three ReLUs instead of one.",
    },
    diagram: [
      { id: "b1", kind: "conv", label: "Conv 3x3", out: "64" },
      { id: "p1", kind: "pool", label: "MaxPool 2x2" },
      { id: "b2", kind: "conv", label: "Conv 3x3", out: "128" },
      { id: "p2", kind: "pool", label: "MaxPool" },
      { id: "b3", kind: "conv", label: "2x Conv 3x3", out: "256" },
      { id: "p3", kind: "pool", label: "MaxPool" },
      { id: "b4", kind: "conv", label: "2x Conv 3x3", out: "512" },
      { id: "p4", kind: "pool", label: "MaxPool" },
      { id: "b5", kind: "conv", label: "2x Conv 3x3", out: "512" },
      { id: "p5", kind: "pool", label: "AvgPool" },
      { id: "f1", kind: "fc", label: "FC 10" },
    ],
    onnxFile: "models/vgg.onnx",
  },
  {
    id: "inception",
    name: "Inception-mini",
    year: 2014,
    authors: "Szegedy et al.",
    params: "397k (small CIFAR variant; original GoogLeNet ~6.8M)",
    paperUrl: "https://arxiv.org/abs/1409.4842",
    paperCite:
      "Szegedy et al. (2014). Going Deeper with Convolutions. CVPR 2015.",
    problemSolved: {
      headline: "Pick kernel size by letting the network choose",
      before:
        "Stacking deeper networks blew up compute. Choosing one kernel size per layer was arbitrary.",
      fixed:
        "Inception modules ran 1x1, 3x3, 5x5 convs and pooling in parallel, concatenating outputs. 1x1 convs reduced channels before expensive ops.",
      mechanism:
        "Multi-scale features at every level. The 1x1 bottleneck pattern cut FLOPs by an order of magnitude vs naive multi-scale, making depth affordable.",
    },
    diagram: [
      { id: "s", kind: "conv", label: "Stem Conv 3x3", out: "64" },
      {
        id: "i1",
        kind: "concat",
        label: "Inception(64): 1x1 | 3x3 | 5x5 | pool",
        detail: "1x1 bottleneck before 3x3/5x5",
      },
      { id: "i2", kind: "concat", label: "Inception(128)" },
      { id: "p", kind: "pool", label: "MaxPool" },
      { id: "i3", kind: "concat", label: "Inception(192)" },
      { id: "i4", kind: "concat", label: "Inception(256)" },
      { id: "gap", kind: "pool", label: "GlobalAvgPool" },
      { id: "f1", kind: "fc", label: "FC 10" },
    ],
    onnxFile: "models/inception.onnx",
  },
  {
    id: "resnet",
    name: "ResNet-20",
    year: 2015,
    authors: "He et al.",
    params: "272k",
    paperUrl: "https://arxiv.org/abs/1512.03385",
    paperCite:
      "He, Zhang, Ren, Sun (2015). Deep Residual Learning for Image Recognition. CVPR 2016.",
    problemSolved: {
      headline: "Skip connections let networks be hundreds of layers deep",
      before:
        "Adding more layers past ~20 made training error go *up*. Vanishing gradients and degradation broke deep stacks.",
      fixed:
        "Residual blocks: output = F(x) + x. Identity shortcuts let gradients flow backwards unimpeded and made it easy for blocks to learn near-identity functions.",
      mechanism:
        "If a deeper layer should be identity, the network only needs to push F(x) toward zero. Far easier than learning identity from scratch through multiple non-linearities.",
    },
    diagram: [
      { id: "s", kind: "conv", label: "Conv 3x3", out: "16" },
      {
        id: "r1",
        kind: "add",
        label: "3x ResBlock",
        out: "16",
        detail: "Conv-BN-ReLU-Conv-BN + skip",
      },
      { id: "r2", kind: "add", label: "3x ResBlock /2", out: "32" },
      { id: "r3", kind: "add", label: "3x ResBlock /2", out: "64" },
      { id: "gap", kind: "pool", label: "GlobalAvgPool" },
      { id: "f1", kind: "fc", label: "FC 10" },
    ],
    onnxFile: "models/resnet.onnx",
  },
  {
    id: "densenet",
    name: "DenseNet-BC",
    year: 2016,
    authors: "Huang et al.",
    params: "630k (small CIFAR variant)",
    paperUrl: "https://arxiv.org/abs/1608.06993",
    paperCite:
      "Huang, Liu, van der Maaten, Weinberger (2016). Densely Connected Convolutional Networks. CVPR 2017.",
    problemSolved: {
      headline: "Connect every layer to every other layer",
      before:
        "ResNet helped, but features computed early were still hard to reuse late in the network.",
      fixed:
        "Each layer takes the concatenation of *all* previous layers as input. Feature reuse is explicit, not implicit.",
      mechanism:
        "Each layer adds only k feature maps (growth rate), but sees everything before it. Strong gradient flow, fewer parameters, implicit deep supervision.",
    },
    diagram: [
      { id: "s", kind: "conv", label: "Conv 3x3", out: "24" },
      {
        id: "d1",
        kind: "dense-block",
        label: "DenseBlock x6",
        detail: "each layer concats all prior",
      },
      { id: "t1", kind: "conv", label: "Transition 1x1 + AvgPool" },
      { id: "d2", kind: "dense-block", label: "DenseBlock x12" },
      { id: "t2", kind: "conv", label: "Transition" },
      { id: "d3", kind: "dense-block", label: "DenseBlock x24" },
      { id: "gap", kind: "pool", label: "GlobalAvgPool" },
      { id: "f1", kind: "fc", label: "FC 10" },
    ],
    onnxFile: "models/densenet.onnx",
  },
];
