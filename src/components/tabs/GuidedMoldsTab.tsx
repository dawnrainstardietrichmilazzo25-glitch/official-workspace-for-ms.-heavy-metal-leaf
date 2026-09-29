import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  FileCode, 
  Download, 
  Compass, 
  Droplets, 
  Wind, 
  Sprout, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Eye, 
  Maximize2, 
  FileSpreadsheet, 
  CheckCircle2, 
  FolderOpen,
  X,
  ZoomIn,
  Image as ImageIcon,
  Quote
} from 'lucide-react';
import { BLUEPRINT_ARTIFACTS } from '../../data/mockData';
import { BlueprintArtifact, ModularHousingType } from '../../types';
import { exportToCsv } from '../../utils/analysis';

export const GuidedMoldsTab: React.FC = () => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('bp-plant-biobot');
  const [activeHousing, setActiveHousing] = useState<ModularHousingType>('terrestrial');
  const [moldChannelWidth, setMoldChannelWidth] = useState<number>(0.8); // mm
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'render' | 'cad'>('render');
  const [lightboxImage, setLightboxImage] = useState<BlueprintArtifact | null>(null);

  const selectedArtifact = BLUEPRINT_ARTIFACTS.find(a => a.id === selectedArtifactId) || BLUEPRINT_ARTIFACTS[0];

  const categories = [
    { id: 'all', label: 'All Visions & CAD (10)' },
    { id: 'Living Bio-Hybrid', label: 'Living Bio-Hybrids' },
    { id: 'Grown Circuitry', label: 'Grown Circuitry' },
    { id: 'CAD Guided Growth Mold', label: 'CAD Molds' },
    { id: 'Field Sentinel', label: 'Field Sentinels' },
    { id: 'Narrative Concept', label: 'Narrative & Myth' }
  ];

  const filteredArtifacts = BLUEPRINT_ARTIFACTS.filter(a => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    return true;
  });

  const sampleCsvData = [
    { timestamp: '2026-09-25T10:00:00Z', cd_uptake_ppm: 142, ni_uptake_ppm: 88, biopotential_mv: -28.4, leaf_angle_deg: 38.5, soil_vwc_pct: 62 },
    { timestamp: '2026-09-25T14:00:00Z', cd_uptake_ppm: 185, ni_uptake_ppm: 115, biopotential_mv: -22.1, leaf_angle_deg: 36.0, soil_vwc_pct: 54 },
    { timestamp: '2026-09-26T10:00:00Z', cd_uptake_ppm: 240, ni_uptake_ppm: 160, biopotential_mv: -17.8, leaf_angle_deg: 25.2, soil_vwc_pct: 35 },
    { timestamp: '2026-09-26T12:00:00Z', cd_uptake_ppm: 265, ni_uptake_ppm: 178, biopotential_mv: -14.2, leaf_angle_deg: 24.0, soil_vwc_pct: 32 },
    { timestamp: '2026-09-26T13:30:00Z', cd_uptake_ppm: 280, ni_uptake_ppm: 185, biopotential_mv: -32.6, leaf_angle_deg: 42.0, soil_vwc_pct: 68 }
  ];

  const handleDownloadCsv = () => {
    exportToCsv(sampleCsvData, 'heavy_metal_leaf_v2.1.csv');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: CAD & Guided Growth Mold Vision */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
              Cyborg Botany CAD & Prototype Suite
            </span>
            <span className="text-xs text-slate-400 font-mono">9 Prototype Visions + Empirical CSV</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Prototype Visions, Guided-Growth Molds & Modular Housings
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Realizing Dawn’s core thesis: <em>“Prove that metal components and structural robotics can be grown inside living plants using molds instead of mined and manufactured.”</em>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download heavy_metal_leaf_v2.1.csv</span>
          </button>
        </div>
      </div>

      {/* Morphological Optimization Note */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-amber-300 uppercase tracking-wide">
              Morphology & Optimization Strategy — Dawn (Founder)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
              Form Follows Ecology
            </span>
          </div>
          <p className="text-slate-300 italic font-serif leading-relaxed">
            "While Ms. Heavy Metal Leaf was first envisioned as a humanoid avatar to symbolize the bridge between plant biology, human intention, robotics, and myth, <strong>her physical structure is altered and customized for real-world environmental optimization</strong>. The prototype visions below reshape plant tissues into non-humanoid geometries—hydrodynamic floating bio-rafts, vertical soil columns, and living circuit slabs—to achieve maximum pollutant filtration and metal mineralization yield."
          </p>
        </div>
      </div>

      {/* 3 Modular Housings Switcher (Land, Water, Air) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <button
          onClick={() => setActiveHousing('terrestrial')}
          className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
            activeHousing === 'terrestrial'
              ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400 shadow-lg shadow-emerald-950/30'
              : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
              Active Pilot
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">1. Terrestrial (Soil & Brownfield)</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Engineered for mine tailings and toxic urban soils. Root guides extract Cd, Pb, and Zn into molded xylem trunks equipped with high-Z petiole electrodes.
          </p>
        </button>

        <button
          onClick={() => setActiveHousing('aquatic_floating')}
          className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
            activeHousing === 'aquatic_floating'
              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400 shadow-lg shadow-cyan-950/30'
              : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
              WA Water Quality Fit
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">2. Aquatic (Floating Wetland Sentinel)</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Non-construction buoyant collar for stormwater ponds, Puget Sound estuaries, and algae/nutrient monitoring. Portable, deployable, solar-harvesting.
          </p>
        </button>

        <button
          onClick={() => setActiveHousing('atmospheric')}
          className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
            activeHousing === 'atmospheric'
              ? 'bg-amber-500/15 border-amber-400 text-amber-300 ring-1 ring-amber-400 shadow-lg shadow-amber-950/30'
              : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
              Air Quality & Grid
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">3. Atmospheric (Canopy Bio-Probe)</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Aerosol heavy-metal deposition and canopy transpiration sentinel. Integrates with distributed grid modernization and community microclimates.
          </p>
        </button>

      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Blueprint & CAD Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Artifacts Files List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <span>Prototype Visions & Concept Studies</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">{filteredArtifacts.length} Artifacts</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredArtifacts.map((art) => {
              const isSelected = art.id === selectedArtifactId;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArtifactId(art.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  {/* Thumbnail */}
                  {art.imageUrl ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-950">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg shrink-0 border border-slate-700 bg-slate-950 flex items-center justify-center text-emerald-400">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-white truncate">{art.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                        {art.fileSize}
                      </span>
                    </div>

                    {art.visionTheme && (
                      <span className="text-[10px] text-cyan-300 font-mono line-clamp-1 mt-0.5">
                        {art.visionTheme}
                      </span>
                    )}

                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {art.category}
                      </span>
                      <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                        Inspect →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box on Dawn's 4 Goals */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-white block">Ms. Heavy Metal Leaf Mission:</span>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <div>1. <strong className="text-slate-200">Clean toxins</strong> using real hyperaccumulator biology.</div>
              <div>2. <strong className="text-slate-200">Grow metal components</strong> inside precision geometric molds.</div>
              <div>3. <strong className="text-slate-200">Reduce mining</strong> to heal disrupted ecosystems.</div>
              <div>4. <strong className="text-slate-200">Replace machine robots</strong> with living, responsive biobots.</div>
            </div>
          </div>
        </div>

        {/* Right Columns: High-Res Prototype Viewer & Technical Specifications */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedArtifact.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono truncate max-w-xs">
                    File: {selectedArtifact.filename}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedArtifact.title}</h3>
                {selectedArtifact.visionTheme && (
                  <p className="text-xs text-teal-400 font-mono mt-0.5">{selectedArtifact.visionTheme}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedArtifact.imageUrl && (
                  <button
                    onClick={() => setLightboxImage(selectedArtifact)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                    title="Open high-resolution lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Expand</span>
                  </button>
                )}
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                  Size: {selectedArtifact.fileSize}
                </span>
              </div>
            </div>

            {/* View Mode Switcher (For items with both Render and CAD) */}
            {selectedArtifact.imageUrl && (
              <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('render')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      viewMode === 'render'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Prototype Vision Render</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cad')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      viewMode === 'cad'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>CAD Vector Schematic</span>
                  </button>
                </div>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                  Interactive Viewport
                </span>
              </div>
            )}

            {/* Viewport Display */}
            {selectedArtifact.imageUrl && viewMode === 'render' ? (
              <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 group shadow-xl">
                <img
                  src={selectedArtifact.imageUrl}
                  alt={selectedArtifact.title}
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setLightboxImage(selectedArtifact)}
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90 pointer-events-none"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                  <div className="max-w-md">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider block">
                      Prototype Vision Study
                    </span>
                    <p className="text-xs text-white font-medium drop-shadow-md line-clamp-2">
                      {selectedArtifact.promptDescription}
                    </p>
                  </div>
                  <button
                    onClick={() => setLightboxImage(selectedArtifact)}
                    className="pointer-events-auto flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono backdrop-blur-sm cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive CAD Mold Diagram (Vector Schematic) */
              <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden p-4 flex flex-col justify-between">
                
                {/* Grid backdrop */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f4915_1px,transparent_1px),linear-gradient(to_bottom,#082f4915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                {/* Top CAD Status HUD */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" />
                    CAD VIEWPORT // SUBSTRATE GUIDED MOLD v1.4
                  </span>
                  <span className="text-slate-400">
                    CHANNEL TOLERANCE: <strong className="text-white">±0.05 mm</strong>
                  </span>
                </div>

                {/* Vector Blueprint Graphics */}
                <div className="relative z-10 my-auto flex items-center justify-center">
                  <svg className="w-full max-w-lg h-44" viewBox="0 0 500 160">
                    {/* Mold Clamshell Outer Frame */}
                    <rect x="50" y="20" width="400" height="120" rx="8" fill="#030712" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6 3" />
                    
                    {/* Aeration Diffusion Slots */}
                    <rect x="70" y="30" width="6" height="20" rx="2" fill="#082f49" />
                    <rect x="90" y="30" width="6" height="20" rx="2" fill="#082f49" />
                    <rect x="110" y="30" width="6" height="20" rx="2" fill="#082f49" />
                    <rect x="370" y="30" width="6" height="20" rx="2" fill="#082f49" />
                    <rect x="390" y="30" width="6" height="20" rx="2" fill="#082f49" />
                    <rect x="410" y="30" width="6" height="20" rx="2" fill="#082f49" />

                    {/* Mold-Guided Micro-Channel Vascular Path (Glowing Cyan Trace) */}
                    <path
                      d="M 80 80 Q 150 40 220 80 T 360 80 L 420 80"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />

                    {/* In-Vivo Conductive Xylem Trace (Emerald Living Core) */}
                    <path
                      d="M 80 80 Q 150 40 220 80 T 360 80 L 420 80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Electrode Contact Points */}
                    <circle cx="150" cy="57" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="290" cy="103" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="420" cy="80" r="7" fill="#10b981" stroke="#fff" strokeWidth="1.5" />

                    {/* Annotation labels */}
                    <text x="150" y="42" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">PETIOLE ELECTRODE A</text>
                    <text x="290" y="125" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">GROUND REFERENCE B</text>
                    <text x="420" y="100" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">XYLEM OUTPUT BUS</text>

                    {/* Seedling Collar Anchor */}
                    <rect x="60" y="70" width="25" height="20" rx="3" fill="#047857" stroke="#10b981" strokeWidth="1" />
                    <text x="72" y="83" fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle">STEM</text>
                  </svg>
                </div>

                {/* Bottom CAD Dimension Indicator */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>Microchannel Dia: <strong className="text-cyan-300">{moldChannelWidth} mm</strong></span>
                  <span>Material: <strong className="text-white">Bio-Compatible SLA Resin</strong></span>
                  <span>Assembly: <strong className="text-emerald-400">Two-Part Clamshell</strong></span>
                </div>
              </div>
            )}

            {/* Founder's Vision Callout */}
            {selectedArtifact.founderQuote && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-emerald-950/30 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-semibold">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Dawn’s Vision Behind This Prototype:</span>
                </div>
                <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                  "{selectedArtifact.founderQuote}"
                </p>
              </div>
            )}

            {/* Technical Specifications of the Selected Artifact */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Blueprint & Engineering Specifications
              </h4>
              <div className="space-y-1.5">
                {selectedArtifact.technicalSpecs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Guided Growth Molding Protocol */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>4-Step Guided Growth & In-Vivo Vascularization Protocol</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Laboratory Standard</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { step: '01', title: 'Seedling Seeding', desc: 'Place germinated Brassica or Alyssum seedling at root anchor collar' },
                  { step: '02', title: 'Mold Enclosure', desc: 'Secure clamshell SLA mold over growing petiole and xylem pathways' },
                  { step: '03', title: 'Metal Translocation', desc: 'Dose hydroponic solution with calibrated Ni/Cd/Au ions for uptake' },
                  { step: '04', title: 'Electrode Coupling', desc: 'Lock recessed non-polarizing Ag/AgCl contacts into mature tissue' }
                ].map((s) => (
                  <div key={s.step} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block">STEP {s.step}</span>
                    <span className="font-semibold text-white block text-[11px]">{s.title}</span>
                    <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dataset Preview Box for heavy_metal_leaf_v2.1.csv */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Dataset Preview: heavy_metal_leaf_v2.1.csv (300+ Rows)</span>
                </span>
                <button
                  onClick={handleDownloadCsv}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1">Timestamp</th>
                      <th className="py-1">Cd (ppm)</th>
                      <th className="py-1">Ni (ppm)</th>
                      <th className="py-1">V_bio (mV)</th>
                      <th className="py-1">Leaf Angle</th>
                      <th className="py-1">Soil VWC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {sampleCsvData.map((row, i) => (
                      <tr key={i}>
                        <td className="py-1 text-slate-400">{row.timestamp.split('T')[1].replace('Z','')}</td>
                        <td className="py-1 text-emerald-400">{row.cd_uptake_ppm}</td>
                        <td className="py-1 text-teal-400">{row.ni_uptake_ppm}</td>
                        <td className="py-1 text-amber-400">{row.biopotential_mv}</td>
                        <td className="py-1 text-cyan-400">+{row.leaf_angle_deg}°</td>
                        <td className="py-1 text-slate-300">{row.soil_vwc_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Modal for High-Resolution Full-Screen Inspection */}
      {lightboxImage && lightboxImage.imageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {lightboxImage.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {lightboxImage.title}
                </h3>
                {lightboxImage.visionTheme && (
                  <p className="text-xs text-teal-400 font-mono">{lightboxImage.visionTheme}</p>
                )}
              </div>

              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image View */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-[65vh]">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="w-full h-auto max-h-[65vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Description & Founder Quote */}
            <div className="space-y-2">
              {lightboxImage.founderQuote && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 font-serif italic">
                  "{lightboxImage.founderQuote}" — Dawn
                </div>
              )}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {lightboxImage.promptDescription}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
