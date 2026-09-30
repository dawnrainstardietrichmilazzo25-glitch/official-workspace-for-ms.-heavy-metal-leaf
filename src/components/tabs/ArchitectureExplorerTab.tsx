import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Zap, 
  Sliders, 
  Radio, 
  ShieldCheck, 
  Microchip,
  Sparkles,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { HardwareBlock } from '../../types';
import { HARDWARE_BLOCKS } from '../../data/mockData';
import { exportToCsv } from '../../utils/analysis';

export const ArchitectureExplorerTab: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('hw-afe');
  const [activeBudgetTier, setActiveBudgetTier] = useState<'phase0' | 'phase1' | 'phase2'>('phase0');

  const selectedBlock = HARDWARE_BLOCKS.find(b => b.id === selectedBlockId) || HARDWARE_BLOCKS[0];

  const totalPhase0Cost = HARDWARE_BLOCKS
    .filter(b => b.phase.includes('Phase 0'))
    .reduce((sum, b) => sum + b.estimatedCostUsd, 0);

  const totalAllHardwareCost = HARDWARE_BLOCKS.reduce((sum, b) => sum + b.estimatedCostUsd, 0);

  const handleExportBom = () => {
    exportToCsv(
      HARDWARE_BLOCKS.map(b => ({
        layer: b.layer,
        subsystem: b.title,
        phase: b.phase,
        estimated_cost_usd: b.estimatedCostUsd,
        key_components: b.keyComponents.join('; '),
        status: b.status
      })),
      'ONMOTIO_Hardware_Bill_of_Materials.csv'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Chrislance Engineering Blueprint */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
              Hardware Engineering Blueprint
            </span>
            <span className="text-xs text-slate-400 font-mono">Embedded Architecture by Chrislance</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Biohybrid Measurement & Data-Acquisition Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Structured around Chrislance’s technical framework: <strong>Environmental Condition → Plant Response → Measurable Variable → Electronic Measurement → Data Acquisition → Telemetry.</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => {
              const drawingsText = `================================================================================
ONMOTIO // MS. HEAVY METAL LEAF — PHASE ZERO HARDWARE DRAWINGS & CIRCUIT SPEC
Engineering Lead: Chrislance | Concept Lead: Dawn
Target Review: Phase Zero Technical Feasibility & Architecture Review
================================================================================

1. ANALOG FRONT-END (AFE) SPECIFICATIONS
--------------------------------------------------------------------------------
- Primary Instrumentation Amplifier: Texas Instruments INA128
- Input Impedance: > 10^12 Ohms (1 Teraohm) differential
- Input Bias Current: < 2.0 nA (prevents biological electroporation/damage)
- Common-Mode Rejection Ratio (CMRR): 120 dB min (G = 100)
- Gain Resistor (R_G): 500 Ohms (yielding G = 1 + (50k / 500) = 101 V/V)
- Power Supply: Dual Rail +/- 3.3V (Galvanically isolated via DC-DC converter)

2. PLANT OVERVOLTAGE & SURGE PROTECTION (EOS)
--------------------------------------------------------------------------------
- Low-Leakage Schottky TVS Diode Clamps: Placed between Petiole In+ and GND,
  and Root In- and GND. Clamps voltage spikes < 0.3V.
- Current-Limiting Series Resistors: 1 MOhm to 10 MOhm in series with Ag/AgCl
  probes to guarantee zero lethal current density reaching plant tissue.
- Driven Guard (Active Shielding): Coaxial cable outer shield driven by op-amp
  buffer at signal potential to eliminate cable capacitance and 60Hz hum.

3. FILTERING STAGE
--------------------------------------------------------------------------------
- Active Twin-T 60 Hz Notch Filter: Q = 10, notch depth > 45 dB
- 2nd-Order Sallen-Key Low-Pass Filter: Cutoff frequency f_c = 15 Hz
  (eliminates RF and high-frequency noise while preserving DC slow-wave biopotentials)

4. DATA ACQUISITION & MCU
--------------------------------------------------------------------------------
- Microcontroller: Espressif ESP32-S3 (Dual-core 240MHz, 2.4GHz Wi-Fi + BLE 5.0)
- ADC: ADS1115 (16-bit Delta-Sigma ADC over I2C) or internal ESP32 12-bit ADC
- Sampling Rate: 10 Hz nominal (sub-15 uA deep-sleep duty cycle)
- Telemetry: MQTT / HTTPS to ONMOTIO Research Workbench & Google Sheets Sync

================================================================================
Generated for Chrislance Phase Zero Technical Feasibility & Architecture Review
================================================================================`;
              const blob = new Blob([drawingsText], { type: 'text/plain;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'ONMOTIO_Hardware_Drawings_AFE_Schematic.txt';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-teal-300 border border-teal-500/40 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <FileCode className="w-4 h-4" />
            <span>Download Drawings for Chrislance</span>
          </button>

          <button
            onClick={handleExportBom}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Full BOM CSV</span>
          </button>
        </div>
      </div>

      {/* Epistemic Truth Separation Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-teal-950/40 border border-amber-500/40 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-amber-300 uppercase tracking-wide">
              Epistemic Verification Matrix: Hardware & Circuitry
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              TI INA128 Datasheet: Verified Physics
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              Breadboard Interconnect: Proposed Model
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            Following Dawn and Chrislance's directive to <em>"keep facts separated from what hasn't been tested yet"</em>: The electrical parameters of the Texas Instruments INA128 (&gt;10¹² Ω input impedance, &lt;2 nA bias current, 120 dB CMRR) and passive TVS surge clamping are <strong>mathematically and physically verified component properties</strong>. However, the multi-channel breadboard interconnect and live petiole transduction are <strong>proposed engineering designs</strong> subject to Chrislance's upcoming Phase Zero Technical Feasibility Review before physical PCB fabrication.
          </p>
        </div>
      </div>

      {/* Interactive System Block Diagram */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Signal Chain Flow & Interconnect Diagram</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Click any block to inspect circuit specs</span>
        </div>

        {/* Horizontal Flow Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {HARDWARE_BLOCKS.map((block, idx) => {
            const isSelected = block.id === selectedBlockId;
            return (
              <button
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-400 text-teal-300 shadow-lg shadow-teal-950/40 ring-1 ring-teal-400'
                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Step {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold font-mono text-emerald-400">
                      ${block.estimatedCostUsd}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{block.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-tight">{block.shortDesc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className={block.phase.includes('Phase 0') ? 'text-emerald-400' : 'text-slate-500'}>
                    {block.phase.split(' ')[0]}
                  </span>
                  <span className="text-teal-400 font-semibold">Inspect →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Subsystem Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deep Dive Specifications */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                  Layer: {selectedBlock.layer.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedBlock.phase}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{selectedBlock.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">Estimated Subsystem BOM</span>
              <p className="text-xl font-bold font-mono text-emerald-400">${selectedBlock.estimatedCostUsd} USD</p>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-teal-400" />
              <span>Engineering Specifications</span>
            </h4>
            <div className="space-y-1.5">
              {selectedBlock.detailedSpecs.map((spec, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chrislance Schematic Guidelines */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Chrislance’s Hardware Engineering Directives</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {selectedBlock.schematicTips}
            </p>
          </div>

          {/* Key ICs and Bill of Materials */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Key Components & Sourcing
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedBlock.keyComponents.map((comp, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Phase Budgeting & Proof-of-Concept Pathway */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Phase Budgeting & R&D Rollout</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stepped prototype roadmap supporting grant applications and lab tests
              </p>
            </div>

            {/* Budget Tiers */}
            <div className="space-y-2.5">
              
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Phase 0: Benchtop Feasibility MVP</span>
                  <span className="font-mono text-emerald-400 font-bold">${totalPhase0Cost} USD</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  INA128 AFE protoboard, ADS1115 ADC, ESP32-S3, Ag/AgCl leaf electrodes, BME280, capacitive soil sensor.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Sufficient for initial grant demonstrator validation</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Phase 1: Controlled Hydroponic Pilot</span>
                  <span className="font-mono text-teal-400 font-bold">$580 USD</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Custom printed 4-layer PCB with ground planes, peristaltic nutrient/metal dosing pump, photoperiod chamber.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Phase 2: Autonomous Field Node</span>
                  <span className="font-mono text-cyan-400 font-bold">$1,420 USD</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Weatherproof IP67 node, Semtech SX1262 LoRa mesh, flexible organic solar film, phytomining brownfield pilot.
                </p>
              </div>

            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="text-[11px] font-mono text-teal-400 font-semibold block">
              Chrislance's Collaboration Recommendation:
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <em>“Rather than jumping directly into full hardware development, we make the first step a focused Phase Zero Technical Feasibility & Architecture. That gives you something concrete to use when speaking with future biological researchers, laboratories, funding programs, or R&D partners.”</em>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
