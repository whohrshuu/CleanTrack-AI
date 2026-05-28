import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    id,
    error,
    helperText,
    leftIcon: LeftIcon,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <LeftIcon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            block w-full rounded-md border bg-surface px-3 py-2 text-sm text-neutral-900
            placeholder:text-neutral-400
            transition-colors duration-200
            focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
            disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400
            ${LeftIcon ? 'pl-9' : ''}
            ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-border'}
            ${className}
          `.trim()}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-error-500">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-neutral-400">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
