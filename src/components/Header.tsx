import React from 'react';
import { 
  Sprout, 
  Activity, 
  Cpu, 
  FileText, 
  Database, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Download,
  Box,
  TrendingUp,
  LineChart,
  Bot
} from 'lucide-react';
import { ActiveTab } from '../types';

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: typeof Sprout;
  count?: number;
  badge?: string;
}

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  observationCount: number;
  onExportAll: () => void;
  onOpenQuickLog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  observationCount,
  onExportAll,
  onOpenQuickLog
}) => {
  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Environmental Dashboard', icon: TrendingUp, badge: 'Telemetry' },
    { id: 'assistant', label: 'AI Co-Scientist', icon: Bot, badge: 'Gemini AI' },
    { id: 'blueprints', label: 'Prototype Visions & Molds', icon: Box, badge: '10 Studies' },
    { id: 'analytics', label: 'Bio-Correlation Analytics', icon: LineChart, badge: 'Recharts' },
    { id: 'observations', label: 'Plant Observations', icon: Sprout, count: observationCount },
    { id: 'simulator', label: 'Signal Oscilloscope', icon: Activity, badge: 'Live' },
    { id: 'architecture', label: 'Hardware Architecture', icon: Cpu, badge: 'AFE & MCU' },
    { id: 'grants', label: 'Grant Proposal Hub', icon: FileText, badge: 'WA & NSF' },
    { id: 'phytomining', label: 'Phytomining & Cyborg Botany', icon: Database },
    { id: 'collaboration', label: 'R&D Team & Partners', icon: Users, badge: 'Fiverr Collab' }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner / Project Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl overflow-hidden border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/60 bg-slate-950 group ring-2 ring-emerald-500/20">
                <img
                  src="/src/assets/images/heavy_metal_logo_1790710894520.jpg"
                  alt="Ms. Heavy Metal Leaf Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>ONMOTIO</span>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                    Phase 0 Feasibility
                  </span>
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                  Ms. Heavy Metal Leaf Project
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Biohybrid Environmental Sensing & Phytomining Research Workbench • Indoor/Outdoor Baseline Pilot
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mustard Pilot: Active
              </span>
              <span className="text-slate-600">|</span>
              <span>Obs: {observationCount}</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-300 font-medium">r = +0.89 corr</span>
            </div>

            <button
              onClick={onOpenQuickLog}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Log Observation</span>
            </button>

            <button
              onClick={onExportAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Export all observations to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Bar */}
        <nav className="flex items-center gap-1.5 mt-3.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-emerald-500/25 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
