import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatStatus, getPriorityConfig } from '@/utils/helpers';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function HeatmapPage() {
  const [complaints, setComplaints] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const [complaintsRes, heatmapRes] = await Promise.all([
          api.get('/complaints?size=100'),
          api.get('/analytics/heatmap')
        ]);
        setComplaints(complaintsRes.data?.content || complaintsRes.data || []);
        setHeatmapData(heatmapRes.data || []);
      } catch (error) {
        toast.error('Failed to load heatmap data');
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmapData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-neutral-900">Complaint Heatmap</h1>
        <p className="text-sm text-neutral-500 mt-1">Visualize complaint density across Bengaluru.</p>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <MapContainer center={[12.9716, 77.5946]} zoom={12} className="h-full w-full" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Heatmap circles */}
          {heatmapData.map((point, i) => (
            <CircleMarker
              key={`heat-${i}`}
              center={[point.lat, point.lng]}
              radius={point.intensity * 30}
              pathOptions={{
                color: '#C4483E',
                fillColor: '#C4483E',
                fillOpacity: point.intensity * 0.4,
                weight: 1,
              }}
            />
          ))}
          {/* Complaint markers */}
          {complaints.map((c) => {
            const priority = getPriorityConfig(c.priority);
            const colors = { CRITICAL: '#C4483E', HIGH: '#D4A843', MEDIUM: '#3A86A8', LOW: '#57606A' };
            return (
              <CircleMarker
                key={`comp-${c.id}`}
                center={[c.latitude, c.longitude]}
                radius={6}
                pathOptions={{ color: colors[c.priority] || '#3A86A8', fillColor: colors[c.priority] || '#3A86A8', fillOpacity: 0.8, weight: 2 }}
              >
                <Popup>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-800 mb-1">#{c.id} {c.title}</p>
                    <p className="text-neutral-500">{c.address}</p>
                    <p className="mt-1"><span className="font-medium">{formatStatus(c.status)}</span> · {priority.label}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </motion.div>
  );
}
