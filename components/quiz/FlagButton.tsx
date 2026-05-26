"use client";

interface Props {
  flagged: boolean;
  onToggle: () => void;
}

export default function FlagButton({ flagged, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title={flagged ? "Remove flag" : "Flag for review"}
      className={`font-terminal text-[0.6rem] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
        flagged
          ? "border-hazard text-hazard bg-hazard/10"
          : "border-rule text-ink-muted hover:border-hazard hover:text-hazard"
      }`}
    >
      {flagged ? "[ ⚑ FLAGGED ]" : "[ ⚑ FLAG ]"}
    </button>
  );
}
