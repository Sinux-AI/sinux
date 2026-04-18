import { useState, useEffect } from "react";
import {
  Sun, Moon, Monitor, Bell, Globe, Volume2, VolumeX,
  Save, Loader2, Settings2, RefreshCw, Check
} from "lucide-react";
import { getPreferences, updatePreferences } from "../services/preferenceService";
import { useAuthStore } from "../authentication/authStore";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { toast } from "react-hot-toast";

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

const DEFAULT_PREFS = {
  theme: "dark",
  notifyChangelog: true,
  notifyNewFeatures: true,
  notifyTierUpsell: true,
  notifyUsageAlerts: true,
  country: "ZA",
  currency: "ZAR",
  soundsEnabled: true,
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
      <Icon size={20} className="text-primary" />
    </div>
    <div>
      <h2 className="text-base font-bold text-text-primary">{title}</h2>
      <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const Toggle = ({ checked, onChange, label, desc }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
      checked ? "border-primary/40 bg-primary/5" : "border-border-glow bg-text-primary/5 hover:border-text-primary/20"
    }`}
  >
    <div>
      <p className={`text-sm font-semibold ${checked ? "text-text-primary" : "text-text-secondary"}`}>{label}</p>
      {desc && <p className="text-[11px] text-text-secondary mt-0.5">{desc}</p>}
    </div>
    <div className={`w-12 h-6 rounded-full transition-all relative shrink-0 ml-4 ${checked ? "bg-primary" : "bg-text-primary/20"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-background rounded-full shadow transition-all ${checked ? "left-7" : "left-1"}`} />
    </div>
  </button>
);

export default function Settings() {
  const { updatePreferences: storeUpdatePrefs } = useAuthStore();
  const storedPrefs = useAuthStore((s) => s.preferences);

  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await getPreferences();
      if (data) {
        setPrefs({ ...DEFAULT_PREFS, ...data });
      } else if (storedPrefs) {
        setPrefs({ ...DEFAULT_PREFS, ...storedPrefs });
      }
      setLoading(false);
    };
    load();
  }, []);

  const updatePref = (key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const handleCountryChange = (countryCode) => {
    const currency = COUNTRY_TO_CURRENCY[countryCode];
    setPrefs((p) => ({
      ...p,
      country: countryCode,
      currency: currency?.code ?? p.currency,
    }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await updatePreferences(prefs);
    if (error) {
      toast.error("Could not save preferences. Please try again.");
    } else {
      storeUpdatePrefs(data ?? prefs);
      setDirty(false);
      toast.success("Preferences saved successfully.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-12 pb-20">
        <PageHeader title="Settings" subtitle="Manage your personal preferences." />
        <div className="grid gap-6 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 rounded-[2rem] bg-text-primary/[0.02] animate-pulse border border-border-glow" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-20 relative isolate">
      {/* Background orbs */}
      <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <PageHeader
        title="Settings"
        subtitle="Manage your personal preferences and account configuration."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">

        {/* ── Appearance ── */}
        <GlassCard className="p-8">
          <SectionHeader icon={Sun} title="Appearance" subtitle="Choose how Sinux looks for you" />
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "dark", label: "Dark", Icon: Moon, desc: "Easy on the eyes" },
              { value: "light", label: "Light", Icon: Sun, desc: "Clean & bright" },
              { value: "system", label: "System", Icon: Monitor, desc: "Follows your OS" },
            ].map(({ value, label, Icon, desc }) => (
              <button
                key={value}
                onClick={() => updatePref("theme", value)}
                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group ${
                  prefs.theme === value
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(207,255,4,0.12)]"
                    : "border-border-glow bg-text-primary/5 hover:border-text-primary/25 hover:bg-text-primary/10"
                }`}
              >
                <Icon size={22} className={prefs.theme === value ? "text-primary" : "text-text-secondary group-hover:text-text-primary transition-colors"} />
                <div className="text-center">
                  <p className={`text-xs font-bold ${prefs.theme === value ? "text-text-primary" : "text-text-secondary"}`}>{label}</p>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-tight">{desc}</p>
                </div>
                {prefs.theme === value && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Check size={9} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* ── Sound ── */}
        <GlassCard className="p-8">
          <SectionHeader icon={Volume2} title="Sound Effects" subtitle="Audio feedback when AI responds" />
          <button
            onClick={() => updatePref("soundsEnabled", !prefs.soundsEnabled)}
            className={`w-full p-6 rounded-2xl border-2 flex items-center gap-6 transition-all ${
              prefs.soundsEnabled
                ? "border-primary bg-primary/10 shadow-[0_0_24px_rgba(207,255,4,0.1)]"
                : "border-border-glow bg-text-primary/5 hover:border-text-primary/20"
            }`}
          >
            {prefs.soundsEnabled ? (
              <Volume2 size={32} className="text-primary shrink-0" />
            ) : (
              <VolumeX size={32} className="text-text-secondary shrink-0" />
            )}
            <div className="text-left flex-1">
              <p className="text-base font-bold text-text-primary mb-1">
                {prefs.soundsEnabled ? "Sounds On" : "Sounds Off"}
              </p>
              <p className="text-xs text-text-secondary">
                {prefs.soundsEnabled
                  ? "A soft chime plays when your AI responds"
                  : "Running in silent mode — no audio feedback"}
              </p>
            </div>
            <div className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${prefs.soundsEnabled ? "bg-primary" : "bg-text-primary/20"}`}>
              <div className={`absolute top-1.5 w-4 h-4 bg-background rounded-full shadow transition-all ${prefs.soundsEnabled ? "left-9" : "left-1"}`} />
            </div>
          </button>
        </GlassCard>

        {/* ── Notifications ── */}
        <GlassCard className="p-8">
          <SectionHeader icon={Bell} title="Notifications" subtitle="Choose what Sinux can notify you about" />
          <div className="space-y-3">
            {[
              { key: "notifyChangelog", label: "Platform Changelog", desc: "Updates about new platform releases" },
              { key: "notifyNewFeatures", label: "New Features", desc: "When new capabilities are added" },
              { key: "notifyTierUpsell", label: "Plan Suggestions", desc: "Tips on upgrading your plan" },
              { key: "notifyUsageAlerts", label: "Usage Alerts", desc: "Low balance and high usage warnings" },
            ].map(({ key, label, desc }) => (
              <Toggle
                key={key}
                checked={!!prefs[key]}
                onChange={(val) => updatePref(key, val)}
                label={label}
                desc={desc}
              />
            ))}
          </div>
        </GlassCard>

        {/* ── Region ── */}
        <GlassCard className="p-8">
          <SectionHeader icon={Globe} title="Region" subtitle="Formats pricing and dates correctly for your location" />
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">
                Country
              </label>
              <div className="relative">
                <select
                  value={prefs.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full bg-surface border border-border-glow rounded-xl px-5 py-4 text-text-primary outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(207,255,4,0.1)] transition-all appearance-none cursor-pointer"
                >
                  {COUNTRIES.map(({ code, name }) => (
                    <option key={code} value={code} className="bg-surface-raised">{name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-tech text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1">
                Currency <span className="text-primary/60 normal-case tracking-normal">(auto-matched)</span>
              </label>
              <div className="w-full bg-surface-raised border border-border-glow rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-text-primary text-sm">
                  {COUNTRY_TO_CURRENCY[prefs.country]?.name ?? prefs.currency}
                </span>
                <span className="text-[10px] font-tech text-primary/60 uppercase tracking-widest">Auto</span>
              </div>
              <p className="text-[10px] text-text-secondary/60 ml-1">Currency is automatically matched to your country.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Save Bar */}
      <div className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${dirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-3 bg-surface-raised border border-border-glow rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-text-secondary font-medium">You have unsaved changes</p>
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl shadow-neon-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : (
              <Save size={14} className="mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
