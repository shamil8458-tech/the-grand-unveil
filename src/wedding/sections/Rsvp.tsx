import { motion } from "framer-motion";
import { Heart, PartyPopper } from "lucide-react";
import { useState } from "react";
import { bus } from "../scene/bus";
import { useContent } from "../content";
import { cn } from "@/lib/utils";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25";
const labelCls = "block text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground";

type Attendance = "joyfully" | "regretfully";

interface RsvpValues {
  name: string;
  attendance: Attendance;
  guests: number;
  dietary: string;
}

export default function Rsvp() {
  const { content } = useContent();
  const [values, setValues] = useState<RsvpValues>({
    name: "",
    attendance: "joyfully",
    guests: 1,
    dietary: "",
  });
  const [submitted, setSubmitted] = useState<RsvpValues | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.name.trim().length < 2) return;
    setSubmitted(values);
    bus.burst();
  };

  return (
    <section id="rsvp" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
            Réservez s'il vous plaît
          </p>
          <h2 className="mt-3 font-script text-5xl text-foreground md:text-6xl">Will you join us?</h2>
          <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">{content.rsvpNote}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-xl rounded-3xl border border-border bg-card/85 p-7 shadow-lg backdrop-blur-sm md:p-10"
        >
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
                {submitted.attendance === "joyfully" ? (
                  <PartyPopper className="h-7 w-7" />
                ) : (
                  <Heart className="h-7 w-7" />
                )}
              </div>
              <h3 className="mt-5 font-script text-4xl text-foreground">
                {submitted.attendance === "joyfully"
                  ? "We can't wait!"
                  : "You'll be missed"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {submitted.attendance === "joyfully"
                  ? `Thank you, ${submitted.name.trim()} — your seat${submitted.guests > 1 ? `s (${submitted.guests})` : ""} are saved under the old oaks.`
                  : `Thank you for letting us know, ${submitted.name.trim()}. We'll be thinking of you on the day.`}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(null)}
                className="mt-7 rounded-full border border-primary/40 px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-primary transition-colors hover:bg-accent"
              >
                Send another reply
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className={labelCls} htmlFor="rsvp-name">
                  Your name
                </label>
                <input
                  id="rsvp-name"
                  className={inputCls}
                  placeholder="Full name"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                  required
                  minLength={2}
                />
              </div>

              <div>
                <span className={labelCls}>Attendance</span>
                <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["joyfully", "Joyfully accepting"],
                      ["regretfully", "Regretfully declining"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm transition-all",
                        values.attendance === key
                          ? "border-primary bg-accent/60 text-foreground"
                          : "border-input bg-background text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={key}
                        checked={values.attendance === key}
                        onChange={() => setValues({ ...values, attendance: key })}
                        className="h-4 w-4 accent-[var(--primary)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="rsvp-guests">
                    Guests
                  </label>
                  <select
                    id="rsvp-guests"
                    className={inputCls}
                    value={values.guests}
                    onChange={(e) => setValues({ ...values, guests: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="rsvp-dietary">
                    Dietary needs
                  </label>
                  <input
                    id="rsvp-dietary"
                    className={inputCls}
                    placeholder="Optional"
                    value={values.dietary}
                    onChange={(e) => setValues({ ...values, dietary: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
              >
                Send RSVP
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
