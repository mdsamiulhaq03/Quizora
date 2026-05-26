import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import PDF from "@/lib/models/PDF";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import LibraryGrid from "@/components/library/LibraryGrid";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const pdfs = await PDF.find({ userId: session.user.id }).sort({ uploadedAt: -1 }).lean();

  const serialized = pdfs.map((p) => ({
    _id: p._id.toString(),
    filename: p.filename,
    wordCount: p.wordCount,
    uploadedAt: p.uploadedAt.toISOString(),
    topics: p.topics ?? [],
    wasTruncated: p.wasTruncated ?? false,
  }));

  return (
    <div className="min-h-[100dvh] bg-paper text-ink ind-surface">
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

        <LibraryGrid pdfs={serialized} />
      </div>
    </div>
  );
}
