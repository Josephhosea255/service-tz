import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryGrid from "@/components/CategoryGrid";
import ListingCard, { ListingCardData } from "@/components/ListingCard";
import {
  Search, MapPin, Sparkles, BadgeCheck, Star, Users, MessageCircle,
  PlusCircle, ShieldCheck, Phone, Search as SearchIcon, Zap,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t, lang } = useTranslation();
  const [q, setQ] = useState("");
  const [featured, setFeatured] = useState<ListingCardData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = lang === "sw"
      ? "ServiceLink Tanzania — Pata fundi, fundi umeme na mabomba unaoaminika karibu nawe"
      : "ServiceLink Tanzania — Find trusted fundi, electricians & plumbers near you";
    const desc = lang === "sw"
      ? "Ajiri watoa huduma wa Tanzania wanaoaminika kwa dakika chache. Ongea moja kwa moja kupitia WhatsApp na fundi, fundi umeme, mabomba na walimu waliothibitishwa karibu nawe."
      : "Hire trusted Tanzanian service providers in minutes. Chat directly via WhatsApp with verified fundi, electricians, plumbers and tutors near you.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);

    supabase.from("listings")
      .select("id,name,category,description,location,image_url,featured,verified,phone,whatsapp")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setFeatured((data ?? []) as ListingCardData[]));
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    navigate(`/search?${params.toString()}`);
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Tanzanian local service providers" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        </div>
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-2xl space-y-5 text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" /> Tanzania's local services marketplace
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Get the job done. <span className="text-secondary">Hire trusted local pros</span> in minutes.
            </h1>
            <p className="text-base text-primary-foreground/90 md:text-lg">
              From fundi to freelancers — find verified service providers near you and chat instantly on WhatsApp. No middlemen, no fees.
            </p>

            <form onSubmit={onSearch} className="mt-2 flex flex-col gap-2 rounded-2xl bg-background p-2 shadow-elevated sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What service do you need?"
                  className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="hidden items-center gap-1 px-3 text-sm text-muted-foreground sm:flex">
                <MapPin className="h-4 w-4" /> Dar es Salaam
              </div>
              <Button type="submit" variant="hero" size="lg">Search</Button>
            </form>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild variant="secondary" size="lg" className="font-semibold">
                <Link to="/dashboard"><PlusCircle className="mr-2 h-5 w-5" /> Post Your Service — Free</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/search">Browse providers →</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 pt-6 sm:max-w-lg">
              <div className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur">
                <div className="flex items-center gap-1.5 text-secondary"><BadgeCheck className="h-4 w-4" /><span className="text-lg font-bold">100%</span></div>
                <div className="text-xs text-primary-foreground/80">Verified providers</div>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur">
                <div className="flex items-center gap-1.5 text-secondary"><Star className="h-4 w-4 fill-current" /><span className="text-lg font-bold">4.8★</span></div>
                <div className="text-xs text-primary-foreground/80">Average rating</div>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur">
                <div className="flex items-center gap-1.5 text-secondary"><Users className="h-4 w-4" /><span className="text-lg font-bold">2,500+</span></div>
                <div className="text-xs text-primary-foreground/80">Happy customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-10 md:py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Browse by category</h2>
            <p className="text-sm text-muted-foreground">Pick a service to get started</p>
          </div>
        </div>
        <CategoryGrid />
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get help in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: SearchIcon, step: "1", title: "Search & discover", desc: "Browse verified local providers by category and location across Tanzania." },
              { icon: MessageCircle, step: "2", title: "Chat on WhatsApp", desc: "Tap one button to message providers directly. Discuss your job and get a quote fast." },
              { icon: Zap, step: "3", title: "Get the job done", desc: "Hire confidently. After the work, leave a review to help others in your community." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-elevated">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground shadow-soft">
                  {s.step}
                </div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Featured providers</h2>
            <p className="text-sm text-muted-foreground">Top-rated and verified locals</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/search">View all →</Link></Button>
        </div>
        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No providers yet. <Link to="/dashboard" className="text-primary hover:underline">Be the first to list your service.</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* PROVIDER CTA */}
      <section className="container pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 shadow-elevated md:p-12">
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3 text-primary-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-3 w-3" /> For service providers
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">Grow your business with ServiceLink</h2>
              <p className="text-sm text-primary-foreground/90 md:text-base">
                Reach thousands of customers across Tanzania. Listing is free — get WhatsApp leads directly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="lg" className="font-semibold">
                <Link to="/dashboard"><PlusCircle className="mr-2 h-5 w-5" /> Post Your Service</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/auth"><Phone className="mr-2 h-5 w-5" /> Sign up free</Link>
              </Button>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />
        </div>
      </section>
    </div>
  );
}
