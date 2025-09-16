import { useEffect, useRef, useState } from "react";
import { FileText, AlertCircle, } from "lucide-react";

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

export default function TermsOfService() {
  const updated = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <Reveal className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6 shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Terms of Service
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Please read carefully</h1>
            <p className="text-gray-600">Last updated: {updated}</p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Reveal>
            <Section title="1. Acceptance of Terms">
              By accessing or using MediCare Pro, you agree to these Terms and our Privacy Policy. If you do not agree, please discontinue use.
            </Section>
          </Reveal>

          <Reveal delay={40}>
            <Section title="2. Services">
              We provide tools for appointments, diagnostic test bookings, results, and payments. Features may change or be discontinued with notice when feasible.
            </Section>
          </Reveal>

          <Reveal delay={80}>
            <Section title="3. User Accounts & Responsibilities">
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under your credentials. You must provide accurate information and comply with applicable laws.
            </Section>
          </Reveal>

          <Reveal delay={120}>
            <Section title="4. Medical Disclaimer">
              MediCare Pro is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified providers.
            </Section>
          </Reveal>

          <Reveal delay={160}>
            <Section title="5. Payments & Billing">
              Payments are processed by third-party providers. You authorize us to charge your selected method. Refunds, if any, are subject to clinic and test partner policies.
            </Section>
          </Reveal>

          <Reveal delay={200}>
            <Section title="6. Prohibited Conduct">
              You agree not to misuse the platform, interfere with its operation, attempt unauthorized access, or upload harmful content.
            </Section>
          </Reveal>

          <Reveal delay={240}>
            <Section title="7. Intellectual Property">
              The platform and its content are protected by intellectual property laws. You may not copy, modify, or distribute content without permission.
            </Section>
          </Reveal>

          <Reveal delay={280}>
            <Section title="8. Termination">
              We may suspend or terminate access for violations of these Terms or for security concerns. You may stop using the service at any time.
            </Section>
          </Reveal>

          <Reveal delay={320}>
            <Section title="9. Limitation of Liability">
              To the maximum extent permitted by law, MediCare Pro shall not be liable for indirect, incidental, or consequential damages.
            </Section>
          </Reveal>

          <Reveal delay={360}>
            <Section title="10. Changes to Terms">
              We may update these Terms periodically. Continued use after changes indicates acceptance of the revised Terms.
            </Section>
          </Reveal>

          <Reveal delay={400}>
            <Section title="11. Contact">
              Questions? Email <a href="mailto:legal@medicarepro.com" className="text-primary-600 hover:underline">legal@medicarepro.com</a>.
            </Section>
          </Reveal>

          <Reveal delay={440}>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <p className="text-sm">
                This sample Terms of Service is for demonstration. Consult legal counsel to tailor it to your jurisdiction and business.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}
