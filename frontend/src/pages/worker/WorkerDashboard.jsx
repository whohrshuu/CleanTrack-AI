import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Star, ListChecks, MapPin, AlertTriangle, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatStatus, getStatusColor, timeAgo, getPriorityConfig, formatNumber } from '@/utils/helpers';
import useAuthStore from '@/store/authStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState([]);
  const [shiftStatus, setShiftStatus] = useState(user?.shiftStatus === 'ON_DUTY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/workers/tasks');
        setTasks(response.data);
      } catch (error) {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const toggleShift = async () => {
    try {
      const newStatus = !shiftStatus ? 'ON_DUTY' : 'OFF_DUTY';
      await api.put('/workers/shift', { status: newStatus });
      setShiftStatus(!shiftStatus);
      toast.success(!shiftStatus ? 'Shift started. New tasks incoming.' : 'Shift ended. Stay safe!');
    } catch (error) {
      toast.error('Failed to update shift status');
    }
  };

  const statusColors = { success: 'bg-success-50 text-success-600', warning: 'bg-warning-50 text-warning-600', error: 'bg-error-50 text-error-600', info: 'bg-accent-50 text-accent-600', neutral: 'bg-neutral-100 text-neutral-600' };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {/* Shift Toggle */}
      <div className={`flex items-center justify-between mb-6 p-4 rounded-lg border ${shiftStatus ? 'bg-success-50 border-success-200' : 'bg-neutral-50 border-border'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${shiftStatus ? 'bg-success-500 animate-pulse' : 'bg-neutral-400'}`} />
          <div>
            <p className="text-sm font-semibold text-neutral-900">{shiftStatus ? 'On Duty' : 'Off Duty'}</p>
            <p className="text-xs text-neutral-500">Employee ID: {user?.employeeId || 'W-1001'}</p>
          </div>
        </div>
        <button onClick={toggleShift} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${shiftStatus ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
          {shiftStatus ? <><ToggleRight size={16} /> End Shift</> : <><ToggleLeft size={16} /> Start Shift</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-warning-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Assigned</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{tasks.filter(t => t.status !== 'COMPLETED').length}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-success-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Completed</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-accent-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Avg Rating</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{user?.avgRating || 0} <Star size={14} className="inline text-warning-500" /></p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-primary-500">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total Completed</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{formatNumber(user?.tasksCompleted || 0)}</p>
        </div>
      </div>

      {/* Task Queue */}
      <div className="bg-white border border-border rounded-lg">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-neutral-900">Task Queue</h2>
        </div>
        {tasks.length > 0 ? tasks.map((task) => {
          const priority = getPriorityConfig(task.priority);
          const color = getStatusColor(task.status);
          return (
            <Link key={task.id} to={`/worker/tasks/${task.id}`} className="flex items-center gap-4 px-5 py-4 border-b border-border-light last:border-0 hover:bg-neutral-50 transition-colors">
              <div className={`w-1 h-12 rounded-full ${priority.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${statusColors[color]}`}>{formatStatus(task.status)}</span>
                  <span className="text-xs text-neutral-400">{priority.label}</span>
                </div>
                <p className="text-sm font-medium text-neutral-900 truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin size={10} />{task.address}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-neutral-400">{timeAgo(task.submittedAt)}</p>
              </div>
              <ChevronRight size={14} className="text-neutral-300 flex-shrink-0" />
            </Link>
          );
        }) : (
          <div className="py-16 text-center">
            <ListChecks size={36} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-600">No tasks assigned</p>
            <p className="text-xs text-neutral-400 mt-1">New tasks will appear when complaints are assigned to you</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
