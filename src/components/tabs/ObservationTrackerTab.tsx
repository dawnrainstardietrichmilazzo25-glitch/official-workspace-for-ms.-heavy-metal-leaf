import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Compass, 
  Plus, 
  Filter, 
  Camera, 
  TrendingUp, 
  Info,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { PlantObservation, PlantGroup } from '../../types';
import { calculatePearsonCorrelation, exportToCsv } from '../../utils/analysis';

interface ObservationTrackerTabProps {
  observations: PlantObservation[];
  onAddObservation: (obs: Omit<PlantObservation, 'id'>) => void;
  onOpenQuickLogModal?: () => void;
}

export const ObservationTrackerTab: React.FC<ObservationTrackerTabProps> = ({
  observations,
  onAddObservation
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | PlantGroup>('all');
  const [showLogModal, setShowLogModal] = useState(false);

  // New observation form state
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [group, setGroup] = useState<PlantGroup>('indoor');
  const [temperatureC, setTemperatureC] = useState(22.5);
  const [humidityPct, setHumidityPct] = useState(55);
  const [lightLux, setLightLux] = useState(8500);
  const [soilMoisturePct, setSoilMoisturePct] = useState(50);
  const [soilEcUscm, setSoilEcUscm] = useState(320);
  const [leafAngleDeg, setLeafAngleDeg] = useState(35);
  const [stemHeightMm, setStemHeightMm] = useState(70);
  const [stressScore, setStressScore] = useState(1);
  const [notes, setNotes] = useState('');
  const [phenotypeInput, setPhenotypeInput] = useState('Active Growth, High Turgor');

  const filteredObservations = useMemo(() => {
    if (selectedGroup === 'all') return observations;
    return observations.filter(o => o.group === selectedGroup);
  }, [observations, selectedGroup]);

  // Compute stats & Pearson correlation between Soil Moisture and Leaf Angle
  const correlationAnalysis = useMemo(() => {
    const indoorObs = observations.filter(o => o.group === 'indoor');
    const outdoorObs = observations.filter(o => o.group === 'outdoor');

    const indoorMoisture = indoorObs.map(o => o.soilMoisturePct);
    const indoorAngle = indoorObs.map(o => o.leafAngleDeg);
    const rIndoor = calculatePearsonCorrelation(indoorMoisture, indoorAngle);

    const outdoorMoisture = outdoorObs.map(o => o.soilMoisturePct);
    const outdoorAngle = outdoorObs.map(o => o.leafAngleDeg);
    const rOutdoor = calculatePearsonCorrelation(outdoorMoisture, outdoorAngle);

    const allMoisture = observations.map(o => o.soilMoisturePct);
    const allAngle = observations.map(o => o.leafAngleDeg);
    const rAll = calculatePearsonCorrelation(allMoisture, allAngle);

    return { rIndoor, rOutdoor, rAll };
  }, [observations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const markers = phenotypeInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onAddObservation({
      date,
      time,
      group,
      temperatureC: Number(temperatureC),
      humidityPct: Number(humidityPct),
      lightLux: Number(lightLux),
      soilMoisturePct: Number(soilMoisturePct),
      soilEcUscm: Number(soilEcUscm),
      leafAngleDeg: Number(leafAngleDeg),
      stemHeightMm: Number(stemHeightMm),
      stressScore: Number(stressScore),
      notes: notes || 'Routine baseline observation recorded.',
      phenotypeMarkers: markers.length > 0 ? markers : ['Turgid', 'Healthy']
    });

    setShowLogModal(false);
    setNotes('');
  };

  const handleExportCsv = () => {
    exportToCsv(observations, `ONMOTIO_Mustard_Observations_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Chrislance & Dawn's Phase 0 Agreement */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Phase 0 Feasibility Pilot
            </span>
            <span className="text-xs text-slate-400 font-mono">Platform: Brassica juncea (Indian Mustard)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Dual-Cohort Baseline: Indoor (Controlled LED) vs. Outdoor (Ambient Weather)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Testing Chrislance’s core hypothesis: <em>“What is the simplest scientifically meaningful experiment to perform?”</em>
            — Verifying that plant biomechanics (leaf angle & turgor rebound) objectively track soil moisture and diurnal cycles before deploying complex electrode instrumentation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Observation</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Download full observation dataset"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Analytical KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Soil Moisture Correlation</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">r = {correlationAnalysis.rIndoor}</span>
            <span className="text-xs text-emerald-300 font-mono">Indoor Batch</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            High positive Pearson correlation between soil moisture % and leaf elevation angle.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Indoor Growth Elongation</span>
            <Sprout className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">42 → 98</span>
            <span className="text-xs text-teal-400 font-mono">mm (+133%)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Fast vegetative growth under 16h LED cycle. Optimal for repeatable tissue electrode tests.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Turgor Recovery Signal</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">+17°</span>
            <span className="text-xs text-slate-400 font-mono">rebound in 90m</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Sep 28 rewatering test verified rapid, repeatable angle deflection without damaging the plant.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Outdoor Ambient Delta</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-300">Δ 9.6°C</span>
            <span className="text-xs text-slate-400 font-mono">weather swing</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Autumn chill slowed outdoor cohort elongation; validates indoor chamber for Phase 0 DAQ.
          </p>
        </div>

      </div>

      {/* Visual Comparison Trend Chart (SVG Responsive) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Comparative Time-Series: Leaf Elevation Angle (°) vs. Soil Moisture (%)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking diurnal nyctinasty and moisture-induced mechanical deflections (Sep 15 - Sep 28)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Indoor Leaf Angle (°)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="text-slate-300">Indoor Moisture (%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Outdoor Leaf Angle (°)</span>
            </span>
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="w-full h-56 sm:h-64 bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="190" x2="800" y2="190" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />

            {/* Axis labels */}
            <text x="10" y="35" fill="#64748b" fontSize="10" fontFamily="monospace">80% / 50° (High Turgor)</text>
            <text x="10" y="135" fill="#64748b" fontSize="10" fontFamily="monospace">40% / 25° (Stress Threshold)</text>
            <text x="10" y="215" fill="#64748b" fontSize="10" fontFamily="monospace">10% / 0° (Severe Droop)</text>

            {/* Indoor Soil Moisture Line (Cyan) */}
            <path
              d="M 60 70 L 220 110 L 380 130 L 540 160 L 700 85"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />

            {/* Indoor Leaf Angle Line (Emerald) */}
            <path
              d="M 60 90 L 220 70 L 380 75 L 540 145 L 700 65"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
            />

            {/* Outdoor Leaf Angle Line (Amber) */}
            <path
              d="M 60 110 L 220 155 L 380 145 L 540 125 L 700 135"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />

            {/* Key Data Point Markers */}
            <circle cx="60" cy="90" r="4" fill="#10b981" />
            <circle cx="220" cy="70" r="4" fill="#10b981" />
            <circle cx="380" cy="75" r="4" fill="#10b981" />
            <circle cx="540" cy="145" r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
            <circle cx="700" cy="65" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />

            <circle cx="60" cy="110" r="4" fill="#f59e0b" />
            <circle cx="220" cy="155" r="4" fill="#f59e0b" />
            <circle cx="380" cy="145" r="4" fill="#f59e0b" />
            <circle cx="540" cy="125" r="4" fill="#f59e0b" />
            <circle cx="700" cy="135" r="4" fill="#f59e0b" />

            {/* Timeline ticks */}
            <text x="60" y="235" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Sep 15</text>
            <text x="220" y="235" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Sep 18</text>
            <text x="380" y="235" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Sep 22</text>
            <text x="540" y="235" fill="#f87171" fontSize="10" fontFamily="monospace" textAnchor="middle">Sep 25 (Dry-Down)</text>
            <text x="700" y="235" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">Sep 28 (Rebound)</text>
          </svg>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Key Finding: 48h water withholding induced a 15° drop; rehydration triggered a 17° recovery within 90 minutes.</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">Baseline ready for AFE biopotential coupling</span>
        </div>
      </div>

      {/* Dawn & Chrislance Collaboration Snapshot: IMG_20260925_131314.jpg */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center gap-5">
        <div className="relative w-full md:w-56 h-44 rounded-xl bg-slate-950 border border-slate-700/80 overflow-hidden flex items-center justify-center shrink-0 group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
          {/* Stylized Mustard Plant Graphic representation */}
          <div className="relative z-0 text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950">
              <Sprout className="w-9 h-9" />
            </div>
            <p className="text-[11px] font-mono text-emerald-400">Brassica juncea</p>
          </div>
          <div className="absolute bottom-2 left-2 z-20">
            <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 border border-slate-700">
              IMG_20260925_131314.jpg
            </span>
          </div>
          <span className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-700/60 text-[10px] text-emerald-400 font-mono">
            4.56 MB
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Photographic Evidence Log (Shared with Chrislance on Fiverr)</h4>
            <span className="text-xs font-mono text-slate-500">Sep 26, 2026</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dawn shared the current outdoor mustard plant setup with Chrislance while managing funding applications. Chrislance reviewed the image and confirmed: <em>“Looking at your current setup, I think we already have a useful starting point. We don't necessarily need sophisticated equipment to begin documenting the plants. Even simple observations of their growth, leaf orientation, light exposure, and environmental conditions could help us identify which measurements are worth investigating further.”</em>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Stocky Stems
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Thickened Cuticle
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Petiole Rigidity
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Recommended: Angle-bracket camera mount
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Observation List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter By Environment:</span>
            <div className="flex items-center gap-1.5">
              {(['all', 'indoor', 'outdoor'] as const).map(grp => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                    selectedGroup === grp
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  {grp === 'all' ? 'All Cohorts' : `${grp} Cohort`}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing {filteredObservations.length} of {observations.length} observations
          </span>
        </div>

        {/* Observation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredObservations.map((obs) => {
            const isIndoor = obs.group === 'indoor';
            return (
              <div 
                key={obs.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded font-mono ${
                      isIndoor 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isIndoor ? 'Indoor (Controlled LED)' : 'Outdoor (Ambient)'}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {obs.date} {obs.time}
                    </span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    obs.stressScore === 1 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : obs.stressScore === 2 
                        ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    Stress: {obs.stressScore}/5
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 text-center bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temp / RH</span>
                    <span className="font-mono text-slate-200 font-medium">{obs.temperatureC}°C</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{obs.humidityPct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Light Lux</span>
                    <span className="font-mono text-amber-300 font-medium">{obs.lightLux.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">lx</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Soil VWC</span>
                    <span className="font-mono text-cyan-400 font-medium">{obs.soilMoisturePct}%</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{obs.soilEcUscm ?? 300} µS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Leaf Angle</span>
                    <span className={`font-mono font-bold ${obs.leafAngleDeg >= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {obs.leafAngleDeg > 0 ? `+${obs.leafAngleDeg}°` : `${obs.leafAngleDeg}°`}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">{obs.stemHeightMm} mm</span>
                  </div>
                </div>

                {/* Notes */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {obs.notes}
                </p>

                {/* Phenotype markers */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/60">
                  {obs.phenotypeMarkers.map((marker, i) => (
                    <span 
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      #{marker}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Record Observation Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  <span>Log New Mustard Plant Observation</span>
                </h3>
                <p className="text-xs text-slate-400">Record environmental metrics and biomechanical plant responses</p>
              </div>
              <button 
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Cohort Group</label>
                  <select
                    value={group}
                    onChange={e => setGroup(e.target.value as PlantGroup)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="indoor">Indoor (Controlled LED)</option>
                    <option value="outdoor">Outdoor (Ambient Weather)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Environmental Metrics */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
                <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] block">
                  1. Environmental Layer Inputs
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperatureC}
                      onChange={e => setTemperatureC(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Humidity (%)</label>
                    <input
                      type="number"
                      value={humidityPct}
                      onChange={e => setHumidityPct(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Light (Lux)</label>
                    <input
                      type="number"
                      value={lightLux}
                      onChange={e => setLightLux(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Soil Moisture (%)</label>
                    <input
                      type="number"
                      value={soilMoisturePct}
                      onChange={e => setSoilMoisturePct(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Plant Biomechanical Responses */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
                <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px] block">
                  2. Plant Response Layer (Measurable Variables)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-0.5">Leaf Angle (° from horiz)</label>
                    <input
                      type="number"
                      value={leafAngleDeg}
                      onChange={e => setLeafAngleDeg(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500">e.g. +40° upright, -10° droop</span>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Stem Height (mm)</label>
                    <input
                      type="number"
                      value={stemHeightMm}
                      onChange={e => setStemHeightMm(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-0.5">Stress Score (1-5)</label>
                    <select
                      value={stressScore}
                      onChange={e => setStressScore(parseInt(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white"
                    >
                      <option value="1">1 - Optimal Turgor & Green</option>
                      <option value="2">2 - Mild Dry/Cold Adaptation</option>
                      <option value="3">3 - Moderate Wilting</option>
                      <option value="4">4 - Severe Drought Stress</option>
                      <option value="5">5 - Senescence / Necrosis</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Markers & Notes */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Phenotype Tags (comma-separated)</label>
                <input
                  type="text"
                  value={phenotypeInput}
                  onChange={e => setPhenotypeInput(e.target.value)}
                  placeholder="e.g. Turgid, Rapid Elongation, Parapheliotropism"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Experimental Observations & Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Describe physiological changes, rewatering reactions, leaf movement, or electrode site condition..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
                >
                  Save Log Entry
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
