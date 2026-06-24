// ─────────────────────────────────────────────────────────────────────────
// THE ACHIEVEMENT BANK — the single source of truth (see CONTEXT.md + docs/adr/)
//
// This is the ONLY editable résumé data file. The old src/data/resume.ts has
// been deleted; its facts are folded in here.
//
// Two views read from this Bank:
//   • the website — src/pages/index.astro (via the derived exports below)
//   • the CV       — src/pages/resume.json.ts emits JSON Resume for import into
//                    rxresu.me (https://rxresu.me), where a CV Variant is tailored
//                    per Job Listing in the editor and exported to PDF (ADR-0005).
//
// Model (ADR-0001/0004): the facts/metrics here are canonical — never invent or
// broaden them when tailoring (ADR-0003). `tags`/`strength` are metadata kept for
// optional selection (see `selectAchievements`); the live site renders every
// achievement per role in authored order.
// ─────────────────────────────────────────────────────────────────────────

// ── Vocabulary ──────────────────────────────────────────────────────────────
export type Tag = 'data' | 'ai' | 'backend' | 'frontend' | 'infra' | 'leadership';
export const TAGS: Tag[] = ['data', 'ai', 'backend', 'frontend', 'infra', 'leadership'];

export type RoleId = 'tastewise' | 'zencity' | 'snipe' | 'unit8200';

export type Role = {
  id: RoleId;
  org: string;
  title: string;
  period: string;
  summary: string;
  progression?: string[];
  note?: string;
  stack?: string[];
  current?: boolean;
};

export type Achievement = {
  id: string;
  role: RoleId;
  text: string;            // canonical phrasing (Google XYZ; honest, no invented numbers)
  tags: Tag[];
  strength: 1 | 2 | 3 | 4 | 5; // for ordering + trimming when a Variant runs long
};

// ── Identity (FIXED in every Variant) ───────────────────────────────────────
export const identity = {
  name: 'Michael Ostrovsky',
  firstName: 'Michael',
  role: 'Director of Data Engineering & AI',
  headline: 'I build the LLM and data platforms behind the product, and I’ve led the teams that own them.',
  subline: 'At Tastewise I built the first real data platform, then the agent stack on top of it. I tackle the hardest problems together with my team.',
  location: 'Tel Aviv, Israel',
  email: 'michael@strafer.dev',
  photo: '/michael.jpg',
  site: 'https://www.strafer.dev',
};

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Strafer14', handle: 'Strafer14' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/michael-ostrovsky-010605108/', handle: 'in/michael-ostrovsky' },
];

// Default "about" — the curated site view. Tailoring may swap this per Variant.
export const about = [
  'I run Data Engineering and AI.',
  'At Tastewise I built the agent stack and the Databricks platform under it. Before that, a data team in Unit 8200 and an esports startup I co-founded.',
];

// ── Roles (reverse-chronological) ───────────────────────────────────────────
export const roles: Role[] = [
  {
    id: 'tastewise',
    org: 'Tastewise',
    title: 'Director of Data Engineering & AI',
    period: 'Jul 2023 - Aug 2026',
    current: true,
    progression: ['Tech Lead', 'Team Lead, Application', 'Data & AI Team Lead', 'Director of Data Engineering & AI'],
    summary:
      'Started on the core ETL platform, built out the company’s first proper data platform, and grew into owning the data products and the whole AI/agent layer.',
    stack: ['Python', 'Databricks', 'PySpark', 'Airflow', 'Kinesis', 'Firehose', 'Lambda', 'Pydantic', 'MCP', 'Langfuse', 'FastAPI', 'Kubernetes (EKS)', 'Datadog', 'TypeScript'],
  },
  {
    id: 'zencity',
    org: 'Zencity',
    title: 'Full-Stack Team Leader',
    period: 'Jun 2019 - Jul 2023',
    summary:
      'Architected the civic-engagement (B2G) product’s survey-submission platform, and grew from developer to leading the full-stack team.',
    stack: ['TypeScript', 'React', 'Node.js', 'AWS Lambda', 'SQS', 'Kafka (Confluent)', 'MongoDB', 'Elasticsearch', 'Webpack Module Federation'],
  },
  {
    id: 'snipe',
    org: 'Snipe',
    title: 'Co-Founder & VP R&D',
    period: 'Jun 2017 - May 2019',
    summary:
      'Co-founded an esports startup and ran R&D, shipping ML-driven products for League of Legends players.',
    stack: ['React', 'React Native', 'AWS', 'MongoDB', 'Spark (Scala)', 'scikit-learn'],
  },
  {
    id: 'unit8200',
    org: 'Israeli Military Intelligence — Unit 8200',
    title: 'Data Developer Team Leader',
    period: 'Feb 2013 - Feb 2016',
    note: 'Israel’s elite SIGINT unit, the talent pipeline behind Check Point, Palo Alto Networks and Wiz.',
    summary:
      'Led a data team building tools that surfaced new insight from previously-inaccessible data.',
  },
];

