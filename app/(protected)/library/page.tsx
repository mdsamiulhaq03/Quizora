import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const pdfs = await PDF.find({ userId: session.user.id }).sort({ uploadedAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex items-end justify-between border-b border-rule pb-4 mb-6">
          <div>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted block mb-1">
              DOCUMENT ARCHIVE
            </span>
            <h1
              className="font-display uppercase text-ink leading-none"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", letterSpacing: "-0.03em" }}
            >
              PDF LIBRARY
            </h1>
          </div>
          <Link
            href="/upload"
            className="font-terminal text-[0.65rem] uppercase tracking-widest bg-hazard text-white px-5 py-2.5 border border-hazard hover:bg-paper hover:text-hazard transition-colors"
          >
            [ + UPLOAD PDF ]
          </Link>
        </div>

        {pdfs.length === 0 ? (
          <div className="border border-rule bg-plate px-6 py-12 text-center">
            <svg className="w-10 h-10 text-ink-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted mb-2">
              NO DOCUMENTS IN ARCHIVE.
            </p>
            <Link
              href="/upload"
              className="font-terminal text-[0.65rem] uppercase tracking-widest text-hazard hover:underline"
            >
              [ UPLOAD YOUR FIRST PDF → ]
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
            {pdfs.map((pdf) => (
              <div key={pdf._id.toString()} className="bg-plate p-5 ind-surface">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-hazard shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
                      PDF
                    </span>
                  </div>
                  {pdf.wasTruncated && (
                    <span className="font-terminal text-[0.55rem] uppercase tracking-widest border border-rule text-ink-muted px-1.5 py-0.5">
                      TRUNCATED
                    </span>
                  )}
                </div>

                <div className="ind-rule mb-3" />

                <h3 className="font-terminal text-[0.65rem] uppercase tracking-wide text-ink truncate mb-1">
                  {pdf.filename}
                </h3>
                <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
                  {pdf.wordCount.toLocaleString()} WORDS ·{" "}
                  {new Date(pdf.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                </p>

                {pdf.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pdf.topics.slice(0, 3).map((t) => (
                      <span key={t} className="font-terminal text-[0.55rem] uppercase tracking-widest border border-rule-faint text-ink-muted px-1.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    href={`/upload?pdfId=${pdf._id}`}
                    className="font-terminal text-[0.65rem] uppercase tracking-widest border border-rule text-ink w-full py-2 text-center block hover:border-hazard hover:text-hazard transition-colors"
                  >
                    [ NEW QUIZ → ]
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
