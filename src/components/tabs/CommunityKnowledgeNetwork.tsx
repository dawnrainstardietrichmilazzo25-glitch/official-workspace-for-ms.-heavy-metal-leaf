import React, { useState } from 'react';
import { 
  Share2, 
  GitFork, 
  MessageSquare, 
  Layers, 
  Network, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  Award, 
  Bot, 
  Plus, 
  ThumbsUp, 
  Eye, 
  Lock, 
  Globe2, 
  Users, 
  FileText, 
  Database, 
  Cpu, 
  Leaf, 
  FlaskConical, 
  ArrowRight, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Coins,
  Send,
  Zap,
  Activity,
  GitBranch,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  ContributionType, 
  VisibilityOption, 
  ReputationRole, 
  EpistemicLifecycleStage, 
  KnowledgeCard, 
  CommunityActivityItem, 
  KnowledgeGraphNode, 
  KnowledgeGraphLink, 
  AutoEvolutionTrigger, 
  INITIAL_KNOWLEDGE_CARDS, 
  INITIAL_COMMUNITY_ACTIVITIES, 
  INITIAL_KNOWLEDGE_GRAPH_NODES, 
  INITIAL_KNOWLEDGE_GRAPH_LINKS, 
  INITIAL_AUTO_EVOLUTION_TRIGGERS 
} from '../../data/communityKnowledge';

