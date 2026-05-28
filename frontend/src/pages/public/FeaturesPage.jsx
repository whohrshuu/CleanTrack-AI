import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Brain, Route, Award, BarChart3, Building2, MapPin, Bell, Shield, Smartphone, Users, Clock } from 'lucide-react';

const roles = [
  {
    id: 'citizen', label: 'Citizens', icon: Smartphone,
    features: [
      { icon: Camera, title: 'Photo-Based Reporting', desc: 'Snap a photo of garbage, and AI validates the complaint instantly. No paperwork, no phone calls.' },
      { icon: MapPin, title: 'GPS Location Tagging', desc: 'Automatic geolocation tags your complaint to the exact spot. Manual address entry also supported.' },
      { icon: Bell, title: 'Real-Time Status Updates', desc: 'Track your complaint from submission to resolution. Get notifications at every stage.' },
      { icon: Award, title: 'Eco Points & Rewards', desc: 'Earn points for verified complaints. Climb the city leaderboard and unlock badges.' },
    ],
  },
  {
    id: 'worker', label: 'Field Workers', icon: Users,
    features: [
      { icon: Route, title: 'Smart Task Routing', desc: 'Tasks are auto-assigned based on proximity and availability. Navigate directly from the app.' },
      { icon: Camera, title: 'Proof of Completion', desc: 'Upload after-cleaning photos for AI verification. Before-and-after comparison ensures accountability.' },
      { icon: Clock, title: 'Shift Management', desc: 'Clock in and out with one tap. Track daily task completion and performance metrics.' },
      { icon: Shield, title: 'Fair Workload', desc: 'Algorithm distributes tasks evenly across workers based on capacity and zone coverage.' },
    ],
  },
  {
    id: 'admin', label: 'Dept. Admins', icon: BarChart3,
    features: [
      { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Monitor complaint trends, category breakdowns, and zone performance in real-time.' },
      { icon: MapPin, title: 'Complaint Heatmap', desc: 'Visualize complaint density on an interactive map. Identify hotspots before they escalate.' },
      { icon: Brain, title: 'AI Fraud Detection', desc: 'ML models detect fake complaints, duplicate submissions, and fraudulent images automatically.' },
      { icon: Users, title: 'Worker Management', desc: 'Track worker availability, performance ratings, and task completion across all centers.' },
    ],
  },
  {
    id: 'gov', label: 'Government', icon: Building2,
    features: [
      { icon: Building2, title: 'City-Wide Monitoring', desc: 'Bird\'s-eye view of waste management across all wards and zones. Perfect for policy decisions.' },
      { icon: Shield, title: 'Escalation Management', desc: 'Handle critical escalations from departments. Assign resources and track resolution.' },
      { icon: BarChart3, title: 'SLA Compliance Tracking', desc: 'Monitor service-level agreement compliance across all departments with drill-down capability.' },
      { icon: Route, title: 'Export & Reporting', desc: 'Generate PDF/CSV reports for auditing, budgeting, and government review processes.' },
    ],
  },
];

export default function FeaturesPage() {
  const [activeRole, setActiveRole] = useState('citizen');
  const current = roles.find((r) => r.id === activeRole);

  return (
    <div>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">Platform Features</h1>
            <p className="text-base text-neutral-600 max-w-lg mx-auto">Every role gets purpose-built tools. Explore features designed for each stakeholder.</p>
          </motion.div>

          {/* Role Tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {roles.map((role) => (
              <button key={role.id} onClick={() => setActiveRole(role.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeRole === role.id ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                <role.icon size={16} /> {role.label}
              </button>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {current.features.map((feat, i) => (
              <motion.div key={`${activeRole}-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white border border-border rounded-lg p-5">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
                  <feat.icon size={16} className="text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">{feat.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
