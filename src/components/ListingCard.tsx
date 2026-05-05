import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, BadgeCheck, Sparkles, MessageCircle } from "lucide-react";
import { categoryLabel } from "@/lib/categories";
import { useTranslation } from "@/lib/i18n";

export interface ListingCardData {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  image_url: string | null;
  featured: boolean;
  verified: boolean;
  avg_rating?: number | null;
  reviews_count?: number;
  phone?: string | null;
  whatsapp?: string | null;
}

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  const { t } = useTranslation();
  const waNumber = (listing.whatsapp || listing.phone || "").replace(/[^\d]/g, "");
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(t("card.waMessage", { name: listing.name }))}`
    : null;

  return (
    <Card className="group overflow-hidden bg-gradient-card transition-smooth hover:-translate-y-0.5 hover:shadow-elevated">
      <Link to={`/provider/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.name} loading="lazy" className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-hero text-3xl font-bold text-primary-foreground">
              {listing.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          {listing.featured && (
            <Badge className="absolute left-2 top-2 gap-1 bg-secondary text-secondary-foreground">
              <Sparkles className="h-3 w-3" /> Featured
            </Badge>
          )}
          {listing.verified && (
            <Badge className="absolute right-2 top-2 gap-1 bg-success text-success-foreground">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <Link to={`/provider/${listing.id}`} className="block">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold text-foreground">{listing.name}</h3>
            {listing.avg_rating != null && listing.avg_rating > 0 && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-foreground">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                {listing.avg_rating.toFixed(1)}
                {listing.reviews_count ? <span className="text-muted-foreground">({listing.reviews_count})</span> : null}
              </span>
            )}
          </div>
          <Badge variant="secondary" className="mt-1 bg-muted text-muted-foreground">{categoryLabel(listing.category)}</Badge>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />{listing.location}
          </div>
        </Link>
        {waUrl && (
          <Button asChild variant="whatsapp" size="sm" className="mt-2 w-full">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <MessageCircle className="mr-1 h-4 w-4" /> Chat on WhatsApp
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
}
