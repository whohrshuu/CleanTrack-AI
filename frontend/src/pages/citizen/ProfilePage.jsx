import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { formatDate, ROLE_LABELS } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '+91 98456 12340',
    address: '42 MG Road, Indiranagar, Bengaluru 560038',
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setEditing(false);
    toast.success('Profile updated');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Profile</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* User Card */}
        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-semibold">
              {user?.fullName?.split(' ').map(n => n[0]).join('') || '?'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900">{user?.fullName}</h2>
              <p className="text-sm text-neutral-500">{ROLE_LABELS[user?.role]} · {user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-md">
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900">15</p>
              <p className="text-xs text-neutral-500">Complaints</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900">340</p>
              <p className="text-xs text-neutral-500">Eco Points</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900">#3</p>
              <p className="text-xs text-neutral-500">City Rank</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-900">2</p>
              <p className="text-xs text-neutral-500">Badges</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900">Personal Information</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs font-medium text-primary-500 hover:text-primary-600">Edit</button>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Full Name</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} disabled={!editing} className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Email</label>
                <input type="email" value={user?.email || ''} disabled className="w-full h-9 px-3 text-sm border border-border rounded-md bg-neutral-50 text-neutral-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} disabled={!editing} className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1.5">Member Since</label>
                <input type="text" value={formatDate(user?.createdAt)} disabled className="w-full h-9 px-3 text-sm border border-border rounded-md bg-neutral-50 text-neutral-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} disabled={!editing} className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            {editing && (
              <div className="flex items-center gap-2 pt-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-neutral-600 border border-border rounded-md hover:bg-neutral-50">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
