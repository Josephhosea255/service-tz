import { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { Briefcase, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "customer" | "provider";
type Employment = "employed" | "self_employed";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TZ_PHONE_RE = /^0[67]\d{8}$/;

function isEmail(v: string) { return EMAIL_RE.test(v.trim()); }
function isTzPhone(v: string) { return TZ_PHONE_RE.test(v.replace(/\s+/g, "")); }
function normalizePhone(v: string) { return v.replace(/\s+/g, ""); }

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

// Lightweight client-side throttle for failed attempts
function getAttempts(): { count: number; until: number } {
  try { return JSON.parse(localStorage.getItem("auth_attempts") || '{"count":0,"until":0}'); }
  catch { return { count: 0, until: 0 }; }
}
function setAttempts(a: { count: number; until: number }) {
  localStorage.setItem("auth_attempts", JSON.stringify(a));
}

export default function Auth() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const location = useLocation() as { state?: { from?: string } };
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<Role>("customer");

  const [identifier, setIdentifier] = useState(""); // email or phone (signin)
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nida, setNida] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [employment, setEmployment] = useState<Employment>("self_employed");
  const [companyName, setCompanyName] = useState("");

  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to={location.state?.from || "/dashboard"} replace />;

  const strength = passwordStrength(password);
  const passwordsMatch = password === confirmPassword;

  async function resolveEmail(input: string): Promise<string | null> {
    if (isEmail(input)) return input.trim().toLowerCase();
    if (isTzPhone(input)) {
      const { data, error } = await supabase.rpc("get_email_by_phone", { _phone: normalizePhone(input) });
      if (error || !data) return null;
      return data as string;
    }
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Throttle
    const att = getAttempts();
    if (att.until > Date.now()) {
      const sec = Math.ceil((att.until - Date.now()) / 1000);
      toast.error(`Too many attempts. Try again in ${sec}s.`);
      return;
    }

    if (mode === "signup") {
      if (!isEmail(email)) { toast.error("Please enter a valid email"); return; }
      if (!isTzPhone(phone)) { toast.error("Phone must start with 06 or 07 and be 10 digits"); return; }
      if (!passwordsMatch) { toast.error("Passwords do not match"); return; }
      if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
      if (role === "provider") {
        if (!nida.trim()) { toast.error("NIDA number is required"); return; }
        if (!serviceType) { toast.error("Please select a service type"); return; }
        if (employment === "employed" && !companyName.trim()) { toast.error("Company name is required"); return; }
      }
    } else {
      if (!isEmail(identifier) && !isTzPhone(identifier)) {
        toast.error("Invalid email or phone number");
        return;
      }
    }

    setBusy(true);
    if (mode === "signup") {
      const meta: Record<string, string> = {
        full_name: fullName,
        phone: normalizePhone(phone),
        role,
      };
      if (role === "provider") {
        meta.nida = nida;
        meta.service_type = serviceType;
        meta.employment_type = employment;
        if (employment === "employed") meta.company_name = companyName;
      }
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: window.location.origin, data: meta },
      });
      if (error) {
        toast.error(/already|registered|exists/i.test(error.message) ? "Email already in use" : error.message);
      } else {
        toast.success(t("auth.created"));
        navigate("/dashboard");
      }
    } else {
      const resolved = await resolveEmail(identifier);
      if (!resolved) {
        const next = { count: att.count + 1, until: att.count + 1 >= 5 ? Date.now() + 30_000 : 0 };
        setAttempts(next);
        toast.error("Invalid email or phone number");
        setBusy(false);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: resolved, password });
      if (error) {
        const next = { count: att.count + 1, until: att.count + 1 >= 5 ? Date.now() + 30_000 : 0 };
        setAttempts(next);
        toast.error("Incorrect password");
      } else {
        setAttempts({ count: 0, until: 0 });
        navigate(location.state?.from || "/dashboard");
      }
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

        {mode === "signup" && (
          <div className="mb-5 mt-6">
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

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" ? (
            <>
              <div>
                <Label htmlFor="name">{t("auth.fullName")}</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="07XXXXXXXX" />
                <p className="mt-1 text-xs text-muted-foreground">Tanzanian format: starts with 06 or 07, 10 digits</p>
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="identifier">Email or Phone Number</Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="user@email.com or 07XXXXXXXX"
                autoComplete="username"
              />
            </div>
          )}

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
            <div className="relative">
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pr-10"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
              <Input
                id="confirm"
                type={showPwd ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
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
      </Card>
    </div>
  );
}
