export type ContributionType = 
  | 'Research Notes'
  | 'Hypotheses'
  | 'Questions'
  | 'Datasets'
  | 'Experiment Logs'
  | 'CAD Files'
  | 'Images'
  | 'Field Observations'
  | 'Sensor Data'
  | 'Literature Reviews'
  | 'Funding Opportunities'
  | 'Project Updates'
  | 'Collaboration Requests'
  | 'Lessons Learned';

export type VisibilityOption = 'Public' | 'Project Team' | 'Research Circle' | 'Private';

export type ReputationRole = 
  | 'Member'
  | 'Contributor'
  | 'Research Contributor'
  | 'Project Lead'
  | 'Subject Matter Expert'
  | 'Advisor';

export type EpistemicLifecycleStage = 
  | '🟢 Verified Science'
  | '🟡 Experimental'
  | '🔷 Emerging'
  | '🟣 Future Concept';

export interface CardComment {
  id: string;
  author: string;
  authorRole: ReputationRole;
  authorOrg: string;
  text: string;
  createdAt: string;
  upvotes: number;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  author: string;
  authorRole: ReputationRole;
  authorOrg: string;
  contributionType: ContributionType;
  visibility: VisibilityOption;
  status: EpistemicLifecycleStage;
  tags: string[];
  summary: string;
  content: string;
  metrics: {
    comments: number;
    collaborators: number;
    relatedProjects: number;
    upvotes: number;
    forks: number;
  };
  forkedFrom?: {
    id: string;
    title: string;
    version: string;
  };
  version: string;
  createdAt: string;
  comments: CardComment[];
}

export interface CommunityActivityItem {
  id: string;
  author: string;
  authorRole: string;
  action: string;
  target: string;
  timeAgo: string;
  category: 'experiment' | 'fork' | 'discussion' | 'dataset' | 'review';
  badgeColor: string;
  linkedCardId: string;
}

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  type: 'Person' | 'Project' | 'Experiment' | 'Dataset' | 'Technology' | 'Organization' | 'Funding';
  categoryColor: string;
  description: string;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relationship: string;
}

export interface AutoEvolutionTrigger {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  sourceEvent: string;
  resultingAction: string;
  status: 'PROCESSED' | 'QUEUED' | 'ANALYZING';
  matchedEntities: string[];
}

