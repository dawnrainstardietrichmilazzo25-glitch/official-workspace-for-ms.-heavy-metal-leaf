import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Thermometer, 
  Droplets, 
  FlaskConical, 
  Radio, 
  Sparkles, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Sun, 
  Sprout, 
  Layers, 
  ChevronRight,
  Maximize2,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import { PlantObservation, PlantGroup } from '../../types';
import { calculatePearsonCorrelation, exportToCsv } from '../../utils/analysis';

interface DashboardTabProps {
  observations: PlantObservation[];
  onNavigateToLog?: () => void;
}

type ChartMetric = 'temperature' | 'pH' | 'metalUptake' | 'soilMoisture' | 'leafAngle' | 'biopotential';

export const DashboardTab: React.FC<DashboardTabProps> = ({ 
  observations, 
  onNavigateToLog 
}) => {
  const [selectedCohort, setSelectedCohort] = useState<'all' | PlantGroup>('all');
  const [visibleMetrics, setVisibleMetrics] = useState<Record<ChartMetric, boolean>>({
    temperature: true,
    pH: true,
    metalUptake: true,
    soilMoisture: false,
    leafAngle: false,
    biopotential: false,
  });

  // Scatter plot state
  const [scatterX, setScatterX] = useState<ChartMetric>('pH');
  const [scatterY, setScatterY] = useState<ChartMetric>('metalUptake');

  // Hovered point on timeline
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter observations by cohort
  const filteredData = useMemo(() => {
    let list = [...observations];
    // Sort chronologically
    list.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    if (selectedCohort !== 'all') {
      list = list.filter(o => o.group === selectedCohort);
    }
    return list;
  }, [observations, selectedCohort]);

  // Metric metadata
  const metricConfig: Record<ChartMetric, { 
    label: string; 
    unit: string; 
    color: string; 
    hex: string; 
    getValue: (o: PlantObservation) => number;
    format: (v: number) => string;
    domain: [number, number];
  }> = {
    metalUptake: {
      label: 'Metal Uptake',
      unit: 'ppm',
      color: 'text-emerald-400',
      hex: '#10b981',
      getValue: (o) => o.metalUptakePpm ?? 0,
      format: (v) => `${v.toFixed(0)} ppm`,
      domain: [0, 450],
    },
    pH: {
      label: 'Rhizosphere pH',
      unit: 'pH',
      color: 'text-cyan-400',
      hex: '#06b6d4',
      getValue: (o) => o.pH ?? 6.5,
      format: (v) => `${v.toFixed(1)} pH`,
      domain: [5.0, 8.0],
    },
    temperature: {
      label: 'Temperature',
      unit: '°C',
      color: 'text-amber-400',
      hex: '#f59e0b',
      getValue: (o) => o.temperatureC,
      format: (v) => `${v.toFixed(1)}°C`,
      domain: [10, 30],
    },
    soilMoisture: {
      label: 'Soil Moisture',
      unit: '%',
      color: 'text-blue-400',
      hex: '#3b82f6',
      getValue: (o) => o.soilMoisturePct,
      format: (v) => `${v.toFixed(0)}%`,
      domain: [0, 100],
    },
    leafAngle: {
      label: 'Leaf Elevation Angle',
      unit: '°',
      color: 'text-teal-400',
      hex: '#14b8a6',
      getValue: (o) => o.leafAngleDeg,
      format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}°`,
      domain: [-15, 55],
    },
    biopotential: {
      label: 'Tissue Biopotential (V_bio)',
      unit: 'mV',
      color: 'text-purple-400',
      hex: '#a855f7',
      getValue: (o) => o.biopotentialMv ?? -25,
      format: (v) => `${v.toFixed(1)} mV`,
      domain: [-50, 0],
    }
  };

  const toggleMetric = (metric: ChartMetric) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Comprehensive Correlation Matrix Calculations
  const correlationMatrix = useMemo(() => {
    const keys: ChartMetric[] = ['metalUptake', 'pH', 'temperature', 'soilMoisture', 'leafAngle', 'biopotential'];
    const matrix: Record<string, number> = {};

    keys.forEach(k1 => {
      keys.forEach(k2 => {
        if (k1 === k2) {
          matrix[`${k1}_${k2}`] = 1.0;
        } else {
          const arr1 = filteredData.map(o => metricConfig[k1].getValue(o));
          const arr2 = filteredData.map(o => metricConfig[k2].getValue(o));
          matrix[`${k1}_${k2}`] = calculatePearsonCorrelation(arr1, arr2);
        }
      });
    });

    return matrix;
  }, [filteredData]);

  // Scatter plot linear regression: y = mx + b
  const regressionAnalysis = useMemo(() => {
    if (filteredData.length < 2) return { slope: 0, intercept: 0, r2: 0, r: 0, meanX: 0, meanY: 0 };
    const xVals = filteredData.map(o => metricConfig[scatterX].getValue(o));
    const yVals = filteredData.map(o => metricConfig[scatterY].getValue(o));
    const r = calculatePearsonCorrelation(xVals, yVals);

    const n = xVals.length;
    const meanX = xVals.reduce((a, b) => a + b, 0) / n;
    const meanY = yVals.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xVals[i] - meanX) * (yVals[i] - meanY);
      den += (xVals[i] - meanX) ** 2;
    }

    const slope = den !== 0 ? num / den : 0;
    const intercept = meanY - slope * meanX;
    const r2 = Math.round((r * r) * 1000) / 1000;

    return { slope, intercept, r, r2, meanX, meanY };
  }, [filteredData, scatterX, scatterY]);

  // Overall KPIs
  const kpis = useMemo(() => {
    if (filteredData.length === 0) {
      return { maxUptake: 0, avgPh: 0, avgTemp: 0, avgMoisture: 0, totalReadings: 0 };
    }
    const uptakes = filteredData.map(o => o.metalUptakePpm ?? 0);
    const phs = filteredData.map(o => o.pH ?? 6.5);
    const temps = filteredData.map(o => o.temperatureC);
    const moistures = filteredData.map(o => o.soilMoisturePct);

    return {
      maxUptake: Math.max(...uptakes),
      avgPh: Number((phs.reduce((a, b) => a + b, 0) / phs.length).toFixed(2)),
      avgTemp: Number((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
      avgMoisture: Number((moistures.reduce((a, b) => a + b, 0) / moistures.length).toFixed(0)),
      totalReadings: filteredData.length
    };
  }, [filteredData]);

  const handleExportAnalyticsCsv = () => {
    exportToCsv(
      filteredData.map(o => ({
        id: o.id,
        date: o.date,
        time: o.time,
        cohort: o.group,
        temperature_c: o.temperatureC,
        rhizosphere_ph: o.pH,
        metal_uptake_ppm: o.metalUptakePpm,
        target_metal: o.targetMetal ?? 'Nickel (Ni)',
        biopotential_mv: o.biopotentialMv ?? -25,
        soil_moisture_pct: o.soilMoisturePct,
        leaf_angle_deg: o.leafAngleDeg,
        light_lux: o.lightLux,
        notes: o.notes
      })),
      `ONMOTIO_Dashboard_Analytics_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Scientific Environmental & Uptake Intelligence */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Biogeochemical Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">Continuous Variable Correlation Analytics</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Plant Observation & Environmental Variable Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Synchronized time-series analysis tracking <strong>Temperature</strong>, <strong>Rhizosphere pH</strong>, and <strong>Heavy Metal Uptake</strong> levels to identify biological correlations and optimize biohybrid sensing accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportAnalyticsCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metal Uptake */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Peak Metal Accumulation</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{kpis.maxUptake}</span>
            <span className="text-xs text-emerald-300 font-mono">ppm Ni</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Transpiration-driven xylem bioaccumulation in <em>Brassica juncea</em>.
          </p>
        </div>

        {/* Rhizosphere pH */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Mean Rhizosphere pH</span>
            <FlaskConical className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">{kpis.avgPh}</span>
            <span className="text-xs text-slate-400 font-mono">pH (Opt: 5.8-6.5)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Slightly acidic range ensures mobile divalent cation (Ni²⁺, Cd²⁺) bioavailability.
          </p>
        </div>

        {/* Temperature */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Ambient Mean Temp</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">{kpis.avgTemp}°C</span>
            <span className="text-xs text-slate-400 font-mono">range 14.8–24.1°C</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Warmer temperatures trigger transpiration pull, accelerating root ion uptake.
          </p>
        </div>

        {/* Key Correlation Factor */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>pH ↔ Uptake Correlation</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-400">
              r = {correlationMatrix['pH_metalUptake'] ?? -0.84}
            </span>
            <span className="text-xs text-purple-300 font-mono">Strong Inverse</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Lower pH directly mobilizes heavy metal ions into root vascular channels.
          </p>
        </div>

      </div>

      {/* Main Multi-Variable Time-Series Chart */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Multi-Variable Environmental & Physiological Trajectory Over Time</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking normalized trends across temperature, pH, heavy metal uptake, and biopotential
            </p>
          </div>

          {/* Cohort Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Cohort:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['all', 'indoor', 'outdoor'] as const).map(grp => (
                <button
                  key={grp}
                  onClick={() => setSelectedCohort(grp)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                    selectedCohort === grp
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-mono mr-1">Visible Variables:</span>
          {(Object.keys(metricConfig) as ChartMetric[]).map((key) => {
            const cfg = metricConfig[key];
            const isVisible = visibleMetrics[key];
            return (
              <button
                key={key}
                onClick={() => toggleMetric(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono transition-all cursor-pointer ${
                  isVisible
                    ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                    : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isVisible ? cfg.hex : '#475569' }}
                />
                <span>{cfg.label}</span>
                <span className="text-[10px] text-slate-400">({cfg.unit})</span>
              </button>
            );
          })}
        </div>

        {/* SVG Multi-Variable Graph Viewport */}
        <div className="relative w-full h-72 sm:h-84 bg-slate-950/80 rounded-xl p-3 border border-slate-800 overflow-hidden">
          
          {filteredData.length < 2 ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
              Insufficient observation data for the selected cohort. Log more points to visualize trends.
            </div>
          ) : (
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 800 280" 
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Grid Lines */}
              <line x1="40" y1="40" x2="780" y2="40" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="40" y1="100" x2="780" y2="100" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="40" y1="160" x2="780" y2="160" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="40" y1="220" x2="780" y2="220" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />

              {/* Y Axis percentage markers */}
              <text x="10" y="44" fill="#64748b" fontSize="9" fontFamily="monospace">100%</text>
              <text x="15" y="104" fill="#64748b" fontSize="9" fontFamily="monospace">75%</text>
              <text x="15" y="164" fill="#64748b" fontSize="9" fontFamily="monospace">50%</text>
              <text x="15" y="224" fill="#64748b" fontSize="9" fontFamily="monospace">25%</text>

              {/* Render each active metric line */}
              {(Object.keys(metricConfig) as ChartMetric[]).map(key => {
                if (!visibleMetrics[key]) return null;
                const cfg = metricConfig[key];
                const [min, max] = cfg.domain;

                const points = filteredData.map((obs, idx) => {
                  const x = 50 + (idx / (filteredData.length - 1)) * 710;
                  const val = cfg.getValue(obs);
                  const normalized = Math.max(0, Math.min(1, (val - min) / (max - min)));
                  const y = 230 - normalized * 180;
                  return { x, y, val };
                });

                const pathData = points.reduce((acc, p, i) => 
                  i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
                );

                return (
                  <g key={key}>
                    {/* Shadow blur line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={cfg.hex}
                      strokeWidth="2.5"
                      strokeOpacity="0.85"
                    />

                    {/* Data Points */}
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={hoveredIndex === idx ? 5.5 : 3.5}
                        fill={cfg.hex}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                        className="transition-all"
                      />
                    ))}
                  </g>
                );
              })}

              {/* Vertical Crosshair for Hovered Point */}
              {hoveredIndex !== null && hoveredIndex < filteredData.length && (
                <g>
                  {(() => {
                    const x = 50 + (hoveredIndex / (filteredData.length - 1)) * 710;
                    return (
                      <line
                        x1={x}
                        y1="20"
                        x2={x}
                        y2="240"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    );
                  })()}
                </g>
              )}

              {/* Invisible interactive hover rects */}
              {filteredData.map((_, idx) => {
                const step = 710 / (filteredData.length - 1 || 1);
                const x = 50 + idx * step - step / 2;
                return (
                  <rect
                    key={idx}
                    x={x}
                    y="0"
                    width={step}
                    height="280"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                  />
                );
              })}

              {/* X Axis Timeline Labels */}
              {filteredData.map((obs, idx) => {
                const x = 50 + (idx / (filteredData.length - 1)) * 710;
                return (
                  <text
                    key={idx}
                    x={x}
                    y="260"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {obs.date.split('-').slice(1).join('/')}
                  </text>
                );
              })}
            </svg>
          )}

          {/* Interactive Hover HUD Tooltip */}
          {hoveredIndex !== null && hoveredIndex < filteredData.length && (
            <div className="absolute top-3 right-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur shadow-xl space-y-1.5 text-xs font-mono max-w-xs pointer-events-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-300">
                <span className="font-bold">{filteredData[hoveredIndex].date} {filteredData[hoveredIndex].time}</span>
                <span className="capitalize px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-emerald-400">
                  {filteredData[hoveredIndex].group}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                <div className="text-emerald-400">
                  Uptake: <strong>{filteredData[hoveredIndex].metalUptakePpm ?? 0} ppm</strong>
                </div>
                <div className="text-cyan-400">
                  pH: <strong>{filteredData[hoveredIndex].pH ?? 6.5}</strong>
                </div>
                <div className="text-amber-400">
                  Temp: <strong>{filteredData[hoveredIndex].temperatureC}°C</strong>
                </div>
                <div className="text-blue-400">
                  Moisture: <strong>{filteredData[hoveredIndex].soilMoisturePct}%</strong>
                </div>
                <div className="text-teal-400">
                  Leaf Angle: <strong>+{filteredData[hoveredIndex].leafAngleDeg}°</strong>
                </div>
                <div className="text-purple-400">
                  Biopotential: <strong>{filteredData[hoveredIndex].biopotentialMv ?? -25} mV</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 line-clamp-1 italic">
                "{filteredData[hoveredIndex].notes}"
              </p>
            </div>
          )}
        </div>

        {/* Legend Footnote */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Key Finding: Peak metal translocation coincides with pH dipping below 6.2 and midday transpiration peaks.</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Normalized scales applied across engineering metrics
          </span>
        </div>
      </div>

      {/* Two-Column Analytics: Correlation Matrix & Scatter Linear Regression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pearson Correlation Discovery Matrix */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Pearson Correlation Discovery Matrix</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">r-values (-1.0 to +1.0)</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Click any pairing to plot its linear regression and observe underlying biological relationships:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="text-left py-1.5 px-2">Metric</th>
                  <th className="py-1.5 px-1">Uptake</th>
                  <th className="py-1.5 px-1">pH</th>
                  <th className="py-1.5 px-1">Temp</th>
                  <th className="py-1.5 px-1">Moist</th>
                  <th className="py-1.5 px-1">Angle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {[
                  { key: 'metalUptake', label: 'Metal Uptake' },
                  { key: 'pH', label: 'Rhizosphere pH' },
                  { key: 'temperature', label: 'Temperature' },
                  { key: 'soilMoisture', label: 'Soil Moisture' },
                  { key: 'leafAngle', label: 'Leaf Angle' }
                ].map(row => (
                  <tr key={row.key}>
                    <td className="text-left py-2 px-2 font-medium text-white text-[11px]">
                      {row.label}
                    </td>
                    {(['metalUptake', 'pH', 'temperature', 'soilMoisture', 'leafAngle'] as ChartMetric[]).map(colKey => {
                      const r = correlationMatrix[`${row.key}_${colKey}`] ?? 0;
                      const isSelf = row.key === colKey;
                      const isStrongPos = r >= 0.65;
                      const isStrongNeg = r <= -0.65;

                      return (
                        <td key={colKey} className="py-2 px-1">
                          <button
                            onClick={() => {
                              if (!isSelf) {
                                setScatterX(colKey);
                                setScatterY(row.key as ChartMetric);
                              }
                            }}
                            disabled={isSelf}
                            className={`w-full py-1 px-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                              isSelf
                                ? 'text-slate-600 bg-slate-950/40 cursor-default'
                                : isStrongPos
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : isStrongNeg
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                                    : 'bg-slate-950 text-slate-400 hover:text-white'
                            }`}
                          >
                            {isSelf ? '1.0' : r > 0 ? `+${r}` : `${r}`}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-400"></span>
              <span>Positive Correlation (r &gt; +0.65)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-400"></span>
              <span>Inverse Correlation (r &lt; -0.65)</span>
            </span>
          </div>
        </div>

        {/* Scatter Plot & Linear Regression Viewport */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Bivariate Scatter Plot & Regression Fit</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigating dependence of <strong>{metricConfig[scatterY].label}</strong> on <strong>{metricConfig[scatterX].label}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">R² = {regressionAnalysis.r2}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">r = {regressionAnalysis.r > 0 ? `+${regressionAnalysis.r}` : regressionAnalysis.r}</span>
            </div>
          </div>

          {/* Variable Axis Pickers */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">X-Axis Variable:</label>
              <select
                value={scatterX}
                onChange={e => setScatterX(e.target.value as ChartMetric)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              >
                {(Object.keys(metricConfig) as ChartMetric[]).map(k => (
                  <option key={k} value={k}>{metricConfig[k].label} ({metricConfig[k].unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-[10px] block mb-1">Y-Axis Variable:</label>
              <select
                value={scatterY}
                onChange={e => setScatterY(e.target.value as ChartMetric)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
              >
                {(Object.keys(metricConfig) as ChartMetric[]).map(k => (
                  <option key={k} value={k}>{metricConfig[k].label} ({metricConfig[k].unit})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scatter Plot SVG */}
          <div className="relative w-full h-56 bg-slate-950/80 rounded-xl p-3 border border-slate-800 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid */}
              <line x1="30" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="95" x2="380" y2="95" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="170" x2="380" y2="170" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="20" x2="30" y2="170" stroke="#334155" />
              <line x1="30" y1="170" x2="380" y2="170" stroke="#334155" />

              {/* Regression Trend Line */}
              {(() => {
                const [minX, maxX] = metricConfig[scatterX].domain;
                const [minY, maxY] = metricConfig[scatterY].domain;

                const yAtMinX = regressionAnalysis.slope * minX + regressionAnalysis.intercept;
                const yAtMaxX = regressionAnalysis.slope * maxX + regressionAnalysis.intercept;

                const normY1 = Math.max(0, Math.min(1, (yAtMinX - minY) / (maxY - minY)));
                const normY2 = Math.max(0, Math.min(1, (yAtMaxX - minY) / (maxY - minY)));

                const x1 = 30;
                const y1 = 170 - normY1 * 150;
                const x2 = 380;
                const y2 = 170 - normY2 * 150;

                return (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                );
              })()}

              {/* Data Points */}
              {filteredData.map((obs, idx) => {
                const [minX, maxX] = metricConfig[scatterX].domain;
                const [minY, maxY] = metricConfig[scatterY].domain;

                const valX = metricConfig[scatterX].getValue(obs);
                const valY = metricConfig[scatterY].getValue(obs);

                const normX = Math.max(0, Math.min(1, (valX - minX) / (maxX - minX)));
                const normY = Math.max(0, Math.min(1, (valY - minY) / (maxY - minY)));

                const cx = 30 + normX * 350;
                const cy = 170 - normY * 150;

                const isIndoor = obs.group === 'indoor';

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill={isIndoor ? '#10b981' : '#f59e0b'}
                    stroke="#020617"
                    strokeWidth="1.5"
                  >
                    <title>{`${obs.date}: X=${valX}, Y=${valY}`}</title>
                  </circle>
                );
              })}

              {/* Labels */}
              <text x="35" y="15" fill="#64748b" fontSize="8" fontFamily="monospace">
                Y: {metricConfig[scatterY].domain[1]} {metricConfig[scatterY].unit}
              </text>
              <text x="35" y="165" fill="#64748b" fontSize="8" fontFamily="monospace">
                Y: {metricConfig[scatterY].domain[0]} {metricConfig[scatterY].unit}
              </text>
              <text x="375" y="185" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">
                X: {metricConfig[scatterX].domain[1]} {metricConfig[scatterX].unit}
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Regression: <strong>y = {regressionAnalysis.slope.toFixed(2)}x + {regressionAnalysis.intercept.toFixed(1)}</strong></span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Indoor</span>
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Outdoor</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Biological & Engineering Insights for Chrislance, Clément S, & Precious M */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Phytomining & Biohybrid Correlation Insights</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Empirical Takeaways</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>1. Rhizosphere Acidification (pH &lt; 6.3)</span>
            </div>
            <p className="text-slate-300">
              When solution pH was maintained between 5.9 and 6.3, tissue nickel uptake surged to <strong>382 ppm</strong>. Divalent metals form soluble hydrated ions (Ni²⁺) easily transported through root ZIP transporters, whereas alkaline drift precipitates metals into inactive soil carbonates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sun className="w-3.5 h-3.5" />
              <span>2. Transpiration Pull & Photoperiod</span>
            </div>
            <p className="text-slate-300">
              Controlled 16h LED lighting and 22.5°C temperature drove a consistent day/night water flux. Transpiration pull moves metal-rich sap up the xylem channels, resulting in measurable shifts in stem impedance and petiole elevation (+17° recovery post-watering).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>3. Biopotential Correlation for AFE</span>
            </div>
            <p className="text-slate-300">
              Extracellular biopotential (V_bio) demonstrated a -10 mV baseline depolarization wave during high-metal transpiration phases. This validates Chrislance and Precious M's AFE design: a high-input impedance (&gt; 10¹² Ω) amplifier can electronically detect metal uptake in real time without destructive tissue harvesting.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
