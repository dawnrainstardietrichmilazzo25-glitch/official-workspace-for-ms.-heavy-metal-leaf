import React, { useState } from 'react';
import { 
  Sprout, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Cpu, 
  FlaskConical, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Zap, 
  Droplets, 
  Globe2, 
  CheckCircle2, 
  Users, 
  Box,
  Bot,
  Image as ImageIcon
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ProjectManifestoHeroProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const ProjectManifestoHero: React.FC<ProjectManifestoHeroProps> = ({ onNavigateTab }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <section className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/30 overflow-hidden shadow-2xl transition-all">
      {/* Top Banner Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/70 border-b border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-emerald-500/50 shadow-md shrink-0 mt-0.5 bg-slate-950 ring-2 ring-emerald-500/20">
            <img
              src="/src/assets/images/heavy_metal_logo_1790710894520.jpg"
              alt="Ms. Heavy Metal Leaf Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Core Project Manifesto & Roadmap
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Ms. Heavy Metal Leaf • Bio-Cybernetic Organism
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              What is Ms. Heavy Metal Leaf — And How We Are Making Her Real
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => onNavigateTab('assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            title="Chat directly with the ONMOTIO AI Co-Scientist"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI Co-Scientist</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              </>
            ) : (
              <>
                <span>Read Full Mission & Plan</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6 text-xs sm:text-sm leading-relaxed">
          
          {/* Section 1: What She Is */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>1. The Core Concept: What Ms. Heavy Metal Leaf Is</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                A Living, Plant-Grown Bio-Cybernetic Sentinel — Not a Manufactured Plastic Machine
              </h3>
              <p className="text-slate-300">
                Ms. Heavy Metal Leaf is an autonomous bio-hybrid organism engineered to heal toxic heavy-metal wastelands (mining slag, serpentine soils, urban industrial runoff, and polluted stormwater). 
                <strong> She is not a static sculpture with plants glued on.</strong> She is an actual living botanical hyperaccumulator (such as <em>Brassica juncea</em>, <em>Alyssum bertolonii</em>, or <em>Noccaea caerulescens</em>) grown directly inside modular guided mold scaffolds. While her archetypal avatar was first envisioned by founder <strong>Dawn</strong> in a humanoid form to bridge ecology, cybernetics, and myth, her physical structure is completely open to alteration for real-world environmental optimization.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Living Grown Circuitry
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Roots pull dissolved metals (Nickel, Cadmium, Zinc) into xylem cell walls, concentrating ionic traces into low-impedance bio-conductive wiring instead of smelting mined copper.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Tri-Domain Modular Housings
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Designed to operate on <strong>Land</strong> (soil brownfield sentinels), <strong>Water</strong> (floating wetland sentinels for stormwater and Puget Sound), and <strong>Air</strong> (canopy aerosol probes).
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Highlight Pillar & Avatar Showcase */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-950 shadow-xl group relative">
                <img
                  src="/src/assets/images/avatar_sanctuary_1790710906756.jpg"
                  alt="Ms. Heavy Metal Leaf - Avatar of the Bridge between Plants, Humans, Machines and Myth"
                  className="w-full h-48 sm:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-3">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
                    Official Project Avatar & Muse
                  </span>
                  <p className="text-[11px] font-serif italic text-white leading-snug drop-shadow-md">
                    "ms. HEAVY METAL LEAF — the avatar of the bridge between hyperaccumulator plants, humans, machines and myth"
                  </p>
                </div>
              </div>

              {/* Founder's Morphology & Optimization Note from Dawn */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-emerald-950/40 border border-amber-500/40 space-y-2 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                    Form Factor & Optimization — Note from Dawn (Founder)
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed italic font-serif">
                  "Her being depicted in the shape of a human was my first intuitive vision of her—an archetypal avatar bridging hyperaccumulator plants, humans, machines, and myth. In physical engineering and deployment, <strong>her shape is completely alterable for environmental optimization</strong>. Whether evolved into modular floating wetland rafts, vertical riparian cascades, or fractal root cassettes, form always follows ecological function."
                </p>
                <div className="flex items-center gap-1.5 pt-0.5 text-[10px] font-mono text-slate-300 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                    Avatar = Symbolic Vision
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                    Deployment = Functional Optimization
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-2.5">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  The Four Environmental Pillars
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Clean Toxic Sites:</strong> Phytoremediates dissolved nickel, lead & zinc.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span><strong>Grown Circuitry:</strong> Mineralizes vascular xylem into bio-conductive traces.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Circular Phytomining:</strong> Harvests bio-ores instead of open-pit mining.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Biohybrid Robotics:</strong> Replaces disposable electronics with living sentinels.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prototype Visions & Concept Art Gallery (9 Studies by Dawn) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold text-xs uppercase tracking-wider">
                <ImageIcon className="w-4 h-4" />
                <span>Prototype Visions & Concept Studies (Dawn’s 9 Morphological Blueprints)</span>
              </div>
              <button
                onClick={() => onNavigateTab('blueprints')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Blueprint Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Explore Dawn's 9 visual studies demonstrating living plant biobots, in-situ soil circuit slabs, modular CAD molds, and aerial canopy guardians:
            </p>

            {/* Horizontal Scrollable / Grid Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              {[
                { title: 'Living Plant Biobot', file: '/prototypes/plant_biobot.jpg', cat: 'Living Bio-Hybrid' },
                { title: 'Grown Circuit Tablet', file: '/prototypes/grown_tablet.jpg', cat: 'Grown Circuitry' },
                { title: 'Field CAD Architecture', file: '/prototypes/dawn_field_cad.jpg', cat: 'CAD Molds' },
                { title: 'Modular Soil Blocks', file: '/prototypes/scientist_modular.jpg', cat: 'Phase 1 Modularity' },
                { title: 'Biohybrid Agro-Farm', file: '/prototypes/phytomining_landscape.jpg', cat: 'Full System' },
                { title: 'Phytomining Harvest', file: '/prototypes/phytomining_harvest.jpg', cat: 'Bio-Ore Recovery' },
                { title: 'Machine Forest Guardian', file: '/prototypes/guardian_machine_forest.jpg', cat: 'Solar Aerial Sentinel' },
                { title: 'Mythic Bridge of Worlds', file: '/prototypes/mythic_bridge.jpg', cat: 'Cultural Synthesis' },
                { title: 'Industrial Ruin Cloche', file: '/prototypes/bridge_terrarium.jpg', cat: 'Field Sentinel' }
              ].map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateTab('blueprints')}
                  className="rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-400 bg-slate-950 group cursor-pointer transition-all shadow-md flex flex-col"
                >
                  <div className="relative h-28 overflow-hidden bg-slate-900">
                    <img
                      src={p.file}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-slate-800 backdrop-blur-sm">
                      {p.cat}
                    </span>
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-white group-hover:text-cyan-300 line-clamp-1">
                      {p.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
                      <span>Inspect</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: How We Are Working Toward Making Her Real */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-mono font-semibold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>2. The Engineering Pathway: How We Are Making Her Real</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              From Phase Zero Observation to Working Field Prototype
            </h3>
            <p className="text-slate-300 max-w-4xl">
              We are not jumping blindly into complex robotics. In alignment with engineer <strong>Chrislance</strong>, designer <strong>Clément S (ONMOTIO London)</strong>, engineer <strong>Precious M</strong>, and project manager <strong>Ahmed Ali</strong>, we are executing a rigorous, stepped scientific roadmap:
            </p>

            {/* Stepped Workflow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              
              {/* Step 1: Active Phase 0 */}
              <div 
                onClick={() => onNavigateTab('observations')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-400">STAGE 01 // ACTIVE</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Current</span>
                </div>
                <h4 className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                  Phase 0 Baseline Observation
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Real mustard plant (<em>Brassica juncea</em>) pilot. Proven <strong>r = +0.89 correlation</strong> between soil moisture and leaf angle, with +17° rehydration recovery in 90 minutes.
                </p>
                <div className="pt-1 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span>Inspect Data Log</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Step 2: Electrophysiology & AFE */}
              <div 
                onClick={() => onNavigateTab('simulator')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-400">STAGE 02 // HARDWARE</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Design</span>
                </div>
                <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                  Analog Front-End & Biopotentials
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  With Chrislance & Precious M: Ultra-high impedance (&gt; 10¹² Ω) INA128 instrumentation amp, 60Hz notch filter, and ESP32-S3 DAQ to capture microvolt signals without tissue damage.
                </p>
                <div className="pt-1 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span>Open Signal Scope</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Step 3: CAD Guided Molds */}
              <div 
                onClick={() => onNavigateTab('blueprints')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-teal-400">STAGE 03 // PROTOTYPE</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">CAD</span>
                </div>
                <h4 className="font-bold text-white text-xs group-hover:text-teal-300 transition-colors">
                  Guided-Growth Mold Scaffolds
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  With Clément S (ONMOTIO): 8 CAD concept files detailing 0.8mm xylem micro-channel molds, perforated growth vessels, and floating wetland collars for stormwater basins.
                </p>
                <div className="pt-1 text-[11px] font-mono text-teal-400 flex items-center gap-1">
                  <span>View CAD Blueprints</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Step 4: Grant Funding & Rollout */}
              <div 
                onClick={() => onNavigateTab('grants')}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-400">STAGE 04 // CAPITAL</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Grants</span>
                </div>
                <h4 className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                  Water Quality & Energy Funding
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Targeting WA Dept of Ecology ($75k–$250k stormwater sentinels), WA Clean Energy Fund ($50k–$150k), and NSF STTR ($275k) with ready-to-submit grant dossiers.
                </p>
                <div className="pt-1 text-[11px] font-mono text-amber-400 flex items-center gap-1">
                  <span>Explore Grant Dossiers</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>

          {/* Quick Nav Shortcut Pills */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Explore Workbench Subsystems:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                📊 Environmental Dashboard
              </button>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] transition-colors cursor-pointer"
              >
                📈 Bio-Correlation Analytics
              </button>
              <button
                onClick={() => onNavigateTab('observations')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                🌱 Mustard Plant Log
              </button>
              <button
                onClick={() => onNavigateTab('simulator')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                ⚡ Electrophysiology Scope
              </button>
              <button
                onClick={() => onNavigateTab('blueprints')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                📐 CAD Molds & Housings
              </button>
              <button
                onClick={() => onNavigateTab('grants')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                📑 WA & NSF Grants
              </button>
              <button
                onClick={() => onNavigateTab('collaboration')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer"
              >
                🤝 Team & Partners
              </button>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
