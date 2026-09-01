const wordmarkStyle = {
  fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
} as const;

export function B94Wordmark({ className = "text-lg" }: { className?: string }) {
  return (
    <span className={`flex items-baseline tracking-[-0.06em] ${className}`} style={wordmarkStyle}>
      <span className="leading-none text-[#0d4a86]">b</span>
      <span className="leading-none text-[#f3c75b]">9</span>
      <span className="leading-none text-[#2a9d5d]">4</span>
      <span className="ml-1 leading-none text-[#0d4a86]">e</span>
      <span className="leading-none text-[#f3c75b]">a</span>
      <span className="leading-none text-[#2a9d5d]">s</span>
      <span className="leading-none text-[#0d4a86]">y</span>
    </span>
  );
}

export function SafiraWordmark({ className = "text-lg" }: { className?: string }) {
  return (
    <span
      className={`tracking-[-0.08em] text-primary ${className}`}
      style={wordmarkStyle}
    >
      SAFIRA
    </span>
  );
}
