import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Smartphone,
  Search,
  ExternalLink,
  Globe,
  Building2,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  ShieldCheck,
  Activity,
  Zap,
  Layers,
  Target
} from "./ui/Icons";
import govtData from "../govt.json";
import smartData from "../data/Smart-Opportunities.json";
import remoteData from "../data/Remote-jobs.json";
import Button from "./ui/Button";
import Select from "./ui/Select";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Alert from "./ui/Alert";

// Types for API responses
interface ResumeAnalysisResult {
  skills_detected: string[];
  experience_level: string;
  location_detected: string;
  recommended_jobs_local: LocalJob[];
  recommended_jobs_low_device: LowDeviceJob[];
}

interface LocalJob {
  id: string;
  title: string;
  company: string;
  distance: string;
  required_skills_match: number;
  apply_link: string;
  location: string;
}

interface LowDeviceJob {
  id: string;
  title: string;
  company: string;
  qualification_reason: string;
  device_level: "Basic" | "Low" | "Medium";
  apply_link: string;
}

interface GovernmentScheme {
  id: string;
  name: string;
  provider: string;
  eligibility: string;
  benefits: string;
  apply_link: string;
  type: "state" | "central";
}

interface SchemesResponse {
  state_schemes: any[];
  central_schemes: any[];
}


