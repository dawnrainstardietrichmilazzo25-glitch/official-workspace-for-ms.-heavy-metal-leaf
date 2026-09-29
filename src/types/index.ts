export type ActiveTab = 
  | 'dashboard'
  | 'analytics'
  | 'observations'
  | 'simulator'
  | 'architecture'
  | 'blueprints'
  | 'grants'
  | 'phytomining'
  | 'collaboration';

export type PlantGroup = 'indoor' | 'outdoor';

export type ModularHousingType = 'terrestrial' | 'aquatic_floating' | 'atmospheric';

export interface PlantObservation {
  id: string;
  date: string;
  time: string;
  group: PlantGroup;
  temperatureC: number;
  humidityPct: number;
  lightLux: number;
  soilMoisturePct: number;
  soilEcUscm?: number;
  pH: number; // Rhizosphere / Hydroponic solution pH (e.g. 5.5 - 7.5)
  metalUptakePpm: number; // Target heavy metal concentration in tissue (ppm)
  targetMetal?: string; // Primary metal tracked, e.g. 'Nickel (Ni)', 'Cadmium (Cd)', 'Zinc (Zn)'
  biopotentialMv?: number; // Extracellular tissue biopotential in mV
  leafAngleDeg: number; // 0 = horizontal, +45 = upright (turgid), -30 = wilting drooping
  stemHeightMm: number;
  stressScore: number; // 1 (optimal vibrant) to 5 (severe stress/wilting)
  notes: string;
  photoUrl?: string;
  phenotypeMarkers: string[];
}

export interface HardwareBlock {
  id: string;
  layer: 'environment' | 'biology' | 'afe' | 'daq' | 'power' | 'telemetry';
  title: string;
  shortDesc: string;
  detailedSpecs: string[];
  keyComponents: string[];
  estimatedCostUsd: number;
  phase: 'Phase 0 (MVP Bench)' | 'Phase 1 (Chamber Pilot)' | 'Phase 2 (Autonomous Field Node)';
  schematicTips: string;
  status: 'recommended' | 'in-progress' | 'future';
}

export interface GrantOpportunity {
  id: string;
  title: string;
  agencyOrOrg: string;
  category: 
    | 'WA Water Quality Combined' 
    | 'WA Clean Energy Fund' 
    | 'Federal/NSF' 
    | 'Eco-Tech Microgrant' 
    | 'Bio-Art & Hybrid' 
    | 'Community Environmental';
  targetAmount: string;
  deadline: string;
  fitScore: number; // 0-100
  status: 'Drafting' | 'Reviewing' | 'Submitted' | 'Identified';
  linkOrContact: string;
  keyRequirements: string[];
  durableDeliverables?: string[];
  jurisdictionScope?: string;
}

export interface BlueprintArtifact {
  id: string;
  title: string;
  filename: string;
  category: 'CAD Guided Growth Mold' | 'Phase 1 Architecture' | 'Full System Prototype' | 'Narrative Concept' | 'Data CSV';
  fileSize: string;
  housingType: ModularHousingType;
  promptDescription: string;
  technicalSpecs: string[];
  moldGuidelines: string;
}

export interface HyperaccumulatorSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  accumulatedMetals: string[];
  maxConcentrationPpm: number;
  biomassRate: 'Rapid' | 'Moderate' | 'Slow';
  biohybridPotential: string;
  conductivityNotes: string;
  soilContext: string;
  currentRoleInOnmotio: string;
}

export interface CollaborationMilestone {
  id: string;
  title: string;
  owner: 
    | 'Dawn (Founder & Bio Concept)' 
    | 'Chrislance (Hardware & Embedded)' 
    | 'Ahmed Ali (R&D Project Manager)' 
    | 'Collaborative Testing Team';
  status: 'completed' | 'in_progress' | 'planned';
  targetDate: string;
  deliverables: string[];
  notes: string;
  budgetOrTerms?: string;
}

