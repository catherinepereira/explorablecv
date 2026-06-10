export const DEV_FRONTEND_PORT = 5505;

export const MODEL_KEYS = ["custom_cnn", "resnet18", "vit_s"] as const;
export type ModelKey = (typeof MODEL_KEYS)[number];

export const MODEL_LABELS: Record<ModelKey, string> = {
  custom_cnn: "Custom CNN",
  resnet18: "ResNet-18",
  vit_s: "ViT-S",
};

export const METHODS = [
  "gradcam",
  "scorecam",
  "saliency",
  "lime",
  "rollout",
] as const;
export type Method = (typeof METHODS)[number];

export const METHOD_LABELS: Record<Method, string> = {
  gradcam: "Grad-CAM",
  scorecam: "Score-CAM",
  saliency: "Saliency",
  lime: "LIME",
  rollout: "Attention Rollout",
};

export const METHOD_SUPPORTED: Record<Method, readonly ModelKey[]> = {
  gradcam: MODEL_KEYS,
  scorecam: MODEL_KEYS,
  saliency: MODEL_KEYS,
  lime: MODEL_KEYS,
  rollout: ["vit_s"],
};
