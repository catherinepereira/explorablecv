// Legend for the diverging value heatstrips: a blue -> white -> red gradient
// flagged with - and + ends (zero is the white midpoint). The red and blue
// match valueColor so the legend lines up with the cells

export function ColorScale() {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-500">
        −
      </span>
      <div
        className="h-2 w-24 rounded-sm border border-gray-200 dark:border-zinc-700"
        style={{
          background:
            "linear-gradient(to right, rgb(59,130,246), rgb(255,255,255), rgb(244,63,94))",
        }}
      />
      <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-500">
        +
      </span>
    </div>
  );
}
