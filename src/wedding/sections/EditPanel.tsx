import { Pencil, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  defaultContent,
  useContent,
  type EventItem,
  type StoryItem,
  type WeddingContent,
} from "../content";
import { cn } from "@/lib/utils";

const inputCls =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25";
const labelCls = "block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export default function EditPanel() {
  const { content, setContent } = useContent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<WeddingContent>(content);

  useEffect(() => {
    if (open) setDraft(content);
  }, [open, content]);

  const set = (patch: Partial<WeddingContent>) => setDraft({ ...draft, ...patch });
  const setStory = (i: number, patch: Partial<StoryItem>) =>
    set({ story: draft.story.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const setEvent = (i: number, patch: Partial<EventItem>) =>
    set({ events: draft.events.map((e, j) => (j === i ? { ...e, ...patch } : e)) });

  const save = () => {
    setContent(draft);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Customize site details"
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card/90 text-primary shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-20 left-4 right-4 z-40 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur md:left-auto md:w-[430px]">
          <h3 className="font-serif text-xl font-semibold text-foreground">Customize Details</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Changes are saved to this browser. These are demo details — put in your own!
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                className={inputCls}
                value={draft.first}
                onChange={(e) => set({ first: e.target.value })}
              />
            </Field>
            <Field label="Second name">
              <input
                className={inputCls}
                value={draft.second}
                onChange={(e) => set({ second: e.target.value })}
              />
            </Field>
            <Field label="Wedding date & time" className="col-span-2">
              <input
                type="datetime-local"
                className={inputCls}
                value={draft.dateISO}
                onChange={(e) => set({ dateISO: e.target.value })}
              />
            </Field>
            <Field label="Venue name" className="col-span-2">
              <input
                className={inputCls}
                value={draft.venueName}
                onChange={(e) => set({ venueName: e.target.value })}
              />
            </Field>
            <Field label="Venue address" className="col-span-2">
              <input
                className={inputCls}
                value={draft.venueAddress}
                onChange={(e) => set({ venueAddress: e.target.value })}
              />
            </Field>
            <Field label="Map search (for Google Maps)" className="col-span-2">
              <input
                className={inputCls}
                value={draft.mapsQuery}
                onChange={(e) => set({ mapsQuery: e.target.value })}
              />
            </Field>
            <Field label="RSVP note" className="col-span-2">
              <textarea
                className={cn(inputCls, "min-h-16")}
                value={draft.rsvpNote}
                onChange={(e) => set({ rsvpNote: e.target.value })}
              />
            </Field>
          </div>

          <h4 className="mt-6 font-serif text-lg font-semibold text-foreground">Story milestones</h4>
          {draft.story.map((s, i) => (
            <div key={i} className="mt-3 grid grid-cols-[5rem_1fr] gap-3 rounded-xl border border-border/60 p-3">
              <Field label="Year">
                <input
                  className={inputCls}
                  value={s.year}
                  onChange={(e) => setStory(i, { year: e.target.value })}
                />
              </Field>
              <Field label="Title">
                <input
                  className={inputCls}
                  value={s.title}
                  onChange={(e) => setStory(i, { title: e.target.value })}
                />
              </Field>
              <Field label="Story" className="col-span-2">
                <textarea
                  className={cn(inputCls, "min-h-16")}
                  value={s.text}
                  onChange={(e) => setStory(i, { text: e.target.value })}
                />
              </Field>
            </div>
          ))}

          <h4 className="mt-6 font-serif text-lg font-semibold text-foreground">Events</h4>
          {draft.events.map((e, i) => (
            <div key={i} className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-border/60 p-3">
              <Field label="Title">
                <input
                  className={inputCls}
                  value={e.title}
                  onChange={(e) => setEvent(i, { title: e.target.value })}
                />
              </Field>
              <Field label="Time">
                <input
                  className={inputCls}
                  value={e.time}
                  onChange={(e) => setEvent(i, { time: e.target.value })}
                />
              </Field>
              <Field label="Detail" className="col-span-2">
                <input
                  className={inputCls}
                  value={e.detail}
                  onChange={(e) => setEvent(i, { detail: e.target.value })}
                />
              </Field>
              <Field label="Note" className="col-span-2">
                <input
                  className={inputCls}
                  value={e.note}
                  onChange={(e) => setEvent(i, { note: e.target.value })}
                />
              </Field>
            </div>
          ))}

          <div className="sticky bottom-0 mt-6 flex gap-3 bg-card/95 py-2">
            <button
              type="button"
              onClick={save}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-sm transition-all active:scale-[0.98]"
            >
              Save & Apply
            </button>
            <button
              type="button"
              onClick={() => setDraft(defaultContent())}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-3 text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Demo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
