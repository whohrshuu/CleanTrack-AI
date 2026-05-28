import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-6 h-6 text-primary-500 animate-spin mb-2" />
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}
