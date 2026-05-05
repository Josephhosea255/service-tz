import { useTranslation, Lang } from "@/lib/i18n";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  const btn = (code: Lang, label: string) => (
    <button
      key={code}
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      aria-label={`Switch to ${label}`}
      className={`px-2 py-1 text-xs font-semibold rounded-md transition-smooth ${
        lang === code
          ? "bg-primary text-primary-foreground shadow-soft"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5" role="group" aria-label="Language">
      <Languages className="ml-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {btn("en", "EN")}
      {btn("sw", "SW")}
    </div>
  );
}
