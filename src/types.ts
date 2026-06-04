export type LayerMeta = {
  name: string;
  label: string;
  shape_note: string;
  channels_total: number;
  channels_exported: number;
  h: number;
  w: number;
};

export type Sample = {
  id: number;
  dataset_id: number;
  true_class: string;
  pred_class: string;
  correct: boolean;
  probs: Record<string, number>;
  layers: LayerMeta[];
};

export type Stats = {
  params: number;
  test_accuracy: number;
  test_correct: number;
  test_total: number;
  per_class_accuracy: Record<string, number>;
  epochs_trained?: number;
  best_val_acc?: number;
  final_train_acc?: number;
  final_val_acc?: number;
};

export type Manifest = {
  classes: string[];
  checkpoint: string;
  stats?: Stats;
  samples: Sample[];
};
