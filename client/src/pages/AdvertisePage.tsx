import { CheckCircle, Mail, Megaphone, Star, TrendingUp } from "lucide-react";
import AdvertiserEnquiryForm from "@/components/AdvertiserEnquiryForm";

const placementRows = [
  { placement: "Homepage companion banner", price: "Quote on request", detail: "A clearly labelled first-party placement beneath the lead story. Supply a 3:1 creative, such as 2172 × 724, and a destination URL." },
  { placement: "Article companion banner", price: "Quote on request", detail: "A clearly labelled placement after the author bio on published news articles; sized responsively for the reading column." },
  { placement: "Newsletter sponsorship", price: "From £200", detail: "A sponsored slot in the monthly XTZ.News digest, subject to campaign fit and available inventory." },
  { placement: "Sponsored article", price: "From £300", detail: "Clearly labelled supplied or editorially prepared coverage, subject to source and disclosure review." },
  { placement: "Featured directory listing", price: "£75 / month", detail: "A highlighted project listing in the public directory, subject to editorial review and ongoing eligibility." },
];

export default function AdvertisePage() {
  return <main style={{ background: "#000", minHeight: "100vh" }}>
    <section style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", padding: "4.8rem 0 3.8rem", borderBottom: "1px solid rgba(44,125,247,.2)" }}>
      <div className="container" style={{ maxWidth: "940px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "rgba(44,125,247,.15)", border: "1px solid rgba(44,125,247,.3)", borderRadius: "20px", padding: ".3rem .9rem", marginBottom: "1.35rem" }}><TrendingUp size={13} style={{ color: "#2c7df7" }} /><span style={{ fontSize: ".72rem", fontWeight: 800, color: "#79aaff", textTransform: "uppercase", letterSpacing: ".08em" }}>Advertise with us</span></div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#fff", margin: "0 0 1rem", lineHeight: 1.1 }}>Reach Tezos readers with clear sponsorship</h1>
        <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.68)", maxWidth: "690px", lineHeight: 1.7, margin: 0 }}>XTZ.News offers clearly labelled promotional placements for Tezos projects, apps, services, and community initiatives. Every request is checked for availability and editorial fit before a campaign is confirmed.</p>
        <a href="#advertising-enquiry" style={{ display: "inline-flex", marginTop: "1.45rem", alignItems: "center", gap: ".45rem", padding: ".72rem 1rem", borderRadius: "4px", background: "#63f7b1", color: "#062013", fontWeight: 900, fontSize: ".78rem", textDecoration: "none" }}><Megaphone size={15} /> Start an enquiry</a>
      </div>
    </section>

    <div className="container" style={{ maxWidth: "940px", padding: "3.3rem 1.25rem 4.5rem" }}>
      <section aria-labelledby="placement-pricing" style={{ marginBottom: "3.8rem" }}>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center", marginBottom: ".45rem" }}><div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px" }} /><h2 id="placement-pricing" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Placements and pricing</h2></div>
        <p style={{ color: "rgba(255,255,255,.54)", lineHeight: 1.6, margin: ".55rem 0 1.35rem", maxWidth: "760px", fontSize: ".88rem" }}>Shown prices are starting prices in GBP where listed. Banner availability, final dates, creative requirements, and campaign scope are agreed before publishing. Quote-based placements are confirmed after review.</p>
        <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", background: "#05152e" }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px", textAlign: "left" }}><thead><tr style={{ background: "rgba(44,125,247,.12)" }}><th style={th}>Placement</th><th style={th}>Starting price</th><th style={th}>What is included</th></tr></thead><tbody>{placementRows.map((row) => <tr key={row.placement} style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}><td style={tdStrong}>{row.placement}</td><td style={tdPrice}>{row.price}</td><td style={td}>{row.detail}</td></tr>)}</tbody></table></div>
      </section>

      <section aria-labelledby="banner-specifications" style={{ marginBottom: "3.8rem" }}>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center", marginBottom: ".45rem" }}><div style={{ width: "4px", height: "28px", background: "#63f7b1", borderRadius: "2px" }} /><h2 id="banner-specifications" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Banner placement details</h2></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: ".9rem", marginTop: "1rem" }}>{[
          ["Homepage companion", "Appears beneath the lead story and is marked “From our network”. The live placement keeps editorial content visually separate."],
          ["Article companion", "Appears after the author bio and before related reading, so the article body and reader controls are not interrupted."],
          ["Creative delivery", "Use a 3:1 PNG, WebP, or JPEG, ideally 2172 × 724. Provide meaningful alt text, an HTTPS destination, and only rights-cleared assets."],
        ].map(([title, copy]) => <article key={title} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", padding: "1rem" }}><h3 style={{ margin: 0, color: "#fff", fontSize: ".94rem" }}>{title}</h3><p style={{ margin: ".5rem 0 0", color: "rgba(255,255,255,.58)", fontSize: ".78rem", lineHeight: 1.55 }}>{copy}</p></article>)}</div>
      </section>

      <section aria-labelledby="advertising-principles" style={{ marginBottom: "3.8rem", background: "rgba(44,125,247,.07)", border: "1px solid rgba(44,125,247,.22)", borderRadius: "8px", padding: "1.1rem" }}><h2 id="advertising-principles" style={{ color: "#fff", fontSize: "1.05rem", margin: 0 }}>How placements are handled</h2><ul style={{ listStyle: "none", margin: ".75rem 0 0", padding: 0, display: "grid", gap: ".5rem" }}>{["Promotional placements are labelled and kept separate from editorial reporting.", "Campaigns do not use third-party ad scripts or behavioural tracking.", "A banner campaign can have an end date and automatically hides when that date passes.", "All advertiser information is private and reviewed by the XTZ.News team before a campaign goes live."].map((item) => <li key={item} style={{ display: "flex", gap: ".5rem", color: "rgba(255,255,255,.68)", fontSize: ".8rem", lineHeight: 1.5 }}><CheckCircle size={14} style={{ color: "#63f7b1", marginTop: ".1rem", flexShrink: 0 }} />{item}</li>)}</ul></section>

      <section id="advertising-enquiry" aria-labelledby="advertising-enquiry-heading" style={{ background: "linear-gradient(135deg,rgba(44,125,247,.11),rgba(99,247,177,.06))", border: "1px solid rgba(99,247,177,.22)", borderRadius: "9px", padding: "clamp(1rem,4vw,2rem)" }}><div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}><Mail size={22} style={{ color: "#63f7b1" }} /><h2 id="advertising-enquiry-heading" style={{ color: "#fff", margin: 0, fontSize: "1.35rem" }}>Discuss a campaign</h2></div><p style={{ color: "rgba(255,255,255,.59)", fontSize: ".84rem", lineHeight: 1.6, margin: ".6rem 0 0" }}>Send the essentials and the advertising team will review the request. No campaign, public listing, or payment is created by this form.</p><AdvertiserEnquiryForm /></section>
    </div>
  </main>;
}

const th = { padding: ".75rem", color: "#b9d3ff", fontSize: ".68rem", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: ".07em" };
const td = { padding: ".85rem .75rem", color: "rgba(255,255,255,.65)", fontSize: ".79rem", lineHeight: 1.55, verticalAlign: "top" };
const tdStrong = { ...td, color: "#fff", fontWeight: 800 };
const tdPrice = { ...td, color: "#63f7b1", fontWeight: 900, whiteSpace: "nowrap" as const };
