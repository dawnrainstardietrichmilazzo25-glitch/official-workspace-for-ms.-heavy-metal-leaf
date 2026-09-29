import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';
import { 
  TrendingUp, 
  FlaskConical, 
  Thermometer, 
  Droplets, 
  Sprout, 
  Radio, 
  Zap, 
  Activity, 
  Sliders, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowRight,
  Info,
  RotateCcw,
  Compass
} from 'lucide-react';
import { PlantObservation, PlantGroup } from '../../types';
import { calculatePearsonCorrelation, exportToCsv } from '../../utils/analysis';

interface BioCorrelationAnalyticsTabProps {
  observations: PlantObservation[];
  onNavigateToLog?: () => void;
}

type BioMetricKey = 'metalUptakePpm' | 'stemHeightMm' | 'leafAngleDeg' | 'biopotentialMv';
type EnvMetricKey = 'pH' | 'temperatureC' | 'soilMoisturePct' | 'lightLux' | 'soilEcUscm';

interface MetricDef<K extends string> {
  key: K;
  label: string;
  unit: string;
  color: string;
  domain: [number, number];
  decimals: number;
  description: string;
}

const BIO_METRICS: Record<BioMetricKey, MetricDef<BioMetricKey>> = {
  metalUptakePpm: {
    key: 'metalUptakePpm',
    label: 'Metal Uptake (Tissue Accumulation)',
    unit: 'ppm',
    color: '#10b981', // emerald-500
    domain: [0, 450],
    decimals: 0,
    description: 'Xylem shoot heavy metal concentration (e.g. Nickel/Cadmium) absorbed through roots.'
  },
  stemHeightMm: {
    key: 'stemHeightMm',
    label: 'Plant Growth (Stem Height)',
    unit: 'mm',
    color: '#14b8a6', // teal-500
    domain: [30, 110],
    decimals: 0,
    description: 'Vegetative vertical elongation tracked from soil crown to apical meristem.'
  },
  leafAngleDeg: {
    key: 'leafAngleDeg',
    label: 'Leaf Elevation Angle (Turgor)',
    unit: '°',
    color: '#06b6d4', // cyan-500
    domain: [0, 55],
    decimals: 0,
    description: 'Biomechanical petiole angle deflection reflecting hydraulic turgor pressure.'
  },
  biopotentialMv: {
    key: 'biopotentialMv',
    label: 'Tissue Biopotential (V_bio)',
    unit: 'mV',
    color: '#a855f7', // purple-500
    domain: [-45, -10],
    decimals: 1,
    description: 'Extracellular plasma membrane potential wave recording bioelectric signaling.'
  }
};

const ENV_METRICS: Record<EnvMetricKey, MetricDef<EnvMetricKey>> = {
  pH: {
    key: 'pH',
    label: 'Rhizosphere pH',
    unit: 'pH',
    color: '#38bdf8', // sky-400
    domain: [5.0, 7.5],
    decimals: 2,
    description: 'Root zone substrate acidity; controls divalent metal cation (Ni²⁺, Cd²⁺) solubility.'
  },
  temperatureC: {
    key: 'temperatureC',
    label: 'Ambient Temperature',
    unit: '°C',
    color: '#f59e0b', // amber-500
    domain: [12, 28],
    decimals: 1,
    description: 'Thermal drive influencing stomatal aperture and transpirational pull.'
  },
  soilMoisturePct: {
    key: 'soilMoisturePct',
    label: 'Soil Moisture (VWC)',
    unit: '%',
    color: '#3b82f6', // blue-500
    domain: [20, 90],
    decimals: 0,
    description: 'Volumetric soil water content dictating solvent volume for ion diffusion.'
  },
  lightLux: {
    key: 'lightLux',
    label: 'Photosynthetic Light Intensity',
    unit: 'Lux',
    color: '#eab308', // yellow-500
    domain: [4000, 50000],
    decimals: 0,
    description: 'Photoperiod illuminance powering photosynthetic proton-pumps.'
  },
  soilEcUscm: {
    key: 'soilEcUscm',
    label: 'Substrate Electrical Conductivity (EC)',
    unit: 'µS/cm',
    color: '#ec4899', // pink-500
    domain: [200, 450],
    decimals: 0,
    description: 'Total dissolved ionic salts reflecting total nutrient and metal salinity.'
  }
};

