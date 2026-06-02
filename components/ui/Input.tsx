import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-neutral-300 tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-400 transition-colors duration-200 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`
            w-full bg-neutral-900/80 border rounded-xl
            text-sm text-neutral-100 placeholder:text-neutral-600
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950
            disabled:opacity-40 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'px-4'}
            ${rightElement ? 'pr-12' : 'pr-4'}
            py-2.5
            ${error
              ? 'border-error-500/60 focus:border-error-500 focus:ring-error-500/40'
              : 'border-neutral-700/60 hover:border-neutral-600 focus:border-primary-500/70 focus:ring-primary-500/30'
            }
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {rightElement}
          </div>
        )}

        {/* Glow underline on focus */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-px rounded-full
            bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600
            scale-x-0 group-focus-within:scale-x-100
            transition-transform duration-300 origin-center
          `}
        />
      </div>

      {hint && !error && (
        <p className="text-xs text-neutral-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-error-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-error-400 inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
