import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Target, Activity, Zap, Layers, RefreshCw } from './ui/Icons';
import { analyzeResume, ATSAnalysisResult } from '../lib/atsClient';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Alert from './ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeATS: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setText('');
      setError(null);
    }
  };

  const analyze = async () => {
    if (!text && !file) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await analyzeResume({
        file,
        text,
        role: jobRole
      }, controller.signal);

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      if (abortControllerRef.current === controller) {
         setIsLoading(false);
         abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20 no-select">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Target className="w-6 h-6" />
                </div>
                <Badge variant="primary" className="font-black">NEURAL COMPLIANCE</Badge>
            </div>
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">ATS <span className="text-primary-600">Optimizer</span></h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xl font-bold mt-4 leading-relaxed max-w-2xl">Visualizing your profile through the lens of enterprise recruitment algorithms.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-6 py-4 rounded-[1.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 dark:shadow-black/20 transition-all hover:border-success-500/50 group">
          <Activity className="w-4 h-4 text-success-500" />
          Neural Engine V3: Online
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="mb-8">
                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] mb-4">Target Role Node</p>
                <Input
                className="p-6 h-16 text-lg font-bold rounded-2xl border-2 dark:bg-neutral-950/50"
                id="jobRole"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                />
            </div>

            <div className="relative border-4 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2rem] p-10 text-center group hover:border-primary-600 transition-all duration-500 dark:bg-neutral-950/30 overflow-hidden mb-8">
                <input
                type="file"
                accept=".txt,.md,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-neutral-50 dark:bg-neutral-900 group-hover:bg-primary-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-700 mb-4 shadow-xl shadow-neutral-200/20 dark:shadow-black/40 group-hover:rotate-6">
                        <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">{file ? file.name : "Select Profile"}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-1 uppercase tracking-[0.2em] font-black italic">PDF / TXT supported</p>
                </div>
            </div>

            <div className="relative py-4 mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-neutral-50 dark:border-neutral-850"></div></div>
                <div className="relative flex justify-center"><span className="px-6 bg-white dark:bg-neutral-900 text-[10px] text-neutral-400 dark:text-neutral-600 font-black uppercase tracking-[0.4em]">Genetic Stream</span></div>
            </div>

            <textarea
                className="w-full h-56 p-8 text-lg font-mono rounded-[2rem] border-2 dark:bg-neutral-950/50 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none resize-none transition-all no-scrollbar mb-8 text-neutral-900 dark:text-white"
                placeholder="Or paste profile vectors..."
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    setFile(null);
                }}
            ></textarea>

            <Button
                onClick={analyze}
                disabled={isLoading || (!text && !file)}
                isLoading={isLoading}
                className="w-full py-6 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary-600/30 group"
                leftIcon={!isLoading ? <Zap className="w-6 h-6" /> : undefined}
            >
                Execute Analysis
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isLoading && !result && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-32 border-2 border-dashed flex flex-col items-center justify-center text-center dark:bg-neutral-900/50 dark:border-neutral-800 h-full min-h-[600px] group transition-all duration-1000 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-600/[0.01] group-hover:bg-primary-600/[0.03] transition-colors duration-1000"></div>
                    <div className="w-28 h-28 bg-neutral-100 dark:bg-neutral-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                        <Activity className="w-14 h-14 text-neutral-400 dark:text-neutral-600 group-hover:text-primary-600" />
                    </div>
                    <h3 className="text-4xl font-black text-neutral-900 dark:text-white mb-6 leading-none tracking-tight italic relative z-10 group-hover:text-primary-600 transition-colors">Neural Diagnostic</h3>
                    <p className="text-xl font-bold text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed relative z-10">
                        Submit your profile to begin high-fidelity compliance mapping against {jobRole} benchmarks.
                    </p>
                </Card>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-32 border-2 border-dashed flex flex-col items-center justify-center text-center dark:bg-neutral-900/50 dark:border-neutral-800 h-full min-h-[600px]">
                    <div className="relative mb-12">
                        <div className="w-32 h-32 border-8 border-neutral-100 dark:border-neutral-800 rounded-full shadow-2xl"></div>
                        <div className="w-32 h-32 border-8 border-transparent border-t-primary-600 rounded-full animate-spin absolute inset-0"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-10 h-10 text-primary-600 animate-pulse" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight leading-none">Diagnostic Stream</h3>
                    <p className="text-xl font-bold text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">Extracting semantic signatures and compliance markers...</p>
                </Card>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-20"
              >
                <Alert variant="error" icon={<Activity className="w-6 h-6" />}>
                    <p className="font-black uppercase tracking-widest text-[10px] mb-2 text-error-600">Core Exception</p>
                    <p className="text-lg font-bold opacity-80">{error}</p>
                </Alert>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  
                    <div className="relative w-44 h-44 flex-shrink-0 group">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow(0 0 10px rgba(37,99,235,0.2))">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-neutral-50 dark:text-neutral-850" strokeWidth="3" />
                            <motion.circle
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: `${result.score}, 100` }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                cx="18" cy="18" r="16" fill="none" stroke="currentColor"
                                className={result.score >= 80 ? 'text-success-500' : result.score >= 60 ? 'text-primary-500' : 'text-error-500'}
                                strokeWidth="3" strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-5xl font-black text-neutral-900 dark:text-white tracking-tighter">{result.score}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1 italic">V-SCORE</span>
                        </div>
                        {/* Pulse effect */}
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${result.score >= 80 ? 'bg-success-500' : 'bg-primary-500'}`}></div>
                    </div>

                    <div className="flex-1 text-center md:text-left relative z-10">
                        <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.3em] mb-4 italic">Neural Alignment Status</p>
                        <h2 className={`text-4xl font-black tracking-tight mb-4 ${
                            result.score >= 80 ? 'text-success-600 dark:text-success-400' :
                            result.score >= 60 ? 'text-primary-600 dark:text-primary-400' :
                            'text-error-600 dark:text-error-400'
                        }`}>
                            {result.score >= 80 ? 'Optimal Compliance' : result.score >= 60 ? 'Partial Alignment' : 'Critical Fault'}
                        </h2>
                        <p className="text-xl font-bold text-neutral-500 dark:text-neutral-400 leading-relaxed italic border-l-4 border-current/20 pl-6">
                            "{result.score >= 80 ? 'Your profile architecture is highly compatible with target enterprise nodes.' :
                            result.score >= 60 ? 'Core vectors are present, but structural optimization is required for high-risk filtering.' :
                            'Significant semantic gaps detected. Neural signatures fail to match basic role milestones.'}"
                        </p>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {result.matched && result.matched.length > 0 && (
                        <Card className="p-8 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                            <header className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-success-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Verified Vectors</h3>
                            </header>
                            <div className="flex flex-wrap gap-2">
                                {result.matched.map((kw, i) => (
                                    <Badge key={i} variant="success" className="px-4 py-1.5 font-bold italic tracking-tight">{kw}</Badge>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card className="p-8 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                        <header className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-warning-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Anomaly Vectors</h3>
                        </header>
                        <div className="flex flex-wrap gap-2">
                            {result.missing?.map((kw, i) => (
                                <Badge key={i} variant="warning" className="px-4 py-1.5 font-bold italic tracking-tight">{kw}</Badge>
                            )) || <p className="text-neutral-500 italic text-sm">No critical gaps detected.</p>}
                        </div>
                    </Card>
                </div>

                <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                    <header className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
                            <Layers className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Structural Refactoring</h3>
                            <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mt-2">Algorithm-driven strategic patches</p>
                        </div>
                    </header>
                    <ul className="space-y-6">
                        {result.tips?.map((improvement, i) => (
                        <li key={i} className="flex items-start gap-6 group p-6 bg-neutral-50/50 dark:bg-neutral-950/50 rounded-3xl border-2 border-neutral-50 dark:border-neutral-850 hover:bg-white dark:hover:bg-neutral-900 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-relaxed italic">{improvement}</p>
                            </div>
                        </li>
                        ))}
                        <Button
                            variant="primary"
                            className="w-full py-4 font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/10 focus:ring-0"
                            leftIcon={<RefreshCw className="w-5 h-5" />}
                        >
                            Sync to Profile Node
                        </Button>
                    </ul>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeATS;