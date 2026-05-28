import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import useNotificationStore from '@/store/notificationStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function DashboardLayout() {
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to load notifications', error);
      }
    };
    fetchNotifications();
  }, [setNotifications]);

  return (
    <div className="flex h-screen bg-surface-secondary overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
