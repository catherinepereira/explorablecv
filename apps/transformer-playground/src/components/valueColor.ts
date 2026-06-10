// Diverging value-to-color map shared by the vector heatstrips and their
// legend: red for positive, blue for negative, opacity scaled by |value|/max

export function valueColor(value: number, maxAbs: number): string {
  const t = Math.min(Math.abs(value) / maxAbs, 1);
  return value >= 0 ? `rgba(244, 63, 94, ${t})` : `rgba(59, 130, 246, ${t})`;
}
