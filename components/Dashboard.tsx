import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MarketService, MarketIntelligence } from '../services/marketService';
import { TrendingUp, ArrowUpRight, DollarSign, Briefcase, Map, Activity, Zap, Layers, Search, Globe, Target } from './ui/Icons';
import Card from './ui/Card';
import Alert from './ui/Alert';
import Badge from './ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const mockTrendData = [
  { name: 'Mon', jobs: 2400 },
  { name: 'Tue', jobs: 1398 },
  { name: 'Wed', jobs: 9800 },
  { name: 'Thu', jobs: 3908 },
  { name: 'Fri', jobs: 4800 },
  { name: 'Sat', jobs: 3800 },
  { name: 'Sun', jobs: 4300 },
];

const mockSalaryData = [
  { name: 'Junior', salary: 45000 },
  { name: 'Mid', salary: 85000 },
  { name: 'Senior', salary: 145000 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <Card className="p-10 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('bg-', 'text-')} opacity-[0.03] dark:opacity-[0.05] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`}>
        <Icon className="w-full h-full" />
    </div>
    <div className="flex items-start justify-between mb-8 relative z-10">
      <div className={`p-5 rounded-[1.25rem] ${color} text-white shadow-2xl shadow-current/30 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
        <Icon className="w-6 h-6" />
      </div>
      <Badge variant="success" className="font-black px-4 py-1.5 ring-4 ring-success-500/10 italic">
        <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> {trend}
      </Badge>
    </div>
    <div className="relative z-10">
      <p className="text-neutral-400 dark:text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">{title}</p>
      <h3 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none">{value}</h3>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const [marketIntel, setMarketIntel] = useState<MarketIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      const data = await MarketService.getMarketIntelligence();

      if ("error" in data) {
        setError(data.error);
        setMarketIntel(null);
      } else {
        setMarketIntel(data);
        setError(null);
      }
      setLoading(false);
    };

    fetchMarketData();
  }, []);

  return (
    <div className="space-y-16 animate-fade-in pb-20 no-select">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Activity className="w-6 h-6" />
                </div>
                <Badge variant="primary" className="font-black">ECONOMY CORE V4</Badge>
            </div>
          <h1 className="text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Market <span className="text-primary-600">Intelligence</span></h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-2xl font-bold mt-6 leading-relaxed max-w-3xl italic">Real-time narrative mapping for global engineering demand and salary vectors.</p>
        </div>
        <div className="flex items-center gap-5 text-xs font-black uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-8 py-5 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl shadow-neutral-200/20 dark:shadow-black/40 transition-all hover:border-success-500/50 group">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-success-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
          </span>
          <span className="group-hover:text-success-600 transition-colors">Neural Stream: High-Fidelity</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Alert variant="error" icon={<Zap className="w-8 h-8" />}>
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2 text-error-600">Connectivity Exception</p>
                    <p className="text-lg font-bold opacity-80 italic">{error === "SERPAPI_KEY not set" ? "Market Core requires valid SERPAPI credentials. Please configure .env parameters." : error}</p>
                </Alert>
            </motion.div>
        )}

        {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex items-center justify-center p-48 border-2 border-dashed dark:bg-neutral-900/50 dark:border-neutral-800 rounded-[3rem] overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary-600/[0.02] animate-pulse"></div>
                    <div className="flex flex-col items-center gap-8 relative z-10">
                        <div className="relative">
                            <div className="w-24 h-24 border-8 border-neutral-100 dark:border-neutral-850 rounded-full shadow-2xl"></div>
                            <div className="w-24 h-24 border-8 border-transparent border-t-primary-600 rounded-full animate-spin absolute inset-0"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe className="w-8 h-8 text-primary-600 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 font-black uppercase tracking-[0.5em] text-xs animate-pulse italic">Aggregating Global Vectors...</p>
                    </div>
                </Card>
            </motion.div>
        ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard
                        title="Global Active Roles"
                        value={marketIntel?.market_analysis && !('error' in marketIntel.market_analysis) ? marketIntel.market_analysis.total_jobs_estimate.toLocaleString() : "0"}
                        trend="+12%"
                        icon={Briefcase}
                        color="bg-primary-600"
                    />
                    <StatCard
                        title="Median Comp (Yearly)"
                        value={marketIntel?.market_analysis && !('error' in marketIntel.market_analysis) ? marketIntel.market_analysis.salary_range_summary : "N/A"}
                        trend="95th Pctl"
                        icon={DollarSign}
                        color="bg-success-600"
                    />
                    <StatCard
                        title="Remote Adoption"
                        value={marketIntel?.market_analysis && !('error' in marketIntel.market_analysis) ? `${marketIntel.market_analysis.remote_demand_percentage_estimate}%` : "0%"}
                        trend="Rising"
                        icon={Map}
                        color="bg-secondary-600"
                    />
                    <StatCard
                        title="Opportunity Index"
                        value={marketIntel?.market_analysis && !('error' in marketIntel.market_analysis) ? marketIntel.market_analysis.market_growth_indicator : "N/A"}
                        trend="Stable"
                        icon={ArrowUpRight}
                        color="bg-accent-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <Card className="lg:col-span-2 p-12 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative z-10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/[0.02] rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Trend <span className="text-primary-600">Volatility</span></h2>
                                    <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em] mt-2 italic">7-Day Moving Aggregate Stream</p>
                                </div>
                            </div>
                            <Badge variant="primary" className="font-black px-6 py-2 tracking-widest no-select">LATENCY: 85ms</Badge>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockTrendData}>
                                    <defs>
                                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-850" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 10, fontWeight: 900 }} dy={20} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 10, fontWeight: 900 }} dx={-15} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0a', border: '2px solid #262626', borderRadius: '24px', color: '#fff', fontSize: '12px', fontWeight: '900', padding: '16px 24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', fontStyle: 'italic' }}
                                        itemStyle={{ color: '#3b82f6' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 3, strokeDasharray: '8 8' }}
                                    />
                                    <Area type="monotone" dataKey="jobs" stroke="#2563eb" strokeWidth={6} fillOpacity={1} fill="url(#colorJobs)" animationDuration={3000} filter="drop-shadow(0 0 15px rgba(37, 99, 235, 0.4))" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-12 border-2 dark:bg-neutral-900 dark:border-neutral-800 relative z-10">
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-14 h-14 bg-success-100 dark:bg-success-900/30 text-success-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                                <Layers className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Tier <span className="text-success-600">Mapping</span></h2>
                                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em] mt-2 italic">Seniority Distribution Matrix</p>
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockSalaryData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12, fontWeight: 900 }} width={80} />
                                    <Tooltip cursor={{ fill: '#2563eb', opacity: 0.03 }} contentStyle={{ borderRadius: '24px', backgroundColor: '#0a0a0a', border: '2px solid #262626', color: '#fff', fontWeight: '900', italic: true }} />
                                    <Bar dataKey="salary" fill="#10b981" radius={[0, 16, 16, 0]} barSize={40} animationDuration={2500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Card className="p-12 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                        <header className="flex items-center gap-6 mb-10">
                            <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl">
                                <Target className="w-7 h-7" />
                            </div>
                            <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Trending <span className="text-primary-600">Vectors</span></h2>
                        </header>
                        <div className="space-y-6">
                            {(marketIntel?.market_analysis && !('error' in marketIntel.market_analysis) ? marketIntel.market_analysis.top_trending_roles : [
                                'Full Stack Systems Architect',
                                'Neural Network Engineer',
                                'Cloud Fabric Orchestrator'
                            ]).map((roleName: string, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-8 bg-neutral-50/50 dark:bg-neutral-950/50 hover:bg-white dark:hover:bg-neutral-900 rounded-[2.5rem] transition-all duration-500 border-2 border-neutral-50 dark:border-neutral-850 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30 cursor-pointer group overflow-hidden relative">
                                    <div className="absolute inset-0 bg-primary-600/[0.01] group-hover:bg-primary-600/[0.03] transition-colors"></div>
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 font-black text-xl group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-lg">
                                            {idx + 1}
                                        </div>
                                        <span className="font-black text-2xl text-neutral-900 dark:text-neutral-100 tracking-tighter leading-none italic">{roleName}</span>
                                    </div>
                                    <Badge variant="primary" className="font-black opacity-30 group-hover:opacity-100 tracking-[0.2em] px-6 py-2 transition-all group-hover:scale-110 italic">SURGE</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-12 border-2 dark:bg-neutral-900 dark:border-neutral-800">
                        <header className="flex items-center gap-6 mb-10">
                            <div className="w-12 h-12 bg-accent-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl">
                                <Zap className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-none italic">Strategic <span className="text-accent-600">Outlook</span></h2>
                                <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-600 uppercase tracking-[0.4em] mt-2 italic">Neural Prescriptive Directives</p>
                            </div>
                        </header>
                        <ul className="space-y-8">
                            {(marketIntel?.market_analysis && !('error' in marketIntel.market_analysis) && marketIntel.market_analysis.trending_skills.length > 0) ? (
                                marketIntel.market_analysis.trending_skills.map((skill, idx) => (
                                    <li key={idx} className="flex gap-8 items-start p-8 bg-neutral-50/50 dark:bg-neutral-950/50 rounded-[2.5rem] border-2 border-neutral-50 dark:border-neutral-850 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-700 group hover:border-primary-500/20">
                                        <div className="mt-2"><div className="w-5 h-5 rounded-full bg-primary-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] group-hover:scale-150 transition-transform duration-700"></div></div>
                                        <div>
                                            <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tighter italic leading-none">Master {skill}</p>
                                            <p className="text-lg font-bold text-neutral-500 dark:text-neutral-500 mt-4 leading-relaxed italic opacity-80">Foundational requirement for upcoming hiring cycles across major engineering nodes.</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li className="flex gap-8 items-start p-8 bg-accent-600/[0.03] dark:bg-accent-600/[0.05] rounded-[2.5rem] border-2 border-accent-600/10 transition-all duration-700 group hover:scale-[1.03] hover:bg-white dark:hover:bg-neutral-900 hover:border-accent-600/30">
                                        <div className="mt-2"><div className="w-5 h-5 rounded-full bg-accent-600 shadow-[0_0_20px_rgba(217,70,239,0.6)] group-hover:scale-150 transition-transform duration-700"></div></div>
                                        <div>
                                            <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tighter leading-none italic">Architectural Refactoring</p>
                                            <p className="text-lg font-bold text-neutral-400 dark:text-neutral-500 mt-4 leading-relaxed italic">Prioritize 'Kubernetes' and 'Microservices' to increase profile visibility by 40% across L4+ benchmarks.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-8 items-start p-8 bg-primary-600/[0.03] dark:bg-primary-600/[0.05] rounded-[2.5rem] border-2 border-primary-600/10 transition-all duration-700 group hover:scale-[1.03] hover:bg-white dark:hover:bg-neutral-900 hover:border-primary-600/30">
                                        <div className="mt-2"><div className="w-5 h-5 rounded-full bg-primary-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] group-hover:scale-150 transition-transform duration-700"></div></div>
                                        <div>
                                            <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tighter leading-none italic">Neural Design Mastery</p>
                                            <p className="text-lg font-bold text-neutral-400 dark:text-neutral-500 mt-4 leading-relaxed italic">Prerequisite for L3+ Engineering positions in high-growth startups and fintech unicorns.</p>
                                        </div>
                                    </li>
                                </>
                            )}
                        </ul>
                    </Card>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;