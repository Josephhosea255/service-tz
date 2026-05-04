import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, BadgeCheck, Sparkles } from "lucide-react";
import { categoryLabel } from "@/lib/categories";

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
}

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <Link to={`/provider/${listing.id}`} className="group block">
      <Card className="overflow-hidden bg-gradient-card transition-smooth hover:-translate-y-0.5 hover:shadow-elevated">
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
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold text-foreground">{listing.name}</h3>
            {listing.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />}
          </div>
          <Badge variant="secondary" className="bg-muted text-muted-foreground">{categoryLabel(listing.category)}</Badge>
          <p className="line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}</span>
            {listing.avg_rating != null && (
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-secondary text-secondary" />{listing.avg_rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
