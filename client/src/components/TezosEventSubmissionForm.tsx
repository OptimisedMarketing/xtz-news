import { useState, type CSSProperties, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

export const EVENT_TYPE_OPTIONS = [
  { value: "community", label: "Community gathering" },
  { value: "conference", label: "Conference" },
  { value: "meetup", label: "Meetup" },
  { value: "workshop", label: "Workshop" },
  { value: "exhibition", label: "Exhibition" },
  { value: "online", label: "Online event" },
  { value: "other", label: "Other" },
] as const;

type EventType = (typeof EVENT_TYPE_OPTIONS)[number]["value"];
type EventSubmissionFormState = {
  submitterName: string;
  submitterEmail: string;
  eventTitle: string;
  eventType: EventType;
  sourceUrl: string;
  startAt: string;
  endAt: string;
  location: string;
  timezone: string;
  description: string;
  agreedToReview: boolean;
};

const initialForm: EventSubmissionFormState = {
  submitterName: "", submitterEmail: "", eventTitle: "", eventType: "community", sourceUrl: "", startAt: "", endAt: "", location: "", timezone: "", description: "", agreedToReview: false,
};

const fieldStyle: CSSProperties = {
  width: "100%", boxSizing: "border-box", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(3, 8, 20, 0.72)", color: "#fff", font: "inherit", fontSize: "0.86rem", padding: "0.7rem 0.78rem",
};

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} style={{ display: "block", marginBottom: "0.38rem", color: "rgba(255,255,255,0.72)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>{children}</label>;
}

export const TEZOS_EVENT_SUBMISSION_COPY = {
  reviewNote: "Every event submission is reviewed by the XTZ.News editorial team. Submission does not guarantee inclusion, and nothing is published automatically.",
  consent: "I confirm that the details are accurate and that I may submit this event for editorial review.",
};

export default function TezosEventSubmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("");
  const submit = trpc.tezosEventCandidates.create.useMutation({
    onSuccess: () => { setFeedback("Thank you. Your event has been sent for editorial review."); setForm(initialForm); },
    onError: (error) => setFeedback(error.message || "We could not send your event just now. Please try again later."),
  });
  const update = <K extends keyof EventSubmissionFormState>(key: K, value: EventSubmissionFormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const toIso = (value: string) => value ? new Date(value).toISOString() : undefined;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    if (!form.agreedToReview) { setFeedback("Please confirm the review statement before sending your event."); return; }
    const startAt = toIso(form.startAt);
    const endAt = toIso(form.endAt);
    if (!startAt || (endAt && new Date(endAt).getTime() < new Date(startAt).getTime())) { setFeedback("Please provide a valid start time and an end time that follows it."); return; }
    submit.mutate({ submitterName: form.submitterName, submitterEmail: form.submitterEmail, eventTitle: form.eventTitle, eventType: form.eventType, sourceUrl: form.sourceUrl, startAt, ...(endAt ? { endAt } : {}), location: form.location, ...(form.timezone.trim() ? { timezone: form.timezone.trim() } : {}), description: form.description, agreedToReview: true });
  };
  return <form onSubmit={handleSubmit} aria-describedby="event-submission-review-note" className="rounded-xl border border-amber-300/25 bg-[#07101f] p-5">
    <div className="grid gap-3 sm:grid-cols-2"><div><Label htmlFor="event-submitter-name">Your name</Label><input id="event-submitter-name" value={form.submitterName} onChange={(event) => update("submitterName", event.target.value)} minLength={2} maxLength={255} required autoComplete="name" style={fieldStyle} /></div><div><Label htmlFor="event-submitter-email">Email</Label><input id="event-submitter-email" type="email" value={form.submitterEmail} onChange={(event) => update("submitterEmail", event.target.value)} maxLength={320} required autoComplete="email" style={fieldStyle} /></div></div>
    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px]"><div><Label htmlFor="event-submission-title">Event title</Label><input id="event-submission-title" value={form.eventTitle} onChange={(event) => update("eventTitle", event.target.value)} minLength={2} maxLength={500} required style={fieldStyle} /></div><div><Label htmlFor="event-submission-type">Event type</Label><select id="event-submission-type" value={form.eventType} onChange={(event) => update("eventType", event.target.value as EventType)} style={fieldStyle}>{EVENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div>
    <div className="mt-3"><Label htmlFor="event-submission-source">Official event link</Label><input id="event-submission-source" type="url" value={form.sourceUrl} onChange={(event) => update("sourceUrl", event.target.value)} placeholder="https://" maxLength={2000} required style={fieldStyle} /><p className="mt-1 text-xs text-white/45">Use an organiser, venue, or official community listing where available.</p></div>
    <div className="mt-3 grid gap-3 sm:grid-cols-2"><div><Label htmlFor="event-submission-start">Starts</Label><input id="event-submission-start" type="datetime-local" value={form.startAt} onChange={(event) => update("startAt", event.target.value)} required style={fieldStyle} /></div><div><Label htmlFor="event-submission-end">Ends <span className="normal-case">(optional)</span></Label><input id="event-submission-end" type="datetime-local" value={form.endAt} onChange={(event) => update("endAt", event.target.value)} style={fieldStyle} /></div></div>
    <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px]"><div><Label htmlFor="event-submission-location">Location</Label><input id="event-submission-location" value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="City, country or Online" minLength={2} maxLength={500} required style={fieldStyle} /></div><div><Label htmlFor="event-submission-timezone">Time zone <span className="normal-case">(optional)</span></Label><input id="event-submission-timezone" value={form.timezone} onChange={(event) => update("timezone", event.target.value)} placeholder="Europe/London" maxLength={64} style={fieldStyle} /></div></div>
    <div className="mt-3"><Label htmlFor="event-submission-description">Event description</Label><textarea id="event-submission-description" value={form.description} onChange={(event) => update("description", event.target.value)} minLength={40} maxLength={1600} rows={4} required placeholder="Explain the Tezos connection, intended audience, and the useful details readers should know." style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.55 }} /><p className="mt-1 text-xs text-white/45">{form.description.length}/1600 characters · minimum 40</p></div>
    <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-white/70"><input type="checkbox" checked={form.agreedToReview} onChange={(event) => update("agreedToReview", event.target.checked)} className="mt-0.5 h-4 w-4 accent-amber-300" />{TEZOS_EVENT_SUBMISSION_COPY.consent}</label>
    <p id="event-submission-review-note" className="mt-3 text-xs leading-5 text-white/50">{TEZOS_EVENT_SUBMISSION_COPY.reviewNote}</p>
    {feedback && <p role="status" className={`mt-3 flex items-center gap-2 text-sm font-bold ${feedback.startsWith("Thank") ? "text-emerald-300" : "text-rose-200"}`}><CheckCircle2 size={16} aria-hidden="true" />{feedback}</p>}
    <button type="submit" disabled={submit.isPending} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded bg-amber-300 px-4 text-sm font-black text-[#1d1603] hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60">{submit.isPending ? <><Loader2 className="animate-spin" size={16} /> Sending</> : <><Send size={16} /> Send for editorial review</>}</button>
  </form>;
}
