import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  as = 'button',
  href,
  target,
  rel,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed disabled:saturate-50 select-none rounded-xl';

  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 focus-visible:ring-primary-500 shadow-md shadow-primary-900/40 hover:shadow-glow-primary',
    secondary:
      'bg-secondary-500 text-white hover:bg-secondary-400 active:bg-secondary-600 focus-visible:ring-secondary-400 shadow-md shadow-secondary-900/30 hover:shadow-glow-cyan',
    gradient:
      'bg-gradient-primary text-white hover:opacity-90 active:opacity-80 focus-visible:ring-primary-500 shadow-md shadow-primary-900/40 hover:shadow-glow-primary',
    outline:
      'border border-neutral-700 bg-transparent text-neutral-200 hover:border-primary-500 hover:text-primary-300 hover:bg-primary-500/10 focus-visible:ring-primary-500',
    ghost:
      'bg-transparent text-neutral-300 hover:bg-white/8 hover:text-white focus-visible:ring-neutral-400',
    danger:
      'bg-error-600 text-white hover:bg-error-500 active:bg-error-700 focus-visible:ring-error-500 shadow-md shadow-error-900/30',
    success:
      'bg-success-600 text-white hover:bg-success-500 active:bg-success-700 focus-visible:ring-success-500 shadow-md shadow-success-900/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-current flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = (
    <>
      {isLoading ? <Spinner /> : leftIcon ? <span className="flex-shrink-0">{leftIcon}</span> : null}
      {children}
      {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  );

  if (as === 'a') {
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses} {...(props as any)}>
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};

export default Button;
