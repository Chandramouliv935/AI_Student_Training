import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, FileText, Download, Sparkles, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Zap, Activity, Layers, Target, Search } from './ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import TextArea from './ui/TextArea';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Alert from './ui/Alert';

// Set worker source for pdf.js to a stable CDN location matching the pinned version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

interface TailoredResume {
    optimized_resume: string;
    matched_skills: string[];
    missing_skills: string[];
    ats_score_estimate: number;
    skill_gap_roadmap: string[];
    pdf_download_url: string;
}

const RoleBasedResumeBuilder: React.FC = () => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            if (selectedFile.type === 'application/pdf') {
                try {
                    const arrayBuffer = await selectedFile.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
                    const pdf = await loadingTask.promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        // @ts-ignore
                        const pageText = textContent.items.map((item: any) => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    setResumeText(fullText);
                } catch (error) {
                    console.error("Error parsing PDF:", error);
                    setError("Failed to parse PDF. Please ensure it is a valid text-based PDF.");
                }
            } else {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (typeof ev.target?.result === 'string') {
                        setResumeText(ev.target.result);
                    }
                };
                reader.readAsText(selectedFile);
            }
        }
    };

    const handleTailorResume = async () => {
        if (!resumeText || !jobDescription) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:8000/api/optimize-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resume_text: resumeText,
                    job_description: jobDescription,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to optimize resume");
            }

            const data: TailoredResume = await res.json();
            setTailoredResume(data);
            setStep(3);
        } catch (err: any) {
            console.error("Tailoring failed:", err);
            setError(`Tailoring failed: ${err.message || 'Unknown error'}. Please check if the backend is running.`);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!tailoredResume) return;
        window.open(`http://localhost:8000${tailoredResume.pdf_download_url}`, "_blank");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20 no-select">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Layers className="w-6 h-6" />
                        </div>
                        <Badge variant="primary" className="font-black">NEURAL ARCHITECT V2</Badge>
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Resume <span className="text-primary-600">Reconstructor</span></h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg font-bold mt-4 leading-relaxed max-w-2xl">High-fidelity profile optimization aligned to enterprise-specific opportunity matrices.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-6 py-4 rounded-[1.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 dark:shadow-black/20">
                    <Activity className="w-4 h-4 text-success-500" />
                    Fabrication Engine: Ready
                </div>
            </header>

            {/* Stepper */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-neutral-100 dark:bg-neutral-800 -translate-y-1/2 z-0"></div>
                    {[
                        { id: 1, label: 'Source extraction' },
                        { id: 2, label: 'Target alignment' },
                        { id: 3, label: 'Fabrication' }
                    ].map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <motion.div 
                                animate={{ 
                                    scale: step === s.id ? 1.2 : 1
                                }}
                                className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black transition-all duration-500 ${step >= s.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'}`}
                            >
                                {step > s.id ? <CheckCircle className="w-6 h-6" /> : s.id}
                            </motion.div>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${step >= s.id ? 'text-primary-600' : 'text-neutral-400'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                    <motion.div 
                        className="absolute left-0 top-1/2 h-1 bg-primary-600 -translate-y-1/2 z-0 origin-left"
                        animate={{ width: `${(step - 1) * 50}%` }}
                        transition={{ duration: 0.7, ease: "circOut" }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="p-12 text-center border-2 dark:bg-neutral-900 dark:border-neutral-800 relative z-10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            
                            <div className="max-w-md mx-auto relative z-10">
                                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all duration-700 hover:rotate-6 text-primary-600">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight leading-none italic">Select Profile <span className="text-primary-600">Vector</span></h2>
                                <p className="text-neutral-500 dark:text-neutral-400 text-lg font-bold mb-10 leading-relaxed italic">Upload your core professional signature for multi-page extraction.</p>

                                <div className="relative border-4 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-12 hover:border-primary-600 transition-all duration-700 group cursor-pointer dark:bg-neutral-950/30 overflow-hidden">
                                    <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                    <FileText className="w-16 h-16 text-neutral-200 dark:text-neutral-700 mx-auto mb-6 group-hover:text-primary-500 group-hover:scale-110 transition-all duration-700" />
                                    <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">{file ? file.name : "Input Source Node"}</p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-2 uppercase tracking-[0.3em] font-black italic">PDF / TXT extraction supported</p>
                                </div>

                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!resumeText}
                                    className="mt-12 w-full py-6 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary-600/30 group"
                                >
                                    Proceed to Alignment
                                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="p-12 dark:bg-neutral-900 dark:border-neutral-800 border-2 relative z-10">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl -ml-32 -mt-32"></div>
                            
                            <div className="max-w-2xl mx-auto relative z-10">
                                <div className="text-center mb-12">
                                    <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-primary-600 shadow-xl">
                                        <Target className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Define <span className="text-primary-600">Opportunity</span> Matrix</h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-lg font-bold mt-4 leading-relaxed">Paste the target requirements for high-resolution semantic matching.</p>
                                </div>

                                <div className="space-y-10">
                                    <TextArea
                                        placeholder="Paste opportunity parameters / job description signature here..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="h-96 p-8 text-lg font-mono rounded-[2.5rem] border-2 dark:bg-neutral-950/50"
                                    />

                                    <div className="flex gap-6">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-6 text-lg font-black rounded-[2rem] border-2 uppercase tracking-widest no-select"
                                        >
                                            <ArrowLeft className="w-6 h-6 mr-3" />
                                            Re-index Source
                                        </Button>
                                        <Button
                                            onClick={handleTailorResume}
                                            disabled={isLoading || !jobDescription.trim()}
                                            isLoading={isLoading}
                                            className="flex-[2] py-6 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary-600/30 group"
                                        >
                                            <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                                            Initiate Fabrication
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {step === 3 && tailoredResume && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10"
                    >
                        <Card className="p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10 dark:bg-neutral-900 dark:border-neutral-800 border-2 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-success-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-20 h-20 bg-success-600 text-white rounded-[1.75rem] flex items-center justify-center shadow-xl shadow-success-600/30 transform hover:rotate-12 transition-transform duration-700 shrink-0">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Fabrication <span className="text-success-600">Complete</span></h2>
                                    <p className="text-neutral-500 dark:text-neutral-400 text-xl font-bold mt-2">Resume architectural integrity is confirmed.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 w-full md:w-auto relative z-10">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(2)}
                                    className="px-8 py-5 text-sm font-black uppercase tracking-widest border-2 rounded-[1.5rem]"
                                >
                                    Modify Matrix
                                </Button>
                                <Button
                                    onClick={downloadPDF}
                                    className="flex-1 md:flex-none px-10 py-5 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary-600/30 rounded-[1.5rem]"
                                    leftIcon={<Download className="w-5 h-5" />}
                                >
                                    Extract PDF
                                </Button>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Analysis Panels */}
                            <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
                                <Card className="p-8 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Search className="w-24 h-24" />
                                    </div>
                                    <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em] mb-6 italic">Compliance Score</p>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-7xl font-black text-primary-600 dark:text-primary-400 tracking-tighter leading-none italic">{tailoredResume.ats_score_estimate}</span>
                                        <span className="text-2xl font-black text-neutral-400 mb-2">%</span>
                                    </div>
                                    <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${tailoredResume.ats_score_estimate}%` }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            className="h-full bg-primary-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                        />
                                    </div>
                                </Card>

                                <Card className="p-8 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                                    <header className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 bg-success-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight italic">Aligned Nodes</h3>
                                    </header>
                                    <div className="flex flex-wrap gap-2">
                                        {tailoredResume.matched_skills.map((skill, i) => (
                                            <Badge key={i} variant="success" className="px-4 py-2 font-black italic tracking-tight">{skill}</Badge>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-8 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                                    <header className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 bg-accent-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight italic">Strategic roadmap</h3>
                                    </header>
                                    <div className="space-y-4">
                                        {tailoredResume.skill_gap_roadmap.map((step, i) => (
                                            <div key={i} className="flex items-start gap-4 group">
                                                <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-850 flex items-center justify-center shrink-0 font-black text-xs text-neutral-400 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-110">{i + 1}</div>
                                                <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 leading-relaxed italic group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Resume Preview */}
                            <div className="lg:col-span-8 order-1 lg:order-2">
                                <div className="bg-white dark:bg-neutral-900 rounded-[3rem] border-4 border-neutral-100 dark:border-neutral-850 shadow-2xl p-10 md:p-16 relative overflow-hidden no-select">
                                    {/* Professional document texture/decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 border-r-8 border-t-8 border-primary-600 opacity-20 mr-12 mt-12"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 border-l-8 border-b-8 border-primary-600 opacity-20 ml-12 mb-12"></div>
                                    
                                    <div className="relative z-10 font-serif">
                                        <header className="mb-12 border-b-2 border-neutral-100 dark:border-neutral-850 pb-10 flex justify-between items-start">
                                            <div>
                                                <Badge variant="primary" className="mb-4 font-black">OPTIMIZED SIGNATURE</Badge>
                                                <h2 className="text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tighter leading-none italic">PRO-STRAT <span className="text-primary-600 italic">V4</span></h2>
                                                <p className="text-neutral-400 dark:text-neutral-500 mt-4 font-bold text-lg italic">Neural Compliance Certificate ID: 492-X82</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="w-16 h-16 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-neutral-900 font-black text-2xl shadow-2xl transform rotate-12">AT</div>
                                            </div>
                                        </header>

                                        <section className="mb-12">
                                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary-600 mb-6 italic underline decoration-4 underline-offset-8">Architectural Layout</h3>
                                            <div className="p-10 rounded-[2rem] bg-neutral-50 dark:bg-neutral-950/50 border-2 border-neutral-100 dark:border-neutral-850">
                                                <pre className="text-neutral-800 dark:text-neutral-200 leading-loose text-lg whitespace-pre-wrap font-serif italic">
                                                    {tailoredResume.optimized_resume}
                                                </pre>
                                            </div>
                                        </section>

                                        <footer className="pt-10 border-t-2 border-neutral-100 dark:border-neutral-850 flex justify-between text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">
                                            <span>Validation Stamp: {new Date().toLocaleDateString()}</span>
                                            <span>Neural Guard Core Active</span>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="max-w-4xl mx-auto">
                    <Alert variant="error" icon={<AlertCircle className="w-8 h-8" />}>
                        <p className="font-black uppercase tracking-[0.2em] text-[10px] mb-2 text-error-600">Core Error Detected</p>
                        <p className="text-lg font-bold opacity-80 italic">{error}</p>
                    </Alert>
                </div>
            )}
        </div>
    );
};

export default RoleBasedResumeBuilder;
