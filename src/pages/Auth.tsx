import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/categories";
import { Briefcase, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "customer" | "provider";
type Employment = "employed" | "self_employed";

function passwordStrength(p: string): { score: number; label: string } {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const label = s <= 1 ? "Weak" : s <= 3 ? "Medium" : "Strong";
  return { score: s, label };
}

export default function Auth() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<Role>("customer");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nida, setNida] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [employment, setEmployment] = useState<Employment>("self_employed");
  const [companyName, setCompanyName] = useState("");

  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const strength = passwordStrength(password);
  const passwordsMatch = password === confirmPassword;

  async function withGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error(t("auth.googleFailed")); setBusy(false); return; }
    if (result.redirected) return;
    navigate("/dashboard");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "signup") {
      if (!passwordsMatch) { toast.error("Passwords do not match"); return; }
      if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
      if (role === "provider") {
        if (!nida.trim()) { toast.error("NIDA number is required"); return; }
        if (!serviceType) { toast.error("Please select a service type"); return; }
        if (employment === "employed" && !companyName.trim()) { toast.error("Company name is required"); return; }
      }
    }
    setBusy(true);
    if (mode === "signup") {
      const meta: Record<string, string> = {
        full_name: fullName,
        phone,
        role,
      };
      if (role === "provider") {
        meta.nida = nida;
        meta.service_type = serviceType;
        meta.employment_type = employment;
        if (employment === "employed") meta.company_name = companyName;
      }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin, data: meta },
      });
      if (error) toast.error(error.message);
      else { toast.success(t("auth.created")); navigate("/dashboard"); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message); else navigate("/dashboard");
    }
    setBusy(false);
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <Card className="w-full max-w-lg p-6 shadow-elevated md:p-8">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? t("auth.signinSub") : t("auth.signupSub")}
        </p>

        <Button onClick={withGoogle} disabled={busy} variant="outline" className="mt-6 w-full">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          {t("auth.google")}
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> {t("auth.or")} <div className="h-px flex-1 bg-border" />
        </div>

        {mode === "signup" && (
          <div className="mb-5">
            <Label className="mb-2 block">I want to join as</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={cn(
                  "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors",
                  role === "customer" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                )}
              >
                <UserIcon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold">I am a Customer</div>
                  <div className="text-xs text-muted-foreground">Find and hire trusted pros</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("provider")}
                className={cn(
                  "flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors",
                  role === "provider" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                )}
              >
                <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold">I am a Service Provider</div>
                  <div className="text-xs text-muted-foreground">Offer services & get jobs</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} placeholder="+255 7XX XXX XXX" />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {mode === "signup" && role === "provider" && (
            <>
              <div>
                <Label htmlFor="nida">NIDA Number</Label>
                <Input id="nida" value={nida} onChange={(e) => setNida(e.target.value)} required maxLength={30} />
                <p className="mt-1 text-xs text-muted-foreground">Used for verification purposes only</p>
              </div>
              <div>
                <Label>Service Type</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger><SelectValue placeholder="Select your service" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block">Employment Type</Label>
                <RadioGroup value={employment} onValueChange={(v) => setEmployment(v as Employment)} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className={cn("flex items-center gap-2 rounded-md border p-2 cursor-pointer", employment === "employed" && "border-primary bg-primary/5")}>
                    <RadioGroupItem value="employed" id="emp-1" />
                    <span className="text-sm">Employed (Ameajiriwa)</span>
                  </label>
                  <label className={cn("flex items-center gap-2 rounded-md border p-2 cursor-pointer", employment === "self_employed" && "border-primary bg-primary/5")}>
                    <RadioGroupItem value="self_employed" id="emp-2" />
                    <span className="text-sm">Self-employed (Amejiajiri)</span>
                  </label>
                </RadioGroup>
              </div>
              {employment === "employed" && (
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required maxLength={100} />
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            {mode === "signup" && password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full transition-all",
                      strength.score <= 1 ? "w-1/5 bg-destructive" :
                      strength.score <= 3 ? "w-3/5 bg-amber-500" : "w-full bg-success"
                    )}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{strength.label}</span>
              </div>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
              )}
            </div>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {mode === "signin" ? t("auth.signIn") : t("auth.create")}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin" ? t("auth.newHere") : t("auth.alreadyHave")}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-medium text-primary hover:underline">
            {mode === "signin" ? t("auth.create") : t("auth.signIn")}
          </button>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t("auth.guest.a")}<Link to="/search" className="text-primary hover:underline">{t("auth.guest.b")}</Link>.
        </p>
      </Card>
    </div>
  );
}
