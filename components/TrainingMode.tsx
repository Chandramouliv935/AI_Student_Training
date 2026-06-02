import React, { useState } from 'react';
import { Check, Lock, Star, Sparkles, ChevronRight, Target, Map, Code, Database, Shield, Cloud, BrainCircuit, X, Play, MessageSquare, UserCheck, RefreshCw, ArrowRight } from './ui/Icons';
import { TrainingModule } from '../types';
import SkillTest from './SkillTest';
import CareerRoadmap from './CareerRoadmap';
import AptitudeTest from './AptitudeTest';
import CommunicationTest from './CommunicationTest';
import HrRound from './HrRound';
import CareerChatbot from './CareerChatbot';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Card from './ui/Card';
import Badge from './ui/Badge';

const careerPaths = [
    { id: 'swe', title: 'Software Engineer', subtitle: 'Backend / Full-Stack', icon: Code },
    { id: 'data', title: 'Data Analyst / Scientist', subtitle: 'Insights from data', icon: Database },
    { id: 'security', title: 'Cybersecurity Analyst', subtitle: 'Protect digital assets', icon: Shield },
    { id: 'cloud', title: 'Cloud / DevOps Engineer', subtitle: 'Infrastructure & scale', icon: Cloud },
    { id: 'ai', title: 'AI / Machine Learning Engineer', subtitle: 'Build intelligent systems', icon: BrainCircuit },
];

const LevelNode: React.FC<{ module: TrainingModule; index: number; onClick: () => void; }> = ({ module, index, onClick }) => {
  const isCompleted = module.status === 'completed';
  const isActive = module.status === 'active';
  const isLocked = module.status === 'locked';
  const isLeft = module.side === 'left';
  const isGoal = module.id === 'goal';

  const cardDelay = 0.5 + index * 0.2;

  let containerStyle: React.CSSProperties = {
    top: module.topPos,
    animation: `popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${cardDelay}s forwards`,
    opacity: 0,
    zIndex: isActive ? 30 : 20,
  };

  let containerClass = 'absolute -translate-y-1/2 flex items-center group';
  
  if (isGoal) {
    containerClass += ' left-0 w-full justify-center';
  } else if (isLeft) {
    containerClass += ' right-[480px] text-left';
  } else { 
    containerClass += ' left-[480px] text-left';
  }
  
  const getModuleIcon = () => {
    switch(module.id) {
        case 'communication': return <MessageSquare className="w-6 h-6"/>;
        case 'hr_round': return <UserCheck className="w-6 h-6" />;
        default: 
            if (isGoal) return <Target className="w-8 h-8" />;
            if (isCompleted) return <Check className="w-6 h-6" strokeWidth={3} />;
            if (isActive) return <Star className="w-6 h-6 animate-spin-slow" strokeWidth={0} fill="currentColor" />;
            return <Lock className="w-5 h-5" />;
    }
  };

  return (
    <div className={containerClass} style={containerStyle}>
      <button
        onClick={isActive ? onClick : undefined}
        disabled={!isActive && !isGoal}
        className={`
          relative transition-all duration-500 bg-white dark:bg-neutral-900 group-hover:scale-[1.05] active:scale-[0.95]
          ${isGoal 
            ? 'flex flex-col items-center justify-center text-center p-10 rounded-[2.5rem] min-w-[320px] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl shadow-neutral-200/40 dark:shadow-black/50 mt-16 scale-110' 
            : 'flex items-center gap-6 p-5 rounded-3xl min-w-[260px]'
          }
          ${isActive && !isGoal 
            ? 'shadow-2xl shadow-primary-500/30 border-2 border-primary-500 cursor-pointer ring-4 ring-primary-500/10' 
            : isCompleted && !isGoal 
              ? 'shadow-xl shadow-neutral-200/50 dark:shadow-black/20 border-2 border-success-500/30' 
              : isLocked && !isGoal 
                ? 'shadow-sm border border-neutral-100 dark:border-neutral-800 opacity-60 grayscale scale-95'
                : 'border-2 border-neutral-100 dark:border-neutral-800' 
          }
        `}
        aria-label={module.title}
      >
        {isActive && !isGoal && (
          <div className="absolute inset-0 rounded-3xl animate-ping-slow bg-primary-500/20 -z-10"></div>
        )}

        <div className={`
          flex items-center justify-center shrink-0 rounded-2xl transition-all duration-500 shadow-lg
          ${isGoal ? 'w-20 h-20 mb-6 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transform group-hover:rotate-12' : 'w-14 h-14 text-white transform group-hover:rotate-6'}
          ${isActive && !isGoal ? 'bg-primary-600 shadow-primary-500/40' : ''}
          ${isCompleted && !isGoal ? 'bg-success-600 shadow-success-500/40' : ''}
          ${isLocked && !isGoal ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 shadow-none' : ''}
        `}>
           {getModuleIcon()}
        </div>

        <div className={`flex flex-col ${isGoal ? 'items-center' : ''}`}>
          <h3 className={`font-black tracking-tight leading-none ${isGoal ? 'text-3xl text-neutral-900 dark:text-white mb-2' : 'text-lg text-neutral-900 dark:text-white'}`}>
            {module.title}
          </h3>
          <p className={`font-bold text-neutral-500 dark:text-neutral-400 ${isGoal ? 'text-lg opacity-60' : 'text-[11px] mt-1 uppercase tracking-widest'}`}>
            {module.subtitle}
          </p>
          {isCompleted && !isGoal && (
              <Badge variant="success" className="mt-2 w-fit text-[9px] font-black tracking-[0.1em]">MASTERED</Badge>
          )}
        </div>

        {!isLocked && !isGoal && !isCompleted && (
          <ChevronRight className="w-6 h-6 ml-auto text-primary-500 group-hover:translate-x-1 transition-transform" />
        )}
      </button>
    </div>
  );
};


