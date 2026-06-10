// Shows where a single query token sends its attention.
// Tokens are laid out in a row, a bar under each key shows that key's share of
// the query's attention (with the percentage printed below), and an SVG arc
// connects the query to each key with opacity and width proportional to the
// weight

type Props = {
  tokens: string[];
  // The attention distribution of the selected query over all keys (sums to 1)
  weights: number[];
  queryIndex: number;
};

export function AttentionFlow({ tokens, weights, queryIndex }: Props) {
  const n = tokens.length;
  if (n === 0) return null;

  // Evenly spaced columns. Query row sits at top, keys at the bottom
  const colWidth = 84;
  const width = Math.max(n * colWidth, colWidth);
  const height = 148;
  const topY = 24;
  const bottomY = height - 42;

  const colX = (i: number) => colWidth * i + colWidth / 2;
  const max = Math.max(...weights, 1e-6);

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="block"
        role="img"
        aria-label={`Attention from "${tokens[queryIndex]}" to each key token`}
      >
        {weights.map((w, k) => {
          // Skip keys the query doesn't attend to (e.g. future tokens under a
          // causal mask) so no line is drawn to them
          if (w <= 0) return null;
          const x1 = colX(queryIndex);
          const x2 = colX(k);
          const midY = (topY + bottomY) / 2;
          const d = `M ${x1} ${topY + 8} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${bottomY - 8}`;
          return (
            <path
              key={k}
              d={d}
              fill="none"
              className="stroke-blue-500 dark:stroke-blue-400"
              strokeWidth={Math.max(0.5, (w / max) * 5)}
              strokeOpacity={Math.max(0.08, w)}
            />
          );
        })}

        {/* query token label */}
        <text
          x={colX(queryIndex)}
          y={topY}
          textAnchor="middle"
          className="fill-blue-600 font-mono dark:fill-blue-400"
          fontSize={12}
        >
          {tokens[queryIndex]}
        </text>

        {/* key token labels + weight bars */}
        {tokens.map((t, k) => {
          const w = weights[k];
          const barW = 48;
          const barH = 6;
          const bx = colX(k) - barW / 2;
          return (
            <g key={k}>
              <text
                x={colX(k)}
                y={bottomY}
                textAnchor="middle"
                className="fill-gray-600 font-mono dark:fill-zinc-400"
                fontSize={11}
              >
                {t}
              </text>
              <rect
                x={bx}
                y={bottomY + 6}
                width={barW}
                height={barH}
                rx={2}
                className="fill-gray-200 dark:fill-zinc-800"
              />
              <rect
                x={bx}
                y={bottomY + 6}
                width={barW * w}
                height={barH}
                rx={2}
                className="fill-blue-500 dark:fill-blue-400"
              />
              <text
                x={colX(k)}
                y={bottomY + 26}
                textAnchor="middle"
                className="fill-gray-500 font-mono dark:fill-zinc-500"
                fontSize={10}
              >
                {(w * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
