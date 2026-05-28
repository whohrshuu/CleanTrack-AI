import { motion } from 'motion/react';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const shiftHistory = [
  { date: '2026-05-28', start: '08:00 AM', end: 'On Duty', tasks: 4, status: 'active' },
  { date: '2026-05-27', start: '08:15 AM', end: '05:30 PM', tasks: 7, status: 'completed' },
  { date: '2026-05-26', start: '08:00 AM', end: '05:00 PM', tasks: 5, status: 'completed' },
  { date: '2026-05-25', start: '08:30 AM', end: '05:15 PM', tasks: 6, status: 'completed' },
  { date: '2026-05-24', start: '08:00 AM', end: '04:45 PM', tasks: 4, status: 'completed' },
];

export default function WorkerShifts() {
  const user = useAuthStore((s) => s.user);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">My Shifts</h1>
        <p className="text-sm text-neutral-500 mt-1">Shift history and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-primary-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Total Shifts (May)</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">22</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-success-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Completion Rate</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">96%</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-accent-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Avg Tasks / Day</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">5.8</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-neutral-900">Shift History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
              <th className="px-5 py-2.5">Date</th>
              <th className="px-5 py-2.5">Start</th>
              <th className="px-5 py-2.5">End</th>
              <th className="px-5 py-2.5 text-right">Tasks</th>
              <th className="px-5 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {shiftHistory.map((shift, i) => (
              <tr key={i} className="hover:bg-neutral-50 transition-colors">
                <td className="px-5 py-3 text-sm text-neutral-700 flex items-center gap-2"><Calendar size={12} className="text-neutral-400" />{shift.date}</td>
                <td className="px-5 py-3 text-sm text-neutral-600">{shift.start}</td>
                <td className="px-5 py-3 text-sm text-neutral-600">{shift.end}</td>
                <td className="px-5 py-3 text-sm text-neutral-700 text-right font-medium">{shift.tasks}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${shift.status === 'active' ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    {shift.status === 'active' ? 'Active' : 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
