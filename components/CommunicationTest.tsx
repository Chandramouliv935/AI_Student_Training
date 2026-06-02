import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import { CheckCircle, Timer, X, Sparkles, Play, MessageSquare, ArrowRight, RefreshCw } from './ui/Icons';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Alert from './ui/Alert';

const TEST_DURATION_MINUTES = 5;
const NUMBER_OF_QUESTIONS = 5;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const StartScreen: React.FC<{ onStart: () => void; }> = ({ onStart }) => (
    <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl"
        >
            <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30">
                    <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-black text-neutral-900 dark:text-white text-center tracking-tight">Communication</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-center mt-3 text-lg">Professional Interaction & Logic Assessment</p>
                
                <div className="my-10 space-y-4">
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <Timer className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 dark:text-white">Rapid Assessment</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Fixed <strong className="text-primary-600">{TEST_DURATION_MINUTES} minute</strong> window for all responses.</p>
                        </div>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <Sparkles className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 dark:text-white">{NUMBER_OF_QUESTIONS} Deep Scenarios</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Context-heavy questions focusing on workplace dynamics.</p>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={onStart} 
                    className="w-full py-4 text-lg font-black shadow-xl shadow-primary-500/20"
                    leftIcon={<Play className="w-5 h-5" />}
                >
                    Start Communication Matrix
                </Button>
            </Card>
        </motion.div>
    </div>
);

interface CommunicationTestProps {
  onComplete: (finalScore: number) => void;
}

const CommunicationTest: React.FC<CommunicationTestProps> = ({ onComplete }) => {
  const [testState, setTestState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ question: Question; selected: number; isCorrect: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_MINUTES * 60);

  const finishTest = useCallback(() => {
    setTestState('finished');
  }, []);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`./data/communication-questions.json`);
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
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(TEST_DURATION_MINUTES * 60);
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

    return () => clearInterval(timer);
  }, [testState, finishTest]);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answerIndex;
    
    setAnswers(prev => [...prev, { question: currentQuestion, selected: selectedAnswer, isCorrect }]);
    setSelectedAnswer(null);

    if (currentQuestionIndex < NUMBER_OF_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };
  
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  if (loading || !currentQuestion) {
    return (
        <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Loading Communication Hub</p>
        </div>
    );
  }

  if (testState === 'idle') {
    return <StartScreen onStart={startTest} />;
  }

  if (testState === 'finished') {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const percentageScore = (correctAnswers / NUMBER_OF_QUESTIONS) * 100;

    return (
      <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4 animate-fade-in overflow-y-auto no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <Card className="p-10 dark:bg-neutral-900 dark:border-neutral-800 text-center">
            <div className="w-20 h-20 bg-success-100 dark:bg-success-900/30 text-success-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-success-500/10">
                <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Test Completed</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-lg">Results processed and verified.</p>
            
            <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 my-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-all duration-700"></div>
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.2em] mb-2">Efficiency Rating</p>
                <p className="text-6xl font-black text-primary-600 mb-2 tabular-nums">{percentageScore.toFixed(0)}%</p>
                <Badge variant="primary" className="font-bold">
                    {correctAnswers} of {NUMBER_OF_QUESTIONS} Correct
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={resetTest} 
                variant="outline"
                className="w-full py-4 text-base font-bold transition-all border-2"
                leftIcon={<RefreshCw className="w-5 h-5" />}
              >
                Retry Logic Map
              </Button>
              <Button 
                onClick={() => onComplete(percentageScore)} 
                className="w-full py-4 text-base font-black shadow-xl shadow-primary-500/20"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Proceed to Hub
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  const progress = (currentQuestionIndex / NUMBER_OF_QUESTIONS) * 100;
  
  return (
    <div className="fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 p-6 lg:p-12 flex flex-col no-select overflow-hidden" style={{ userSelect: 'none' }}>
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center font-black text-xl shadow-lg shadow-primary-500/10"><MessageSquare size={24}/></div>
          <div>
            <h1 className="font-extrabold text-xl text-neutral-900 dark:text-white leading-tight uppercase tracking-tight">Comm Verification</h1>
            <Badge variant="primary">SECURE CHANNEL ACTIVE</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-[1.5rem] bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 shadow-sm">
          <Timer className="w-6 h-6 text-primary-600" />
          <span className="font-black text-lg text-neutral-900 dark:text-white tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </header>
      
      <div className="w-full max-w-5xl mx-auto mb-10">
        <div className="flex justify-between text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-3">
            <span>Transmission Progress</span>
            <span>Packet {currentQuestionIndex + 1} / {NUMBER_OF_QUESTIONS}</span>
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
                <h2 className="text-2xl md:text-4xl font-black text-neutral-900 dark:text-white leading-[1.15] mb-12 tracking-tight">{currentQuestion.question}</h2>
                
                <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center gap-5 group/opt
                            ${selectedAnswer === index
                            ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-500 shadow-xl shadow-primary-500/10 ring-2 ring-primary-500/20'
                            : 'bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black transition-all
                            ${selectedAnswer === index ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-900 text-neutral-400 border border-neutral-100 dark:border-neutral-800 group-hover/opt:text-neutral-900 dark:group-hover/opt:text-white'}
                        `}>
                            {String.fromCharCode(65 + index)}
                        </div>
                        <span className={`text-lg font-bold transition-all ${selectedAnswer === index ? 'text-primary-900 dark:text-primary-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                            {option}
                        </span>
                    </button>
                ))}
                </div>

                <div className="mt-12 flex justify-end">
                    <Button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null}
                        className="w-full sm:w-auto px-12 py-4 text-lg font-black shadow-2xl shadow-primary-500/20"
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                        {currentQuestionIndex === NUMBER_OF_QUESTIONS - 1 ? 'Verify Analysis' : 'Next Packet'}
                    </Button>
                </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunicationTest;