// Smart Opportunities Module
const SmartOpportunitiesModule: React.FC = () => {
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"nearby" | "remote">("nearby");

  // Extract all unique districts and categories
  const districts = smartData.smart_opportunities.map((d) => d.district).sort();
  const categories = Array.from(
    new Set(
      smartData.smart_opportunities.flatMap((d) =>
        d.opportunities.map((o) => o.sector),
      ),
    ),
  ).sort();

  // Filter Nearby Jobs
  const filteredNearbyJobs = smartData.smart_opportunities
    .filter(
      (d) => selectedDistrict === "all" || d.district === selectedDistrict,
    )
    .flatMap((d) =>
      d.opportunities.map((o) => ({ ...o, district: d.district })),
    )
    .filter((o) => selectedCategory === "all" || o.sector === selectedCategory);

  // Filter Remote Jobs
  const filteredRemoteJobs = remoteData.districts
    .filter(
      (d) => selectedDistrict === "all" || d.district === selectedDistrict,
    )
    .flatMap((d) =>
      d.remote_opportunities.map((o) => ({ ...o, district: d.district })),
    )
    .filter((o) => selectedCategory === "all" || o.sector === selectedCategory);

  const totalCount = filteredNearbyJobs.length + filteredRemoteJobs.length;

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white dark:bg-neutral-900/50 p-10 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl shadow-neutral-200/20 dark:shadow-black/40">
        <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-500/30 transform -rotate-3">
                <Search className="w-10 h-10" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight italic">
                    Smart <span className="text-primary-600">Opportunities</span>
                </h2>
                <div className="flex items-center gap-3 mt-3">
                    <Badge variant="primary" className="italic font-black text-[10px] tracking-widest px-4">NEURAL MATCHING</Badge>
                    <p className="text-neutral-500 font-bold italic">
                        Detected <span className="text-primary-600">{totalCount}</span> high-affinity vectors in {selectedState}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex gap-3 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-[1.5rem] self-start lg:self-center">
            <button
                onClick={() => setActiveTab("nearby")}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 italic ${
                    activeTab === "nearby"
                    ? "bg-white dark:bg-neutral-700 text-primary-600 shadow-xl scale-105"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
            >
                Local Node ({filteredNearbyJobs.length})
            </button>
            <button
                onClick={() => setActiveTab("remote")}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 italic ${
                    activeTab === "remote"
                    ? "bg-white dark:bg-neutral-700 text-primary-600 shadow-xl scale-105"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
            >
                Remote Grid ({filteredRemoteJobs.length})
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Select
          label="State Vector"
          value={selectedState}
          disabled
          options={[{ value: "Tamil Nadu", label: "Tamil Nadu" }]}
          className="dark:bg-neutral-900 border-2 rounded-2xl p-4 font-black italic"
        />

        <Select
          label="District Node"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          options={[
            { value: "all", label: "All Districts" },
            ...districts.map(d => ({ value: d, label: d }))
          ]}
          className="dark:bg-neutral-900 border-2 rounded-2xl p-4 font-black italic"
        />

        <Select
          label="Category Tier"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map(c => ({ value: c, label: c }))
          ]}
          className="dark:bg-neutral-900 border-2 rounded-2xl p-4 font-black italic"
        />
      </div>



      {/* Content List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {activeTab === "nearby" ? (
            filteredNearbyJobs.length > 0 ? (
              filteredNearbyJobs.map((job, idx) => (
                <Card
                  key={idx}
                  onClick={() => window.open(job.website, '_blank')}
                  className="group p-8 dark:bg-neutral-900 dark:border-neutral-800 border-2 border-transparent hover:border-primary-500 cursor-pointer relative overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 pr-4">
                        <h4 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-none mb-3 italic">
                          {job.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="primary" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">
                            {job.sector}
                          </Badge>
                          <Badge variant="warning" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">
                            LOCAL
                          </Badge>
                        </div>
                      </div>
                      <Button
                        as="a"
                        href={job.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        className="p-3 rounded-xl dark:bg-neutral-800 dark:border-neutral-750 group-hover:bg-primary-600 group-hover:text-white transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-850 relative z-10">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary-600/10 group-hover:scale-110 transition-all">
                      <MapPin className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-black italic tracking-tight">{job.district} Node</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-neutral-50 dark:bg-neutral-900 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-neutral-850">
                <Search className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-200 italic">
                  No Local Vectors Found
                </h3>
                <p className="text-neutral-500 font-bold mt-2 italic">
                  Try recalibrating district or category filters.
                </p>
              </div>
            )
          ) : filteredRemoteJobs.length > 0 ? (
              filteredRemoteJobs.map((job, idx) => (
                <Card
                  key={idx}
                  onClick={() => window.open(job.company_url, '_blank')}
                  className="group p-8 dark:bg-neutral-900 dark:border-neutral-800 border-2 border-transparent hover:border-secondary-500 cursor-pointer relative overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-600/[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 pr-4">
                        <h4 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-none mb-2 italic">
                          {job.role}
                        </h4>
                        <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500 mb-4 italic">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="primary" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">
                            {job.sector}
                          </Badge>
                          <Badge variant="success" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 italic">
                            {job.work_type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        as="a"
                        href={job.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        className="p-3 rounded-xl dark:bg-neutral-800 dark:border-neutral-750 group-hover:bg-secondary-600 group-hover:text-white transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-850 relative z-10">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-secondary-600/10 group-hover:scale-110 transition-all">
                      <Globe className="w-4 h-4 text-secondary-600" />
                    </div>
                    <span className="font-black italic tracking-tight">Global Node: {job.district}</span>
                  </div>
                </Card>
              ))
          ) : (
            <div className="col-span-full py-24 text-center bg-neutral-50 dark:bg-neutral-900 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-neutral-850">
              <Globe className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-200 italic">
                No Remote Vectors Found
              </h3>
              <p className="text-neutral-500 font-bold mt-2 italic">Try recalibrating global filters.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Government Schemes Module
const GovernmentSchemesModule: React.FC = () => {
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEligibility, setSelectedEligibility] = useState("all");
  const [schemes, setSchemes] = useState<SchemesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ];

  const categories = [
    "Education",
    "Employment",
    "Startup",
    "Skill Training",
    "Scholarship",
  ];

  const eligibilityOptions = [
    "Student",
    "Graduate",
    "Unemployed",
    "Women",
    "Rural",
    "Disabled",
  ];

  const fetchSchemes = () => {
    setIsLoading(true);
    try {
      const central = govtData.central_schemes.map((s) => ({
        id: s.id,
        name: s.name,
        provider: s.ministry,
        eligibility: s.eligibility,
        benefits: s.benefits,
        apply_link: "#",
        type: "central",
      }));

      let stateSchemes: any[] = [];
      if (selectedState !== "all") {
        const stateKey = states.find(
          (s) => s.toLowerCase().replace(/\s+/g, "-") === selectedState,
        );
        if (stateKey && (govtData.state_schemes as any)[stateKey]) {
          stateSchemes = (govtData.state_schemes as any)[stateKey].map(
            (s: any, idx: number) => ({
              id: `state-${idx}`,
              name: s.name,
              provider: stateKey,
              eligibility: "Residents of " + stateKey,
              benefits: s.benefits,
              apply_link: "#",
              type: "state",
            }),
          );
        }
      }

      setSchemes({
        state_schemes: stateSchemes,
        central_schemes: central,
      });
    } catch (error) {
      console.error("Error loading schemes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSchemes();
  }, [selectedState]);

  const SchemeCard: React.FC<{ scheme: GovernmentScheme }> = ({ scheme }) => (
    <Card className="group p-8 dark:bg-neutral-900 dark:border-neutral-800 border-2 relative overflow-hidden flex flex-col justify-between hover:border-warning-500/30 transition-all duration-500">
      <div className={`absolute top-0 right-0 w-32 h-32 ${scheme.type === 'state' ? 'bg-primary-600' : 'bg-warning-600'}/[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`}></div>
      <div className="relative z-10">
        <div className="flex items-start gap-5 mb-6">
            <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform ${
                scheme.type === "state"
                ? "bg-primary-600 text-white"
                : "bg-warning-600 text-white"
            }`}
            >
            {scheme.type === "state" ? (
                <Building2 className="w-7 h-7" />
            ) : (
                <Globe className="w-7 h-7" />
            )}
            </div>
            <div className="flex-1">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 italic ${scheme.type === 'state' ? 'text-primary-600' : 'text-warning-600'}`}>
                    {scheme.type === 'state' ? 'STATE MANDATE' : 'CENTRAL DIRECTIVE'}
                </p>
                <h4 className="text-xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight italic">{scheme.name}</h4>
                <p className="text-sm font-bold text-neutral-400 dark:text-neutral-500 mt-1 italic">{scheme.provider}</p>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300 italic opacity-80">{scheme.eligibility}</span>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300 italic opacity-80">{scheme.benefits}</span>
            </div>
        </div>
      </div>

      <Button
        as="a"
        href={scheme.apply_link}
        variant="outline"
        className="w-full py-4 rounded-2xl font-black italic border-2 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all"
      >
        Access Directive Details
      </Button>
    </Card>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white dark:bg-neutral-900/50 p-10 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl shadow-neutral-200/20 dark:shadow-black/40">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-warning-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-warning-500/30 transform -rotate-3">
                <Building2 className="w-10 h-10" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight italic">
                    Government <span className="text-warning-600">Opportunities</span>
                </h2>
                <div className="flex items-center gap-3 mt-3">
                    <Badge variant="warning" className="italic font-black text-[10px] tracking-widest px-4">EQUITY CORE</Badge>
                    <p className="text-neutral-500 font-bold italic">
                        Real-time synchronization with state and central directive databases.
                    </p>
                </div>
            </div>
          </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Select
          label="Sovereign State"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          options={[
            { value: "all", label: "Select Vector Origin" },
            ...states.filter(s => s !== "All India").map(state => ({
              value: state.toLowerCase().replace(/\s+/g, "-"),
              label: state
            }))
          ]}
          className="dark:bg-neutral-900 border-2 rounded-2xl p-4 font-black italic"
        />

        <Select
          label="Category Vector"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={[
            { value: "all", label: "All Sectors" },
            ...categories.map(category => ({
              value: category.toLowerCase().replace(/\s+/g, "-"),
              label: category
            }))
          ]}
          className="dark:bg-neutral-900 border-2 rounded-2xl p-4 font-black italic"
        />

        <Select
          label="Eligibility Matrix"
          value={selectedEligibility}
          onChange={(e) => setSelectedEligibility(e.target.value)}
          options={[
            { value: "all", label: "Global Compatibility" },
            ...eligibilityOptions.map(option => ({
              value: option.toLowerCase().replace(/\s+/g, "-"),
              label: option
            }))
          ]}
          className="dark:bg-neutral-900 border-2 rounded-2xl p-4 font-black italic"
        />
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center p-32 border-2 border-dashed dark:bg-neutral-900 rounded-[3rem]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-neutral-100 dark:border-neutral-800 border-t-warning-600 rounded-full animate-spin"></div>
                <p className="text-neutral-400 font-black uppercase tracking-[0.4em] text-xs italic animate-pulse">Synchronizing Directives...</p>
            </div>
        </Card>
      ) : (
        schemes && (
          <div className="space-y-16">
            {/* State Schemes */}
            {schemes.state_schemes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
                    <h3 className="text-3xl font-black text-neutral-900 dark:text-white italic tracking-tight">
                        State Directives
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {schemes.state_schemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Central Schemes */}
            {schemes.central_schemes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-8 bg-warning-600 rounded-full"></div>
                    <h3 className="text-3xl font-black text-neutral-900 dark:text-white italic tracking-tight">
                        Central Directives
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {schemes.central_schemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {schemes.state_schemes.length === 0 &&
              schemes.central_schemes.length === 0 && (
                <div className="p-24 text-center bg-neutral-50 dark:bg-neutral-900 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-neutral-850">
                   <Alert variant="info" icon={<Building2 className="w-10 h-10" />}>
                     <p className="text-xl font-black italic mb-2">No Passive Directives Detected</p>
                     <p className="text-neutral-500 font-bold italic opacity-80">Recalibrate filters to discover active government opportunities.</p>
                   </Alert>
                </div>
              )}
          </div>
        )
      )}
    </div>
  );
};

