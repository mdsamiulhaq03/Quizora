interface Props {
  wordCount: number;
  max?: number;
}

export default function TruncationWarning({ wordCount, max = 2000 }: Props) {
  if (wordCount <= max) return null;
  return (
    <div className="border border-rule-faint bg-plate px-4 py-3">
      <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted leading-relaxed">
        ▲ DOCUMENT IS ~{wordCount.toLocaleString()} WORDS.
        ONLY THE FIRST {max.toLocaleString()} WORDS WILL BE PROCESSED.
      </p>
    </div>
  );
}
