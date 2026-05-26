interface Props {
  used: number;
  max: number;
}

export default function UploadQuotaBadge({ used, max }: Props) {
  const remaining = max - used;
  const isEmpty = remaining === 0;

  return (
    <span className={`inline-flex items-center gap-1.5 font-terminal text-[0.6rem] uppercase tracking-widest px-2.5 py-1 border ${
      isEmpty ? "border-hazard text-hazard" : "border-rule text-ink-muted"
    }`}>
      {isEmpty ? "▲" : "●"} {used}/{max} UPLOADS TODAY
    </span>
  );
}
