import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { categoryLabel } from "@/lib/categories";
import { toast } from "sonner";
import { Sparkles, BadgeCheck, Trash2, Check, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Listing {
  id: string; name: string; category: string; location: string;
  status: "pending" | "approved" | "rejected"; featured: boolean; verified: boolean;
}

export default function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const { t, lang } = useTranslation();
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    document.title = (lang === "sw" ? "Msimamizi" : "Admin") + " — ServiceLink Tanzania";
    if (isAdmin) load();
  }, [isAdmin, lang]);

  async function load() {
    const { data } = await supabase.from("listings").select("id,name,category,location,status,featured,verified").order("created_at", { ascending: false });
    setItems((data ?? []) as Listing[]);
  }

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="container py-16 text-center">
      <h1 className="text-2xl font-bold">{t("admin.required")}</h1>
      <p className="mt-2 text-muted-foreground">{t("admin.requiredSub")}</p>
    </div>
  );

  async function update(id: string, patch: Partial<Listing>) {
    const { error } = await supabase.from("listings").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(t("admin.updated")); load(); }
  }
  async function remove(id: string) {
    if (!confirm(t("dash.confirmDelete"))) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success(t("dash.deleted")); load(); }
  }

  function row(l: Listing) {
    return (
      <Card key={l.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">{l.name}</span>
            <Badge variant="secondary">{categoryLabel(l.category, t)}</Badge>
            <span className="text-xs text-muted-foreground">{l.location}</span>
            <Badge variant={l.status === "approved" ? "default" : l.status === "pending" ? "secondary" : "destructive"} className="capitalize">{l.status}</Badge>
            {l.featured && <Badge className="gap-1 bg-secondary text-secondary-foreground"><Sparkles className="h-3 w-3" />{t("card.featured")}</Badge>}
            {l.verified && <Badge variant="outline" className="gap-1"><BadgeCheck className="h-3 w-3 text-primary" />{t("card.verified")}</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {l.status !== "approved" && <Button size="sm" variant="outline" onClick={() => update(l.id, { status: "approved" })}><Check className="mr-1 h-4 w-4" />{t("admin.approve")}</Button>}
          {l.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => update(l.id, { status: "rejected" })}><X className="mr-1 h-4 w-4" />{t("admin.reject")}</Button>}
          <Button size="sm" variant={l.featured ? "secondary" : "outline"} onClick={() => update(l.id, { featured: !l.featured })}>
            <Sparkles className="mr-1 h-4 w-4" />{l.featured ? t("admin.unfeature") : t("admin.feature")}
          </Button>
          <Button size="sm" variant={l.verified ? "secondary" : "outline"} onClick={() => update(l.id, { verified: !l.verified })}>
            <BadgeCheck className="mr-1 h-4 w-4" />{l.verified ? t("admin.unverify") : t("admin.verify")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">{t("admin.title")}</h1>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("admin.all")} ({items.length})</TabsTrigger>
          <TabsTrigger value="pending">{t("admin.pending")} ({items.filter(i => i.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">{t("admin.approved")} ({items.filter(i => i.status === "approved").length})</TabsTrigger>
          <TabsTrigger value="featured">{t("admin.featured")} ({items.filter(i => i.featured).length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 grid gap-3">{items.map(row)}</TabsContent>
        <TabsContent value="pending" className="mt-4 grid gap-3">{items.filter(i => i.status === "pending").map(row)}</TabsContent>
        <TabsContent value="approved" className="mt-4 grid gap-3">{items.filter(i => i.status === "approved").map(row)}</TabsContent>
        <TabsContent value="featured" className="mt-4 grid gap-3">{items.filter(i => i.featured).map(row)}</TabsContent>
      </Tabs>
    </div>
  );
}
