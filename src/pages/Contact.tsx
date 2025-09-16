// src/pages/Contact.tsx
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Shield,
  Building,
  MessageSquare,
  Loader2,
  Globe,
  Linkedin,
  Twitter,
} from "lucide-react";

/** reveal-on-scroll hook (no deps) */
function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, show };
}
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  message: string;
};

export default function Contact() {
  // local keyframes
  const style = `
    @keyframes blob { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(8px,-12px) scale(1.04) } }
    @keyframes shine { 0% { transform: translateX(-150%) } 100% { transform: translateX(150%) } }
  `;

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "general",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^[0-9+\-\s()]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (!form.subject.trim()) e.subject = "Please enter a subject";
    if (!form.message.trim()) e.message = "Please write your message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setToast(null);
    try {
      // hit your API (adjust the url to your backend route)
      const res = await fetch(`${(import.meta as any).env.  VITE_API_URL}|| "http://localhost:5000/api"}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok)
      setToast({ type: "ok", msg: "Thanks! We’ve received your message and will respond shortly." });
      setForm({ name: "", email: "", phone: "", subject: "", department: "general", message: "" });
    } catch (e: any) {
      setToast({ type: "err", msg: "Could not send message right now. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{style}</style>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-10 w-72 h-72 rounded-full bg-primary-300/30 blur-3xl animate-[blob_14s_ease-in-out_infinite]" />
          <div className="absolute top-16 right-0 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl animate-[blob_18s_ease-in-out_infinite]" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl animate-[blob_16s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25px 25px, rgba(5,150,105,0.08) 2px, transparent 2px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Reveal className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6 shadow-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              We’d love to hear from you
              <span className="ml-3 relative inline-block overflow-hidden rounded-full">
                <span
                  className="absolute inset-0 bg-white/40 skew-x-12"
                  style={{ animation: "shine 2.6s ease-in-out infinite" }}
                />
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">MediCare Pro</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Questions, feedback, or support — our team is here to help 24/7.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8">
          {/* LEFT: contact info + map */}
          <div className="lg:col-span-2 space-y-8">
            <Reveal>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in touch</h2>
                <p className="text-gray-600 mb-6">
                  Choose any channel below, or send us a message — we usually reply within a few hours.
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 grid place-items-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Call us</div>
                      <div className="text-gray-600">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 grid place-items-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-gray-600">support@medicarepro.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Head Office</div>
                      <div className="text-gray-600">
                        221B Health Blvd, Suite 42, San Francisco, CA 94107
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 grid place-items-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Hours</div>
                      <div className="text-gray-600">Mon–Sun: 24/7 Support</div>
                    </div>
                  </div>
                </div>

                {/* social */}
                <div className="mt-6 flex items-center gap-4 text-gray-500">
                  <a href="#" className="hover:text-gray-700 transition-colors" aria-label="Website">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-gray-700 transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-gray-700 transition-colors" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                <iframe
                  title="MediCare Pro Location"
                  className="w-full h-72 md:h-80"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019501882892!2d-122.40136392437672!3d37.78799421151862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d2c0b0a1%3A0x1234567890abcdef!2sYour%20Clinic!5e0!3m2!1sen!2sus!4v1699999999999"
                />
              </div>
            </Reveal>

            {/* FAQs */}
            <Reveal delay={140}>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h3>
                <Accordion
                  items={[
                    {
                      q: "How quickly will I get a response?",
                      a: "We aim to respond within a few hours (usually much faster). Urgent medical matters should be handled via phone or emergency services.",
                    },
                    {
                      q: "Can I change or cancel my appointment?",
                      a: "Yes. Use your dashboard or contact us with your booking ID. Some specialties may require 24-hour notice.",
                    },
                    {
                      q: "Is my data secure?",
                      a: "Absolutely. We use industry-standard encryption and follow strict privacy controls.",
                    },
                  ]}
                />
              </div>
            </Reveal>
          </div>

          {/* RIGHT: form */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="relative rounded-2xl border border-gray-100 bg-white shadow-lg p-6 md:p-8">
                <div className="absolute -top-8 -right-6 w-40 h-40 bg-primary-200/30 rounded-full blur-2xl pointer-events-none" />
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-600 mb-6">
                  Fill the form and our support team will get back to you shortly.
                </p>

                {toast && (
                  <div
                    className={`mb-6 rounded-xl p-3 text-sm ${
                      toast.type === "ok"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                    role="status"
                  >
                    {toast.msg}
                  </div>
                )}

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label>Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby="err-name"
                    />
                    {errors.name && <Error id="err-name">{errors.name}</Error>}
                  </div>

                  <div className="col-span-1">
                    <Label>Email</Label>
                    <Input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      type="email"
                      aria-invalid={!!errors.email}
                      aria-describedby="err-email"
                    />
                    {errors.email && <Error id="err-email">{errors.email}</Error>}
                  </div>

                  <div className="col-span-1">
                    <Label>Phone (optional)</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 555 000 1234"
                      aria-invalid={!!errors.phone}
                      aria-describedby="err-phone"
                    />
                    {errors.phone && <Error id="err-phone">{errors.phone}</Error>}
                  </div>

                  <div className="col-span-1">
                    <Label>Department</Label>
                    <Select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      options={[
                        { value: "general", label: "General" },
                        { value: "appointments", label: "Appointments" },
                        { value: "billing", label: "Billing" },
                        { value: "labs", label: "Labs" },
                        { value: "technical", label: "Technical Support" },
                      ]}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Subject</Label>
                    <Input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help?"
                      aria-invalid={!!errors.subject}
                      aria-describedby="err-subject"
                    />
                    {errors.subject && <Error id="err-subject">{errors.subject}</Error>}
                  </div>

                  <div className="md:col-span-2">
                    <Label>Message</Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={6}
                      placeholder="Tell us a bit more about your request…"
                      aria-invalid={!!errors.message}
                      aria-describedby="err-message"
                    />
                    {errors.message && <Error id="err-message">{errors.message}</Error>}
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-emerald-600" />
                      Your data is protected and never shared.
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold shadow-md hover:bg-primary-700 transition-colors disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BOTTOM CALLOUT */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-primary-600 to-blue-600 p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Building className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-semibold">Need immediate assistance?</h3>
                  <p className="text-blue-100">Call our 24/7 support line and speak to a specialist now.</p>
                </div>
              </div>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-blue-50 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" /> +1 (555) 123-4567
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------- tiny UI primitives ---------- */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}
function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${props.className || ""}`}
    />
  );
}
function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors ${props.className || ""}`}
    />
  );
}
function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
function Error({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="mt-1 text-sm text-rose-600">
      {children}
    </p>
  );
}

/* ---------- simple accordion ---------- */
function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-gray-200">
      {items.map((it, i) => (
        <button
          key={i}
          onClick={() => setOpen(open === i ? null : i)}
          className="w-full text-left py-3"
          aria-expanded={open === i}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{it.q}</span>
            <span className={`ml-3 transition-transform ${open === i ? "rotate-45" : ""}`}>＋</span>
          </div>
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
              open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-gray-600 mt-2">{it.a}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
