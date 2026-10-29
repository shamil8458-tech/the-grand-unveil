import { motion } from "framer-motion";
import { useContent } from "../content";
import { cn } from "@/lib/utils";

export default function Story() {
  const { content } = useContent();

  return (
    <section id="story" className="relative px-6 py-24 md:py-32">
      <div className="mb-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Our Story</p>
        <h2 className="mt-3 font-script text-5xl text-foreground md:text-6xl">How it all began</h2>
        <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent md:left-1/2" />

        {content.story.map((item, i) => (
          <motion.div
            key={`${item.year}-${i}`}
            initial={{ opacity: 0, y: 48, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={cn(
              "relative mb-10 pl-12 md:mb-14 md:w-1/2 md:pl-0",
              i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12",
            )}
          >
            <span
              className={cn(
                "absolute top-7 h-3 w-3 rounded-full border-2 border-primary bg-background shadow-sm md:left-auto",
                i % 2 === 0 ? "left-2.5 md:-right-1.5" : "left-2.5 md:-left-1.5",
              )}
            />
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md md:p-7">
              <p className="font-script text-3xl text-primary">{item.year}</p>
              <h3 className="mt-1 font-serif text-xl font-semibold text-foreground md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
