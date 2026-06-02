import React from 'react';
import { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path?: string;
  onClick?: () => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  path,
  onClick,
  className = '',
}) => {
  const baseClasses = `
    w-full flex items-center gap-3 px-3 py-2.5
    text-sm font-medium rounded-xl
    transition-all duration-200 group
    ${className}
  `;

  const content = (isActive: boolean) => (
    <>
      {/* Icon container */}
      <span
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          transition-all duration-200
          ${isActive
            ? 'bg-primary-600/20 shadow-sm shadow-primary-500/20'
            : 'bg-transparent group-hover:bg-neutral-800'
          }
        `}
      >
        <Icon
          className={`
            h-4 w-4 transition-colors duration-200
            ${isActive
              ? 'text-primary-400'
              : 'text-neutral-500 group-hover:text-neutral-300'
            }
          `}
        />
      </span>

      {/* Label */}
      <span
        className={`
          flex-1 truncate transition-colors duration-200
          ${isActive ? 'text-neutral-100' : 'text-neutral-500 group-hover:text-neutral-300'}
        `}
      >
        {label}
      </span>

      {/* Active indicator bar */}
      {isActive && (
        <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-400 to-secondary-500 flex-shrink-0" />
      )}
    </>
  );

  if (path) {
    return (
      <NavLink
        to={path}
        onClick={onClick}
        className={({ isActive }) => `
          ${baseClasses}
          ${isActive
            ? 'bg-neutral-800/80 shadow-sm'
            : 'hover:bg-neutral-800/50'
          }
        `}
      >
        {({ isActive }) => content(isActive)}
      </NavLink>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} hover:bg-neutral-800/50 text-neutral-500 hover:text-neutral-300`}
    >
      {content(false)}
    </button>
  );
};

export default SidebarItem;
