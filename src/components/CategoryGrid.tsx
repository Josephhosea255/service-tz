import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/categories";
import { useTranslation } from "@/lib/i18n";

export default function CategoryGrid() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
      {CATEGORIES.map((c) => {
        const key = `cat.${c.slug}`;
        const tr = t(key);
        const label = tr === key ? c.label : tr;
        return (
          <Link
            key={c.slug}
            to={`/search?category=${c.slug}`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-smooth hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <c.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
