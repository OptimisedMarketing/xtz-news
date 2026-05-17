export default function WatchPage() {
  const videos = [
    { id: "dQw4w9WgXcQ", title: "Tezos Explained", channel: "Tezos Foundation" },
    { id: "tezos-video-2", title: "Building on Tezos", channel: "Tezos Dev" },
  ];

  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">Watch</h1>
          <p className="text-sm text-white/40 mt-2">Videos from the Tezos ecosystem</p>
        </div>
      </div>
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div key={v.id} className="news-card overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm">{v.title}</h3>
                <p className="text-xs text-white/40 mt-1">{v.channel}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center p-8 rounded" style={{ background: "var(--section-bg-alt)", border: "1px solid var(--xtz-border)" }}>
          <h2 className="text-xl font-bold text-white mb-3">Submit a Video</h2>
          <p className="text-sm text-white/60 mb-5">Have a Tezos-related video you'd like featured? Get in touch with us.</p>
          <a href="/contact" className="btn-primary">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
