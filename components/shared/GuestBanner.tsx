import Link from "next/link";

export default function GuestBanner() {
  return (
    <div className="border border-hazard bg-plate flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard mb-0.5">
          ▲ GUEST SESSION ACTIVE
        </p>
      </div>
      <Link
        href="/register"
        className="ml-4 shrink-0 font-terminal text-[0.6rem] uppercase tracking-widest border border-hazard text-hazard px-3 py-1.5 hover:bg-hazard hover:text-white transition-colors"
      >
        [ REGISTER ]
      </Link>
    </div>
  );
}
