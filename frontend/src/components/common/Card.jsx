const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export default function Card({
  children,
  header,
  footer,
  padding = 'md',
  className = '',
  ...props
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface shadow-xs ${className}`}
      {...props}
    >
      {header && (
        <div className="border-b border-border px-4 py-3">
          {typeof header === 'string' ? (
            <h3 className="text-sm font-semibold text-neutral-900">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && (
        <div className="border-t border-border px-4 py-3">{footer}</div>
      )}
    </div>
  );
}
