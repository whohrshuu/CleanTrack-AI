import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, PlusCircle, ClipboardList, Award, User,
  ListChecks, MapPin, Clock,
  BarChart3, Users, Map, Brain, FileWarning,
  Building2, AlertTriangle, TrendingUp, ShieldCheck,
  ChevronLeft, X, Leaf,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useUIStore from '@/store/uiStore';
import { getInitials } from '@/utils/helpers';

const navigationByRole = {
  CITIZEN: [
    { to: '/citizen/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/citizen/report', icon: PlusCircle, label: 'Report Issue' },
    { to: '/citizen/complaints', icon: ClipboardList, label: 'My Complaints' },
    { to: '/citizen/rewards', icon: Award, label: 'Rewards' },
    { to: '/citizen/profile', icon: User, label: 'Profile' },
  ],
  WORKER: [
    { to: '/worker/dashboard', icon: ListChecks, label: 'Task Dashboard' },
    { to: '/worker/shifts', icon: Clock, label: 'My Shifts' },
    { to: '/worker/profile', icon: User, label: 'Profile' },
  ],
  ADMIN: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/complaints', icon: ClipboardList, label: 'Complaints' },
    { to: '/admin/workers', icon: Users, label: 'Workers' },
    { to: '/admin/heatmap', icon: Map, label: 'Heatmap' },
    { to: '/admin/ai-reports', icon: Brain, label: 'AI Reports' },
  ],
  GOVERNMENT: [
    { to: '/gov/dashboard', icon: Building2, label: 'City Overview' },
    { to: '/gov/escalations', icon: AlertTriangle, label: 'Escalations' },
    { to: '/gov/analytics', icon: TrendingUp, label: 'City Analytics' },
  ],
};

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { sidebarOpen, sidebarMobileOpen, toggleSidebar, closeMobileSidebar } = useUIStore();
  const location = useLocation();

  const role = user?.role || 'CITIZEN';
  const navItems = navigationByRole[role] || navigationByRole.CITIZEN;

  const roleLabels = {
    CITIZEN: 'Citizen',
    WORKER: 'Field Worker',
    ADMIN: 'Dept. Admin',
    GOVERNMENT: 'Gov. Monitor',
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-text
          transition-all duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-56' : 'w-16'}
        `}
      >
        {/* Brand header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-white/8 flex-shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">CleanTrack AI</span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center mx-auto">
              <Leaf size={14} className="text-white" />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded text-neutral-400 hover:text-white hover:bg-sidebar-hover transition-colors"
          >
            <ChevronLeft size={14} className={`transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden flex items-center justify-center w-6 h-6 rounded text-neutral-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to ||
              (item.to !== '/citizen/dashboard' && item.to !== '/worker/dashboard' && item.to !== '/admin/dashboard' && item.to !== '/gov/dashboard' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileSidebar}
                className={`
                  flex items-center gap-3 rounded-md text-[13px] font-medium transition-colors
                  ${sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center'}
                  ${isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={16} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className={`flex-shrink-0 border-t border-white/8 p-3 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {getInitials(user?.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user?.fullName || 'User'}</p>
                <p className="text-[11px] text-neutral-400 truncate">{roleLabels[role]}</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(user?.fullName)}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
