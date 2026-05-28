import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarMobileOpen: false,
      theme: 'light',
      searchQuery: '',

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      toggleMobileSidebar: () =>
        set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),

      closeMobileSidebar: () =>
        set({ sidebarMobileOpen: false }),

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
          return { theme: newTheme };
        }),

      setTheme: (theme) => {
        if (theme === 'dark') {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
        set({ theme });
      },

      setSearchQuery: (query) =>
        set({ searchQuery: query }),
    }),
    {
      name: 'cleantrack-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
);

export default useUIStore;
