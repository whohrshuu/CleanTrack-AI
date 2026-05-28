import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#2D6A4F', '#3A86A8', '#D4A843', '#C4483E', '#57606A', '#40916C', '#8B7355'];

export default function CityAnalytics() {
  const [stats, setStats] = useState(null);
  const [govStats, setGovStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [adminRes, govRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/gov/overview')
        ]);
        setStats(adminRes.data);
        setGovStats(govRes.data);
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats || !govStats) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">City Analytics</h1>
          <p className="text-sm text-neutral-500 mt-1">Comprehensive analytics across all departments and zones.</p>
        </div>
        <button onClick={() => toast.success('Report export queued')} className="px-4 py-2 text-sm font-medium border border-border rounded-md text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Monthly Trend */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Complaint Volume (Monthly)</h3>
          {govStats.monthlyTrend ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={govStats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5df" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#57606a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#57606a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #d8dee4' }} />
                <Area type="monotone" dataKey="complaints" stroke="#3A86A8" fill="#3A86A8" fillOpacity={0.1} strokeWidth={2} name="Received" />
                <Area type="monotone" dataKey="resolved" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.1} strokeWidth={2} name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-neutral-400 text-sm">No trend data available</div>
          )}
        </div>

        {/* Category Pie */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Complaint Categories</h3>
          {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={stats.categoryBreakdown} dataKey="count" nameKey="category" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {stats.categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #d8dee4' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
                {stats.categoryBreakdown.slice(0, 5).map((cat, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />{cat.category}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-neutral-400 text-sm">No category data available</div>
          )}
        </div>
      </div>

      {/* Resolution Rate by Zone */}
      <div className="bg-white border border-border rounded-lg p-5 mb-5">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Zone Resolution Rate</h3>
        {stats.zonePerformance && stats.zonePerformance.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.zonePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5df" />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#57606a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#57606a' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #d8dee4' }} />
              <Bar dataKey="resolved" fill="#2D6A4F" radius={[3, 3, 0, 0]} barSize={28} name="Resolved" />
              <Bar dataKey="pending" fill="#D4A843" radius={[3, 3, 0, 0]} barSize={28} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[220px] text-neutral-400 text-sm">No zone data available</div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-semibold text-primary-600">14.5h</p>
          <p className="text-xs text-neutral-500 mt-1">Avg Resolution Time</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-semibold text-success-600">{govStats.citizenSatisfaction || 0}%</p>
          <p className="text-xs text-neutral-500 mt-1">Resolution Rate</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-semibold text-accent-600">{govStats.totalWorkers || 0}</p>
          <p className="text-xs text-neutral-500 mt-1">Active Workers</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-semibold text-warning-600">{govStats.departments || 0}</p>
          <p className="text-xs text-neutral-500 mt-1">Departments Covered</p>
        </div>
      </div>
    </motion.div>
  );
}
