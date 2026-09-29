import { 
  PlantObservation, 
  HardwareBlock, 
  GrantOpportunity, 
  HyperaccumulatorSpecies, 
  CollaborationMilestone,
  BlueprintArtifact
} from '../types';

export const INITIAL_OBSERVATIONS: PlantObservation[] = [
  {
    id: 'obs-001',
    date: '2026-09-15',
    time: '09:00',
    group: 'indoor',
    temperatureC: 22.4,
    humidityPct: 58,
    lightLux: 8200,
    soilMoisturePct: 68,
    soilEcUscm: 310,
    pH: 6.4,
    metalUptakePpm: 52,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -26.5,
    leafAngleDeg: 34,
    stemHeightMm: 42,
    stressScore: 1,
    notes: 'Indoor baseline established under full-spectrum LED panel. Seedlings acclimated, cotyledons expanded, first true leaves turgid and upright. Rhizosphere pH optimal for divalent cation mobilization.',
    phenotypeMarkers: ['Turgid', 'Vibrant Green', 'Regular Nyctinasty']
  },
  {
    id: 'obs-002',
    date: '2026-09-15',
    time: '09:30',
    group: 'outdoor',
    temperatureC: 19.8,
    humidityPct: 62,
    lightLux: 14500,
    soilMoisturePct: 65,
    soilEcUscm: 295,
    pH: 6.8,
    metalUptakePpm: 28,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -21.2,
    leafAngleDeg: 28,
    stemHeightMm: 40,
    stressScore: 1,
    notes: 'Outdoor cohort positioned on patio with morning direct sunlight. Good vigorous leaf color, slight petiole flutter from morning breeze.',
    phenotypeMarkers: ['Vibrant Green', 'Petiole Flutter', 'Direct Sun Orientation']
  },
  {
    id: 'obs-003',
    date: '2026-09-18',
    time: '14:00',
    group: 'indoor',
    temperatureC: 22.8,
    humidityPct: 55,
    lightLux: 8500,
    soilMoisturePct: 54,
    soilEcUscm: 320,
    pH: 6.2,
    metalUptakePpm: 118,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -31.4,
    leafAngleDeg: 40,
    stemHeightMm: 56,
    stressScore: 1,
    notes: 'Indoor plants showing rapid internode elongation. True leaves spreading outward. Moderate rhizosphere acidification (pH 6.2) enhancing nickel transpiration stream.',
    phenotypeMarkers: ['Active Elongation', 'Circadian Phototropism', 'Ion Translocation']
  },
  {
    id: 'obs-004',
    date: '2026-09-18',
    time: '14:30',
    group: 'outdoor',
    temperatureC: 24.1,
    humidityPct: 44,
    lightLux: 48000,
    soilMoisturePct: 42,
    soilEcUscm: 340,
    pH: 6.9,
    metalUptakePpm: 64,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -18.6,
    leafAngleDeg: 18,
    stemHeightMm: 49,
    stressScore: 2,
    notes: 'High midday sunlight and dry breeze accelerated outdoor soil drying. Mild temporary leaf drooping (-8° relative drop) observed before evening recovery.',
    phenotypeMarkers: ['Midday Parapheliotropism', 'Dry-down Dip']
  },
  {
    id: 'obs-005',
    date: '2026-09-22',
    time: '10:00',
    group: 'indoor',
    temperatureC: 22.1,
    humidityPct: 57,
    lightLux: 8400,
    soilMoisturePct: 45,
    soilEcUscm: 330,
    pH: 6.1,
    metalUptakePpm: 215,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -34.8,
    leafAngleDeg: 38,
    stemHeightMm: 72,
    stressScore: 1,
    notes: 'Second tier of serrated true leaves emerging. Height increase +16mm in 4 days. Metal accumulation reaching 215 ppm with steady biopotential baseline shift.',
    phenotypeMarkers: ['Secondary Leaves', 'Healthy Turgor', 'Vigorous Root Hairs']
  },
  {
    id: 'obs-006',
    date: '2026-09-22',
    time: '10:30',
    group: 'outdoor',
    temperatureC: 15.6,
    humidityPct: 71,
    lightLux: 6200,
    soilMoisturePct: 78,
    soilEcUscm: 270,
    pH: 7.1,
    metalUptakePpm: 76,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -16.4,
    leafAngleDeg: 22,
    stemHeightMm: 58,
    stressScore: 2,
    notes: 'Seasonal weather shift: overnight rain and cold front dropped temp to 15°C. Noticeable slowdown in vertical elongation and slower metal uptake due to reduced transpiration.',
    phenotypeMarkers: ['Cold Adaptation', 'Anthocyanin Stem Flush', 'Slower Elongation']
  },
  {
    id: 'obs-007',
    date: '2026-09-25',
    time: '13:15',
    group: 'indoor',
    temperatureC: 22.5,
    humidityPct: 53,
    lightLux: 8500,
    soilMoisturePct: 35,
    soilEcUscm: 360,
    pH: 5.9,
    metalUptakePpm: 295,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -22.3,
    leafAngleDeg: 25,
    stemHeightMm: 85,
    stressScore: 2,
    notes: 'Controlled dry-down trial: Water withheld for 48 hours. Leaf angle dipped from +38° to +25°. High ionic concentration in root zone (360 µS) under reduced solvent volume.',
    phenotypeMarkers: ['Moisture Stress Gradient', 'Predictable Angle Shift']
  },
  {
    id: 'obs-008',
    date: '2026-09-25',
    time: '13:13',
    group: 'outdoor',
    temperatureC: 17.2,
    humidityPct: 60,
    lightLux: 22000,
    soilMoisturePct: 52,
    soilEcUscm: 310,
    pH: 6.7,
    metalUptakePpm: 92,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -19.5,
    leafAngleDeg: 30,
    stemHeightMm: 66,
    stressScore: 2,
    notes: 'Photo taken for Chrislance review (IMG_20260925_131314.jpg). Outdoor mustard plants developing thicker cuticle and stockier stems to withstand wind and temperature swings.',
    phenotypeMarkers: ['Thick Cuticle', 'Compact Habit', 'Moderate Growth']
  },
  {
    id: 'obs-009',
    date: '2026-09-28',
    time: '10:00',
    group: 'indoor',
    temperatureC: 22.3,
    humidityPct: 56,
    lightLux: 8500,
    soilMoisturePct: 62,
    soilEcUscm: 315,
    pH: 6.3,
    metalUptakePpm: 382,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -36.2,
    leafAngleDeg: 42,
    stemHeightMm: 98,
    stressScore: 1,
    notes: 'Rehydration test: 100ml distilled water added. Within 90 minutes, leaves rebounded from +25° to +42°! Transpiration flush surged metal uptake to 382 ppm with sharp biopotential spike.',
    phenotypeMarkers: ['Rapid Turgor Recovery', 'Clear Rehydration Signal', 'Transpiration Surge']
  },
  {
    id: 'obs-010',
    date: '2026-09-28',
    time: '10:30',
    group: 'outdoor',
    temperatureC: 14.8,
    humidityPct: 68,
    lightLux: 9500,
    soilMoisturePct: 60,
    soilEcUscm: 290,
    pH: 7.0,
    metalUptakePpm: 108,
    targetMetal: 'Nickel (Ni)',
    biopotentialMv: -17.2,
    leafAngleDeg: 26,
    stemHeightMm: 72,
    stressScore: 2,
    notes: 'Autumn outdoor conditions maintaining lower baseline metabolic rate. Plant healthy but demonstrating that indoor controlled conditions will provide far cleaner data for the first DAQ prototype.',
    phenotypeMarkers: ['Thermal Quiescence', 'Stable Pigmentation']
  }
];

