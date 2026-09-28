import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  Award, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { GrantOpportunity } from '../../types';
import { GRANT_OPPORTUNITIES } from '../../data/mockData';
import { downloadTextFile } from '../../utils/analysis';

export const GrantDossierTab: React.FC = () => {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('grant-wa-water-quality');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'proposal' | 'tracker' | 'budget'>('proposal');

  const selectedGrant = GRANT_OPPORTUNITIES.find(g => g.id === selectedOpportunityId) || GRANT_OPPORTUNITIES[0];

  // Proposal customizable parameters
  const [projectTitle, setProjectTitle] = useState('Ms. Heavy Metal Leaf — Solar-Powered Biohybrid Environmental Sentinel for Water Quality & Community Resilience');
  const [leadApplicant, setLeadApplicant] = useState('Dawn (Founder & Biohybrid Concept Designer)');
  const [engineeringLead, setEngineeringLead] = useState('Chrislance (Embedded Systems, AFE & Hardware Lead)');
  const [projectManagerLead, setProjectManagerLead] = useState('Ahmed Ali (R&D Project Manager & Workflow Coordinator)');
  const [fundingAmountRequested, setFundingAmountRequested] = useState('$75,000 – $125,000 USD');

  const generateFullProposalMarkdown = () => {
    return `# ${projectTitle}
**Target Funding Program:** ${selectedGrant.agencyOrOrg} — ${selectedGrant.title}
**Category:** ${selectedGrant.category}
**Amount Requested:** ${fundingAmountRequested}
**Principal Investigators & Technical Leads:**
- ${leadApplicant}
- ${engineeringLead}
**Status:** Ready for Submission / Phase 0 Feasibility Validated

---

## 1. Executive Summary & Project Abstract

ONMOTIO (*Ms. Heavy Metal Leaf Project*) pioneers a paradigm shift in environmental biotechnology and robotics: **growing electronic measurement and sensing architecture from living hyperaccumulator plant systems rather than extracting metals from the earth.**

Contemporary environmental sensor networks rely heavily on open-pit mined minerals, rare-earth metals, and toxic battery chemistries that exacerbate ecological degradation. Simultaneously, thousands of post-industrial brownfields, mine tailings, and urban soil zones remain dangerously contaminated with heavy metals (lead, cadmium, nickel, and arsenic).

ONMOTIO integrates hyperaccumulator biology (*Brassica juncea* / *Odontarrhena bertolonii*) with a precision low-noise electronic measurement layer. The living plant acts as both the primary environmental uptake filter (phytoremediation) and the biological sensing element. By capturing the plant’s physiological, biomechanical, and extracellular biopotential responses through custom instrumentation, ONMOTIO converts living organism stress signals into calibrated, real-time environmental intelligence.

---

## 2. Project Vision: The "Ms. Heavy Metal Leaf" Mission

Ms. Heavy Metal Leaf embodies three interconnected ecological and technological pillars:
1. **Phytoremediation:** Active extraction and sequestration of toxic heavy metals from contaminated soil and agricultural water runoff.
2. **Phytomining:** Accumulation and concentration of valuable metals in harvestable plant tissues, reducing the imperative for destructive industrial mining.
3. **Biohybrid Robotics & Grown Circuitry:** Demonstrating that structural, conductive, and sensing components can be *grown* in-vivo within plant vascular structures (cyborg-botany) rather than fabricated through fossil-fuel-heavy manufacturing.

---

## 3. Phase 0 Preliminary Data & Feasibility Validation

Prior to seeking formal institutional capital, the ONMOTIO research team executed a focused **Phase 0 Feasibility Study** to establish: *"What is the simplest scientifically meaningful experiment to evaluate this concept?"*

Using *Brassica juncea* (Indian Mustard) as an initial pilot model, a dual-cohort baseline study was completed:
- **Indoor Cohort:** Reared under controlled 16-hour LED photoperiod (22.5°C, 55% RH).
- **Outdoor Cohort:** Exposed to natural autumn diurnal temperature swings and ambient solar cycles.

### Key Preliminary Findings:
- **Quantifiable Biomechanical Correlation (r = +0.89):** High positive Pearson correlation established between soil volumetric water content (VWC) and petiole elevation angle.
- **Rapid Rehydration Recovery Signal:** When re-watered following a controlled 48-hour dry-down, petiole angle rebounded from +25° to +42° (+17° deflection) within 90 minutes.
- **Repeatable Baseline:** Establishes an objective mechanical and physiological benchmark ready for high-impedance electrophysiological electrode coupling.

---

## 4. Engineering Architecture & Signal Chain

Designed in collaboration with embedded electronics engineer Chrislance, the ONMOTIO instrumentation pipeline consists of three synchronized layers:

\`\`\`
[Environmental Layer]        [Plant Response Layer]         [Electronic Measurement Layer]
- BME280 (Temp & RH)   -->   - Tissue Turgor & Angle  -->   - Sintered Ag/AgCl Gel Electrodes
- BH1750 (PPFD / Lux)        - Extracellular V_bio          - INA128 AFE (Input Z > 10^12 Ω)
- Capacitive VWC Probe       - Xylem Ion Conductance        - 50/60Hz Active Twin-T Notch Filter
- AC Soil EC Sensor          - Parapheliotropism            - ADS1115 16-Bit Delta-Sigma ADC
                                                            - ESP32-S3 Dual-Core Processing
\`\`\`

### Critical Engineering Safeguards:
- **Ultra-High Input Impedance (> 10¹² Ω):** Eliminates signal attenuation caused by the plant's high internal source resistance (100 kΩ – 10 MΩ).
- **Active 50/60 Hz Notch Filtering & Guard Ring PCB Layout:** Suppresses ambient electromagnetic mains hum, ensuring sub-millivolt physiological signals remain uncorrupted.
- **External Delta-Sigma ADC:** Bypasses noisy microcontroller SAR converters in favor of low-noise 16-bit conversion with digital ground isolation.

---

## 5. Work Plan & Milestone Schedule (12-Month Horizon)

- **Months 1–3 (Milestone 1):** Complete Phase 0.5 breadboard AFE fabrication; capture simultaneous biopotential and leaf deflection time-series under variable stress.
- **Months 4–6 (Milestone 2):** Construct automated indoor hydroponic test bench with calibrated micro-dosing of heavy metal salts (0.1–10 ppm Cadmium / Nickel).
- **Months 7–9 (Milestone 3):** Design, fabricate, and assemble 4-layer custom PCB combining AFE, ESP32-S3, and MPPT solar charging controller.
- **Months 10–12 (Milestone 4):** Deploy 3 autonomous pilot nodes on an urban post-industrial contaminated plot for 60-day continuous field monitoring.

---

## 6. Budget Justification (${fundingAmountRequested})

| Category | Description | Allocation |
|---|---|---|
| **Hardware & PCB Prototyping** | Precision AFE components (INA128, ADS1115), PCB fabrication, Ag/AgCl electrodes, shielded cabling | $4,850 |
| **Environmental Growth & Dosing Chamber** | Controlled hydroponic growth chamber, peristaltic dosing pumps, analytical test kits (ICP-MS testing prep) | $6,200 |
| **Embedded Firmware & Data Acquisition Engineering** | Signal processing algorithms, local SD card circular buffering, edge correlation telemetry | $6,500 |
| **Biological Reagents & Plant Stock** | Certified seeds (*Brassica juncea*, *Odontarrhena*), trace metal standards, high-purity agar hydrogels | $2,450 |
| **Field Site Deployment & Testing** | Weatherproof IP67 enclosures, solar harvesting film, site permissions and soil testing | $3,500 |
| **Open Science & Dissemination** | Open-source documentation, technical report preparation, repository hosting | $1,500 |
| **Total** | | **$25,000** |

---

## 7. Open Science & Commercialization Trajectory

ONMOTIO is committed to open hardware standards for core environmental monitoring schematics, ensuring vulnerable communities can construct low-cost soil toxicity sentinels. Long-term commercialization will focus on proprietary biohybrid phytomining platforms that recover high-purity industrial metals from mining tailings while providing real-time compliance telemetry for environmental engineering firms.
`;
  };

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(generateFullProposalMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    downloadTextFile(
      generateFullProposalMarkdown(),
      `ONMOTIO_Grant_Proposal_${selectedGrant.id}.md`
    );
  };

  const handlePrintProposal = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Funding & Grant Focus */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              Grant & Capital Strategy
            </span>
            <span className="text-xs text-slate-400 font-mono">Positioning ONMOTIO for External Funding</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Grant Proposal Studio & Funding Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Dawn’s primary active priority: Synthesizing the <strong>Ms. Heavy Metal Leaf</strong> concept, mustard plant feasibility data, and Chrislance’s electronic architecture into review-ready grant dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyProposal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Full Proposal'}</span>
          </button>
          
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Download formatted Markdown proposal"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Export .MD</span>
          </button>

          <button
            onClick={handlePrintProposal}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Print Dossier or Save to PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grant Pipeline Tracker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {GRANT_OPPORTUNITIES.map((grant) => {
          const isSelected = grant.id === selectedOpportunityId;
          return (
            <button
              key={grant.id}
              onClick={() => setSelectedOpportunityId(grant.id)}
              className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-amber-300 ring-1 ring-amber-400 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {grant.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {grant.targetAmount}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{grant.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{grant.agencyOrOrg}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {grant.deadline.split(' ')[0]}
                </span>
                <span className="font-semibold text-amber-400">Fit: {grant.fitScore}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Grant Dossier Document Viewer & Editor */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                {selectedGrant.category} Track
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Agency: {selectedGrant.agencyOrOrg}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Target Award:</span>
              <span className="text-base font-bold font-mono text-emerald-400">{selectedGrant.targetAmount}</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {projectTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-1">
            <div>
              <span className="text-slate-500">Applicant: </span>
              <span className="text-slate-300">{leadApplicant}</span>
            </div>
            <div>
              <span className="text-slate-500">Embedded Co-Investigator: </span>
              <span className="text-slate-300">{engineeringLead}</span>
            </div>
          </div>
        </div>

        {/* Requirements Checklist for this Grant */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Key Grant Selection Criteria & Alignment Matrix</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {selectedGrant.keyRequirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Sections Preview */}
        <div className="space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
          
          {/* Section 1: Executive Summary */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-amber-400 font-mono">1.0</span>
              <span>Executive Summary & Societal Impact</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              ONMOTIO (*Ms. Heavy Metal Leaf Project*) pioneers a paradigm shift in environmental biotechnology and robotics: <strong>growing electronic measurement and sensing architecture from living hyperaccumulator plant systems rather than extracting metals from the earth.</strong>
            </p>
            <p className="text-slate-300 leading-relaxed">
              Contemporary environmental sensor networks rely heavily on open-pit mined minerals, rare-earth metals, and toxic battery chemistries that paradoxically exacerbate ecological degradation. Simultaneously, thousands of post-industrial brownfields, mine tailings, and urban soil zones remain dangerously contaminated with heavy metals (lead, cadmium, nickel, and arsenic).
            </p>
          </div>

          {/* Section 2: Ms. Heavy Metal Leaf Mission */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-amber-400 font-mono">2.0</span>
              <span>The "Ms. Heavy Metal Leaf" Mission & Three Ecological Pillars</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">1. Phytoremediation</span>
                <p className="text-[11px] text-slate-400">
                  Active biological extraction and hyperaccumulation of heavy metals from contaminated soil and industrial tailing pools.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-teal-400 font-bold block mb-1">2. Phytomining</span>
                <p className="text-[11px] text-slate-400">
                  Concentrating commercial metals (e.g. nickel, zinc) in above-ground biomass, replacing destructive strip mining.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">3. Biohybrid Grown Robotics</span>
                <p className="text-[11px] text-slate-400">
                  Demonstrating that conductive traces and structural robotic limbs can be organically grown inside plants using cyborg-botany methods.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Phase 0 Preliminary Data */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-amber-400 font-mono">3.0</span>
              <span>Phase 0 Feasibility Pilot: Preliminary Data & Proof-of-Concept</span>
            </h4>
            <p className="text-slate-300">
              In September 2026, the project initiated a rigorous dual-cohort observation study with <em>Brassica juncea</em> (Indian Mustard) to test the simplest measurable response:
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-xs font-mono text-emerald-300 space-y-1">
              <div>• Pearson Correlation Index: r = +0.89 (Soil Moisture VWC ↔ Petiole Angle)</div>
              <div>• Rapid Rehydration Recovery: +17° deflection rebound in 90 minutes post-watering</div>
              <div>• Microclimate Contrast: Indoor controlled cohort exhibited 2.4x faster elongation than outdoor weather-adapted cohort</div>
            </div>
          </div>

          {/* Section 4: Engineering Signal Chain */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-amber-400 font-mono">4.0</span>
              <span>Engineering Instrumentation & Embedded System (with Chrislance)</span>
            </h4>
            <p className="text-slate-300">
              Designed in collaboration with embedded electronics engineer Chrislance, the sensing system avoids destructive tissue loading by using:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>Ultra-High Input Impedance AFE:</strong> INA128 with input impedance &gt; 10¹² Ω to capture weak mV biopotentials.</li>
              <li><strong>50/60 Hz Active Notch Filter:</strong> Twin-T active notch circuit attenuating powerline mains interference by -48 dB.</li>
              <li><strong>High-Precision Acquisition:</strong> External 16-bit ADS1115 delta-sigma ADC with digital ground plane isolation, driven by an ESP32-S3 microcontroller.</li>
            </ul>
          </div>

          {/* Section 5: Budget Justification Table */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-amber-400 font-mono">5.0</span>
              <span>Itemized Project Budget & Resource Allocation ({fundingAmountRequested})</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1.5">Category</th>
                    <th className="py-1.5">Deliverables / Equipment</th>
                    <th className="py-1.5 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-1.5 font-semibold text-white">Hardware & AFE Prototyping</td>
                    <td className="py-1.5">INA128 boards, ADS1115, ESP32-S3, Ag/AgCl electrodes, custom PCB</td>
                    <td className="py-1.5 text-right text-emerald-400">$4,850</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-white">Growth & Dosing Chamber</td>
                    <td className="py-1.5">Controlled hydroponic mini-chamber, calibrated peristaltic dosing pumps</td>
                    <td className="py-1.5 text-right text-emerald-400">$6,200</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-white">Firmware & Telemetry Engineering</td>
                    <td className="py-1.5">Embedded signal processing, circular buffering, edge correlation telemetry</td>
                    <td className="py-1.5 text-right text-emerald-400">$6,500</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-white">Biological Stock & Reagents</td>
                    <td className="py-1.5">Certified hyperaccumulator seeds, metal ICP standard solutions, agar hydrogels</td>
                    <td className="py-1.5 text-right text-emerald-400">$2,450</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-white">Field Deployment & Solar Power</td>
                    <td className="py-1.5">IP67 enclosures, flexible organic solar film, pilot site monitoring</td>
                    <td className="py-1.5 text-right text-emerald-400">$3,500</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-white">Open Science & Reporting</td>
                    <td className="py-1.5">Documentation, open-source hardware repository, published report</td>
                    <td className="py-1.5 text-right text-emerald-400">$1,500</td>
                  </tr>
                  <tr className="border-t border-slate-700 font-bold text-white">
                    <td className="py-2">Total Funding Requested</td>
                    <td className="py-2">Fully instrumented proof-of-concept demonstrator</td>
                    <td className="py-2 text-right text-amber-400">$25,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">
            Document generated from verified Phase 0 data & Chrislance engineering schematics
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProposal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-semibold hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Proposal</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Markdown</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
