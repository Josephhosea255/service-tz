import { Wrench, Zap, Droplet, GraduationCap, Laptop, Paintbrush, Hammer, Scissors, Car, Sparkles } from "lucide-react";

export const CATEGORIES = [
  { slug: "fundi", label: "Fundi", icon: Hammer },
  { slug: "electrician", label: "Electrician", icon: Zap },
  { slug: "plumber", label: "Plumber", icon: Droplet },
  { slug: "tutor", label: "Tutor", icon: GraduationCap },
  { slug: "freelancer", label: "Freelancer", icon: Laptop },
  { slug: "painter", label: "Painter", icon: Paintbrush },
  { slug: "mechanic", label: "Mechanic", icon: Car },
  { slug: "tailor", label: "Tailor", icon: Scissors },
  { slug: "cleaner", label: "Cleaner", icon: Sparkles },
  { slug: "other", label: "Other", icon: Wrench },
] as const;

export const LOCATIONS = [
  "Dar es Salaam",
  "Kinondoni",
  "Ilala",
  "Temeke",
  "Ubungo",
  "Kigamboni",
  "Arusha",
  "Mwanza",
  "Dodoma",
  "Other",
] as const;

export function categoryLabel(slug: string, t?: (k: string) => string) {
  if (t) {
    const key = `cat.${slug}`;
    const tr = t(key);
    if (tr && tr !== key) return tr;
  }
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
