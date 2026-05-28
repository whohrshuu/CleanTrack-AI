import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { getDashboardPath } from '@/utils/helpers';
import toast from 'react-hot-toast';
import api from '@/utils/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 4) newErrors.password = 'Password must be at least 4 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      
      const { accessToken, tokenType, user } = response.data;
      login(user, accessToken, null);
      
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      navigate(getDashboardPath(user.role));
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-1">Welcome back</h2>
      <p className="text-sm text-neutral-500 mb-6">Sign in to your CleanTrack account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={`w-full h-9 pl-9 pr-3 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                errors.email ? 'border-error-500' : 'border-border'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className={`w-full h-9 pl-9 pr-10 text-sm border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                errors.password ? 'border-error-500' : 'border-border'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password}</p>}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-xs text-neutral-600">Remember me</span>
          </label>
          <button type="button" className="text-xs text-primary-500 hover:text-primary-600 font-medium">
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-9 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Demo hint */}
      <div className="mt-6 p-3 bg-neutral-50 border border-border rounded-md">
        <p className="text-xs font-medium text-neutral-600 mb-1">Demo Login</p>
        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Use any email to login. Role is determined by email domain:
          <br />
          <code className="text-primary-600">@citizen.com</code> → Citizen ·{' '}
          <code className="text-primary-600">@worker.com</code> → Worker
          <br />
          <code className="text-primary-600">@admin.com</code> → Admin ·{' '}
          <code className="text-primary-600">@gov.com</code> → Government
        </p>
      </div>

      <p className="mt-5 text-center text-xs text-neutral-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
          Create account
        </Link>
      </p>
    </div>
  );
}
