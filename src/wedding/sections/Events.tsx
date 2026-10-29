import { motion } from "framer-motion";
import { Gem, MapPin, MoonStar, Wine, type LucideIcon } from "lucide-react";
import { useContent } from "../content";

const ICONS: Record<string, LucideIcon> = {
  rings: Gem,
  glass: Wine,
  moon: MoonStar,
};

export default function Events() {
  const { content } = useContent();

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    content.mapsQuery,
  )}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    content.mapsQuery,
  )}&output=embed`;

  return (
    <section id="events" className="relative px-6 py-24 md:py-32">
      <div className="mb-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">The Big Day</p>
        <h2 className="mt-3 font-script text-5xl text-foreground md:text-6xl">
          Event Details
        </h2>
        <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {content.events.map((event, i) => {
          const Icon = ICONS[event.icon] ?? Gem;
          return (
            <motion.div
              key={`${event.title}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              className="group rounded-3xl border border-border bg-card/80 p-7 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-accent/50 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground">
                {event.title}
              </h3>
              <p className="mt-2 font-script text-3xl text-primary">{event.time}</p>
              <p className="mt-3 text-sm text-foreground/80">{event.detail}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{event.note}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto mt-10 grid max-w-5xl gap-6 overflow-hidden rounded-3xl border border-border bg-card/80 shadow-sm backdrop-blur-sm md:grid-cols-2"
      >
        <div className="flex flex-col justify-center p-8">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            <span className="text-[11px] uppercase tracking-[0.3em]">The Venue</span>
          </div>
          <h3 className="mt-4 font-serif text-3xl font-semibold text-foreground">
            {content.venueName}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {content.venueAddress}
          </p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <MapPin className="h-4 w-4" />
            Get Directions
          </a>
        </div>
        <iframe
          title="Wedding venue map"
          src={embedUrl}
          className="h-72 w-full border-0 md:h-full md:min-h-[360px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </motion.div>
    </section>
  );
}
