import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, CheckCircle2, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function GovDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovStats = async () => {
      try {
        const response = await api.get('/gov/overview');
        setStats(response.data);
      } catch (error) {
        toast.error('Failed to load government overview statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchGovStats();
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
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">City-Wide Monitoring</h1>
        <p className="text-sm text-neutral-500 mt-1">Comprehensive overview of municipal waste management across all departments.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-primary-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Complaints</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{(stats.totalComplaints || 0).toLocaleString()}</p>
          <p className="text-xs text-neutral-400 mt-1">This month</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-success-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Resolved</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{(stats.resolvedThisMonth || 0).toLocaleString()}</p>
          <p className="text-xs text-success-600 mt-1">{stats.totalComplaints ? ((stats.resolvedThisMonth / stats.totalComplaints) * 100).toFixed(0) : 0}% resolution rate</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-error-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending Escalations</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{stats.pendingEscalations || 0}</p>
          <p className="text-xs text-error-500 mt-1">Requires attention</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-accent-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">SLA Compliance</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{stats.avgSlaCompliance || 0}%</p>
          <p className="text-xs text-neutral-400 mt-1">Across all departments</p>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      {stats.monthlyTrend && (
        <div className="bg-white border border-border rounded-lg p-5 mb-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Monthly Complaint Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5df" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#57606a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#57606a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #d8dee4' }} />
              <Area type="monotone" dataKey="complaints" stroke="#3A86A8" fill="#3A86A8" fillOpacity={0.08} strokeWidth={2} name="Total Complaints" />
              <Area type="monotone" dataKey="resolved" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.08} strokeWidth={2} name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department + Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-border rounded-lg">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-neutral-900">Department Performance</h3>
          </div>
          {stats.zonePerformance && stats.zonePerformance.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-neutral-500 uppercase bg-neutral-50">
                  <th className="px-5 py-2">Zone</th><th className="px-5 py-2 text-right">Resolved</th><th className="px-5 py-2 text-right">Pending</th><th className="px-5 py-2 text-right">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {stats.zonePerformance.map((zone, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-neutral-700">{zone.zone}</td>
                    <td className="px-5 py-3 text-sm text-neutral-700 text-right">{zone.resolved}</td>
                    <td className="px-5 py-3 text-sm text-neutral-700 text-right">{zone.pending}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-xs font-semibold ${zone.slaCompliance >= 85 ? 'text-success-600' : zone.slaCompliance >= 75 ? 'text-warning-600' : 'text-error-500'}`}>{zone.slaCompliance}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-sm text-neutral-500">No department data available</div>
          )}
        </div>

        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-500">Citizen Satisfaction</span>
                <span className="font-semibold text-neutral-700">{stats.citizenSatisfaction || 0}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full"><div className="h-2 bg-primary-500 rounded-full" style={{ width: `${stats.citizenSatisfaction || 0}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-500">SLA Compliance</span>
                <span className="font-semibold text-neutral-700">{stats.avgSlaCompliance || 0}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full"><div className="h-2 bg-accent-500 rounded-full" style={{ width: `${stats.avgSlaCompliance || 0}%` }} /></div>
            </div>
            <div className="pt-3 border-t border-border space-y-2.5">
              <div className="flex justify-between text-xs"><span className="text-neutral-500">Departments</span><span className="font-medium text-neutral-700">{stats.departments || 0}</span></div>
              <div className="flex justify-between text-xs"><span className="text-neutral-500">Total Workers</span><span className="font-medium text-neutral-700">{stats.totalWorkers || 0}</span></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
