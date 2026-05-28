import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useUIStore from '@/store/uiStore';
import useNotificationStore from '@/store/notificationStore';
import { getInitials, timeAgo } from '@/utils/helpers';

export default function TopNav() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme, toggleMobileSidebar } = useUIStore();
  const { notifications, unreadCount, togglePanel, isOpen: notifOpen, closePanel, markAsRead, markAllAsRead } = useNotificationStore();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        closePanel();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [closePanel]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 bg-white border-b border-border flex-shrink-0">
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <Menu size={18} />
        </button>

        <div className={`relative hidden sm:block max-w-xs w-full transition-all ${searchFocused ? 'max-w-sm' : ''}`}>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search complaints, workers..."
            className="w-full h-8 pl-9 pr-12 text-sm bg-neutral-50 border border-transparent rounded-md text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-border focus:bg-white transition-colors"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 bg-neutral-100 border border-neutral-200 rounded px-1 py-0.5 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={togglePanel}
            className="relative flex items-center justify-center w-8 h-8 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-error-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-lg shadow-lg z-50 animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-border-light last:border-0 cursor-pointer hover:bg-neutral-50 transition-colors ${
                        !notif.isRead ? 'bg-primary-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!notif.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-800">{notif.title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[11px] text-neutral-400 mt-1">{timeAgo(notif.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Bell size={24} className="text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(user?.fullName)}
            </div>
            <span className="hidden md:block text-sm font-medium text-neutral-700 max-w-[100px] truncate">
              {user?.fullName?.split(' ')[0]}
            </span>
            <ChevronDown size={12} className="text-neutral-400 hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 py-1 animate-slide-up">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-neutral-900">{user?.fullName}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
              <button
                onClick={() => { setUserMenuOpen(false); navigate('profile'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <User size={14} /> Profile
              </button>
              <button
                onClick={() => { setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Settings size={14} /> Settings
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-500 hover:bg-error-50 transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