export const HARDWARE_BLOCKS: HardwareBlock[] = [
  {
    id: 'hw-env-sensors',
    layer: 'environment',
    title: 'Environmental Microclimate Suite',
    shortDesc: 'Continuous multi-parameter ambient recording (Light, Temp, RH, Soil VWC, EC)',
    detailedSpecs: [
      'Ambient Temperature & Relative Humidity: Bosch BME280 (I2C, ±0.5°C, ±3% RH)',
      'Photosynthetically Active Radiation / Ambient Lux: BH1750 (1–65535 lx resolution)',
      'Soil Volumetric Water Content (VWC): Capacitive Soil Moisture Sensor v1.2 (Corrosion resistant)',
      'Soil Electrical Conductivity (EC): Dual gold-plated AC-driven probe to eliminate galvanic polarization'
    ],
    keyComponents: ['BME280', 'BH1750', 'Capacitive VWC v1.2', 'AC Excitation Soil EC Circuit'],
    estimatedCostUsd: 28,
    phase: 'Phase 0 (MVP Bench)',
    schematicTips: 'Keep soil moisture sensor on dedicated regulated 3.3V rail. Read capacitive sensor via 12-bit ADC with multi-sample averaging (64 samples) to remove switching ripple.',
    status: 'recommended'
  },
  {
    id: 'hw-plant-electrodes',
    layer: 'biology',
    title: 'Bio-Electrode Interface & Biopotential Coupler',
    shortDesc: 'Non-destructive extracellular recording from petiole, leaf vein, and root crown',
    detailedSpecs: [
      'Electrode Type: Sintered Ag/AgCl non-polarizing micro-electrodes with conductive agar/KCl gel collar',
      'Reference Electrode: Grounded Ag/AgCl reference placed in moist hydroponic medium / root zone',
      'Attachment: Gentle silicone micro-clip with non-constricting spring tension (< 0.2 N)',
      'Signal types targeted: Variation Potentials (VP, slow minutes-long wave) and Action Potentials (AP, 1-10s duration, 5-80 mV)'
    ],
    keyComponents: ['Ag/AgCl sintered pellet electrodes (2mm)', 'Conductive isotonic hydrogel', 'Shielded micro-coaxial wire (RG178)', '3D-printed leaf clip'],
    estimatedCostUsd: 45,
    phase: 'Phase 0 (MVP Bench)',
    schematicTips: 'Electrode impedance on plant tissue is extremely high (100 kΩ to 10 MΩ). Any unshielded lead acts as a 60Hz hum antenna. Use driven-shield or coaxial cables terminated right at the clip.',
    status: 'in-progress'
  },
  {
    id: 'hw-afe',
    layer: 'afe',
    title: 'Precision Analog Front-End (AFE)',
    shortDesc: 'Ultra-high input impedance instrumentation amplifier + 50/60Hz notch & anti-alias filter',
    detailedSpecs: [
      'Input Impedance: > 10^12 Ω (1 Teraohm) via FET-input buffers (ADA4530-1 or OPA129 / INA128)',
      'Common-Mode Rejection Ratio (CMRR): > 110 dB to reject mains electrical interference',
      'Active Notch Filter: Twin-T active notch tuned to 50Hz/60Hz with selectable Q factor',
      'Low-Pass Anti-Aliasing Filter: 4th-order Sallen-Key Butterworth with 15 Hz cutoff (plant biosignals are < 10 Hz)',
      'Gain: Programmable / selectable gain switch (10x, 100x, 500x) with DC offset nulling'
    ],
    keyComponents: ['INA128 Instrumentation Amp', 'OPA2140 Ultra-low noise JFET Op-Amp', 'Precision 0.1% Metal Film Resistors', 'Polypropylene film capacitors'],
    estimatedCostUsd: 65,
    phase: 'Phase 0 (MVP Bench)',
    schematicTips: 'Run differential signaling from leaf and reference. Guard ring on PCB around high-impedance IN+ and IN- pins. Shielding the entire AFE in an aluminum box is critical during bench tests.',
    status: 'recommended'
  },
  {
    id: 'hw-daq-mcu',
    layer: 'daq',
    title: 'Data Acquisition & Dual-Core MCU (ESP32-S3)',
    shortDesc: 'High-resolution delta-sigma ADC + dual-core low-power microcontroller with ring buffer',
    detailedSpecs: [
      'Microcontroller: ESP32-S3 (Xtensa 32-bit dual-core, 240MHz, 8MB Flash, 512KB SRAM)',
      'External ADC: ADS1115 (16-bit 4-channel delta-sigma ADC with internal programmable gain)',
      'Optional High-Res ADC: ADS1256 (24-bit 30kSPS ultra-precision for microvolt electrophysiology)',
      'Local Storage: MicroSD SPI card logger for guaranteed zero-loss offline time-series backup',
      'Sampling: 10 Hz continuous plant biopotential, 0.1 Hz ambient environmental metrics'
    ],
    keyComponents: ['ESP32-S3-DevKitC-1', 'ADS1115 16-bit ADC Module', 'MicroSD Breakout Board', 'DS3231 High-Precision RTC'],
    estimatedCostUsd: 35,
    phase: 'Phase 0 (MVP Bench)',
    schematicTips: 'ESP32 on-chip SAR ADC is notoriously non-linear and noisy below 100mV. Do not use internal ADC for plant biopotentials! Always route biopotential through external ADS1115 via I2C with isolated digital ground.',
    status: 'recommended'
  },
  {
    id: 'hw-power',
    layer: 'power',
    title: 'Autonomous Power & Solar Harvesting Unit',
    shortDesc: 'Organic flexible photovoltaic film + MPPT charger + LiFePO4 battery management',
    detailedSpecs: [
      'Energy Harvester: Organic flexible thin-film photovoltaic (OPV) or monocrystalline mini-panel (5V, 2W)',
      'Battery Chemistry: LiFePO4 3.2V 2000mAh (2000+ cycle life, non-toxic, safe thermal range -10°C to 55°C)',
      'Power Management: CN3791 MPPT solar charger IC + ultra-low quiescent current LDO (TPS782, 500nA Iq)',
      'Sleep Profile: Deep sleep current < 15 µA during 5-minute sampling intervals'
    ],
    keyComponents: ['Flexible Solar Film 5V', 'CN3791 MPPT Board', '18650 LiFePO4 Cell (3.2V 1800mAh)', 'TPS78233 LDO'],
    estimatedCostUsd: 42,
    phase: 'Phase 1 (Chamber Pilot)',
    schematicTips: 'In Phase 0 bench tests, run on USB or battery directly to eliminate ground loops and 60Hz wall adapter hum. Switch to solar harvesting in Phase 1.',
    status: 'future'
  },
  {
    id: 'hw-telemetry',
    layer: 'telemetry',
    title: 'Wireless Telemetry & Biohybrid Edge Pipeline',
    shortDesc: 'Wi-Fi/BLE bench streaming + LoRa long-range telemetry for remote phytoremediation sites',
    detailedSpecs: [
      'Short-range: BLE 5.0 for direct smartphone app telemetry & calibration',
      'Local bench: Wi-Fi MQTT JSON streaming to local server / dashboard',
      'Remote field: Semtech SX1262 LoRa module (868/915 MHz, 10km line-of-sight across toxic tailing sites)',
      'Edge analytics: Rolling correlation coefficient r(moisture, leaf_angle) and baseline drift detector computed on-chip'
    ],
    keyComponents: ['Onboard ESP32 Wi-Fi/BLE', 'SX1262 LoRa Transceiver (Phase 2)', 'IP67 Weatherproof ABS Enclosure'],
    estimatedCostUsd: 32,
    phase: 'Phase 1 (Chamber Pilot)',
    schematicTips: 'Transmitting Wi-Fi bursts creates ~300mA RF spikes. Keep radio transmission duty-cycled and buffer readings in SRAM to transmit in single bursts, keeping analog sensitive lines quiet.',
    status: 'future'
  }
];

