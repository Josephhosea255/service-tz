import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import { useTranslation } from "@/lib/i18n";

export default function Layout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} ServiceLink Tanzania</div>
          <div className="flex gap-4">
            <Link to="/search" className="hover:text-primary">{t("footer.browse")}</Link>
            <Link to="/dashboard" className="hover:text-primary">{t("footer.list")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