// Mode Selector Component
const ModeSelector: React.FC<{
  activeMode: "smart" | "government";
  onModeChange: (mode: "smart" | "government") => void;
}> = ({ activeMode, onModeChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
    <Card
      onClick={() => onModeChange("smart")}
      className={`p-10 rounded-[3rem] border-2 transition-all duration-700 flex flex-col items-center gap-6 group cursor-pointer relative overflow-hidden ${
        activeMode === "smart"
          ? "!bg-primary-600 dark:!bg-primary-600 text-white !border-primary-600 shadow-[0_0_60px_rgba(37,99,235,0.3)] scale-[1.03]"
          : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10"
      }`}
    >
        <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div
        className={`p-6 rounded-[2rem] transition-all duration-700 ${
          activeMode === "smart"
            ? "bg-white/20 rotate-12"
            : "bg-neutral-50 dark:bg-neutral-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:rotate-6"
        }`}
      >
        <Search
          className={`w-10 h-10 ${activeMode === "smart" ? "text-white" : "text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"}`}
        />
      </div>
      <div className="text-center">
          <span
            className={`font-black text-3xl transition-colors tracking-tight italic ${activeMode === "smart" ? "text-white" : "text-neutral-900 dark:text-neutral-100"}`}
          >
            Smart Opportunities
          </span>
          <p
            className={`text-sm mt-3 font-bold italic uppercase tracking-widest ${activeMode === "smart" ? "text-white/70" : "text-neutral-400 dark:text-neutral-500"}`}
          >
            Local Nodes & Grid Access
          </p>
      </div>
    </Card>

    <Card
      onClick={() => onModeChange("government")}
      className={`p-10 rounded-[3rem] border-2 transition-all duration-700 flex flex-col items-center gap-6 group cursor-pointer relative overflow-hidden ${
        activeMode === "government"
          ? "!bg-warning-600 dark:!bg-warning-600 text-white !border-warning-600 shadow-[0_0_60px_rgba(234,179,8,0.3)] scale-[1.03]"
          : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 hover:border-warning-500/50 hover:shadow-2xl hover:shadow-warning-500/10"
      }`}
    >
        <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div
        className={`p-6 rounded-[2rem] transition-all duration-700 ${
          activeMode === "government"
            ? "bg-white/20 rotate-12"
            : "bg-neutral-50 dark:bg-neutral-800 group-hover:bg-warning-50 dark:group-hover:bg-warning-900/20 group-hover:rotate-6"
        }`}
      >
        <Building2
          className={`w-10 h-10 ${activeMode === "government" ? "text-white" : "text-neutral-400 group-hover:text-warning-600 dark:group-hover:text-warning-400"}`}
        />
      </div>
      <div className="text-center">
          <span
            className={`font-black text-3xl transition-colors tracking-tight italic ${activeMode === "government" ? "text-white" : "text-neutral-900 dark:text-neutral-100"}`}
          >
            Equity Core
          </span>
          <p
            className={`text-sm mt-3 font-bold italic uppercase tracking-widest ${activeMode === "government" ? "text-white/70" : "text-neutral-400 dark:text-neutral-500"}`}
          >
            Directives & Mandates
          </p>
      </div>
    </Card>
  </div>
);

// Main Component
const OpportunityAccessibility: React.FC = () => {
  const [activeMode, setActiveMode] = useState<"smart" | "government">("smart");

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-14 space-y-20 no-select pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl">
                    <Layers className="w-7 h-7" />
                </div>
                <Badge variant="primary" className="font-black italic text-xs px-6 py-1.5 tracking-widest">GLOBAL EQUITY V4</Badge>
            </div>
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none italic uppercase">
            Opportunity <span className="text-primary-600">Accessibility</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg mt-8 font-bold italic leading-relaxed max-w-4xl">
            Equitable access to career pathways for everyone, everywhere. Bridging the gap between neural talent and global market directives.
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 px-10 py-6 rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl transition-all hover:border-success-500/50 group">
          <div className="relative">
              <div className="w-4 h-4 rounded-full bg-success-500 animate-ping absolute opacity-40"></div>
              <div className="w-4 h-4 rounded-full bg-success-600 relative z-10 shadow-[0_0_15px_rgba(22,163,74,0.6)]"></div>
          </div>
          <span className="group-hover:text-success-600 transition-colors italic">Equity Stream: ACTIVE</span>
        </div>
      </header>

      {/* Mode Selector */}
      <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />

      {/* Content Panel */}
      <div className="min-h-[600px] relative">
        <AnimatePresence mode="wait">
          {activeMode === "smart" ? (
            <motion.div
              key="smart"
              initial={{ opacity: 0, scale: 0.98, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <SmartOpportunitiesModule />
            </motion.div>
          ) : (
            <motion.div
              key="government"
              initial={{ opacity: 0, scale: 0.98, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <GovernmentSchemesModule />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
        {/* Accessibility Footer Feedback */}
      <Card className="mt-20 p-10 bg-neutral-50 dark:bg-neutral-900/50 border-2 border-neutral-100 dark:border-neutral-800 rounded-[3rem] group">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-[2rem] flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-xl group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-2 italic tracking-tight">
              Universal Design Architecture
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 font-bold italic opacity-80 leading-relaxed">
              Engineered for global parity. Our decentralized architecture ensures parity of access regardless of device hardware or geographical node.
            </p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-800 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 italic">V4 Standard</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OpportunityAccessibility;
