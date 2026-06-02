import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FileEdit,
  Briefcase,
  BookOpen,
  BarChart2,
  LogOut,
  ShieldAlert,
  Globe,
  Sparkles,
} from './ui/Icons';
import { NavItem, UserProfile } from '../types';
import SidebarItem from './ui/SidebarItem';

const navItems: NavItem[] = [
  { id: 'trends',        label: 'Job Trend Analysis',        icon: LayoutDashboard, path: '/' },
  { id: 'training',      label: 'Training Mode',             icon: BookOpen,        path: '/training-mode' },
  { id: 'builder',       label: 'Role-Based Resume Builder', icon: FileEdit,        path: '/builder' },
  { id: 'ats',           label: 'Resume ATS Analyzer',       icon: FileText,        path: '/ats' },
  { id: 'matching',      label: 'Smart Job Matching',        icon: Briefcase,       path: '/matching' },
  { id: 'fake-job',      label: 'Fake Job Detection',        icon: ShieldAlert,     path: '/fake-job-detection' },
  { id: 'accessibility', label: 'Opportunity Access',        icon: Globe,           path: '/opportunity-accessibility' },
  { id: 'progress',      label: 'Progress Dashboard',        icon: BarChart2,       path: '/progress' },
];

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen, onClose, userProfile }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0 z-20 bg-neutral-950/70 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          bg-neutral-950 border-r border-neutral-800/60
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Ambient glow top */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary-600/8 to-transparent pointer-events-none" />

        {/* Logo / Brand */}
        <div className="relative px-4 pt-5 pb-4 border-b border-neutral-800/60">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 opacity-90" />
              <div className="absolute inset-0 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl ring-1 ring-primary-400/30" />
            </div>
            <div>
              <span className="block font-extrabold text-sm text-neutral-100 tracking-tight leading-tight">
                CareerFlow
              </span>
              <span className="block text-[10px] font-semibold text-primary-400 tracking-widest uppercase">
                AI Navigator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-0.5">
          <p className="px-3 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            Main Menu
          </p>
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              path={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
            />
          ))}
        </nav>

        {/* User section + Logout */}
        <div className="px-3 py-3 border-t border-neutral-800/60 space-y-1">
          {/* Profile link */}
          <NavLink
            to="/profile"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) => `
              flex items-center gap-3 w-full p-2.5 rounded-xl
              transition-all duration-200
              ${isActive
                ? 'bg-neutral-800/80'
                : 'hover:bg-neutral-800/50'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {userProfile.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-neutral-950" />
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <p className={`font-semibold text-xs truncate ${isActive ? 'text-neutral-100' : 'text-neutral-300'}`}>
                    {userProfile.name}
                  </p>
                  <p className="text-[10px] text-neutral-600 truncate">
                    {userProfile.email}
                  </p>
                </div>
              </>
            )}
          </NavLink>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
              text-xs font-semibold text-neutral-600
              hover:text-error-400 hover:bg-error-500/10
              transition-all duration-200
            "
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;