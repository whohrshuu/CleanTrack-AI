import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, MapPin, Upload, X, CheckCircle, Clock, Loader2, Navigation } from 'lucide-react';
import { formatDateTime, getPriorityConfig } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ActiveTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofImages, setProofImages] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/complaints/${id}`);
        setTask(response.data);
      } catch (error) {
        toast.error('Failed to load task details');
        navigate('/worker/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const onDrop = useCallback((files) => {
    const newImgs = files.slice(0, 5 - proofImages.length).map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setProofImages((prev) => [...prev, ...newImgs]);
  }, [proofImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 5 });

  const handleComplete = async () => {
    if (proofImages.length === 0) { toast.error('Upload at least one proof image'); return; }
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('notes', notes);
      proofImages.forEach((img) => {
        formData.append('images', img.file);
      });
      
      await api.put(`/workers/tasks/${id}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Task marked as completed!');
      navigate('/worker/dashboard');
    } catch (error) {
      toast.error('Failed to complete task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!task) return null;

  const priority = getPriorityConfig(task.priority);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <button onClick={() => navigate('/worker/dashboard')} className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 mb-4"><ArrowLeft size={12} /> Back to tasks</button>

      <div className="max-w-2xl space-y-4">
        {/* Task Header */}
        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
            <span className="text-xs font-medium text-neutral-500">{priority.label} Priority</span>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs text-neutral-400">#{task.id}</span>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900 mb-2">{task.title}</h1>
          <p className="text-sm text-neutral-600 mb-3">{task.description}</p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1"><MapPin size={12} />{task.address}</span>
            <span className="flex items-center gap-1"><Clock size={12} />SLA: {formatDateTime(task.slaDeadline)}</span>
          </div>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs font-medium text-accent-600 bg-accent-50 rounded-md hover:bg-accent-100 transition-colors">
            <Navigation size={12} /> Navigate to Location
          </a>
        </div>

        {/* Before Images */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Before Images (Citizen Submission)</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(task.images || []).map((img, i) => (
              <div key={img.id} className="flex-shrink-0 w-28 h-20 bg-neutral-100 rounded-md border border-border flex items-center justify-center text-neutral-400 text-xs relative overflow-hidden">
                <img src={img.imageUrl} alt="Before" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium bg-neutral-100/50 backdrop-blur-[1px]">Before #{i + 1}</div>
              </div>
            ))}
            {(!task.images || task.images.length === 0) && (
              <p className="text-sm text-neutral-500">No images provided</p>
            )}
          </div>
        </div>

        {/* Upload Proof */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Upload Cleaning Proof</h3>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-400 bg-primary-50' : 'border-neutral-300 hover:border-neutral-400'}`}>
            <input {...getInputProps()} />
            <Upload size={24} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-600">Upload after-cleaning photos</p>
            <p className="text-xs text-neutral-400 mt-1">Max 5 images</p>
          </div>
          {proofImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {proofImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border border-border group">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setProofImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Completion Notes</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Describe the cleanup work performed..." className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-1 focus:ring-primary-500" />
        </div>

        <button onClick={handleComplete} disabled={submitting} className="px-6 py-2.5 bg-success-500 text-white text-sm font-medium rounded-md hover:bg-success-600 disabled:opacity-50 transition-colors flex items-center gap-2">
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
          {submitting ? 'Submitting...' : 'Mark as Completed'}
        </button>
      </div>
    </motion.div>
  );
}
