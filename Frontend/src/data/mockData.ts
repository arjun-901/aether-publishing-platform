import { Article, Author, CategoryInfo, CategoryType, NotificationItem, UserProfile } from '../types';

export const MOCK_AUTHORS: Record<string, Author> = {
  elena: {
    id: 'author-1',
    name: 'Dr. Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Chief AI Architect & Research Fellow',
    bio: 'Pioneering multimodal foundation models and neuro-symbolic reasoning. Ex-DeepMind, currently contributing to open research.',
    followersCount: 14200,
    handle: '@elenavance',
    verified: true,
  },
  marcus: {
    id: 'author-2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Principal Cloud Systems Engineer',
    bio: 'Specializing in resilient distributed architectures, zero-trust infrastructure, and multi-region AWS primitives.',
    followersCount: 9800,
    handle: '@marcuscloud',
    verified: true,
  },
  sarah: {
    id: 'author-3',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Venture Columnist & Market Analyst',
    bio: 'Dissecting tech capital allocation, liquidity shifts, and macroeconomic inflection points across Silicon Valley and Asia.',
    followersCount: 23100,
    handle: '@sarahj_capital',
    verified: true,
  },
  devon: {
    id: 'author-4',
    name: 'Devon Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Staff Full-Stack Engineer & Design Systems Lead',
    bio: 'Obsessed with WebGL, low-latency UI pipelines, TypeScript type gymnastics, and human-computer symbiosis.',
    followersCount: 11400,
    handle: '@devoncraft',
    verified: true,
  },
  clara: {
    id: 'author-5',
    name: 'Clara Oswald',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Global Technology Correspondent',
    bio: 'Reporting on sovereign compute mandates, semiconductor supply chains, and international digital privacy treaties.',
    followersCount: 31000,
    handle: '@clara_world',
    verified: true,
  }
};

