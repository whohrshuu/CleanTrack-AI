import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

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

export default function AboutPage() {
  return (
    <div>
      {/* Header — not a generic "About Us" hero */}
      <section className="max-w-3xl mx-auto px-5 pt-16 pb-12">
        <Fade>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">About</p>
          <h1 className="text-3xl font-bold text-neutral-900 leading-tight">
            We got tired of complaints<br />going into the void.
          </h1>
        </Fade>
        <Fade delay={0.08}>
          <p className="text-[15px] text-neutral-500 mt-4 leading-relaxed max-w-xl">
            Every Indian city has the same problem. You call the municipal helpline, file a complaint,
            and nothing happens. Maybe someone shows up a week later. Maybe not. You never find out
            what happened, and there's no one to hold accountable.
          </p>
          <p className="text-[15px] text-neutral-500 mt-3 leading-relaxed max-w-xl">
            We built CleanTrack because we thought technology should fix this — not with
            fancy AI for the sake of it, but with simple, working infrastructure that connects
            the person who sees garbage with the person who cleans it.
          </p>
        </Fade>
      </section>

      {/* What we actually do — not "Our Mission" template */}
      <section className="bg-neutral-50 border-y border-border py-12">
        <div className="max-w-3xl mx-auto px-5">
          <Fade>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">How it works in practice</p>
          </Fade>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            <Fade delay={0.04}>
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">Citizen reports garbage</p>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Takes a photo, drops a GPS pin. Our AI validates the image is real (not downloaded,
                  not a duplicate), and the complaint enters the system.
                </p>
              </div>
            </Fade>
            <Fade delay={0.08}>
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">Worker gets the task</p>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Assigned automatically based on proximity and shift. No dispatcher needed.
                  Worker sees the location, navigates there, cleans up, uploads proof.
                </p>
              </div>
            </Fade>
            <Fade delay={0.12}>
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">AI verifies completion</p>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Before-and-after comparison through computer vision. No rubber-stamping.
                  The citizen gets a notification with the result.
                </p>
              </div>
            </Fade>
            <Fade delay={0.16}>
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">Government sees everything</p>
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Ward-level dashboards, SLA tracking, zone comparisons. The kind of data
                  that actually helps municipal commissioners make decisions.
                </p>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* Numbers — not a flashy stat grid */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5">
          <Fade>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">Bengaluru pilot numbers</p>
          </Fade>
          <div className="flex flex-wrap gap-x-14 gap-y-4">
            {[
              { val: '2,847', label: 'complaints resolved since launch' },
              { val: '14.5h', label: 'avg resolution time' },
              { val: '342', label: 'field workers on the platform' },
              { val: '84%', label: 'SLA compliance rate' },
            ].map((s, i) => (
              <Fade key={i} delay={i * 0.05}>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{s.val}</p>
                  <p className="text-[13px] text-neutral-500">{s.label}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with — not a grid of logo boxes */}
      <section className="bg-neutral-50 border-y border-border py-12">
        <div className="max-w-3xl mx-auto px-5">
          <Fade>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Partners & supporters</p>
            <p className="text-[15px] text-neutral-500 leading-relaxed">
              CleanTrack is built in collaboration with BBMP (Bruhat Bengaluru Mahanagara Palike),
              supported by the Smart Cities Mission, and uses research from IISc Bengaluru's
              environmental engineering department. We're not a product looking for a problem —
              we're a solution built inside the problem.
            </p>
          </Fade>
        </div>
      </section>

      {/* Bottom — personal, no CTA block */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5">
          <Fade>
            <p className="text-[15px] text-neutral-500 leading-relaxed">
              If you're a municipality looking to modernize waste complaint handling,
              or a civic tech enthusiast who wants to contribute — reach out at{' '}
              <a href="mailto:team@cleantrack.ai" className="text-primary-600 font-medium hover:text-primary-700">
                team@cleantrack.ai
              </a>.
              We're a small team and we read every email.
            </p>
          </Fade>
        </div>
      </section>
    </div>
  );
}
