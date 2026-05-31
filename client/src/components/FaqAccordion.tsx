import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  title?: string;
}

export default function FaqAccordion({ faqs, title = "Frequently Asked Questions" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container" style={{ padding: "3rem 1.25rem 4rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#2c7df7" }}>?</span> {title}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "#05152e",
                border: `1px solid ${openIndex === i ? "rgba(44,125,247,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "0.92rem", fontWeight: 700, color: openIndex === i ? "#2c7df7" : "#fff", lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: openIndex === i ? "#2c7df7" : "rgba(255,255,255,0.4)",
                    flexShrink: 0,
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {openIndex === i && (
                <div style={{ padding: "0 1.25rem 1rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
