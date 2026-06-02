import React, { useState } from 'react';
import { Menu } from './ui/Icons';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userProfile: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, userProfile }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-950 overflow-hidden">
      <Sidebar
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userProfile={userProfile}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="
          relative z-10 flex items-center justify-between
          px-4 py-3 shrink-0
          bg-neutral-950/80 backdrop-blur-xl
          border-b border-neutral-800/60
        ">
          {/* Gradient line at very top of header */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-600/40 to-transparent" />

          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="
                lg:hidden p-2 -ml-1 rounded-xl
                text-neutral-500 hover:text-neutral-200
                hover:bg-neutral-800 transition-all duration-150
              "
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile brand */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex-shrink-0" />
              <span className="font-extrabold text-sm text-neutral-100 tracking-tight">
                CareerFlow <span className="text-primary-400">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;