// ── Achievements (the Bank) ─────────────────────────────────────────────────
// strength/core are tunable defaults — adjust as you see real listings.
export const achievements: Achievement[] = [
  // Tastewise
  { id: 'tw-agent-stack', role: 'tastewise', tags: ['ai', 'backend'], strength: 5,
    text: 'Built the product’s agent stack from scratch: a prompt-chain and router orchestrating the model calls, without LangGraph or Mastra.' },
  { id: 'tw-streaming', role: 'tastewise', tags: ['ai', 'backend', 'frontend'], strength: 5,
    text: 'Took agent responses from a 90-second blank wait to real-time streaming, rebuilding the path so the UI showed partial results (and repaired half-formed JSON) as tokens arrived.' },
  { id: 'tw-ai-platform', role: 'tastewise', tags: ['ai', 'infra', 'backend'], strength: 4,
    text: 'Stood up the AI-platform layer: MCP servers exposing the company’s data platform to agents, an OAuth AI gateway, and a Slack knowledge sharing agent owning the team’s llm wiki. Langfuse tracing took LLM debugging from hours to minutes.' },
  { id: 'tw-claude-code', role: 'tastewise', tags: ['ai', 'leadership'], strength: 4,
    text: 'Introduced Claude Code to R&D in July 2025 and drove its adoption — within a couple of months the whole org was building with it — then led the build of an internal Claude Code plugin packaging the company’s shared skills and MCP servers.' },
  { id: 'tw-databricks', role: 'tastewise', tags: ['data', 'infra'], strength: 5,
    text: 'Moved the data platform onto Databricks and Delta Lake over 292 commits, rewriting jobs that used to run for days into PySpark on Airflow, so they finish in hours instead.' },
  { id: 'tw-ingestion', role: 'tastewise', tags: ['data', 'infra', 'backend'], strength: 5,
    text: 'Built the ingestion behind 1M+ indexed places, unifying 10 mismatched collectors into one schema and orchestrating the jobs on Airflow with KubernetesPodOperators (EKS).' },
  { id: 'tw-react-migration', role: 'tastewise', tags: ['frontend', 'leadership'], strength: 4,
    text: 'Kicked off the Angular 12 → React 18 migration, writing an interop layer that rendered React components inside the live Angular app for an incremental cutover — widening the hiring pool and lifting delivery velocity.' },
  { id: 'tw-sso', role: 'tastewise', tags: ['backend', 'infra'], strength: 3,
    text: 'Built company-wide SSO by hand with Passport.js — no managed auth provider — standing up authentication across the product’s services.' },
  { id: 'tw-observability', role: 'tastewise', tags: ['infra', 'backend'], strength: 3,
    text: 'Led the observability overhaul, moving the platform from Logz.io to Datadog and standardizing a custom Node.js & Python logger across every service, so following a request went from grepping scattered logs to a single query — cutting bug investigations from hours to minutes.' },
  { id: 'tw-backend-migrations', role: 'tastewise', tags: ['backend', 'data'], strength: 3,
    text: 'Modernized the backend across two migrations: TasteGPT from Flask to FastAPI, and the Nodejs scrapers from TypeScript to a fully async Python framework.' },
  { id: 'tw-team', role: 'tastewise', tags: ['leadership'], strength: 4,
    text: 'Grew the team from 2 to 9 engineers across full-stack, data, AI and data science, built the interview process we still use, and took over the prior team’s ML pipelines with zero handover.' },

  // Zencity
  { id: 'zen-survey-platform', role: 'zencity', tags: ['backend', 'frontend', 'data', 'infra'], strength: 5,
    text: 'Cut survey-collection cost to near zero by replacing a third-party SaaS with an in-house platform — a React client plus a pipeline of event-driven Lambda microservices over SQS, fanning each submission through ingestion, score aggregation, ML entity-enrichment (BERT) and location enrichment before persistence — running across ~100 cities at thousands of submissions a day.' },
  { id: 'zen-typescript', role: 'zencity', tags: ['backend', 'data', 'leadership'], strength: 4,
    text: 'Championed and drove the Node.js codebase migration from JavaScript to TypeScript, sharply reducing production bugs, and added a schema layer over MongoDB that further hardened system stability.' },
  { id: 'zen-cdc', role: 'zencity', tags: ['data', 'infra', 'backend'], strength: 3,
    text: 'Operated, maintained and monitored the Confluent Kafka CDC (Change Data Capture) pipeline streaming MongoDB’s oplog into Elasticsearch — thousands of events a day fanned across 50 consumer groups, partitioned by a modulo on the Mongo ObjectId.' },
  { id: 'zen-microfrontend', role: 'zencity', tags: ['frontend', 'infra'], strength: 3,
    text: 'Built Zencity’s first microfrontend — a host-and-remotes Webpack Module Federation architecture — upgrading Webpack and wiring the remotes to load and communicate with each other both locally and across staging and production.' },
  { id: 'zen-fingerprinting', role: 'zencity', tags: ['frontend', 'backend'], strength: 3,
    text: 'Built device fingerprinting and throughput optimization into the submission flow, hardening it and making it faster to onboard new cities.' },
  { id: 'zen-team', role: 'zencity', tags: ['leadership'], strength: 4,
    text: 'Grew and led the full-stack team from 2 to 7 engineers after being promoted from developer.' },

  // Snipe
  { id: 'snipe-sightstone', role: 'snipe', tags: ['data', 'ai', 'backend'], strength: 4,
    text: 'Built Sightstone, which predicted favorable League of Legends matchups by pre-ingesting millions of games — Spark/Scala for processing, scikit-learn for the models, MongoDB for storage.' },
  { id: 'snipe-matchmaker', role: 'snipe', tags: ['data', 'ai', 'frontend'], strength: 3,
    text: 'Built Matchmaker, a mobile app that profiled players’ playstyle to recommend teammates and streamers, tackling game loneliness and content discovery.' },
  { id: 'snipe-traction', role: 'snipe', tags: ['leadership'], strength: 4,
    text: 'Grew to 100k+ downloads and 10k+ weekly active users across 4 products in two years, raised a pre-seed round, and moved the company to Silicon Valley.' },

  // Unit 8200
  { id: 'u8200-data-access', role: 'unit8200', tags: ['data', 'backend'], strength: 4,
    text: 'Built tooling that made previously-inaccessible mission-critical data queryable, unlocking insights from data the organization already held.' },
  { id: 'u8200-team', role: 'unit8200', tags: ['leadership'], strength: 3,
    text: 'Led a team of 5 data developers and analysts across seniority levels.' },
];