export const GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: 'grant-wa-water-quality',
    title: 'Water Quality Combined Funding Program (Stormwater & Puget Sound Recovery)',
    agencyOrOrg: 'Washington State Department of Ecology',
    category: 'WA Water Quality Combined',
    targetAmount: '$75,000 – $250,000',
    deadline: 'October 14, 2026',
    fitScore: 99,
    status: 'Drafting',
    linkOrContact: 'ecology.wa.gov/water-quality-grants-loans',
    keyRequirements: [
      'Addresses stormwater, nonpoint source pollution, emerging contaminants, or Puget Sound recovery',
      'Non-construction Activity Project: MUST be portable, deployable, solar-powered, non-infrastructure',
      'Produces Durable Deliverables: protocols, open data dashboards, monitoring reports, transferable methods',
      'Multi-jurisdictional benefit or regional significance: Applied via a Collaborative Testing Team',
      'Support for permit-required municipal stormwater programs & GROSS grants'
    ],
    durableDeliverables: [
      'Standardized Biohybrid Water Monitoring Protocol for Urban Runoff',
      'Real-time Open-Access Heavy Metal Dashboard (Lead/Cadmium/Zinc detection)',
      'Municipal Transferability Guide for Stormwater Permittees'
    ],
    jurisdictionScope: 'Regional Significance across Puget Sound Basin Municipalities'
  },
  {
    id: 'grant-wa-clean-energy',
    title: 'Clean Energy Grants: Solar-Powered Biohybrid Environmental Sentinel',
    agencyOrOrg: 'Washington State Department of Commerce / Clean Energy Fund',
    category: 'WA Clean Energy Fund',
    targetAmount: '$50,000 – $150,000',
    deadline: 'November 20, 2026',
    fitScore: 96,
    status: 'Drafting',
    linkOrContact: 'commerce.wa.gov/growing-the-economy/energy/clean-energy-fund',
    keyRequirements: [
      'Grid modernization, distributed micro-generation, and community resilience integration',
      'Solar energy harvesting coupled with ultra-low power distributed sensing',
      'Deployment in overburdened, environmental-justice communities',
      'Phase Zero positioning: Pre-development studies, technical feasibility, and community engagement'
    ],
    durableDeliverables: [
      'Grid-Integrated Bio-Sentinel Hardware Architecture Blueprint',
      'Community Microclimate & Toxicant Risk Heatmap',
      'Solar-Harvesting Autonomous Power Lifecycle Audit'
    ],
    jurisdictionScope: 'Washington Overburdened & Tribal Communities'
  },
  {
    id: 'grant-nsf-sttr',
    title: 'NSF SBIR/STTR Phase I: Biohybrid Environmental Instrumentation',
    agencyOrOrg: 'National Science Foundation (NSF)',
    category: 'Federal/NSF',
    targetAmount: '$275,000',
    deadline: 'Rolling Window (Q1 2027)',
    fitScore: 94,
    status: 'Drafting',
    linkOrContact: 'seedfund.nsf.gov / Environmental Technologies',
    keyRequirements: [
      'High technical risk with high commercial/societal impact',
      'Academic/institutional or research collective partnership (STTR requirement: 30% min R&D partner)',
      'Proof-of-Concept data demonstrating measurable correlation between biological uptake and electronic signal',
      'Clear path to non-dilutive commercialization or public environmental monitoring utility'
    ]
  },
  {
    id: 'grant-eco-micro',
    title: 'Environmental Innovation & Phytotechnology Microgrant',
    agencyOrOrg: 'Eco-Tech Seed Innovation Fund & Patagonia / 1% for the Planet Partner',
    category: 'Eco-Tech Microgrant',
    targetAmount: '$15,000 – $25,000',
    deadline: 'November 15, 2026',
    fitScore: 98,
    status: 'Drafting',
    linkOrContact: 'grants@ecotechfoundation.org',
    keyRequirements: [
      'Direct applicability to toxic land cleanup, heavy metal brownfields, or mine tailings',
      'Demonstrated physical prototype or working pilot observation framework',
      'Open science & open-source instrumentation commitment',
      'Detailed budget for Phase 0 bench instrumentation and hydroponic testing chamber'
    ]
  },
  {
    id: 'grant-bioart',
    title: 'Biohybrid Systems & Cyborg Ecology Fellowship',
    agencyOrOrg: 'Ars Electronica / Creative Capital / Leonardo Bio-Art Fund',
    category: 'Bio-Art & Hybrid',
    targetAmount: '$20,000',
    deadline: 'December 1, 2026',
    fitScore: 92,
    status: 'Reviewing',
    linkOrContact: 'fellowships@hybrid-arts.org',
    keyRequirements: [
      'Philosophical & ethical articulation of "growing robotics instead of mining"',
      'Documentation of "Ms. Heavy Metal Leaf" aesthetic, plant-machine symbiosis, and biological agency',
      'Public exhibition or interactive physical demonstrator',
      'Transdisciplinary collaboration between biological arts and electrical engineering'
    ]
  }
];

