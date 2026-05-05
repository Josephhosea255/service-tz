import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Lang = "en" | "sw";

type Dict = Record<string, string>;

const en: Dict = {
  // Header / nav
  "nav.home": "Home",
  "nav.browse": "Browse",
  "nav.dashboard": "Dashboard",
  "nav.favorites": "Favorites",
  "nav.admin": "Admin",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",
  "nav.toggleTheme": "Toggle theme",
  "brand.tagline": "Tanzania",

  // Footer
  "footer.browse": "Browse services",
  "footer.list": "List your service",

  // Home — hero
  "home.badge": "Tanzania's local services marketplace",
  "home.headline.a": "Get the job done.",
  "home.headline.b": "Hire trusted local pros",
  "home.headline.c": "in minutes.",
  "home.subhead": "From fundi to freelancers — find verified service providers near you and chat instantly on WhatsApp. No middlemen, no fees.",
  "home.searchPlaceholder": "What service do you need?",
  "home.searchCity": "Dar es Salaam",
  "home.search": "Search",
  "home.postFree": "Post Your Service — Free",
  "home.browse": "Browse providers →",

  // Trust
  "trust.verified": "Verified providers",
  "trust.rating": "Average rating",
  "trust.customers": "Happy customers",

  // Categories
  "home.cat.title": "Browse by category",
  "home.cat.sub": "Pick a service to get started",

  // How it works
  "how.title": "How it works",
  "how.sub": "Get help in 3 simple steps",
  "how.s1.title": "Search & discover",
  "how.s1.desc": "Browse verified local providers by category and location across Tanzania.",
  "how.s2.title": "Chat on WhatsApp",
  "how.s2.desc": "Tap one button to message providers directly. Discuss your job and get a quote fast.",
  "how.s3.title": "Get the job done",
  "how.s3.desc": "Hire confidently. After the work, leave a review to help others in your community.",

  // Featured
  "featured.title": "Featured providers",
  "featured.sub": "Top-rated and verified locals",
  "featured.viewAll": "View all →",
  "featured.empty.a": "No providers yet.",
  "featured.empty.b": "Be the first to list your service.",

  // Provider CTA
  "providerCta.badge": "For service providers",
  "providerCta.title": "Grow your business with ServiceLink",
  "providerCta.desc": "Reach thousands of customers across Tanzania. Listing is free — get WhatsApp leads directly.",
  "providerCta.post": "Post Your Service",
  "providerCta.signup": "Sign up free",

  // Listing card
  "card.featured": "Featured",
  "card.verified": "Verified",
  "card.whatsapp": "Chat on WhatsApp",
  "card.waMessage": "Hi {name}, I found you on ServiceLink Tanzania.",
  "card.requestService": "Request Service",

  // Search
  "search.title": "Browse providers",
  "search.placeholder": "Search by name or description",
  "search.category": "Category",
  "search.location": "Location",
  "search.allCategories": "All categories",
  "search.allLocations": "All locations",
  "search.apply": "Apply",
  "search.loading": "Loading…",
  "search.empty": "No providers match your filters yet.",

  // Provider profile
  "profile.back": "Back",
  "profile.save": "Save",
  "profile.saved": "Saved",
  "profile.whatsapp": "WhatsApp",
  "profile.requestService": "Request Service",
  "profile.requestWaiting": "Waiting for response…",
  "profile.requestNoResponse": "Provider not responding",
  "profile.tryOthers": "Try other providers",
  "profile.reviews": "Reviews",
  "profile.yourRating": "Your rating:",
  "profile.shareExp": "Share your experience…",
  "profile.submitReview": "Submit review",
  "profile.noReviews": "No reviews yet.",
  "profile.signInFav": "Please sign in to save favorites",
  "profile.signInReview": "Please sign in to leave a review",
  "profile.reviewSubmitted": "Review submitted",
  "profile.loading": "Loading…",

  // Auth
  "auth.welcomeBack": "Welcome back",
  "auth.createAccount": "Create your account",
  "auth.signinSub": "Sign in to manage your listings & favorites.",
  "auth.signupSub": "Join ServiceLink Tanzania to list your services.",
  "auth.google": "Continue with Google",
  "auth.or": "OR",
  "auth.fullName": "Full name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.signIn": "Sign in",
  "auth.create": "Create account",
  "auth.newHere": "New to ServiceLink? ",
  "auth.alreadyHave": "Already have an account? ",
  "auth.guest.a": "Or just ",
  "auth.guest.b": "browse as guest",
  "auth.googleFailed": "Google sign-in failed",
  "auth.created": "Account created — check your email if confirmation is required",

  // Dashboard
  "dash.title": "My listings",
  "dash.sub": "Manage the services you offer",
  "dash.new": "New listing",
  "dash.editTitle": "Edit listing",
  "dash.newTitle": "New listing",
  "dash.f.name": "Service / Business name *",
  "dash.f.category": "Category *",
  "dash.f.categoryPh": "Select category",
  "dash.f.location": "Location *",
  "dash.f.locationPh": "Select location",
  "dash.f.phone": "Phone *",
  "dash.f.whatsapp": "WhatsApp (optional)",
  "dash.f.image": "Profile image URL (optional)",
  "dash.f.description": "Description *",
  "dash.save": "Save",
  "dash.publish": "Publish",
  "dash.cancel": "Cancel",
  "dash.empty": "You haven't listed any services yet.",
  "dash.edit": "Edit",
  "dash.delete": "Delete",
  "dash.confirmDelete": "Delete this listing?",
  "dash.checkFields": "Please check the form fields",
  "dash.updated": "Listing updated",
  "dash.published": "Listing published",
  "dash.deleted": "Deleted",

  // Admin
  "admin.title": "Admin panel",
  "admin.required": "Admin access required",
  "admin.requiredSub": "Your account does not have admin role.",
  "admin.all": "All",
  "admin.pending": "Pending",
  "admin.approved": "Approved",
  "admin.featured": "Featured",
  "admin.approve": "Approve",
  "admin.reject": "Reject",
  "admin.feature": "Feature",
  "admin.unfeature": "Unfeature",
  "admin.verify": "Verify",
  "admin.unverify": "Unverify",
  "admin.updated": "Updated",

  // Favorites
  "fav.title": "Saved providers",
  "fav.empty": "No favorites yet.",

  // Categories
  "cat.fundi": "Fundi",
  "cat.electrician": "Electrician",
  "cat.plumber": "Plumber",
  "cat.tutor": "Tutor",
  "cat.freelancer": "Freelancer",
  "cat.painter": "Painter",
  "cat.mechanic": "Mechanic",
  "cat.tailor": "Tailor",
  "cat.cleaner": "Cleaner",
  "cat.other": "Other",
};