// ── Skills (tagged so a Variant can reorder/trim to a role) ──────────────────
export type SkillGroup = { title: string; items: string[]; tags: Tag[] };
export const skills: SkillGroup[] = [
  { title: 'AI & LLM Engineering', tags: ['ai'], items: ['Agentic workflows (prompt-chain + router)', 'RAG & retrieval', 'MCP servers & gateways', 'Langfuse evals & observability', 'Model routing', 'Token streaming'] },
  { title: 'Data Engineering', tags: ['data'], items: ['Databricks', 'Delta Lake', 'PySpark / Spark', 'Airflow (AWS MWAA)', 'Kinesis / Firehose', 'Kafka (CDC)', 'Pydantic', 'Elasticsearch', 'MongoDB', 'S3'] },
  { title: 'Cloud & Infra', tags: ['infra'], items: ['AWS', 'Kubernetes (EKS)', 'KubernetesPodOperators', 'Lambda', 'Datadog (APM/RUM)', 'Terraform'] },
  { title: 'Languages & Backend', tags: ['backend'], items: ['Python', 'TypeScript', 'Node.js', 'FastAPI', 'Flask', 'NestJS', 'Microservices', 'Auth & SSO (Passport.js, OAuth/JWT)'] },
  { title: 'Frontend', tags: ['frontend'], items: ['React', 'React Native', 'Svelte', 'TypeScript', 'SCSS', 'Microfrontends (Module Federation)', 'Framework migration (Angular → React)'] },
  { title: 'Leadership', tags: ['leadership'], items: ['Hiring & interview design', 'Org design', 'Mentoring', 'Technical strategy', 'Cross-functional delivery'] },
];

