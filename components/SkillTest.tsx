import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import { CheckCircle, Timer, ShieldAlert, X, Sparkles, Fullscreen, Play, ArrowRight, RefreshCw, Zap, Activity, Target, ShieldCheck } from './ui/Icons';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Alert from './ui/Alert';

const TEST_DURATION_MINUTES = 15;
const NUMBER_OF_QUESTIONS = 20;
const MAX_CHEAT_ATTEMPTS = 3;

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CAREER_MAP: { [key: string]: string } = {
  'Software Engineer': 'software-engineer',
  'Data Analyst / Scientist': 'data-analyst',
  'Cybersecurity Analyst': 'cybersecurity',
  'Cloud / DevOps Engineer': 'cloud-devops',
  'AI / Machine Learning Engineer': 'ai-ml',
};

const StartScreen: React.FC<{ onStart: () => void; careerTitle: string | null }> = ({ onStart, careerTitle }) => (
    <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl"
        >
            <Card className="p-10 md:p-14 border-2 dark:bg-neutral-900 dark:border-neutral-800 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/[0.03] rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="w-24 h-24 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary-500/30 transform group-hover:rotate-6 transition-transform">
                    <Fullscreen className="w-12 h-12" />
                </div>
                <div className="text-center mb-12">
                    <Badge variant="primary" className="font-black italic text-[10px] px-6 py-1.5 tracking-[0.2em] mb-4">NEURAL INTERFACE V1.4</Badge>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none italic uppercase">Skill <span className="text-primary-600">Integration</span></h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-6 text-lg font-bold italic tracking-tight">{careerTitle || 'Cognitive Vector'}</p>
                </div>
                
                <div className="space-y-6 mb-12 text-left">
                    <div className="p-6 bg-neutral-50 dark:bg-neutral-950/50 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 flex items-start gap-6 transition-all hover:border-primary-500/30 group/item">
                        <div className="w-14 h-14 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center shadow-xl shrink-0 group-hover/item:scale-110 transition-transform">
                            <Timer className="w-7 h-7 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-black text-neutral-900 dark:text-white uppercase tracking-tight italic">Temporal Limit</p>
                            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-500 italic mt-1 leading-relaxed">
                                You have <span className="text-primary-600 font-black">{TEST_DURATION_MINUTES} minutes</span> to complete the neural mapping sequence.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-neutral-50 dark:bg-neutral-950/50 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 flex items-start gap-6 transition-all hover:border-error-500/30 group/item">
                        <div className="w-14 h-14 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center shadow-xl shrink-0 group-hover/item:scale-110 transition-transform">
                            <ShieldAlert className="w-7 h-7 text-error-600" />
                        </div>
                        <div>
                            <p className="font-black text-neutral-900 dark:text-white uppercase tracking-tight italic">Secure Protocol</p>
                            <p className="text-sm font-bold text-neutral-500 dark:text-neutral-500 italic mt-1 leading-relaxed">
                                Full-screen lock required. Switching nodes or exiting grid will trigger sequence termination.
                            </p>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={onStart} 
                    className="w-full py-5 text-xl font-black shadow-2xl shadow-primary-500/30 italic uppercase tracking-widest"
                    leftIcon={<Play className="w-6 h-6" />}
                >
                    Initialize Matrix
                </Button>
            </Card>
        </motion.div>
    </div>
);

interface SkillTestProps {
  onComplete: (finalScore: number) => void;
  careerTitle: string | null;
}