const sw: Dict = {
  "nav.home": "Mwanzo",
  "nav.browse": "Vinjari",
  "nav.dashboard": "Dashibodi",
  "nav.favorites": "Vipendwa",
  "nav.admin": "Msimamizi",
  "nav.signIn": "Ingia",
  "nav.signOut": "Toka",
  "nav.toggleTheme": "Badili mwonekano",
  "brand.tagline": "Tanzania",

  "footer.browse": "Vinjari huduma",
  "footer.list": "Orodhesha huduma yako",

  "home.badge": "Soko la huduma za ndani Tanzania",
  "home.headline.a": "Pata huduma karibu nawe.",
  "home.headline.b": "Ajiri watoa huduma wa ndani wanaoaminika",
  "home.headline.c": "kwa dakika chache.",
  "home.subhead": "Kuanzia fundi hadi wafanyakazi huru — pata watoa huduma waliothibitishwa karibu nawe na ongea moja kwa moja kwenye WhatsApp. Hakuna madalali, hakuna ada.",
  "home.searchPlaceholder": "Unahitaji huduma gani?",
  "home.searchCity": "Dar es Salaam",
  "home.search": "Tafuta",
  "home.postFree": "Weka Huduma Yako — Bure",
  "home.browse": "Vinjari watoa huduma →",

  "trust.verified": "Watoa huduma waliothibitishwa",
  "trust.rating": "Wastani wa ukadiriaji",
  "trust.customers": "Wateja walioridhika",

  "home.cat.title": "Vinjari kwa kategoria",
  "home.cat.sub": "Chagua huduma ili kuanza",

  "how.title": "Jinsi inavyofanya kazi",
  "how.sub": "Pata msaada kwa hatua 3 rahisi",
  "how.s1.title": "Tafuta na ugundue",
  "how.s1.desc": "Vinjari watoa huduma waliothibitishwa kwa kategoria na eneo kote Tanzania.",
  "how.s2.title": "Ongea kwenye WhatsApp",
  "how.s2.desc": "Bonyeza kitufe kimoja kuwasiliana na watoa huduma moja kwa moja. Jadili kazi yako na upate bei haraka.",
  "how.s3.title": "Maliza kazi",
  "how.s3.desc": "Ajiri kwa uhakika. Baada ya kazi, acha maoni kusaidia wengine katika jamii yako.",

  "featured.title": "Watoa huduma maalum",
  "featured.sub": "Wenye ukadiriaji wa juu na waliothibitishwa",
  "featured.viewAll": "Tazama wote →",
  "featured.empty.a": "Hakuna watoa huduma bado.",
  "featured.empty.b": "Kuwa wa kwanza kuorodhesha huduma yako.",

  "providerCta.badge": "Kwa watoa huduma",
  "providerCta.title": "Kuza biashara yako na ServiceLink",
  "providerCta.desc": "Fikia maelfu ya wateja kote Tanzania. Kuorodhesha ni bure — pata wateja moja kwa moja kupitia WhatsApp.",
  "providerCta.post": "Weka Huduma Yako",
  "providerCta.signup": "Jisajili bure",

  "card.featured": "Maalum",
  "card.verified": "Imethibitishwa",
  "card.whatsapp": "Ongea kwenye WhatsApp",
  "card.waMessage": "Habari {name}, nimekupata kwenye ServiceLink Tanzania.",
  "card.requestService": "Omba Huduma",

  "search.title": "Vinjari watoa huduma",
  "search.placeholder": "Tafuta kwa jina au maelezo",
  "search.category": "Kategoria",
  "search.location": "Eneo",
  "search.allCategories": "Kategoria zote",
  "search.allLocations": "Maeneo yote",
  "search.apply": "Tumia",
  "search.loading": "Inapakia…",
  "search.empty": "Hakuna watoa huduma wanaolingana na vichujio vyako.",

  "profile.back": "Rudi",
  "profile.save": "Hifadhi",
  "profile.saved": "Imehifadhiwa",
  "profile.whatsapp": "WhatsApp",
  "profile.requestService": "Omba Huduma",
  "profile.requestWaiting": "Inasubiri majibu…",
  "profile.requestNoResponse": "Mtoa huduma hajajibu",
  "profile.tryOthers": "Jaribu watoa huduma wengine",
  "profile.reviews": "Maoni",
  "profile.yourRating": "Ukadiriaji wako:",
  "profile.shareExp": "Shiriki uzoefu wako…",
  "profile.submitReview": "Tuma maoni",
  "profile.noReviews": "Hakuna maoni bado.",
  "profile.signInFav": "Tafadhali ingia ili kuhifadhi vipendwa",
  "profile.signInReview": "Tafadhali ingia ili kuacha maoni",
  "profile.reviewSubmitted": "Maoni yametumwa",
  "profile.loading": "Inapakia…",

  "auth.welcomeBack": "Karibu tena",
  "auth.createAccount": "Fungua akaunti yako",
  "auth.signinSub": "Ingia kusimamia orodha na vipendwa vyako.",
  "auth.signupSub": "Jiunge na ServiceLink Tanzania kuorodhesha huduma zako.",
  "auth.google": "Endelea na Google",
  "auth.or": "AU",
  "auth.fullName": "Jina kamili",
  "auth.email": "Barua pepe",
  "auth.password": "Nenosiri",
  "auth.signIn": "Ingia",
  "auth.create": "Fungua akaunti",
  "auth.newHere": "Mpya kwenye ServiceLink? ",
  "auth.alreadyHave": "Tayari una akaunti? ",
  "auth.guest.a": "Au tu ",
  "auth.guest.b": "vinjari kama mgeni",
  "auth.googleFailed": "Kuingia kwa Google kumeshindikana",
  "auth.created": "Akaunti imefunguliwa — angalia barua pepe yako kama uthibitisho unahitajika",

  "dash.title": "Orodha zangu",
  "dash.sub": "Simamia huduma unazotoa",
  "dash.new": "Orodha mpya",
  "dash.editTitle": "Hariri orodha",
  "dash.newTitle": "Orodha mpya",
  "dash.f.name": "Jina la huduma / biashara *",
  "dash.f.category": "Kategoria *",
  "dash.f.categoryPh": "Chagua kategoria",
  "dash.f.location": "Eneo *",
  "dash.f.locationPh": "Chagua eneo",
  "dash.f.phone": "Namba ya simu *",
  "dash.f.whatsapp": "WhatsApp (hiari)",
  "dash.f.image": "URL ya picha (hiari)",
  "dash.f.description": "Maelezo *",
  "dash.save": "Hifadhi",
  "dash.publish": "Chapisha",
  "dash.cancel": "Ghairi",
  "dash.empty": "Bado hujaorodhesha huduma yoyote.",
  "dash.edit": "Hariri",
  "dash.delete": "Futa",
  "dash.confirmDelete": "Futa orodha hii?",
  "dash.checkFields": "Tafadhali angalia sehemu za fomu",
  "dash.updated": "Orodha imesasishwa",
  "dash.published": "Orodha imechapishwa",
  "dash.deleted": "Imefutwa",

  "admin.title": "Paneli ya msimamizi",
  "admin.required": "Ufikiaji wa msimamizi unahitajika",
  "admin.requiredSub": "Akaunti yako haina jukumu la msimamizi.",
  "admin.all": "Zote",
  "admin.pending": "Zinazosubiri",
  "admin.approved": "Zilizoidhinishwa",
  "admin.featured": "Maalum",
  "admin.approve": "Idhinisha",
  "admin.reject": "Kataa",
  "admin.feature": "Weka maalum",
  "admin.unfeature": "Ondoa maalum",
  "admin.verify": "Thibitisha",
  "admin.unverify": "Ondoa uthibitisho",
  "admin.updated": "Imesasishwa",

  "fav.title": "Watoa huduma waliohifadhiwa",
  "fav.empty": "Hakuna vipendwa bado.",

  "cat.fundi": "Fundi",
  "cat.electrician": "Fundi umeme",
  "cat.plumber": "Fundi mabomba",
  "cat.tutor": "Mwalimu",
  "cat.freelancer": "Mfanyakazi huru",
  "cat.painter": "Mpaka rangi",
  "cat.mechanic": "Mekanika",
  "cat.tailor": "Mshonaji",
  "cat.cleaner": "Msafishaji",
  "cat.other": "Nyingine",
};

const dictionaries: Record<Lang, Dict> = { en, sw };

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<Ctx | undefined>(undefined);

const STORAGE_KEY = "sl_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return saved === "sw" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang: setLangState,
    t: (key, vars) => {
      const dict = dictionaries[lang];
      let s = dict[key] ?? dictionaries.en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside LanguageProvider");
  return ctx;
}
