import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MessageSquare,
  BookOpen,
  Shield,
  FileText,
  CreditCard,
  Stethoscope,
  TestTube,
  Cog,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";

/** tiny reveal-on-scroll helper */
function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, show };
}
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, show } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out will-change-transform ${className} ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

type FAQ = { q: string; a: string; tags: string[] };

const FAQS: FAQ[] = [
  {
    q: "How do I book an appointment?",
    a: "Go to Doctors → choose a specialist → select a time slot. You’ll receive confirmation by email and in your dashboard.",
    tags: ["appointments", "booking", "schedule"],
  },
  {
    q: "Can I reschedule or cancel my appointment?",
    a: "Yes. Open your appointment from the Dashboard → Manage → Reschedule or Cancel. Some clinics require 24-hour notice.",
    tags: ["appointments", "reschedule", "cancel"],
  },
  {
    q: "How do I book diagnostic tests?",
    a: "Navigate to Tests → pick your test → follow the preparation guide → select date & time → confirm.",
    tags: ["tests", "labs", "diagnostics"],
  },
  {
    q: "What payment methods are supported?",
    a: "We support major cards, UPI/wallets (region-specific), and invoices for corporate accounts.",
    tags: ["billing", "payments", "invoice", "card"],
  },
  {
    q: "Is my medical data secure?",
    a: "Yes. We use encryption in transit and at rest. Access is role-based and logged. See our Privacy Policy for details.",
    tags: ["privacy", "security", "hipaa"],
  },
  {
    q: "I forgot my password. What should I do?",
    a: "Click Sign In → Forgot password, then follow the email instructions to reset it safely.",
    tags: ["account", "password", "login"],
  },
  {
    q: "My payment failed. What now?",
    a: "Payments can fail due to bank or network issues. Try again in a few minutes or contact support with the error ID.",
    tags: ["billing", "payments", "errors"],
  },
];

export default function HelpCenter() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.tags.some((t) => t.includes(q))
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes blob { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(8px,-12px) scale(1.04) } }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-10 w-72 h-72 rounded-full bg-primary-300/30 blur-3xl animate-[blob_14s_ease-in-out_infinite]" />
          <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl animate-[blob_18s_ease-in-out_infinite]" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl animate-[blob_16s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <Reveal className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6 shadow-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Help Center
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">help you?</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search FAQs or browse popular topics below.
            </p>
          </Reveal>

          {/* Search */}
          <Reveal delay={80}>
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search appointments, tests, billing, account…"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick topics */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "Appointments", d: "Book, reschedule, or cancel visits.", icon: <Stethoscope className="h-6 w-6" />, color: "primary" },
            { t: "Diagnostic Tests", d: "Prep guides and lab results.", icon: <TestTube className="h-6 w-6" />, color: "green" },
            { t: "Billing & Payments", d: "Methods, refunds, invoices.", icon: <CreditCard className="h-6 w-6" />, color: "purple" },
            { t: "Account & Security", d: "Login, password, profiles.", icon: <Shield className="h-6 w-6" />, color: "blue" },
            { t: "Policies", d: "Privacy & Terms of Service.", icon: <FileText className="h-6 w-6" />, color: "amber" },
            { t: "Technical Support", d: "Troubleshooting & bugs.", icon: <Cog className="h-6 w-6" />, color: "slate" },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1.5`}
              >
                <div
                  className={`w-12 h-12 rounded-xl grid place-items-center mb-4 ${
                    c.color === "primary"
                      ? "bg-primary-100 text-primary-700"
                      : c.color === "green"
                      ? "bg-green-100 text-green-700"
                      : c.color === "purple"
                      ? "bg-purple-100 text-purple-700"
                      : c.color === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : c.color === "amber"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {c.icon}
                </div>
                <div className="font-semibold text-gray-900">{c.t}</div>
                <p className="text-gray-600">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently asked questions</h2>
          </Reveal>
          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-100 bg-white shadow-lg">
            {filtered.map((f, idx) => (
              <FAQItem key={idx} q={f.q} a={f.a} />
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-gray-600">No results. Try a different keyword.</div>
            )}
          </div>

          {/* Contact fallback */}
          <Reveal delay={80}>
            <div className="mt-8 rounded-2xl border border-gray-100 bg-gradient-to-r from-primary-600 to-blue-600 p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                <div className="font-medium">Still need help? Our support team is available 24/7.</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:support@medicarepro.com" className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-primary-700 hover:bg-blue-50">
                  <Mail className="h-4 w-4 mr-2" /> Email Support
                </a>
                <a href="tel:+15551234567" className="inline-flex items-center px-4 py-2 rounded-xl border border-white/70 hover:bg-white/10">
                  <Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((s) => !s)}
      className="w-full text-left p-5 focus:outline-none"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="font-medium text-gray-900">{q}</div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-gray-600 mt-3">{a}</p>
      </div>
    </button>
  );
}
