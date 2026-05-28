import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setForm({ name: '', email: '', subject: '', message: '' });
    toast.success('Message sent! We\'ll respond within 24 hours.');
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">Get in Touch</h1>
          <p className="text-base text-neutral-600">Have a question or want to partner with us? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Email</h3>
                <p className="text-sm text-neutral-600">support@cleantrack.ai</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Phone</h3>
                <p className="text-sm text-neutral-600">+91 80 2658 0000</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Office</h3>
                <p className="text-sm text-neutral-600">Civic Innovation Lab<br />4th Floor, BBMP Complex<br />Bengaluru 560001</p>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="h-40 bg-neutral-100 border border-border rounded-lg flex items-center justify-center">
              <span className="text-xs text-neutral-400">Map · 12.9767°N, 77.5713°E</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} placeholder="What's this about?" className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Message *</label>
                <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} rows={5} placeholder="Tell us more..." className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <button type="submit" disabled={sending} className="px-5 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2">
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
