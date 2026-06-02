import React, { useState } from 'react';
import { Upload, Briefcase, MapPin, ExternalLink, Activity, Zap, Layers, Search } from './ui/Icons';
import { Job } from '../types';
import Button from './ui/Button';
import TextArea from './ui/TextArea';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Alert from './ui/Alert';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'idle' | 'loading' | 'success' | 'error';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <Card hoverable className="p-8 flex flex-col justify-between border-2 dark:bg-neutral-900 dark:border-neutral-800 transition-all h-full group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500">
            <Briefcase className="w-7 h-7" />
        </div>
        <Badge variant={job.score > 80 ? "success" : (job.score >= 60 ? "primary" : "warning")} className="px-3 py-1 font-black italic tracking-tight">
            {job.score}% Match
        </Badge>
      </div>
      <h3 className="font-black text-2xl text-neutral-900 dark:text-white leading-none tracking-tight mb-2 group-hover:text-primary-600 transition-colors">{job.title}</h3>
      <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{job.company}</p>
      
      <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 mt-6 bg-neutral-50 dark:bg-neutral-950/50 w-fit px-3 py-1.5 rounded-lg border dark:border-neutral-800">
        <MapPin className="w-4 h-4 text-primary-500" />
        <span className="font-black uppercase tracking-widest">{job.location}</span>
      </div>
    </div>
    <div className="mt-10 pt-8 border-t-2 border-neutral-50 dark:border-neutral-850 relative z-10">
      <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-6 shadow-inner">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${job.score}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`h-full transition-all duration-1000 ease-out ${
                job.score > 80 ? 'bg-success-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 
                (job.score >= 60 ? 'bg-primary-500 shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-warning-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]')
            }`}
        />
      </div>
      <Button
        as="a"
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-500/10"
        rightIcon={<ExternalLink className="w-4 h-4" />}
      >
        Extract Details
      </Button>
    </div>
  </Card>
);

const SmartJobMatching: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResumeText('');
      setError(null);
    }
  };

  const findJobs = async () => {
    if (!file && !resumeText.trim()) return;

    setStatus('loading');
    setError(null);
    setJobs([]);

    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      } else if (resumeText.trim()) {
        formData.append('text', resumeText.trim());
      }

      const response = await fetch('http://localhost:5678/webhook/job-match', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      let data = await response.json();
      
      let rawJobs: any[] = [];
      
      if (Array.isArray(data)) {
        rawJobs = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.matches)) {
        rawJobs = data.matches;
      } else {
        if (data && typeof data === 'object' && data.title) {
            rawJobs = [data];
        }
      }

      const transformedJobs: Job[] = rawJobs
        .map((job: any) => ({
          title: job.title || 'Unknown Role',
          company: job.company || 'Unknown Company',
          location: job.location || 'Remote',
          url: job.apply_url || job.applyUrl || job['Apply URL'] || job['apply url'] || job.applyUrl || job.apply_link || job.job_url || job.job_link || job.url || job.link || '#',
          score: typeof job.match_score === 'number' ? job.match_score : 
                 (typeof job.score === 'number' ? job.score : 0),
        }))
        .filter((job: Job) => job.title && job.title !== 'Unknown Role')
        .sort((a: Job, b: Job) => b.score - a.score);

      setJobs(transformedJobs);
      setStatus('success');
    } catch (err) {
      console.error('Error calling job match API:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Unable to analyze resume (${errorMessage}). Please check if n8n is running.`);
      setStatus('error');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20 no-select">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Search className="w-6 h-6" />
                </div>
                <Badge variant="primary" className="font-black">NEURAL MATCHING CORE</Badge>
            </div>
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Match <span className="text-primary-600">Engine</span></h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xl font-bold mt-4 leading-relaxed max-w-2xl">High-fidelity profile comparison against global opportunity vectors using semantic alignment.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-6 py-4 rounded-[1.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/20 dark:shadow-black/20 transition-all hover:border-success-500/50 group">
          <Activity className="w-4 h-4 text-success-500" />
          Neural Engine V3: Online
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
            <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative z-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/2 rounded-full blur-3xl -ml-32 -mt-32"></div>
              
              <div className="relative border-4 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-12 text-center group hover:border-primary-600 transition-all duration-500 dark:bg-neutral-950/30 overflow-hidden">
                <input 
                  type="file" 
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-neutral-50 dark:bg-neutral-900 group-hover:bg-primary-600 group-hover:text-white rounded-[1.5rem] flex items-center justify-center transition-all duration-700 mb-6 shadow-xl shadow-neutral-200/20 dark:shadow-black/40 group-hover:rotate-6">
                        <Upload className="w-10 h-10" />
                    </div>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">{file ? file.name : 'Upload Document'}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-2 uppercase tracking-[0.3em] font-black italic">PDF / DOCX / TEXT Extraction</p>
                </div>
                {/* Decorative background element for input */}
                <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/5 transition-colors duration-500 pointer-events-none"></div>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-neutral-50 dark:border-neutral-850"></div></div>
                <div className="relative flex justify-center"><span className="px-6 bg-white dark:bg-neutral-900 text-[10px] text-neutral-400 dark:text-neutral-600 font-black uppercase tracking-[0.4em]">Semantic Input</span></div>
              </div>

              <TextArea
                placeholder="Or paste professional summary / skill vectors..."
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  if (e.target.value.trim()) setFile(null);
                }}
                className="h-64 p-8 text-lg font-mono rounded-[2rem] border-2 dark:bg-neutral-950/50"
              />

              <Button
                onClick={findJobs}
                disabled={status === 'loading' || (!file && !resumeText.trim())}
                isLoading={status === 'loading'}
                className="w-full py-6 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary-600/30 group"
                leftIcon={!status.includes('loading') ? <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" /> : undefined}
              >
                Execute Alignment
              </Button>
            </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
                {status === 'loading' && (
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
                        <h3 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight leading-none">Synthesizing Data</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-xl font-bold max-w-sm leading-relaxed">Mapping your neural profile against 140K+ opportunity vectors...</p>
                    </Card>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                    <header className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-success-600 text-white rounded-xl flex items-center justify-center shadow-xl">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">
                                Extracted Matches
                            </h2>
                        </div>
                        <Badge variant="primary" className="px-5 py-2 text-lg font-black italic">{jobs.length} SIGNALS</Badge>
                    </header>
                    {jobs.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {jobs.map((job, index) => (
                          <JobCard key={`${job.url}-${index}`} job={job} />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-32 border-2 border-dashed text-center dark:bg-neutral-900 dark:border-neutral-800">
                        <div className="w-24 h-24 bg-neutral-50 dark:bg-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl opacity-40 grayscale">
                            <Briefcase className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-6 leading-none">Zero Alignment Detected</h3>
                        <p className="text-xl font-bold text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                          Your profile signature requires higher resolution. Add critical skill markers or expand your professional summary.
                        </p>
                      </Card>
                    )}
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert variant="error" icon={<Activity className="w-6 h-6" />}>
                        <p className="font-black uppercase tracking-widest text-[10px] mb-2 text-error-600">Cognitive Fault Detected</p>
                        <p className="text-lg font-bold opacity-80">{error ?? 'Architectural failure during semantic extraction. Please check core connectivity.'}</p>
                    </Alert>
                  </motion.div>
                )}

                {status === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card className="p-32 border-2 border-dashed text-center dark:bg-neutral-900 dark:border-neutral-800 h-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary-600/[0.02] group-hover:bg-primary-600/[0.04] transition-colors duration-1000"></div>
                        <div className="w-28 h-28 bg-neutral-100 dark:bg-neutral-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            <Activity className="w-14 h-14 text-neutral-400 dark:text-neutral-600 group-hover:text-primary-600" />
                        </div>
                        <h3 className="text-5xl font-black text-neutral-900 dark:text-white mb-6 leading-none tracking-tight italic relative z-10 group-hover:text-primary-600 transition-colors">Neural Alignment</h3>
                        <p className="text-xl font-bold text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed relative z-10">
                          Bridge your professional trajectory with live market nodes. Submit your data profile to begin the extraction process.
                        </p>
                        {/* Decorative scan line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent animate-scan"></div>
                    </Card>
                  </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SmartJobMatching;