export const INITIAL_KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'kc-mustard-baseline',
    title: 'Phase 0 Mustard Plant Petiole Deflection & Soil VWC Correlation',
    author: 'Dawn',
    authorRole: 'Project Lead',
    authorOrg: 'Heavy Metal Leaf Initiative',
    contributionType: 'Experiment Logs',
    visibility: 'Public',
    status: '🟢 Verified Science',
    tags: ['Brassica juncea', 'Soil Moisture', 'Petiole Angle', 'Empirical Data'],
    summary: 'Empirically verified correlation (r = +0.89) between soil volumetric water content and leaf angle elevation. Documented +17° rehydration recovery within 90 minutes post-watering in living mustard plants.',
    content: 'Full empirical test conducted across indoor and outdoor growth containers. Quantitative parameters tracked: soil volumetric water content (% VWC), ambient lux, relative humidity, and physical petiole elevation angle measured with precision angle calipers. Shows consistent, repeatable turgor response before and after watering.',
    metrics: {
      comments: 6,
      collaborators: 4,
      relatedProjects: 2,
      upvotes: 28,
      forks: 3
    },
    version: 'v1.2-VERIFIED',
    createdAt: 'Sep 26, 2026',
    comments: [
      {
        id: 'c-1',
        author: 'Chrislance',
        authorRole: 'Subject Matter Expert',
        authorOrg: 'Hardware & Embedded Engineering',
        text: 'The connection between your indoor/outdoor mustard observations and the proposed electronic measurement system is a solid practical starting point. In our Phase 0 review, we will ensure our AFE baseline matches this exact physical response.',
        createdAt: 'Sep 29, 2026',
        upvotes: 5
      },
      {
        id: 'c-2',
        author: 'Ahmed Ali',
        authorRole: 'Project Lead',
        authorOrg: 'R&D Operations',
        text: 'This dataset is the cornerstone for our NSF Phase 1 proposal technical exhibit. Clear, empirical, and grounded in real biology.',
        createdAt: 'Sep 28, 2026',
        upvotes: 3
      }
    ]
  },
  {
    id: 'kc-ina128-afe',
    title: 'Proposed Ultra-High Impedance Analog Front-End (TI INA128)',
    author: 'Chrislance',
    authorRole: 'Subject Matter Expert',
    authorOrg: 'Hardware & Embedded Engineering',
    contributionType: 'Research Notes',
    visibility: 'Public',
    status: '🟡 Experimental',
    tags: ['INA128', 'Analog Front-End', 'High-Z', 'Passive Measurement', 'TVS Diodes'],
    summary: 'Proposed instrumentation circuit design utilizing the Texas Instruments INA128 (>10¹² Ω input impedance, <2 nA bias current) with passive listening, active driven guard shielding, and 60Hz notch filtering. Awaiting bench breadboard validation.',
    content: 'Circuit topology designed to measure microvolt biopotentials from living plant petioles without drawing disruptive currents. Features low-leakage Schottky/TVS diode clamps (<0.3V) to protect plants from electrical overstress, combined with galvanic isolation from mains power.',
    metrics: {
      comments: 4,
      collaborators: 3,
      relatedProjects: 1,
      upvotes: 19,
      forks: 2
    },
    version: 'v1.0-PROPOSED',
    createdAt: 'Sep 28, 2026',
    comments: [
      {
        id: 'c-3',
        author: 'Dawn',
        authorRole: 'Project Lead',
        authorOrg: 'Heavy Metal Leaf Initiative',
        text: 'Crucial priority: ensure we never shock or harm the plants with voltage. The TVS clamping and passive mode give us the protection we need.',
        createdAt: 'Sep 29, 2026',
        upvotes: 4
      }
    ]
  },
  {
    id: 'kc-guided-molds',
    title: 'Guided-Growth CAD Molds for Vascular Xylem Shaping',
    author: 'Clément S',
    authorRole: 'Contributor',
    authorOrg: 'ONMOTIO London Design Studio',
    contributionType: 'CAD Files',
    visibility: 'Public',
    status: '🔷 Emerging',
    tags: ['CAD', 'Guided Growth', 'Xylem Shaping', 'Cyborg Botany'],
    summary: 'Two-part clamshell biocompatible resin molds engineered to physically constrain root and stem growth into predefined linear conduits for conductive trace formation.',
    content: 'Laboratory protocol exploring whether growing Brassica stems can be guided through 0.8mm internal micro-channels without inducing vascular necrosis or cell constriction. Aeration slots allow continuous gas exchange.',
    metrics: {
      comments: 3,
      collaborators: 2,
      relatedProjects: 1,
      upvotes: 14,
      forks: 1
    },
    version: 'v1.0-EXPLORATORY',
    createdAt: 'Sep 27, 2026',
    comments: [
      {
        id: 'c-4',
        author: 'Dawn',
        authorRole: 'Project Lead',
        authorOrg: 'Heavy Metal Leaf Initiative',
        text: 'The physical shape of Ms. Heavy Metal Leaf is alterable for real-world optimization: these molds reshape her into modular floating rafts and vertical soil columns.',
        createdAt: 'Sep 28, 2026',
        upvotes: 3
      }
    ]
  },
  {
    id: 'kc-avatar-vision',
    title: 'Ms. Heavy Metal Leaf: The Archetypal Avatar & Cultural Myth',
    author: 'Dawn',
    authorRole: 'Project Lead',
    authorOrg: 'Heavy Metal Leaf Initiative',
    contributionType: 'Hypotheses',
    visibility: 'Public',
    status: '🟣 Future Concept',
    tags: ['Avatar', 'Mythic Bridge', 'Bio-Art', 'Future Vision', 'Planetary Healing'],
    summary: 'The original intuitive aesthetic vision of Ms. Heavy Metal Leaf as a humanoid guardian bridging plant biology, human intention, cybernetics, and mythology. Not a literal plastic robot, but a living philosophical anchor.',
    content: 'Artistic and visionary manifesto exploring the transition from extractivist open-pit mining to circular phytomining and living grown bio-circuitry. Serves as the cultural and narrative foundation for public engagement, bio-art fellowships, and planetary healing.',
    metrics: {
      comments: 8,
      collaborators: 5,
      relatedProjects: 3,
      upvotes: 35,
      forks: 4
    },
    version: 'v1.0-VISION',
    createdAt: 'Sep 25, 2026',
    comments: [
      {
        id: 'c-5',
        author: 'Ahmed Ali',
        authorRole: 'Project Lead',
        authorOrg: 'R&D Operations',
        text: 'This vision provides the emotional heartbeat that sets ONMOTIO apart in high-impact grant proposals.',
        createdAt: 'Sep 26, 2026',
        upvotes: 6
      }
    ]
  }
];

