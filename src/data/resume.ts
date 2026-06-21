// ─────────────────────────────────────────────────────────────────────────
// Single source of truth. Both the homepage (index.astro) and the print /cv
// route render from this file, so they can never drift.
//
// TODO markers: items flagged `todo: true` are placeholders to fill in with
// real, defensible numbers (or delete). They render with a dotted outline.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Michael Ostrovsky',
  firstName: 'Michael',
  role: 'Director of Data Engineering & AI',
  // The one-line positioning. Two short sentences read more human than one balanced clause.
  headline: 'I build the LLM and data platforms behind the product, and I’ve led the teams that own them.',
  // Supporting line under the headline.
  subline: 'At Tastewise I built the first real data platform, then the agent stack on top of it. I take the hardest problems and build them myself.',
  location: 'Tel Aviv, Israel',
  email: 'michael@strafer.dev',
  photo: '/michael.png',
  site: 'https://www.strafer.dev',
};

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Strafer14', handle: 'Strafer14' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/michael-ostrovsky-010605108/', handle: 'in/michael-ostrovsky' },
];

// Short. Has a point of view, written the way a person talks.
export const about = [
  'I run Data Engineering and AI.',
  'At Tastewise I built the agent stack and the Databricks platform under it. Before that, a data team in Unit 8200 and an esports startup I co-founded.',
];

export type Role = {
  org: string;
  role: string;
  period: string;
  note?: string;
  progression?: string[];
  summary: string;
  highlights: string[];
  stack?: string[];
  current?: boolean;
};

// Reverse-chronological. Highlights lead with the result, written plainly.
export const experience: Role[] = [
  {
    org: 'Tastewise',
    role: 'Director of Data Engineering & AI',
    period: 'Jul 2023 – Aug 2026',
    current: true,
    progression: ['Tech Lead', 'Team Lead, Application', 'Data & AI Team Lead', 'Director of Data Engineering & AI'],
    summary:
      'Started on the core ETL platform, built out the company’s first proper data platform, and grew into owning the data products and the whole AI/agent layer.',
    highlights: [
      'Built the product’s agent stack from scratch: a prompt-chain and router orchestrating the model calls, without LangGraph or Mastra.',
      'Took agent responses from a 90-second blank wait to real-time streaming, rebuilding the path so the UI showed partial results (and repaired half-formed JSON) as tokens arrived.',
      'Stood up the AI-platform layer: MCP servers, an OAuth gateway, and a Slack agent that posts the daily data digest. Langfuse tracing took LLM debugging from hours to minutes.',
      'Moved the data platform onto Databricks and Delta Lake over 292 commits, rewriting jobs that used to run for days into PySpark on Airflow, so they finish in hours instead.',
      'Built the ingestion behind 1M+ indexed places, unifying 10 mismatched collectors into one schema and orchestrating the jobs on Airflow with KubernetesPodOperators (EKS).',
      'Grew the team from 2 to 9 engineers across full-stack, data, AI and data science, built the interview process we still use, and took over the prior team’s ML pipelines with zero handover.',
    ],
    stack: ['Python', 'Databricks', 'PySpark', 'Airflow', 'Kinesis', 'Firehose', 'Lambda', 'Pydantic', 'MCP', 'Langfuse', 'FastAPI', 'Kubernetes (EKS)', 'Datadog', 'TypeScript'],
  },
  {
    org: 'Zencity',
    role: 'Full-Stack Team Leader',
    period: 'Jun 2019 – Jul 2023',
    summary:
      'Started as a full-stack developer on the civic-engagement (B2G) product and moved up to lead the team.',
    highlights: [
      'Promoted from developer to leading the full-stack team, owning architecture and delivery.',
      'Shipped and maintained the product’s web apps.',
    ],
    stack: ['TypeScript', 'Node.js', 'React', 'AWS'],
  },
  {
    org: 'Snipe',
    role: 'Co-Founder & VP R&D',
    period: 'Jan 2017 – May 2019',
    summary:
      'Co-founded an esports startup and ran R&D alongside the CEO.',
    highlights: [
      'Built the product end to end, and picked up data and product work as the company needed it.',
    ],
    stack: ['Full-stack', 'Data', 'Product'],
  },
  {
    org: 'Israeli Military Intelligence — Unit 8200',
    role: 'Data Developer Team Leader',
    period: 'Feb 2013 – Feb 2016',
    note: 'Israel’s elite SIGINT unit, the talent pipeline behind Check Point, Palo Alto Networks and Wiz.',
    summary:
      'Led a team of data developers and analysts on research and data-mining, and built the web tools senior decision-makers relied on.',
    highlights: [
      'Led a team of data developers and analysts on research and data-mining.',
      'Built the web tools senior decision-makers actually used.',
    ],
  },
];

