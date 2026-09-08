import React, { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(3, 8, 20, 0.72)",
  color: "#fff",
  font: "inherit",
  fontSize: "0.86rem",
  padding: "0.7rem 0.78rem",
};

type ArtSubmissionFormState = {
  submitterName: string;
  submitterEmail: string;
  submitterType: "artist" | "gallery" | "collective" | "other";
  projectName: string;
  projectType: "exhibition" | "marketplace" | "creator_tool" | "other";
  websiteUrl: string;
  description: string;
  agreedToReview: boolean;
};

const initialForm: ArtSubmissionFormState = {
  submitterName: "",
  submitterEmail: "",
  submitterType: "artist",
  projectName: "",
  projectType: "exhibition",
  websiteUrl: "",
  description: "",
  agreedToReview: false,
};

export const ART_PROJECT_SUBMISSION_COPY = {
  reviewNote: "Every submission is reviewed by the XTZ.News editorial team. Submission does not guarantee a listing or coverage, and nothing is published automatically.",
  consent: "I confirm that the information is accurate and that I may submit it for editorial review.",
};

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} style={{ display: "block", marginBottom: "0.38rem", color: "rgba(255,255,255,0.72)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</label>;
}

export default function ArtOnTezosSubmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("");
  const submit = trpc.artProjectSubmissions.create.useMutation({
    onSuccess: () => {
      setFeedback("Thank you. Your project has been sent for editorial review.");
      setForm(initialForm);
    },
    onError: () => setFeedback("We could not send your submission just now. Please try again later or contact hello@xtz.news."),
  });

  const update = <K extends keyof ArtSubmissionFormState>(key: K, value: ArtSubmissionFormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    if (!form.agreedToReview) {
      setFeedback("Please confirm the submission statement before sending your project.");
      return;
    }
    submit.mutate({ ...form, agreedToReview: true });
  };

  return (
    <form onSubmit={handleSubmit} aria-describedby="art-submission-review-note" style={{ padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(249,168,212,0.28)", background: "rgba(8, 12, 31, 0.86)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.9rem" }}>
        <div><Label htmlFor="art-submitter-name">Your name</Label><input id="art-submitter-name" name="submitterName" value={form.submitterName} onChange={(event) => update("submitterName", event.target.value)} required minLength={2} maxLength={255} style={fieldStyle} autoComplete="name" /></div>
        <div><Label htmlFor="art-submitter-email">Email</Label><input id="art-submitter-email" name="submitterEmail" type="email" value={form.submitterEmail} onChange={(event) => update("submitterEmail", event.target.value)} required maxLength={320} style={fieldStyle} autoComplete="email" /></div>
        <div><Label htmlFor="art-submitter-type">I am submitting as</Label><select id="art-submitter-type" name="submitterType" value={form.submitterType} onChange={(event) => update("submitterType", event.target.value as typeof form.submitterType)} style={fieldStyle}><option value="artist">Artist</option><option value="gallery">Gallery</option><option value="collective">Collective</option><option value="other">Other</option></select></div>
        <div><Label htmlFor="art-project-type">Collection group</Label><select id="art-project-type" name="projectType" value={form.projectType} onChange={(event) => update("projectType", event.target.value as typeof form.projectType)} style={fieldStyle}><option value="exhibition">Exhibition</option><option value="marketplace">Marketplace</option><option value="creator_tool">Creator tool</option><option value="other">Other art project</option></select></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.7fr) minmax(0, 1.3fr)", gap: "0.9rem", marginTop: "0.9rem" }} className="art-submission-project-row">
        <div><Label htmlFor="art-project-name">Project name</Label><input id="art-project-name" name="projectName" value={form.projectName} onChange={(event) => update("projectName", event.target.value)} required minLength={2} maxLength={500} style={fieldStyle} /></div>
        <div><Label htmlFor="art-project-url">Project website</Label><input id="art-project-url" name="websiteUrl" type="url" value={form.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} required maxLength={2000} placeholder="https://" style={fieldStyle} /></div>
      </div>
      <div style={{ marginTop: "0.9rem" }}><Label htmlFor="art-project-description">What should readers know?</Label><textarea id="art-project-description" name="description" value={form.description} onChange={(event) => update("description", event.target.value)} required minLength={40} maxLength={1600} rows={4} placeholder="Share a concise description, the Tezos connection, and a useful official link." style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.55 }} /><p style={{ margin: "0.35rem 0 0", color: "rgba(255,255,255,0.44)", fontSize: "0.68rem" }}>{form.description.length}/1600 characters · minimum 40</p></div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginTop: "1rem", color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", lineHeight: 1.5, cursor: "pointer" }}><input type="checkbox" name="agreedToReview" checked={form.agreedToReview} onChange={(event) => update("agreedToReview", event.target.checked)} style={{ marginTop: "0.15rem", width: "16px", height: "16px", accentColor: "#f9a8d4" }} />{ART_PROJECT_SUBMISSION_COPY.consent}</label>
      <p id="art-submission-review-note" style={{ margin: "0.85rem 0", color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", lineHeight: 1.5 }}>{ART_PROJECT_SUBMISSION_COPY.reviewNote}</p>
      {feedback && <p role="status" style={{ display: "flex", alignItems: "center", gap: "0.45rem", margin: "0 0 0.85rem", color: feedback.startsWith("Thank") ? "#86efac" : "#fca5a5", fontSize: "0.78rem", fontWeight: 700 }}><CheckCircle2 size={15} aria-hidden="true" />{feedback}</p>}
      <button type="submit" disabled={submit.isPending} style={{ display: "inline-flex", minHeight: "42px", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: 0, borderRadius: "6px", padding: "0.72rem 1rem", color: "#201126", background: submit.isPending ? "rgba(249,168,212,0.55)" : "#f9a8d4", fontSize: "0.78rem", fontWeight: 900, cursor: submit.isPending ? "wait" : "pointer" }}>{submit.isPending ? <><Loader2 size={15} aria-hidden="true" className="animate-spin" /> Sending</> : <><Send size={15} aria-hidden="true" /> Send for editorial review</>}</button>
      <style>{`@media (max-width: 560px) { .art-submission-project-row { grid-template-columns: 1fr !important; } }`}</style>
    </form>
  );
}
