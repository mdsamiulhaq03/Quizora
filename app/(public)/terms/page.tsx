import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Quizora",
  description: "Terms and conditions for using the Quizora adaptive quiz engine.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      {/* Top bar */}
      <div className="border-b border-rule bg-plate px-6 py-2 flex items-center justify-between">
        <Link href="/" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
          ← BACK TO HOME
        </Link>
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          LEGAL / DOC-001
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border border-rule mb-8">
          <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              TERMS OF SERVICE
            </span>
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard">
              EFFECTIVE: JUN 1, 2026
            </span>
          </div>
          <div className="px-5 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 bg-hazard flex items-center justify-center shrink-0">
                <span className="text-white font-display text-xs font-bold">Q</span>
              </div>
              <h1 className="font-display uppercase text-ink" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
                TERMS OF SERVICE
              </h1>
            </div>
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
              PLEASE READ THESE TERMS CAREFULLY BEFORE USING QUIZORA.
              BY ACCESSING OR USING THE SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          <Section id="1" title="ACCEPTANCE OF TERMS">
            <P>
              These Terms of Service ("Terms") govern your access to and use of Quizora
              ("Service", "we", "us", or "our"), an adaptive quiz engine that allows users
              to generate multiple-choice questions from uploaded documents.
            </P>
            <P>
              By creating an account or using the Service in any way, you confirm that you
              are at least 13 years of age, have read and understood these Terms, and agree
              to be legally bound by them. If you do not agree, you must not use the Service.
            </P>
          </Section>

          <Section id="2" title="DESCRIPTION OF SERVICE">
            <P>
              Quizora allows registered users to upload PDF documents and generate adaptive
              multiple-choice quizzes powered by AI language models. The Service includes
              features such as quiz history tracking, performance analytics, a personal
              library, and streak-based learning incentives.
            </P>
            <P>
              We reserve the right to modify, suspend, or discontinue any aspect of the
              Service at any time without prior notice.
            </P>
          </Section>

          <Section id="3" title="ACCOUNTS AND REGISTRATION">
            <P>
              You may register using a third-party OAuth provider (GitHub, Google) or an
              email and password. You are responsible for maintaining the confidentiality of
              your credentials and for all activity that occurs under your account.
            </P>
            <P>
              You agree to provide accurate, current, and complete information during
              registration and to keep this information up to date. We reserve the right to
              suspend or terminate accounts that contain false or misleading information.
            </P>
            <P>
              You may not share your account with others or create multiple accounts to
              circumvent usage limits. Guest sessions are temporary and unauthenticated —
              data created as a guest may be lost at any time.
            </P>
          </Section>

          <Section id="4" title="ACCEPTABLE USE">
            <P>You agree not to use the Service to:</P>
            <ul className="space-y-1.5 mt-2">
              {[
                "Upload documents that infringe on any copyright, trademark, or other intellectual property right",
                "Upload content that is unlawful, defamatory, obscene, or otherwise objectionable",
                "Attempt to reverse-engineer, scrape, or extract data from the Service in an automated manner",
                "Circumvent rate limits, upload quotas, or other technical restrictions",
                "Interfere with the security, integrity, or availability of the Service",
                "Use the Service for any commercial resale purpose without our written consent",
                "Attempt to gain unauthorized access to any other user's account or data",
              ].map((item) => (
                <li key={item} className="flex gap-2 font-terminal text-[0.65rem] leading-relaxed text-ink">
                  <span className="text-hazard shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="5" title="UPLOADED CONTENT">
            <P>
              You retain ownership of any documents you upload to the Service. By uploading
              content, you grant Quizora a limited, non-exclusive, royalty-free license to
              process, store, and transmit that content solely for the purpose of providing
              the Service to you.
            </P>
            <P>
              You represent and warrant that you have the legal right to upload any content
              you submit and that doing so does not violate any third-party rights or
              applicable law. We do not claim ownership of your uploaded documents.
            </P>
            <P>
              We may delete uploaded files after processing to generate quizzes. Do not
              rely on the Service as a permanent storage solution for your documents.
            </P>
          </Section>

          <Section id="6" title="AI-GENERATED CONTENT">
            <P>
              Quizzes and questions generated by the Service are produced using third-party
              AI language models. AI-generated content may contain inaccuracies, errors, or
              omissions. You are solely responsible for verifying the correctness of any
              generated quiz content before relying on it for educational or professional
              purposes.
            </P>
            <P>
              We make no warranties regarding the accuracy, completeness, or fitness for
              purpose of AI-generated questions or explanations.
            </P>
          </Section>

          <Section id="7" title="USAGE LIMITS">
            <P>
              Free accounts are subject to usage limits including a maximum number of
              document uploads per day. We reserve the right to adjust these limits at any
              time. Exceeding limits may result in temporary restrictions on your account.
            </P>
          </Section>

          <Section id="8" title="INTELLECTUAL PROPERTY">
            <P>
              All software, design, trademarks, logos, and other content constituting the
              Quizora platform (excluding user-uploaded documents) are the exclusive
              property of Quizora and its licensors, protected by applicable intellectual
              property laws.
            </P>
            <P>
              Nothing in these Terms grants you a right to use the Quizora name, logo, or
              any other trademark without our prior written consent.
            </P>
          </Section>

          <Section id="9" title="PRIVACY">
            <P>
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-hazard hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. By using the Service,
              you consent to the collection and use of information as described therein.
            </P>
          </Section>

          <Section id="10" title="DISCLAIMERS">
            <P>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
              KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </P>
            <P>
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
              FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </P>
          </Section>

          <Section id="11" title="LIMITATION OF LIABILITY">
            <P>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, QUIZORA SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF WE
              HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </P>
            <P>
              OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED
              TO THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US
              IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (B) USD $10.
            </P>
          </Section>

          <Section id="12" title="TERMINATION">
            <P>
              We may suspend or terminate your access to the Service at any time, with or
              without notice, for any violation of these Terms or for any other reason at
              our sole discretion.
            </P>
            <P>
              You may delete your account at any time via your profile settings. Upon
              termination, your right to use the Service ceases immediately. We may retain
              certain information as required by law or for legitimate business purposes.
            </P>
          </Section>

          <Section id="13" title="CHANGES TO TERMS">
            <P>
              We reserve the right to modify these Terms at any time. We will notify
              registered users of material changes via email or a prominent notice within
              the Service. Continued use of the Service after changes take effect
              constitutes your acceptance of the updated Terms.
            </P>
          </Section>

          <Section id="14" title="GOVERNING LAW">
            <P>
              These Terms shall be governed by and construed in accordance with applicable
              law. Any disputes arising under these Terms shall be subject to the exclusive
              jurisdiction of the competent courts.
            </P>
          </Section>

          <Section id="15" title="CONTACT">
            <P>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@quizora.app" className="text-hazard hover:underline">
                support@quizora.app
              </a>
              .
            </P>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="ind-rule my-8" />
        <div className="flex items-center justify-between">
          <Link href="/" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
            ← HOME
          </Link>
          <Link href="/privacy" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
            PRIVACY POLICY →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-rule">
      <div className="border-b border-rule px-5 py-2 bg-plate flex items-center gap-3">
        <span className="font-terminal text-[0.55rem] uppercase tracking-widest text-hazard">{id}.</span>
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink">{title}</span>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-terminal text-[0.65rem] leading-relaxed text-ink">{children}</p>
  );
}
