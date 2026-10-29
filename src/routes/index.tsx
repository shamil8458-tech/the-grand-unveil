import { createFileRoute } from "@tanstack/react-router";
import WeddingExperience from "@/wedding/WeddingExperience";
import { WEDDING } from "@/wedding/config";

const couple = `${WEDDING.couple.first} & ${WEDDING.couple.second}`;
const description = `${couple} are getting married on ${WEDDING.dateLabel} at ${WEDDING.venue.name}, ${WEDDING.locationLabel}. View the story, event details and RSVP online.`;

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `${couple} — ${WEDDING.dateLabel}` },
      { name: "description", content: description },
      { property: "og:title", content: `${couple} — Wedding Invitation` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingExperience,
});
