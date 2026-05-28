import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { Upload, MapPin, X, CheckCircle, Camera, Loader2 } from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ComplaintSubmit() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [aiValidating, setAiValidating] = useState(false);
  const [aiValidated, setAiValidated] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', address: '',
    latitude: null, longitude: null,
  });

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.slice(0, 5 - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);

    // Simulate AI validation
    if (newImages.length > 0) {
      setAiValidating(true);
      setAiValidated(false);
      setTimeout(() => {
        setAiValidating(false);
        setAiValidated(true);
      }, 1500);
    }
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
  });

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (images.length <= 1) { setAiValidated(false); }
  };

  const detectLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({
            ...f,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E — Bengaluru`,
          }));
          setDetectingLocation(false);
          toast.success('Location detected');
        },
        () => {
          // Fallback to mock location
          setForm((f) => ({ ...f, latitude: 12.9784, longitude: 77.6408, address: '12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038' }));
          setDetectingLocation(false);
          toast.success('Location set (demo)');
        },
        { timeout: 5000 }
      );
    } else {
      setForm((f) => ({ ...f, latitude: 12.9784, longitude: 77.6408, address: '12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038' }));
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) { toast.error('Please upload at least one image'); return; }
    if (!form.title.trim()) { toast.error('Please enter a title'); return; }
    if (!form.category) { toast.error('Please select a category'); return; }
    if (!form.address) { toast.error('Please set the location'); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success('Complaint submitted successfully!');
    navigate('/citizen/complaints');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Report an Issue</h1>
        <p className="text-sm text-neutral-500 mt-1">Submit a waste complaint with photo evidence and location details.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Image Upload */}
        <section className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
            <Camera size={16} className="text-neutral-500" /> Photo Evidence
          </h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary-400 bg-primary-50' : 'border-neutral-300 hover:border-neutral-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={24} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-600">Drag and drop images here, or click to browse</p>
            <p className="text-xs text-neutral-400 mt-1">JPEG, PNG, WebP · Max 10MB · Up to 5 images</p>
          </div>

          {/* Image previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-border group">
                  <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* AI validation status */}
          {aiValidating && (
            <div className="flex items-center gap-2 mt-3 text-xs text-accent-600">
              <Loader2 size={14} className="animate-spin" /> Validating image with AI...
            </div>
          )}
          {aiValidated && !aiValidating && (
            <div className="flex items-center gap-2 mt-3 text-xs text-success-600">
              <CheckCircle size={14} /> Image validated — no duplicates detected
            </div>
          )}
        </section>

        {/* Location */}
        <section className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-neutral-500" /> Location
          </h3>
          <div className="flex gap-3 mb-3">
            <button type="button" onClick={detectLocation} disabled={detectingLocation} className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-md hover:bg-neutral-50 transition-colors disabled:opacity-50">
              {detectingLocation ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
              {detectingLocation ? 'Detecting...' : 'Auto-detect Location'}
            </button>
          </div>
          <input
            type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Or enter address manually"
            className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          {form.latitude && (
            <p className="text-xs text-neutral-400 mt-2">Coordinates: {form.latitude.toFixed(4)}°N, {form.longitude.toFixed(4)}°E</p>
          )}
        </section>

        {/* Details */}
        <section className="bg-white border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-neutral-800 mb-3">Complaint Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-primary-500">
                <option value="">Select category</option>
                {COMPLAINT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief description of the issue" className="w-full h-9 px-3 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Description <span className="text-neutral-400">(optional)</span></label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Provide additional details about the waste issue, affected areas, or any safety concerns..." className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center gap-2">
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-medium text-neutral-600 border border-border rounded-md hover:bg-neutral-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
