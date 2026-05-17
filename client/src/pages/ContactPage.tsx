import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">Contact</h1>
          <p className="text-sm text-white/40 mt-2">Get in touch with the XTZ.News team</p>
        </div>
      </div>
      <div className="container py-10">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-8 p-4 rounded" style={{ background: "var(--card-bg)" }}>
            <Mail size={20} className="text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Email us directly</p>
              <a href="mailto:info@xtz.news" className="text-sm text-blue-400 hover:underline">info@xtz.news</a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Subject</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="form-input" placeholder="What's this about?" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Message *</label>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="form-input resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
              <Send size={14} /> {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
