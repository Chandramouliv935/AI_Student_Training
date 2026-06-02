import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, AlertCircle, Sparkles, Globe, FileText, Zap, Activity } from './ui/Icons';
import Button from './ui/Button';
import Input from './ui/Input';
import TextArea from './ui/TextArea';
import Card from './ui/Card';
import Alert from './ui/Alert';
import Badge from './ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const FakeJobDetection: React.FC = () => {
    const [mode, setMode] = useState<'text' | 'url'>('text');
    const [jobText, setJobText] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [result, setResult] = useState<{ is_fake: boolean; confidence: number; risk_score: number; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDetect = async () => {
        const payload = mode === 'text' ? { text: jobText } : { url: jobUrl };
        const isValid = mode === 'text' ? jobText.trim() : jobUrl.trim();

        if (!isValid) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('http://localhost:8000/api/detect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to analyze job posting.' }));
                throw new Error(errorData.detail || 'Failed to connect to detection service.');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20 no-select">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <Badge variant="primary" className="font-black">NEURAL GUARD V4</Badge>
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Scam Guard <span className="text-primary-600">AI</span></h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg font-bold mt-4 leading-relaxed max-w-2xl">Forensic level analysis of job posting signatures using multi-vector ML heuristics.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-6 py-4 rounded-[1.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 dark:shadow-black/20">
                    <Activity className="w-4 h-4 text-success-500" />
                    Live Analysis Core: Stable
                </div>
            </header>

            <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative z-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <div className="flex gap-4 mb-10 p-2 bg-neutral-50 dark:bg-neutral-950/50 rounded-2xl w-fit border-2 border-neutral-100 dark:border-neutral-800 relative z-10">
                    <button
                        onClick={() => setMode('text')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${mode === 'text' ? 'bg-white dark:bg-neutral-800 shadow-xl text-primary-600 dark:text-primary-400 ring-2 ring-neutral-100 dark:ring-neutral-700' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-400'}`}
                    >
                        <FileText className="w-4 h-4" />
                        Signature Paste
                    </button>
                    <button
                        onClick={() => setMode('url')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${mode === 'url' ? 'bg-white dark:bg-neutral-800 shadow-xl text-primary-600 dark:text-primary-400 ring-2 ring-neutral-100 dark:ring-neutral-700' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-400'}`}
                    >
                        <Globe className="w-4 h-4" />
                        Vector URL
                    </button>
                </div>

                <div className="space-y-8 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {mode === 'text' ? (
                                <TextArea
                                    className="p-8 h-80 text-lg font-mono rounded-[2rem] border-2 dark:bg-neutral-950/50"
                                    placeholder="Paste full job architectural signature here..."
                                    value={jobText}
                                    onChange={(e) => setJobText(e.target.value)}
                                />
                            ) : (
                                <Input
                                    className="p-8 h-20 text-lg font-mono rounded-[1.5rem] border-2 dark:bg-neutral-950/50"
                                    type="url"
                                    placeholder="Target Vector URL (https://...)"
                                    value={jobUrl}
                                    onChange={(e) => setJobUrl(e.target.value)}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <Button
                        onClick={handleDetect}
                        disabled={isLoading || (mode === 'text' ? !jobText.trim() : !jobUrl.trim())}
                        isLoading={isLoading}
                        className="w-full py-6 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary-600/30 group"
                        leftIcon={!isLoading ? <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" /> : undefined}
                    >
                        Initiate Diagnostic Scan
                    </Button>
                </div>
            </Card>

            {error && (
                <div className="animate-fade-in relative z-20">
                    <Alert variant="error" icon={<AlertCircle className="w-6 h-6" />}>
                        <p className="font-black uppercase tracking-widest text-[10px] mb-2">Scan Aborted</p>
                        <p className="text-sm font-bold opacity-80">{error}</p>
                    </Alert>
                </div>
            )}

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <Card className={`
                            p-10 border-2 shadow-2xl overflow-hidden relative
                            ${result.is_fake
                                ? 'bg-error-50/50 dark:bg-error-900/10 border-error-500/30'
                                : 'bg-success-50/50 dark:bg-success-900/10 border-success-500/30'}
                        `}>
                            {/* Decorative Background Elements */}
                            <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full -mr-32 -mt-32 transition-all duration-1000 ${result.is_fake ? 'bg-error-500/10' : 'bg-success-500/10'}`}></div>
                            
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                                <div className={`
                                    w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl transition-all duration-700 transform hover:rotate-12
                                    ${result.is_fake ? 'bg-error-600 text-white shadow-error-500/30' : 'bg-success-600 text-white shadow-success-500/30'}
                                `}>
                                    {result.is_fake ? <ShieldAlert className="w-12 h-12" /> : <CheckCircle className="w-12 h-12" />}
                                </div>
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div>
                                        <h3 className={`text-4xl font-black tracking-tight mb-4 ${result.is_fake ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}`}>
                                            {result.message}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                            <Badge variant={result.is_fake ? "error" : "success"} className="px-5 py-2 text-sm font-black ring-4 ring-current/10">
                                                CONFIDENCE: {result.confidence}%
                                            </Badge>
                                            <Badge variant={result.risk_score > 5 ? "error" : (result.risk_score > 2 ? "warning" : "success")} className="px-5 py-2 text-sm font-black ring-4 ring-current/10">
                                                RISK FACTOR: {result.risk_score}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className={`p-8 rounded-[1.5rem] border-2 transition-all duration-700 ${result.is_fake ? 'bg-white/50 dark:bg-neutral-900/50 border-error-500/20' : 'bg-white/50 dark:bg-neutral-900/50 border-success-500/20'}`}>
                                        <p className={`text-xl font-bold leading-relaxed ${result.is_fake ? 'text-error-900/80 dark:text-error-300' : 'text-success-900/80 dark:text-success-300'}`}>
                                            {result.is_fake
                                                ? "Immediate Termination Required: This architectural pattern contains multiple anomaly vectors mapped to verified fraudulent signatures."
                                                : "Quantum Clearance: This signature aligns with verified professional patterns. Proceed with standard operational security."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FakeJobDetection;