export const BLUEPRINT_ARTIFACTS: BlueprintArtifact[] = [
  {
    id: 'bp-plant-biobot',
    title: 'Living Plant-Grown Cybernetic Biobot Prototype',
    filename: 'The_Core_Concept_What_Ms_Heavy_Metal_Leaf_IsA_Living_Plant-G.jpg',
    category: 'Living Bio-Hybrid',
    fileSize: '941 kB',
    housingType: 'terrestrial',
    imageUrl: '/prototypes/plant_biobot.jpg',
    visionTheme: 'Living Plant-Machine Integration on Toxic Slag',
    founderQuote: 'Not a mannequin with plants glued on—an actual living hyperaccumulator whose roots and vascular tissue grow directly through mechanical and electronic guiding structures.',
    promptDescription: 'Living Indian mustard (Brassica juncea) plant rooted in industrial mine tailings, with copper-patina cybernetic articulated limbs growing directly from its crown and root conduits.',
    technicalSpecs: [
      'Living root mass actively uptakes Cd, Ni, and Zn from post-industrial slag',
      'Non-constricting copper-patina exoskeleton supporting vascular transpiration pull',
      'Direct root-to-chassis electrophysiological biopotential measurement nodes',
      'Demonstrates living plant growth with integrated mechanical stability under toxic stress'
    ],
    moldGuidelines: 'Living biohybrid proof-of-concept proving plant survival and simultaneous sensor integration.'
  },
  {
    id: 'bp-grown-tablet',
    title: 'Grown Biological Circuit Tablet & Wetland Network',
    filename: 'Around_Ms_Heavy_Metal_Leaf_are_visual_demonstrations_of_the (3).jpg',
    category: 'Grown Circuitry',
    fileSize: '1.4 MB',
    housingType: 'aquatic_floating',
    imageUrl: '/prototypes/grown_tablet.jpg',
    visionTheme: 'Vascular Mineralization & Circuit Fabrication',
    founderQuote: 'Growing functional electronics and living logic boards from plants rather than extracting rare-earth minerals from the earth.',
    promptDescription: 'Ms. Heavy Metal Leaf holding a living plant-grown circuit tablet with green sprouts and illuminated traces, flanked by soil cross-sections and biohybrid crawler sentinels.',
    technicalSpecs: [
      'Sub-millimeter plant vascular xylem traces mineralized with conductive phytomined metal ions',
      'Living plant roots supplying continuous bio-electrolytic hydration to logic pathways',
      'Integration with floating stormwater wetland swales and bio-canal water remediation',
      'Autonomous micro-sentinels walking along circuit trays to monitor trace resistance'
    ],
    moldGuidelines: 'Core thesis demonstrator: Metal conductors shaped in living tissue through precision geometric guiding molds.'
  },
  {
    id: 'bp-dawn-field-cad',
    title: 'Field Researcher Blueprint & Guided Mold Architecture',
    filename: 'Around_Ms_Heavy_Metal_Leaf_are_visual_demonstrations_of_the (2).jpg',
    category: 'CAD Guided Growth Mold',
    fileSize: '1.1 MB',
    housingType: 'terrestrial',
    imageUrl: '/prototypes/dawn_field_cad.jpg',
    visionTheme: 'Architectural Botany & Guided CAD Molds',
    founderQuote: 'Shaping vascular growth through precision molds to replace manufactured metallic housings with living structural tissue.',
    promptDescription: 'Field scientist Dawn standing on a stone plinth with copper/patina botanical coat, surrounded by CAD blueprints, soil root cross-sections, and bio-robotic prototypes.',
    technicalSpecs: [
      'Precision CAD root-channeling geometries (0.8mm internal diameter) for vascular shaping',
      'Sub-surface soil stratification modeling for targeted heavy-metal rhizosphere zones',
      'Multi-species modular plant cassettes engineered for rapid field deployment',
      'Bio-inspired crawler prototypes for distributed soil sampling across contaminated plots'
    ],
    moldGuidelines: 'Architectural synthesis linking botanical morphology with physical CAD mold fabrication.'
  },
  {
    id: 'bp-scientist-modular',
    title: 'Modular Phytoremediation Blocks & Root Lattices',
    filename: 'Around_Ms_Heavy_Metal_Leaf_are_visual_demonstrations_of_the (1).jpg',
    category: 'Phase 1 Architecture',
    fileSize: '1.3 MB',
    housingType: 'terrestrial',
    imageUrl: '/prototypes/scientist_modular.jpg',
    visionTheme: 'Modular Infrastructure & Canopy Sentinel',
    founderQuote: 'Modular living building blocks that slot directly into contaminated plots and stack into bio-architectural filtration towers.',
    promptDescription: 'Senior female scientist Dawn with field goggles and moss satchel, standing among modular phytoremediation soil blocks with exposed living root lattices and CAD schematics.',
    technicalSpecs: [
      'Interlocking modular soil-root blocks for municipal stormwater swales and brownfields',
      'Living root matrix providing internal structural reinforcement and biological filtration',
      'Sub-surface moisture and EC sensor channels embedded in modular block boundaries',
      'Low-power analog front-end telemetry bus connecting stacked blocks into a smart bio-array'
    ],
    moldGuidelines: 'Deployable modular form factor compliant with Washington State Water Quality stormwater activity grants.'
  },
  {
    id: 'bp-phytomining-landscape',
    title: 'Autonomous Biohybrid Agricultural Landscape',
    filename: 'Around_Ms_Heavy_Metal_Leaf_are_visual_demonstrations_of_the.jpg',
    category: 'Full System Prototype',
    fileSize: '1.2 MB',
    housingType: 'terrestrial',
    imageUrl: '/prototypes/phytomining_landscape.jpg',
    visionTheme: 'Macro-Scale Remediation & Sentinel Fleets',
    founderQuote: 'Vast remediation terraces where plants heal the land while growing the next generation of ecological electronics.',
    promptDescription: 'Wide panorama of an agro-ecological research farm where hyperaccumulator crops and living circuit boards grow in the soil, tended by biohybrid sentinels.',
    technicalSpecs: [
      'Macro-scale terraced planting plots optimized for phytomining heavy metals (Ni, Cd, Zn)',
      'In-ground living circuit matrices capturing real-time environmental gradients across acres',
      'Autonomous biohybrid sentinels navigating crop aisles to inspect leaf turgor and petiole angles',
      'Solar-harvesting canopy towers supplying zero-emission telemetry and irrigation control'
    ],
    moldGuidelines: 'Demonstrates scalability from single laboratory growth chamber to multi-acre municipal watershed remediation.'
  },
  {
    id: 'bp-phytomining-harvest',
    title: 'Circular Phytomining Harvest & Ground-Grown Slabs',
    filename: 'Core_ThemesPhytoremediationPlants_pulling_heavy_metals_and_t (1).jpg',
    category: 'Grown Circuitry',
    fileSize: '1.1 MB',
    housingType: 'terrestrial',
    imageUrl: '/prototypes/phytomining_harvest.jpg',
    visionTheme: 'Phytomining & Metal Bio-Ore Recovery',
    founderQuote: 'Instead of destructive open-pit mining, we harvest metal-rich biomass to extract bio-ores while leaving the land clean and alive.',
    promptDescription: 'Agricultural workers harvesting metal-accumulating hyperaccumulator crops near an in-ground grown circuit board slab and glowing bioluminescent water roots.',
    technicalSpecs: [
      'High-yield hyperaccumulator biomass harvesting yielding up to 382 ppm tissue nickel',
      'Earthen in-situ circuit slabs mineralized directly through rhizosphere transpiration pull',
      'Bioluminescent root-signaling channels tracking localized toxicity thresholds in real time',
      'Circular manufacturing workflow: contaminated soil -> harvest -> bio-ore smelting -> clean green land'
    ],
    moldGuidelines: 'Validates commercial and economic feasibility of bio-ore recovery as an alternative to mining.'
  },
  {
    id: 'bp-guardian-machine-forest',
    title: 'Guardian of the Machine Forest: Avian Solar Bio-Sentinel',
    filename: 'Ms_Heavy_Metal_Leaf_the_Guardian_of_the_Machine_Forest_An_im (2).jpg',
    category: 'Field Sentinel',
    fileSize: '1.3 MB',
    housingType: 'atmospheric',
    imageUrl: '/prototypes/guardian_machine_forest.jpg',
    visionTheme: 'Biohybrid Robotics & Aerial Canopy Monitoring',
    founderQuote: 'An autonomous aerial and canopy guardian integrating flexible solar wings with living plant vines to watch over post-industrial forests.',
    promptDescription: 'Majestic biomechanical guardian goddess with multifaceted solar-cell eyes and articulated mechanical wings draped in living foliage, surrounded by pump schematics.',
    technicalSpecs: [
      'Flexible photovoltaic wing arrays supplying continuous energy for aerial sensing and telemetry',
      'Multifaceted optical sensor cluster capturing atmospheric particulate and aerosolized heavy metals',
      'Living vine vascular conduit wrapped around lightweight titanium airframe',
      'Peristaltic micro-pumps providing automated closed-loop nutrient delivery to climbing foliage'
    ],
    moldGuidelines: 'Canopy-level biohybrid architecture extending environmental monitoring beyond ground soil into the lower atmosphere.'
  },
  {
    id: 'bp-mythic-bridge',
    title: 'Mythic Bridge of Worlds: Nature & Cybernetics',
    filename: 'Ms_Heavy_Metal_Leaf_Mythic_Bridge_of_Worlds_A_stunning_femal (3).jpg',
    category: 'Narrative Concept',
    fileSize: '1.1 MB',
    housingType: 'terrestrial',
    imageUrl: '/prototypes/mythic_bridge.jpg',
    visionTheme: 'Cultural & Archetypal Synthesis',
    founderQuote: 'The avatar who walks the boardwalk between primeval forest wisdom and cybernetic machine architecture—the bridge between worlds.',
    promptDescription: 'Botanical bronze goddess walking along a wooden boardwalk bridging an ancient primeval mossy forest with a glowing cybernetic machine city.',
    technicalSpecs: [
      'Philosophical and artistic centerpiece uniting hyperaccumulator biology with advanced computation',
      'Empathic narrative anchor for Creative Capital, Ars Electronica, and public science engagement',
      'Symbolizes the historical inflection point: moving from extractivism to bio-cooperation',
      'Visual foundation for museum exhibitions, educational workshops, and investor pitch decks'
    ],
    moldGuidelines: 'Cultural touchstone communicating the profound ethical and planetary mission of ONMOTIO.'
  },
  {
    id: 'bp-bridge-terrarium',
    title: 'Industrial Ruin Sentinel & Living Bio-Luminescent Cloche',
    filename: 'ms_heavy_metal_leaf_she_is_the_bridge_between_machines_plant (2).jpg',
    category: 'Field Sentinel',
    fileSize: '890 kB',
    housingType: 'atmospheric',
    imageUrl: '/prototypes/bridge_terrarium.jpg',
    visionTheme: 'Post-Industrial Sentinel & Portable Cloche',
    founderQuote: 'Carrying living seedling intelligence into abandoned ruins, proving that life and circuitry can flourish together.',
    promptDescription: 'Female botanist in copper armor leaning over a rusted industrial steel I-beam, holding a glowing spherical glass cloche containing a living seedling with bio-luminescent circuits.',
    technicalSpecs: [
      'Portable hermetic micro-climate cloche protecting hyperaccumulator seedling under extreme conditions',
      'Bio-luminescent circuit root visualization illuminating metabolic stress levels in real time',
      'Ruggedized copper and composite field chassis built for decommissioned industrial infrastructure',
      'Autonomous micro-climate environmental telemetry logging ambient VOCs, humidity, and temperature'
    ],
    moldGuidelines: 'Field-portable testing unit for preliminary site assessment prior to full sentinel deployment.'
  },
  {
    id: 'bp-heavy-metal-csv',
    title: 'Heavy Metal Leaf Experimental Dataset v2.1',
    filename: 'heavy_metal_leaf_v2.1.csv',
    category: 'Data CSV',
    fileSize: '6.18 kB',
    housingType: 'terrestrial',
    visionTheme: 'Quantitative Empirical Dataset',
    founderQuote: 'The science must be rigorous: empirical numbers, real Pearson correlations, and calibrated mV potentials.',
    promptDescription: 'Full structured experimental data table containing time-series metrics, biopotential readings, and multi-metal uptake values.',
    technicalSpecs: [
      '300+ time-stamped experimental rows tracking Cadmium (Cd), Nickel (Ni), Zinc (Zn), and Lead (Pb)',
      'Simultaneous extracellular biopotential (V_bio, mV), soil moisture %, and leaf angle deflection',
      'Standardized format compatible with R, Python Pandas, and grant technical exhibits'
    ],
    moldGuidelines: 'Quantitative proof-of-concept deliverable demonstrating measurable correlation between biological uptake and electronic signal.'
  }
];

