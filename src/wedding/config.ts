// Wedding content — edit these values to personalize the site.
// These are the built-in demo defaults; the in-app customize panel
// overrides them per browser (persisted locally).
export const WEDDING = {
  rsvpNote: "Kindly respond by April 1, 2027.",

  couple: {
    first: "Alex",
    second: "Sophia",
  },
  date: new Date("2027-05-15T16:00:00-07:00"),
  dateLabel: "Saturday · May 15, 2027",
  locationLabel: "Napa Valley, California",
  venue: {
    name: "Rosewood Estate",
    address: "1200 Vineyard Lane, Napa Valley, CA",
    mapsQuery: "Napa Valley, California",
  },
  story: [
    {
      year: "2019",
      title: "The First Hello",
      text: "A rainy October evening, one shared umbrella outside a coffee shop on 5th Street, and a conversation that neither of them wanted to end.",
    },
    {
      year: "2021",
      title: "Adventures Begin",
      text: "From weekend road trips along the coast to a first apartment with a tiny balcony garden — they built a life out of small, perfect days.",
    },
    {
      year: "2024",
      title: "The Question",
      text: "At sunset on a quiet bluff above the sea, Alex knelt with his grandmother's ring. Sophia said yes before he could finish the sentence.",
    },
    {
      year: "2027",
      title: "Forever Begins",
      text: "Surrounded by the vines and the people they love most, two hearts become one. And the best chapter starts here.",
    },
  ],
  events: [
    {
      icon: "rings",
      title: "The Ceremony",
      time: "4:00 PM",
      detail: "Garden Terrace · Rosewood Estate",
      note: "Seated outdoors under the old oaks. Kindly arrive by 3:30 PM.",
    },
    {
      icon: "glass",
      title: "The Reception",
      time: "6:00 PM",
      detail: "The Vineyard Hall · Dinner & Toasts",
      note: "Cocktail hour on the lawn, followed by dinner and dancing.",
    },
    {
      icon: "moon",
      title: "After Party",
      time: "9:00 PM",
      detail: "The Cellar · Late Night Celebration",
      note: "Live band, midnight snacks and one last dance under the stars.",
    },
  ],
} as const;

export const formatCountdown = (ms: number) => {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};
