// PLACEHOLDER: the email has not been supplied yet; replace it before launch.
// Empty values are hidden on the site.
export const CONTACT = {
  email: "hello@pristinedrops.in",
  phone: "+91 72066 34438",
  location: "Kapoori Road, Zainabad, District Rewari, Haryana 123411",
  socials: [] as { label: string; href: string }[],
};

export const TAGLINE = "Goodness in Every Drop";

export const IMG = {
  splash: { src: "/images/bottle-splash.jpg", w: 685, h: 704, alt: "Pristine Drops bottle in a splash of water against a deep blue background" },
  studio: { src: "/images/bottle-studio.jpg", w: 888, h: 868, alt: "Pristine Drops bottle on a white stone stand beside a glass of water" },
  label: { src: "/images/bottle-label.jpg", w: 320, h: 320, alt: "Close-up of the blue Pristine Drops label with the drop logo" },
  cutout: { src: "/images/bottle-cutout.webp", w: 299, h: 797, alt: "Pristine Drops bottle" },
  duo: { src: "/images/bottles-duo.webp", w: 1000, h: 910, alt: "Pristine Drops packaged drinking water bottles" },
  logo: { src: "/brand/logo-original.png", w: 819, h: 1024, alt: "Pristine Drops logo, white on blue" },
  logoWhite: { src: "/brand/logo-white.png", w: 674, h: 536, alt: "Pristine Drops" },
};

/* Bottle positions are "x, y, height" as fractions of the viewport; -m is the mobile layout. */
export const CHAPTERS: {
  id: string;
  label: string;
  title: [string, string];
  copy: string;
  rows: [string, string][];
  bottle: string;
  bottleM: string;
  flip?: boolean;
}[] = [
  {
    id: "water",
    label: "The water",
    title: ["Pure water.", "Nothing else."],
    copy: "Clean drinking water, packed and sealed with care. No flavours and no frills, just refreshing water for every part of the day.",
    rows: [
      ["Product", "Packaged drinking water"],
      ["Promise", TAGLINE],
    ],
    bottle: "0.72,0.54,0.66",
    bottleM: "0.5,0.3,0.4",
  },
  {
    id: "bottle",
    label: "The bottle",
    title: ["Crystal clear,", "white cap."],
    copy: "A clear bottle and a clean white cap, so you can always see exactly what you are drinking. Simple on purpose.",
    rows: [
      ["Bottle", "Clear, so the water shows"],
      ["Cap", "White"],
    ],
    bottle: "0.28,0.54,0.7",
    bottleM: "0.5,0.3,0.4",
    flip: true,
  },
  {
    id: "label",
    label: "The label",
    title: ["Unmistakably", "Pristine blue."],
    copy: "The blue wrap carries the drop logo, the tagline and four promises: pure water, safe for you, naturally refreshing and premium quality.",
    rows: [
      ["Logo", "White drop and wordmark"],
      ["Colour", "Pristine Blue"],
    ],
    bottle: "0.72,0.53,0.78",
    bottleM: "0.5,0.3,0.42",
  },
];

export const PROMISES: { icon: "drop" | "shield" | "wave" | "seal"; title: string; copy: string }[] = [
  { icon: "drop", title: "Pure water", copy: "Nothing extra and nothing to hide. Clean drinking water that tastes the way water should." },
  { icon: "shield", title: "Safe for you", copy: "Packed and sealed with care, so every bottle reaches you just as it left us." },
  { icon: "wave", title: "Naturally refreshing", copy: "Crisp, clean and light. Made for everyday hydration, wherever the day goes." },
  { icon: "seal", title: "Premium quality", copy: "From the water inside to the label outside, every detail is held to one standard." },
];

export const PRINCIPLES = [
  ["Clean", "Purity is the starting point, not a feature. Everything else is built around it."],
  ["Fresh", "Sealed to keep every sip as fresh as the first, from the moment it is capped."],
  ["Reliable", "The same clean, light taste you can count on, bottle after bottle."],
];

export const FOCUS = [
  ["Freshness", "Water should feel alive. We keep it sealed and protected so it arrives crisp and clean."],
  ["Cleanliness", "Clean water in a clean bottle, handled with care. The basics, done properly."],
  ["Quality", "One standard for every bottle. If it isn’t good enough to carry our name, it doesn’t."],
];

export const PERSONALITY = [
  ["Pure", "Clear in what we make and how we say it."],
  ["Fresh", "Light, crisp and never heavy-handed."],
  ["Calm", "Quiet confidence. No noise, no gimmicks."],
  ["Modern", "Simple, considered design for everyday life."],
  ["Trustworthy", "A promise on every label that we intend to keep."],
];

export const COLOURS = [
  { name: "Pristine Blue", hex: "#007FB4", role: "Primary · from the logo", dark: true },
  { name: "Pure White", hex: "#FFFFFF", role: "Primary · logo and type", dark: false },
  { name: "Deep Water", hex: "#0A1F2B", role: "Supporting · website", dark: true },
  { name: "Mist", hex: "#EDF2F4", role: "Supporting · website", dark: false },
];

export const LOGO_PARTS = [
  ["The drop", "A single water drop forms the heart of the mark."],
  ["The waves", "Two flowing waves move through the base of the drop."],
  ["The wordmark", "PRISTINE in classic serif capitals, part of the logo artwork."],
  ["The descriptor", "DROPS, widely spaced between two fine rules."],
];

export const LABEL_PARTS = [
  ["The mark", "The Pristine Drops logo sits white on blue at the centre of the wrap."],
  ["The tagline", `“${TAGLINE}”, written in a light script beside the logo.`],
  ["The promises", "Pure water, Safe for you, Naturally refreshing and Premium quality, each with its own icon."],
  ["The wave", "A band of moving water runs along the base of the label."],
];

export const TOPICS = ["Distribution", "Bulk orders", "Partnerships", "Press & media", "Other"];

export const FAQS: [string, string][] = [
  [
    "How do I enquire about distribution or bulk orders?",
    "Use the form above, choose the topic that fits and tell us a little about your area and what you need. We will get back to you.",
  ],
  [
    "Is Pristine Drops available near me?",
    "Availability depends on where you are. Send us your location through the form and we will let you know.",
  ],
  ["Which bottle sizes can I order?", "Ask us. Send a message and we will share what is currently available."],
  [
    "Can I use the logo or product images?",
    "Choose Press & media in the form and tell us about your project. We will share the brand files you need, along with how to use them.",
  ],
];

export const ENQUIRIES = [
  ["Distribution", "Interested in stocking or distributing Pristine Drops in your area."],
  ["Bulk orders", "Water for offices, events, venues and hospitality."],
  ["Partnerships", "Collaborations, co-branding and brand projects."],
  ["Press & media", "Brand assets, product images and media enquiries."],
];
