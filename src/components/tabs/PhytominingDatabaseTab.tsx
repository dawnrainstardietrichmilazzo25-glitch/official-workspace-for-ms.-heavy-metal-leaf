import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  Leaf, 
  Zap, 
  ShieldAlert, 
  FlaskConical, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Globe2
} from 'lucide-react';
import { HYPERACCUMULATOR_DATABASE } from '../../data/mockData';
import { HyperaccumulatorSpecies } from '../../types';

export const PhytominingDatabaseTab: React.FC = () => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('sp-mustard');
  const [soilMetalPpm, setSoilMetalPpm] = useState<number>(850);
  const [targetMetal, setTargetMetal] = useState<string>('Cadmium / Nickel');

  const selectedSpecies = HYPERACCUMULATOR_DATABASE.find(s => s.id === selectedSpeciesId) || HYPERACCUMULATOR_DATABASE[0];

  // Calculated biological predictions
  const estimatedTissueConcentrationPpm = Math.min(
    selectedSpecies.maxConcentrationPpm,
    Math.round(soilMetalPpm * (selectedSpecies.id === 'sp-mustard' ? 2.8 : selectedSpecies.id === 'sp-pennycress' ? 6.5 : 4.2))
  );

  const estimatedSapConductivityUscm = 300 + Math.round(estimatedTissueConcentrationPpm * 0.45);
  const projectedPotentialShiftMv = Math.round((estimatedTissueConcentrationPpm / 250) * 1.8 * 10) / 10;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: The Vision of Ms. Heavy Metal Leaf */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Cyborg Botany & Metallophyte Biology
            </span>
            <span className="text-xs text-slate-400 font-mono">Living Circuitry & In-Vivo Conductive Traces</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Ms. Heavy Metal Leaf: Phytoremediation, Phytomining & Grown Robotics
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Dawn’s founding thesis: <em>“She is designed to clean toxic land using phytoremediation and phytomining, and to demonstrate that robotics and conductive components can be grown inside a plant instead of mined from the earth.”</em>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-mono text-emerald-400">
            <span>5 Model Metallophytes Documented</span>
          </div>
        </div>
      </div>

      {/* The 3 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Leaf className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">1. Phytoremediation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plants absorb hazardous heavy metals (lead, cadmium, arsenic) through specialized roots, permanently decontaminating industrial brownfields and toxic mine tailing runoff.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FlaskConical className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">2. Phytomining (Bio-Ore)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Concentrates commercial metals (nickel, cobalt, zinc) in harvestable shoots up to 3% dry weight, generating circular bio-ores without destructive open-pit excavation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">3. Cyborg Botany & Grown Robotics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Using vascular xylem channels and concentrated metallic ions to form organic conductive wires in-vivo, turning living plants into autonomous sensing machines.
          </p>
        </div>

      </div>

      {/* Metallophyte Species Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Species List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Select Model Hyperaccumulator Species</span>
          </h3>

          <div className="space-y-2">
            {HYPERACCUMULATOR_DATABASE.map((sp) => {
              const isSelected = sp.id === selectedSpeciesId;
              return (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpeciesId(sp.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{sp.commonName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                      Up to {sp.maxConcentrationPpm.toLocaleString()} ppm
                    </span>
                  </div>
                  <p className="text-[11px] font-mono italic text-slate-400">{sp.scientificName}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sp.accumulatedMetals.map((m, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-950/70 text-slate-300">
                        {m.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Species Detail Dossier */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedSpecies.family}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Biomass Rate: {selectedSpecies.biomassRate}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedSpecies.commonName} (<span className="italic font-normal">{selectedSpecies.scientificName}</span>)
                </h3>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 font-mono block">Current Role in ONMOTIO</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">{selectedSpecies.currentRoleInOnmotio}</span>
              </div>
            </div>

            {/* Target Metals Pills */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Hyperaccumulated Metals:</span>
              <div className="flex flex-wrap gap-2">
                {selectedSpecies.accumulatedMetals.map((metal, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800 text-xs font-mono">
                    ⚡ {metal}
                  </span>
                ))}
              </div>
            </div>

            {/* Scientific Breakdown */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="font-semibold text-emerald-400 block mb-1">
                  Biohybrid Sensing Potential:
                </span>
                <p className="text-slate-300">{selectedSpecies.biohybridPotential}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="font-semibold text-cyan-400 block mb-1">
                  Electrical Conductivity & Sap Chemistry:
                </span>
                <p className="text-slate-300">{selectedSpecies.conductivityNotes}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="font-semibold text-amber-400 block mb-1">
                  Soil Ecology & Contaminated Habitat:
                </span>
                <p className="text-slate-300">{selectedSpecies.soilContext}</p>
              </div>
            </div>

          </div>

          {/* Theoretical Uptake & Conductance Calculator */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                <span>Simulated Heavy Metal Uptake & Electrophysiological Impact</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Dosing Model</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Contaminated Soil / Hydroponic Metal Concentration:</span>
                  <span className="text-emerald-400 font-bold">{soilMetalPpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={soilMetalPpm}
                  onChange={e => setSoilMetalPpm(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TISSUE ACCUMULATION</span>
                  <span className="text-emerald-400 text-sm font-bold">{estimatedTissueConcentrationPpm.toLocaleString()} ppm</span>
                  <span className="text-[10px] text-slate-400 block">Dry Weight Shoot</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">SAP CONDUCTIVITY</span>
                  <span className="text-cyan-400 text-sm font-bold">{estimatedSapConductivityUscm} µS/cm</span>
                  <span className="text-[10px] text-slate-400 block">Ionic Mobile Charge</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">PREDICTED V_bio SHIFT</span>
                  <span className="text-amber-400 text-sm font-bold">+{projectedPotentialShiftMv} mV</span>
                  <span className="text-[10px] text-slate-400 block">Membrane Depolarization</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
