import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, GitMerge, Star, Target, Zap, Rocket, ChevronRight, Activity, Layers } from './ui/Icons';
import { CareerRoadmapData, RoadmapNode } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Alert from './ui/Alert';

const CAREER_TITLE_TO_ID_MAP: { [key: string]: string } = {
  'Software Engineer': 'software-engineer',
  'Data Analyst / Scientist': 'data-analyst',
  'Cybersecurity Analyst': 'cybersecurity',
  'Cloud / DevOps Engineer': 'cloud-devops',
  'AI / Machine Learning Engineer': 'ai-ml',
};

interface CareerRoadmapProps {
  selectedCareer: string | null;
  onClose: () => void;
  onComplete: () => void;
}

const RoadmapCard: React.FC<{ node: RoadmapNode, index: number }> = ({ node, index }) => {
    const isLeft = index % 2 === 0;
    const isGoal = node.id === 'goal';
    
    const cardVariants = {
        hidden: { opacity: 0, x: isLeft ? -50 : 50, scale: 0.9, rotate: isLeft ? -2 : 2 },
        visible: { 
            opacity: 1, 
            x: 0, 
            scale: 1,
            rotate: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    const getIcon = () => {
        if (isGoal) return <Rocket className="w-6 h-6" />;
        if (index === 0) return <Target className="w-6 h-6" />;
        if (index % 2 === 0) return <Zap className="w-6 h-6" />;
        return <Star className="w-6 h-6" />;
    };

    return (
        <motion.div
            variants={cardVariants}
            className={`relative w-full flex ${isLeft ? 'justify-start' : 'justify-end'} ${isGoal ? '!justify-center mb-16' : 'mb-12'}`}
        >
            {/* Connector Line */}
            {!isGoal && (
                <div className={`absolute top-1/2 h-[2px] bg-neutral-200 dark:bg-neutral-800 w-[calc(50%-2.5rem)] transition-colors
                    ${isLeft ? 'left-[calc(50%+1.5rem)]' : 'right-[calc(50%+1.5rem)]'}
                `}>
                    <div className="absolute inset-0 bg-primary-600 opacity-20 blur-sm"></div>
                </div>
            )}
            
            {/* Timeline Dot */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full z-10 transition-all border-4 shadow-2xl
                ${isGoal ? 'bg-primary-600 border-primary-100 dark:border-primary-900 w-8 h-8 ring-8 ring-primary-500/10' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700'}
            `}>
                {isGoal && <div className="absolute inset-0 bg-primary-600 rounded-full animate-ping opacity-20"></div>}
            </div>
            
            <Card className={`
                relative w-full sm:w-[calc(50%-4rem)] p-8 dark:bg-neutral-900 border-2 dark:border-neutral-800 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:border-primary-500/30 group cursor-default overflow-hidden
                ${isGoal ? 'mx-auto text-center !w-full sm:!w-[85%] bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-900/50 shadow-primary-500/10' : ''}
            `}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`flex items-start gap-6 ${isGoal ? 'flex-col items-center' : ''} relative z-10`}>
                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg
                        ${isGoal ? 'bg-primary-600 text-white mb-6 scale-125' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 group-hover:bg-primary-600 group-hover:text-white'}
                    `}>
                        {getIcon()}
                    </div>
                    <div className={isGoal ? 'text-center' : 'text-left'}>
                        <div className={`flex items-center gap-3 mb-3 ${isGoal ? 'justify-center' : 'justify-start'}`}>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 italic">
                                {isGoal ? 'ULTIMATE GOAL' : `STAGE 0${index + 1}`}
                            </span>
                            {!isGoal && <Badge variant="primary" className="italic text-[10px] px-3 py-0.5">ACTIVE PATH</Badge>}
                        </div>
                        <h4 className={`font-black tracking-tight leading-tight italic ${isGoal ? 'text-4xl text-neutral-900 dark:text-white' : 'text-2xl text-neutral-900 dark:text-white'}`}>
                            {node.label}
                        </h4>
                        <p className="mt-4 text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed italic opacity-80 max-w-sm mx-auto">
                            Master core fundamentals and establish a technical baseline for your career expansion.
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ selectedCareer, onClose, onComplete }) => {
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await fetch('./data/career-roadmaps.json');
        const data = await response.json();
        const careerId = selectedCareer ? CAREER_TITLE_TO_ID_MAP[selectedCareer] : null;
        const matchedRoadmap = data.careers.find((r: CareerRoadmapData) => r.id === careerId);
        setRoadmap(matchedRoadmap || null);
      } catch (error) {
        console.error("Failed to load career roadmaps:", error);
        setRoadmap(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, [selectedCareer]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-2xl p-6 lg:p-10 animate-fade-in no-select">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="relative bg-white dark:bg-neutral-950 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border-2 border-white/5 dark:border-neutral-800"
      >
        <header className="p-10 border-b-2 border-neutral-50 dark:border-neutral-900 shrink-0 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <GitMerge className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight italic">Success <span className="text-primary-600">Architect</span></h2>
                <div className="flex items-center gap-4 mt-2">
                    <Badge variant="primary" className="font-black italic text-xs px-4 py-1.5">{selectedCareer}</Badge>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 font-bold italic">
                        <Activity className="w-4 h-4 text-success-500" />
                        <span>Level 01 - Foundational Tier</span>
                    </div>
                </div>
              </div>
            </div>
            <button 
                onClick={onClose} 
                className="w-14 h-14 rounded-2xl flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90 hover:border-2 hover:border-neutral-200 dark:hover:border-neutral-700"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-10 lg:p-16 overflow-y-auto no-scrollbar bg-neutral-50/30 dark:bg-neutral-950/30 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent blur-3xl"></div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-8 relative z-10">
                <div className="relative">
                    <div className="w-20 h-20 border-8 border-neutral-100 dark:border-neutral-900 rounded-full"></div>
                    <div className="w-20 h-20 border-8 border-transparent border-t-primary-600 rounded-full animate-spin absolute inset-0"></div>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 font-black uppercase tracking-[0.5em] text-xs animate-pulse italic">Charting Path Evolution...</p>
            </div>
          )}
          
          {!loading && !roadmap && (
            <div className="text-center py-20 relative z-10">
                <Alert variant="error" icon={<Rocket className="w-10 h-10" />}>
                    <p className="text-xl font-black italic mb-2">Roadmap Vector Unavailable</p>
                    <p className="text-neutral-500 font-bold opacity-80 italic">Could not synthesize career path for "{selectedCareer}". Vector mapping failed.</p>
                </Alert>
            </div>
          )}
          
          {roadmap && (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex flex-col items-center space-y-20 pb-24 relative z-10"
            >
                {/* Center Timeline Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-neutral-100 dark:bg-neutral-900 -translate-x-1/2"></div>
                
                {/* Progress Overlay Line */}
                <motion.div 
                    className="absolute top-0 left-1/2 w-[2px] bg-primary-600 -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                    style={{ height: '35%' }}
                />

                {roadmap.nodes.map((node, index) => (
                    <RoadmapCard key={node.id} node={node} index={index} />
                ))}
            </motion.div>
          )}
        </main>
        
        <footer className="p-10 border-t-2 border-neutral-50 dark:border-neutral-900 shrink-0 bg-white dark:bg-neutral-950 backdrop-blur-3xl sticky bottom-0 z-20">
          <div className="flex gap-6 max-w-2xl mx-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-10 py-5 text-lg font-black italic rounded-3xl"
              >
                Return to Base
              </Button>
              <Button
                onClick={onComplete}
                className="flex-1 py-5 text-xl font-black italic shadow-2xl shadow-primary-500/20 rounded-3xl group"
                rightIcon={<ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
              >
                Initialize Journey Completion
              </Button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default CareerRoadmap;