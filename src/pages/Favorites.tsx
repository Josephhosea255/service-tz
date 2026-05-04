import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ListingCard, { ListingCardData } from "@/components/ListingCard";

export default function Favorites() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<ListingCardData[]>([]);

  useEffect(() => {
    document.title = "Favorites — ServiceLink Tanzania";
    if (!user) return;
    supabase.from("favorites").select("listing:listings(id,name,category,description,location,image_url,featured,verified)")
      .eq("user_id", user.id)
      .then(({ data }) => setItems(((data ?? []).map((d: any) => d.listing).filter(Boolean)) as ListingCardData[]));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Saved providers</h1>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No favorites yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
