import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ListingCard, { ListingCardData } from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, LOCATIONS } from "@/lib/categories";
import { Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SearchPage() {
  const { t, lang } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [location, setLocation] = useState(params.get("location") ?? "all");
  const [results, setResults] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = (lang === "sw" ? "Vinjari huduma" : "Browse services") + " — ServiceLink Tanzania";
  }, [lang]);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from("listings")
      .select("id,name,category,description,location,image_url,featured,verified")
      .eq("status", "approved")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (category !== "all") query = query.eq("category", category);
    if (location !== "all") query = query.eq("location", location);
    if (q.trim()) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);

    query.limit(60).then(({ data }) => {
      setResults((data ?? []) as ListingCardData[]);
      setLoading(false);
    });
  }, [params]);

  function applyFilters(e?: React.FormEvent) {
    e?.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (category !== "all") p.set("category", category);
    if (location !== "all") p.set("location", location);
    setParams(p);
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Browse providers</h1>

      <form onSubmit={applyFilters} className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:grid-cols-[1fr_180px_180px_auto]">
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or description" className="border-0 shadow-none focus-visible:ring-0" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button type="submit">Apply</Button>
      </form>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading…</div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No providers match your filters yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
