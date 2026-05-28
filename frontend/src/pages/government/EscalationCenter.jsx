import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { formatDateTime, timeAgo, formatStatus } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function EscalationCenter() {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    const fetchEscalations = async () => {
      try {
        const response = await api.get('/gov/escalations');
        setEscalations(response.data);
      } catch (error) {
        toast.error('Failed to load escalations');
      } finally {
        setLoading(false);
      }
    };
    fetchEscalations();
  }, []);

  const handleResolve = async (id) => {
    if (!resolutionNotes.trim()) { toast.error('Resolution notes required'); return; }
    setResolving(id);
    try {
      await api.put(`/gov/escalations/${id}/resolve`, { resolutionNotes });
      setEscalations((prev) => prev.map((e) => e.id === id ? { ...e, status: 'RESOLVED', resolutionNotes } : e));
      setResolutionNotes('');
      toast.success('Escalation resolved');
    } catch (error) {
      toast.error('Failed to resolve escalation');
    } finally {
      setResolving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Escalation Center</h1>
        <p className="text-sm text-neutral-500 mt-1">{escalations.filter(e => e.status === 'OPEN').length} open escalations requiring attention</p>
      </div>

      <div className="space-y-4">
        {escalations.length > 0 ? escalations.map((esc) => (
          <div key={esc.id} className={`bg-white border rounded-lg overflow-hidden ${esc.status === 'OPEN' ? 'border-error-200' : 'border-border'}`}>
            <div className="px-5 py-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} className={esc.status === 'OPEN' ? 'text-error-500' : 'text-neutral-400'} />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${esc.escalationLevel === 'LEVEL_2' ? 'bg-error-50 text-error-600' : 'bg-warning-50 text-warning-600'}`}>{esc.escalationLevel.replace('_', ' ')}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${esc.status === 'OPEN' ? 'bg-error-50 text-error-600' : 'bg-success-50 text-success-600'}`}>{esc.status}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">{esc.complaint?.title || `Complaint #${esc.complaintId}`}</h3>
                  <p className="text-xs text-neutral-500 mt-1">#{esc.complaintId} · {esc.complaint?.address || 'Location unknown'} · {esc.complaint?.zone || 'Unknown Zone'}</p>
                </div>
                <span className="text-xs text-neutral-400 flex-shrink-0">{timeAgo(esc.escalatedAt)}</span>
              </div>

              <div className="bg-neutral-50 rounded-md p-3 mb-3">
                <p className="text-xs font-medium text-neutral-500 mb-1">Escalation Reason</p>
                <p className="text-sm text-neutral-700">{esc.reason}</p>
              </div>

              {esc.status === 'RESOLVED' && esc.resolutionNotes && (
                <div className="bg-success-50 rounded-md p-3 mb-3 border border-success-100">
                  <p className="text-xs font-medium text-success-600 mb-1">Resolution Notes</p>
                  <p className="text-sm text-neutral-700">{esc.resolutionNotes}</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span>Escalated by: <strong className="text-neutral-700">{esc.escalatedByName || 'System'}</strong></span>
                <span>To: <strong className="text-neutral-700">{esc.escalatedToName || 'Admin'}</strong></span>
              </div>

              {esc.status === 'OPEN' && (
                <div className="mt-4 pt-3 border-t border-border">
                  <label className="block text-xs font-medium text-neutral-600 mb-1.5">Resolution Notes</label>
                  <textarea rows={2} placeholder="Describe the resolution action taken..." value={resolving === esc.id ? resolutionNotes : ''} onChange={(e) => setResolutionNotes(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-1 focus:ring-primary-500 mb-2" />
                  <button onClick={() => handleResolve(esc.id)} disabled={resolving === esc.id} className="px-4 py-1.5 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2">
                    {resolving === esc.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-16 bg-white border border-border rounded-lg">
            <CheckCircle size={36} className="text-success-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-600">No active escalations</p>
            <p className="text-xs text-neutral-400 mt-1">All SLAs are currently being met.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
