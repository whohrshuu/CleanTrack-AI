import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, ChevronRight, ClipboardList } from 'lucide-react';
import { formatStatus, getStatusColor, timeAgo, getPriorityConfig, COMPLAINT_CATEGORIES } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ComplaintHistory() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get('/complaints/my');
        setComplaints(response.data);
      } catch (error) {
        toast.error('Failed to fetch complaint history');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusColors = {
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
    info: 'bg-accent-50 text-accent-600',
    neutral: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">My Complaints</h1>
          <p className="text-sm text-neutral-500 mt-1">{complaints.length} total complaints submitted</p>
        </div>
        <Link to="/citizen/report" className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 transition-colors">
          Report New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search complaints..." className="w-full h-8 pl-9 pr-3 text-sm bg-white border border-border rounded-md text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 px-3 text-sm border border-border rounded-md bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500">
          <option value="ALL">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="VERIFIED">Verified</option>
          <option value="ESCALATED">Escalated</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-8 px-3 text-sm border border-border rounded-md bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary-500">
          <option value="ALL">All Categories</option>
          {COMPLAINT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Complaint List */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((complaint) => {
            const color = getStatusColor(complaint.status);
            const priority = getPriorityConfig(complaint.priority);
            return (
              <Link key={complaint.id} to={`/citizen/complaints/${complaint.id}`} className="flex items-center gap-4 px-5 py-4 border-b border-border-light last:border-0 hover:bg-neutral-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-neutral-400">#{complaint.id}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                    <span className="text-xs text-neutral-500">{priority.label}</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 truncate">{complaint.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <MapPin size={11} className="text-neutral-400" />
                    <span className="text-xs text-neutral-500 truncate">{complaint.address}</span>
                    <span className="text-xs text-neutral-300">·</span>
                    <span className="text-xs text-neutral-400">{timeAgo(complaint.submittedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${statusColors[color]}`}>
                    {formatStatus(complaint.status)}
                  </span>
                  <ChevronRight size={14} className="text-neutral-300" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList size={36} className="text-neutral-300 mb-3" />
            <p className="text-sm font-medium text-neutral-600">No complaints found</p>
            <p className="text-xs text-neutral-400 mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
