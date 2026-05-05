import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, BadgeCheck, Sparkles, Star, Heart, ArrowLeft, MessageCircle } from "lucide-react";
import { categoryLabel } from "@/lib/categories";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

interface Listing {
  id: string; name: string; category: string; description: string;
  phone: string; whatsapp: string | null; location: string;
  image_url: string | null; featured: boolean; verified: boolean;
}
interface Review { id: string; rating: number; comment: string | null; user_id: string; created_at: string; }

export default function ProviderProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => { if (id) load(); }, [id, user]);

  async function load() {
    const { data: l } = await supabase.from("listings").select("*").eq("id", id!).maybeSingle();
    setListing(l as Listing | null);
    if (l) document.title = `${l.name} — ServiceLink Tanzania`;
    const { data: r } = await supabase.from("reviews").select("*").eq("listing_id", id!).order("created_at", { ascending: false });
    setReviews((r ?? []) as Review[]);
    if (user) {
      const { data: f } = await supabase.from("favorites").select("id").eq("listing_id", id!).eq("user_id", user.id).maybeSingle();
      setIsFav(!!f);
    } else setIsFav(false);
  }

  async function toggleFavorite() {
    if (!user) { toast.error(t("profile.signInFav")); return; }
    if (isFav) {
      await supabase.from("favorites").delete().eq("listing_id", id!).eq("user_id", user.id);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ listing_id: id!, user_id: user.id });
      setIsFav(true);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error(t("profile.signInReview")); return; }
    const { error } = await supabase.from("reviews").upsert(
      { listing_id: id!, user_id: user.id, rating, comment: comment.trim() || null },
      { onConflict: "listing_id,user_id" }
    );
    if (error) toast.error(error.message); else { toast.success(t("profile.reviewSubmitted")); setComment(""); load(); }
  }

  if (!listing) return <div className="container py-16 text-center text-muted-foreground">{t("profile.loading")}</div>;

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const wa = (listing.whatsapp || listing.phone).replace(/[^\d]/g, "");
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(t("card.waMessage", { name: listing.name }))}`;

  return (
    <div className="container max-w-4xl py-6 md:py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/search"><ArrowLeft className="mr-2 h-4 w-4" />{t("profile.back")}</Link></Button>

      <Card className="overflow-hidden bg-gradient-card">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted sm:aspect-[21/9]">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-hero text-6xl font-bold text-primary-foreground">
              {listing.name.slice(0,1).toUpperCase()}
            </div>
          )}
          {listing.featured && <Badge className="absolute left-3 top-3 gap-1 bg-secondary text-secondary-foreground"><Sparkles className="h-3 w-3" /> {t("card.featured")}</Badge>}
        </div>

        <div className="space-y-5 p-5 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">{listing.name}</h1>
                {listing.verified && <BadgeCheck className="h-6 w-6 text-primary" aria-label="Verified" />}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary" className="bg-muted text-muted-foreground">{categoryLabel(listing.category, t)}</Badge>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location}</span>
                {avg != null && <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-secondary text-secondary" />{avg.toFixed(1)} ({reviews.length})</span>}
              </div>
            </div>
            <Button onClick={toggleFavorite} variant={isFav ? "secondary" : "outline"} size="sm">
              <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-current" : ""}`} />{isFav ? t("profile.saved") : t("profile.save")}
            </Button>
          </div>

          <p className="whitespace-pre-line text-foreground">{listing.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="whatsapp" size="lg">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-5 w-5" />{t("profile.requestService")}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${listing.phone}`}><Phone className="mr-2 h-5 w-5" />{listing.phone}</a>
            </Button>
          </div>
        </div>
      </Card>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-foreground">{t("profile.reviews")}</h2>

        {user && (
          <Card className="mb-6 p-5">
            <form onSubmit={submitReview} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("profile.yourRating")}</span>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star className={`h-5 w-5 ${n <= rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t("profile.shareExp")} maxLength={500} rows={3} />
              <Button type="submit" size="sm">{t("profile.submitReview")}</Button>
            </form>
          </Card>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("profile.noReviews")}</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />)}
                </div>
                {r.comment && <p className="mt-2 text-sm text-foreground">{r.comment}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