// ── Education (FIXED) ────────────────────────────────────────────────────────
export type Education = { qualification: string; org: string; period: string };
export const education: Education[] = [
  { qualification: 'B.A. Economics & Computer Science', org: 'The Open University of Israel', period: '2019 - 2025' },
];

// ── Projects / "Selected work" (curated deep-dive view) ─────────────────────
// NOTE: these overlap with achievements (minor ADR-0001 duplication). The next
// agent may want to derive them from achievement ids instead. Kept as-is so the
// current site keeps rendering unchanged.
export type Project = { title: string; years: string; blurb: string; outcome: string; stack: string[] };
export const projects: Project[] = [
  { title: 'Agentic LLM platform', years: '2024 - 2026',
    blurb: 'Built the company’s agent infrastructure: prompt-chain plus router, MCP tool servers, an OAuth gateway, Langfuse for observability. No framework, because I wanted to own every layer.',
    outcome: 'Runs the product’s AI features in production, with every model call traced.',
    stack: ['Python', 'FastAPI', 'MCP', 'Langfuse', 'WebSockets'] },
  { title: 'Databricks lakehouse migration', years: '2025',
    blurb: 'Led the move off scattered scripts that ran for days onto a Databricks and Delta Lake lakehouse: bronze/silver/gold layers, Asset Bundles, parameterized Spark jobs, multi-country fan-out.',
    outcome: 'About 10× faster, shipped incrementally over 292 commits.',
    stack: ['Databricks', 'PySpark', 'Delta Lake', 'Airflow'] },
  { title: 'Ingestion at 1M+ places', years: '2024',
    blurb: 'Moved batch jobs off the ad-hoc EC2 scripts a human used to babysit onto orchestrated, containerized workloads, streaming through Kinesis, Firehose and a Lambda with Pydantic guarding against upstream schema changes.',
    outcome: '1M+ places matched and indexed, holding steady as upstream sources kept changing shape.',
    stack: ['Kinesis', 'Firehose', 'Lambda', 'Pydantic', 'Kubernetes', 'Airflow'] },
  { title: 'Observability overhaul', years: '2023',
    blurb: 'Moved the platform from Logz.io to Datadog and wrote a custom Node.js & Python logger that every service uses.',
    outcome: 'Following a request went from grepping scattered logs to a single Datadog query.',
    stack: ['Datadog', 'Node.js', 'TypeScript'] },
];

// ─────────────────────────────────────────────────────────────────────────
// DERIVED SITE VIEW — the shape src/pages/index.astro consumes. Shows every
// achievement per role in authored order. (The CV view is produced separately:
// src/pages/resume.json.ts → JSON Resume → rxresu.me, tailored in its editor.)
// ─────────────────────────────────────────────────────────────────────────
export const profile = identity;

export const experience = roles.map((r) => ({
  org: r.org,
  role: r.title,
  period: r.period,
  progression: r.progression,
  note: r.note,
  summary: r.summary,
  current: r.current,
  stack: r.stack,
  highlights: achievements.filter((a) => a.role === r.id).map((a) => a.text),
}));

/** Optional helper: select achievements whose tags intersect `targetTags`,
 *  ordered by strength desc. Not used by the live site (which shows all in
 *  authored order); kept as a deterministic lever if a filtered JSON Resume
 *  export is ever wanted. Tailoring otherwise happens in the rxresu.me editor. */
export function selectAchievements(targetTags: Tag[]): Achievement[] {
  const want = new Set(targetTags);
  return achievements
    .filter((a) => a.tags.some((t) => want.has(t)))
    .sort((a, b) => b.strength - a.strength);
}
