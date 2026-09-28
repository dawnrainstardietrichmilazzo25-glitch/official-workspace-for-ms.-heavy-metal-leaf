import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  DollarSign,
  Briefcase,
  FileCheck,
  Share2
} from 'lucide-react';
import { CollaborationMilestone } from '../../types';
import { COLLABORATION_MILESTONES } from '../../data/mockData';

export const CollaborationLogTab: React.FC = () => {
  const [copiedUpdate, setCopiedUpdate] = useState(false);
  const [activePartner, setActivePartner] = useState<'chrislance' | 'ahmed_ali' | 'wa_team'>('chrislance');

  const draftFiverrReplyChrislance = `Hi Chris,

Thanks for checking in! Securing funding has been taking most of my focus, but the mustard plants have given us some really compelling preliminary data.

Here is an update on both the mustard observations and the funding applications:

1. Mustard Plant Pilot (Indoor vs. Outdoor Baseline):
- The indoor cohort under 16h LED has grown from 42mm to 98mm with consistent petiole nyctinasty.
- We completed a 48-hour controlled dry-down trial: leaf angle dropped from +38° to +25°, and upon rewatering with 100ml, leaves rebounded to +42° within 90 minutes.
- When we run the numbers between soil moisture % and leaf angle, there is a strong positive correlation (r = +0.89). This confirms we have a clean, repeatable biomechanical baseline before we hook up the electrodes!

2. Funding Applications & Grant Alignment:
- In addition to the Eco-Tech Microgrant, we are applying to the Washington State Water Quality Combined Funding Program ($75k–$250k) and Clean Energy Fund ($50k–$150k).
- I'm utilizing your 3-layer architecture (Environmental Layer → Plant Response Layer → Analog Front-End / ESP32-S3 DAQ) as the core engineering foundation.
- Reviewers are responding very well to the feasibility framework we defined ("What is the simplest scientifically meaningful experiment to evaluate this concept?").
- You are credited as the Embedded Electronics & Hardware Engineering Lead.

When you have a moment, I'd love your feedback on:
1. Shielding requirements for the high-impedance INA128 AFE during bench tests.
2. Recommended Ag/AgCl non-polarizing gel electrodes that won't damage young mustard petioles.

Looking forward to hearing your thoughts!

Best,
Dawn`;

  const draftReplyAhmedAli = `Hi Ahmed,

Thank you for your follow-up and proposal regarding the Phase Zero feasibility framework.

I've reviewed your proposed 10-day timeline and the $250 USD total compensation structure ($125 upfront / $125 deferred upon securing project grant funding). 

Here is our current progress and scope alignment:
1. Baseline Observations: We now have an active mustard plant observation log with documented +17° rehydration recovery and r = +0.89 correlation between soil moisture and leaf deflection.
2. Concept Artifacts: I have compiled the 8 CAD and blueprint files (guided growth molds, Phase 1 minimalist architecture, floating wetland prototype visualization, and heavy_metal_leaf_v2.1.csv).
3. Grant Applications: We are actively pursuing the Washington State Water Quality Combined Funding Program (Stormwater & Puget Sound Recovery) and the Clean Energy Grants ($50k–$250k tier). These require a collaborative testing team with durable deliverables (protocols, data dashboards, monitoring reports).

Let's proceed with preparing the formal written agreement for the 10-day Phase Zero deliverables:
- Defining candidate sensing pathways & control conditions
- Multi-disciplinary tracking matrix (biology, hydroponics, electronics, DAQ)
- Objective evaluation criteria for Phase 1 transition

Let me know when the agreement draft is ready for signature so we can kick off.

Best regards,
Dawn`;

  const currentDraftMessage = activePartner === 'chrislance' ? draftFiverrReplyChrislance : draftReplyAhmedAli;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(currentDraftMessage);
    setCopiedUpdate(true);
    setTimeout(() => setCopiedUpdate(false), 2500);
  };

  const correspondenceHistory = [
    {
      date: 'Sep 27, 2026',
      speaker: 'Ahmed Ali',
      role: 'R&D Project Manager',
      summary: 'Asked about start date for the 10-day Phase Zero feasibility documentation.',
      quote: 'when we can start btw?'
    },
    {
      date: 'Sep 26, 2026',
      speaker: 'Dawn',
      role: 'Founder & Bio Lead',
      summary: 'Shared 8 blueprint files (CAD mold, Phase 1 architecture, prototype visualization, CSV dataset).',
      quote: '8 Files: _2_Guided_Growth_Mold_CAD_Concept, 6_Minimalist_Blueprint, heavy_metal_leaf_v2.1.csv...'
    },
    {
      date: 'Sep 26, 2026',
      speaker: 'Chrislance',
      role: 'Embedded Hardware Lead',
      summary: 'Reviewed mustard plant photo (IMG_20260925_131314.jpg), endorsed photographic baseline, asked about funding.',
      quote: 'Looking at your current setup, I think we already have a useful starting point... How have the funding applications been progressing?'
    },
    {
      date: 'Sep 17, 2026',
      speaker: 'Ahmed Ali',
      role: 'R&D Project Manager',
      summary: 'Agreed to deferred compensation: $250 total ($125 upfront / $125 deferred upon grant funding) with 10-day timeline.',
      quote: 'I would suggest a $250 USD total compensation for Phase Zero, divided into two parts: $125 USD upfront to begin the work, and the remaining $125 USD deferred until ONMOTIO receives the relevant project funding.'
    },
    {
      date: 'Sep 16, 2026',
      speaker: 'Chrislance',
      role: 'Embedded Hardware Lead',
      summary: 'Formulated the Phase Zero Feasibility Question.',
      quote: 'What is the simplest scientifically meaningful experiment we can perform to determine whether this concept is worth developing further?'
    },
    {
      date: 'Sep 14, 2026',
      speaker: 'Dawn',
      role: 'Founder & Bio Lead',
      summary: 'Outlined Washington Water Quality & Clean Energy grant alignment (non-construction, modular, durable deliverables).',
      quote: 'If you want Ms. Heavy Metal Leaf to fit Water Quality Combined Funding, Stormwater Capacity, Aquatic Invasive, Algae, Puget Sound... then we need to design her realistically, modularly, and as a collaborative testing team.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Multi-Disciplinary Team Hub */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              Collaborative R&D Team Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">Multi-Disciplinary Engineering & Grant Consortium</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Research Collective, Contributor Log & Task Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Coordinating Dawn (Vision, Bio & Grants), Chrislance (Embedded Systems & AFE), and Ahmed Ali (R&D Project Management & Task Breakdown).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://www.linkedin.com/groups/40962056/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>LinkedIn Group</span>
          </a>
          <a
            href="https://www.facebook.com/share/g/1AnMTdNE3b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-md"
          >
            <span>Facebook Collective</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">LEAD APPLICANT</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400">Founder</span>
          </div>
          <h3 className="text-sm font-bold text-white">Dawn (Me)</h3>
          <p className="text-xs text-slate-400 leading-tight">
            Biohybrid concept originator, phytomining direction, mustard plant baseline testing, and grant application coordinator (WA Ecology & Commerce).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-teal-400">HARDWARE CO-LEAD</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-teal-400">Fiverr R&D</span>
          </div>
          <h3 className="text-sm font-bold text-white">Chrislance</h3>
          <p className="text-xs text-slate-400 leading-tight">
            Embedded systems, PCB design, ultra-high impedance Analog Front-End (INA128), 60Hz filtering, and ESP32-S3 DAQ architecture.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400">PROJECT MANAGER</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-400">Fiverr Offer</span>
          </div>
          <h3 className="text-sm font-bold text-white">Ahmed Ali</h3>
          <p className="text-xs text-slate-400 leading-tight">
            Multi-disciplinary project manager. Phase Zero feasibility framework ($250 agreement: $125 upfront / $125 deferred), 10-day work breakdown.
          </p>
        </div>

      </div>

      {/* Main Grid: Milestones & Interactive Communication Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Milestone Tracker */}
        <div className="lg:col-span-2 space-y-5">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Phase 0 to Phase 2 Milestone Roadmap & Deliverables</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Consortium Tasks</span>
            </div>

            <div className="space-y-3">
              {COLLABORATION_MILESTONES.map((m) => {
                const isDone = m.status === 'completed';
                const isInProg = m.status === 'in_progress';

                return (
                  <div 
                    key={m.id}
                    className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                      isInProg
                        ? 'bg-slate-950 border-emerald-500/40 shadow-sm'
                        : isDone
                          ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                          isInProg
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isDone
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-slate-900 text-slate-500'
                        }`}>
                          {m.status.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{m.title}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {m.targetDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Lead: <strong className="text-indigo-300">{m.owner}</strong></span>
                      {m.budgetOrTerms && (
                        <span className="text-emerald-400 font-semibold">{m.budgetOrTerms}</span>
                      )}
                    </div>

                    {/* Deliverables List */}
                    <div className="space-y-1">
                      {m.deliverables.map((d, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <span className={isInProg ? 'text-emerald-400 font-bold' : 'text-slate-500'}>›</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>

                    {/* Milestone Notes */}
                    <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                      Note: {m.notes}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Dialogue Summary */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Key Chronological Dialogue Highlights (Fiverr & Collaboration History)</span>
            </h3>

            <div className="space-y-3">
              {correspondenceHistory.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-indigo-300">{item.speaker} <span className="text-[10px] text-slate-500 font-normal font-mono">({item.role})</span></span>
                    <span className="font-mono text-[11px]">{item.date}</span>
                  </div>
                  <p className="font-medium text-slate-200">{item.summary}</p>
                  <p className="text-[11px] text-slate-400 italic border-l-2 border-slate-700 pl-2 mt-1">
                    "{item.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Ready-to-Send Reply Generator for Chrislance or Ahmed Ali */}
        <div className="space-y-5">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Quick Reply Generator</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Ready to Copy
              </span>
            </div>

            {/* Recipient Switcher */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setActivePartner('chrislance')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activePartner === 'chrislance'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chrislance (Hardware)
              </button>
              <button
                onClick={() => setActivePartner('ahmed_ali')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activePartner === 'ahmed_ali'
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ahmed Ali (PM)
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activePartner === 'chrislance' 
                ? 'Update on the mustard plant baseline (r = +0.89), rehydration recovery, and grant credits:'
                : 'Response to Ahmed regarding the 10-day Phase Zero deliverables and $250 agreement ($125 upfront / $125 deferred):'
              }
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {currentDraftMessage}
            </div>

            <button
              onClick={handleCopyDraft}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-md cursor-pointer ${
                activePartner === 'chrislance'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              }`}
            >
              {copiedUpdate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedUpdate ? 'Copied Message to Clipboard!' : `Copy Reply for ${activePartner === 'chrislance' ? 'Chrislance' : 'Ahmed Ali'}`}</span>
            </button>
          </div>

          {/* Ahmed Ali Agreement Checklist Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>Ahmed Ali: Phase Zero Agreement Scope:</span>
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-0.5">Timeline & Fee</span>
                <p className="text-[11px] text-slate-400">
                  10 Calendar Days. $250 USD total ($125 upfront / $125 deferred upon grant funding).
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-teal-300 block mb-0.5">Phase Zero Scope</span>
                <p className="text-[11px] text-slate-400">
                  Defines experimental design, candidate sensing pathways, sensor/DAQ approach, measurement framework, evaluation criteria, and working demonstrator pathway.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
