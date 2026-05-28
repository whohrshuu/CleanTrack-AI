import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Clock, User, Shield, AlertTriangle, CheckCircle, Brain, Calendar, ArrowLeft } from 'lucide-react';
import { formatStatus, getStatusColor, formatDateTime, timeAgo, getPriorityConfig } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const timelineIcons = {
  SUBMITTED: { icon: Clock, color: 'text-neutral-500 bg-neutral-100' },
  AI_VERIFIED: { icon: Brain, color: 'text-accent-500 bg-accent-50' },
  ASSIGNED: { icon: User, color: 'text-primary-500 bg-primary-50' },
  ACCEPTED: { icon: CheckCircle, color: 'text-success-500 bg-success-50' },
  IN_PROGRESS: { icon: AlertTriangle, color: 'text-warning-500 bg-warning-50' },
  COMPLETED: { icon: CheckCircle, color: 'text-success-500 bg-success-50' },
  VERIFIED: { icon: Shield, color: 'text-primary-500 bg-primary-50' },
  ESCALATED: { icon: AlertTriangle, color: 'text-error-500 bg-error-50' },
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        setComplaint(response.data);
      } catch (error) {
        toast.error('Failed to fetch complaint details');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!complaint) {
    return <div className="text-center py-10">Complaint not found</div>;
  }

  const timeline = complaint.timeline || [];
  const priority = getPriorityConfig(complaint.priority);
  const statusColor = getStatusColor(complaint.status);

  const statusStyles = {
    success: 'bg-success-50 text-success-600 border-success-200',
    warning: 'bg-warning-50 text-warning-600 border-warning-200',
    error: 'bg-error-50 text-error-600 border-error-200',
    info: 'bg-accent-50 text-accent-600 border-accent-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {/* Back + Header */}
      <div className="mb-6">
        <Link to="/citizen/complaints" className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 mb-3 transition-colors">
          <ArrowLeft size={12} /> Back to complaints
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-neutral-400">#{complaint.id}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${statusStyles[statusColor]}`}>{formatStatus(complaint.status)}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              <span className="text-xs text-neutral-500">{priority.label} Priority</span>
            </div>
            <h1 className="text-lg font-semibold text-neutral-900">{complaint.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Images */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Photo Evidence</h3>
            <div className="grid grid-cols-2 gap-3">
              {(complaint.images || []).map((img) => (
                <div key={img.id} className="aspect-video bg-neutral-100 rounded-md overflow-hidden border border-border relative">
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                    <div className="text-center">
                      <MapPin size={24} className="mx-auto mb-1" />
                      <p className="text-xs">{img.type} Image</p>
                      <p className="text-[10px] text-neutral-300 mt-0.5">{formatDateTime(img.uploadedAt)}</p>
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/50 text-white uppercase">{img.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Location</h3>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-700">{complaint.address}</p>
                <p className="text-xs text-neutral-400 mt-1">Ward {complaint.wardNumber} · {complaint.zone}</p>
              </div>
            </div>
            <div className="mt-3 h-40 bg-neutral-100 rounded-md border border-border flex items-center justify-center">
              <span className="text-xs text-neutral-400">Map · {complaint.latitude?.toFixed(4)}°N, {complaint.longitude?.toFixed(4)}°E</span>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Brain size={12} /> AI Analysis
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-success-50 rounded-md">
                <p className="text-lg font-semibold text-success-600">{((1 - (complaint.aiFakeScore || 0)) * 100).toFixed(0)}%</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Authenticity</p>
              </div>
              <div className="text-center p-3 bg-accent-50 rounded-md">
                <p className="text-lg font-semibold text-accent-600">Pass</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Duplicate Check</p>
              </div>
              <div className="text-center p-3 bg-neutral-50 rounded-md">
                <p className="text-lg font-semibold text-neutral-600">{complaint.aiVerified ? 'Verified' : 'Pending'}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">AI Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Timeline */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {timeline.map((event, idx) => {
                const config = timelineIcons[event.eventType] || timelineIcons.SUBMITTED;
                const Icon = config.icon;
                return (
                  <div key={event.id} className="flex gap-3 relative">
                    {idx < timeline.length - 1 && <div className="absolute left-3.5 top-7 bottom-0 w-px bg-border" />}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                      <Icon size={12} />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <p className="text-xs font-medium text-neutral-800">{event.description}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-neutral-400">{event.actorName || 'System'}</span>
                        <span className="text-[11px] text-neutral-300">·</span>
                        <span className="text-[11px] text-neutral-400">{timeAgo(event.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Worker */}
          {complaint.workerName && (
            <div className="bg-white border border-border rounded-lg p-5">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Assigned Worker</h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-semibold">
                  {complaint.workerName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{complaint.workerName}</p>
                  <p className="text-xs text-neutral-500">{complaint.centerName}</p>
                </div>
              </div>
            </div>
          )}

          {/* SLA */}
          <div className="bg-white border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">SLA Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Submitted</span>
                <span className="text-neutral-700 font-medium">{formatDateTime(complaint.submittedAt)}</span>
              </div>
              {complaint.assignedAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Assigned</span>
                  <span className="text-neutral-700 font-medium">{formatDateTime(complaint.assignedAt)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">SLA Deadline</span>
                <span className="text-warning-600 font-medium">{formatDateTime(complaint.slaDeadline)}</span>
              </div>
              {complaint.resolvedAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Resolved</span>
                  <span className="text-success-600 font-medium">{formatDateTime(complaint.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
