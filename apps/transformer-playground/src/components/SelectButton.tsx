// A small toggle button used for the token, layer, and head pickers. Centralizes
// the selected / unselected / disabled color states so the sections don't each
// repeat the class soup

import type { ReactNode } from "react";

type Props = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  // "pill" for token text, "index" for the slightly wider layer/head numbers
  size?: "pill" | "index";
};

const SIZE = {
  pill: "px-2 py-1 text-xs",
  index: "px-3 py-1 text-sm",
};

export function SelectButton({
  selected,
  onClick,
  children,
  disabled = false,
  size = "pill",
}: Props) {
  const state = selected
    ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
    : disabled
      ? "border-transparent text-gray-300 dark:text-zinc-700"
      : "cursor-pointer border-gray-300 bg-white text-gray-600 hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-500";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded border font-mono transition-colors ${SIZE[size]} ${state}`}
    >
      {children}
    </button>
  );
}
