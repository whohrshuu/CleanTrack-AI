import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plus, ArrowRight, MapPin, ChevronRight, Clock, Leaf,
  AlertCircle, Trophy,
} from 'lucide-react';
import { formatStatus, getStatusColor, timeAgo, getPriorityConfig } from '@/utils/helpers';
import useAuthStore from '@/store/authStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const statusBadge = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-sky-50 text-sky-600',
  neutral: 'bg-neutral-100 text-neutral-500',
};

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  
  const [complaints, setComplaints] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, centersRes] = await Promise.all([
          api.get('/complaints/my'),
          api.get('/public/centers')
        ]);
        setComplaints(complaintsRes.data);
        setCenters(centersRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const active = complaints.filter((c) => ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status));
  const resolved = complaints.filter((c) => ['COMPLETED', 'VERIFIED', 'CLOSED'].includes(c.status));

  // Get time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] || 'Citizen';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Greeting — personal, not corporate */}
      <div className="mb-7">
        <h1 className="text-lg font-semibold text-neutral-900">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-[13px] text-neutral-500 mt-0.5">
          {active.length > 0
            ? `You have ${active.length} active complaint${active.length > 1 ? 's' : ''} being worked on.`
            : `All clear — no active complaints right now.`}
        </p>
      </div>

      {/* Quick report button — prominent, not buried */}
      <button
        onClick={() => navigate('/citizen/report')}
        className="w-full flex items-center justify-between px-4 py-3.5 mb-6 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center">
            <Plus size={16} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Report a waste issue</p>
            <p className="text-[11px] text-primary-200">Takes less than a minute</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-primary-200 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Stats — not identical cards, more organic */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-border rounded-lg px-4 py-3">
          <p className="text-2xl font-bold text-neutral-900">{active.length}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">active</p>
        </div>
        <div className="bg-white border border-border rounded-lg px-4 py-3">
          <p className="text-2xl font-bold text-neutral-900">{resolved.length}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">resolved</p>
        </div>
        <div className="bg-white border border-border rounded-lg px-4 py-3 relative overflow-hidden">
          <p className="text-2xl font-bold text-neutral-900">{user?.ecoPoints || 0}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">eco pts</p>
          <Trophy size={28} className="absolute -right-1 -bottom-1 text-primary-100" />
        </div>
      </div>

      {/* Main content — asymmetric layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Complaint feed — wider */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-border rounded-lg">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <h2 className="text-[13px] font-semibold text-neutral-800">Your complaints</h2>
              <Link to="/citizen/complaints" className="text-[11px] font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5">
                All <ChevronRight size={11} />
              </Link>
            </div>

            {complaints.length > 0 ? (
              complaints.slice(0, 4).map((c) => {
                const color = getStatusColor(c.status);
                const priority = getPriorityConfig(c.priority);
                return (
                  <Link key={c.id} to={`/citizen/complaints/${c.id}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-border/60 last:border-0">
                    <div className={`w-0.5 h-10 rounded-full mt-0.5 flex-shrink-0 ${priority.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-neutral-800 truncate">{c.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={10} className="text-neutral-400 flex-shrink-0" />
                        <span className="text-[11px] text-neutral-400 truncate">{c.address.split(',')[0]}</span>
                        <span className="text-[11px] text-neutral-300">·</span>
                        <span className="text-[11px] text-neutral-400">{timeAgo(c.submittedAt)}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${statusBadge[color]}`}>
                      {formatStatus(c.status)}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <Leaf size={28} className="text-neutral-200 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No complaints yet</p>
                <p className="text-xs text-neutral-400 mt-0.5">Report your first issue to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — narrower, different density */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active alert — only if there's something urgent */}
          {active.some((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-medium text-amber-800">High priority complaint active</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">
                    Your complaint about "{active.find(c => c.priority === 'HIGH' || c.priority === 'CRITICAL')?.title.slice(0, 35)}..." is being worked on.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nearby centers */}
          <div className="bg-white border border-border rounded-lg">
            <div className="px-4 py-2.5 border-b border-border">
              <h2 className="text-[13px] font-semibold text-neutral-800">Cleaning centers near you</h2>
            </div>
            <div className="p-3 space-y-2">
              {centers.slice(0, 3).map((center) => (
                <div key={center.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-neutral-700 truncate">{center.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links — just text links, not giant buttons */}
          <div className="bg-white border border-border rounded-lg p-4">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">Quick links</p>
            <div className="space-y-1.5">
              {[
                { to: '/citizen/rewards', label: 'View leaderboard & rewards', icon: Trophy },
                { to: '/citizen/complaints', label: 'Complaint history', icon: Clock },
                { to: '/citizen/profile', label: 'Edit profile', icon: null },
              ].map((link) => (
                <Link key={link.to} to={link.to}
                  className="flex items-center gap-2 text-[12px] text-neutral-600 hover:text-primary-600 transition-colors py-1">
                  {link.icon && <link.icon size={12} className="text-neutral-400" />}
                  {!link.icon && <span className="w-3" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
