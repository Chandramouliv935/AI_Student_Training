import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

      <Card className="w-full max-w-md p-8 md:p-10 dark:bg-neutral-900/60 dark:border-neutral-800/80 backdrop-blur-xl relative overflow-hidden border-gradient">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
        
        <div className="text-center mb-8 relative">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-2xl mb-4 shadow-lg shadow-primary-500/20">
            C
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-100 tracking-tight mb-2 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Welcome to CareerFlow
          </h1>
          <p className="text-neutral-500 text-sm font-medium">Your AI-powered career co-pilot.</p>
        </div>

        <div className="space-y-4 relative">
          <Button 
            variant="outline"
            className="w-full gap-3 py-2.5 rounded-xl border-neutral-700/60 text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600"
            onClick={handleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800/60"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-neutral-900 text-neutral-500 font-medium">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              required
              className="rounded-xl py-2.5 bg-neutral-950/80 border-neutral-700/60 focus:border-primary-500/70 focus:ring-primary-500/30 text-white"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              className="rounded-xl py-2.5 bg-neutral-950/80 border-neutral-700/60 focus:border-primary-500/70 focus:ring-primary-500/30 text-white"
            />
            <Button 
              type="submit"
              variant="gradient"
              className="w-full py-2.5 rounded-xl shadow-lg shadow-primary-600/20 active:scale-[0.98]"
              isLoading={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500 relative">
          Don't have an account? <a href="#" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Create account</a>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
