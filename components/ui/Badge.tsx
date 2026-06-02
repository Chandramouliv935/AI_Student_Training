import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'gradient';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variants = {
    primary:
      'bg-primary-500/15 text-primary-300 border-primary-500/30 shadow-sm',
    secondary:
      'bg-secondary-500/15 text-secondary-300 border-secondary-500/30 shadow-sm',
    success:
      'bg-success-500/15 text-success-300 border-success-500/30 shadow-sm',
    warning:
      'bg-warning-500/15 text-warning-300 border-warning-500/30 shadow-sm',
    error:
      'bg-error-500/15 text-error-300 border-error-500/30 shadow-sm',
    neutral:
      'bg-neutral-800 text-neutral-300 border-neutral-700',
    gradient:
      'bg-gradient-primary text-white border-transparent shadow-sm',
  };

  const dotColors: Record<string, string> = {
    primary:   'bg-primary-400',
    secondary: 'bg-secondary-400',
    success:   'bg-success-400',
    warning:   'bg-warning-400',
    error:     'bg-error-400',
    neutral:   'bg-neutral-400',
    gradient:  'bg-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold tracking-wide rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