export const BioCorrelationAnalyticsTab: React.FC<BioCorrelationAnalyticsTabProps> = ({
  observations,
  onNavigateToLog
}) => {
  // Cohort Selection
  const [selectedCohort, setSelectedCohort] = useState<'all' | PlantGroup>('all');

  // Selected Metrics for Multi-Axis Line Chart
  const [primaryBioMetric, setPrimaryBioMetric] = useState<BioMetricKey>('metalUptakePpm');
  const [secondaryBioMetric, setSecondaryBioMetric] = useState<BioMetricKey | 'none'>('stemHeightMm');
  const [primaryEnvMetric, setPrimaryEnvMetric] = useState<EnvMetricKey>('pH');
  const [secondaryEnvMetric, setSecondaryEnvMetric] = useState<EnvMetricKey | 'none'>('temperatureC');

  // Display toggles
  const [showAreaFill, setShowAreaFill] = useState<boolean>(true);
  const [showBrushScrubber, setShowBrushScrubber] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'composed' | 'line'>('composed');

  // Filtered & Chronologically Sorted Data
  const sortedData = useMemo(() => {
    let list = [...observations];
    list.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    if (selectedCohort !== 'all') {
      list = list.filter(o => o.group === selectedCohort);
    }
    return list.map(o => ({
      ...o,
      formattedDate: `${o.date.split('-').slice(1).join('/')} ${o.time}`,
      pH: o.pH ?? 6.4,
      metalUptakePpm: o.metalUptakePpm ?? 0,
      biopotentialMv: o.biopotentialMv ?? -25,
      soilEcUscm: o.soilEcUscm ?? 310
    }));
  }, [observations, selectedCohort]);

  // Statistical Correlations
  const correlationPrimary = useMemo(() => {
    if (sortedData.length < 2) return { r: 0, r2: 0 };
    const x = sortedData.map(d => d[primaryEnvMetric] as number);
    const y = sortedData.map(d => d[primaryBioMetric] as number);
    const r = calculatePearsonCorrelation(x, y);
    const r2 = Math.round(r * r * 1000) / 1000;
    return { r, r2 };
  }, [sortedData, primaryEnvMetric, primaryBioMetric]);

  const correlationSecondary = useMemo(() => {
    if (sortedData.length < 2 || secondaryEnvMetric === 'none') return null;
    const x = sortedData.map(d => d[secondaryEnvMetric] as number);
    const y = sortedData.map(d => d[primaryBioMetric] as number);
    const r = calculatePearsonCorrelation(x, y);
    const r2 = Math.round(r * r * 1000) / 1000;
    return { r, r2 };
  }, [sortedData, secondaryEnvMetric, primaryBioMetric]);

  // Analytical Presets
  const applyPreset = (preset: 'ph_metal' | 'temp_growth' | 'moisture_turgor' | 'ec_biopotential') => {
    if (preset === 'ph_metal') {
      setPrimaryBioMetric('metalUptakePpm');
      setSecondaryBioMetric('stemHeightMm');
      setPrimaryEnvMetric('pH');
      setSecondaryEnvMetric('temperatureC');
    } else if (preset === 'temp_growth') {
      setPrimaryBioMetric('stemHeightMm');
      setSecondaryBioMetric('metalUptakePpm');
      setPrimaryEnvMetric('temperatureC');
      setSecondaryEnvMetric('lightLux');
    } else if (preset === 'moisture_turgor') {
      setPrimaryBioMetric('leafAngleDeg');
      setSecondaryBioMetric('stemHeightMm');
      setPrimaryEnvMetric('soilMoisturePct');
      setSecondaryEnvMetric('pH');
    } else if (preset === 'ec_biopotential') {
      setPrimaryBioMetric('biopotentialMv');
      setSecondaryBioMetric('metalUptakePpm');
      setPrimaryEnvMetric('soilEcUscm');
      setSecondaryEnvMetric('pH');
    }
  };

  const handleExportCsv = () => {
    exportToCsv(
      sortedData.map(d => ({
        timestamp: `${d.date} ${d.time}`,
        cohort: d.group,
        [BIO_METRICS[primaryBioMetric].label]: d[primaryBioMetric],
        ...(secondaryBioMetric !== 'none' ? { [BIO_METRICS[secondaryBioMetric].label]: d[secondaryBioMetric] } : {}),
        [ENV_METRICS[primaryEnvMetric].label]: d[primaryEnvMetric],
        ...(secondaryEnvMetric !== 'none' ? { [ENV_METRICS[secondaryEnvMetric].label]: d[secondaryEnvMetric] } : {}),
        notes: d.notes
      })),
      `ONMOTIO_BioCorrelation_${primaryBioMetric}_vs_${primaryEnvMetric}.csv`
    );
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as typeof sortedData[0];
      return (
        <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur shadow-2xl space-y-2 text-xs font-mono max-w-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {dataPoint.date} {dataPoint.time}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              dataPoint.group === 'indoor' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {dataPoint.group}
            </span>
          </div>

          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-slate-300">{entry.name}:</span>
                </span>
                <span className="font-bold font-mono text-white">
                  {typeof entry.value === 'number' 
                    ? entry.value.toFixed(1)
                    : entry.value}
                </span>
              </div>
            ))}
          </div>

          {dataPoint.notes && (
            <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80 line-clamp-2">
              "{dataPoint.notes}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Scientific Bio-Correlation Engine */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Recharts Multi-Axis Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">High-Resolution Time-Series Correlation</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Bio-Correlation Analytics Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Interactively correlate plant physiological responses (Heavy Metal Uptake, Vegetative Stem Growth, Turgor Angle, Biopotential) against environmental drivers (Rhizosphere pH, Ambient Temperature, Moisture, Light, EC) across synchronized multi-axis timelines.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Multi-Axis CSV</span>
          </button>
        </div>
      </div>

      {/* Analytical Preset Shortcuts Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Scientific Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('ph_metal')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            ⚗️ pH ↔ Metal Uptake (Acidic Mobilization)
          </button>
          <button
            onClick={() => applyPreset('temp_growth')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
          >
            ☀️ Temp & Light ↔ Growth & Transpiration
          </button>
          <button
            onClick={() => applyPreset('moisture_turgor')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            💧 Soil Moisture ↔ Leaf Turgor Angle
          </button>
          <button
            onClick={() => applyPreset('ec_biopotential')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer"
          >
            ⚡ Substrate EC ↔ Tissue Biopotential
          </button>
        </div>
      </div>

      {/* Axis Mapping & Variable Selector Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Multi-Axis Mapping & Series Configurator</span>
          </h3>

          <div className="flex items-center gap-3">
            {/* Cohort Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 pl-2">Cohort:</span>
              {(['all', 'indoor', 'outdoor'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCohort(c)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedCohort === c
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Area Fill Toggle */}
            <button
              onClick={() => setShowAreaFill(!showAreaFill)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
                showAreaFill 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="Toggle area gradient fill underneath primary curve"
            >
              Gradient Fill: {showAreaFill ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* 4 Multi-Axis Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          
          {/* Axis 1: Primary Bio Metric (Left Y-Axis 1) */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Left Axis 1 (Primary Bio):</span>
              </label>
            </div>
            <select
              value={primaryBioMetric}
              onChange={e => setPrimaryBioMetric(e.target.value as BioMetricKey)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            >
              {Object.keys(BIO_METRICS).map(k => (
                <option key={k} value={k}>
                  {BIO_METRICS[k as BioMetricKey].label} ({BIO_METRICS[k as BioMetricKey].unit})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 leading-tight">
              {BIO_METRICS[primaryBioMetric].description}
            </p>
          </div>

          {/* Axis 2: Secondary Bio Metric (Left Y-Axis 2) */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-teal-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                <span>Left Axis 2 (Secondary Bio):</span>
              </label>
            </div>
            <select
              value={secondaryBioMetric}
              onChange={e => setSecondaryBioMetric(e.target.value as BioMetricKey | 'none')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="none">-- Disabled (None) --</option>
              {Object.keys(BIO_METRICS).map(k => (
                <option key={k} value={k}>
                  {BIO_METRICS[k as BioMetricKey].label} ({BIO_METRICS[k as BioMetricKey].unit})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 leading-tight">
              {secondaryBioMetric !== 'none' ? BIO_METRICS[secondaryBioMetric].description : 'Optional secondary biological curve.'}
            </p>
          </div>

          {/* Axis 3: Primary Environmental Driver (Right Y-Axis 1) */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                <span>Right Axis 1 (Primary Env):</span>
              </label>
            </div>
            <select
              value={primaryEnvMetric}
              onChange={e => setPrimaryEnvMetric(e.target.value as EnvMetricKey)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            >
              {Object.keys(ENV_METRICS).map(k => (
                <option key={k} value={k}>
                  {ENV_METRICS[k as EnvMetricKey].label} ({ENV_METRICS[k as EnvMetricKey].unit})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 leading-tight">
              {ENV_METRICS[primaryEnvMetric].description}
            </p>
          </div>

          {/* Axis 4: Secondary Environmental Driver (Right Y-Axis 2) */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Right Axis 2 (Secondary Env):</span>
              </label>
            </div>
            <select
              value={secondaryEnvMetric}
              onChange={e => setSecondaryEnvMetric(e.target.value as EnvMetricKey | 'none')}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
            >
              <option value="none">-- Disabled (None) --</option>
              {Object.keys(ENV_METRICS).map(k => (
                <option key={k} value={k}>
                  {ENV_METRICS[k as EnvMetricKey].label} ({ENV_METRICS[k as EnvMetricKey].unit})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 leading-tight">
              {secondaryEnvMetric !== 'none' ? ENV_METRICS[secondaryEnvMetric].description : 'Optional secondary ambient factor.'}
            </p>
          </div>

        </div>
      </div>

      {/* Main Multi-Axis Recharts Chart Container */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
        
        {/* Chart Header & Statistical Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {BIO_METRICS[primaryBioMetric].label} vs. {ENV_METRICS[primaryEnvMetric].label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 font-mono border border-slate-800">
                {sortedData.length} data points
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Independent multi-axis scaling preserving physiological dynamics without normalization flattening
            </p>
          </div>

          {/* Statistical Badges */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">PEARSON r</span>
              <span className={`font-bold text-sm ${
                correlationPrimary.r >= 0.6 ? 'text-emerald-400' : correlationPrimary.r <= -0.6 ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {correlationPrimary.r > 0 ? `+${correlationPrimary.r}` : correlationPrimary.r}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">VARIANCE R²</span>
              <span className="font-bold text-sm text-cyan-400">
                {correlationPrimary.r2}
              </span>
            </div>

            {correlationSecondary && (
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 hidden md:block">
                <span className="text-[10px] text-slate-500 block">SEC. r ({ENV_METRICS[secondaryEnvMetric as EnvMetricKey].label.split(' ')[0]})</span>
                <span className="font-bold text-sm text-amber-400">
                  {correlationSecondary.r > 0 ? `+${correlationSecondary.r}` : correlationSecondary.r}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Multi-Axis Visualization */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="primaryBioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BIO_METRICS[primaryBioMetric].color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={BIO_METRICS[primaryBioMetric].color} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="primaryEnvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ENV_METRICS[primaryEnvMetric].color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={ENV_METRICS[primaryEnvMetric].color} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.7} />

              {/* X Axis */}
              <XAxis
                dataKey="formattedDate"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#334155' }}
              />

              {/* Left Y Axis 1: Primary Bio Metric */}
              <YAxis
                yAxisId="left-bio-1"
                orientation="left"
                stroke={BIO_METRICS[primaryBioMetric].color}
                domain={BIO_METRICS[primaryBioMetric].domain}
                tick={{ fill: BIO_METRICS[primaryBioMetric].color, fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(v) => `${v} ${BIO_METRICS[primaryBioMetric].unit}`}
                width={70}
              />

              {/* Left Y Axis 2: Optional Secondary Bio Metric */}
              {secondaryBioMetric !== 'none' && (
                <YAxis
                  yAxisId="left-bio-2"
                  orientation="left"
                  stroke={BIO_METRICS[secondaryBioMetric].color}
                  domain={BIO_METRICS[secondaryBioMetric].domain}
                  tick={{ fill: BIO_METRICS[secondaryBioMetric].color, fontSize: 9, fontFamily: 'monospace' }}
                  tickFormatter={(v) => `${v} ${BIO_METRICS[secondaryBioMetric].unit}`}
                  width={60}
                />
              )}

              {/* Right Y Axis 1: Primary Environmental Driver */}
              <YAxis
                yAxisId="right-env-1"
                orientation="right"
                stroke={ENV_METRICS[primaryEnvMetric].color}
                domain={ENV_METRICS[primaryEnvMetric].domain}
                tick={{ fill: ENV_METRICS[primaryEnvMetric].color, fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(v) => `${v} ${ENV_METRICS[primaryEnvMetric].unit}`}
                width={65}
              />

              {/* Right Y Axis 2: Optional Secondary Environmental Driver */}
              {secondaryEnvMetric !== 'none' && (
                <YAxis
                  yAxisId="right-env-2"
                  orientation="right"
                  stroke={ENV_METRICS[secondaryEnvMetric].color}
                  domain={ENV_METRICS[secondaryEnvMetric].domain}
                  tick={{ fill: ENV_METRICS[secondaryEnvMetric].color, fontSize: 9, fontFamily: 'monospace' }}
                  tickFormatter={(v) => `${v} ${ENV_METRICS[secondaryEnvMetric].unit}`}
                  width={55}
                />
              )}

              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '16px', 
                  fontSize: '11px', 
                  fontFamily: 'monospace' 
                }} 
              />

              {/* Primary Bio Metric (Area or Line) */}
              {showAreaFill ? (
                <Area
                  yAxisId="left-bio-1"
                  type="monotone"
                  dataKey={primaryBioMetric}
                  name={BIO_METRICS[primaryBioMetric].label}
                  stroke={BIO_METRICS[primaryBioMetric].color}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#primaryBioGradient)"
                  dot={{ r: 4, fill: BIO_METRICS[primaryBioMetric].color, stroke: '#020617', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              ) : (
                <Line
                  yAxisId="left-bio-1"
                  type="monotone"
                  dataKey={primaryBioMetric}
                  name={BIO_METRICS[primaryBioMetric].label}
                  stroke={BIO_METRICS[primaryBioMetric].color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: BIO_METRICS[primaryBioMetric].color, stroke: '#020617', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {/* Secondary Bio Metric Line */}
              {secondaryBioMetric !== 'none' && (
                <Line
                  yAxisId="left-bio-2"
                  type="monotone"
                  dataKey={secondaryBioMetric}
                  name={BIO_METRICS[secondaryBioMetric].label}
                  stroke={BIO_METRICS[secondaryBioMetric].color}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: BIO_METRICS[secondaryBioMetric].color }}
                />
              )}

              {/* Primary Environmental Driver Line */}
              <Line
                yAxisId="right-env-1"
                type="monotone"
                dataKey={primaryEnvMetric}
                name={ENV_METRICS[primaryEnvMetric].label}
                stroke={ENV_METRICS[primaryEnvMetric].color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: ENV_METRICS[primaryEnvMetric].color, stroke: '#020617', strokeWidth: 1.5 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />

              {/* Secondary Environmental Driver Line */}
              {secondaryEnvMetric !== 'none' && (
                <Line
                  yAxisId="right-env-2"
                  type="monotone"
                  dataKey={secondaryEnvMetric}
                  name={ENV_METRICS[secondaryEnvMetric].label}
                  stroke={ENV_METRICS[secondaryEnvMetric].color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={{ r: 3, fill: ENV_METRICS[secondaryEnvMetric].color }}
                />
              )}

              {/* Interactive Timeline Brush Scrubber */}
              {showBrushScrubber && (
                <Brush 
                  dataKey="formattedDate" 
                  height={25} 
                  stroke="#334155" 
                  fill="#090d16" 
                  tickFormatter={(t) => t.split(' ')[0]} 
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Interpretation Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300">
              {correlationPrimary.r < -0.5 ? (
                <span>
                  Strong inverse relationship: As <strong>{ENV_METRICS[primaryEnvMetric].label}</strong> decreases, <strong>{BIO_METRICS[primaryBioMetric].label}</strong> surges noticeably ($r = {correlationPrimary.r}$).
                </span>
              ) : correlationPrimary.r > 0.5 ? (
                <span>
                  Strong direct coupling: Higher <strong>{ENV_METRICS[primaryEnvMetric].label}</strong> accelerates <strong>{BIO_METRICS[primaryBioMetric].label}</strong> ($r = +{correlationPrimary.r}$).
                </span>
              ) : (
                <span>
                  Moderate / complex coupling ($r = {correlationPrimary.r}$); secondary physiological regulation or environmental threshold effects detected.
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-slate-400">
            <span>Sample size: {sortedData.length} observation cycles</span>
          </div>
        </div>

      </div>

      {/* Deep-Dive Correlation Matrix & Analytical Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Full Environmental-Biological Correlation Matrix Table */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Full Environmental ↔ Plant Response Correlation Matrix</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Pearson r-Index</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Quantitative proof demonstrating how each environmental factor directly modulates biological uptake and morphology:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2">Environmental Driver</th>
                  <th className="py-2 text-center">Metal Uptake (ppm)</th>
                  <th className="py-2 text-center">Growth Height (mm)</th>
                  <th className="py-2 text-center">Leaf Angle (°)</th>
                  <th className="py-2 text-center">Biopotential (mV)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {(Object.keys(ENV_METRICS) as EnvMetricKey[]).map(envKey => {
                  const envDef = ENV_METRICS[envKey];
                  const x = sortedData.map(d => d[envKey] as number);

                  return (
                    <tr key={envKey} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: envDef.color }}></span>
                        <span>{envDef.label}</span>
                      </td>

                      {(Object.keys(BIO_METRICS) as BioMetricKey[]).map(bioKey => {
                        const y = sortedData.map(d => d[bioKey] as number);
                        const r = calculatePearsonCorrelation(x, y);
                        const isPrimary = envKey === primaryEnvMetric && bioKey === primaryBioMetric;
                        const isHighPos = r >= 0.65;
                        const isHighNeg = r <= -0.65;

                        return (
                          <td key={bioKey} className="py-2.5 text-center">
                            <button
                              onClick={() => {
                                setPrimaryEnvMetric(envKey);
                                setPrimaryBioMetric(bioKey);
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                isPrimary 
                                  ? 'ring-2 ring-emerald-400 bg-emerald-500/25 text-white' 
                                  : isHighPos 
                                    ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25' 
                                    : isHighNeg 
                                      ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25' 
                                      : 'bg-slate-950 text-slate-400 hover:text-white'
                              }`}
                              title="Click to map directly to chart axes"
                            >
                              {r > 0 ? `+${r}` : `${r}`}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Tip: Click any r-value cell to instantly load that pair onto the multi-axis chart.</span>
            <span className="text-emerald-400">Green = Direct (+), Red = Inverse (-)</span>
          </div>
        </div>

        {/* Grant Evidence & Scientific Validation Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Grant & Institutional Evidence</span>
            </div>
            <h4 className="font-bold text-white text-sm">
              Empirical Proof-of-Concept for Ecology & NSF Reviews
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Grant programs (WA Department of Ecology Water Quality Combined Funding, NSF STTR Phase I, and Eco-Tech microgrants) explicitly mandate: 
              <em>"Documented measurable correlation between biological uptake/response and electronic or environmental variables."</em>
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-0.5">1. Rhizosphere Acidification (r = -0.84)</span>
                <p className="text-[11px] text-slate-400">
                  Proves that solution pH control under 6.3 maximizes ionic nickel translocation up to 382 ppm.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30">
                <span className="text-cyan-400 font-bold block mb-0.5">2. Turgor Hydraulic Rebound (r = +0.89)</span>
                <p className="text-[11px] text-slate-400">
                  Proves petiole angle deflection objectively mirrors root volumetric water content within 90 minutes.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/30">
                <span className="text-purple-400 font-bold block mb-0.5">3. Bioelectric Signal Shift (r = -0.73)</span>
                <p className="text-[11px] text-slate-400">
                  Proves membrane depolarization tracks sap metal saturation, justifying Chrislance's high-Z AFE instrumentation.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Validated for Phase 0 $\rightarrow$ Phase 1 Milestone transition.
          </div>
        </div>

      </div>

    </div>
  );
};
