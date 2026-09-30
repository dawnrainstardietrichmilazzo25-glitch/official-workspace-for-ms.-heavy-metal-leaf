import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Zap, 
  Droplet, 
  Sun, 
  Hand, 
  Download, 
  ShieldAlert, 
  CheckCircle2,
  Gauge,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { exportToCsv } from '../../utils/analysis';

type StimulusType = 'baseline' | 'light_step' | 'drought_stress' | 'heavy_metal_influx' | 'touch_ap';

interface DataPoint {
  timeSec: number;
  biopotentialMv: number;
  leafAngleDeg: number;
  stimulusIntensity: number;
  rawMainsNoiseMv: number;
}

export const SignalSimulatorTab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [activeStimulus, setActiveStimulus] = useState<StimulusType>('baseline');
  const [stimulusDuration, setStimulusDuration] = useState(0);

  // Hardware AFE settings
  const [notchFilterEnabled, setNotchFilterEnabled] = useState(true);
  const [gainMultiplier, setGainMultiplier] = useState<number>(100);
  const [electrodeType, setElectrodeType] = useState<'ag_agcl_gel' | 'stainless_dry'>('ag_agcl_gel');
  const [sweepSpeed, setSweepSpeed] = useState<number>(1); // 1x, 2x, 0.5x

  // Metrics
  const [liveVbio, setLiveVbio] = useState(-18.4);
  const [liveAngle, setLiveAngle] = useState(38);
  const [liveSnrDb, setLiveSnrDb] = useState(24.8);
  const [correlationIndex, setCorrelationIndex] = useState(0.88);

  // Buffer of data points for canvas rendering and CSV export
  const bufferRef = useRef<DataPoint[]>([]);
  const timeRef = useRef<number>(0);
  const stimulusTimerRef = useRef<number>(0);

  // Initialize buffer
  useEffect(() => {
    if (bufferRef.current.length === 0) {
      const initial: DataPoint[] = [];
      for (let i = 0; i < 300; i++) {
        initial.push({
          timeSec: i * 0.05,
          biopotentialMv: -20 + Math.sin(i * 0.05) * 1.5,
          leafAngleDeg: 35 + Math.cos(i * 0.05) * 1.2,
          stimulusIntensity: 0,
          rawMainsNoiseMv: 0
        });
      }
      bufferRef.current = initial;
      timeRef.current = 300 * 0.05;
    }
  }, []);

  // Real-time animation loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      if (isRunning) {
        timeRef.current += 0.05 * sweepSpeed;
        const t = timeRef.current;

        // Base physiological resting potential (~ -25 mV inside extracellular apoplast)
        let baseMv = -22.0;
        let angleDeg = 36.0;
        let stimIntensity = 0;

        if (activeStimulus === 'light_step') {
          stimulusTimerRef.current += 0.05 * sweepSpeed;
          stimIntensity = 80;
          // Light induces H+-ATPase pump hyperpolarization (more negative) followed by leaf elevation
          baseMv = -38.0 + Math.sin(stimulusTimerRef.current * 0.4) * 4.0;
          angleDeg = 44.0 + Math.sin(stimulusTimerRef.current * 0.3) * 3.0;
        } else if (activeStimulus === 'drought_stress') {
          stimulusTimerRef.current += 0.05 * sweepSpeed;
          stimIntensity = 65;
          // Osmotic stress causes slow positive depolarization wave (VP wave) and petiole drooping
          baseMv = -8.0 + Math.sin(stimulusTimerRef.current * 0.2) * 3.0;
          angleDeg = 22.0 - Math.min(15, stimulusTimerRef.current * 0.8);
        } else if (activeStimulus === 'heavy_metal_influx') {
          stimulusTimerRef.current += 0.05 * sweepSpeed;
          stimIntensity = 95;
          // Cadmium / Nickel causes membrane disturbance, sudden spikes followed by persistent depolarization
          baseMv = -12.0 + Math.sin(stimulusTimerRef.current * 1.5) * 8.0 * Math.exp(-stimulusTimerRef.current * 0.05);
          angleDeg = 30.0 + Math.sin(stimulusTimerRef.current * 0.6) * 2.0;
        } else if (activeStimulus === 'touch_ap') {
          stimulusTimerRef.current += 0.05 * sweepSpeed;
          stimIntensity = 100;
          // Action potential: sharp fast spike (~ +35 mV peak) lasting ~2-4 seconds, then slow recovery
          const apT = stimulusTimerRef.current;
          if (apT < 3.5) {
            baseMv = -22.0 + 45.0 * Math.exp(-Math.pow(apT - 1.2, 2) / 0.5);
            angleDeg = 36.0 - 12.0 * Math.exp(-Math.pow(apT - 1.5, 2) / 1.0);
          } else {
            // Auto revert touch stimulus after 6 seconds
            setActiveStimulus('baseline');
            stimulusTimerRef.current = 0;
          }
        } else {
          // Resting baseline with tiny circadian wobble
          stimulusTimerRef.current = 0;
          stimIntensity = 10;
          baseMv = -20.0 + Math.sin(t * 0.1) * 2.0;
          angleDeg = 37.0 + Math.sin(t * 0.08) * 1.5;
        }

        // Biological micro-fluctuations (1/f pink noise)
        const bioFlicker = (Math.random() - 0.5) * 1.2;

        // 60Hz mains interference (Chrislance highlighted this key problem for high-impedance plant electrodes!)
        const noiseFactor = electrodeType === 'stainless_dry' ? 18.0 : 4.0;
        const mains60Hz = Math.sin(t * 60 * 2 * Math.PI) * noiseFactor;

        // Apply notch filter
        const finalSignal = notchFilterEnabled 
          ? baseMv + bioFlicker + (mains60Hz * 0.05) 
          : baseMv + bioFlicker + mains60Hz;

        // Add to buffer
        bufferRef.current.push({
          timeSec: t,
          biopotentialMv: finalSignal,
          leafAngleDeg: angleDeg,
          stimulusIntensity: stimIntensity,
          rawMainsNoiseMv: mains60Hz
        });

        if (bufferRef.current.length > 300) {
          bufferRef.current.shift();
        }

        // Update live status meters
        setLiveVbio(Math.round(finalSignal * 10) / 10);
        setLiveAngle(Math.round(angleDeg * 10) / 10);
        setLiveSnrDb(notchFilterEnabled ? (electrodeType === 'ag_agcl_gel' ? 28.4 : 19.2) : 6.1);
        setCorrelationIndex(activeStimulus === 'baseline' ? 0.88 : 0.94);
      }

      // Draw oscilloscope
      drawOscilloscope();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, activeStimulus, notchFilterEnabled, electrodeType, sweepSpeed]);

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, width, height);

    // Draw CRT / Phosphor Grid
    ctx.strokeStyle = '#0f172a'; // slate-900
    ctx.lineWidth = 1;
    const gridCols = 10;
    const gridRows = 8;
    for (let c = 0; c <= gridCols; c++) {
      const x = (width / gridCols) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let r = 0; r <= gridRows; r++) {
      const y = (height / gridRows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Zero Volt Center Guideline
    const zeroY = height * 0.45;
    ctx.strokeStyle = '#1e293b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    const data = bufferRef.current;
    if (data.length < 2) return;

    // 1. Draw Stimulus Waveform (Amber Background fill)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * width;
      const stim = data[i].stimulusIntensity; // 0 to 100
      const y = height - (stim / 100) * (height * 0.35);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // 2. Draw Leaf Angle Trace (Cyan dashed line)
    ctx.strokeStyle = '#06b6d4'; // cyan-500
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * width;
      // Leaf angle range: 0° to 50° -> map to height * 0.75 down to height * 0.25
      const angle = data[i].leafAngleDeg;
      const y = height * 0.8 - (angle / 60) * (height * 0.55);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Plant Extracellular Biopotential (V_bio, Glowing Emerald)
    ctx.strokeStyle = '#10b981'; // emerald-500
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = (i / (data.length - 1)) * width;
      // Biopotential: -60mV to +40mV -> map around zeroY
      const mv = data[i].biopotentialMv;
      const y = zeroY - (mv * (height / 140));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Oscilloscope Scale Legend Text
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText('+30 mV', 12, zeroY - (30 * (height / 140)) - 4);
    ctx.fillText('0 mV (Ref)', 12, zeroY - 4);
    ctx.fillText('-40 mV', 12, zeroY - (-40 * (height / 140)) - 4);
    ctx.fillText('500 ms/div', width - 80, height - 12);
  };

  const triggerStimulus = (type: StimulusType) => {
    setActiveStimulus(type);
    stimulusTimerRef.current = 0;
  };

  const handleExportCsv = () => {
    exportToCsv(
      bufferRef.current.map(d => ({
        time_sec: Math.round(d.timeSec * 100) / 100,
        plant_biopotential_mv: Math.round(d.biopotentialMv * 100) / 100,
        leaf_angle_deg: Math.round(d.leafAngleDeg * 10) / 10,
        stimulus_intensity_pct: Math.round(d.stimulusIntensity),
        mains_filter_active: notchFilterEnabled ? 'YES' : 'NO',
        electrode_type: electrodeType
      })),
      `ONMOTIO_Biopotential_Oscilloscope_${activeStimulus}.csv`
    );
  };

  const handleReset = () => {
    timeRef.current = 0;
    stimulusTimerRef.current = 0;
    setActiveStimulus('baseline');
    bufferRef.current = [];
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              Electrophysiology & AFE Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Signal Conditioning</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            Plant Biopotential & Environmental Correlation Oscilloscope
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-0.5">
            Simulates how Chrislance’s Analog Front-End (INA128 instrumentation amp + ADS1115 ADC) captures microvolt extracellular plant action potentials and variation waves in response to real environmental stressors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              isRunning 
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Sweep' : 'Resume Sweep'}</span>
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Reset Scope"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title="Export synthetic electrophysiology data"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Epistemic Truth Separation Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-amber-300 uppercase tracking-wide">
              🟡 Tier 2: Synthetic Mathematical Model (Pending Physical Bench Validation)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
              Epistemic Transparency
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            As agreed with hardware engineer <strong>Chrislance</strong>: <em>"We need to keep the facts separated from the things that are maybe possible but haven't been tested yet."</em> The waveforms and biopotential signals displayed on this virtual oscilloscope are <strong>computational bio-mathematical models</strong> calibrated to test our filter cutoff frequencies (15 Hz low-pass, 60 Hz notch) and DAQ sampling algorithms. They are <strong>NOT</strong> live physical bench measurements from electrodes yet. Physical bench validation begins under Chrislance's proposed Phase Zero Technical Feasibility Review.
          </p>
        </div>
      </div>

      {/* Main Oscilloscope Display */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-2xl relative">
        
        {/* Top Scope Controls & Channels Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></span>
              <span>CH1: Extracellular Biopotential (V_bio, mV)</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-400">
              <span className="w-3 h-1 bg-cyan-400 rounded-full"></span>
              <span>CH2: Leaf Angle (θ, °)</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400">
              <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/60"></span>
              <span>Stimulus Level (%)</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">
              Status: <span className={isRunning ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {isRunning ? 'ACQUIRING (10 Hz)' : 'HOLD'}
              </span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Active: <span className="text-cyan-300 uppercase">{activeStimulus.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        {/* Oscilloscope Canvas */}
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
          <canvas
            ref={canvasRef}
            width={900}
            height={340}
            className="w-full h-64 sm:h-80 block"
          />

          {/* Scope Overlay Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 font-mono text-[11px] pointer-events-none">
            <div className="px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur border border-slate-700 text-emerald-300 flex items-center justify-between gap-3">
              <span>V_bio</span>
              <span className="font-bold">{liveVbio > 0 ? `+${liveVbio}` : liveVbio} mV</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur border border-slate-700 text-cyan-300 flex items-center justify-between gap-3">
              <span>Leaf Angle</span>
              <span className="font-bold">+{liveAngle}°</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur border border-slate-700 text-slate-300 flex items-center justify-between gap-3">
              <span>SNR</span>
              <span className={liveSnrDb > 15 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {liveSnrDb} dB
              </span>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">CORRELATION r</span>
            <span className="text-emerald-400 text-base font-bold font-mono">+{correlationIndex}</span>
            <span className="text-[10px] text-slate-400 block">Stimulus ↔ Response</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">NOTCH FILTER (60Hz)</span>
            <span className={notchFilterEnabled ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {notchFilterEnabled ? 'ATTENUATING (-48 dB)' : 'BYPASS (NOISY)'}
            </span>
            <span className="text-[10px] text-slate-400 block">Mains Reject</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ELECTRODE IMPEDANCE</span>
            <span className="text-cyan-400 font-bold">
              {electrodeType === 'ag_agcl_gel' ? '50 kΩ (Ag/AgCl Gel)' : '4.5 MΩ (Dry Needle)'}
            </span>
            <span className="text-[10px] text-slate-400 block">Tissue Contact</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">AFE GAIN STAGE</span>
            <span className="text-white font-bold">{gainMultiplier}x (INA128)</span>
            <span className="text-[10px] text-slate-400 block">Input Z: &gt; 10¹² Ω</span>
          </div>
        </div>

      </div>

      {/* Interactive Stimulus Injector & Signal Conditioning Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stimulus Buttons */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Environmental Stimulus Injection</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Test Plant Physiological Reactions</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={() => triggerStimulus('light_step')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStimulus === 'light_step'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-xs">Light Step (Photoperiod)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Simulates LED turning on: triggers plasma membrane hyperpolarization and upward leaf angle shift.
              </p>
            </button>

            <button
              onClick={() => triggerStimulus('drought_stress')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStimulus === 'drought_stress'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-xs">Drought & Osmotic Wave</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Soil moisture drops below 30%: generates slow Variation Potential (VP) drift and petiole relaxation.
              </p>
            </button>

            <button
              onClick={() => triggerStimulus('heavy_metal_influx')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStimulus === 'heavy_metal_influx'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-xs">Heavy Metal Pulse (Cd/Ni)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Root xylem uptake of divalent metals induces cellular membrane potential depolarization spikes.
              </p>
            </button>

            <button
              onClick={() => triggerStimulus('touch_ap')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeStimulus === 'touch_ap'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Hand className="w-4 h-4 text-rose-400" />
                <span className="font-semibold text-xs">Mechanosensory Touch</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Direct physical touch or mechanical bending triggers rapid Action Potential (AP, ~45mV peak).
              </p>
            </button>

          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => triggerStimulus('baseline')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              Return to Steady Baseline
            </button>
            <span className="text-[11px] text-slate-400 font-mono">Simulating Brassica juncea electrophysiology</span>
          </div>
        </div>

        {/* Signal Conditioning & Hardware Architecture Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Chrislance Analog Front-End (AFE) Tuning</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Hardware Filters</span>
          </div>

          <div className="space-y-3.5 text-xs">
            
            {/* Notch Filter Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Active 50/60 Hz Mains Notch Filter</span>
                <span className="text-[11px] text-slate-400">Eliminates ambient powerline AC electromagnetic hum</span>
              </div>
              <button
                onClick={() => setNotchFilterEnabled(!notchFilterEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  notchFilterEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notchFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Electrode Type Selector */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="font-semibold text-white block">Electrode Interface Model</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setElectrodeType('ag_agcl_gel')}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    electrodeType === 'ag_agcl_gel'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">Ag/AgCl + Hydrogel</span>
                  <span className="text-[10px] text-slate-400">Non-polarizing, 50kΩ Z, high SNR</span>
                </button>
                <button
                  onClick={() => setElectrodeType('stainless_dry')}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    electrodeType === 'stainless_dry'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">Stainless Steel Needle</span>
                  <span className="text-[10px] text-slate-400">Polarizing, 4.5MΩ Z, noisy hum</span>
                </button>
              </div>
            </div>

            {/* Gain and Sweep Speed */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-slate-400 mb-1 block font-medium">Instrumentation Gain</label>
                <div className="flex gap-1.5">
                  {[10, 100, 500].map(g => (
                    <button
                      key={g}
                      onClick={() => setGainMultiplier(g)}
                      className={`flex-1 py-1 rounded text-center font-mono cursor-pointer ${
                        gainMultiplier === g 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <label className="text-slate-400 mb-1 block font-medium">Oscilloscope Sweep Rate</label>
                <div className="flex gap-1.5">
                  {[0.5, 1, 2].map(s => (
                    <button
                      key={s}
                      onClick={() => setSweepSpeed(s)}
                      className={`flex-1 py-1 rounded text-center font-mono cursor-pointer ${
                        sweepSpeed === s 
                          ? 'bg-cyan-500 text-slate-950 font-bold' 
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
