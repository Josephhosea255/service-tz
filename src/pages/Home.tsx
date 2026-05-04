import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryGrid from "@/components/CategoryGrid";
import ListingCard, { ListingCardData } from "@/components/ListingCard";
import { Search, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";

export default function Home() {
  const [q, setQ] = useState("");
  const [featured, setFeatured] = useState<ListingCardData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ServiceLink Tanzania — Find local fundi, electricians, plumbers & more";
    const desc = "Connect with trusted Tanzanian service providers near you. Fundi, electricians, plumbers, tutors and freelancers in Dar es Salaam and beyond.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);

    supabase.from("listings")
      .select("id,name,category,description,location,image_url,featured,verified")
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Tanzanian local service providers" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/70" />
        </div>
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-2xl space-y-5 text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" /> Trusted local services
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Find skilled fundi, electricians & freelancers near you
            </h1>
            <p className="text-base text-primary-foreground/90 md:text-lg">
              ServiceLink connects you with trusted local service providers across Tanzania. Quick to find, easy to contact via WhatsApp.
            </p>

            <form onSubmit={onSearch} className="mt-2 flex flex-col gap-2 rounded-2xl bg-background p-2 shadow-elevated sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Find services near you…"
                  className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="hidden items-center gap-1 px-3 text-sm text-muted-foreground sm:flex">
                <MapPin className="h-4 w-4" /> Dar es Salaam
              </div>
              <Button type="submit" variant="hero" size="lg">Search</Button>
            </form>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Browse by category</h2>
            <p className="text-sm text-muted-foreground">Pick a service to get started</p>
          </div>
        </div>
        <CategoryGrid />
      </section>

      <section className="container pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">Featured providers</h2>
            <p className="text-sm text-muted-foreground">Top-rated and verified locals</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/search">View all</Link></Button>
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
    </div>
  );
}
