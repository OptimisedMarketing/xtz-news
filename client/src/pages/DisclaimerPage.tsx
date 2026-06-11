import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";

const LAST_UPDATED = "11 June 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: "3px", height: "20px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
        {title}
      </h2>
      <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

export default function DisclaimerPage() {
  useSEO({
    title: "Disclaimer | XTZ.News",
    description: "Full legal disclaimer for XTZ.News. Not financial advice. All content is for informational purposes only. Always do your own research.",
    canonical: "https://xtz.news/disclaimer",
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #030e1f 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "4rem 0 3rem" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Link href="/" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" }}>›</span>
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>Disclaimer</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 900, color: "#fff", margin: "0 0 0.75rem" }}>Disclaimer</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "820px", padding: "3.5rem 1.25rem 5rem" }}>

        {/* Important notice box */}
        <div style={{ background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "10px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
            <strong style={{ color: "#f87171" }}>Important:</strong> Nothing on XTZ.News constitutes financial, investment, legal, or tax advice. All content is published for informational and educational purposes only. Cryptocurrency and digital asset investments carry significant risk. Always conduct your own independent research and consult qualified professionals before making any financial decisions.
          </p>
        </div>

        <Section title="1. Not Financial Advice">
          <p>The content published on XTZ.News, including but not limited to articles, news reports, analysis, opinion pieces, price commentary, project reviews, and any other material (collectively, "Content"), is provided solely for general informational and educational purposes.</p>
          <p style={{ marginTop: "0.75rem" }}>Nothing on this website constitutes, or should be construed as, financial advice, investment advice, trading advice, legal advice, tax advice, or any other form of professional advice. XTZ.News is a news and information platform, not a financial services provider, investment adviser, broker, or dealer.</p>
          <p style={{ marginTop: "0.75rem" }}>You should not make any financial or investment decision based solely on information obtained from this website. Before making any investment or financial decision, you should seek independent advice from qualified and licensed financial, legal, and tax professionals.</p>
        </Section>

        <Section title="2. Do Your Own Research (DYOR)">
          <p>Cryptocurrency, blockchain technology, and digital assets are highly speculative, volatile, and complex. The Tezos ecosystem and all projects, tokens, protocols, and applications discussed on XTZ.News carry substantial risk, including the risk of total loss of any capital invested.</p>
          <p style={{ marginTop: "0.75rem" }}>You are solely responsible for evaluating the merits and risks associated with any investment or financial decision. XTZ.News strongly encourages all readers to:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.4rem" }}>Conduct thorough independent research before making any financial decisions</li>
            <li style={{ marginBottom: "0.4rem" }}>Verify all information from multiple independent sources</li>
            <li style={{ marginBottom: "0.4rem" }}>Consult qualified financial, legal, and tax advisers</li>
            <li style={{ marginBottom: "0.4rem" }}>Only invest what you can afford to lose entirely</li>
            <li style={{ marginBottom: "0.4rem" }}>Understand the regulatory environment in your jurisdiction</li>
          </ul>
        </Section>

        <Section title="3. No Endorsements or Recommendations">
          <p>The mention, coverage, or discussion of any project, token, protocol, application, company, product, service, individual, or organisation on XTZ.News does not constitute an endorsement, recommendation, sponsorship, or approval by XTZ.News or its operators.</p>
          <p style={{ marginTop: "0.75rem" }}>Coverage of a project on XTZ.News does not imply that XTZ.News has verified the legitimacy, accuracy, safety, or suitability of that project. News coverage is provided for informational purposes only and should not be interpreted as a positive or negative assessment of any project's value, prospects, or legitimacy.</p>
          <p style={{ marginTop: "0.75rem" }}>XTZ.News may receive compensation from third parties in the form of advertising, sponsored content, or other arrangements. Where such arrangements exist, they will be clearly disclosed. Sponsored content does not constitute an endorsement of the sponsor's products or services.</p>
        </Section>

        <Section title="4. Accuracy and Completeness of Information">
          <p>While XTZ.News makes reasonable efforts to ensure the accuracy and timeliness of the Content published on this website, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the Content.</p>
          <p style={{ marginTop: "0.75rem" }}>The cryptocurrency and blockchain space moves rapidly. Information that is accurate at the time of publication may become outdated, incorrect, or misleading shortly thereafter. XTZ.News does not undertake any obligation to update or correct published content.</p>
          <p style={{ marginTop: "0.75rem" }}>Prices, statistics, data, and other figures mentioned in articles are sourced from third-party providers and may not be accurate or up to date. You should independently verify all such information before relying on it.</p>
        </Section>

        <Section title="5. Third-Party Links and Content">
          <p>XTZ.News may contain links to third-party websites, platforms, applications, and resources. These links are provided for convenience and informational purposes only. XTZ.News has no control over the content, privacy practices, or policies of third-party websites and accepts no responsibility or liability for them.</p>
          <p style={{ marginTop: "0.75rem" }}>The inclusion of any link does not imply endorsement, approval, or recommendation by XTZ.News of the linked website or its operator. You access third-party websites entirely at your own risk.</p>
          <p style={{ marginTop: "0.75rem" }}>XTZ.News may embed or reference content from third-party platforms including but not limited to X (Twitter), YouTube, and other social media platforms. Such embedded content is subject to the terms and policies of the respective platforms.</p>
        </Section>

        <Section title="6. No Liability">
          <p>To the fullest extent permitted by applicable law, XTZ.News, its operators, contributors, authors, editors, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.4rem" }}>Your use of, or inability to use, this website or its Content</li>
            <li style={{ marginBottom: "0.4rem" }}>Any reliance placed on information published on this website</li>
            <li style={{ marginBottom: "0.4rem" }}>Any financial losses, including loss of profits or capital, arising from decisions made based on Content on this website</li>
            <li style={{ marginBottom: "0.4rem" }}>Any errors, omissions, or inaccuracies in the Content</li>
            <li style={{ marginBottom: "0.4rem" }}>Unauthorised access to or alteration of your data or transmissions</li>
            <li style={{ marginBottom: "0.4rem" }}>Any other matter relating to this website</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>This limitation of liability applies regardless of whether the claim is based on contract, tort, negligence, strict liability, or any other legal theory, even if XTZ.News has been advised of the possibility of such damages.</p>
        </Section>

        <Section title="7. Investment Risk Warning">
          <p>Cryptocurrency and digital asset investments are highly speculative and involve a significant degree of risk. The value of cryptocurrencies can fluctuate dramatically and may result in the total loss of your investment. Past performance is not indicative of future results.</p>
          <p style={{ marginTop: "0.75rem" }}>Specific risks associated with cryptocurrency investments include, but are not limited to:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.4rem" }}>Extreme price volatility and market manipulation</li>
            <li style={{ marginBottom: "0.4rem" }}>Regulatory uncertainty and potential prohibition in certain jurisdictions</li>
            <li style={{ marginBottom: "0.4rem" }}>Smart contract vulnerabilities and protocol exploits</li>
            <li style={{ marginBottom: "0.4rem" }}>Exchange hacks, wallet compromises, and loss of private keys</li>
            <li style={{ marginBottom: "0.4rem" }}>Liquidity risk and inability to sell assets</li>
            <li style={{ marginBottom: "0.4rem" }}>Project failure, abandonment, or fraud</li>
            <li style={{ marginBottom: "0.4rem" }}>Tax implications that vary by jurisdiction</li>
          </ul>
        </Section>

        <Section title="8. AI-Generated and Translated Content">
          <p>XTZ.News uses artificial intelligence tools to assist with content creation, including article translation into multiple languages and audio narration. AI-generated and AI-translated content may contain errors, inaccuracies, or mistranslations. Such content is provided on an "as is" basis and should not be relied upon as authoritative.</p>
          <p style={{ marginTop: "0.75rem" }}>Translated articles are provided for accessibility purposes only. In the event of any inconsistency between the English original and a translated version, the English version shall prevail.</p>
        </Section>

        <Section title="9. Jurisdiction and Regulatory Compliance">
          <p>The information on XTZ.News is intended for a general audience and may not be appropriate for all users in all jurisdictions. Cryptocurrency regulations vary significantly by country and are subject to change. It is your responsibility to ensure that your use of this website and any related activities comply with the laws and regulations applicable in your jurisdiction.</p>
          <p style={{ marginTop: "0.75rem" }}>Nothing on this website is intended to constitute an offer or solicitation to buy or sell any financial instrument or cryptocurrency in any jurisdiction where such offer or solicitation would be unlawful.</p>
        </Section>

        <Section title="10. Editorial Independence">
          <p>XTZ.News operates as an independent news platform. Our editorial decisions are made independently of commercial considerations. However, we are a community-funded publication and may accept advertising, sponsorships, or donations. Such commercial relationships do not influence our editorial content, and any sponsored content is clearly labelled as such.</p>
          <p style={{ marginTop: "0.75rem" }}>Contributors and authors may hold positions in the cryptocurrencies and projects they write about. Where material conflicts of interest exist, they will be disclosed. However, XTZ.News cannot guarantee that all potential conflicts of interest are always identified or disclosed.</p>
        </Section>

        <Section title="11. Changes to This Disclaimer">
          <p>XTZ.News reserves the right to modify this Disclaimer at any time without prior notice. Changes will be effective immediately upon posting to this page. Your continued use of this website following the posting of changes constitutes your acceptance of such changes. We encourage you to review this Disclaimer periodically.</p>
        </Section>

        <Section title="12. Contact">
          <p>If you have any questions about this Disclaimer, please contact us at <a href="mailto:hello@xtz.news" style={{ color: "#2c7df7" }}>hello@xtz.news</a>.</p>
        </Section>

        {/* Footer links */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <Link href="/privacy-policy" style={{ fontSize: "0.82rem", color: "#2c7df7", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms-and-conditions" style={{ fontSize: "0.82rem", color: "#2c7df7", textDecoration: "none" }}>Terms & Conditions</Link>
          <Link href="/contact" style={{ fontSize: "0.82rem", color: "#2c7df7", textDecoration: "none" }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
