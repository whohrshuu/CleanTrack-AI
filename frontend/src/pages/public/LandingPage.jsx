import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
  Camera, ScanSearch, Route, CheckCircle2, MapPin, Brain,
  Award, BarChart3, Landmark, ArrowRight, Leaf, ChevronRight,
  ArrowUpRight, Zap, Users, Clock, Shield,
} from 'lucide-react';

/* ── Counter hook ── */
function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const frame = useRef(null);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else setCount(end);
    }
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [end, duration, start]);
  return count;
}

/* ── Fade wrapper ── */
function Fade({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const statsRef = useRef(null);
  const statsVisible = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        {/* Subtle dot grid — feels handmade */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #2d6a4f 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-xl">
            <Fade>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-xs font-medium text-primary-700 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                Live in 12 municipalities
              </div>
            </Fade>

            <Fade delay={0.06}>
              <h1 className="text-[2.5rem] sm:text-5xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
                Your city's garbage<br />
                problem, <span className="text-primary-500">solved.</span>
              </h1>
            </Fade>

            <Fade delay={0.12}>
              <p className="mt-5 text-neutral-500 text-[15px] leading-relaxed max-w-md">
                Citizens report. AI verifies. Workers clean. No more complaints lost
                in municipal bureaucracy — every report gets tracked, assigned, and
                resolved with full transparency.
              </p>
            </Fade>

            <Fade delay={0.18}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow">
                  Start reporting <ArrowRight size={15} />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                  See how it works <ChevronRight size={14} />
                </a>
              </div>
            </Fade>

            {/* Social proof — feels real, not template */}
            <Fade delay={0.24}>
              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['PS', 'KR', 'MA', 'LD'].map((initials, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-neutral-500">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">4,200+</span> citizens actively reporting in Bengaluru
                </div>
              </div>
            </Fade>
          </div>

          {/* Dashboard preview — offset, not centered */}
          <Fade delay={0.3}>
            <div className="mt-12 sm:mt-0 sm:absolute sm:right-0 sm:top-20 sm:w-[420px] lg:w-[480px]">
              <div className="rounded-xl border border-border bg-white shadow-lg overflow-hidden rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-50 border-b border-border">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-[10px] text-neutral-400 font-mono">cleantrack.ai/admin</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-border">
                      <p className="text-[10px] text-neutral-400 mb-0.5">Today</p>
                      <p className="text-lg font-bold text-neutral-800">23</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border">
                      <p className="text-[10px] text-neutral-400 mb-0.5">Resolved</p>
                      <p className="text-lg font-bold text-success-500">2,103</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border">
                      <p className="text-[10px] text-neutral-400 mb-0.5">SLA</p>
                      <p className="text-lg font-bold text-primary-500">84%</p>
                    </div>
                  </div>
                  {/* Fake chart bars */}
                  <div className="flex items-end gap-1.5 h-16 px-1">
                    {[35, 55, 40, 70, 50, 80, 60, 45, 65, 75, 55, 42].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-primary-100" style={{ height: `${h}%` }}>
                        <div className="w-full rounded-sm bg-primary-400" style={{ height: `${Math.random() * 40 + 30}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-success-50 border border-success-200">
                    <CheckCircle2 size={13} className="text-success-500 flex-shrink-0" />
                    <span className="text-[11px] text-success-600">Complaint #1847 verified and closed</span>
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS — horizontal, not grid ═══════ */}
      <section id="how-it-works" className="bg-neutral-50 border-y border-border py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5">
          <Fade>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-2xl font-bold text-neutral-900">Report → Verify → Clean → Done</h2>
            <p className="text-sm text-neutral-500 mt-2 max-w-md">
              The entire lifecycle of a waste complaint — from your phone to a clean street.
            </p>
          </Fade>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { n: '01', icon: Camera, title: 'Snap & report', desc: 'Photograph the garbage, drop a pin. Takes 30 seconds.', accent: 'border-t-primary-400' },
              { n: '02', icon: ScanSearch, title: 'AI checks it', desc: 'Our model scores image authenticity and flags duplicates instantly.', accent: 'border-t-accent-400' },
              { n: '03', icon: Route, title: 'Nearest crew assigned', desc: 'Routing algorithm picks the closest available worker automatically.', accent: 'border-t-warning-400' },
              { n: '04', icon: CheckCircle2, title: 'Cleaned & verified', desc: 'Worker uploads proof. AI compares before/after. You get notified.', accent: 'border-t-success-500' },
            ].map((step, i) => (
              <Fade key={step.n} delay={i * 0.07}>
                <div className={`bg-white rounded-lg border border-border border-t-2 ${step.accent} p-5 h-full`}>
                  <span className="text-[11px] font-bold text-neutral-300 uppercase">{step.n}</span>
                  <step.icon size={20} className="text-neutral-700 mt-3" />
                  <h3 className="text-sm font-semibold text-neutral-900 mt-2.5">{step.title}</h3>
                  <p className="text-[13px] text-neutral-500 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NUMBERS — NOT a symmetric grid ═══════ */}
      <section ref={statsRef} className="py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-5">
          <Fade>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">
              Since launch · Bengaluru pilot
            </p>
          </Fade>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {[
              { val: 2847, label: 'complaints resolved', suffix: '' },
              { val: 342, label: 'field workers', suffix: '' },
              { val: 98, label: 'wards covered', suffix: '' },
              { val: 84, label: 'SLA compliance', suffix: '%' },
            ].map((s, i) => {
              const count = useCounter(s.val, 2200, statsVisible);
              return (
                <Fade key={i} delay={i * 0.05}>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums">
                      {count.toLocaleString()}{s.suffix}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">{s.label}</p>
                  </div>
                </Fade>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES — not a 3x2 grid, mixed sizes ═══════ */}
      <section className="bg-neutral-50 border-y border-border py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5">
          <Fade>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Capabilities</p>
            <h2 className="text-2xl font-bold text-neutral-900">What you can actually do with this</h2>
          </Fade>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature card — larger first card */}
            <Fade delay={0} className="sm:col-span-2 lg:col-span-2">
              <div className="bg-white border border-border rounded-lg p-6 flex gap-5">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">Live complaint map</h3>
                  <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                    See every active complaint on a real-time heatmap. Ward-level drill-down, priority filtering,
                    and worker location overlay. Admins spot problem areas before citizens have to escalate.
                  </p>
                </div>
              </div>
            </Fade>

            <Fade delay={0.06}>
              <div className="bg-white border border-border rounded-lg p-5">
                <Brain size={18} className="text-accent-600 mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900">AI fraud detection</h3>
                <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                  Deep learning catches fake photos, duplicate submissions, and reused images from the internet.
                </p>
              </div>
            </Fade>

            <Fade delay={0.08}>
              <div className="bg-white border border-border rounded-lg p-5">
                <Route size={18} className="text-warning-600 mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900">Smart task routing</h3>
                <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                  Workers get tasks based on proximity, current workload, and shift schedule. No manual dispatching.
                </p>
              </div>
            </Fade>

            <Fade delay={0.1}>
              <div className="bg-white border border-border rounded-lg p-5">
                <Award size={18} className="text-primary-600 mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900">Citizen rewards</h3>
                <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                  Eco-points, leaderboards, badges. Turns civic duty into something people want to do again.
                </p>
              </div>
            </Fade>

            <Fade delay={0.12} className="sm:col-span-2 lg:col-span-2">
              <div className="bg-white border border-border rounded-lg p-6 flex gap-5">
                <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={18} className="text-accent-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">Government-grade analytics</h3>
                  <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                    SLA compliance tracking, zone performance comparison, monthly trend analysis, and exportable
                    reports built for municipal review meetings. Not vanity dashboards — actual decision-making tools.
                  </p>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══════ CTA — simple, not overdone ═══════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="bg-primary-700 rounded-xl p-8 sm:p-12 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <svg width="100%" height="100%"><defs><pattern id="cta-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#cta-dots)"/></svg>
            </div>
            <div className="relative max-w-md">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Your neighbourhood deserves better.
              </h2>
              <p className="text-sm text-primary-200 mt-3 leading-relaxed">
                It takes 30 seconds to report garbage. It takes us 14 hours on average to clean it.
                That's civic tech that actually delivers.
              </p>
              <Link to="/register"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white text-primary-700 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-sm">
                Create free account <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