export const CommunityKnowledgeNetwork: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'cards' | 'forks' | 'graph' | 'evolution' | 'reputation'>('feed');

  // State for Cards & Activities
  const [cards, setCards] = useState<KnowledgeCard[]>(INITIAL_KNOWLEDGE_CARDS);
  const [activities, setActivities] = useState<CommunityActivityItem[]>(INITIAL_COMMUNITY_ACTIVITIES);
  const [graphNodes] = useState<KnowledgeGraphNode[]>(INITIAL_KNOWLEDGE_GRAPH_NODES);
  const [graphLinks] = useState<KnowledgeGraphLink[]>(INITIAL_KNOWLEDGE_GRAPH_LINKS);
  const [evolutionEvents, setEvolutionEvents] = useState<AutoEvolutionTrigger[]>(INITIAL_AUTO_EVOLUTION_TRIGGERS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedVisibilityFilter, setSelectedVisibilityFilter] = useState<string>('ALL');

  // Active Discussion Modal / Drawer
  const [selectedCardForDiscussion, setSelectedCardForDiscussion] = useState<KnowledgeCard | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Fork Modal State
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [cardToFork, setCardToFork] = useState<KnowledgeCard | null>(null);
  const [forkNewTitle, setForkNewTitle] = useState('');
  const [forkModifications, setForkModifications] = useState('');

  // New Contribution Modal
  const [isNewContributionOpen, setIsNewContributionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContributionType>('Experiment Logs');
  const [newVisibility, setNewVisibility] = useState<VisibilityOption>('Public');
  const [newStatus, setNewStatus] = useState<EpistemicLifecycleStage>('🟡 Experimental');
  const [newTags, setNewTags] = useState('Phytoremediation, Bioelectronics');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  // Graph Filter State
  const [graphTypeFilter, setGraphTypeFilter] = useState<string>('ALL');
  const [selectedGraphNode, setSelectedGraphNode] = useState<KnowledgeGraphNode | null>(INITIAL_KNOWLEDGE_GRAPH_NODES[0]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upvote Card
  const handleUpvoteCard = (cardId: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          metrics: { ...c.metrics, upvotes: c.metrics.upvotes + 1 }
        };
      }
      return c;
    }));
    showToast('Upvote recorded! Contributor earned +5 reputation points.');
  };

  // Open Fork Modal
  const handleOpenFork = (card: KnowledgeCard) => {
    setCardToFork(card);
    setForkNewTitle(`${card.title} (Forked v2.0)`);
    setForkModifications('');
    setIsForkModalOpen(true);
  };

  // Execute Fork
  const handleExecuteFork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardToFork || !forkNewTitle.trim()) return;

    const forkedCard: KnowledgeCard = {
      id: `kc-fork-${Date.now()}`,
      title: forkNewTitle.trim(),
      author: 'Dawn',
      authorRole: 'Project Lead',
      authorOrg: 'Heavy Metal Leaf Initiative',
      contributionType: cardToFork.contributionType,
      visibility: 'Public',
      status: cardToFork.status,
      tags: [...cardToFork.tags, 'Forked Version'],
      summary: forkModifications.trim() || `Forked and expanded from ${cardToFork.title} by ${cardToFork.author}.`,
      content: `Derived from ${cardToFork.title} [Version ${cardToFork.version}]:\n\n${cardToFork.content}\n\nBranch Additions:\n${forkModifications}`,
      metrics: {
        comments: 0,
        collaborators: 1,
        relatedProjects: 1,
        upvotes: 1,
        forks: 0
      },
      forkedFrom: {
        id: cardToFork.id,
        title: cardToFork.title,
        version: cardToFork.version
      },
      version: 'v2.0-FORK',
      createdAt: 'Just now',
      comments: []
    };

    // Update parent card's fork count
    setCards(prev => [
      forkedCard,
      ...prev.map(c => c.id === cardToFork.id ? { ...c, metrics: { ...c.metrics, forks: c.metrics.forks + 1 } } : c)
    ]);

    // Log to activity feed
    const newActivity: CommunityActivityItem = {
      id: `act-${Date.now()}`,
      author: 'Dawn',
      authorRole: 'Project Lead',
      action: `forked ${cardToFork.title} into a new version`,
      target: forkedCard.title,
      timeAgo: 'Just now',
      category: 'fork',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      linkedCardId: forkedCard.id
    };

    setActivities(prev => [newActivity, ...prev]);
    setIsForkModalOpen(false);
    showToast(`Successfully forked project! Fork relationship tracked in Knowledge Graph.`);
  };

  // Add Comment to Discussion
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardForDiscussion || !newCommentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Dawn',
      authorRole: 'Project Lead' as ReputationRole,
      authorOrg: 'Heavy Metal Leaf Initiative',
      text: newCommentText.trim(),
      createdAt: 'Just now',
      upvotes: 0
    };

    const updatedCard = {
      ...selectedCardForDiscussion,
      metrics: {
        ...selectedCardForDiscussion.metrics,
        comments: selectedCardForDiscussion.metrics.comments + 1
      },
      comments: [...selectedCardForDiscussion.comments, newComment]
    };

    setSelectedCardForDiscussion(updatedCard);
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    setNewCommentText('');
    showToast('Comment & peer review posted! +2 reputation earned.');
  };

  // Submit New Contribution
  const handleCreateContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const parsedTags = newTags.split(',').map(t => t.trim()).filter(Boolean);

    const newCard: KnowledgeCard = {
      id: `kc-${Date.now()}`,
      title: newTitle.trim(),
      author: 'Dawn',
      authorRole: 'Project Lead',
      authorOrg: 'Heavy Metal Leaf Initiative',
      contributionType: newType,
      visibility: newVisibility,
      status: newStatus,
      tags: parsedTags.length > 0 ? parsedTags : ['Phytoremediation'],
      summary: newSummary.trim(),
      content: newContent.trim() || newSummary.trim(),
      metrics: {
        comments: 0,
        collaborators: 1,
        relatedProjects: 1,
        upvotes: 1,
        forks: 0
      },
      version: 'v1.0',
      createdAt: 'Just now',
      comments: []
    };

    setCards(prev => [newCard, ...prev]);

    // Add to activity feed
    const newActivity: CommunityActivityItem = {
      id: `act-${Date.now()}`,
      author: 'Dawn',
      authorRole: 'Project Lead',
      action: `shared a new ${newType.toLowerCase()}`,
      target: newCard.title,
      timeAgo: 'Just now',
      category: 'experiment',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      linkedCardId: newCard.id
    };

    setActivities(prev => [newActivity, ...prev]);

    // Simulate AI synthesis auto-evolution
    const newEvolution: AutoEvolutionTrigger = {
      id: `evo-${Date.now()}`,
      timestamp: 'Just now',
      title: `Auto-Knowledge Graph Linkage: ${newCard.title}`,
      description: `Ms. Heavy Metal Leaf AI parsed contribution tags (${newCard.tags.join(', ')}). Automatically established 3 bi-directional graph connections to active projects.`,
      sourceEvent: `New Knowledge Card Published (${newCard.id})`,
      resultingAction: 'Added cross-references in Technology Pipeline and verified scientific repository.',
      status: 'PROCESSED',
      matchedEntities: [newCard.title, ...newCard.tags]
    };

    setEvolutionEvents(prev => [newEvolution, ...prev]);

    setIsNewContributionOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    showToast('Knowledge contribution published to the ecosystem!');
  };

  // Filtered Cards
  const filteredCards = cards.filter(card => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      card.title.toLowerCase().includes(q) ||
      card.author.toLowerCase().includes(q) ||
      card.summary.toLowerCase().includes(q) ||
      card.tags.some(t => t.toLowerCase().includes(q));

    const matchesType = selectedTypeFilter === 'ALL' || card.contributionType === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || card.status === selectedStatusFilter;
    const matchesVisibility = selectedVisibilityFilter === 'ALL' || card.visibility === selectedVisibilityFilter;

    return matchesSearch && matchesType && matchesStatus && matchesVisibility;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-500/50 bg-neutral-900/95 px-5 py-3 text-xs font-mono font-bold text-emerald-300 shadow-2xl flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner: Knowledge Network & Collective Intelligence */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-emerald-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
              <Network className="h-3.5 w-3.5 text-emerald-400" />
              COMMUNITY KNOWLEDGE NETWORK
            </span>
            <span className="text-xs font-mono text-neutral-400">
              Collective Ecological Intelligence Core
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Separating Empirical Fact from Unproven Possibility
          </h1>
          <p className="text-sm sm:text-base font-mono text-emerald-300 font-medium leading-relaxed max-w-3xl">
            As Dawn and hardware engineer Chrislance agreed: <em>"We need to keep the facts separated from the things that are maybe possible but haven't been tested yet. We need to always be clear."</em>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-300 block">🟢 TIER 1: VERIFIED SCIENCE</span>
              <p className="text-[11px] text-slate-300">Phase 0 mustard plant observations (r = +0.89), TI INA128 physics datasheet specs.</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-300 block">🟡 TIER 2: EXPERIMENTAL MODEL</span>
              <p className="text-[11px] text-slate-300">AFE breadboard topology, simulated biopotentials awaiting Chrislance Phase 0 review.</p>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-300 block">🔷 TIER 3: EMERGING HYPOTHESES</span>
              <p className="text-[11px] text-slate-300">CAD guided-growth molds, in-situ soil circuit slabs, floating wetland bio-rafts.</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple-300 block">🟣 TIER 4: FUTURE VISION</span>
              <p className="text-[11px] text-slate-300">Ms. Heavy Metal Leaf archetypal avatar, autonomous biohybrid robotics, planetary healing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
              activeSubTab === 'feed'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Community Feed & Cards</span>
          </button>

          <button
            onClick={() => setActiveSubTab('forks')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
              activeSubTab === 'forks'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
            <span>Fork & Build Studio</span>
          </button>

          <button
            onClick={() => setActiveSubTab('graph')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
              activeSubTab === 'graph'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Network className="h-3.5 w-3.5 text-purple-400" />
            <span>Knowledge Graph</span>
          </button>

          <button
            onClick={() => setActiveSubTab('evolution')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
              activeSubTab === 'evolution'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-amber-400" />
            <span>Automatic Knowledge Evolution</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reputation')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
              activeSubTab === 'reputation'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-amber-300" />
            <span>Reputation System</span>
          </button>
        </div>

        <button
          onClick={() => setIsNewContributionOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-mono font-bold text-white hover:from-emerald-500 hover:to-teal-500 shadow-md cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Contribute to Network</span>
        </button>
      </div>

      {/* TAB 1: COMMUNITY FEED & KNOWLEDGE CARDS */}
      {activeSubTab === 'feed' && (
        <div className="space-y-6">
          {/* Latest Network Activity Banner */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Latest Network Activity Feed
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Live peer broadcasts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    const found = cards.find(c => c.id === act.linkedCardId);
                    if (found) setSelectedCardForDiscussion(found);
                  }}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3 flex flex-col justify-between gap-2 hover:border-emerald-500/50 hover:bg-neutral-900/80 cursor-pointer transition-all shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">
                        {act.author}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {act.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-300 leading-snug">
                      <span className="text-emerald-400">{act.action}:</span> {act.target}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-850 text-[10px] font-mono">
                    <span className="rounded bg-neutral-900 px-2 py-0.5 text-neutral-400">
                      {act.authorRole}
                    </span>
                    <span className="text-emerald-400 hover:underline">
                      View Card →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filters for Knowledge Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge cards, authors, tags, or mechanisms..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Contribution Types (14)</option>
                {[
                  'Research Notes',
                  'Hypotheses',
                  'Questions',
                  'Datasets',
                  'Experiment Logs',
                  'CAD Files',
                  'Images',
                  'Field Observations',
                  'Sensor Data',
                  'Literature Reviews',
                  'Funding Opportunities',
                  'Project Updates',
                  'Collaboration Requests',
                  'Lessons Learned'
                ].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Epistemic Stages</option>
                <option value="🟢 Verified Science">🟢 Verified Science</option>
                <option value="🟡 Experimental">🟡 Experimental</option>
                <option value="🔷 Emerging">🔷 Emerging</option>
                <option value="🟣 Future Concept">🟣 Future Concept</option>
              </select>
            </div>
          </div>

          {/* Knowledge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-xl hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Contribution Type & Epistemic Status */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 text-[10px] font-mono text-neutral-300 font-bold">
                      {card.contributionType}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-neutral-300">
                      {card.status}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-base font-bold text-white font-mono leading-snug">
                      {card.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 mt-1">
                      <span>Author: <strong className="text-white">{card.author}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400">{card.authorRole}</span>
                      <span>•</span>
                      <span className="text-neutral-500">{card.version}</span>
                    </div>
                  </div>

                  {/* Forked Badge if applicable */}
                  {card.forkedFrom && (
                    <div className="rounded-lg bg-cyan-950/30 border border-cyan-500/30 p-2 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                      <GitFork className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>Forked from: <strong>{card.forkedFrom.title}</strong></span>
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-xs text-neutral-300 leading-relaxed font-mono line-clamp-3">
                    {card.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="rounded bg-neutral-900 border border-neutral-850 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Discussion Metrics Bar */}
                  <div className="rounded-xl border border-neutral-850 bg-neutral-900/50 p-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-emerald-400" />
                      {card.metrics.comments} comments
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-teal-400" />
                      {card.metrics.collaborators} collaborators
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-cyan-400" />
                      {card.metrics.forks} forks
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-neutral-850 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvoteCard(card.id)}
                      className="flex items-center gap-1 rounded-xl bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-xs font-mono text-neutral-300 hover:text-emerald-300 hover:border-emerald-500/50 transition-colors cursor-pointer"
                      title="Upvote / Endorse"
                    >
                      <ThumbsUp className="h-3 w-3 text-emerald-400" />
                      <span>{card.metrics.upvotes}</span>
                    </button>

                    <button
                      onClick={() => handleOpenFork(card)}
                      className="flex items-center gap-1 rounded-xl bg-cyan-950/40 border border-cyan-500/40 px-2.5 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-900/50 transition-colors cursor-pointer"
                      title="Fork & Build on this research"
                    >
                      <GitFork className="h-3 w-3" />
                      <span>Fork & Build</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedCardForDiscussion(card)}
                    className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
                  >
                    Discuss & Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FORK & BUILD STUDIO */}
      {activeSubTab === 'forks' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/30 bg-neutral-900/90 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Iterative Open Science
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-cyan-400" />
                  <span>Fork & Build Feature</span>
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400 max-w-sm">
                A member may copy an experiment or project and create Version 2. The lineage and relationship remains visible.
              </span>
            </div>

            {/* Fork Demonstration Walkthrough */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
                <span className="rounded bg-neutral-800 text-neutral-300 px-2 py-0.5 text-[10px] font-mono font-bold">
                  ORIGINAL ROOT PROJECT (v1.0)
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  Floating Wetland Sentinel
                </h3>
                <p className="text-xs text-neutral-300 font-mono">
                  Baseline vegetative raft monitoring stormwater runoff in urban retention basins.
                </p>
                <div className="text-[11px] font-mono text-neutral-400">
                  Author: Cascade Ecological Lab • 8 Collaborators
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-5 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                    FORKED PROJECT (v2.0)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Lineage Connected
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-mono">
                  Floating Wetland Sentinel for Heavy-Metal Monitoring
                </h3>
                <p className="text-xs text-neutral-300 font-mono">
                  Enhanced with submerged multi-cation electrode arrays, solar harvesting buoyancy pods, and LoRaWAN TinyML inference.
                </p>
                <div className="text-[11px] font-mono text-neutral-400">
                  Forked by: Chrislance • Inherits all parent citations
                </div>
              </div>
            </div>

            {/* List of Forkable Knowledge Cards */}
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Select an Experiment or Project to Fork & Build:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cards.map(c => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-white leading-snug">
                        {c.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-1">
                        By {c.author} • {c.version} • {c.metrics.forks} existing forks
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenFork(c)}
                      className="w-full rounded-xl bg-cyan-600/30 border border-cyan-500/40 py-1.5 text-xs font-mono font-bold text-cyan-200 hover:bg-cyan-600 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                    >
                      <GitFork className="h-3 w-3" />
                      <span>Fork This Version →</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KNOWLEDGE GRAPH */}
      {activeSubTab === 'graph' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-purple-500/30 bg-neutral-900/90 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  Ecosystem Relational Map
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  <span>The Living Knowledge Graph</span>
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                People ↓ Projects ↓ Experiments ↓ Datasets ↓ Technologies ↓ Organizations
              </span>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500">Filter Nodes:</span>
              {['ALL', 'Person', 'Project', 'Experiment', 'Dataset', 'Technology', 'Organization', 'Funding'].map(t => (
                <button
                  key={t}
                  onClick={() => setGraphTypeFilter(t)}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                    graphTypeFilter === t
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Graph Visual Explorer Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Node Cards */}
              <div className="lg:col-span-7 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {graphNodes
                  .filter(n => graphTypeFilter === 'ALL' || n.type === graphTypeFilter)
                  .map(node => {
                    const isSelected = selectedGraphNode?.id === node.id;
                    const connectedLinks = graphLinks.filter(l => l.source === node.id || l.target === node.id);

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedGraphNode(node)}
                        className={`rounded-2xl p-3.5 border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/20 shadow-md ring-1 ring-purple-500/50'
                            : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="h-2.5 w-2.5 rounded-full" 
                              style={{ backgroundColor: node.categoryColor }} 
                            />
                            <span className="text-xs font-mono font-bold text-white">
                              {node.name}
                            </span>
                            <span className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.2 text-[10px] font-mono text-neutral-400">
                              {node.type}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 font-mono">
                            {node.description}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-purple-400">
                            {connectedLinks.length} Links
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Right Column: Node Inspector & Linked Relationships */}
              <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                {selectedGraphNode ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-855 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">
                          Selected Node Inspector
                        </span>
                        <h3 className="text-base font-bold text-white font-mono">
                          {selectedGraphNode.name}
                        </h3>
                      </div>
                      <span className="rounded bg-neutral-900 px-2 py-0.5 text-xs font-mono text-neutral-300 border border-neutral-800">
                        {selectedGraphNode.type}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                      {selectedGraphNode.description}
                    </p>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">
                        Relational Edges in Knowledge Graph:
                      </span>
                      <div className="space-y-1.5">
                        {graphLinks
                          .filter(l => l.source === selectedGraphNode.id || l.target === selectedGraphNode.id)
                          .map((link, idx) => {
                            const isSource = link.source === selectedGraphNode.id;
                            const peerId = isSource ? link.target : link.source;
                            const peerNode = graphNodes.find(n => n.id === peerId);

                            return (
                              <div
                                key={idx}
                                className="rounded-xl border border-neutral-850 bg-neutral-900/60 p-2.5 text-xs font-mono flex items-center justify-between"
                              >
                                <span className="text-emerald-400">
                                  {isSource ? `→ ${link.relationship}` : `← ${link.relationship} by`}
                                </span>
                                <span className="text-white font-bold">
                                  {peerNode?.name || peerId}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-mono text-neutral-500 text-center py-12">
                    Select a node to inspect relationships
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUTOMATIC KNOWLEDGE EVOLUTION */}
      {activeSubTab === 'evolution' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-500/40 bg-neutral-900/90 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Continuous Autonomous Intelligence
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono flex items-center gap-2">
                  <Bot className="h-5 w-5 text-amber-400" />
                  <span>Automatic Knowledge Evolution Engine</span>
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400 max-w-sm">
                Ms. Heavy Metal Leaf AI continuously updates the platform as new information, research, people, and projects are contributed.
              </span>
            </div>

            {/* 6 Evolution Capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  title: 'Automatic Profile Updates',
                  desc: 'When a new collaborator joins (e.g. David Handy), skills are detected from published papers and matched automatically to active projects.',
                  badge: 'Member Ingestion'
                },
                {
                  title: 'Automatic Project Matching',
                  desc: 'Publishing a dataset, CAD file, or research instantly maps relevant collaborators, duplicate efforts, and shared interests.',
                  badge: 'Project Synthesis'
                },
                {
                  title: 'Automatic Research Scanning',
                  desc: 'Monitors preprints and literature in phytoremediation, space agriculture, and bioelectronics, categorizing findings into the 4-tier pipeline.',
                  badge: 'Literature Radar'
                },
                {
                  title: 'Automatic Working Groups',
                  desc: 'When 10+ members discuss a common challenge (e.g. "Plant-Based Environmental Sensing"), a dedicated working group space is auto-created.',
                  badge: 'Emergence'
                },
                {
                  title: 'Automatic Funding Matching',
                  desc: 'Pairs ongoing lab prototypes and field sites with active ARPA-E, NSF, and Horizon Europe grant opportunities in real-time.',
                  badge: 'Capital Bridge'
                },
                {
                  title: 'Automatic Project Evolution',
                  desc: 'Tracks research lifecycle: Research Question → Experiment → Prototype → Field Pilot → Deployment → Case Study.',
                  badge: 'Maturity Tracking'
                }
              ].map((cap, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                      {cap.badge}
                    </span>
                  </div>
                  <h3 className="text-xs font-mono font-bold text-white">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Autonomous Event Stream Log */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>Real-Time Autonomous System Evolution Events</span>
                </h4>
                <span className="text-[11px] font-mono text-neutral-500">
                  AI operating system self-updating log
                </span>
              </div>

              <div className="space-y-2.5">
                {evolutionEvents.map(evt => (
                  <div
                    key={evt.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                          {evt.status}
                        </span>
                        <h4 className="text-xs font-mono font-bold text-white">
                          {evt.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {evt.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="rounded-xl border border-neutral-850 bg-neutral-900/60 p-2.5 text-xs font-mono text-emerald-300">
                      <strong>AI Action Taken:</strong> {evt.resultingAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPUTATION SYSTEM */}
      {activeSubTab === 'reputation' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-neutral-900/90 p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Peer Recognition & Governance
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span>Reputation & Recognition Tiers</span>
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Earned through peer-reviewed research, verified datasets, and helpful review
              </span>
            </div>

            {/* 6 Reputation Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  role: 'Member',
                  criteria: 'Registered profile, active explorer, verified interest directory.',
                  points: '0 – 50 pts',
                  badge: 'Entry Contributor'
                },
                {
                  role: 'Contributor',
                  criteria: 'Shares research notes, peer comments, or preliminary observations.',
                  points: '50 – 150 pts',
                  badge: 'Active Contributor'
                },
                {
                  role: 'Research Contributor',
                  criteria: 'Publishes open datasets, CAD files, or reproducible protocols.',
                  points: '150 – 350 pts',
                  badge: 'Validated Researcher'
                },
                {
                  role: 'Project Lead',
                  criteria: 'Directs field sites, bench experiments, or multi-member cohorts.',
                  points: '350 – 600 pts',
                  badge: 'Working Group Lead'
                },
                {
                  role: 'Subject Matter Expert',
                  criteria: 'Authored peer-reviewed papers, validated assays, or technical standards.',
                  points: '600 – 1000 pts',
                  badge: 'Ecosystem Authority'
                },
                {
                  role: 'Advisor',
                  criteria: 'Mentors working groups, evaluates grant proposals, and guides governance.',
                  points: '1000+ pts',
                  badge: 'Advisory Council'
                }
              ].map((tier, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold text-white uppercase">
                      {tier.role}
                    </h3>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {tier.points}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                    {tier.criteria}
                  </p>
                  <div className="text-[10px] font-mono text-neutral-500 pt-1">
                    Recognition: {tier.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: DISCUSSION & PEER REVIEW */}
      {selectedCardForDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-emerald-500/50 bg-neutral-950 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 font-bold">
                    {selectedCardForDiscussion.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {selectedCardForDiscussion.contributionType}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedCardForDiscussion.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  By {selectedCardForDiscussion.author} ({selectedCardForDiscussion.authorOrg}) • {selectedCardForDiscussion.createdAt}
                </p>
              </div>

              <button
                onClick={() => setSelectedCardForDiscussion(null)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Full Card Content */}
            <div className="rounded-2xl border border-neutral-850 bg-neutral-900/60 p-4 space-y-2 text-xs text-neutral-200 leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Contribution Documentation:
              </span>
              <p>{selectedCardForDiscussion.content}</p>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  Peer Review & Discussion ({selectedCardForDiscussion.comments.length})
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedCardForDiscussion.comments.map(c => (
                  <div key={c.id} className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{c.author}</span>
                        <span className="rounded bg-neutral-950 px-1.5 py-0.2 text-[10px] text-emerald-300">
                          {c.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500">{c.createdAt}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-xs text-neutral-300 block">
                Add Peer Review / Suggestion / Reference:
              </label>
              <textarea
                rows={2}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share experimental feedback, citations, or suggested next tests..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Post Peer Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FORK & BUILD MODAL */}
      {isForkModalOpen && cardToFork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/50 bg-neutral-950 p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <GitFork className="h-4 w-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Fork & Build New Version
                </h3>
              </div>
              <button
                onClick={() => setIsForkModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 text-xs text-neutral-300">
              Forking from: <strong>{cardToFork.title}</strong> by {cardToFork.author} ({cardToFork.version}). Full credit & lineage remains visible.
            </div>

            <form onSubmit={handleExecuteFork} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 block mb-1">
                  New Project / Experiment Title *
                </label>
                <input
                  type="text"
                  required
                  value={forkNewTitle}
                  onChange={(e) => setForkNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">
                  Proposed Enhancements / Modifications *
                </label>
                <textarea
                  rows={4}
                  required
                  value={forkModifications}
                  onChange={(e) => setForkModifications(e.target.value)}
                  placeholder="Describe how your Version 2 expands upon the original (e.g. new sensors, revised nutrient chemistry, different plant species)..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsForkModalOpen(false)}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 px-4 py-2 font-bold text-white hover:bg-cyan-500 shadow-md cursor-pointer"
                >
                  Create Fork (v2.0)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW CONTRIBUTION */}
      {isNewContributionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-emerald-500/50 bg-neutral-950 p-6 shadow-2xl space-y-4 font-mono max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Contribute to Community Knowledge Network
                </h3>
              </div>
              <button
                onClick={() => setIsNewContributionOpen(false)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateContribution} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Contribution Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {[
                      'Research Notes',
                      'Hypotheses',
                      'Questions',
                      'Datasets',
                      'Experiment Logs',
                      'CAD Files',
                      'Images',
                      'Field Observations',
                      'Sensor Data',
                      'Literature Reviews',
                      'Funding Opportunities',
                      'Project Updates',
                      'Collaboration Requests',
                      'Lessons Learned'
                    ].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Sharing Visibility *</label>
                  <select
                    value={newVisibility}
                    onChange={(e) => setNewVisibility(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Public">Public (Visible to all members)</option>
                    <option value="Project Team">Project Team (Team only)</option>
                    <option value="Research Circle">Research Circle (Selected)</option>
                    <option value="Private">Private (Contributor only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Osmotic Potential Waveforms in Noccaea caerulescens"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Epistemic Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="🟢 Verified Science">🟢 Verified Science</option>
                    <option value="🟡 Experimental">🟡 Experimental</option>
                    <option value="🔷 Emerging">🔷 Emerging</option>
                    <option value="🟣 Future Concept">🟣 Future Concept</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Phytoremediation, Bioelectronics"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Brief scannable overview of your findings or hypothesis..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Detailed Content / Data / SOP</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Full protocol, findings, dataset documentation, or design specs..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsNewContributionOpen(false)}
                  className="rounded-xl border border-neutral-700 px-4 py-2 text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  Publish Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
