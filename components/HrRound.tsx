import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HrQuestion } from '../types';
import { CheckCircle, X, Sparkles, Play, UserCheck, ChevronRight, ArrowRight, RefreshCw } from './ui/Icons';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import TextArea from './ui/TextArea';

const StartScreen: React.FC<{ onStart: () => void; }> = ({ onStart }) => (
    <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl"
        >
            <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30">
                    <UserCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-black text-neutral-900 dark:text-white text-center tracking-tight">HR Round</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-center mt-3 text-lg">Behavioral Pattern & Soft Skill Practice</p>
                
                <div className="my-10 space-y-4">
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <Sparkles className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 dark:text-white">Curated Scenarios</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Master 5 critical behavioral questions used by top-tier firms.</p>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 dark:text-white">Free-flow Practice</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">No time constraints. Focus on depth and articulation of your story.</p>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={onStart} 
                    className="w-full py-4 text-lg font-black shadow-xl shadow-primary-500/20"
                    leftIcon={<Play className="w-5 h-5" />}
                >
                    Initialize Performance Map
                </Button>
            </Card>
        </motion.div>
    </div>
);

interface HrRoundProps {
  onComplete: () => void;
}

const HrRound: React.FC<HrRoundProps> = ({ onComplete }) => {
  const [testState, setTestState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [questions, setQuestions] = useState<HrQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(5).fill(''));
  const [currentAnswer, setCurrentAnswer] = useState('');

  const finishTest = useCallback(() => {
    setTestState('finished');
  }, []);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`./data/hr-round-questions.json`);
      if (!response.ok) throw new Error(`Failed to load questions`);
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const startTest = () => setTestState('running');
  
  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(5).fill(''));
    setCurrentAnswer('');
    setTestState('idle');
    loadQuestions();
  };

  useEffect(() => { loadQuestions() }, [loadQuestions]);
  
  const handleNextQuestion = () => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(updatedAnswers[currentQuestionIndex + 1]);
    } else {
      finishTest();
    }
  };

  if (loading) {
    return (
        <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Syncing Behavioral Core</p>
        </div>
    );
  }

  if (testState === 'idle') {
    return <StartScreen onStart={startTest} />;
  }

  if (testState === 'finished') {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4 animate-fade-in overflow-y-auto no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl py-8"
        >
          <Card className="p-10 dark:bg-neutral-900 dark:border-neutral-800 text-center">
            <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 text-success-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-success-500/10">
                <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Practice Finalized</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-lg">Your articulation and narratives have been recorded.</p>
            
            <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 my-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all duration-700"></div>
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.2em] mb-4">Neural Readiness</p>
                <p className="text-lg font-bold text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Consistent reflection on behavioral questions significantly improves cognitive retrieval during high-pressure sessions.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={resetTest} 
                variant="outline"
                className="w-full py-4 text-base font-bold transition-all border-2"
                leftIcon={<RefreshCw className="w-5 h-5" />}
              >
                Re-articulate
              </Button>
              <Button 
                onClick={onComplete} 
                className="w-full py-4 text-base font-black shadow-xl shadow-primary-500/20"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Archive Practice
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;
  
  return (
    <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 p-6 lg:p-12 flex flex-col no-select overflow-hidden" style={{ userSelect: 'none' }}>
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center font-black text-xl shadow-lg shadow-primary-500/10"><UserCheck size={24}/></div>
          <div>
            <h1 className="font-extrabold text-xl text-neutral-900 dark:text-white leading-tight uppercase tracking-tight">Behavioral Core</h1>
            <Badge variant="primary">LIVE NARRATIVE MAPPING</Badge>
          </div>
        </div>
      </header>
      
      <div className="w-full max-w-5xl mx-auto mb-10">
        <div className="flex justify-between text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-3">
            <span>Progress Meter</span>
            <span>Scenario {currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden shadow-inner">
            <motion.div 
                className="bg-primary-600 h-full rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl"
          >
            <Card className="p-12 md:p-20 dark:bg-neutral-900 dark:border-neutral-800 relative">
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white leading-[1.15] mb-8 tracking-tight">{currentQuestion.question}</h2>
                <TextArea
                  className="w-full h-64 text-lg p-8 rounded-[2rem] dark:bg-neutral-950/50 border-2"
                  placeholder="Articulate your narrative here..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                />
                <div className="mt-10 flex justify-end">
                    <Button
                        onClick={handleNextQuestion}
                        disabled={!currentAnswer.trim()}
                        className="w-full sm:w-auto px-12 py-4 text-lg font-black shadow-2xl shadow-primary-500/20"
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finalize Practice' : 'Archive & Next'}
                    </Button>
                </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HrRound;
