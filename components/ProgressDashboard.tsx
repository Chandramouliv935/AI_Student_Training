import React from 'react';
import { CheckCircle, Star, Lock, PieChart, BarChart2, Zap, Activity, Target, ShieldCheck } from './ui/Icons';
import { TrainingModule } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { motion } from 'framer-motion';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: string;
}> = ({ title, value, icon: Icon, iconBg, trend }) => (
  <Card className="p-8 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
    <div className="flex items-center gap-6 relative z-10">
      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary-500/20 ${iconBg} text-white transform group-hover:rotate-6 transition-transform duration-500`}>
        <Icon className="w-10 h-10" />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
            <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.3em] italic">
                {title}
            </p>
            {trend && <Badge variant="success" className="text-[9px] px-3 py-0.5 font-black italic">{trend}</Badge>}
        </div>
        <p className="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter italic">
          {value}
        </p>
      </div>
    </div>
  </Card>
);

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-4 overflow-hidden shadow-inner p-1">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-primary-600 h-full rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer scale-x-150"></div>
    </motion.div>
  </div>
);

const ModuleCard: React.FC<{ module: TrainingModule; selectedCareer: string | null; }> = ({ module, selectedCareer }) => {
  const { title, status, score } = module;
  
  if (module.id === 'goal') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-7 h-7 text-success-600 dark:text-success-400" />;
      case 'active': return <Star className="w-7 h-7 text-primary-600 dark:text-primary-400 fill-current animate-pulse" />;
      case 'locked': return <Lock className="w-7 h-7 text-neutral-300 dark:text-neutral-700" />;
      default: return null;
    }
  };

  const statusVariants: Record<string, "success" | "primary" | "warning"> = {
    completed: "success",
    active: "primary",
    locked: "warning",
  };

  const statusLabels: Record<string, string> = {
    completed: "SYNCHRONIZED",
    active: "PROCESSING",
    locked: "RESTRICTED",
  };

  return (
    <Card className={`p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800 transition-all duration-500 hover:border-primary-500/30 group ${status === 'locked' ? 'opacity-30 grayscale' : 'shadow-2xl shadow-neutral-200/20 dark:shadow-black/40'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 ${status === 'completed' ? 'bg-success-50 dark:bg-success-900/10' : status === 'active' ? 'bg-primary-50 dark:bg-primary-900/10' : 'bg-neutral-50 dark:bg-neutral-800'}`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight italic leading-none">{title}</h3>
            {module.id === 'career_path' && selectedCareer && status === 'completed' && (
                <div className="flex items-center gap-2 mt-3">
                    <Badge variant="primary" className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 italic">VECTOR: {selectedCareer}</Badge>
                </div>
            )}
          </div>
        </div>
        <Badge variant={statusVariants[status] || "primary"} className="px-6 py-2 font-black uppercase tracking-[0.2em] italic text-[10px]">
          {statusLabels[status]}
        </Badge>
      </div>
      
      {typeof score === 'number' && status === 'completed' && (
        <div className="mt-10 pt-10 border-t-2 border-neutral-100 dark:border-neutral-850 space-y-6">
          <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] italic mb-2">NEURAL SIGNAL STRENGTH</p>
                <p className="text-sm font-bold text-neutral-500 dark:text-neutral-500 italic">Conceptual mapping expansion verified.</p>
            </div>
            <p className="text-4xl font-black text-primary-600 dark:text-primary-400 tracking-tighter italic">{score}<span className="text-xl opacity-40 ml-1">%</span></p>
          </div>
          <ProgressBar value={score} />
        </div>
      )}
    </Card>
  );
};

interface ProgressDashboardProps {
  modules: TrainingModule[];
  selectedCareer: string | null;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ modules, selectedCareer }) => {
  const completedModules = modules.filter(m => m.status === 'completed');
  const totalModules = modules.filter(m => m.id !== 'goal').length;
  const overallCompletion = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;
  
  const scoredModules = completedModules.filter(m => typeof m.score === 'number');
  const averageScore = scoredModules.length > 0
    ? Math.round(scoredModules.reduce((acc, m) => acc + (m.score || 0), 0) / scoredModules.length)
    : 0;

  return (
    <div className="space-y-16 animate-fade-in pb-32 no-select">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl">
                    <Activity className="w-8 h-8" />
                </div>
                <Badge variant="primary" className="font-black italic text-xs px-6 py-1.5 tracking-widest">NEURAL ARCHIVE V9</Badge>
            </div>
          <h1 className="text-7xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none italic uppercase">Diagnostic <span className="text-primary-600">Metrics</span></h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-2xl font-bold mt-8 italic leading-relaxed max-w-2xl">High-fidelity visualization of cognitive evolution and milestone extraction logs.</p>
        </div>
        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 px-10 py-6 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl group transition-all hover:border-primary-500/50">
          <Zap className="w-5 h-5 text-primary-600 animate-pulse group-hover:scale-125 transition-transform" />
          <span className="italic">Neural Sync: HIGH-FIDELITY</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <StatCard 
          title="Archive Saturation" 
          value={`${overallCompletion}%`}
          icon={PieChart}
          iconBg="bg-primary-600"
          trend="+5.2% DELTA"
        />
        <StatCard 
          title="Aggregated IQ Scalar" 
          value={averageScore > 0 ? `${averageScore}%` : '---'}
          icon={Target}
          iconBg="bg-success-600"
          trend="STABLE"
        />
      </div>

      <Card className="p-12 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-600/[0.02] rounded-full blur-[100px] -mr-80 -mt-80"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-[1.5rem] flex items-center justify-center text-neutral-900 dark:text-white shadow-xl shadow-black/5">
                    <BarChart2 className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic uppercase">Architecture <span className="text-primary-600">History</span></h2>
                    <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em] mt-3 italic">Extraction logs & validation states</p>
                </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-neutral-50 dark:bg-neutral-850 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <ShieldCheck className="w-5 h-5 text-success-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 italic">Integrity Verified</span>
            </div>
        </div>
        
        <div className="space-y-8 relative z-10">
          {modules.map(module => (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={module.id}
            >
                <ModuleCard module={module} selectedCareer={selectedCareer} />
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
