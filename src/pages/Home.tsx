import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import {

  Stethoscope,
  TestTube,
  Calendar,
  CreditCard,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  Heart,
  Activity,
  Zap,
  Award,
  Phone,
  Mail,
 
} from "lucide-react";

/** Reveal on scroll (no deps) */
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

export function Home() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleBookTest = () => {
    navigate(isAuthenticated ? "/tests" : "/login");
  };
  const handleBookAppointment = () => {
    navigate(isAuthenticated ? "/book-appointment" : "/login");
  };

  return (
    <div className="min-h-screen bg-white">
    
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden">
        {/* gradient mesh bg */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-primary-300/30 blur-3xl animate-[blob_14s_ease-in-out_infinite]" />
          <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl animate-[blob_18s_ease-in-out_infinite]" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl animate-[blob_16s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />
          {/* dotted pattern overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* floating icons */}
        <Heart
          className="hidden md:block absolute left-10 top-20 h-8 w-8 text-rose-500/50"
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <Activity
          className="hidden lg:block absolute right-16 top-28 h-8 w-8 text-primary-600/50"
          style={{ animation: "float 7s 0.4s ease-in-out infinite" }}
        />
        <Award
          className="hidden md:block absolute left-1/3 bottom-12 h-8 w-8 text-amber-500/50"
          style={{ animation: "float 8s 0.8s ease-in-out infinite" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="text-center">
            <Reveal>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-8 shadow-sm">
                <Heart className="h-4 w-4 mr-2" />
                Trusted by 10,000+ Patients
                <span className="ml-3 relative inline-block">
                  <span className="absolute inset-0 bg-white/50 skew-x-12 rounded-full" style={{ animation: "shine 2.4s ease-in-out infinite" }} />
                </span>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600">
                  {" "}
                  Our Priority
                </span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Experience world-class healthcare with our comprehensive platform.
                Connect with top doctors, book tests, manage appointments, and
                make secure payments — all in one place.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={180}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/doctors"
                      className="group inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:scale-[1.03]"
                    >
                      Find Doctors
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/tests"
                      className="group inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03] bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 shadow-md"
                    >
                      Book Tests
                      <TestTube className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:scale-[1.03]"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/login"
                      className="group inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03] bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 shadow-md"
                    >
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={220}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { k: "500+", v: "Expert Doctors" },
                  { k: "10K+", v: "Happy Patients" },
                  { k: "50+", v: "Test Types" },
                  { k: "24/7", v: "Support" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="absolute -right-10 -top-10 w-24 h-24 bg-primary-100 rounded-full" />
                    <div className="text-3xl font-bold text-primary-600 mb-1">{s.k}</div>
                    <div className="text-gray-600">{s.v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className=" bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for
                <span className="text-primary-600"> Better Healthcare</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                All your healthcare management in one clean, secure experience.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* card 1 */}
            <Reveal>
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-primary-100 group-hover:bg-primary-600 transition-colors">
                    <Stethoscope className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Doctors</h3>
                  <p className="text-gray-600 mb-6">
                    Board-certified specialists across 20+ fields with verified reviews.
                  </p>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                  >
                    Find Doctors
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* card 2 */}
            <Reveal delay={60}>
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-green-100 group-hover:bg-green-600 transition-colors">
                    <TestTube className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Diagnostic Tests</h3>
                  <p className="text-gray-600 mb-6">
                    Book screenings with prep instructions and fast, accurate results.
                  </p>
                  <button
                    onClick={handleBookTest}
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
                  >
                    Book Tests
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* card 3 */}
            <Reveal delay={120}>
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-blue-100 group-hover:bg-blue-600 transition-colors">
                    <Calendar className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scheduling</h3>
                  <p className="text-gray-600 mb-6">
                    Book, reschedule, and track with real-time availability & reminders.
                  </p>
                  <button
                    onClick={handleBookAppointment}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* card 4 */}
            <Reveal delay={180}>
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-purple-100 group-hover:bg-purple-600 transition-colors">
                    <CreditCard className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                  <p className="text-gray-600 mb-6">
                    Multiple payment options with full transaction history.
                  </p>
                  <Link
                    to="/payments"
                    className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700"
                  >
                    View Payments
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-primary-600">MediCare Pro</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Exceptional care through innovation, trust, and patient-first design.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-10 w-10" />,
                t: "HIPAA Compliant",
                d: "Your data is protected with enterprise-grade security.",
                color: "primary",
              },
              {
                icon: <Clock className="h-10 w-10" />,
                t: "24/7 Availability",
                d: "Access records & book appointments anywhere, anytime.",
                color: "green",
              },
              {
                icon: <Users className="h-10 w-10" />,
                t: "Expert Network",
                d: "Board-certified specialists across multiple specialties.",
                color: "blue",
              },
              {
                icon: <Zap className="h-10 w-10" />,
                t: "Fast & Reliable",
                d: "Instant confirmations and lightning-fast test results.",
                color: "purple",
              },
            ].map((c, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="text-center group rounded-2xl bg-white border border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-colors
                    ${
                      c.color === "primary"
                        ? "bg-primary-100 group-hover:bg-primary-600 text-primary-600 group-hover:text-white"
                        : c.color === "green"
                        ? "bg-green-100 group-hover:bg-green-600 text-green-600 group-hover:text-white"
                        : c.color === "blue"
                        ? "bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white"
                        : "bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white"
                    }`}
                  >
                    {c.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{c.t}</h3>
                  <p className="text-gray-600">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Our <span className="text-primary-600">Patients Say</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real stories from people who trust MediCare Pro.
              </p>
            </div>
          </Reveal>

          {/* mobile-friendly carousel (snap) */}
          <div className="grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              {
                text:
                  "The appointment booking process was incredibly smooth. I found my cardiologist within minutes and could book for the same week!",
                badge: "SJ",
                color: "primary",
                name: "Sarah Johnson",
                role: "Cardiology Patient",
              },
              {
                text:
                  "The test booking feature is amazing. I got detailed preparation instructions and results were available online within 24 hours.",
                badge: "MR",
                color: "green",
                name: "Michael Rodriguez",
                role: "Lab Test Patient",
              },
              {
                text:
                  "The payment system is so convenient. I can pay for all my medical expenses in one place and track my spending easily.",
                badge: "ED",
                color: "blue",
                name: "Emily Davis",
                role: "Regular Patient",
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 80} className="snap-center md:snap-none">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i2) => (
                      <Star key={i2} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">“{t.text}”</p>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 font-bold text-lg
                    ${
                      t.color === "primary"
                        ? "bg-primary-100 text-primary-600"
                        : t.color === "green"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    >
                      {t.badge}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-gray-600 text-sm">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600 relative overflow-hidden">
        {/* subtle pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.25) 2px, transparent 2px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Join thousands who trust MediCare Pro for seamless, secure care.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/book-appointment"
                    className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-white text-primary-600 hover:bg-gray-50 transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-2xl"
                  >
                    Book Your Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all transform hover:scale-[1.03]"
                  >
                    Find Doctors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-white text-primary-600 hover:bg-gray-50 transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-2xl"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all transform hover:scale-[1.03]"
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">MediCare Pro</h3>
              <p className="text-gray-400 mb-6">
                Your trusted partner in healthcare—innovative tech with compassionate care.
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                <div className="flex items-center text-gray-300">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>support@medicarepro.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/doctors" className="hover:text-white transition-colors">Find Doctors</Link></li>
                <li><Link to="/tests" className="hover:text-white transition-colors">Book Tests</Link></li>
                <li><Link to="/appointments" className="hover:text-white transition-colors">Appointments</Link></li>
                <li><Link to="/payments" className="hover:text-white transition-colors">Payments</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                   <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
               <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>

             
  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MediCare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
