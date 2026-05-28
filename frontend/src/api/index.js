import apiClient from './client';

export const authApi = {
  login: (credentials) =>
    apiClient.post('/auth/login', credentials),

  register: (userData) =>
    apiClient.post('/auth/register', userData),

  refreshToken: (refreshToken) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  getProfile: () =>
    apiClient.get('/auth/me'),

  updateProfile: (data) =>
    apiClient.put('/auth/me', data),

  changePassword: (data) =>
    apiClient.put('/auth/change-password', data),
};

export const complaintsApi = {
  create: (formData) =>
    apiClient.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: (params) =>
    apiClient.get('/complaints', { params }),

  getById: (id) =>
    apiClient.get(`/complaints/${id}`),

  getTimeline: (id) =>
    apiClient.get(`/complaints/${id}/timeline`),

  assign: (id, workerId) =>
    apiClient.put(`/complaints/${id}/assign`, { workerId }),

  escalate: (id, data) =>
    apiClient.put(`/complaints/${id}/escalate`, data),

  getMyCitizen: (params) =>
    apiClient.get('/complaints/my', { params }),

  getNearbyCenter: (lat, lng) =>
    apiClient.get('/complaints/nearby-center', { params: { lat, lng } }),
};

export const workersApi = {
  getTasks: (params) =>
    apiClient.get('/workers/tasks', { params }),

  acceptTask: (taskId) =>
    apiClient.put(`/workers/tasks/${taskId}/accept`),

  rejectTask: (taskId) =>
    apiClient.put(`/workers/tasks/${taskId}/reject`),

  completeTask: (taskId, formData) =>
    apiClient.put(`/workers/tasks/${taskId}/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateShift: (status) =>
    apiClient.put('/workers/shift', { status }),

  getProfile: () =>
    apiClient.get('/workers/profile'),
};

export const adminApi = {
  getDashboard: () =>
    apiClient.get('/admin/dashboard'),

  getComplaints: (params) =>
    apiClient.get('/admin/complaints', { params }),

  getWorkers: (params) =>
    apiClient.get('/admin/workers', { params }),

  assignWorker: (complaintId, workerId) =>
    apiClient.put(`/admin/complaints/${complaintId}/assign`, { workerId }),

  getAIReports: (params) =>
    apiClient.get('/admin/ai-reports', { params }),
};

export const governmentApi = {
  getOverview: () =>
    apiClient.get('/gov/overview'),

  getEscalations: (params) =>
    apiClient.get('/gov/escalations', { params }),

  getDepartments: () =>
    apiClient.get('/gov/departments'),

  getSlaReport: (params) =>
    apiClient.get('/gov/sla', { params }),

  resolveEscalation: (id, data) =>
    apiClient.put(`/gov/escalations/${id}/resolve`, data),
};

export const analyticsApi = {
  getHeatmap: (params) =>
    apiClient.get('/analytics/heatmap', { params }),

  getTrends: (params) =>
    apiClient.get('/analytics/trends', { params }),

  getPerformance: (params) =>
    apiClient.get('/analytics/performance', { params }),

  getCategoryBreakdown: (params) =>
    apiClient.get('/analytics/categories', { params }),
};

export const notificationsApi = {
  getAll: (params) =>
    apiClient.get('/notifications', { params }),

  markAsRead: (id) =>
    apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put('/notifications/read-all'),
};

export const rewardsApi = {
  getMyRewards: () =>
    apiClient.get('/rewards'),

  getLeaderboard: (params) =>
    apiClient.get('/rewards/leaderboard', { params }),
};
