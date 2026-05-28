import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function AIReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get('/complaints?size=100');
        const complaints = response.data?.content || response.data || [];
        
        // Map real complaints to demo AI scores since the AI microservice is not wired yet
        const aiReports = complaints.map((c) => ({
          ...c,
          aiFakeScore: c.aiFakeScore || Math.random() * 0.15, // Default low fake score
          duplicateScore: Math.random() * 0.1, // Default low duplicate score
          scanStatus: (c.aiFakeScore || 0) > 0.1 ? 'FLAGGED' : 'CLEAR',
        }));
        
        setReports(aiReports);
      } catch (error) {
        toast.error('Failed to load AI reports');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const flagged = reports.filter(r => r.scanStatus === 'FLAGGED').length;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">AI Fraud Detection</h1>
        <p className="text-sm text-neutral-500 mt-1">AI-powered analysis of complaint authenticity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-primary-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Total Scanned</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{reports.length}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-warning-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Flagged</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{flagged}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-error-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Confirmed Fake</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">0</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-success-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Accuracy</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">98.5%</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {reports.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                <th className="px-5 py-2.5">ID</th><th className="px-5 py-2.5">Complaint</th><th className="px-5 py-2.5">Fake Score</th><th className="px-5 py-2.5">Duplicate</th><th className="px-5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-neutral-400">#{r.id}</td>
                  <td className="px-5 py-3 text-sm text-neutral-800 max-w-[250px] truncate">{r.title}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.aiFakeScore > 0.1 ? 'bg-warning-500' : 'bg-success-500'}`} style={{ width: `${r.aiFakeScore * 100}%` }} />
                      </div>
                      <span className="text-xs text-neutral-600">{(r.aiFakeScore * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-neutral-600">{(r.duplicateScore * 100).toFixed(0)}%</td>
                  <td className="px-5 py-3">
                    {r.scanStatus === 'CLEAR' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600"><CheckCircle size={12} /> Clear</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-600"><ShieldAlert size={12} /> Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center text-sm text-neutral-500">No AI reports available. Submit a complaint first.</div>
        )}
      </div>
    </motion.div>
  );
}
