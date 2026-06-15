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

export default function PrivacyPolicyPage() {
  useSEO({
    title: "Privacy Policy | XTZ.News",
    description: "XTZ.News Privacy Policy. How we collect, use, and protect your personal data in accordance with UK GDPR and PECR.",
    canonical: "https://xtz.news/privacy-policy",
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #030e1f 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "4rem 0 3rem" }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Link href="/" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" }}>›</span>
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>Privacy Policy</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 900, color: "#fff", margin: "0 0 0.75rem" }}>Privacy Policy</h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "820px", padding: "3.5rem 1.25rem 5rem" }}>

        <div style={{ background: "rgba(44,125,247,0.07)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "10px", padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: 0 }}>
            XTZ.News is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our website at <strong>xtz.news</strong>. We comply with the UK General Data Protection Regulation (UK GDPR) and the Privacy and Electronic Communications Regulations (PECR).
          </p>
        </div>

        <Section title="1. Who We Are">
          <p>XTZ.News ("we", "us", "our") is an independent Tezos blockchain news platform operated at <strong>xtz.news</strong>. For data protection purposes, we are the data controller of your personal data.</p>
          <p style={{ marginTop: "0.75rem" }}>Contact: <a href="mailto:hello@xtz.news" style={{ color: "#2c7df7" }}>hello@xtz.news</a></p>
        </Section>

        <Section title="2. Data We Collect">
          <p><strong style={{ color: "#fff" }}>2.1 Newsletter Subscriptions</strong></p>
          <p style={{ marginTop: "0.5rem" }}>When you subscribe to our newsletter, we collect your email address. This is the only personal data required to subscribe. We use this to send you our weekly digest of Tezos news and governance alerts.</p>

          <p style={{ marginTop: "1rem" }}><strong style={{ color: "#fff" }}>2.2 Contact Form</strong></p>
          <p style={{ marginTop: "0.5rem" }}>When you use our contact form, we collect your name, email address, and the content of your message. This data is used solely to respond to your enquiry.</p>

          <p style={{ marginTop: "1rem" }}><strong style={{ color: "#fff" }}>2.3 Analytics</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We use privacy-respecting analytics to understand how visitors use our website. Analytics data is aggregated and anonymised and does not identify individual users. We do not use Google Analytics or other tracking-heavy analytics services.</p>

          <p style={{ marginTop: "1rem" }}><strong style={{ color: "#fff" }}>2.4 Technical Data</strong></p>
          <p style={{ marginTop: "0.5rem" }}>When you visit our website, our servers automatically collect standard technical information including your IP address (anonymised), browser type and version, operating system, referring URL, and pages visited. This data is used for security, performance monitoring, and to improve our service.</p>

          <p style={{ marginTop: "1rem" }}><strong style={{ color: "#fff" }}>2.5 Cookies</strong></p>
          <p style={{ marginTop: "0.5rem" }}>We use essential cookies necessary for the website to function (such as session cookies). We do not use advertising cookies or third-party tracking cookies. See Section 8 for more details.</p>
        </Section>

        <Section title="3. How We Use Your Data">
          <p>We use your personal data for the following purposes:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Newsletter delivery:</strong> To send you our weekly Tezos news digest and governance alerts that you have subscribed to</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Responding to enquiries:</strong> To respond to messages sent via our contact form</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Website improvement:</strong> To analyse how our website is used and improve its performance and content</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Legal compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </Section>

        <Section title="4. Legal Basis for Processing">
          <p>Under UK GDPR, we process your personal data on the following legal bases:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Consent:</strong> For newsletter subscriptions — you can withdraw consent at any time by unsubscribing</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Legitimate interests:</strong> For analytics, security monitoring, and website improvement</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Contract performance:</strong> To respond to contact form enquiries</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Legal obligation:</strong> Where required by applicable law</li>
          </ul>
        </Section>

        <Section title="5. Email Marketing and PECR">
          <p>We send marketing emails (our newsletter) only to users who have explicitly subscribed and given their consent. In accordance with PECR:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.4rem" }}>We will only send you our newsletter if you have opted in</li>
            <li style={{ marginBottom: "0.4rem" }}>Every marketing email includes a clear and easy unsubscribe link</li>
            <li style={{ marginBottom: "0.4rem" }}>We will process your unsubscribe request promptly</li>
            <li style={{ marginBottom: "0.4rem" }}>We will not sell or share your email address with third parties for marketing purposes</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>To unsubscribe, click the unsubscribe link in any newsletter email, visit <Link href="/manage-subscriptions" style={{ color: "#2c7df7" }}>xtz.news/manage-subscriptions</Link>, or email us at <a href="mailto:hello@xtz.news" style={{ color: "#2c7df7" }}>hello@xtz.news</a>.</p>
        </Section>

        <Section title="6. Data Sharing and Third Parties">
          <p>We do not sell, rent, or trade your personal data. We may share your data with the following categories of third parties only where necessary:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Email service provider (Resend):</strong> We use Resend to send newsletter emails. Your email address is processed by Resend in accordance with their privacy policy.</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Hosting provider (Manus):</strong> Our website is hosted on Manus infrastructure. Technical data including server logs may be processed by our hosting provider.</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Database provider (TiDB Cloud):</strong> Subscriber email addresses and contact form data are stored in our database hosted on TiDB Cloud.</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Law enforcement:</strong> We may disclose data where required by law, court order, or to protect the rights and safety of XTZ.News and its users.</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>All third-party processors are required to handle your data in accordance with applicable data protection law.</p>
        </Section>

        <Section title="7. Data Retention">
          <p>We retain your personal data only for as long as necessary for the purposes for which it was collected:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.4rem" }}><strong style={{ color: "#fff" }}>Newsletter subscriptions:</strong> Until you unsubscribe, after which we will delete your email address within 30 days</li>
            <li style={{ marginBottom: "0.4rem" }}><strong style={{ color: "#fff" }}>Contact form data:</strong> For up to 2 years after your enquiry is resolved</li>
            <li style={{ marginBottom: "0.4rem" }}><strong style={{ color: "#fff" }}>Server logs:</strong> Typically 30–90 days for security and performance purposes</li>
            <li style={{ marginBottom: "0.4rem" }}><strong style={{ color: "#fff" }}>Analytics data:</strong> Aggregated and anonymised — retained indefinitely as it cannot identify individuals</li>
          </ul>
        </Section>

        <Section title="8. Cookies">
          <p>We use the following types of cookies:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Essential cookies:</strong> Required for the website to function correctly. These include session cookies and authentication tokens. These cannot be disabled.</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Analytics cookies:</strong> We may use privacy-respecting analytics that set minimal cookies. These do not track you across other websites.</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>We do not use advertising cookies, social media tracking cookies, or any cookies that track your activity across other websites. You can manage cookies through your browser settings.</p>
        </Section>

        <Section title="9. Your Rights Under UK GDPR">
          <p>You have the following rights regarding your personal data:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right of access:</strong> You can request a copy of the personal data we hold about you</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right to rectification:</strong> You can ask us to correct inaccurate personal data</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right to erasure ("right to be forgotten"):</strong> You can ask us to delete your personal data in certain circumstances</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right to restrict processing:</strong> You can ask us to limit how we use your data</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right to data portability:</strong> You can request your data in a machine-readable format</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right to object:</strong> You can object to processing based on legitimate interests</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "#fff" }}>Right to withdraw consent:</strong> Where processing is based on consent, you can withdraw it at any time</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>To exercise any of these rights, contact us at <a href="mailto:hello@xtz.news" style={{ color: "#2c7df7" }}>hello@xtz.news</a>. We will respond within one month.</p>
        </Section>

        <Section title="10. Data Security">
          <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include encrypted data transmission (HTTPS), access controls, and regular security reviews.</p>
          <p style={{ marginTop: "0.75rem" }}>However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
        </Section>

        <Section title="11. International Data Transfers">
          <p>Some of our third-party service providers may process data outside the UK or EEA. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or adequacy decisions, to protect your data in accordance with UK GDPR requirements.</p>
        </Section>

        <Section title="12. Children's Privacy">
          <p>XTZ.News is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe we have inadvertently collected data from a child, please contact us immediately at <a href="mailto:hello@xtz.news" style={{ color: "#2c7df7" }}>hello@xtz.news</a>.</p>
        </Section>

        <Section title="13. Complaints">
          <p>If you are unhappy with how we handle your personal data, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO):</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.4rem" }}>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: "#2c7df7" }}>ico.org.uk</a></li>
            <li style={{ marginBottom: "0.4rem" }}>Helpline: 0303 123 1113</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>We would appreciate the opportunity to address your concerns before you contact the ICO, so please contact us first at <a href="mailto:hello@xtz.news" style={{ color: "#2c7df7" }}>hello@xtz.news</a>.</p>
        </Section>

        <Section title="14. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify newsletter subscribers of material changes by email. The date at the top of this page indicates when it was last updated. Your continued use of XTZ.News following any changes constitutes your acceptance of the updated policy.</p>
        </Section>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <Link href="/disclaimer" style={{ fontSize: "0.82rem", color: "#2c7df7", textDecoration: "none" }}>Disclaimer</Link>
          <Link href="/terms-and-conditions" style={{ fontSize: "0.82rem", color: "#2c7df7", textDecoration: "none" }}>Terms & Conditions</Link>
          <Link href="/contact" style={{ fontSize: "0.82rem", color: "#2c7df7", textDecoration: "none" }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