const SkillTest: React.FC<SkillTestProps> = ({ onComplete, careerTitle }) => {
  const [testState, setTestState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [questionPool, setQuestionPool] = useState<{
    easy: Question[];
    medium: Question[];
    hard: Question[];
  }>({ easy: [], medium: [], hard: [] });
  
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ question: Question; selected: number; isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_MINUTES * 60);
  
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [cheatReason, setCheatReason] = useState('');
  const [showCheatWarning, setShowCheatWarning] = useState(false);

  const finishTest = useCallback(() => {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
    }
    setTestState('finished');
  }, []);

  const handleCheatAttempt = useCallback((reason: string) => {
    if (testState !== 'running') return;
    setCheatReason(reason);
    setCheatAttempts(prev => {
      const newCount = prev + 1;
      if (newCount >= MAX_CHEAT_ATTEMPTS) {
        finishTest();
      }
      return newCount;
    });
    setShowCheatWarning(true);
  }, [testState, finishTest]);

  const getNextQuestion = useCallback((preferredDifficulty: 'easy' | 'medium' | 'hard') => {
    const pool = { ...questionPool };
    const difficultyOrder: ('easy' | 'medium' | 'hard')[] = [preferredDifficulty];
    if (preferredDifficulty === 'easy') difficultyOrder.push('medium', 'hard');
    else if (preferredDifficulty === 'medium') difficultyOrder.push('easy', 'hard');
    else difficultyOrder.push('medium', 'easy');

    for (const difficulty of difficultyOrder) {
      const qBank = pool[difficulty];
      if (qBank.length > 0) {
        const nextQuestion = qBank.shift();
        if (nextQuestion) {
          setQuestionPool(pool);
          return nextQuestion;
        }
      }
    }
    return null;
  }, [questionPool]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    const mappedCareer = careerTitle ? CAREER_MAP[careerTitle] || 'software-engineer' : 'software-engineer';
    const fileName = `${mappedCareer}-questions.json`;
    
    try {
      const response = await fetch(`./data/${fileName}`);
      if (!response.ok) throw new Error(`Failed to load ${fileName}`);
      const data: Question[] = await response.json();
      
      const easy = shuffleArray(data.filter(q => q.difficulty === 'easy'));
      const medium = shuffleArray(data.filter(q => q.difficulty === 'medium'));
      const hard = shuffleArray(data.filter(q => q.difficulty === 'hard'));
      
      const initialPool = { easy, medium, hard };
      const firstQuestion = initialPool.medium.shift() || initialPool.easy.shift();
      
      if (firstQuestion) {
        setQuestionPool(initialPool);
        setTestQuestions([firstQuestion]);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }, [careerTitle]);

  const startTest = () => {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Fullscreen error: ${err.message}`);
    });
    setTestState('running');
  };

  const resetTest = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(TEST_DURATION_MINUTES * 60);
    setCheatAttempts(0);
    setCheatReason('');
    setShowCheatWarning(false);
    setTestState('idle');
    loadQuestions();
  };

  useEffect(() => { loadQuestions() }, [loadQuestions]);

  useEffect(() => {
    if (testState !== 'running') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const preventDefault = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'v'].includes(e.key)) {
        handleCheatAttempt('Shortcut used');
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) handleCheatAttempt('Tab switched');
    };
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement && testState === 'running') {
            handleCheatAttempt('Exited full-screen');
        }
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', () => handleCheatAttempt('Copy attempted'));
    document.addEventListener('paste', () => handleCheatAttempt('Paste attempted'));
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', () => handleCheatAttempt('Copy attempted'));
      document.removeEventListener('paste', () => handleCheatAttempt('Paste attempted'));
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [testState, finishTest, handleCheatAttempt]);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = testQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answerIndex;
    
    setAnswers(prev => [...prev, { question: currentQuestion, selected: selectedAnswer, isCorrect }]);
    setSelectedAnswer(null);

    if (currentQuestionIndex < NUMBER_OF_QUESTIONS - 1) {
      const currentDifficulty = currentQuestion.difficulty;
      let nextDifficulty: 'easy' | 'medium' | 'hard' = currentDifficulty;
      if (isCorrect) nextDifficulty = currentDifficulty === 'easy' ? 'medium' : 'hard';
      else nextDifficulty = currentDifficulty === 'hard' ? 'medium' : 'easy';
      
      const nextQuestion = getNextQuestion(nextDifficulty);
      if (nextQuestion) {
        setTestQuestions(prev => [...prev, nextQuestion]);
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishTest();
      }
    } else {
      finishTest();
    }
  };
  
  const currentQuestion = useMemo(() => testQuestions[currentQuestionIndex], [testQuestions, currentQuestionIndex]);

  if (loading || !currentQuestion) {
    return (
        <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-8">
            <div className="w-20 h-20 bg-primary-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 bg-primary-600 animate-ping opacity-20 rounded-[1.5rem]"></div>
                <Activity className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
                <p className="text-neutral-900 dark:text-white font-black italic tracking-widest text-sm uppercase">Synchronizing Matrix</p>
                <div className="flex gap-1 justify-center mt-3">
                    {[0, 1, 2].map(i => (
                        <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-primary-600 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
  }

  if (testState === 'idle') {
    return <StartScreen onStart={startTest} careerTitle={careerTitle} />;
  }

  if (testState === 'finished') {
    const finalScore = answers.reduce((score, ans) => {
        if (ans.isCorrect) {
          if (ans.question.difficulty === 'easy') return score + 1;
          if (ans.question.difficulty === 'medium') return score + 2;
          if (ans.question.difficulty === 'hard') return score + 3;
        }
        return score;
    }, 0);
    const totalPossibleScore = testQuestions.reduce((total, q) => {
      if (q.difficulty === 'easy') return total + 1;
      if (q.difficulty === 'medium') return total + 2;
      if (q.difficulty === 'hard') return total + 3;
      return total;
    }, 0);
    const accuracy = answers.length > 0 ? (answers.filter(a => a.isCorrect).length / answers.length) * 100 : 0;
    const difficultyData = ['easy', 'medium', 'hard'].map(level => ({
        name: level.charAt(0).toUpperCase() + level.slice(1),
        count: answers.filter(a => a.question.difficulty === level).length,
    }));
    const percentageScore = totalPossibleScore > 0 ? Math.round((finalScore / totalPossibleScore) * 100) : 0;

    return (
      <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4 animate-fade-in overflow-y-auto no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-3xl py-12"
        >
          <Card className="p-8 md:p-12 dark:bg-neutral-900 dark:border-neutral-800 text-center rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-success-600/[0.03] rounded-full blur-3xl -mr-40 -mt-40"></div>
            <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 text-success-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-success-500/10 transform rotate-3">
                <CheckCircle className="w-10 h-10" />
            </div>
            <Badge variant="success" className="font-black italic text-[10px] px-6 py-1.5 tracking-[0.2em] mb-4">INTEGRATION FINALIZED</Badge>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter italic uppercase leading-none">Diagnostic <span className="text-success-600">Complete</span></h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-6 text-lg font-bold italic tracking-tight">Comprehensive performance matrix successfully extracted.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 text-left">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 hover:border-primary-500/30 transition-all group">
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] mb-3 italic">Raw Score</p>
                <p className="text-5xl font-black text-primary-600 tracking-tighter italic">{finalScore}<span className="text-sm opacity-40 ml-2 font-black italic">/ {totalPossibleScore}</span></p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 hover:border-primary-500/30 transition-all group">
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] mb-3 italic">Accuracy</p>
                <p className="text-5xl font-black text-primary-600 tracking-tighter italic">{accuracy.toFixed(0)}<span className="text-xl opacity-40 ml-1">%</span></p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 hover:border-primary-500/30 transition-all group">
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] mb-3 italic">Temporal Delta</p>
                <p className="text-5xl font-black text-primary-600 tracking-tighter italic">{formatTime((TEST_DURATION_MINUTES * 60) - timeLeft)}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-10 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 mb-12">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-neutral-900 dark:text-white italic uppercase tracking-widest text-xs">Complexity Distribution Map</h3>
                <div className="h-1.5 w-24 bg-primary-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={difficultyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" opacity={0.3} />
                    <XAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em'}} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 900}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{fill: 'rgba(59, 130, 246, 0.03)'}} 
                        contentStyle={{ borderRadius: '24px', background: '#111', border: '2px solid #333', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '12px 20px' }} 
                    />
                    <Bar dataKey="count" fill="#2563eb" radius={[12, 12, 0, 0]} barSize={64} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button 
                onClick={resetTest} 
                variant="outline"
                className="w-full py-5 text-lg font-black transition-all border-2 rounded-3xl italic uppercase tracking-widest"
                leftIcon={<RefreshCw className="w-6 h-6" />}
              >
                Re-Integrate Assessment
              </Button>
              <Button 
                onClick={() => onComplete(percentageScore)} 
                className="w-full py-5 text-lg font-black shadow-2xl shadow-primary-500/30 rounded-3xl italic uppercase tracking-widest"
                rightIcon={<ArrowRight className="w-6 h-6" />}
              >
                Sync with Archive
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  const progress = (currentQuestionIndex / NUMBER_OF_QUESTIONS) * 100;
  
  return (
    <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 p-4 lg:p-8 flex flex-col no-select overflow-y-auto no-scrollbar" style={{ userSelect: 'none' }}>
      <header className="w-full max-w-7xl mx-auto flex items-end justify-between gap-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-[1rem] flex items-center justify-center font-black text-xl shadow-2xl transform -rotate-3 group hover:rotate-3 transition-transform">
              <Zap className="w-6 h-6" />
          </div>
          <div>
            <Badge variant="primary" className="font-black italic text-[8px] px-4 py-1 tracking-[0.2em] mb-2">NEURAL ASSESSMENT STREAM</Badge>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none italic uppercase">{careerTitle || 'Core'} <span className="text-primary-600">Integration</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-6 px-8 py-3 rounded-[2rem] bg-white dark:bg-neutral-950 border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl">
          <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-widest italic mb-1">Temporal Sync</span>
              <span className="font-black text-2xl text-neutral-900 dark:text-white tabular-nums tracking-tighter italic">{formatTime(timeLeft)}</span>
          </div>
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 rounded-2xl flex items-center justify-center text-primary-600">
              <Timer className="w-7 h-7" />
          </div>
        </div>
      </header>
      
      <div className="w-full max-w-7xl mx-auto mb-10">
        <div className="flex justify-between items-end text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em] mb-4 italic">
            <span>Progress Extraction Phase</span>
            <span className="text-primary-600">Vector {currentQuestionIndex + 1} / {NUMBER_OF_QUESTIONS}</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-4 overflow-hidden shadow-inner p-1">
            <motion.div 
                className="bg-primary-600 h-full rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] relative overflow-hidden" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer scale-x-150"></div>
            </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl"
          >
            <Card className="p-8 md:p-12 dark:bg-neutral-900 dark:border-neutral-800 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-12">
                    <Badge variant={currentQuestion.difficulty === 'easy' ? 'success' : (currentQuestion.difficulty === 'medium' ? 'primary' : 'error')} className="font-black uppercase tracking-[0.3em] text-[10px] px-8 py-2 italic border-2">
                        COMPLEXITY: {currentQuestion.difficulty}
                    </Badge>
                </div>

                <div className="flex flex-col gap-10">
                    <div className="space-y-6">
                        <div className="w-12 h-1.5 bg-primary-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.6)]"></div>
                        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white leading-[1.1] tracking-tighter italic uppercase">{currentQuestion.question}</h2>
                    </div>
                
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(index)}
                                className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all duration-700 flex items-center gap-6 group/opt relative overflow-hidden
                                    ${selectedAnswer === index
                                    ? 'bg-primary-600 dark:bg-primary-600 border-primary-600 shadow-[0_0_40px_rgba(37,99,235,0.25)] scale-[1.02]'
                                    : 'bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-100 dark:border-neutral-800 hover:border-primary-500/40 hover:scale-[1.01]'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-lg transition-all duration-500
                                    ${selectedAnswer === index 
                                        ? 'bg-white text-primary-600 rotate-6' 
                                        : 'bg-white dark:bg-neutral-900 text-neutral-400 border-2 border-neutral-100 dark:border-neutral-800 group-hover/opt:text-primary-600 group-hover/opt:border-primary-500/50'}
                                `}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span className={`text-lg font-bold italic transition-all duration-500 ${selectedAnswer === index ? 'text-white' : 'text-neutral-500 dark:text-neutral-400 group-hover/opt:text-neutral-900 dark:group-hover/opt:text-white'}`}>
                                    {option}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 italic">
                            <ShieldCheck className="w-5 h-5 text-success-500" />
                            Secure Core Mapping Active
                        </div>
                        <Button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null}
                            className="w-full sm:w-auto px-12 py-4 text-lg font-black shadow-2xl shadow-primary-500/30 italic uppercase tracking-widest"
                            rightIcon={<ArrowRight className="w-6 h-6" />}
                        >
                            {currentQuestionIndex === NUMBER_OF_QUESTIONS - 1 ? 'Finalize Stream' : 'Confirm Integration'}
                        </Button>
                    </div>
                </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCheatWarning && (
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl px-6"
            >
                <div className="bg-error-600 text-white p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-8 border-b-8 border-error-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                    <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center shrink-0 animate-pulse">
                        <ShieldAlert className="w-10 h-10"/>
                    </div>
                    <div className="flex-1">
                        <p className="font-black uppercase tracking-[0.3em] text-[11px] opacity-80 mb-2 italic">Security Protocol Breach</p>
                        <p className="font-black text-xl italic tracking-tighter leading-none">{cheatReason} identified.</p>
                        <p className="text-sm font-bold opacity-70 mt-2 italic uppercase">Attempt {cheatAttempts} of {MAX_CHEAT_ATTEMPTS} allowed before auto-purge.</p>
                    </div>
                    <button onClick={() => setShowCheatWarning(false)} className="w-14 h-14 rounded-2xl hover:bg-white/10 flex items-center justify-center transition-colors"><X className="w-8 h-8" /></button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      <style>{`.no-select { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }`}</style>
    </div>
  );
};

export default SkillTest;