const RoadmapScreen: React.FC<{ modules: TrainingModule[], onModuleClick: (moduleId: string) => void, animateToModuleId: string | null }> = ({ modules, onModuleClick, animateToModuleId }) => (
  <div className="relative w-[800px] h-[1000px] mx-auto mt-12 animate-fade-in mb-32">
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" 
      viewBox="0 0 800 1000" 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lightPulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
      </defs>

      <line 
        x1="400" y1="0" x2="400" y2="1000" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round"
        strokeDasharray="1 15" 
        className="text-neutral-200 dark:text-neutral-800"
      />
      
      {modules.map((mod, i) => {
        const isGoal = mod.id === 'goal';
        const topPercent = parseFloat(mod.topPos);
        const y = (topPercent / 100) * 1000;
        const isLeft = mod.side === 'left';
        
        const horizontalLineLength = 100; 
        const branchX = isLeft ? 400 - horizontalLineLength : 400 + horizontalLineLength;
        
        const isUnlocked = mod.status !== 'locked' || isGoal;
        const strokeColor = isUnlocked ? (mod.status === 'completed' ? '#10b981' : '#3b82f6') : 'currentColor'; 

        return (
          <g key={`module-graphic-${mod.id}`}>
            {!isGoal && (
               <circle 
                cx="400" cy={y} r="8"
                fill="white" 
                stroke={strokeColor}
                strokeWidth="4" 
                className={`animate-pop-in-sm ${!isUnlocked ? 'text-neutral-200 dark:text-neutral-800' : ''}`}
                style={{animationDelay: `${i * 0.15}s`, opacity: 0}} 
                filter={isUnlocked ? 'url(#glow)' : ''}
              />
            )}

            {!isGoal && (
              <path 
                d={`M 400 ${y} L ${branchX} ${y}`}
                stroke={strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                className={`animate-draw-branch ${!isUnlocked ? 'text-neutral-200 dark:text-neutral-800 opacity-30' : ''}`}
                style={{ animationDelay: `${0.2 + i * 0.15}s` }}
              />
            )}
            
            {isGoal && (
               <circle 
                cx="400" cy={y - 80} r="6" 
                fill="#d1d5db"
                className="animate-pop-in-sm opacity-30"
               />
            )}
            
            {animateToModuleId === mod.id && !isGoal && (
                <line
                    x1="400" y1={y} x2={branchX} y2={y}
                    stroke="url(#lightPulseGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="animate-light-pulse"
                    style={{ transform: isLeft ? 'scaleX(-1)' : 'scaleX(1)', transformOrigin: isLeft ? 'right' : 'left' }}
                />
            )}
          </g>
        );
      })}
    </svg>

    <div className="relative z-10 w-full h-full">
      {modules.map((module, index) => (
        <LevelNode key={module.id} module={module} index={index} onClick={() => onModuleClick(module.id)} />
      ))}
    </div>
  </div>
);

const IntroScreen: React.FC<{onStart: () => void}> = ({ onStart }) => (
  <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
    <div className="w-24 h-24 bg-primary-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-primary-500/40 transform -rotate-12">
      <Map className="w-12 h-12 text-white" />
    </div>
    <h1 className="text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[0.95] mb-6">
        Forge Your <br/> <span className="text-primary-600">Cognitive Path</span>
    </h1>
    <p className="max-w-2xl text-neutral-500 dark:text-neutral-400 text-xl font-bold leading-relaxed">
      A surgical, step-by-step roadmap architecture designed to scale your technical potential into professional mastery.
    </p>
    <Button
      onClick={onStart}
      size="lg"
      className="mt-14 py-6 px-12 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary-600/30 group"
      rightIcon={<ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
    >
      Initiate Sequence
    </Button>
  </div>
);

const CareerSelectionModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (pathId: string, pathTitle: string) => void; }> = ({ isOpen, onClose, onConfirm }) => {
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    const handleConfirm = () => {
        if (selectedPath) {
            const path = careerPaths.find(p => p.id === selectedPath);
            if (path) {
                onConfirm(path.id, path.title);
            }
        }
    };

    return (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Vector Selection"
          footer={
            <Button
              onClick={handleConfirm}
              disabled={!selectedPath}
              className="w-full py-4 text-lg font-black"
              size="lg"
              rightIcon={<Play className="w-5 h-5" />}
            >
              Start Core Diagnostic
            </Button>
          }
        >
          <p className="text-neutral-500 dark:text-neutral-400 font-bold mb-8">
            Identify your target domain. Our systems will calibrate the roadmap to your choice.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {careerPaths.map(path => {
                const isSelected = selectedPath === path.id;
                return (
                    <button
                      key={path.id}
                      onClick={() => setSelectedPath(path.id)}
                      className={`group p-6 rounded-[1.5rem] border-2 text-left transition-all duration-500 relative overflow-hidden ${
                        isSelected 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 shadow-xl shadow-primary-500/10 scale-105' 
                        : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200 dark:hover:border-neutral-700'
                      }`}
                    >
                        {isSelected && (
                            <div className="absolute top-4 right-4 text-primary-500 animate-pop-in-sm">
                                <Check className="w-5 h-5" strokeWidth={4} />
                            </div>
                        )}
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary-600 text-white transform rotate-12' : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'}`}>
                                <path.icon className="w-6 h-6" />
                            </div>
                            <span className={`font-black tracking-tight ${isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-neutral-800 dark:text-neutral-200'}`}>{path.title}</span>
                        </div>
                        <p className={`text-xs font-bold leading-relaxed ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-500 dark:text-neutral-400'}`}>{path.subtitle}</p>
                    </button>
                )
            })}
          </div>
        </Modal>
    );
};

interface TrainingModeProps {
  modules: TrainingModule[];
  selectedCareer: string | null;
  onCareerConfirm: (pathId: string, pathTitle: string) => void;
  onModuleComplete: (moduleId: string, score?: number) => void;
  onReset: () => void;
}

const TrainingMode: React.FC<TrainingModeProps> = ({ modules, selectedCareer, onCareerConfirm, onModuleComplete, onReset }) => {
  const [introDismissed, setIntroDismissed] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [animateToModuleId, setAnimateToModuleId] = useState<string | null>(null);
  const [isSkillTestActive, setIsSkillTestActive] = useState(false);
  const [isAptitudeTestActive, setIsAptitudeTestActive] = useState(false);
  const [isCommunicationTestActive, setIsCommunicationTestActive] = useState(false);
  const [isHrRoundActive, setIsHrRoundActive] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  
  const journeyHasStarted = modules[0].status !== 'active';
  const showIntro = !journeyHasStarted && !introDismissed;
  
  const anyTestActive = isSkillTestActive || isAptitudeTestActive || isCommunicationTestActive || isHrRoundActive;

  const handleModuleClick = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.status === 'active') {
      switch (moduleId) {
        case 'career_path': setIsCareerModalOpen(true); break;
        case 'skill_test': setIsSkillTestActive(true); break;
        case 'roadmap': setIsRoadmapOpen(true); break;
        case 'aptitude': setIsAptitudeTestActive(true); break;
        case 'communication': setIsCommunicationTestActive(true); break;
        case 'hr_round': setIsHrRoundActive(true); break;
        default: break;
      }
    }
  };
  
  const handleCareerConfirm = (pathId: string, pathTitle: string) => {
    onCareerConfirm(pathId, pathTitle);
    setIsCareerModalOpen(false);
    setIsSkillTestActive(true);
  };
  
  const handleSkillTestComplete = (finalScore: number) => {
    onModuleComplete('skill_test', finalScore);
    const index = modules.findIndex(m => m.id === 'skill_test');
    triggerAnimation(index);
    setIsSkillTestActive(false);
  };
  
  const handleAptitudeTestComplete = (finalScore: number) => {
    onModuleComplete('aptitude', finalScore);
    const index = modules.findIndex(m => m.id === 'aptitude');
    triggerAnimation(index);
    setIsAptitudeTestActive(false);
  };

  const handleCommunicationTestComplete = (finalScore: number) => {
    onModuleComplete('communication', finalScore);
    const index = modules.findIndex(m => m.id === 'communication');
    triggerAnimation(index);
    setIsCommunicationTestActive(false);
  };

  const handleHrRoundComplete = () => {
    onModuleComplete('hr_round');
    const index = modules.findIndex(m => m.id === 'hr_round');
    triggerAnimation(index);
    setIsHrRoundActive(false);
  };
  
  const handleRoadmapComplete = () => {
    onModuleComplete('roadmap');
    const index = modules.findIndex(m => m.id === 'roadmap');
    triggerAnimation(index);
    setIsRoadmapOpen(false);
  };

  const triggerAnimation = (currentIndex: number) => {
      if (currentIndex < modules.length - 1) {
          const nextModuleId = modules[currentIndex + 1].id;
          setTimeout(() => {
            setAnimateToModuleId(nextModuleId);
            setTimeout(() => setAnimateToModuleId(null), 1200);
        }, 300);
      }
  };

  return (
    <div className="relative w-full overflow-x-auto no-scrollbar pb-24">
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden min-w-[800px]">
        <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-gradient-to-br from-primary-500/10 dark:from-primary-600/5 to-transparent blur-[160px]"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-tl from-secondary-500/10 dark:from-secondary-600/5 to-transparent blur-[160px]"></div>
      </div>
      
      {showIntro && !anyTestActive ? (
        <IntroScreen onStart={() => setIntroDismissed(true)} />
      ) : (
        !anyTestActive && (
          <RoadmapScreen 
              modules={modules} 
              onModuleClick={handleModuleClick}
              animateToModuleId={animateToModuleId} 
          />
        )
      )}
      
      <CareerSelectionModal 
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        onConfirm={handleCareerConfirm}
      />

      {isRoadmapOpen && (
        <CareerRoadmap 
          selectedCareer={selectedCareer}
          onClose={() => setIsRoadmapOpen(false)}
          onComplete={handleRoadmapComplete}
        />
      )}

      {isSkillTestActive && (
        <SkillTest
          onComplete={handleSkillTestComplete}
          careerTitle={selectedCareer}
        />
      )}
      
      {!showIntro && !anyTestActive && (
          <Button
            variant="ghost"
            onClick={() => {
                if (window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
                    onReset();
                    setIntroDismissed(false);
                    setAnimateToModuleId(null);
                }
            }}
            className="absolute top-4 right-8 z-50 flex items-center gap-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl border-2 border-neutral-100 dark:border-neutral-800 rounded-2xl py-3 px-6 text-neutral-500 dark:text-neutral-400 font-extrabold hover:text-error-600 dark:hover:text-error-500 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Map</span>
          </Button>
      )}
      
      {isAptitudeTestActive && (
        <AptitudeTest
          onComplete={handleAptitudeTestComplete}
        />
      )}

      {isCommunicationTestActive && (
        <CommunicationTest
          onComplete={handleCommunicationTestComplete}
        />
      )}

      {isHrRoundActive && (
        <HrRound
          onComplete={handleHrRoundComplete}
        />
      )}

      <CareerChatbot />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInFast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-fast {
            animation: fadeInFast 0.3s ease-out forwards;
        }

        @keyframes drawBranch {
          from { stroke-dasharray: 200; stroke-dashoffset: 200; opacity: 0; }
          to { stroke-dasharray: 200; stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: translateY(-30%) scale(0.9); }
          100% { opacity: 1; transform: translateY(-50%) scale(1); }
        }
        
        @keyframes popInSm {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-pop-in-sm {
           animation: popInSm 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes lightPulse {
          0% { stroke-dashoffset: 240; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { stroke-dashoffset: -240; opacity: 0; }
        }

        .animate-light-pulse {
          stroke-dasharray: 80 240;
          animation: lightPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-draw-branch {
          animation: drawBranch 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-ping-slow {
          animation: pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TrainingMode;