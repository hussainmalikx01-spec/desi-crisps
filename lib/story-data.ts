export type ProcessStage = {
  label: string;
  caption: string;
  icon: string;
};

export const CHIPS_PROCESS: ProcessStage[] = [
  { label: "Fresh Potato", caption: "Handpicked daily from trusted farms", icon: "/assets/story/chips-v2/01-fresh-potato.svg" },
  { label: "Washing", caption: "Rinsed clean, nothing hidden", icon: "/assets/story/chips-v2/02-washing.svg" },
  { label: "Peeling", caption: "Skin removed by hand and machine", icon: "/assets/story/chips-v2/03-peeling.svg" },
  { label: "Thin Slicing", caption: "Cut to the perfect crisp thickness", icon: "/assets/story/chips-v2/04-slicing.svg" },
  { label: "Frying", caption: "Golden-fried in small batches", icon: "/assets/story/chips-v2/05-frying.svg" },
  { label: "Seasoning", caption: "Tossed in our signature spice blend", icon: "/assets/story/chips-v2/06-seasoning.svg" },
  { label: "Final Packet", caption: "Sealed fresh, straight to you", icon: "/assets/story/chips-v2/07-final-packet.svg" },
];

export const NIMKO_PROCESS: ProcessStage[] = [
  { label: "Raw Ingredients", caption: "Lentils, gram flour, and nuts", icon: "/assets/story/nimko-v2/01-raw-ingredients.svg" },
  { label: "Dough Preparation", caption: "Mixed to a traditional recipe", icon: "/assets/story/nimko-v2/02-dough-preparation.svg" },
  { label: "Sev Making", caption: "Pressed into fine golden strands", icon: "/assets/story/nimko-v2/03-sev-making.svg" },
  { label: "Frying", caption: "Crisped to perfection", icon: "/assets/story/nimko-v2/04-frying.svg" },
  { label: "Spices & Nuts Mixing", caption: "Roasted nuts folded through", icon: "/assets/story/nimko-v2/05-spices-mixing.svg" },
  { label: "Final Packet", caption: "Sealed fresh, straight to you", icon: "/assets/story/nimko-v2/06-final-packet.svg" },
];
