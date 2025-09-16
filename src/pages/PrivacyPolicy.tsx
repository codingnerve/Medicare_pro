import { useEffect, useRef, useState } from "react";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

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

export default function PrivacyPolicy() {
  const updated = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <Reveal className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6 shadow-sm">
              <Lock className="h-4 w-4 mr-2" />
              Privacy Policy
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Your privacy matters</h1>
            <p className="text-gray-600">Last updated: {updated}</p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Card title="Overview" icon={<FileText className="h-5 w-5" />}>
              We are committed to protecting your personal and health information. This Policy explains what we collect, how we use it, and your choices.
            </Card>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Reveal>
              <Card title="Information we collect" icon={<Shield className="h-5 w-5" />}>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Account data (name, email, phone, role).</li>
                  <li>Health/clinical data you provide (appointments, tests, results).</li>
                  <li>Payment information (handled by PCI-compliant processors).</li>
                  <li>Device and usage data (cookies, logs) for security and performance.</li>
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={60}>
              <Card title="How we use information" icon={<CheckCircle2 className="h-5 w-5" />}>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>To deliver services (bookings, reminders, results).</li>
                  <li>To secure our platform and prevent fraud.</li>
                  <li>To comply with legal obligations.</li>
                  <li>With consent, to send updates and product communications.</li>
                </ul>
              </Card>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Reveal>
              <Card title="Data sharing" icon={<Shield className="h-5 w-5" />}>
                We may share data with healthcare professionals, labs, or payment partners as required to provide services, subject to confidentiality and applicable laws.
              </Card>
            </Reveal>
            <Reveal delay={60}>
              <Card title="Security" icon={<Lock className="h-5 w-5" />}>
                We use encryption in transit and at rest, role-based access, and auditing. No system is 100% secure—please use strong passwords and protect your account.
              </Card>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Reveal>
              <Card title="Your rights" icon={<CheckCircle2 className="h-5 w-5" />}>
                Depending on your region, you may request access, correction, deletion, or portability of your data. Contact us at privacy@medicarepro.com.
              </Card>
            </Reveal>
            <Reveal delay={60}>
              <Card title="Retention & international transfers" icon={<FileText className="h-5 w-5" />}>
                We retain data as long as necessary for services and legal requirements. Transfers comply with applicable data transfer frameworks and safeguards.
              </Card>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <Card title="Contact" icon={<Lock className="h-5 w-5" />}>
              For privacy questions or requests, email <a href="mailto:privacy@medicarepro.com" className="text-primary-600 hover:underline">privacy@medicarepro.com</a>.
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        {icon && <span className="text-primary-600">{icon}</span>}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
