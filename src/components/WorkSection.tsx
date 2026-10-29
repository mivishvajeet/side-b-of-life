import React, { useState, useEffect } from 'react';
import {
  Database,
  GitBranch,
  Terminal,
  BarChart3,
  ArrowUpRight,
  Plus,
  Code2,
  Server,
  ShieldAlert,
  Clock,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Mail,
  Briefcase,
  Layers,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { NavigationTab } from '../types/archive';

export interface DataEngineeringProject {
  id: string;
  number: string;
  title: string;
  domain: 'Data Engineering' | 'Analytics Engineering' | 'Data Analytics';
  scaleTag: string;
  summary: string;
  problemStatement: string;
  architectureFlow: string[];
  engineeringContributions: string[];
  impactMetrics: string[];
  techStack: string[];
  githubUrl: string;
  codeSnippetTitle?: string;
  codeSnippet?: string;
  isCustom?: boolean;
}

const PROJECTS_3YOE: DataEngineeringProject[] = [
  {
    id: 'de-3yoe-1',
    number: '01',
    title: 'Production Medallion Lakehouse & Incremental ELT Pipeline',
    domain: 'Data Engineering',
    scaleTag: '35+ Source Tables · 12M+ Rows/Day · Airflow + dbt',
    summary:
      'Replaced fragile cron-based extraction scripts with an orchestrated Bronze → Silver → Gold Medallion warehouse architecture using Python, Apache Airflow, and dbt.',
    problemStatement:
      'Operational OLTP databases and third-party REST APIs were ingested via full-table overnight dumps. Frequent upstream schema changes, duplicate primary keys, and lack of historical state tracking caused morning BI refreshes to fail or report inconsistent numbers.',
    architectureFlow: [
      'OLTP Postgres & REST APIs',
      'Airflow Python Extractors',
      'Bronze Raw Landing (Parquet)',
      'dbt Silver (Deduplication & SCD Type 2)',
      'dbt Gold Star Schema Marts',
      'Automated Data Quality Gates',
    ],
    engineeringContributions: [
      'Built idempotent Python extraction tasks orchestrated in Apache Airflow with retry policies, watermark state tracking, and Slack/email SLA failure alerts.',
      'Modeled Silver and Gold layers in dbt using incremental MERGE strategies and Slowly Changing Dimensions (SCD Type 2) to preserve historical customer and order state changes.',
      'Implemented 40+ automated dbt schema and data quality tests (uniqueness, not-null, referential integrity, freshness thresholds) to quarantine bad loads before reaching production marts.',
    ],
    impactMetrics: [
      '64% reduction in daily pipeline runtime',
      'Zero duplicate record leakage into Gold BI tables',
      '55% lower warehouse compute scan cost via date partitioning',
    ],
    techStack: [
      'Python',
      'SQL',
      'Apache Airflow',
      'dbt',
      'Snowflake / PostgreSQL',
      'Parquet',
      'Docker',
      'GitHub Actions',
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/medallion-elt-lakehouse-pipeline',
    codeSnippetTitle: 'models/gold/fct_orders_incremental.sql',
    codeSnippet: `{{
  config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge',
    partition_by={'field': 'order_date', 'data_type': 'date'},
    cluster_by=['region_code', 'customer_tier']
  )
}}

WITH deduplicated_silver AS (
    SELECT
        order_id,
        customer_id,
        CAST(order_created_at AS DATE) AS order_date,
        region_code,
        customer_tier,
        order_status,
        COALESCE(gross_amount, 0) - COALESCE(discount_amount, 0) AS net_order_amount,
        updated_at,
        ROW_NUMBER() OVER (
            PARTITION BY order_id
            ORDER BY updated_at DESC
        ) AS rn
    FROM {{ ref('stg_silver_orders') }}
    {% if is_incremental() %}
      WHERE updated_at >= (SELECT DATEADD(day, -2, MAX(updated_at)) FROM {{ this }})
    {% endif %}
)
SELECT
    order_id,
    customer_id,
    order_date,
    region_code,
    customer_tier,
    order_status,
    net_order_amount,
    updated_at
FROM deduplicated_silver
WHERE rn = 1;`,
  },
  {
    id: 'de-3yoe-2',
    number: '02',
    title: 'Distributed Event Telemetry & PySpark Batch/Streaming Pipeline',
    domain: 'Data Engineering',
    scaleTag: '15M+ Daily Events · Kafka + PySpark · Skew & Watermark Tuning',
    summary:
      'High-throughput PySpark data processing pipeline ingesting application telemetry and event logs with late-event watermarking, shuffle-skew optimization, and dead-letter isolation.',
    problemStatement:
      'High-volume JSON event logs suffered from severe Spark shuffle skew on high-cardinality user keys and frequent job failures whenever upstream producers emitted malformed payloads or late-arriving mobile events.',
    architectureFlow: [
      'Event Producers (JSON)',
      'Apache Kafka Partitioned Topics',
      'PySpark Structured Streaming',
      'Dead-Letter Quarantine (Corrupt JSON)',
      'Partitioned Parquet / Delta Lake',
    ],
    engineeringContributions: [
      'Developed PySpark ingestion and transformation jobs with explicit StructType schema validation, routing malformed JSON records to a dead-letter S3 path instead of failing the job.',
      'Eliminated Spark stage bottlenecks by replacing sort-merge joins with broadcast joins on dimension lookup tables and tuning partition sizing.',
      'Applied event-time watermarking to accurately aggregate late-arriving telemetry events and write compacted Parquet partitions for fast downstream SQL queries.',
    ],
    impactMetrics: [
      '15M+ daily events processed with 99.9% pipeline uptime',
      '3.4x faster Spark job execution after broadcast join & skew tuning',
      '100% recovery of malformed payloads via Dead-Letter auditing',
    ],
    techStack: [
      'Python',
      'PySpark',
      'Apache Kafka',
      'Spark SQL',
      'AWS S3 / Parquet',
      'Delta Lake',
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/pyspark-event-telemetry-pipeline',
    codeSnippetTitle: 'jobs/pyspark_telemetry_aggregation.py',
    codeSnippet: `from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, window, count, approx_count_distinct, broadcast

raw_stream = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", KAFKA_BOOTSTRAP_SERVERS)
    .option("subscribe", "prod.user.telemetry.v2")
    .option("startingOffsets", "latest")
    .load()
)

parsed = (
    raw_stream
    .selectExpr("CAST(value AS STRING) AS raw_json", "timestamp AS ingested_at")
    .select(from_json(col("raw_json"), EVENT_SCHEMA).alias("evt"), col("raw_json"))
)

# Isolate valid events; route corrupt payloads to dead-letter storage
valid_events = (
    parsed.filter(col("evt.event_id").isNotNull() & col("evt.event_ts").isNotNull())
    .select("evt.*")
    .withWatermark("event_ts", "15 minutes")
)

enriched_events = valid_events.join(
    broadcast(dim_platform_lookup),
    on="platform_id",
    how="left"
)`,
  },
  {
    id: 'de-3yoe-3',
    number: '03',
    title: 'Enterprise SQL Warehouse Tuning & Unified KPI Semantic Layer',
    domain: 'Analytics Engineering',
    scaleTag: 'Query Latency 42s → 3.1s · Single Source of Truth KPIs',
    summary:
      'Refactored monolithic legacy SQL reporting queries into a governed semantic KPI layer using window functions, pre-aggregated rollups, and table partitioning.',
    problemStatement:
      'Finance, Operations, and Product teams maintained separate 500+ line ad-hoc SQL scripts with conflicting business rules—causing weekly metric discrepancies and slow 40+ second BI dashboard load times.',
    architectureFlow: [
      'Raw Transactional Tables',
      'Execution Plan & Bottleneck Audit',
      'Partitioned & Clustered Rollup Models',
      'Governed Semantic KPI Views',
      'Power BI / Self-Serve SQL',
    ],
    engineeringContributions: [
      'Audited query execution plans to remove redundant full-table scans, correlated subqueries, and unindexed string joins across multi-million-row fact tables.',
      'Consolidated core metric definitions (Net Revenue, Rolling 30-Day Active Users, Order Fulfillment SLA) into version-controlled dbt/SQL semantic views.',
      'Designed pre-aggregated daily and monthly summary tables with composite clustering keys so BI dashboards query lightweight marts instead of raw logs.',
    ],
    impactMetrics: [
      'Dashboard query latency reduced from ~42s to 3.1s',
      '~70% reduction in full-table scan compute volume',
      'Unified KPI definitions across Finance, Ops & Product',
    ],
    techStack: [
      'Advanced SQL',
      'CTEs & Window Functions',
      'Query Plan Optimization',
      'dbt',
      'BigQuery / Snowflake / PostgreSQL',
      'Power BI',
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/sql-warehouse-kpi-semantic-layer',
  },
  {
    id: 'de-3yoe-4',
    number: '04',
    title: 'Customer Retention Cohort, Funnel & Revenue Attribution Analytics',
    domain: 'Data Analytics',
    scaleTag: 'M0–M12 Cohort Matrix · Funnel Drop-Off & LTV Modeling',
    summary:
      'End-to-end analytical data mart and executive BI suite combining SQL cohort modeling, Python statistical profiling, and interactive dashboards to diagnose churn and funnel conversion.',
    problemStatement:
      'Top-line acquisition growth hid high Month-2 user churn in specific channels, and stakeholders spent 6+ hours every week manually stitching CSV exports in Excel to track funnel conversion.',
    architectureFlow: [
      'User Lifecycle & Order Facts',
      'SQL Cohort & Funnel Window Modeling',
      'Python (Pandas) Segment Variance Analysis',
      'Interactive Power BI / Tableau Suite',
    ],
    engineeringContributions: [
      'Authored modular SQL cohort models tracking monthly user retention (M0–M12), repeat purchase intervals, and Customer Lifetime Value (LTV) by acquisition channel.',
      'Used Python (Pandas, NumPy) to analyze conversion drop-offs across device types and user segments, isolating the onboarding step responsible for 38% abandonment.',
      'Built an interactive executive dashboard with drill-down filters and automated weekly variance tracking.',
    ],
    impactMetrics: [
      'Pinpointed onboarding bottleneck driving 38% funnel drop-off',
      'Automated 6+ hours/week of manual Excel & CSV reporting',
      'Adopted by product & operations for weekly retention reviews',
    ],
    techStack: [
      'SQL (Window Functions)',
      'Python (Pandas, NumPy)',
      'Power BI / Tableau',
      'Cohort & Funnel Modeling',
      'Dimensional Marts',
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/customer-cohort-retention-analytics',
  },
];

const TECHNICAL_STACK_GROUPS = [
  {
    category: '01. Languages & Core Processing',
    icon: Terminal,
    skills: [
      'SQL (Advanced CTEs, Window Functions, Query Plans)',
      'Python (PySpark, Pandas, NumPy, SQLAlchemy, Boto3)',
      'Bash / Shell Scripting',
      'Git & CI/CD Workflows',
    ],
  },
  {
    category: '02. Data Engineering & Pipelines',
    icon: Server,
    skills: [
      'Apache Spark / PySpark (Batch & Structured Streaming)',
      'Apache Airflow (DAG Orchestration, Retries, SLAs)',
      'dbt (Incremental Models, Snapshots / SCD2, Tests)',
      'Apache Kafka & REST API Ingestion',
    ],
  },
  {
    category: '03. Cloud & Data Warehousing',
    icon: Database,
    skills: [
      'Snowflake, Google BigQuery & PostgreSQL',
      'AWS (S3, Glue, Redshift, Lambda)',
      'Medallion Architecture (Bronze / Silver / Gold)',
      'Dimensional Modeling (Star Schema, Fact & Dim)',
    ],
  },
  {
    category: '04. Data Analytics & BI Delivery',
    icon: BarChart3,
    skills: [
      'Power BI & Tableau (DAX, Semantic Modeling)',
      'Cohort Retention, Funnel & LTV Analytics',
      'Data Quality Auditing & Reconciliation',
      'Partitioning, Clustering & Cost Optimization',
    ],
  },
];

const DAY_TO_DAY_WORK = [
  {
    step: '01',
    phase: 'Pipeline Operations & Ingestion',
    title: 'Building & Monitoring Production ETL / ELT Workflows',
    detail:
      'Developing and maintaining scheduled Apache Airflow DAGs and Python ingestion jobs that pull data from transactional databases, REST APIs, and cloud storage. When a job fails or lags behind SLA, I trace logs, fix upstream payload mismatches, and run idempotent backfills without duplicating rows.',
    meta: 'Apache Airflow · Python · Incremental Loads · SLA Monitoring',
  },
  {
    step: '02',
    phase: 'Data Modeling & Transformation',
    title: 'Structuring Bronze, Silver & Gold Warehouse Layers',
    detail:
      'Writing modular dbt and SQL transformations that clean raw staging data, deduplicate records, track historical changes via SCD Type 2, and expose clean Star Schema (Fact and Dimension) marts that downstream analysts and BI tools can query safely.',
    meta: 'dbt · SQL · Star Schema · SCD Type 2 · Schema Tests',
  },
  {
    step: '03',
    phase: 'Performance & Reliability Engineering',
    title: 'Query Tuning, Partitioning & Data Quality Gates',
    detail:
      'Inspecting query execution plans to refactor slow joins, configuring date partitioning and clustering keys on multi-million-row tables, and enforcing automated data quality checks (null bounds, primary-key uniqueness, row-count reconciliation) before tables refresh.',
    meta: 'Query Execution Plans · Partitioning · PySpark Skew Tuning',
  },
  {
    step: '04',
    phase: 'Analytics & Stakeholder Collaboration',
    title: 'Translating Business Questions into Governed Metrics & BI',
    detail:
      'Working directly with product, finance, and operations teams to turn ambiguous business questions into governed SQL semantic views, cohort/funnel analyses, and self-serve Power BI / Tableau dashboards—eliminating manual spreadsheet work.',
    meta: 'Analytical SQL · Python (Pandas) · Power BI / Tableau',
  },
];

const HARD_ENGINEERING_CHALLENGES = [
  {
    num: '01',
    title: 'Silent Data Corruption vs. Loud Pipeline Failures',
    problem:
      'A pipeline that crashes with an exception is easy to fix because it alerts you immediately. The hardest part of data engineering is silent corruption—when a DAG succeeds with exit code 0, but an unannounced upstream status-code change, a many-to-many join fan-out, or a timezone shift quietly distorts revenue or active-user counts.',
    solution:
      'Enforcing automated pre-promotion gates in dbt and SQL: primary-key uniqueness assertions, null-rate thresholds, and source-to-target row/amount reconciliation checks that block Gold mart refreshes if anomalies occur.',
  },
  {
    num: '02',
    title: 'Handling Upstream Schema Drift & Dirty Source Payloads',
    problem:
      'Operational databases and external APIs evolve for application features, not analytics. Nested JSON fields change data types, columns get deprecated without notice, and late-arriving records show up days after a partition closes.',
    solution:
      'Decoupling raw ingestion from business logic using an immutable Bronze layer (storing raw payloads with ingestion metadata) and handling explicit schema casting, deduplication, and dead-letter quarantine in the Silver layer.',
  },
  {
    num: '03',
    title: 'Designing Idempotent Pipelines for Historical Backfills',
    problem:
      'Over 3+ years in production, business definitions inevitably change or historical bugs surface. If pipelines rely on naive append logic or run-time timestamps, re-running 6 months of data either duplicates millions of rows or spikes cloud compute costs.',
    solution:
      'Designing every pipeline around deterministic date partitions and idempotent MERGE / upsert keys so any historical date window can be reprocessed safely and produce the exact same state.',
  },
  {
    num: '04',
    title: 'Preventing Metric Fragmentation Across Teams',
    problem:
      'When business logic lives inside individual BI charts or ad-hoc spreadsheets, five teams end up bringing five different numbers for "Active Customers" or "Net Revenue" to the same review meeting.',
    solution:
      'Moving metric definitions out of dashboard formulas and into a centralized, version-controlled SQL semantic layer so every report queries the exact same governed logic.',
  },
];

interface WorkSectionProps {
  onNavigate?: (tab: NavigationTab) => void;
  isStandaloneWindow?: boolean;
}

export const WorkSection: React.FC<WorkSectionProps> = () => {
  const [engTheme, setEngTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('vd_work_eng_theme_v2');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [githubProfileUrl, setGithubProfileUrl] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('vd_work_github_url_v2') ||
        'https://github.com/vishvajeetdhawale'
      );
    } catch {
      return 'https://github.com/vishvajeetdhawale';
    }
  });

  const [projects, setProjects] = useState<DataEngineeringProject[]>(() => {
    try {
      const saved = localStorage.getItem('vd_work_projects_3yoe_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PROJECTS_3YOE;
  });

  const [domainFilter, setDomainFilter] = useState<
    'All' | 'Data Engineering' | 'Analytics Engineering' | 'Data Analytics'
  >('All');
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>('de-3yoe-1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGithub, setEditingGithub] = useState(false);

  // Add Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projDomain, setProjDomain] = useState<
    'Data Engineering' | 'Analytics Engineering' | 'Data Analytics'
  >('Data Engineering');
  const [projScaleTag, setProjScaleTag] = useState('Production Pipeline · Airflow + dbt');
  const [projSummary, setProjSummary] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projFlowText, setProjFlowText] = useState(
    'Source Data -> Python / Airflow -> Bronze Raw -> dbt Silver/Gold -> BI Mart'
  );
  const [projContribsText, setProjContribsText] = useState('');
  const [projImpactText, setProjImpactText] = useState('');
  const [projStackText, setProjStackText] = useState('Python, SQL, Apache Airflow, dbt, Snowflake');
  const [projGithubUrl, setProjGithubUrl] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('vd_work_eng_theme_v2', engTheme);
    } catch {
      // ignore
    }
  }, [engTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('vd_work_github_url_v2', githubProfileUrl);
    } catch {
      // ignore
    }
  }, [githubProfileUrl]);

  useEffect(() => {
    try {
      localStorage.setItem('vd_work_projects_3yoe_v1', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  const filteredProjects = projects.filter((p) =>
    domainFilter === 'All' ? true : p.domain === domainFilter
  );

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projSummary.trim()) return;

    const newProj: DataEngineeringProject = {
      id: `de-custom-${Date.now()}`,
      number: String(projects.length + 1).padStart(2, '0'),
      title: projTitle.trim(),
      domain: projDomain,
      scaleTag: projScaleTag.trim() || 'Production Data Project',
      summary: projSummary.trim(),
      problemStatement:
        projProblem.trim() ||
        'Engineered to automate data ingestion, enforce schema quality, and deliver reliable analytical tables.',
      architectureFlow: projFlowText
        .split('->')
        .map((s) => s.trim())
        .filter(Boolean),
      engineeringContributions:
        projContribsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean).length > 0
          ? projContribsText
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : ['Built automated ETL/ELT pipeline and validated warehouse models.'],
      impactMetrics:
        projImpactText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean).length > 0
          ? projImpactText
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : ['Improved pipeline reliability and query performance'],
      techStack: projStackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: projGithubUrl.trim() || githubProfileUrl,
      isCustom: true,
    };

    setProjects((prev) => [newProj, ...prev]);
    setShowAddModal(false);
    setProjTitle('');
    setProjSummary('');
    setProjProblem('');
    setProjContribsText('');
    setProjImpactText('');
  };

  const handleDeleteCustomProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const isDark = engTheme === 'dark';

  const ui = isDark
    ? {
        pageBg: 'bg-[#090D16] text-[#F1F5F9]',
        navBg: 'bg-[#090D16]/90 border-[#1E293B]',
        card: 'bg-[#0F1624] border-[#1E293B]',
        cardSubtle: 'bg-[#0B101B] border-[#1E293B]',
        textPrimary: 'text-[#F8FAFC]',
        textSecondary: 'text-[#94A3B8]',
        textMuted: 'text-[#64748B]',
        accent: 'text-[#38BDF8]',
        accentEmerald: 'text-[#34D399]',
        btnPrimary: 'bg-[#0284C7] hover:bg-[#0369A1] text-white',
        btnSecondary:
          'bg-[#161F33] hover:bg-[#1E293B] text-[#E2E8F0] border border-[#26334D]',
        hairline: 'border-[#1E293B]',
        codeBlock: 'bg-[#060911] border-[#1E293B] text-[#E2E8F0]',
      }
    : {
        pageBg: 'bg-[#F8FAFC] text-[#0F172A]',
        navBg: 'bg-white/90 border-[#E2E8F0]',
        card: 'bg-white border-[#E2E8F0] shadow-2xs',
        cardSubtle: 'bg-[#F1F5F9]/70 border-[#E2E8F0]',
        textPrimary: 'text-[#0F172A]',
        textSecondary: 'text-[#475569]',
        textMuted: 'text-[#64748B]',
        accent: 'text-[#0284C7]',
        accentEmerald: 'text-[#059669]',
        btnPrimary: 'bg-[#0F172A] hover:bg-[#1E293B] text-white',
        btnSecondary:
          'bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]',
        hairline: 'border-[#E2E8F0]',
        codeBlock: 'bg-[#0F172A] border-[#1E293B] text-[#F1F5F9]',
      };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${ui.pageBg}`}>
      {/* =====================================================================
          STICKY STANDALONE ENGINEERING HEADER
          ===================================================================== */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 ${ui.navBg}`}
      >
        <div className="max-w-[1160px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0284C7]/15 border border-[#0284C7]/40 flex items-center justify-center text-[#38BDF8] font-mono text-xs font-bold">
              VD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm sm:text-base tracking-tight ${ui.textPrimary}`}>
                  Vishvajeet V Dhawale
                </span>
                <span className={ui.textMuted} aria-hidden="true">
                  ·
                </span>
                <span className={`font-mono text-xs font-medium ${ui.accent}`}>
                  Data Engineer
                </span>
              </div>
              <div className={`text-[11px] font-mono ${ui.textMuted}`}>
                3+ Years Experience · ETL/ELT Pipelines, SQL Warehousing &amp; Analytics
              </div>
            </div>
          </div>

          {/* Section Jump Links & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-5">
            <nav
              aria-label="Portfolio sections"
              className="hidden lg:flex items-center gap-5 text-xs font-medium"
            >
              <a
                href="#stack"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Tech Stack
              </a>
              <a
                href="#projects"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Projects (3+ YOE)
              </a>
              <a
                href="#day-to-day"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Day-to-Day Work
              </a>
              <a
                href="#challenges"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Key Challenges
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors ${ui.btnSecondary}`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setEngTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${ui.btnSecondary}`}
                title="Toggle Dark / Light Engineering Theme"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN PORTFOLIO CONTAINER
          ===================================================================== */}
      <main className="max-w-[1160px] mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16">
        {/* -------------------------------------------------------------------
            HERO: ROLE SUMMARY & 3+ YEARS EXPERIENCE SNAPSHOT
            ------------------------------------------------------------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className={`font-semibold ${ui.accent}`}>
                DATA ENGINEER &amp; DATA ANALYST
              </span>
              <span className={ui.textMuted} aria-hidden="true">
                ·
              </span>
              <span className={ui.textSecondary}>3+ Years Production Experience</span>
              <span className={ui.textMuted} aria-hidden="true">
                ·
              </span>
              <span className={ui.accentEmerald}>Batch &amp; Streaming Architectures</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight leading-[1.14] text-balance ${ui.textPrimary}`}
            >
              Building reliable data pipelines, governed warehouse models, and analytics that teams trust.
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed max-w-[66ch] ${ui.textSecondary}`}>
              I am <strong className={ui.textPrimary}>Vishvajeet V Dhawale</strong>, a Data Engineer with 3+ years of hands-on experience designing end-to-end ETL/ELT pipelines, structuring Bronze–Silver–Gold Medallion data warehouses, tuning high-volume SQL &amp; PySpark workloads, and partnering with business teams to deliver single-source-of-truth KPIs and BI dashboards.
            </p>

            {/* Primary Links */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href={githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors ${ui.btnPrimary}`}
              >
                <GitBranch className="w-4 h-4" />
                <span>View GitHub Profile</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setEditingGithub(!editingGithub)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer ${ui.btnSecondary}`}
              >
                <span>Update GitHub Link</span>
              </button>

              <a
                href="mailto:vishudhawle11111@gmail.com"
                className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors ${ui.btnSecondary}`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>vishudhawle11111@gmail.com</span>
              </a>
            </div>

            {editingGithub && (
              <div className={`p-3.5 rounded-xl border flex flex-wrap items-center gap-2 max-w-lg ${ui.card}`}>
                <input
                  type="url"
                  value={githubProfileUrl}
                  onChange={(e) => setGithubProfileUrl(e.target.value)}
                  placeholder="https://github.com/your-username"
                  className={`flex-1 min-w-[220px] px-3 py-1.5 rounded-lg border bg-transparent text-xs font-mono ${ui.hairline} ${ui.textPrimary}`}
                />
                <button
                  type="button"
                  onClick={() => setEditingGithub(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${ui.btnPrimary}`}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Right 4 Cols: 3-Year Experience Engineering Profile Card */}
          <aside className={`lg:col-span-4 rounded-xl border p-5 space-y-4 ${ui.card}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${ui.hairline}`}>
              <span className={`text-xs font-mono font-semibold ${ui.textPrimary}`}>
                ENGINEERING PROFILE
              </span>
              <Briefcase className={`w-4 h-4 ${ui.accent}`} />
            </div>

            <dl className="space-y-3 text-xs">
              <div className="flex justify-between gap-4">
                <dt className={ui.textMuted}>Name</dt>
                <dd className={`font-semibold text-right ${ui.textPrimary}`}>
                  Vishvajeet V Dhawale
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className={ui.textMuted}>Role</dt>
                <dd className={`font-medium text-right ${ui.accent}`}>
                  Data Engineer &amp; Analyst
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className={ui.textMuted}>Experience</dt>
                <dd className={`font-mono font-semibold text-right ${ui.textPrimary}`}>
                  3+ Years (Production)
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className={ui.textMuted}>Primary Stack</dt>
                <dd className={`font-mono text-right ${ui.textPrimary}`}>
                  SQL · Python · PySpark · Airflow · dbt
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className={ui.textMuted}>Data Warehouses</dt>
                <dd className={`font-mono text-right ${ui.textPrimary}`}>
                  Snowflake · BigQuery · PostgreSQL
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className={ui.textMuted}>Analytics &amp; BI</dt>
                <dd className={`font-mono text-right ${ui.textPrimary}`}>
                  Power BI · Tableau · Cohort SQL
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        {/* -------------------------------------------------------------------
            01. TECHNICAL STACK & ECOSYSTEM (3+ YEARS PRODUCTION FOCUS)
            ------------------------------------------------------------------- */}
        <section id="stack" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="space-y-1">
            <div className={`text-xs font-mono ${ui.accent}`}>01. TECHNICAL STACK</div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
              Core Data Engineering &amp; Analytics Toolkit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECHNICAL_STACK_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.category}
                  className={`rounded-xl border p-5 space-y-3.5 ${ui.card}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-mono font-semibold ${ui.accent}`}>
                      {group.category}
                    </span>
                    <Icon className={`w-4 h-4 shrink-0 ${ui.accent}`} />
                  </div>

                  <ul className={`space-y-2 text-xs leading-relaxed ${ui.textSecondary}`}>
                    {group.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2">
                        <span className={`font-mono ${ui.accent}`}>·</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            02. PRODUCTION PROJECTS (3 YEARS EXPERIENCE SCOPE)
            ------------------------------------------------------------------- */}
        <section id="projects" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono ${ui.accent}`}>
                02. PRODUCTION ARCHITECTURE &amp; ANALYTICS PROJECTS
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                Selected Data Engineering &amp; Analytics Work
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Filter projects"
                className={`inline-flex items-center p-1 rounded-lg border ${ui.cardSubtle}`}
              >
                {(
                  ['All', 'Data Engineering', 'Analytics Engineering', 'Data Analytics'] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDomainFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      domainFilter === tab
                        ? ui.btnPrimary
                        : `${ui.textSecondary} hover:${ui.textPrimary}`
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${ui.btnSecondary}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredProjects.map((project, idx) => {
              const isCodeOpen = expandedCodeId === project.id;
              return (
                <article
                  key={project.id}
                  className={`rounded-xl border p-5 sm:p-7 space-y-5 ${ui.card}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className={`font-semibold ${ui.accent}`}>
                          PROJECT {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className={ui.textMuted} aria-hidden="true">
                          ·
                        </span>
                        <span className={ui.textPrimary}>{project.domain}</span>
                        <span className={ui.textMuted} aria-hidden="true">
                          ·
                        </span>
                        <span className={ui.textSecondary}>{project.scaleTag}</span>
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${ui.textPrimary}`}>
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors ${ui.btnSecondary}`}
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>GitHub Repo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      {project.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomProject(project.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/30 transition-colors cursor-pointer"
                          title="Delete custom project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className={`text-sm sm:text-base leading-relaxed ${ui.textSecondary}`}>
                    {project.summary}
                  </p>

                  {/* Architecture Flow */}
                  <div className={`p-4 rounded-lg border space-y-2 ${ui.cardSubtle}`}>
                    <div className={`text-[11px] font-mono uppercase tracking-wider ${ui.textMuted}`}>
                      Architecture &amp; Pipeline Flow
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {project.architectureFlow.map((node, i) => (
                        <React.Fragment key={node + i}>
                          <span className={`px-2.5 py-1 rounded border ${ui.card} ${ui.textPrimary}`}>
                            {node}
                          </span>
                          {i < project.architectureFlow.length - 1 && (
                            <span className={ui.accent} aria-hidden="true">
                              →
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Problem vs Engineering Implementation */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-2">
                      <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}>
                        Problem &amp; Bottleneck
                      </h4>
                      <p className={`text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                        {project.problemStatement}
                      </p>
                    </div>

                    <div className="lg:col-span-7 space-y-2">
                      <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}>
                        Engineering Implementation
                      </h4>
                      <ul className={`space-y-2 text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                        {project.engineeringContributions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={`font-mono mt-0.5 ${ui.accent}`}>
                              0{i + 1}.
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quantified Impact & Stack */}
                  <div
                    className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${ui.hairline}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
                        {project.impactMetrics.map((metric) => (
                          <span
                            key={metric}
                            className={`inline-flex items-center gap-1.5 font-medium ${ui.accentEmerald}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{metric}</span>
                          </span>
                        ))}
                      </div>
                      <div className={`text-xs font-mono ${ui.textMuted}`}>
                        Stack: {project.techStack.join(' · ')}
                      </div>
                    </div>

                    {project.codeSnippet && (
                      <button
                        type="button"
                        onClick={() => setExpandedCodeId(isCodeOpen ? null : project.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${ui.btnSecondary}`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isCodeOpen ? 'Hide Code' : 'View SQL / PySpark Code'}</span>
                        {isCodeOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {project.codeSnippet && isCodeOpen && (
                    <div className={`rounded-lg border overflow-hidden ${ui.codeBlock}`}>
                      <div className="px-4 py-2 border-b border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                        <span>{project.codeSnippetTitle}</span>
                        <span>Production Implementation</span>
                      </div>
                      <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{project.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            03. WHAT I DO IN DAY-TO-DAY WORK
            ------------------------------------------------------------------- */}
        <section id="day-to-day" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono ${ui.accent}`}>
                03. DAY-TO-DAY ENGINEERING WORKFLOW
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                What I Do in Day-to-Day Work
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-md ${ui.textSecondary}`}>
              How my daily work balances pipeline reliability, dimensional data modeling, query optimization, and business analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAY_TO_DAY_WORK.map((item) => (
              <div
                key={item.step}
                className={`rounded-xl border p-5 sm:p-6 space-y-3 ${ui.card}`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className={`font-semibold ${ui.accent}`}>
                    {item.step}. {item.phase}
                  </span>
                  <Clock className={`w-3.5 h-3.5 ${ui.textMuted}`} />
                </div>

                <h3 className={`text-lg font-bold ${ui.textPrimary}`}>{item.title}</h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                  {item.detail}
                </p>

                <div className={`pt-3 border-t text-xs font-mono ${ui.hairline} ${ui.textMuted}`}>
                  {item.meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            04. WHAT IS MOST CHALLENGING IN MY ROLE
            ------------------------------------------------------------------- */}
        <section id="challenges" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono ${ui.accent}`}>
                04. PRODUCTION CHALLENGES &amp; SOLUTIONS
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                What Is Most Challenging in Data Engineering &amp; Analytics
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-md ${ui.textSecondary}`}>
              Real production challenges I have solved across 3+ years of maintaining data pipelines and analytical warehouses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {HARD_ENGINEERING_CHALLENGES.map((item) => (
              <div
                key={item.num}
                className={`rounded-xl border p-5 sm:p-6 space-y-4 ${ui.card}`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-semibold ${ui.accent}`}>CHALLENGE {item.num}</span>
                  <ShieldAlert className={`w-4 h-4 ${ui.accent}`} />
                </div>

                <h3 className={`text-lg sm:text-xl font-bold ${ui.textPrimary}`}>
                  {item.title}
                </h3>

                <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
                  <p className={ui.textSecondary}>
                    <strong className={ui.textPrimary}>The Challenge: </strong>
                    {item.problem}
                  </p>
                  <div className={`p-3.5 rounded-lg border ${ui.cardSubtle}`}>
                    <strong className={ui.accent}>How I Handle It: </strong>
                    <span className={ui.textPrimary}>{item.solution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            MINIMAL ENGINEERING FOOTER
            ------------------------------------------------------------------- */}
        <footer
          className={`pt-8 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${ui.hairline} ${ui.textMuted}`}
        >
          <div>
            Vishvajeet V Dhawale · Data Engineer &amp; Data Analyst (3+ Years Experience)
          </div>
          <div className="flex items-center gap-4">
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:${ui.textPrimary} inline-flex items-center gap-1`}
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span>·</span>
            <a
              href="mailto:vishudhawle11111@gmail.com"
              className={`hover:${ui.textPrimary}`}
            >
              vishudhawle11111@gmail.com
            </a>
          </div>
        </footer>
      </main>

      {/* =====================================================================
          ADD PROJECT MODAL
          ===================================================================== */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add Data Engineering Project"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className={`max-w-xl w-full rounded-2xl border p-6 space-y-4 max-h-[88vh] overflow-y-auto ${ui.pageBg} ${ui.hairline}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${ui.hairline}`}>
              <h3 className={`text-base font-bold ${ui.textPrimary}`}>
                Add Data Engineering / Analytics Project
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`text-xs font-mono cursor-pointer ${ui.textSecondary}`}
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g., Automated Retail Lakehouse with Airflow & dbt"
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>Domain</label>
                  <select
                    value={projDomain}
                    onChange={(e) =>
                      setProjDomain(
                        e.target.value as
                          | 'Data Engineering'
                          | 'Analytics Engineering'
                          | 'Data Analytics'
                      )
                    }
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                  >
                    <option value="Data Engineering" className="bg-slate-900 text-white">
                      Data Engineering
                    </option>
                    <option value="Analytics Engineering" className="bg-slate-900 text-white">
                      Analytics Engineering
                    </option>
                    <option value="Data Analytics" className="bg-slate-900 text-white">
                      Data Analytics
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>GitHub Repo URL</label>
                  <input
                    type="url"
                    value={projGithubUrl}
                    onChange={(e) => setProjGithubUrl(e.target.value)}
                    placeholder="https://github.com/vishvajeetdhawale/repo"
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent font-mono ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>
                    Scale / Scope Tag
                  </label>
                  <input
                    type="text"
                    value={projScaleTag}
                    onChange={(e) => setProjScaleTag(e.target.value)}
                    placeholder="10M+ Rows · Airflow + Snowflake"
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent font-mono ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`block font-mono ${ui.textSecondary}`}>Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={projSummary}
                  onChange={(e) => setProjSummary(e.target.value)}
                  placeholder="Brief overview of the pipeline or analytics solution..."
                  className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block font-mono ${ui.textSecondary}`}>
                  Architecture Flow (separate stages with -&gt;)
                </label>
                <input
                  type="text"
                  value={projFlowText}
                  onChange={(e) => setProjFlowText(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border bg-transparent font-mono ${ui.hairline} ${ui.textPrimary}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block font-mono ${ui.textSecondary}`}>
                  Engineering Contributions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={projContribsText}
                  onChange={(e) => setProjContribsText(e.target.value)}
                  placeholder={`Built incremental dbt models with SCD Type 2\nConfigured Airflow SLA alerts and automated retries`}
                  className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>
                    Impact Metrics (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projImpactText}
                    onChange={(e) => setProjImpactText(e.target.value)}
                    placeholder="Reduced runtime by 60%, Saved 4h/week"
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projStackText}
                    onChange={(e) => setProjStackText(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent font-mono ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${ui.btnSecondary}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${ui.btnPrimary}`}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
