import { Mail, Star, TrendingUp, CheckCircle } from "lucide-react";

export default function AdvertisePage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", padding: "5rem 0 4rem", borderBottom: "1px solid rgba(44,125,247,0.2)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "20px", padding: "0.3rem 0.9rem", marginBottom: "1.5rem" }}>
            <TrendingUp size={13} style={{ color: "#2c7df7" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.08em" }}>Advertise with us</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", margin: "0 0 1rem", lineHeight: 1.1 }}>
            Reach the Tezos Community
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", maxWidth: "600px", lineHeight: 1.7, margin: "0 0 2.5rem" }}>
            XTZ.News is the leading English-language news platform for the Tezos ecosystem. Advertise to a highly engaged audience of developers, investors, and Tezos enthusiasts.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
            {[
              { value: "1,532+", label: "Published Articles" },
              { value: "1,026+", label: "Newsletter Subscribers" },
              { value: "10+", label: "Years of Coverage" },
              { value: "Global", label: "Tezos Audience" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#2c7df7" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "900px", padding: "4rem 1.25rem" }}>

        {/* Newsletter Sponsorship */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px" }} />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Newsletter Sponsorship</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "2rem", marginLeft: "1.25rem" }}>
            Direct access to 1,026+ engaged Tezos community members via our weekly digest.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              { name: "Single Send", price: "£200", period: "per newsletter", features: ["1 sponsored slot in weekly digest", "Your logo + 50-word description", "Link to your website/dApp", "Sent to 1,026+ subscribers", "Performance report included"], highlight: false },
              { name: "Monthly Package", price: "£650", period: "per month (4 sends)", features: ["4 sponsored slots (all sends)", "Priority placement at top of digest", "Your logo + 100-word description", "1 dedicated article mention", "Monthly analytics report"], highlight: true, badge: "Most Popular" },
              { name: "Quarterly Package", price: "£1,800", period: "per quarter (12 sends)", features: ["12 sponsored slots", "Exclusive top placement", "1 sponsored article included", "Social media mention", "Quarterly performance report"], highlight: false },
            ].map(pkg => (
              <div key={pkg.name} style={{ background: pkg.highlight ? "linear-gradient(135deg, rgba(44,125,247,0.15) 0%, rgba(44,125,247,0.05) 100%)" : "rgba(255,255,255,0.03)", border: pkg.highlight ? "1px solid rgba(44,125,247,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem", position: "relative" }}>
                {(pkg as any).badge && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#2c7df7", color: "#fff", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                    {(pkg as any).badge}
                  </div>
                )}
                <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.25rem" }}>{pkg.name}</h3>
                <div style={{ marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 900, color: pkg.highlight ? "#2c7df7" : "#fff" }}>{pkg.price}</span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginLeft: "0.4rem" }}>{pkg.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {pkg.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
                      <CheckCircle size={13} style={{ color: "#2c7df7", flexShrink: 0, marginTop: "2px" }} />{f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:hello@xtz.news?subject=Newsletter Sponsorship Enquiry" style={{ display: "block", textAlign: "center", padding: "0.65rem", borderRadius: "4px", background: pkg.highlight ? "#2c7df7" : "transparent", border: pkg.highlight ? "none" : "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsored Articles */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px" }} />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Sponsored Articles</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "2rem", marginLeft: "1.25rem" }}>
            Get your project, protocol, or announcement in front of the Tezos community with a dedicated article.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              { name: "Press Release", price: "£300", features: ["500–800 word article", "Your provided content, lightly edited", "Published within 48 hours", "Permanent on-site placement", "Included in next newsletter"] },
              { name: "Editorial Feature", price: "£600", features: ["800–1,200 word deep-dive", "Written by XTZ.News editorial team", "Includes quotes and context", "Social media promotion", "Newsletter feature + homepage placement"] },
              { name: "Campaign Package", price: "£1,500", features: ["3 articles over 30 days", "Newsletter sponsorship included", "Homepage banner placement", "Social media campaign", "Monthly performance report"] },
            ].map(pkg => (
              <div key={pkg.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem" }}>
                <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 0.25rem" }}>{pkg.name}</h3>
                <div style={{ marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 900, color: "#fff" }}>{pkg.price}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {pkg.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
                      <CheckCircle size={13} style={{ color: "#2c7df7", flexShrink: 0, marginTop: "2px" }} />{f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:hello@xtz.news?subject=Sponsored Article Enquiry" style={{ display: "block", textAlign: "center", padding: "0.65rem", borderRadius: "4px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Enquire Now
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Project Listing */}
        <section style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px" }} />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Featured Project Listing</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "2rem", marginLeft: "1.25rem" }}>
            Stand out in the XTZ.News Projects directory with a featured listing.
          </p>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem", display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <Star size={16} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Featured Badge</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2c7df7", marginLeft: "0.5rem" }}>£75<span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>/month</span></span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Gold star badge on your project card", "Priority placement at top of Projects page", "Highlighted card with blue border", "Listed in newsletter monthly roundup", "Cancel anytime"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
                    <CheckCircle size={13} style={{ color: "#2c7df7" }} />{f}
                  </li>
                ))}
              </ul>
            </div>
            <a href="mailto:hello@xtz.news?subject=Featured Project Listing Enquiry" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "4px", background: "#2c7df7", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
              <Star size={14} /> Get Featured
            </a>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{ background: "linear-gradient(135deg, rgba(44,125,247,0.1) 0%, rgba(44,125,247,0.03) 100%)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", padding: "2.5rem", textAlign: "center" }}>
          <Mail size={32} style={{ color: "#2c7df7", marginBottom: "1rem" }} />
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "1.4rem", margin: "0 0 0.75rem" }}>Custom Packages Available</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", maxWidth: "500px", margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
            Looking for something bespoke? We work with Tezos projects of all sizes. Get in touch to discuss a custom advertising package.
          </p>
          <a href="mailto:hello@xtz.news?subject=Advertising Enquiry" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", borderRadius: "4px", background: "#2c7df7", color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
            <Mail size={15} /> Contact Us
          </a>
        </section>

      </div>
    </div>
  );
}
