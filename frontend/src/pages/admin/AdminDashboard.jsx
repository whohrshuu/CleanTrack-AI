import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatStatus, getStatusColor, timeAgo } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const statusBadge = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-sky-50 text-sky-600',
  neutral: 'bg-neutral-100 text-neutral-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/complaints')
        ]);
        // Support both structured maps or flat DTO responses depending on backend implementation
        setStats(statsRes.data);
        setRecentComplaints(complaintsRes.data || []);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Header with date — feels live */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Operations overview</h1>
          <p className="text-[13px] text-neutral-400 mt-0.5">{today}</p>
        </div>
        {stats.slaBreaches > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle size={12} className="text-red-500" />
            <span className="text-[11px] font-medium text-red-600">{stats.slaBreaches} SLA breach{stats.slaBreaches > 1 ? 'es' : ''}</span>
          </div>
        )}
      </div>

      {/* KPIs — mixed density, not all identical */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Today</span>
            <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={10} />12%</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.todayComplaints || 0}</p>
          <p className="text-[11px] text-neutral-400">new complaints</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Unassigned</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingAssignment || 0}</p>
          <p className="text-[11px] text-neutral-400">need attention</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Active</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.inProgress || 0}</p>
          <p className="text-[11px] text-neutral-400">in progress now</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">Resolved today</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.resolvedToday || 0}</p>
          <div className="w-full h-1 bg-neutral-100 rounded-full mt-2">
            <div className="h-1 bg-primary-400 rounded-full transition-all" style={{ width: `${((stats.resolvedToday || 0) / (stats.todayComplaints || 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Charts — different heights, not identical twins */}
      {stats.weeklyTrend && stats.categoryBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">
          <div className="lg:col-span-3 bg-white border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-semibold text-neutral-800">Weekly trend</h3>
              <span className="text-[10px] text-neutral-400">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ececec" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="complaints" stroke="#3A86A8" fill="#3A86A8" fillOpacity={0.06} strokeWidth={1.5} name="Received" />
                <Area type="monotone" dataKey="resolved" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.06} strokeWidth={1.5} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white border border-border rounded-lg p-4">
            <h3 className="text-[13px] font-semibold text-neutral-800 mb-4">By category</h3>
            <div className="space-y-2.5">
              {stats.categoryBreakdown.slice(0, 5).map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-neutral-600">{cat.category}</span>
                    <span className="text-neutral-400 tabular-nums">{cat.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full">
                    <div className="h-1.5 bg-primary-400 rounded-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom — list + table, not two identical boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white border border-border rounded-lg">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <h3 className="text-[13px] font-semibold text-neutral-800">Recent complaints</h3>
            <Link to="/admin/complaints" className="text-[11px] font-medium text-primary-500 hover:text-primary-600 flex items-center gap-0.5">
              Manage <ChevronRight size={11} />
            </Link>
          </div>
          {recentComplaints.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 last:border-0 hover:bg-neutral-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-neutral-700 truncate">{c.title}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{c.citizenName} · {timeAgo(c.submittedAt)}</p>
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${statusBadge[getStatusColor(c.status)]}`}>
                {formatStatus(c.status)}
              </span>
            </div>
          ))}
          {recentComplaints.length === 0 && (
             <div className="py-8 text-center text-sm text-neutral-500">No recent complaints</div>
          )}
        </div>

        {stats.zonePerformance && (
          <div className="lg:col-span-2 bg-white border border-border rounded-lg">
            <div className="px-4 py-2.5 border-b border-border">
              <h3 className="text-[13px] font-semibold text-neutral-800">Zone health</h3>
            </div>
            <div className="p-3 space-y-2">
              {stats.zonePerformance.map((zone, i) => (
                <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      zone.slaCompliance >= 85 ? 'bg-emerald-500' : zone.slaCompliance >= 75 ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="text-[12px] text-neutral-700">{zone.zone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-neutral-400 tabular-nums">{zone.resolved}/{zone.resolved + zone.pending}</span>
                    <span className={`text-[11px] font-semibold tabular-nums ${
                      zone.slaCompliance >= 85 ? 'text-emerald-600' : zone.slaCompliance >= 75 ? 'text-amber-600' : 'text-red-500'
                    }`}>{zone.slaCompliance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
