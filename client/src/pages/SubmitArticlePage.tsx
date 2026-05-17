import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, FileText, Image } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

async function uploadFile(file: File, folder: string): Promise<{ url: string; key: string }> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      "X-Filename": file.name,
      "X-Folder": folder,
    },
    body: file,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

interface FileUploadProps {
  label: string;
  accept: string;
  icon: React.ReactNode;
  onChange: (result: { url: string; key: string } | null) => void;
  hint?: string;
}

function FileUploadField({ label, accept, icon, onChange, hint }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const folder = accept.includes("pdf") || accept.includes("doc") ? "article-files" : "article-images";
      const result = await uploadFile(file, folder);
      setUploaded(file.name);
      onChange(result);
    } catch {
      setError("Upload failed. Please try again.");
      onChange(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-3 p-4 rounded border-2 border-dashed cursor-pointer transition-all ${
          uploaded ? "border-green-500/50 bg-green-500/5" : "border-white/15 hover:border-blue-500/50 hover:bg-blue-500/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="text-blue-400 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          {uploading ? (
            <p className="text-sm text-white/60">Uploading...</p>
          ) : uploaded ? (
            <p className="text-sm text-green-400 flex items-center gap-1.5">
              <CheckCircle size={13} /> {uploaded}
            </p>
          ) : (
            <p className="text-sm text-white/40">Click to upload {hint || ""}</p>
          )}
        </div>
        {!uploaded && <Upload size={14} className="text-white/30 shrink-0" />}
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>
      )}
    </div>
  );
}

export default function SubmitArticlePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    articleTitle: "",
    agreedToTerms: false,
  });
  const [articleFile, setArticleFile] = useState<{ url: string; key: string } | null>(null);
  const [bannerImage, setBannerImage] = useState<{ url: string; key: string } | null>(null);
  const [image2, setImage2] = useState<{ url: string; key: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.submissions.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Article submitted successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Submission failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreedToTerms) {
      toast.error("Please agree to the privacy policy and terms.");
      return;
    }
    submitMutation.mutate({
      ...form,
      articleFileUrl: articleFile?.url,
      articleFileKey: articleFile?.key,
      bannerImageUrl: bannerImage?.url,
      bannerImageKey: bannerImage?.key,
      image2Url: image2?.url,
      image2Key: image2?.key,
    });
  };

  if (submitted) {
    return (
      <div className="container py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(44,125,247,0.15)" }}>
          <CheckCircle size={32} className="text-blue-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-3">Article Submitted!</h1>
        <p className="text-white/60 mb-6">
          Thank you for your submission. Our editorial team will review your article and get back to you.
        </p>
        <a href="/" className="btn-primary">Back to Home</a>
      </div>
    );
  }

  return (
    <div>
      <div className="py-12 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container">
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">Submit Article</h1>
          <p className="text-sm text-white/40 mt-2">Share your Tezos story with our community</p>
        </div>
      </div>

      <div className="container py-10">
        <div className="max-w-2xl mx-auto">
          {/* Guidelines */}
          <div className="p-5 rounded mb-8" style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}>
            <h2 className="font-bold text-white mb-2">Submission Guidelines</h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Complete the submission form below, including your name, contact information, and article title.
              Submit your article as a Word document (.docx) or PDF file. If you encounter any issues,
              please contact us at <a href="mailto:info@xtz.news" className="text-blue-400 hover:underline">info@xtz.news</a>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">First Name *</label>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="form-input"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Last Name</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="form-input"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                placeholder="your@email.com"
              />
            </div>

            {/* Article title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Article Title</label>
              <input
                value={form.articleTitle}
                onChange={(e) => setForm({ ...form, articleTitle: e.target.value })}
                className="form-input"
                placeholder="Title of your article"
              />
            </div>

            {/* Banner image */}
            <FileUploadField
              label="Banner Image"
              accept="image/*"
              icon={<Image size={18} />}
              onChange={setBannerImage}
              hint="JPG, PNG, WebP (recommended: 1344×896px)"
            />

            {/* Additional image */}
            <FileUploadField
              label="Additional Image (optional)"
              accept="image/*"
              icon={<Image size={18} />}
              onChange={setImage2}
              hint="Optional additional image"
            />

            {/* Article file */}
            <FileUploadField
              label="Article File * (Word or PDF)"
              accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              icon={<FileText size={18} />}
              onChange={setArticleFile}
              hint=".docx or .pdf"
            />

            {/* Terms agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={form.agreedToTerms}
                onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-white/60 leading-relaxed">
                I agree to the{" "}
                <a href="/privacy-policy" className="text-blue-400 hover:underline">privacy policy</a>{" "}
                and{" "}
                <a href="/terms-and-conditions" className="text-blue-400 hover:underline">T&amp;C's</a>{" "}
                outlined by XTZ.news. By uploading an article, I accept all copyright terms and confirm
                that the information is true and accurate to the best of my knowledge.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="btn-primary w-full justify-center"
            >
              {submitMutation.isPending ? "Submitting..." : "SUBMIT FORM"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
