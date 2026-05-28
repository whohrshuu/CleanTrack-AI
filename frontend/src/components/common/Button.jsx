import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500',
  secondary:
    'bg-secondary-50 text-secondary-700 hover:bg-secondary-100 active:bg-secondary-200 focus-visible:ring-secondary-500 border border-secondary-200',
  outline:
    'bg-transparent text-neutral-700 border border-border hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-primary-500',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-primary-500',
  danger:
    'bg-error-500 text-white hover:bg-error-600 active:bg-error-600 focus-visible:ring-error-500',
};

const sizeStyles = {
  sm: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
  md: 'h-8 px-3 text-sm gap-2 rounded-md',
  lg: 'h-10 px-4 text-sm gap-2 rounded-md',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-colors duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
        disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
      {!loading && RightIcon && <RightIcon className="h-4 w-4 shrink-0" />}
    </button>
  );
});

export default Button;
