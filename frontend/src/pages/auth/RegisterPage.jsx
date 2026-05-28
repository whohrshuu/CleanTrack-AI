import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', agreeTerms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'At least 8 characters required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'CITIZEN'
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-1">Create your account</h2>
      <p className="text-sm text-neutral-500 mb-6">Join CleanTrack as a citizen reporter</p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Full name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Enter your full name" className={`w-full h-9 pl-9 pr-3 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${errors.fullName ? 'border-error-500' : 'border-border'}`} />
          </div>
          {errors.fullName && <p className="text-xs text-error-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" className={`w-full h-9 pl-9 pr-3 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${errors.email ? 'border-error-500' : 'border-border'}`} />
          </div>
          {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Phone number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+91 98765 43210" className={`w-full h-9 pl-9 pr-3 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${errors.phone ? 'border-error-500' : 'border-border'}`} />
          </div>
          {errors.phone && <p className="text-xs text-error-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Min. 8 characters" className={`w-full h-9 pl-9 pr-10 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${errors.password ? 'border-error-500' : 'border-border'}`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Confirm password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter your password" className={`w-full h-9 pl-9 pr-3 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${errors.confirmPassword ? 'border-error-500' : 'border-border'}`} />
          </div>
          {errors.confirmPassword && <p className="text-xs text-error-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        <label className={`flex items-start gap-2 cursor-pointer ${errors.agreeTerms ? 'text-error-500' : ''}`}>
          <input type="checkbox" checked={form.agreeTerms} onChange={(e) => updateField('agreeTerms', e.target.checked)} className="w-3.5 h-3.5 mt-0.5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500" />
          <span className="text-xs text-neutral-600">I agree to the <button type="button" className="text-primary-500 font-medium">Terms of Service</button> and <button type="button" className="text-primary-500 font-medium">Privacy Policy</button></span>
        </label>

        <button type="submit" disabled={loading} className="w-full h-9 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-neutral-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
