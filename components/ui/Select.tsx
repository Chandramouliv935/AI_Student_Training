import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, hint, options, className = '', id, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-neutral-300 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={selectId}
          className={`
            w-full px-4 py-2.5 pr-10 text-sm
            bg-neutral-900/80 text-neutral-100
            border rounded-xl appearance-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error
              ? 'border-error-500/60 focus:border-error-500 focus:ring-error-500/40'
              : 'border-neutral-700/60 hover:border-neutral-600 focus:border-primary-500/70 focus:ring-primary-500/30'
            }
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-neutral-900 text-neutral-100"
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-400 transition-colors duration-200">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Glow underline on focus */}
        <div className="absolute bottom-0 left-0 right-0 h-px rounded-full bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center" />
      </div>
      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p className="text-xs text-error-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-error-400 inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
