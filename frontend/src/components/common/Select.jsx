import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    label,
    id,
    options = [],
    placeholder = 'Select an option',
    error,
    helperText,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            block w-full appearance-none rounded-md border bg-surface px-3 py-2 pr-8 text-sm text-neutral-900
            transition-colors duration-200
            focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
            disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400
            ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-border'}
            ${className}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-neutral-400">
          <ChevronDown className="h-4 w-4" />
        </div>
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

export default Select;
