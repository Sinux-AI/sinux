import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Sun, Moon, Monitor, Bell, BellOff, Volume2, VolumeX, Globe, Loader2 } from "lucide-react";
import { updatePreferences } from "../services/preferenceService";
import { useAuthStore } from "../authentication/authStore";

const COUNTRIES = [
  { code: "ZA", name: "South Africa" }, { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" }, { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" }, { code: "GH", name: "Ghana" },
  { code: "EG", name: "Egypt" }, { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" }, { code: "DE", name: "Germany" },
  { code: "FR", name: "France" }, { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" }, { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
];

// Maps each country code to its standard currency
const COUNTRY_TO_CURRENCY = {
  ZA: { code: "ZAR", name: "South African Rand (ZAR)" },
  US: { code: "USD", name: "US Dollar (USD)" },
  GB: { code: "GBP", name: "British Pound (GBP)" },
  NG: { code: "NGN", name: "Nigerian Naira (NGN)" },
  KE: { code: "KES", name: "Kenyan Shilling (KES)" },
  GH: { code: "GHS", name: "Ghanaian Cedi (GHS)" },
  EG: { code: "EGP", name: "Egyptian Pound (EGP)" },
  CA: { code: "CAD", name: "Canadian Dollar (CAD)" },
  AU: { code: "AUD", name: "Australian Dollar (AUD)" },
  DE: { code: "EUR", name: "Euro (EUR)" },
  FR: { code: "EUR", name: "Euro (EUR)" },
  IN: { code: "INR", name: "Indian Rupee (INR)" },
  BR: { code: "BRL", name: "Brazilian Real (BRL)" },
  JP: { code: "JPY", name: "Japanese Yen (JPY)" },
  SG: { code: "SGD", name: "Singapore Dollar (SGD)" },
};

const TOTAL_STEPS = 4;

/**
 * OnboardingWizard
 * Props:
 *   onComplete(destination) — called with "dashboard" or "create-org"
 *   destination — "dashboard" | "create-org" (from Auth.jsx)
 */
export default function OnboardingWizard({ destination = "dashboard", onComplete }) {
  const navigate = useNavigate();
  let { updatePreferences: storeUpdatePrefs } = useAuthStore();

  const [step, setStep] = useState(0); // 0-3
  const [direction, setDirection] = useState("forward"); // "forward" | "backward"
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [prefs, setPrefs] = useState({
    theme: "dark",
    notifyChangelog: true,
    notifyNewFeatures: true,
    notifyTierUpsell: true,
    notifyUsageAlerts: true,
    country: "ZA",
    currency: "ZAR",
    soundsEnabled: true,
  });

  const updatePref = (key, value) => setPrefs((p) => ({ ...p, [key]: value }));

  const handleCountryChange = (countryCode) => {
    const currency = COUNTRY_TO_CURRENCY[countryCode];
    setPrefs((p) => ({
      ...p,
      country: countryCode,
      currency: currency?.code ?? p.currency,
    }));
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection("backward");
      setStep((s) => s - 1);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    setError("");
    const { data, error: err } = await updatePreferences(prefs);
    if (err) {
      setError("Could not save preferences. You can update them later in settings.");
    } else {
      storeUpdatePrefs(data ?? prefs);
    }
    needsOnboarding = false;
    setSaving(false);

    if (onComplete) {
      onComplete(destination);
    } else {
      navigate(destination === "create-org" ? "/create-org" : "/dashboard");
    }
  };

  const steps = [
    {
      title: "Choose your theme",
      subtitle: "Pick how Sinux looks for you",
      icon: <Sun size={28} className="text-primary" />,
      content: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "dark", label: "Dark", Icon: Moon, desc: "Easy on the eyes" },
            { value: "light", label: "Light", Icon: Sun, desc: "Clean & bright" },
            { value: "system", label: "System", Icon: Monitor, desc: "Follows your OS" },
          ].map(({ value, label, Icon, desc }) => (
            <button
              key={value}
              onClick={() => updatePref("theme", value)}
              className={`relative p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all group ${
                prefs.theme === value
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(207,255,4,0.15)]"
                  : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <Icon size={24} className={prefs.theme === value ? "text-primary" : "text-text-secondary group-hover:text-white transition-colors"} />
              <div className="text-center">
                <p className={`text-sm font-bold ${prefs.theme === value ? "text-white" : "text-text-secondary group-hover:text-white"}`}>{label}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{desc}</p>
              </div>
              {prefs.theme === value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check size={10} className="text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Notification preferences",
      subtitle: "Choose what Sinux can notify you about",
      icon: <Bell size={28} className="text-primary" />,
      content: (
        <div className="space-y-3">
          {[
            { key: "notifyChangelog", label: "Platform Changelog", desc: "Updates about new platform releases" },
            { key: "notifyNewFeatures", label: "New Features", desc: "When new capabilities are added" },
            { key: "notifyTierUpsell", label: "Plan Suggestions", desc: "Tips on upgrading your plan" },
            { key: "notifyUsageAlerts", label: "Usage Alerts", desc: "Low balance and high usage warnings" },
          ].map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => updatePref(key, !prefs[key])}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                prefs[key]
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="text-left">
                <p className={`text-sm font-semibold ${prefs[key] ? "text-white" : "text-text-secondary"}`}>{label}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{desc}</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative shrink-0 ml-4 ${prefs[key] ? "bg-primary" : "bg-white/20"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${prefs[key] ? "left-7" : "left-1"}`} />
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Your region",
      subtitle: "Helps us format pricing and dates correctly",
      icon: <Globe size={28} className="text-primary" />,
      content: (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">
              Country
            </label>
            <div className="relative">
              <select
                value={prefs.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(207,255,4,0.1)] transition-all appearance-none cursor-pointer"
              >
                {COUNTRIES.map(({ code, name }) => (
                  <option key={code} value={code} className="bg-[#0a0a0f]">{name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          {/* Currency — auto-derived from country, read-only */}
          <div className="space-y-2">
            <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">
              Currency <span className="text-primary/60 normal-case tracking-normal">(auto-matched)</span>
            </label>
            <div className="w-full bg-black/30 border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between">
              <span className="text-white text-sm">
                {COUNTRY_TO_CURRENCY[prefs.country]?.name ?? prefs.currency}
              </span>
              <span className="text-[10px] font-tech text-primary/60 uppercase tracking-widest">Auto</span>
            </div>
            <p className="text-[10px] text-text-secondary/60 ml-1">Currency is automatically selected based on your country.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Sound effects",
      subtitle: "A subtle chime plays when your AI responds",
      icon: <Volume2 size={28} className="text-primary" />,
      content: (
        <div className="space-y-6">
          <button
            onClick={() => updatePref("soundsEnabled", !prefs.soundsEnabled)}
            className={`w-full p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${
              prefs.soundsEnabled
                ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(207,255,4,0.1)]"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            {prefs.soundsEnabled ? (
              <Volume2 size={40} className="text-primary" />
            ) : (
              <VolumeX size={40} className="text-text-secondary" />
            )}
            <div className="text-center">
              <p className="text-xl font-bold text-white mb-1">
                {prefs.soundsEnabled ? "Sounds On" : "Sounds Off"}
              </p>
              <p className="text-sm text-text-secondary">
                {prefs.soundsEnabled
                  ? "A soft chime will play when your AI responds"
                  : "No audio feedback — silent mode"}
              </p>
            </div>
            <div className={`w-16 h-8 rounded-full transition-all relative ${prefs.soundsEnabled ? "bg-primary" : "bg-white/20"}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${prefs.soundsEnabled ? "left-9" : "left-1"}`} />
            </div>
          </button>

          {error && (
            <p className="text-red-400 text-xs text-center font-tech">{error}</p>
          )}
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#050508]/90 border border-white/10 rounded-[2rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Step header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              {current.icon}
            </div>
            <div>
              <p className="font-tech text-[9px] font-bold text-primary uppercase tracking-[0.3em]">
                Step {step + 1} of {TOTAL_STEPS}
              </p>
              <h2 className="text-2xl font-bold text-white tracking-tight">{current.title}</h2>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-8 ml-16">{current.subtitle}</p>

          {/* Step content — slide animation */}
          <div
            key={step}
            className={`animate-in ${direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4"} duration-300`}
          >
            {current.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all disabled:opacity-0 disabled:pointer-events-none font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-all shadow-neon-primary"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-all shadow-neon-primary disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Check size={16} />
                    Finish Setup
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              useAuthStore.setState({ needsOnboarding: false });
              navigate(destination === "create-org" ? "/create-org" : "/dashboard");
            }}
            className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] hover:text-white/60 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
