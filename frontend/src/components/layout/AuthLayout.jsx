import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left branding — conversational, not corporate */}
      <div className="hidden lg:flex lg:w-[44%] bg-primary-700 flex-col justify-between p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center">
              <Leaf size={14} />
            </div>
            <span className="text-sm font-semibold tracking-tight">CleanTrack AI</span>
          </div>

          <h1 className="text-2xl font-bold leading-snug mb-3 max-w-xs">
            Report garbage.<br />
            Track cleanup.<br />
            Hold the city accountable.
          </h1>
          <p className="text-primary-200 text-sm leading-relaxed max-w-sm">
            4,200 citizens in Bengaluru are already using CleanTrack
            to make their neighbourhoods cleaner. It takes 30 seconds to file
            a report. Average resolution: 14 hours.
          </p>
        </div>

        <div className="relative z-10">
          {/* Testimonial instead of stats — feels human */}
          <blockquote className="text-sm text-primary-100 leading-relaxed mb-3 max-w-xs italic">
            "I reported an overflowing bin near my kids' school. It was cleaned
            the next morning. First time anything municipal actually worked."
          </blockquote>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[9px] font-bold">PS</div>
            <div>
              <p className="text-xs font-medium">Priya Sharma</p>
              <p className="text-[10px] text-primary-300">Indiranagar, Bengaluru</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-900">CleanTrack AI</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
