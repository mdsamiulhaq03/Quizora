import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Quizora",
  description: "How Quizora collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink ind-surface">
      {/* Top bar */}
      <div className="border-b border-rule bg-plate px-6 py-2 flex items-center justify-between">
        <Link href="/" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
          ← BACK TO HOME
        </Link>
        <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
          LEGAL / DOC-002
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border border-rule mb-8">
          <div className="border-b border-rule px-5 py-2 flex items-center justify-between bg-plate">
            <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted">
              PRIVACY POLICY
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
                PRIVACY POLICY
              </h1>
            </div>
            <p className="font-terminal text-[0.65rem] uppercase tracking-widest text-ink-muted">
              YOUR PRIVACY MATTERS TO US. THIS POLICY EXPLAINS WHAT DATA WE COLLECT,
              WHY WE COLLECT IT, AND HOW WE PROTECT IT.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          <Section id="1" title="WHO WE ARE">
            <P>
              Quizora ("we", "us", or "our") is an adaptive quiz engine that generates
              multiple-choice questions from user-uploaded documents. This Privacy Policy
              describes how we handle personal information collected through our website
              and services.
            </P>
            <P>
              If you have questions about this policy, contact us at{" "}
              <a href="mailto:privacy@quizora.app" className="text-hazard hover:underline">
                privacy@quizora.app
              </a>
              .
            </P>
          </Section>

          <Section id="2" title="INFORMATION WE COLLECT">
            <P>We collect information in the following ways:</P>

            <SubHeading>Information you provide directly</SubHeading>
            <ul className="space-y-1.5 mt-1">
              {[
                "Account details: name, email address, and (if using email sign-up) a hashed password",
                "Profile information: display name and avatar (pulled from OAuth provider if applicable)",
                "Documents you upload for quiz generation",
                "Onboarding preferences and subject interests",
              ].map((item) => (
                <li key={item} className="flex gap-2 font-terminal text-[0.65rem] leading-relaxed text-ink">
                  <span className="text-hazard shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>

            <SubHeading>Information collected automatically</SubHeading>
            <ul className="space-y-1.5 mt-1">
              {[
                "Quiz attempts, scores, and performance history",
                "Streak data and last activity timestamps",
                "Usage patterns such as quizzes generated and topics studied",
                "Basic device and browser information for security and debugging",
                "IP address for rate limiting and abuse prevention",
              ].map((item) => (
                <li key={item} className="flex gap-2 font-terminal text-[0.65rem] leading-relaxed text-ink">
                  <span className="text-hazard shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>

            <SubHeading>Information from third parties</SubHeading>
            <P>
              If you sign in via GitHub or Google, we receive your name, email address,
              and profile picture from that provider. We do not receive your passwords
              from these services.
            </P>
          </Section>

          <Section id="3" title="HOW WE USE YOUR INFORMATION">
            <P>We use the information we collect to:</P>
            <ul className="space-y-1.5 mt-2">
              {[
                "Create and maintain your account",
                "Generate quizzes from your uploaded documents using AI models",
                "Track your learning progress, streaks, and quiz history",
                "Send transactional emails such as sign-in links and account notifications (via Resend)",
                "Enforce usage limits and prevent abuse",
                "Improve the accuracy and quality of our AI-generated content",
                "Respond to support requests and communications",
                "Comply with legal obligations",
              ].map((item) => (
                <li key={item} className="flex gap-2 font-terminal text-[0.65rem] leading-relaxed text-ink">
                  <span className="text-hazard shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <P>
              We do not sell your personal data to third parties. We do not use your data
              for advertising purposes.
            </P>
          </Section>

          <Section id="4" title="UPLOADED DOCUMENTS">
            <P>
              Documents you upload are processed solely to generate quiz questions. We use
              third-party AI APIs (such as Groq) to extract and analyse document content.
              These providers process text content in accordance with their own privacy
              policies.
            </P>
            <P>
              Uploaded files may be deleted from our servers after processing is complete.
              We do not use the content of your documents to train AI models, and we do not
              share your document content with other users.
            </P>
          </Section>

          <Section id="5" title="DATA STORAGE AND SECURITY">
            <P>
              Your data is stored in MongoDB databases hosted on cloud infrastructure.
              Session state is managed via encrypted JWT tokens. Passwords are hashed
              using bcrypt with a cost factor of 12 and are never stored in plaintext.
            </P>
            <P>
              We implement rate limiting (via Upstash Redis) to protect against brute-force
              and abuse. All data is transmitted over HTTPS.
            </P>
            <P>
              While we take reasonable security measures, no system is perfectly secure.
              We cannot guarantee the absolute security of your data and encourage you to
              use a strong, unique password for your account.
            </P>
          </Section>

          <Section id="6" title="DATA RETENTION">
            <P>
              We retain your account and quiz data for as long as your account is active.
              If you delete your account, we will delete or anonymise your personal data
              within 30 days, except where retention is required by law or for legitimate
              business purposes such as fraud prevention.
            </P>
            <P>
              Uploaded documents may be deleted sooner, typically immediately after quiz
              generation is complete.
            </P>
          </Section>

          <Section id="7" title="COOKIES AND LOCAL STORAGE">
            <P>
              We use cookies solely for authentication — specifically, a session cookie
              containing your encrypted JWT token. We do not use advertising cookies or
              cross-site tracking.
            </P>
            <P>
              We may use browser local storage to preserve guest quiz state before you
              sign in, enabling seamless data migration to your account.
            </P>
          </Section>

          <Section id="8" title="THIRD-PARTY SERVICES">
            <P>We use the following third-party services to operate Quizora:</P>
            <div className="mt-2 border border-rule divide-y divide-rule">
              {[
                { name: "MongoDB Atlas", purpose: "Database storage for user accounts and quiz data" },
                { name: "Groq", purpose: "AI language model API for quiz question generation" },
                { name: "Resend", purpose: "Transactional email delivery (sign-in links, notifications)" },
                { name: "Upstash Redis", purpose: "Rate limiting and session caching" },
                { name: "GitHub OAuth", purpose: "Optional social sign-in" },
                { name: "Google OAuth", purpose: "Optional social sign-in" },
                { name: "Inngest", purpose: "Background job processing for quiz generation" },
              ].map(({ name, purpose }) => (
                <div key={name} className="px-4 py-2.5 flex gap-4">
                  <span className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard w-32 shrink-0">{name}</span>
                  <span className="font-terminal text-[0.6rem] leading-relaxed text-ink">{purpose}</span>
                </div>
              ))}
            </div>
            <P>
              Each of these providers processes data in accordance with their own privacy
              policies. We encourage you to review those policies.
            </P>
          </Section>

          <Section id="9" title="YOUR RIGHTS">
            <P>Depending on your location, you may have the following rights:</P>
            <ul className="space-y-1.5 mt-2">
              {[
                "Access: request a copy of the personal data we hold about you",
                "Correction: request that inaccurate data be corrected",
                "Deletion: request that your account and associated data be deleted",
                "Portability: request your data in a structured, machine-readable format",
                "Objection: object to certain types of processing",
                "Withdrawal of consent: where processing is based on consent, withdraw it at any time",
              ].map((item) => (
                <li key={item} className="flex gap-2 font-terminal text-[0.65rem] leading-relaxed text-ink">
                  <span className="text-hazard shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <P>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:privacy@quizora.app" className="text-hazard hover:underline">
                privacy@quizora.app
              </a>
              . We will respond within 30 days.
            </P>
          </Section>

          <Section id="10" title="CHILDREN'S PRIVACY">
            <P>
              The Service is not directed to children under the age of 13. We do not
              knowingly collect personal information from children under 13. If we become
              aware that a child under 13 has provided us with personal data, we will
              delete it promptly. If you believe a child under 13 has registered, please
              contact us immediately.
            </P>
          </Section>

          <Section id="11" title="INTERNATIONAL TRANSFERS">
            <P>
              Your data may be processed in countries other than your own, including by
              third-party service providers listed above. We ensure that any such transfers
              are conducted with appropriate safeguards in place.
            </P>
          </Section>

          <Section id="12" title="CHANGES TO THIS POLICY">
            <P>
              We may update this Privacy Policy from time to time. We will notify you of
              material changes via email or a prominent notice within the Service. The
              effective date at the top of this page will always reflect the most recent
              version.
            </P>
            <P>
              Continued use of the Service after changes take effect constitutes your
              acceptance of the updated Privacy Policy.
            </P>
          </Section>

          <Section id="13" title="CONTACT US">
            <P>
              If you have any questions, concerns, or requests regarding this Privacy
              Policy or your personal data, please contact us:
            </P>
            <div className="mt-3 border border-rule px-5 py-4 space-y-1.5">
              <p className="font-terminal text-[0.65rem] text-ink">
                <span className="text-hazard">EMAIL: </span>
                <a href="mailto:privacy@quizora.app" className="hover:underline">privacy@quizora.app</a>
              </p>
              <p className="font-terminal text-[0.65rem] text-ink">
                <span className="text-hazard">SUPPORT: </span>
                <a href="mailto:support@quizora.app" className="hover:underline">support@quizora.app</a>
              </p>
            </div>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="ind-rule my-8" />
        <div className="flex items-center justify-between">
          <Link href="/terms" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
            ← TERMS OF SERVICE
          </Link>
          <Link href="/" className="font-terminal text-[0.6rem] uppercase tracking-widest text-ink-muted hover:text-hazard transition-colors">
            HOME →
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

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-terminal text-[0.6rem] uppercase tracking-widest text-hazard mt-3">
      {children}
    </p>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-terminal text-[0.65rem] leading-relaxed text-ink">{children}</p>
  );
}
