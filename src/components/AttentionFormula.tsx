// Pre-rendered SVG of Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V, generated once with
// MathJax so the site ships no math-rendering runtime. The SVG draws glyphs as
// paths and fills with currentColor, so it tracks the surrounding text color in
// light and dark mode

import formulaSvg from "../assets/attention-formula.svg?raw";

export function AttentionFormula() {
  return (
    <span
      className="inline-block max-w-full text-gray-900 dark:text-zinc-100 [&>svg]:h-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: formulaSvg }}
    />
  );
}
