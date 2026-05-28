import { useState } from 'react';
import { getInitials } from '@/utils/helpers';

const sizeConfig = {
  sm: { container: 'w-6 h-6 text-[10px]', dot: 'w-2 h-2 -bottom-0 -right-0' },
  md: { container: 'w-8 h-8 text-xs', dot: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5' },
  lg: { container: 'w-10 h-10 text-sm', dot: 'w-3 h-3 -bottom-0.5 -right-0.5' },
  xl: { container: 'w-12 h-12 text-base', dot: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5' },
};

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  busy: 'bg-error-500',
  away: 'bg-warning-500',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  status,
  className = '',
}) {
  const [imgError, setImgError] = useState(false);
  const config = sizeConfig[size];
  const initials = getInitials(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          onError={() => setImgError(true)}
          className={`${config.container} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${config.container} flex items-center justify-center rounded-full bg-primary-100 font-medium text-primary-700`}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={`absolute ${config.dot} rounded-full border-2 border-surface ${statusColors[status] || statusColors.offline}`}
        />
      )}
    </div>
  );
}
