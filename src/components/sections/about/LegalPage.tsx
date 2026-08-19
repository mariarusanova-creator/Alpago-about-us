import Link from "next/link";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const CONTENT = {
  "Privacy Policy": [
    {
      title: "Information we collect",
      paragraphs: [
        "When you contact Alpago through this website, we may collect the information you choose to provide, including your name, email address, telephone number, company name, and the contents of your enquiry.",
        "We may also collect limited technical information when you use the website, such as your IP address, browser and device type, pages visited, and the date and time of your visit. This information helps us maintain the security and performance of the website.",
        "We only seek personal information that is reasonably necessary to respond to your request, manage our relationship with you, and provide the information or services you have asked for.",
      ],
    },
    {
      title: "How we use and protect your information",
      paragraphs: [
        "We use personal information to respond to enquiries, communicate with you, improve our website and services, maintain appropriate business records, and meet our legal and regulatory obligations.",
        "Information may be shared with companies within the Alpago Group and with trusted service providers that support our operations. We require those parties to handle personal information securely and only for the purpose for which it was shared. We do not sell personal information.",
        "We apply reasonable technical and organisational safeguards and retain personal information only for as long as it is needed for the purposes described above. To request access to, correction of, or deletion of your personal information, contact us at info@alpago.com.",
      ],
    },
  ],
  "Terms & Conditions": [
    {
      title: "Use of this website",
      paragraphs: [
        "These Terms and Conditions govern your access to and use of the Alpago website. By using the website, you agree to these terms. If you do not agree with them, please discontinue use of the website.",
        "The website provides general information about Alpago, its businesses, projects, and services. Although we aim to keep this information accurate and current, it may be changed, updated, or removed without notice.",
        "You may view and download website content for personal, non-commercial use. You may not reproduce, modify, distribute, publish, or commercially exploit any content without prior written permission from Alpago.",
      ],
    },
    {
      title: "Liability and third-party content",
      paragraphs: [
        "To the extent permitted by applicable law, Alpago is not responsible for loss or damage arising from the use of, inability to use, or reliance on information provided through this website.",
        "The website may contain links to third-party websites for convenience. Alpago does not control those websites and is not responsible for their content, availability, security, or privacy practices.",
        "Alpago may revise these Terms and Conditions from time to time by publishing an updated version on this page. Continued use of the website after an update constitutes acceptance of the revised terms.",
      ],
    },
  ],
} as const;

export default function LegalPage({ title }: { title: "Privacy Policy" | "Terms & Conditions" }) {
  const sections = CONTENT[title];

  return (
    <main className="section-bg min-h-screen">
      <header className="px-6 pb-8 pt-36 md:px-14 md:pb-10 md:pt-44">
        <div className="caption flex flex-wrap items-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>
          <Link href="/">Home</Link><span>/</span><span style={{ color: "var(--bronze-hi)" }}>{title}</span>
        </div>
        <div className="mt-14 max-w-[1100px]">
          <div className="caption mb-5">Alpago Group</div>
          <h1 className="display text-[clamp(1.9rem,6.2vw,92px)]" style={{ ...GOLD, lineHeight: 1.02, letterSpacing: "-0.32px" }}>{title}</h1>
        </div>
      </header>

      <section className="px-6 pb-20 pt-6 md:px-14 md:pb-28 md:pt-8">
        <div className="w-full space-y-20 md:space-y-24">
          {sections.map((section, index) => (
            <article key={section.title} className="w-full border-t pt-10 md:pt-12" style={{ borderColor: "var(--line)" }}>
              <div className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>0{index + 1}</div>
              <h2 className="display mt-7 max-w-[900px] text-[clamp(1.8rem,3vw,38px)] leading-[1.15]" style={GOLD}>{section.title}</h2>
              <div className="mt-8 max-w-[900px] space-y-6">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[16px] leading-[1.85] md:text-[17px]" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif", opacity: 1 }}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
