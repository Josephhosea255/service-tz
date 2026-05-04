import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, LOCATIONS, categoryLabel } from "@/lib/categories";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, BadgeCheck, Sparkles } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().min(1),
  description: z.string().trim().min(10).max(1000),
  phone: z.string().trim().min(7).max(20),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  location: z.string().min(1),
  image_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

interface Listing {
  id: string; name: string; category: string; description: string;
  phone: string; whatsapp: string | null; location: string;
  image_url: string | null; status: string; featured: boolean; verified: boolean;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = "Dashboard — ServiceLink Tanzania";
    if (user) load();
  }, [user]);

  async function load() {
    const { data } = await supabase.from("listings").select("*").eq("owner_id", user!.id).order("created_at", { ascending: false });
    setListings((data ?? []) as Listing[]);
  }

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  async function save(form: FormData) {
    const raw = Object.fromEntries(form) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) { toast.error("Please check the form fields"); return; }
    const v = parsed.data;
    const payload = {
      ...v,
      whatsapp: v.whatsapp || null,
      image_url: v.image_url || null,
      owner_id: user!.id,
    };
    if (editing) {
      const { error } = await supabase.from("listings").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Listing updated");
    } else {
      const { error } = await supabase.from("listings").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Listing published");
    }
    setEditing(null); setShowForm(false); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this listing?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">My listings</h1>
          <p className="text-sm text-muted-foreground">Manage the services you offer</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" />New listing</Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-5 shadow-soft md:p-6">
          <h2 className="mb-4 text-lg font-semibold">{editing ? "Edit listing" : "New listing"}</h2>
          <form action={save} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="name">Service / Business name *</Label>
              <Input id="name" name="name" defaultValue={editing?.name} required maxLength={100} />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={editing?.category}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Select name="location" defaultValue={editing?.location ?? "Dar es Salaam"}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>{LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" defaultValue={editing?.phone} required placeholder="+255 7XX XXX XXX" maxLength={20} />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
              <Input id="whatsapp" name="whatsapp" defaultValue={editing?.whatsapp ?? ""} placeholder="+255 7XX XXX XXX" maxLength={20} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="image_url">Profile image URL (optional)</Label>
              <Input id="image_url" name="image_url" defaultValue={editing?.image_url ?? ""} placeholder="https://…" maxLength={500} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" defaultValue={editing?.description} required minLength={10} maxLength={1000} rows={4} />
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit">{editing ? "Save" : "Publish"}</Button>
              <Button type="button" variant="ghost" onClick={() => { setEditing(null); setShowForm(false); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {listings.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          You haven't listed any services yet.
        </Card>
      ) : (
        <div className="grid gap-3">
          {listings.map((l) => (
            <Card key={l.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/provider/${l.id}`} className="font-semibold text-foreground hover:text-primary">{l.name}</Link>
                  {l.featured && <Badge className="gap-1 bg-secondary text-secondary-foreground"><Sparkles className="h-3 w-3" />Featured</Badge>}
                  {l.verified && <Badge variant="outline" className="gap-1"><BadgeCheck className="h-3 w-3 text-primary" />Verified</Badge>}
                  <Badge variant={l.status === "approved" ? "secondary" : "outline"} className="capitalize">{l.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{categoryLabel(l.category)} · {l.location}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(l); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  <Pencil className="mr-2 h-4 w-4" />Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(l.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
