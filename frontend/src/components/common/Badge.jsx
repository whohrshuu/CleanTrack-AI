const colorStyles = {
  success:
    'bg-success-50 text-success-600 border-success-500/20',
  warning:
    'bg-warning-50 text-warning-600 border-warning-500/20',
  error:
    'bg-error-50 text-error-600 border-error-500/20',
  info:
    'bg-info-50 text-accent-600 border-accent-500/20',
  neutral:
    'bg-neutral-100 text-neutral-600 border-neutral-300/40',
};

const dotColors = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-accent-500',
  neutral: 'bg-neutral-400',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-[10px] leading-tight',
  md: 'px-2 py-0.5 text-xs leading-normal',
};

export default function Badge({
  children,
  color = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md border font-medium whitespace-nowrap
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
    >
      {dot && (
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${dotColors[color]}`}
        />
      )}
      {children}
    </span>
  );
}
