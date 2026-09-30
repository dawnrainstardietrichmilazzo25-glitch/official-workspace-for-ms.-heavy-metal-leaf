import React, { useState, useEffect } from 'react';
import { ActiveTab, PlantObservation } from './types';
import { INITIAL_OBSERVATIONS } from './data/mockData';
import { Header } from './components/Header';
import { ProjectManifestoHero } from './components/ProjectManifestoHero';
import { DashboardTab } from './components/tabs/DashboardTab';
import { BioCorrelationAnalyticsTab } from './components/tabs/BioCorrelationAnalyticsTab';
import { ObservationTrackerTab } from './components/tabs/ObservationTrackerTab';
import { SignalSimulatorTab } from './components/tabs/SignalSimulatorTab';
import { ArchitectureExplorerTab } from './components/tabs/ArchitectureExplorerTab';
import { GuidedMoldsTab } from './components/tabs/GuidedMoldsTab';
import { AiResearchAssistantTab } from './components/tabs/AiResearchAssistantTab';
import { CommunityKnowledgeNetwork } from './components/tabs/CommunityKnowledgeNetwork';
import { GrantDossierTab } from './components/tabs/GrantDossierTab';
import { PhytominingDatabaseTab } from './components/tabs/PhytominingDatabaseTab';
import { CollaborationLogTab } from './components/tabs/CollaborationLogTab';
import { exportToCsv } from './utils/analysis';
import { exportToGoogleSheets } from './services/googleSheetsService';
import { Sprout, ExternalLink, ShieldCheck, Heart, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSheetsSyncing, setIsSheetsSyncing] = useState(false);
  const [sheetsSyncToast, setSheetsSyncToast] = useState<{ url: string; title: string } | null>(null);
  const [sheetsSyncError, setSheetsSyncError] = useState<string | null>(null);
  const [observations, setObservations] = useState<PlantObservation[]>(() => {
    try {
      const saved = localStorage.getItem('onmotio_observations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved observations:', e);
    }
    return INITIAL_OBSERVATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('onmotio_observations', JSON.stringify(observations));
    } catch (e) {
      console.error('Error saving observations:', e);
    }
  }, [observations]);

  const handleAddObservation = (newObs: Omit<PlantObservation, 'id'>) => {
    const created: PlantObservation = {
      ...newObs,
      id: `obs-${Date.now()}`
    };
    setObservations(prev => [created, ...prev]);
  };

  const handleExportAll = () => {
    exportToCsv(observations, `ONMOTIO_All_Observations_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSyncGoogleSheets = async () => {
    setIsSheetsSyncing(true);
    setSheetsSyncError(null);
    try {
      const res = await exportToGoogleSheets(observations);
      setSheetsSyncToast({ url: res.spreadsheetUrl, title: 'Mustard Pilot Dataset' });
      window.open(res.spreadsheetUrl, '_blank');
    } catch (err: any) {
      console.error('Google Sheets sync error:', err);
      setSheetsSyncError(err.message || 'Failed to sync with Google Sheets. Please check permissions.');
    } finally {
      setIsSheetsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        observationCount={observations.length}
        onExportAll={handleExportAll}
        onOpenQuickLog={() => {
          setActiveTab('observations');
        }}
        onSyncGoogleSheets={handleSyncGoogleSheets}
        isGoogleSheetsLoading={isSheetsSyncing}
      />

      {/* Floating Google Sheets Sync Notification */}
      {sheetsSyncToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="space-y-0.5 text-xs font-mono">
            <span className="font-bold text-white block">Successfully Synced to Google Sheets!</span>
            <a
              href={sheetsSyncToast.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
            >
              <span>Open Spreadsheet in Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={() => setSheetsSyncToast(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Google Sheets Sync Error */}
      {sheetsSyncError && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-red-950/90 border border-red-500/50 shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="space-y-0.5 text-xs font-mono">
            <span className="font-bold text-white block">Google Sheets Sync Notice</span>
            <p className="text-red-200 text-[11px] max-w-sm">{sheetsSyncError}</p>
          </div>
          <button
            onClick={() => setSheetsSyncError(null)}
            className="p-1 rounded-lg text-red-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Project Vision & Realization Roadmap Manifesto */}
        <ProjectManifestoHero onNavigateTab={(tab) => setActiveTab(tab)} />

        {activeTab === 'dashboard' && (
          <DashboardTab
            observations={observations}
            onNavigateToLog={() => setActiveTab('observations')}
          />
        )}

        {activeTab === 'assistant' && (
          <AiResearchAssistantTab />
        )}

        {activeTab === 'knowledge' && (
          <CommunityKnowledgeNetwork />
        )}

        {activeTab === 'analytics' && (
          <BioCorrelationAnalyticsTab
            observations={observations}
            onNavigateToLog={() => setActiveTab('observations')}
          />
        )}

        {activeTab === 'observations' && (
          <ObservationTrackerTab
            observations={observations}
            onAddObservation={handleAddObservation}
          />
        )}

        {activeTab === 'simulator' && (
          <SignalSimulatorTab />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureExplorerTab />
        )}

        {activeTab === 'blueprints' && (
          <GuidedMoldsTab />
        )}

        {activeTab === 'grants' && (
          <GrantDossierTab />
        )}

        {activeTab === 'phytomining' && (
          <PhytominingDatabaseTab />
        )}

        {activeTab === 'collaboration' && (
          <CollaborationLogTab />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">ONMOTIO</span>
            <span>•</span>
            <span>Ms. Heavy Metal Leaf Research Workbench</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-slate-400">
            <a
              href="https://www.linkedin.com/groups/40962056/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <span>LinkedIn Collective</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a
              href="https://www.facebook.com/share/g/1AnMTdNE3b/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <span>Facebook Group</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-slate-500 font-mono">Phase Zero Feasibility</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
