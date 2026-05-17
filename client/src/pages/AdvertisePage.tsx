import { Link } from "wouter";

export default function AdvertisePage() {
  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">Advertise</h1>
          <p className="text-sm text-white/40 mt-2">Reach the Tezos community</p>
        </div>
      </div>
      <div className="container py-10 max-w-3xl">
        <div className="prose prose-invert max-w-none">
          <p className="text-white/70 text-base leading-relaxed mb-6">
            XTZ.News is the leading English-language news source for the Tezos blockchain ecosystem.
            We reach thousands of developers, investors, artists, and enthusiasts every month.
          </p>
          <h2 className="text-xl font-bold text-white mb-4">Advertising Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { title: "Banner Ads", desc: "Prominent display advertising across all pages" },
              { title: "Sponsored Articles", desc: "Long-form sponsored content published as articles" },
              { title: "Newsletter Sponsorship", desc: "Reach our email subscribers directly" },
              { title: "Project Features", desc: "Dedicated project spotlight on our Projects page" },
            ].map((opt) => (
              <div key={opt.title} className="p-5 rounded" style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}>
                <h3 className="font-bold text-white mb-1">{opt.title}</h3>
                <p className="text-sm text-white/50">{opt.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-white/60 mb-6">
            For advertising enquiries, rates, and media kit, please contact us at:
          </p>
          <a href="mailto:info@xtz.news" className="btn-primary inline-flex">
            info@xtz.news
          </a>
        </div>
      </div>
    </div>
  );
}