export const INITIAL_COMMUNITY_ACTIVITIES: CommunityActivityItem[] = [
  {
    id: 'act-1',
    author: 'Chrislance',
    authorRole: 'Hardware Engineer',
    action: 'proposed Phase 0 Technical Feasibility Review for',
    target: 'Mustard Plant Observations & Electronic AFE Interface',
    timeAgo: 'Sep 29',
    category: 'review',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    linkedCardId: 'kc-ina128-afe'
  },
  {
    id: 'act-2',
    author: 'Dawn',
    authorRole: 'Project Lead',
    action: 'verified empirical data correlation in',
    target: 'Phase 0 Mustard Plant Petiole Deflection (r = +0.89)',
    timeAgo: 'Sep 28',
    category: 'dataset',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    linkedCardId: 'kc-mustard-baseline'
  },
  {
    id: 'act-3',
    author: 'Clément S',
    authorRole: 'Designer',
    action: 'published 3D CAD blueprints for',
    target: 'Two-Part Guided Growth Vascular Mold v1.4',
    timeAgo: 'Sep 27',
    category: 'experiment',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    linkedCardId: 'kc-guided-molds'
  }
];

export const INITIAL_KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  {
    id: 'node-dawn',
    name: 'Dawn',
    type: 'Person',
    categoryColor: '#10b981',
    description: 'Founder & Biological Concept Lead. Visionary behind Ms. Heavy Metal Leaf and Phase 0 baseline observations.'
  },
  {
    id: 'node-chrislance',
    name: 'Chrislance',
    type: 'Person',
    categoryColor: '#06b6d4',
    description: 'Hardware & Embedded Engineer on Fiverr. Leading Phase 0 Technical Feasibility & AFE Architecture Review.'
  },
  {
    id: 'node-mustard-exp',
    name: 'Mustard Plant Pilot (Phase 0)',
    type: 'Experiment',
    categoryColor: '#10b981',
    description: 'Empirical physical observation of Brassica juncea tracking soil moisture, temperature, and petiole deflection.'
  },
  {
    id: 'node-ina128',
    name: 'TI INA128 AFE Circuit',
    type: 'Technology',
    categoryColor: '#f59e0b',
    description: 'Ultra-high impedance (>10¹² Ω) instrumentation amplifier for passive biopotential listening with TVS clamps.'
  },
  {
    id: 'node-nsf-grant',
    name: 'NSF Phase 1 / WA Ecology',
    type: 'Funding',
    categoryColor: '#8b5cf6',
    description: 'Pending federal and state non-construction grant opportunities for biohybrid stormwater monitoring.'
  }
];

export const INITIAL_KNOWLEDGE_GRAPH_LINKS: KnowledgeGraphLink[] = [
  {
    source: 'node-dawn',
    target: 'node-mustard-exp',
    relationship: 'conducted & logged'
  },
  {
    source: 'node-chrislance',
    target: 'node-ina128',
    relationship: 'reviewing & designing'
  },
  {
    source: 'node-mustard-exp',
    target: 'node-ina128',
    relationship: 'grounds electronic interface'
  },
  {
    source: 'node-mustard-exp',
    target: 'node-nsf-grant',
    relationship: 'provides primary preliminary data'
  }
];

export const INITIAL_AUTO_EVOLUTION_TRIGGERS: AutoEvolutionTrigger[] = [
  {
    id: 'evo-1',
    timestamp: 'Sep 29, 2026',
    title: 'Chrislance Phase 0 Review Proposal Logged',
    description: 'Hardware engineer Chrislance formally proposed focused Phase Zero Technical Feasibility Review to ground AFE specs in real mustard observation data.',
    sourceEvent: 'Collaboration Message from Chrislance',
    resultingAction: 'Generated 1-Click Chrislance Review Package containing mustard CSV, hardware schematics, and fixed-price Fiverr scope.',
    status: 'PROCESSED',
    matchedEntities: ['Chrislance', 'Phase 0 Review', 'INA128 AFE', 'Mustard Observation CSV']
  },
  {
    id: 'evo-2',
    timestamp: 'Sep 28, 2026',
    title: 'Epistemic Truth Separation Enforced',
    description: 'All system sections partitioned into 4 distinct tiers: 🟢 Verified Science, 🟡 Experimental Models, 🔷 Emerging Hypotheses, 🟣 Future Concepts.',
    sourceEvent: 'Dawn Strategic Directive',
    resultingAction: 'Added epistemic status banners across Signal Simulator, Hardware Architecture, and Guided Molds.',
    status: 'PROCESSED',
    matchedEntities: ['Dawn', 'Truth Separation', 'Signal Simulator', 'Simulation Disclaimer']
  }
];