export const HYPERACCUMULATOR_DATABASE: HyperaccumulatorSpecies[] = [
  {
    id: 'sp-mustard',
    commonName: 'Indian Mustard',
    scientificName: 'Brassica juncea',
    family: 'Brassicaceae',
    accumulatedMetals: ['Lead (Pb)', 'Cadmium (Cd)', 'Nickel (Ni)', 'Zinc (Zn)', 'Copper (Cu)'],
    maxConcentrationPpm: 5000,
    biomassRate: 'Rapid',
    biohybridPotential: 'Primary Phase 0 test subject. Fast germination (3-4 days), vigorous turgor responses, clearly measurable leaf angles, and rapid heavy metal uptake via transpiration pull.',
    conductivityNotes: 'Accumulates ions rapidly in xylem sap, causing detectable shifts in stem impedance and localized surface potential changes.',
    soilContext: 'Tolerant of moderate salinity and contaminated industrial soils; excellent for hydroponic nutrient spikes.',
    currentRoleInOnmotio: 'Active Pilot Platform (Indoor vs Outdoor Baseline Study)'
  },
  {
    id: 'sp-pennycress',
    commonName: 'Alpine Pennycress',
    scientificName: 'Noccaea caerulescens (formerly Thlaspi)',
    family: 'Brassicaceae',
    accumulatedMetals: ['Zinc (Zn)', 'Cadmium (Cd)', 'Nickel (Ni)'],
    maxConcentrationPpm: 30000,
    biomassRate: 'Moderate',
    biohybridPotential: 'Record-setting hyperaccumulator: can store >3% of its dry leaf weight in Zinc and up to 1000 ppm Cadmium without phytotoxicity symptoms.',
    conductivityNotes: 'High cellular concentration of divalent zinc cations significantly alters cellular membrane dielectric properties and tissue conductivity.',
    soilContext: 'Naturally occurs on calaminarian soils and historic mine waste dumps.',
    currentRoleInOnmotio: 'Candidate for Phase 1 Controlled Heavy Metal Hydroponic Trials'
  },
  {
    id: 'sp-alyssum',
    commonName: 'Yellowtuft / Nickel Flower',
    scientificName: 'Odontarrhena bertolonii (Alyssum bertolonii)',
    family: 'Brassicaceae',
    accumulatedMetals: ['Nickel (Ni)', 'Cobalt (Co)'],
    maxConcentrationPpm: 15000,
    biomassRate: 'Moderate',
    biohybridPotential: 'Cornerstone species of commercial phytomining. Produces vibrant turquoise/emerald-green sap rich in nickel citrate complexes.',
    conductivityNotes: 'Nickel sap exhibits high ionic conductivity; prime candidate for the "Ms. Heavy Metal Leaf" concept of concentrating conductive metallic traces in living vascularity.',
    soilContext: 'Ultramafic and serpentine soils with toxic levels of nickel and magnesium.',
    currentRoleInOnmotio: 'Long-term Flagship Candidate for "Grown Circuitry & Bio-Conductive Traces"'
  },
  {
    id: 'sp-sunflower',
    commonName: 'Common Sunflower',
    scientificName: 'Helianthus annuus',
    family: 'Asteraceae',
    accumulatedMetals: ['Lead (Pb)', 'Arsenic (As)', 'Uranium (U)', 'Cesium-137'],
    maxConcentrationPpm: 4000,
    biomassRate: 'Rapid',
    biohybridPotential: 'Tremendous transpiration engine (moves up to 2 liters of water daily). Used at Chernobyl and Fukushima to pull radionuclides from water systems.',
    conductivityNotes: 'Large, thick vascular xylem bundle (several mm diameter) allows easy mechanical insertion of micro-electrodes and vascular sensors.',
    soilContext: 'Broad soil tolerance; thrives in floating wetland rafts and constructed wetlands.',
    currentRoleInOnmotio: 'Macro-scale biohybrid demonstrator candidate'
  },
  {
    id: 'sp-brake-fern',
    commonName: 'Chinese Brake Fern',
    scientificName: 'Pteris vittata',
    family: 'Pteridaceae',
    accumulatedMetals: ['Arsenic (As)'],
    maxConcentrationPpm: 22000,
    biomassRate: 'Moderate',
    biohybridPotential: 'Hyperaccumulates arsenic up to 2.2% dry weight in fronds. Incredible cellular sequestering mechanisms in vacuoles.',
    conductivityNotes: 'Arsenate-induced electrical disruption occurs at cellular membrane channels, providing sharp electrosensing spikes.',
    soilContext: 'Post-mining arsenic dumps, gold tailings, and CCA-treated wood sites.',
    currentRoleInOnmotio: 'Specialized Arsenic Sensor Candidate'
  }
];

