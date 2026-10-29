import { motion } from "framer-motion";
import { format } from "date-fns";
import { MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
import { ContentProvider, useContent, weddingDate } from "./content";
import { attachPointerTracking } from "./scene/input";
import BackgroundScene from "./scene/BackgroundScene";
import IntroScene from "./scene/IntroScene";
import Hero from "./sections/Hero";
import Story from "./sections/Story";
import Events from "./sections/Events";
import Rsvp from "./sections/Rsvp";
import EditPanel from "./sections/EditPanel";
import { cn } from "@/lib/utils";

export default function WeddingExperience() {
  return (
    <ContentProvider>
      <Experience />
    </ContentProvider>
  );
}

function Experience() {
  const { content } = useContent();
  const [intro, setIntro] = useState<"sealed" | "fading" | "done">("sealed");

  useEffect(() => attachPointerTracking(), []);

  useEffect(() => {
    if (intro !== "fading") return;
    const id = setTimeout(() => setIntro("done"), 1100);
    return () => clearTimeout(id);
  }, [intro]);

  useEffect(() => {
    document.body.style.overflow = intro === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [intro]);

  return (
    <div data-scene-root className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <BackgroundScene />
      </div>

      <main className="relative z-10">
        <Hero />
        <Story />
        <Events />
        <Rsvp />
        <footer className="relative px-6 pb-16 pt-8 text-center">
          <p className="font-script text-4xl text-foreground/90">
            {content.first} &amp; {content.second}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {format(weddingDate(content), "MMMM d, yyyy")} · Forever
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </footer>
      </main>

      <EditPanel />

      {intro !== "done" && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-background transition-opacity duration-1000",
            intro === "fading" && "pointer-events-none opacity-0",
          )}
        >
          <IntroScene onOpenComplete={() => setIntro("fading")} />
          {intro === "sealed" && (
            <div className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-2 md:bottom-20">
              <motion.p
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="text-xs uppercase tracking-[0.35em] text-foreground/80 md:text-sm"
              >
                Tap to open invitation
              </motion.p>
              <MousePointerClick className="h-5 w-5 animate-bounce text-primary" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
