import { motion } from "framer-motion";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatCountdown } from "../config";
import { useContent, weddingDate } from "../content";

function Countdown({ target }: { target: Date }) {
  const [parts, setParts] = useState(() => formatCountdown(target.getTime() - Date.now()));

  useEffect(() => {
    const tick = () => setParts(formatCountdown(target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    [parts.days, "Days"],
    [parts.hours, "Hours"],
    [parts.minutes, "Minutes"],
    [parts.seconds, "Seconds"],
  ] as const;

  return (
    <div className="mt-10 grid max-w-lg grid-cols-4 gap-2.5 md:gap-5">
      {cells.map(([value, label]) => (
        <div
          key={label}
          className="rounded-2xl border border-primary/25 bg-card/70 px-2 py-4 shadow-sm backdrop-blur-sm md:py-5"
        >
          <div className="font-serif text-3xl tabular-nums text-foreground md:text-5xl">
            {String(value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { content } = useContent();
  const target = useMemo(() => weddingDate(content), [content]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground md:text-xs"
      >
        Together with their families
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.35 }}
        className="mt-5 font-script text-6xl leading-tight text-foreground sm:text-7xl md:text-9xl"
      >
        {content.first}{" "}
        <span className="text-primary">&amp;</span> {content.second}
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        className="mt-6 h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent md:w-56"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.95 }}
        className="mt-6 font-serif text-xl text-foreground/90 md:text-2xl"
      >
        {format(target, "EEEE · MMMM d, yyyy")}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground"
      >
        {content.venueName}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.25 }}
      >
        <Countdown target={target} />
      </motion.div>

      <motion.a
        href="#story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll to our story"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Our Story</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </motion.a>
    </section>
  );
}
