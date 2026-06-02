import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ title, children, variant = 'info', className = '', onClose }) => {
  const variants = {
    info: {
      container: 'bg-secondary-500/10 border-secondary-500/30 text-secondary-200',
      icon: <Info className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />,
      titleColor: 'text-secondary-300',
    },
    success: {
      container: 'bg-success-500/10 border-success-500/30 text-success-200',
      icon: <CheckCircle className="h-5 w-5 text-success-400 flex-shrink-0 mt-0.5" />,
      titleColor: 'text-success-300',
    },
    warning: {
      container: 'bg-warning-500/10 border-warning-500/30 text-warning-200',
      icon: <AlertTriangle className="h-5 w-5 text-warning-400 flex-shrink-0 mt-0.5" />,
      titleColor: 'text-warning-300',
    },
    error: {
      container: 'bg-error-500/10 border-error-500/30 text-error-200',
      icon: <AlertCircle className="h-5 w-5 text-error-400 flex-shrink-0 mt-0.5" />,
      titleColor: 'text-error-300',
    },
  };

  const v = variants[variant];

  return (
    <div
      className={`
        relative flex gap-3 p-4 rounded-xl border backdrop-blur-sm
        ${v.container} ${className}
      `}
    >
      {v.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`text-sm font-semibold mb-1 ${v.titleColor}`}>{title}</h3>
        )}
        <div className="text-sm leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 -mt-0.5 p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-all duration-150"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
