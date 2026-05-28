import { motion } from 'motion/react';
import { Users, Star, MapPin } from 'lucide-react';

const workers = [
  { id: 'BBMP-WK-2891', name: 'Raju Kumar', center: 'Indiranagar Ward Office', status: 'ON_DUTY', tasksToday: 4, rating: 4.3 },
  { id: 'BBMP-WK-3042', name: 'Suresh Babu', center: 'Koramangala Ward Office', status: 'ON_DUTY', tasksToday: 3, rating: 4.5 },
  { id: 'BBMP-WK-1567', name: 'Anjali Devi', center: 'HSR Layout Cleaning Depot', status: 'OFF_DUTY', tasksToday: 0, rating: 4.1 },
  { id: 'BBMP-WK-4210', name: 'Mohan Rao', center: 'Whitefield Civic Center', status: 'ON_DUTY', tasksToday: 5, rating: 4.7 },
  { id: 'BBMP-WK-2103', name: 'Lakshmi N', center: 'Indiranagar Ward Office', status: 'ON_DUTY', tasksToday: 2, rating: 3.9 },
  { id: 'BBMP-WK-3891', name: 'Venkat R', center: 'Koramangala Ward Office', status: 'OFF_DUTY', tasksToday: 0, rating: 4.2 },
];

export default function WorkerManagement() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Worker Management</h1>
        <p className="text-sm text-neutral-500 mt-1">{workers.length} registered workers across all centers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-success-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">On Duty</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{workers.filter(w => w.status === 'ON_DUTY').length}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-neutral-400">
          <span className="text-xs font-medium text-neutral-500 uppercase">Off Duty</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{workers.filter(w => w.status === 'OFF_DUTY').length}</p>
        </div>
        <div className="bg-white border border-border rounded-lg p-4 border-l-3 border-l-accent-500">
          <span className="text-xs font-medium text-neutral-500 uppercase">Avg Rating</span>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{(workers.reduce((sum, w) => sum + w.rating, 0) / workers.length).toFixed(1)}</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
              <th className="px-5 py-2.5">Employee ID</th><th className="px-5 py-2.5">Name</th><th className="px-5 py-2.5">Center</th><th className="px-5 py-2.5">Status</th><th className="px-5 py-2.5 text-right">Tasks Today</th><th className="px-5 py-2.5 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {workers.map((w) => (
              <tr key={w.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-5 py-3 text-xs font-mono text-neutral-500">{w.id}</td>
                <td className="px-5 py-3 text-sm font-medium text-neutral-800">{w.name}</td>
                <td className="px-5 py-3 text-sm text-neutral-600">{w.center}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${w.status === 'ON_DUTY' ? 'bg-success-50 text-success-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'ON_DUTY' ? 'bg-success-500' : 'bg-neutral-400'}`} />
                    {w.status === 'ON_DUTY' ? 'On Duty' : 'Off Duty'}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-neutral-700 text-right">{w.tasksToday}</td>
                <td className="px-5 py-3 text-right"><span className="text-sm font-medium text-neutral-700 flex items-center justify-end gap-1">{w.rating} <Star size={12} className="text-warning-500" /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