export type Project = {
  title: string;
  years: string;
  blurb: string;
  outcome: string;
  stack: string[];
  writeup?: boolean; // true → a deep-dive write-up is planned (TODO)
};

// Selected work — the deep proof points. Deep-dive write-ups are TODO.
export const projects: Project[] = [
  {
    title: 'Agentic LLM platform',
    years: '2024 – 2026',
    blurb:
      'Built the company’s agent infrastructure: prompt-chain plus router, MCP tool servers, an OAuth gateway, Langfuse for observability. No framework, because I wanted to own every layer.',
    outcome: 'Runs the product’s AI features in production, with every model call traced.',
    stack: ['Python', 'FastAPI', 'MCP', 'Langfuse', 'WebSockets'],
    writeup: true,
  },
  {
    title: 'Databricks lakehouse migration',
    years: '2025',
    blurb:
      'Led the move off scattered scripts that ran for days onto a Databricks and Delta Lake lakehouse: bronze/silver/gold layers, Asset Bundles, parameterized Spark jobs, multi-country fan-out.',
    outcome: 'Shipped incrementally over 292 commits, no big-bang cutover.',
    stack: ['Databricks', 'PySpark', 'Delta Lake', 'Airflow'],
    writeup: true,
  },
  {
    title: 'Ingestion at 1M+ places',
    years: '2024',
    blurb:
      'Moved batch jobs off the ad-hoc EC2 scripts a human used to babysit onto orchestrated, containerized workloads, streaming through Kinesis, Firehose and a Lambda with Pydantic guarding against upstream schema changes.',
    outcome: '1M+ places matched and indexed, holding steady as upstream sources kept changing shape.',
    stack: ['Kinesis', 'Firehose', 'Lambda', 'Pydantic', 'Kubernetes', 'Airflow'],
    writeup: true,
  },
  {
    title: 'Observability overhaul',
    years: '2023',
    blurb:
      'Moved the platform from Logz.io to Datadog and wrote a custom Node.js logger that every service uses.',
    outcome: 'Following a request went from grepping scattered logs to a single Datadog query.',
    stack: ['Datadog', 'Node.js', 'TypeScript'],
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skills: SkillGroup[] = [
  { title: 'AI & LLM Engineering', items: ['Agentic workflows (prompt-chain + router)', 'RAG & retrieval', 'MCP servers & gateways', 'Langfuse evals & observability', 'Model routing', 'Token streaming'] },
  { title: 'Data Engineering', items: ['Databricks', 'Delta Lake', 'PySpark / Spark', 'Airflow (Astronomer)', 'Kinesis / Firehose', 'Pydantic', 'Elasticsearch', 'S3'] },
  { title: 'Cloud & Infra', items: ['AWS', 'Kubernetes (EKS)', 'KubernetesPodOperators', 'Lambda', 'Datadog (APM/RUM)', 'Terraform'] },
  { title: 'Languages & Backend', items: ['Python', 'TypeScript', 'Node.js', 'FastAPI', 'Flask', 'NestJS'] },
  { title: 'Frontend', items: ['React', 'Svelte', 'TypeScript', 'SCSS'] },
  { title: 'Leadership', items: ['Hiring & interview design', 'Org design', 'Mentoring', 'Technical strategy', 'Cross-functional delivery'] },
];

export type Education = { qualification: string; org: string; period: string };

export const education: Education[] = [
  { qualification: 'B.A. Economics & Computer Science', org: 'The Open University of Israel', period: '2019 – 2025' },
];