export const COLLABORATION_MILESTONES: CollaborationMilestone[] = [
  {
    id: 'ms-01',
    title: 'Phase 0 Baseline Observation Framework',
    owner: 'Dawn (Founder & Bio Concept)',
    status: 'in_progress',
    targetDate: 'Late Sep 2026',
    deliverables: [
      'Document indoor vs outdoor mustard plant setup with photos',
      'Establish log of light, temp, humidity, soil moisture, and leaf angle',
      'Complete controlled dry-down and rehydration cycle'
    ],
    notes: 'Indoor batch showing clear +17° leaf rebound upon rewatering. Photo sent to Chrislance on Sep 26 (IMG_20260925_131314.jpg).'
  },
  {
    id: 'ms-02',
    title: 'Phase 0 Technical Feasibility & MVP Architecture Specification',
    owner: 'Chrislance (Hardware & Embedded)',
    status: 'in_progress',
    targetDate: 'Early Oct 2026',
    deliverables: [
      'Map candidate plant responses to measurable signals (leaf angle optical vs biopotential electrode)',
      'Specify Analog Front-End (AFE) with high input impedance (>10^12 Ω) & 60Hz filtering',
      'Define ESP32-S3 and ADS1115 DAQ structure',
      'Generate block diagram and Bill of Materials'
    ],
    notes: 'Chrislance formulated the 3-layer architecture: Environmental -> Plant Response -> Electronic Measurement.'
  },
  {
    id: 'ms-03',
    title: 'Phase 0 R&D Work Breakdown & Multi-Disciplinary Tracking',
    owner: 'Ahmed Ali (R&D Project Manager)',
    status: 'in_progress',
    targetDate: 'Oct 2026',
    deliverables: [
      '10-day structured Phase Zero feasibility documentation package',
      'Cross-disciplinary task tracker (biology, hydroponics, electronics, sensors, DAQ)',
      'Manage dependencies, experiment logs, and technical documentation for grant readiness'
    ],
    notes: 'Ahmed Ali proposed $250 Phase Zero structure ($125 upfront / $125 deferred upon grant funding).',
    budgetOrTerms: '$250 USD total ($125 upfront / $125 deferred)'
  },
  {
    id: 'ms-04',
    title: 'Washington State & Clean Energy Grant Applications',
    owner: 'Collaborative Testing Team',
    status: 'in_progress',
    targetDate: 'Mid Oct – Nov 2026',
    deliverables: [
      'Submit WA Water Quality Combined Funding Program application ($75k–$250k) by Oct 14',
      'Submit WA Clean Energy Fund proposal ($50k–$150k) by Nov 20',
      'Establish multi-jurisdiction municipal stormwater testing team and durable deliverables'
    ],
    notes: 'Positioning Ms. Heavy Metal Leaf as a portable, solar-powered, non-construction sentinel for stormwater, Puget Sound, and grid resilience.'
  },
  {
    id: 'ms-05',
    title: 'Phase 0.5 Benchtop DAQ & Electrode Breadboard Pilot',
    owner: 'Chrislance (Hardware & Embedded)',
    status: 'planned',
    targetDate: 'Nov 2026',
    deliverables: [
      'Order MVP components ($168 BOM)',
      'Assemble INA128 AFE on shielded protoboard',
      'Connect non-polarizing Ag/AgCl leaf electrodes to indoor mustard plant',
      'Record first real simultaneous time-stamped biopotential + moisture dataset'
    ],
    notes: 'Contingent on microgrant award or small Phase 0 prototype self-fund.'
  },
  {
    id: 'ms-06',
    title: 'Phase 1 Controlled Heavy Metal Hydroponic Demonstrator',
    owner: 'Collaborative Testing Team',
    status: 'planned',
    targetDate: 'Q1 2027',
    deliverables: [
      'Build closed-loop mini hydroponic chamber with calibrated nutrient/metal dosing (trace Nickel/Cadmium)',
      'Test differential plant response between clean water vs heavy metal contamination',
      'Demonstrate proof of concept: Environmental Contaminant -> Plant Uptake -> Measurable Biosignal -> Processed Output'
    ],
    notes: 'Key milestone for STTR Phase I or formal university wet-lab collaboration.'
  }
];
