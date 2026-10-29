import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WEDDING } from "./config";

export interface StoryItem {
  year: string;
  title: string;
  text: string;
}

export interface EventItem {
  icon: string;
  title: string;
  time: string;
  detail: string;
  note: string;
}

export interface WeddingContent {
  first: string;
  second: string;
  /** datetime-local format: 2027-05-15T16:00 */
  dateISO: string;
  venueName: string;
  venueAddress: string;
  mapsQuery: string;
  rsvpNote: string;
  story: StoryItem[];
  events: EventItem[];
}

const STORAGE_KEY = "wedding-content-v1";

export function defaultContent(): WeddingContent {
  return {
    first: WEDDING.couple.first,
    second: WEDDING.couple.second,
    dateISO: "2027-05-15T16:00",
    venueName: WEDDING.venue.name,
    venueAddress: WEDDING.venue.address,
    mapsQuery: WEDDING.venue.mapsQuery,
    rsvpNote: WEDDING.rsvpNote,
    story: WEDDING.story.map((s) => ({ ...s })),
    events: WEDDING.events.map((e) => ({ ...e })),
  };
}

function isValid(c: unknown): c is WeddingContent {
  if (!c || typeof c !== "object") return false;
  const o = c as Record<string, unknown>;
  return (
    typeof o.first === "string" &&
    typeof o.second === "string" &&
    typeof o.dateISO === "string" &&
    Array.isArray(o.story) &&
    Array.isArray(o.events)
  );
}

export function loadContent(): WeddingContent {
  if (typeof window === "undefined") return defaultContent();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValid(parsed)) return { ...defaultContent(), ...parsed };
    }
  } catch {
    // ignore corrupted storage and fall back to defaults
  }
  return defaultContent();
}

export function saveContent(c: WeddingContent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    // storage unavailable — content still applies for this session
  }
}

export function weddingDate(c: WeddingContent): Date {
  const d = new Date(c.dateISO);
  return Number.isNaN(d.getTime()) ? new Date(defaultContent().dateISO) : d;
}

interface ContentStore {
  content: WeddingContent;
  setContent: (c: WeddingContent) => void;
}

const ContentContext = createContext<ContentStore | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<WeddingContent>(() => defaultContent());

  useEffect(() => {
    setContent(loadContent());
  }, []);

  const value = useMemo<ContentStore>(
    () => ({
      content,
      setContent: (c) => {
        setContent(c);
        saveContent(c);
      },
    }),
    [content],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentStore {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
