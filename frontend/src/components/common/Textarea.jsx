import { forwardRef } from 'react';

const resizeMap = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    error,
    helperText,
    maxLength,
    showCount = false,
    resize = 'vertical',
    rows = 4,
    value,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  const textareaId = id || props.name;
  const charCount = value?.length || 0;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`
          block w-full rounded-md border bg-surface px-3 py-2 text-sm text-neutral-900
          placeholder:text-neutral-400
          transition-colors duration-200
          focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
          disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400
          ${resizeMap[resize]}
          ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-border'}
          ${className}
        `.trim()}
        {...props}
      />
      <div className="flex items-center justify-between">
        <div>
          {error && (
            <p className="text-xs text-error-500">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-xs text-neutral-400">{helperText}</p>
          )}
        </div>
        {showCount && maxLength && (
          <p
            className={`text-xs ${
              charCount >= maxLength ? 'text-error-500' : 'text-neutral-400'
            }`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

export default Textarea;
