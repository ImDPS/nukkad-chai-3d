export type TeaId = "masala" | "ginger" | "lemon";
export type AwningId = "marigold" | "indigo" | "leaf";
export type TimeOfDay = "day" | "night";

export interface Tea {
  id: TeaId;
  label: string;
  blurb: string;
  liquid: string;
  steam: string;
}

export interface Awning {
  id: AwningId;
  label: string;
  primary: string;
  secondary: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface HoursRow {
  days: string;
  times: string;
}

export interface EventItem {
  id: string;
  title: string;
  when: string;
  description: string;
}

export const SITE = {
  name: "Nukkad Chai",
  tagline: "Your corner for a proper cutting chai.",
  disclaimer:
    "Nukkad Chai is a fictional stall. This page is a concept project, not a real business. The hours, prices and events are made up.",
} as const;

export const TEAS: readonly Tea[] = [
  {
    id: "masala",
    label: "Masala chai",
    blurb: "Black tea simmered with cardamom, clove and cinnamon.",
    liquid: "#b5651d",
    steam: "#f5e6d3",
  },
  {
    id: "ginger",
    label: "Adrak chai",
    blurb: "Strong tea with fresh crushed ginger.",
    liquid: "#c98a3b",
    steam: "#fff1d6",
  },
  {
    id: "lemon",
    label: "Lemon tea",
    blurb: "Light black tea with lemon and a pinch of salt.",
    liquid: "#e3b505",
    steam: "#fffbe0",
  },
];

export const AWNINGS: readonly Awning[] = [
  { id: "marigold", label: "Marigold", primary: "#f2a900", secondary: "#c1272d" },
  { id: "indigo", label: "Indigo", primary: "#2b3a8c", secondary: "#f4e9d8" },
  { id: "leaf", label: "Leaf", primary: "#2e7d32", secondary: "#f4e9d8" },
];

export const MENU: readonly MenuItem[] = [
  { id: "masala-chai", name: "Masala chai", description: "Black tea simmered with cardamom, clove and cinnamon.", price: 15 },
  { id: "adrak-chai", name: "Adrak chai", description: "Strong tea with fresh crushed ginger.", price: 15 },
  { id: "kulhad-chai", name: "Kulhad chai", description: "Served in a clay cup that adds an earthy note.", price: 25 },
  { id: "bun-maska", name: "Bun maska", description: "Soft bun and butter, made for dunking.", price: 30 },
  { id: "samosa", name: "Samosa (2 pieces)", description: "Crisp pastry filled with spiced potato and peas.", price: 30 },
  { id: "vada-pav", name: "Vada pav", description: "Spiced potato fritter in a soft bun with dry garlic chutney.", price: 25 },
  { id: "poha", name: "Poha", description: "Flattened rice with onion, peanuts and lemon.", price: 40 },
  { id: "jalebi", name: "Jalebi (100 g)", description: "Crisp spirals soaked in saffron syrup.", price: 40 },
];

export const HOURS: readonly HoursRow[] = [
  { days: "Monday to Saturday", times: "6:00 am to 11:00 am, 4:00 pm to 9:00 pm" },
  { days: "Sunday", times: "7:00 am to 12:00 pm, 4:00 pm to 8:00 pm" },
];

export const LOCATION = {
  lines: ["The corner of Imaginary Lane", "Make-Believe Nagar"],
  note: "A made-up address. Nukkad means street corner.",
} as const;

export const EVENTS: readonly EventItem[] = [
  {
    id: "sunday-chai-music",
    title: "Sunday chai and music",
    when: "Every Sunday, 5:00 pm",
    description: "An open-mic hour of old film songs and new ones, with chai for everyone.",
  },
  {
    id: "chai-poetry",
    title: "Cutting chai and poetry",
    when: "First Friday of the month, 7:00 pm",
    description: "Short readings in Hindi, Urdu and English.",
  },
  {
    id: "monsoon-pakora",
    title: "Monsoon pakora evenings",
    when: "On rainy days, from 4:00 pm",
    description: "Hot pakoras and extra-strong tea when it rains. Bring an umbrella.",
  },
];
