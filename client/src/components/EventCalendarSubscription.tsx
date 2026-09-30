import React from "react";
import { CalendarPlus, ExternalLink, Rss } from "lucide-react";

export default function EventCalendarSubscription() {
  const feedUrl = "https://xtz.news/events.ics";
  const subscriptionUrl = "webcal://xtz.news/events.ics";

  return (
    <aside aria-labelledby="calendar-subscription-title" className="rounded-xl border border-sky-300/25 bg-sky-300/[0.06] p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-300/15 text-sky-200"><Rss size={18} /></div>
          <div>
            <p className="m-0 text-[0.63rem] font-black uppercase tracking-[0.14em] text-sky-200">Stay in sync</p>
            <h2 id="calendar-subscription-title" className="mt-1 text-base font-black text-white">Subscribe to upcoming Tezos events</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/65">Add the XTZ.News calendar to a personal calendar. It refreshes with future events once they have passed editorial review.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={subscriptionUrl} className="inline-flex min-h-10 items-center gap-2 rounded bg-sky-300 px-3 text-sm font-black text-[#061428] transition-transform duration-150 hover:bg-sky-200 active:scale-[0.97]"><CalendarPlus size={16} /> Subscribe</a>
          <a href={feedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded border border-white/20 px-3 text-sm font-bold text-white/80 hover:bg-white/5"><ExternalLink size={15} /> Open .ics feed</a>
        </div>
      </div>
    </aside>
  );
}
