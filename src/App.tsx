import React, { useState, useEffect } from 'react';
import { ActiveTab, PlantObservation } from './types';
import { INITIAL_OBSERVATIONS } from './data/mockData';
import { Header } from './components/Header';
import { ObservationTrackerTab } from './components/tabs/ObservationTrackerTab';
import { SignalSimulatorTab } from './components/tabs/SignalSimulatorTab';
import { ArchitectureExplorerTab } from './components/tabs/ArchitectureExplorerTab';
import { GuidedMoldsTab } from './components/tabs/GuidedMoldsTab';
import { GrantDossierTab } from './components/tabs/GrantDossierTab';
import { PhytominingDatabaseTab } from './components/tabs/PhytominingDatabaseTab';
import { CollaborationLogTab } from './components/tabs/CollaborationLogTab';
import { exportToCsv } from './utils/analysis';
import { Sprout, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('observations');
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
