import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          to={`/search?category=${c.slug}`}
          className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-smooth hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
            <c.icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-foreground">{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
