import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, UserPlus, ChevronRight } from 'lucide-react';
import { formatStatus, getStatusColor, timeAgo, getPriorityConfig, COMPLAINT_CATEGORIES } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const statusColors = { success: 'bg-success-50 text-success-600', warning: 'bg-warning-50 text-warning-600', error: 'bg-error-50 text-error-600', info: 'bg-accent-50 text-accent-600', neutral: 'bg-neutral-100 text-neutral-600' };

export default function ComplaintManagement() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState(null);
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get('/admin/complaints');
        setComplaints(response.data || []);
      } catch (error) {
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Complaint Management</h1>
          <p className="text-sm text-neutral-500 mt-1">{complaints.length} total complaints across all zones</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints..." className="w-full h-8 pl-9 pr-3 text-sm bg-white border border-border rounded-md text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 px-3 text-sm border border-border rounded-md bg-white text-neutral-700">
          <option value="ALL">All Status</option>
          <option value="SUBMITTED">Submitted</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="ESCALATED">Escalated</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-8 px-3 text-sm border border-border rounded-md bg-white text-neutral-700">
          <option value="ALL">All Priority</option>
          <option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {loading ? (
           <div className="flex justify-center items-center py-16">
             <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                  <th className="px-4 py-2.5">ID</th>
                  <th className="px-4 py-2.5">Complaint</th>
                  <th className="px-4 py-2.5">Citizen</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Priority</th>
                  <th className="px-4 py-2.5">Zone</th>
                  <th className="px-4 py-2.5">Submitted</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map((c) => {
                  const priority = getPriorityConfig(c.priority);
                  const color = getStatusColor(c.status);
                  return (
                    <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-neutral-400">#{c.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-neutral-800 truncate max-w-[200px]">{c.title}</p>
                        <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[200px]">{c.address}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{c.citizenName}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-md ${statusColors[color]}`}>{formatStatus(c.status)}</span></td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1.5 text-xs text-neutral-600"><span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.label}</span></td>
                      <td className="px-4 py-3 text-xs text-neutral-500">{c.zone}</td>
                      <td className="px-4 py-3 text-xs text-neutral-500">{timeAgo(c.submittedAt)}</td>
                      <td className="px-4 py-3">
                        {!c.workerName ? (
                          <button onClick={() => setAssignModal(c.id)} className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1"><UserPlus size={12} /> Assign</button>
                        ) : (
                          <span className="text-xs text-neutral-400">{c.workerName}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-neutral-500">No complaints match your filters</div>
            )}
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Assign Worker</h3>
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700 block">Enter Worker ID</label>
              <input type="number" id="workerIdInput" placeholder="Worker ID (e.g. 1)" className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button 
                onClick={async () => {
                  const wId = document.getElementById('workerIdInput').value;
                  if (!wId) return;
                  try {
                    await api.put(`/admin/complaints/${assignModal}/assign`, { workerId: wId });
                    toast.success('Worker assigned successfully');
                    setAssignModal(null);
                    // Refresh
                    const response = await api.get('/admin/complaints');
                    setComplaints(response.data || []);
                  } catch(e) { toast.error('Failed to assign worker'); }
                }}
                className="flex-1 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600"
              >
                Assign
              </button>
              <button onClick={() => setAssignModal(null)} className="flex-1 py-2 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-md hover:bg-neutral-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