export const MOCK_CATEGORIES: CategoryInfo[] = [
  {
    id: 'AI',
    name: 'AI',
    slug: 'ai',
    description: 'Neural networks, autonomous agents, generative diffusion, and the frontier of synthetic intelligence.',
    articleCount: 18,
    followersCount: 34200,
    accentColor: '#ea580c',
    icon: 'Sparkles',
  },
  {
    id: 'Business',
    name: 'Business',
    slug: 'business',
    description: 'SaaS economics, venture velocity, unit economics, and operational playbooks for exponential scale.',
    articleCount: 14,
    followersCount: 22800,
    accentColor: '#0284c7',
    icon: 'TrendingUp',
  },
  {
    id: 'News',
    name: 'News',
    slug: 'news',
    description: 'Breaking milestones in enterprise technology, mergers, venture capital rounds, and leadership.',
    articleCount: 27,
    followersCount: 19400,
    accentColor: '#dc2626',
    icon: 'Newspaper',
  },
  {
    id: 'Daily News',
    name: 'Daily News',
    slug: 'daily-news',
    description: 'Curated 5-minute morning briefings, algorithmic summaries, and global market signals.',
    articleCount: 42,
    followersCount: 45100,
    accentColor: '#ca8a04',
    icon: 'Sun',
  },
  {
    id: 'Articles',
    name: 'Articles',
    slug: 'articles',
    description: 'Deep investigative essays, engineering post-mortems, and longform cultural analyses.',
    articleCount: 31,
    followersCount: 16900,
    accentColor: '#7c3aed',
    icon: 'BookOpen',
  },
  {
    id: 'AWS',
    name: 'AWS',
    slug: 'aws',
    description: 'Cloud architecture patterns, serverless paradigms, Lambda cold-start optimizations, and global VPC setups.',
    articleCount: 16,
    followersCount: 28500,
    accentColor: '#d97706',
    icon: 'Cloud',
  },
  {
    id: 'Full Stack Development',
    name: 'Full Stack Development',
    slug: 'full-stack-development',
    description: 'Next.js App Router, React Server Components, high-throughput Postgres, and edge middleware runtime.',
    articleCount: 29,
    followersCount: 39000,
    accentColor: '#059669',
    icon: 'Code2',
  },
  {
    id: 'Other',
    name: 'Other',
    slug: 'other',
    description: 'Design craft, typography, product psychology, human ergonomics, and hardware hacking.',
    articleCount: 11,
    followersCount: 8400,
    accentColor: '#6b7280',
    icon: 'Compass',
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'reasoning-models-and-the-death-of-brute-force-tokens',
    title: 'Beyond Next-Token Prediction: The Rise of Deliberative Cognitive Architectures',
    subtitle: 'Why test-time compute scaling is overturning the traditional scaling laws of generative AI.',
    excerpt: 'As frontier models hit diminishing returns on raw parameter counts, cognitive verification loops, search trees, and internal chain-of-thought verification are unlocking unprecedented reasoning thresholds.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
    category: 'AI',
    tags: ['AI', 'Machine Learning', 'Inference Compute', 'Deep Learning'],
    author: MOCK_AUTHORS.elena,
    publishedAt: '2026-03-05',
    readTimeMinutes: 7,
    views: 34290,
    likes: 2410,
    claps: 5820,
    status: 'published',
    isTrending: true,
    isFeatured: true,
    commentsCount: 38,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">For three consecutive years, the machine learning orthodoxy adhered to an intoxicatingly simple thesis: increase compute budgets by an order of magnitude, expand parameter counts linearly, and emergent capabilities will spontaneously crystallize. But 2026 marks the decisive inflection point where raw pre-training hits the wall of empirical diminishing returns.</p>
      
      <h2>The Shift to Test-Time Compute</h2>
      <p>Instead of relying purely on one-shot autoregressive generation, the next frontier belongs to <strong>deliberative inference</strong>. Rather than immediately emitting token after token with zero latency consideration, modern systems pause, plan, evaluate multiple branch hypothesis, and recursively self-correct before outputting the final synthetic consensus.</p>
      
      <blockquote>
        "The mind does not compose a novel in a single uninterrupted stream of unedited consciousness; it drafts, critiques, backtracks, and prunes. We are finally teaching our synthetic systems the discipline of second thoughts."
      </blockquote>

      <figure class="my-8">
        <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80" alt="Neural lattice visualization" class="rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800" />
        <figcaption class="text-center text-sm text-zinc-500 mt-2">Figure 1.1: Verification graph topology comparing single-pass probability distributions against Monte Carlo search trees.</figcaption>
      </figure>

      <h2>The Mathematical Underpinnings</h2>
      <p>Consider the classical expectation function across a verification manifold $\\mathcal{M}$. When evaluated synchronously, error rates compound exponentially with sequence length $L$. By introducing verification checkpoints at intervals $\\tau$, error bounds flatten dramatically:</p>

      <pre><code>// Dynamic Verification Heuristic Pattern
interface BranchVerification {
  readonly hypothesisId: string;
  readonly confidenceScore: number;
  evaluate(state: CognitiveState): Promise<Verdict>;
}

export async function pruneSearchTree(nodes: HypothesisNode[]): Promise<Path> {
  const verifiedPaths = await Promise.all(
    nodes.map(n => verifierEngine.score(n.context))
  );
  return verifiedPaths.sort((a, b) => b.score - a.score)[0].route;
}</code></pre>

      <h2>Practical Implications for Enterprise SaaS</h2>
      <p>What does this mean for architects building on top of frontier APIs? The economics of compute are rearranging:</p>
      <ul>
        <li><strong>Cost per query is dynamic:</strong> Simple queries cost fractions of a cent; high-stakes actuarial analysis may run for 45 seconds of continuous self-correction and cost $2.40.</li>
        <li><strong>Hallucination rates fall by orders of magnitude:</strong> By enforcing strict programmatic verification against semantic databases, mission-critical operations become viable.</li>
        <li><strong>Prompt engineering gives way to verification harness design:</strong> Writing the rules of critique is far more powerful than cajoling the generator.</li>
      </ul>
      <p>The implications are staggering. We are moving from the era of conversational toys into the era of autonomous cognitive coprocessors.</p>
    `
  },
  {
    id: 'art-2',
    slug: 'aws-multi-region-active-active-event-mesh',
    title: 'Architecting 99.999% Resilient Multi-Region Event Meshes on AWS',
    subtitle: 'Zero-data-loss synchronization across us-east-1 and eu-central-1 using Aurora Global and EventBridge.',
    excerpt: 'When sub-10ms failover is a contractual SLA, DNS round-robin is a liability. Here is how we engineered bidirectional conflict-free replication with custom vector clocks.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    category: 'AWS',
    tags: ['AWS', 'Cloud Architecture', 'Aurora', 'Distributed Systems'],
    author: MOCK_AUTHORS.marcus,
    publishedAt: '2026-03-04',
    readTimeMinutes: 9,
    views: 18450,
    likes: 1290,
    claps: 3410,
    status: 'published',
    isTrending: true,
    commentsCount: 24,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">Enterprise outages are seldom caused by catastrophic hardware implosions; they are triggered by silent network partitions, DNS propagation delays, and configuration drift during regional failovers.</p>
      
      <h2>The Fallacy of Cold Standby</h2>
      <p>A region you do not actively push production traffic through is a region that will fail the instant disaster strikes. In this deep dive, we walk through the transition from warm standby to true active-active multi-region mesh serving 450,000 requests per second.</p>

      <figure class="my-8">
        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="Server rack infrastructure" class="rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800" />
        <figcaption class="text-center text-sm text-zinc-500 mt-2">Figure 2: Multi-region synchronization pipeline across Dublin and Northern Virginia data centers.</figcaption>
      </figure>

      <h2>Handling Conflict-Free Replicated Data Types (CRDTs)</h2>
      <p>When user transactions hit both Dublin and Virginia simultaneously, last-write-wins is a recipe for silent financial ledger corruption. We deployed state-based CRDTs with hybrid logical clocks:</p>

      <pre><code>// Hybrid Logical Clock sync for distributed ledger
export class DistributedEventClock {
  private logicalTime: number = 0;
  private regionId: string;

  constructor(region: string) {
    this.regionId = region;
  }

  public tick(physicalMs: number): ClockStamp {
    this.logicalTime = Math.max(this.logicalTime + 1, physicalMs);
    return { time: this.logicalTime, region: this.regionId };
  }
}</code></pre>
    `
  },
  {
    id: 'art-3',
    slug: 'the-death-of-vanity-saas-metrics',
    title: 'The Great SaaS Reset: Why Net Revenue Retention is the Only Metric That Matters in 2026',
    subtitle: 'Top-line ARR growth is no longer rewarded by public markets without capital efficiency and operational margin.',
    excerpt: 'Analyzing balance sheets of 140 public software companies reveals a seismic shift: companies with >120% NRR trade at 3.4x higher multiples even with slower initial customer acquisition.',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=85',
    category: 'Business',
    tags: ['Business', 'SaaS', 'Finance', 'Venture Capital'],
    author: MOCK_AUTHORS.sarah,
    publishedAt: '2026-03-03',
    readTimeMinutes: 5,
    views: 29800,
    likes: 1840,
    claps: 4190,
    status: 'published',
    isTrending: false,
    commentsCount: 19,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">The era of cheap capital subsidized customer acquisition costs that made no mathematical sense. Today, enterprise buyers are consolidating tool suites, cutting redundant seats, and demanding ROI proof within 60 days of procurement.</p>
      
      <h2>The Rule of 40 has Become The Rule of 60</h2>
      <p>Investors used to tolerate negative 30% free cash flow margins if top line was compounding at 70%. In today's macroeconomic landscape, that math has been completely recalibrated. Efficiency, negative churn, and automated expansion workflows are the hallmark of resilient software franchises.</p>
    `
  },
  {
    id: 'art-4',
    slug: 'react-19-server-components-streaming-performance',
    title: 'Zero-Bundle React: Micro-Benchmarking Next.js App Router & Server Actions in High-Load Systems',
    subtitle: 'Cutting Time-to-Interactive by 68% by offloading heavy parser pipelines to edge isolates.',
    excerpt: 'We dissected the hydration overhead of standard client-side SPA architectures versus modern Server Components streaming HTML chunks directly from edge nodes with zero hydration lag.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85',
    category: 'Full Stack Development',
    tags: ['Full Stack', 'Next.js', 'React', 'Performance', 'TypeScript'],
    author: MOCK_AUTHORS.devon,
    publishedAt: '2026-03-02',
    readTimeMinutes: 8,
    views: 42100,
    likes: 3120,
    claps: 7200,
    status: 'published',
    isTrending: true,
    commentsCount: 52,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">For nearly a decade, the modern web has operated under a paradoxical burden: client devices grew faster, yet web applications grew heavier and slower to initialize, bogged down by megabytes of serialized JavaScript needed solely to bind DOM listeners.</p>

      <h2>The Anatomy of Streaming SSR</h2>
      <p>By leveraging HTTP/2 multiplexing and modern readable streams, we no longer need to wait for the entire data dependency graph to resolve before transmitting the initial structural layout to the browser.</p>

      <pre><code>// Edge runtime streaming boundary example
export const runtime = 'edge';

export default async function FeedStream() {
  const streamData = fetchHighPriorityFeeds();
  
  return (
    &lt;Suspense fallback={&lt;SkeletonArticleCard /&gt;}&gt;
      &lt;StreamedFeedContent promise={streamData} /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>
    `
  },
  {
    id: 'art-5',
    slug: 'morning-briefing-semiconductor-sovereignty-2026',
    title: 'Daily Dispatch: The 1.4nm Silicon Race and Global Compute Sanctions',
    subtitle: 'Everything you need to know this morning in technology, geopolitics, and capital markets.',
    excerpt: 'New foundry announcements in Dresden and Arizona, coupled with novel extreme ultraviolet lithography breakthroughs, have ignited a flurry of sovereign cloud mandates across 14 nations.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
    category: 'Daily News',
    tags: ['Daily News', 'Hardware', 'Semiconductors', 'Geopolitics'],
    author: MOCK_AUTHORS.clara,
    publishedAt: '2026-03-06',
    readTimeMinutes: 4,
    views: 15300,
    likes: 890,
    claps: 1650,
    status: 'published',
    isTrending: false,
    commentsCount: 11,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">Good morning. Silicon self-sufficiency has officially graduated from corporate supply chain management to high-level international defense policy.</p>

      <h2>Today's Key Headlines</h2>
      <ul>
        <li><strong>Dresden Fab Breakthrough:</strong> European microelectronics consortium achieves first functional test wafers on sub-2nm nodes ahead of scheduled Q4 timeline.</li>
        <li><strong>Quantum Interconnect Standards:</strong> IEEE ratifies the first photonic networking protocol for distributed quantum key distribution.</li>
        <li><strong>Open Source Model Weights:</strong> New research alliance releases 70B parameter open-weights baseline matching proprietary benchmarks at 40% reduced inference memory footprints.</li>
      </ul>
    `
  },
  {
    id: 'art-6',
    slug: 'global-data-protection-and-synthetic-data-mandates',
    title: 'EU Ratifies Unified Framework for Synthetic Training Data Verification',
    subtitle: 'New regulatory clarity promises to accelerate enterprise AI adoption while addressing copyright disputes.',
    excerpt: 'Under the landmark directive signed yesterday, enterprise developers using cryptographically signed synthetic training datasets receive safe harbor protections against training-data litigation.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
    category: 'News',
    tags: ['News', 'Regulation', 'AI Governance', 'Privacy'],
    author: MOCK_AUTHORS.clara,
    publishedAt: '2026-03-01',
    readTimeMinutes: 6,
    views: 12400,
    likes: 780,
    claps: 1400,
    status: 'published',
    isTrending: false,
    commentsCount: 8,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">In a unified vote in Brussels, the European Parliament approved the comprehensive Synthetic Datasets Certification Protocol, laying down the first global legal framework for training generative AI without proprietary intellectual property liability.</p>
    `
  },
  {
    id: 'art-7',
    slug: 'crafting-digital-artifacts-that-age-gracefully',
    title: 'The Digital Antiquity: Why Software Needs Patina in the Age of Fleeting Ephemera',
    subtitle: 'A meditation on typography, lasting interfaces, and the lost craft of timeless software design.',
    excerpt: 'Modern web products look identical: flat, borderless, low-contrast, and discarded after twelve months. Here is an argument for texture, optical hierarchy, and software built to last decades.',
    coverImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=85',
    category: 'Articles',
    tags: ['Articles', 'Design', 'Philosophy', 'Craft'],
    author: MOCK_AUTHORS.devon,
    publishedAt: '2026-02-28',
    readTimeMinutes: 10,
    views: 38900,
    likes: 4200,
    claps: 9500,
    status: 'published',
    isTrending: true,
    commentsCount: 47,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">When you hold an 18th-century leatherbound volume, the grain of the rag paper, the bite of the lead type into the fiber, and the gentle softening of the corners evoke an unmistakable sense of permanence. Why have we accepted that our digital tools should feel as disposable as polystyrene cups?</p>

      <h2>The Industrialization of Interfaces</h2>
      <p>The convergence toward uniform design systems has optimized for delivery velocity at the expense of soul. When every product utilizes the same neutral sans-serif typeface, the same 8-pixel spacing cadence, and the same muted gray cards, identity is bleached from the medium.</p>
    `
  },
  {
    id: 'art-8',
    slug: 'spatial-computing-ergonomics-and-haptic-feedback',
    title: 'The Neurological Limits of Virtual Spatial Interfaces',
    subtitle: 'Why floating glass windows fail human cognitive ergonomics, and what tactile spatial computing requires.',
    excerpt: 'Proprioception, micro-saccades, and finger fatigue: examining the biological friction that prevents head-mounted displays from replacing standard mechanical keyboards and monitors.',
    coverImage: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1600&q=85',
    category: 'Other',
    tags: ['Other', 'Spatial Computing', 'Ergonomics', 'Neuroscience'],
    author: MOCK_AUTHORS.elena,
    publishedAt: '2026-02-25',
    readTimeMinutes: 8,
    views: 14700,
    likes: 1100,
    claps: 2300,
    status: 'published',
    isTrending: false,
    commentsCount: 15,
    contentHtml: `
      <p class="lead text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">Humans did not evolve to pinch empty air for eight hours a day. The tactile resistance of physical switches provides immediate neuro-sensory feedback loops that keep motor pathways in check.</p>
    `
  },
  {
    id: 'art-9-draft',
    slug: 'agentic-workflows-state-machines',
    title: 'Draft: Designing Deterministic State Machines for Non-Deterministic AI Agents',
    subtitle: 'How to prevent autonomous code generation from spiraling into infinite hallucination loops.',
    excerpt: 'A comprehensive architecture guide for encapsulating probabilistic LLM calls inside strictly typed hierarchical finite state machines.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=85',
    category: 'AI',
    tags: ['AI', 'State Machines', 'TypeScript', 'Agents'],
    author: MOCK_AUTHORS.elena,
    publishedAt: '2026-03-05',
    readTimeMinutes: 6,
    views: 0,
    likes: 0,
    claps: 0,
    status: 'draft',
    commentsCount: 0,
    contentHtml: `
      <p>Draft in progress. Outlining the primary state transitions between Tool Call -> Observation -> Reflection -> Execution.</p>
    `
  }
];

export const MOCK_COMMENTS = [
  {
    id: 'comm-1',
    articleId: 'art-1',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: 'The test-time compute distinction is so crucial. We noticed our verification step took 3 seconds longer per request, but our edge case failure rate dropped from 14% to under 0.4%. Essential reading.',
    createdAt: '2 hours ago',
    likes: 28,
  },
  {
    id: 'comm-2',
    articleId: 'art-1',
    authorName: 'Hannah Zhang',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Love the typography and the depth here. Are you planning to release the Monte Carlo search evaluation harness on GitHub soon?',
    createdAt: '5 hours ago',
    likes: 12,
  },
  {
    id: 'comm-3',
    articleId: 'art-4',
    authorName: 'Liam Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    content: 'Streaming boundaries have completely transformed our Core Web Vitals score. The INP metric specifically went from 180ms down to 24ms.',
    createdAt: '1 day ago',
    likes: 19,
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'new_article',
    title: 'New in AI',
    message: 'Dr. Elena Vance published "Beyond Next-Token Prediction: The Rise of Deliberative Cognitive Architectures"',
    timestamp: '20 min ago',
    read: false,
    articleId: 'art-1',
    authorAvatar: MOCK_AUTHORS.elena.avatar,
  },
  {
    id: 'notif-2',
    type: 'new_article',
    title: 'New in Full Stack Development',
    message: 'Devon Patel published "Zero-Bundle React: Micro-Benchmarking Next.js App Router"',
    timestamp: '3 hours ago',
    read: false,
    articleId: 'art-4',
    authorAvatar: MOCK_AUTHORS.devon.avatar,
  },
  {
    id: 'notif-3',
    type: 'clap',
    title: 'Claps on your comment',
    message: 'Alex Rivera and 4 others clapped for your thoughts on Distributed Systems.',
    timestamp: '6 hours ago',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Platform Milestone',
    message: 'Welcome to Aether! Explore curated feeds and configure your notification frequency.',
    timestamp: '1 day ago',
    read: true,
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-current',
  name: 'Elena Vance',
  email: 'elena.vance@aether.press',
  role: 'writer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Chief AI Architect & Research Fellow. Writing on synthetic intelligence, distributed systems, and cognitive architecture.',
  handle: '@elenavance',
  followedCategories: ['AI', 'Full Stack Development', 'AWS', 'Articles'],
  followedAuthorIds: ['author-2', 'author-4'],
  bookmarkedArticleIds: ['art-2', 'art-4', 'art-7'],
  publishedArticlesCount: 14,
  draftsCount: 3,
  totalViews: 148920,
};

export const SAMPLE_IMAGE_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    title: 'Abstract Neural Geometry',
    caption: 'Algorithmic geometric lattices rendering vector space.'
  },
  {
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    title: 'Code Synthesis Terminal',
    caption: 'High-throughput systems code running on edge nodes.'
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    title: 'Global Satellite Mesh',
    caption: 'Planetary networking relays and cross-region infrastructure.'
  },
  {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    title: 'Modern Architecture Minimalist',
    caption: 'Clean architectural line study with balanced negative space.'
  },
  {
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    title: 'Quantum Matrix Grid',
    caption: 'Dark monochrome cryptographic data visualizer.'
  }
];
