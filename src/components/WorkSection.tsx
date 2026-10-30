import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
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
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Layers,
  Workflow,
  Activity,
  FileCode2,
} from 'lucide-react';
import { NavigationTab } from '../types/archive';

type WorkThemeMode = 'light' | 'carbon';

interface SkillProficiencyItem {
  name: string;
  shortName: string;
  proficiency: number;
  yearsUsed: string;
  category: 'Pipelines & Compute' | 'Warehousing & SQL' | 'Analytics & BI';
  productionScope: string;
  lightColor: string;
  carbonColor: string;
}

const SKILL_PROFICIENCY_DATA: SkillProficiencyItem[] = [
  {
    name: 'SQL & Warehouse Modeling',
    shortName: 'SQL & Modeling',
    proficiency: 94,
    yearsUsed: '3+ Yrs Daily',
    category: 'Warehousing & SQL',
    productionScope:
      'Kimball Star Schemas, SCD Type 2, Window Functions, Complex CTEs & Execution Plan Tuning',
    lightColor: '#0F766E',
    carbonColor: '#F97316',
  },
  {
    name: 'Python (ETL, PySpark, Pandas)',
    shortName: 'Python & ETL',
    proficiency: 91,
    yearsUsed: '3+ Yrs Daily',
    category: 'Pipelines & Compute',
    productionScope:
      'Idempotent REST/DB extractors, PySpark transformations, Pandas statistical profiling & Boto3',
    lightColor: '#EA580C',
    carbonColor: '#FB923C',
  },
  {
    name: 'Snowflake, BigQuery & Postgres',
    shortName: 'Cloud Warehouses',
    proficiency: 89,
    yearsUsed: '3+ Yrs Prod',
    category: 'Warehousing & SQL',
    productionScope:
      'Medallion Bronze/Silver/Gold design, date partitioning, clustering keys & scan cost control',
    lightColor: '#4F46E5',
    carbonColor: '#38BDF8',
  },
  {
    name: 'dbt (Data Build Tool)',
    shortName: 'dbt Core / Cloud',
    proficiency: 88,
    yearsUsed: '2.5+ Yrs Prod',
    category: 'Warehousing & SQL',
    productionScope:
      'Incremental MERGE models, SCD2 snapshots, Jinja macros, lineage docs & 40+ schema tests',
    lightColor: '#D97706',
    carbonColor: '#10B981',
  },
  {
    name: 'Apache Airflow',
    shortName: 'Apache Airflow',
    proficiency: 87,
    yearsUsed: '2.5+ Yrs Prod',
    category: 'Pipelines & Compute',
    productionScope:
      'DAG orchestration, TaskFlow API, dynamic task mapping, SLA failure alerts & idempotent backfills',
    lightColor: '#0284C7',
    carbonColor: '#FBBF24',
  },
  {
    name: 'Apache Spark / PySpark',
    shortName: 'Apache Spark',
    proficiency: 85,
    yearsUsed: '2.5+ Yrs Prod',
    category: 'Pipelines & Compute',
    productionScope:
      'Distributed batch & structured streaming, broadcast joins, shuffle skew tuning & watermarks',
    lightColor: '#7C3AED',
    carbonColor: '#34D399',
  },
  {
    name: 'Power BI & Tableau',
    shortName: 'Power BI / Tableau',
    proficiency: 84,
    yearsUsed: '3+ Yrs Prod',
    category: 'Analytics & BI',
    productionScope:
      'Governed semantic KPI models, DAX measures, M0–M12 cohort retention & executive dashboards',
    lightColor: '#059669',
    carbonColor: '#818CF8',
  },
  {
    name: 'Apache Kafka & Event Streams',
    shortName: 'Apache Kafka',
    proficiency: 79,
    yearsUsed: '2+ Yrs Prod',
    category: 'Pipelines & Compute',
    productionScope:
      'Partitioned topic ingestion, schema validation, dead-letter isolation & watermarked consumers',
    lightColor: '#334155',
    carbonColor: '#F472B6',
  },
];

const RADAR_COMPETENCY_DATA = [
  { axis: 'SQL & Modeling', score: 94, fullMark: 100 },
  { axis: 'ETL / Airflow', score: 89, fullMark: 100 },
  { axis: 'Spark & Streaming', score: 85, fullMark: 100 },
  { axis: 'Data Quality & dbt', score: 90, fullMark: 100 },
  { axis: 'Query Optimization', score: 92, fullMark: 100 },
  { axis: 'BI & Cohort Analytics', score: 86, fullMark: 100 },
];

const OPTIMIZATION_BENCHMARK_DATA = [
  {
    metric: 'Daily ELT Runtime',
    beforeLabel: '115 min (Full Dump)',
    afterLabel: '41 min (Incremental)',
    improvementPct: 64,
  },
  {
    metric: 'BI Query Latency',
    beforeLabel: '42.0s (Raw Joins)',
    afterLabel: '3.1s (Clustered Mart)',
    improvementPct: 92,
  },
  {
    metric: 'Warehouse Scan Cost',
    beforeLabel: 'Unpartitioned Scan',
    afterLabel: 'Partition Pruned',
    improvementPct: 55,
  },
  {
    metric: 'Spark Stage Speedup',
    beforeLabel: 'Sort-Merge Skew',
    afterLabel: 'Broadcast + Salting',
    improvementPct: 71,
  },
];

interface MedallionStage {
  id: string;
  stageCode: string;
  layerName: string;
  subtitle: string;
  tools: string[];
  slaTarget: string;
  storageFormat: string;
  howCreated: string;
  engineeringRules: string[];
  codeTitle: string;
  codeSample: string;
}

const MEDALLION_BLUEPRINT_STAGES: MedallionStage[] = [
  {
    id: 'stage-ingest',
    stageCode: 'STAGE 01 · INGESTION & ORCHESTRATION',
    layerName: 'Source Extraction & CDC',
    subtitle: 'PostgreSQL OLTP · REST APIs · Kafka Topics → Apache Airflow',
    tools: ['Apache Airflow', 'Python (Boto3 / Requests)', 'Kafka Consumers', 'Watermark State'],
    slaTarget: '05:30 UTC Daily + 15m Micro-batch',
    storageFormat: 'JSONL / Avro Streams',
    howCreated:
      'Built modular Python extraction operators orchestrated by Apache Airflow DAGs. Instead of brittle full-table dumps, each extractor reads the high-watermark timestamp from metadata state, paginates upstream APIs with exponential backoff, and writes raw batches to cloud object storage.',
    engineeringRules: [
      'Idempotent execution keyed by logical execution_date ({{ ds }}) so failed tasks can be safely cleared and re-run.',
      'Exponential retry policies with Slack/Email SLA miss callbacks before downstream dbt tasks trigger.',
      'Strict separation of extraction and transformation—extractors never mutate source business values.',
    ],
    codeTitle: 'dags/extract_orders_incremental_dag.py',
    codeSample: `@task(retries=3, retry_delay=timedelta(minutes=5))
def extract_incremental_orders(ds: str, prev_ds: str) -> str:
    """Extracts bounded window [prev_ds, ds) from OLTP replica to S3 Bronze."""
    query = """
        SELECT order_id, customer_id, status, gross_amount, updated_at
        FROM prod_oltp.orders
        WHERE updated_at >= %(window_start)s
          AND updated_at <  %(window_end)s
    """
    df = read_postgres_chunked(query, params={"window_start": prev_ds, "window_end": ds})
    s3_uri = f"s3://vd-data-lake/bronze/orders/dt={ds}/part-000.parquet"
    write_parquet_atomic(df, s3_uri, compression="snappy")
    return s3_uri`,
  },
  {
    id: 'stage-bronze',
    stageCode: 'STAGE 02 · BRONZE LAYER',
    layerName: 'Raw Immutable Landing Zone',
    subtitle: 'Append-Only Partitioned Parquet · Audit Metadata · Zero Data Loss',
    tools: ['AWS S3 / GCS', 'Apache Parquet', 'Snowflake External Stages', 'PySpark'],
    slaTarget: '06:00 UTC · 100% Source Fidelity',
    storageFormat: 'Snappy Parquet (Partitioned by dt)',
    howCreated:
      'Created an append-only Bronze layer partitioned by ingestion date (dt=YYYY-MM-DD). Every record is stored alongside system audit columns (_ingested_at, _source_file, _batch_id) so any downstream bug can be replayed from raw history without re-querying production OLTP databases.',
    engineeringRules: [
      'Immutable storage: Bronze files are never overwritten or deleted by transformation jobs.',
      'Schema-on-read protection: nested JSON payloads are stored raw while corrupt records route to a Dead-Letter path.',
      'External table auto-refresh registers new daily partitions for downstream Silver processing.',
    ],
    codeTitle: 'models/bronze/src_bronze_orders.yml',
    codeSample: `version: 2
sources:
  - name: bronze_raw
    database: PROD_LAKEHOUSE
    schema: BRONZE
    freshness:
      warn_after: {count: 6, period: hour}
      error_after: {count: 12, period: hour}
    loaded_at_field: _ingested_at
    tables:
      - name: raw_orders_parquet
        description: "Immutable daily Parquet landing table from OLTP extraction"`,
  },
  {
    id: 'stage-silver',
    stageCode: 'STAGE 03 · SILVER LAYER',
    layerName: 'Cleaned, Deduplicated & Conformed',
    subtitle: 'dbt Incremental MERGE · PySpark Skew Tuning · SCD Type 2 History',
    tools: ['dbt Core', 'PySpark', 'SQL Window Functions', 'SCD Type 2 Snapshots'],
    slaTarget: '06:30 UTC · Zero Duplicate Keys',
    storageFormat: 'Clustered Warehouse Tables / Delta',
    howCreated:
      'Engineered Silver models in dbt and PySpark to standardize data types, normalize timestamps to UTC, deduplicate late-arriving CDC events using ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC), and track historical attribute changes via SCD Type 2 valid_from / valid_to windows.',
    engineeringRules: [
      'Incremental MERGE strategy with a 48-hour lookback window to capture late-arriving updates without full table scans.',
      'Broadcast joins in PySpark for dimension lookups under 100MB to eliminate sort-merge shuffle skew.',
      'Explicit NULL handling and currency/timezone standardization before any business aggregation.',
    ],
    codeTitle: 'snapshots/scd2_dim_customers.sql',
    codeSample: `{% snapshot scd2_dim_customers %}
{{
    config(
      target_database='PROD_LAKEHOUSE',
      target_schema='SILVER',
      unique_key='customer_id',
      strategy='timestamp',
      updated_at='updated_at',
      invalidate_hard_deletes=True
    )
}}
SELECT
    customer_id,
    LOWER(TRIM(email)) AS customer_email,
    customer_tier,
    region_code,
    acquisition_channel,
    updated_at
FROM {{ source('bronze_raw', 'raw_customers') }}
{% endsnapshot %}`,
  },
  {
    id: 'stage-gold',
    stageCode: 'STAGE 04 · GOLD LAYER',
    layerName: 'Kimball Star Schema & Business Marts',
    subtitle: 'Fact & Dimension Tables · Pre-Aggregated Rollups · 40+ Quality Gates',
    tools: ['dbt Marts', 'Kimball Star Schema', 'dbt_expectations', 'Snowflake / BigQuery'],
    slaTarget: '07:00 UTC · 99.9% Test Pass Rate',
    storageFormat: 'Date-Partitioned & Clustered Marts',
    howCreated:
      'Designed Kimball dimensional Star Schemas (fct_orders, fct_user_events, dim_customers, dim_products, dim_date) optimized for low-latency BI queries. Configured date partitioning and composite clustering keys, gated by 40+ automated dbt schema and reconciliation tests.',
    engineeringRules: [
      'Grain enforcement: every Fact table declares an explicit primary grain tested for uniqueness and not-null constraints.',
      'Referential integrity checks verify every foreign key in fct_orders maps to a valid dim_customers surrogate key.',
      'Pre-aggregated daily/monthly rollup marts cut BI dashboard query latency from 42s down to 3.1s.',
    ],
    codeTitle: 'models/gold/schema_quality_tests.yml',
    codeSample: `models:
  - name: fct_orders
    description: "Order line-item fact table at one-row-per-order grain"
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: customer_sk
        tests:
          - not_null
          - relationships:
              to: ref('dim_customers')
              field: customer_sk
      - name: net_order_amount
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 500000`,
  },
  {
    id: 'stage-bi',
    stageCode: 'STAGE 05 · SEMANTIC LAYER & ANALYTICS',
    layerName: 'Governed KPIs, Cohort Marts & BI Delivery',
    subtitle: 'Power BI / Tableau · M0–M12 Retention Cohorts · Executive Self-Serve',
    tools: ['Power BI', 'Tableau', 'Analytical SQL', 'Python (Pandas)'],
    slaTarget: '07:15 UTC · < 3.5s Dashboard Load',
    storageFormat: 'Semantic Views & DirectQuery / Import',
    howCreated:
      'Centralized business metric formulas (Net Revenue, Rolling 30-Day Active Users, M1–M12 Cohort Retention, Order Fulfillment SLA) inside governed SQL semantic views so Finance, Product, and Operations teams query one single source of truth instead of conflicting spreadsheets.',
    engineeringRules: [
      'Zero business logic locked inside proprietary BI calculated fields—all core KPIs live in version-controlled SQL/dbt.',
      'Automated weekly variance and funnel drop-off profiling using Python (Pandas) and SQL window functions.',
      'Eliminated 6+ hours/week of manual CSV/Excel stitching across product and operations reviews.',
    ],
    codeTitle: 'models/analytics/mart_customer_cohort_retention.sql',
    codeSample: `WITH first_purchase AS (
    SELECT customer_id, DATE_TRUNC('month', MIN(order_date)) AS cohort_month
    FROM {{ ref('fct_orders') }}
    WHERE order_status = 'COMPLETED'
    GROUP BY 1
),
monthly_activity AS (
    SELECT DISTINCT
        o.customer_id,
        f.cohort_month,
        DATEDIFF('month', f.cohort_month, DATE_TRUNC('month', o.order_date)) AS month_number
    FROM {{ ref('fct_orders') }} o
    JOIN first_purchase f ON o.customer_id = f.customer_id
)
SELECT
    cohort_month,
    month_number,
    COUNT(DISTINCT customer_id) AS active_customers,
    ROUND(100.0 * COUNT(DISTINCT customer_id)
      / FIRST_VALUE(COUNT(DISTINCT customer_id)) OVER (
          PARTITION BY cohort_month ORDER BY month_number
        ), 2) AS retention_pct
FROM monthly_activity
GROUP BY 1, 2;`,
  },
];

export interface DataEngineeringProject {
  id: string;
  number: string;
  title: string;
  domain: 'Data Engineering' | 'Analytics Engineering' | 'Data Analytics';
  scaleTag: string;
  summary: string;
  problemStatement: string;
  howCreatedSteps: string[];
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
    scaleTag: '35+ Source Tables · 12M+ Rows/Day · Airflow + dbt + Snowflake',
    summary:
      'Architected an end-to-end Bronze → Silver → Gold Medallion data platform replacing fragile overnight cron dumps with orchestrated Apache Airflow DAGs, incremental dbt MERGE models, and automated data quality gates.',
    problemStatement:
      'Operational PostgreSQL databases and REST APIs were extracted via full-table overnight dumps. Unannounced upstream schema changes, duplicate primary keys, and lack of historical state tracking caused morning BI refreshes to fail or report inconsistent revenue numbers.',
    howCreatedSteps: [
      'Ingestion Layer: Built parameterized Python extractors in Apache Airflow using watermark timestamps and exponential backoff, landing Snappy-compressed Parquet files into S3 Bronze partitions.',
      'Silver Transformation: Modeled incremental dbt transformations using MERGE strategies with a 2-day late-arriving lookback window and SCD Type 2 snapshots for customer/order status history.',
      'Gold Marts & Governance: Structured Kimball Star Schema fact/dimension tables gated by 40+ dbt schema tests (uniqueness, referential integrity, freshness, row-count reconciliation) and GitHub Actions CI.',
    ],
    architectureFlow: [
      'OLTP Postgres & REST APIs',
      'Airflow Python Extractors',
      'S3 Bronze (Partitioned Parquet)',
      'dbt Silver (Dedup & SCD Type 2)',
      'dbt Gold Star Schema Marts',
      '40+ dbt Quality Gates',
    ],
    engineeringContributions: [
      'Engineered idempotent Python extraction tasks orchestrated in Apache Airflow with watermark state tracking, task retries, and Slack SLA failure alerts.',
      'Modeled Silver and Gold warehouse layers in dbt using incremental MERGE strategies and Slowly Changing Dimensions (SCD Type 2) to preserve historical state.',
      'Enforced 40+ automated dbt data quality assertions that quarantine anomalous batches before they can corrupt executive Power BI dashboards.',
    ],
    impactMetrics: [
      '64% reduction in daily pipeline runtime (115m → 41m)',
      'Zero duplicate record leakage into Gold BI tables',
      '55% lower warehouse compute scan cost via date partitioning',
    ],
    techStack: [
      'Python',
      'SQL',
      'Apache Airflow',
      'dbt Core',
      'Snowflake / PostgreSQL',
      'AWS S3 (Parquet)',
      'Docker',
      'GitHub Actions CI',
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
      'High-throughput PySpark data processing pipeline ingesting application telemetry and clickstream logs from Apache Kafka with late-event watermarking, broadcast join optimization, and dead-letter quarantine.',
    problemStatement:
      'High-volume JSON clickstream logs suffered from severe Spark shuffle skew on high-cardinality user keys and frequent job crashes whenever upstream mobile clients emitted malformed JSON payloads or out-of-order events.',
    howCreatedSteps: [
      'Stream Ingestion: Configured PySpark Structured Streaming consumers reading partitioned Apache Kafka telemetry topics with explicit StructType schema enforcement.',
      'Dead-Letter Quarantine: Routed corrupt or schema-mismatched JSON payloads to a dedicated S3 Dead-Letter path for audit replay instead of failing the Spark job.',
      'Performance Tuning: Applied 15-minute event-time watermarks for late mobile events, replaced sort-merge joins with broadcast joins on lookup dimensions, and compacted small Parquet files.',
    ],
    architectureFlow: [
      'Mobile & Web Producers',
      'Apache Kafka Topics',
      'PySpark Structured Streaming',
      'Dead-Letter S3 Quarantine',
      'Compacted Parquet / Delta Lake',
    ],
    engineeringContributions: [
      'Developed PySpark ingestion jobs with explicit StructType validation, isolating malformed JSON payloads into a dead-letter S3 bucket with 100% auditability.',
      'Eliminated Spark stage bottlenecks by replacing sort-merge joins with broadcast joins on dimension tables and tuning shuffle partition sizing.',
      'Implemented 15-minute event-time watermarking to accurately aggregate late-arriving telemetry events into compacted daily Parquet partitions.',
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
from pyspark.sql.functions import col, from_json, broadcast

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
      'Refactored legacy 500+ line ad-hoc SQL reporting queries into a governed dbt/SQL semantic KPI layer using window functions, pre-aggregated rollups, and composite clustering keys.',
    problemStatement:
      'Finance, Operations, and Product teams maintained separate 500+ line SQL scripts with conflicting business rules—causing weekly KPI discrepancies in leadership reviews and slow 40+ second BI dashboard load times.',
    howCreatedSteps: [
      'Query Plan Audit: Profiled warehouse query execution plans to identify full-table scans, correlated subqueries, and unindexed string joins across multi-million-row fact tables.',
      'Semantic Layer Design: Standardized metric definitions (Net Revenue, Rolling 30-Day Active Users, Order Fulfillment SLA) into version-controlled dbt semantic views.',
      'Physical Optimization: Introduced date partitioning and composite clustering keys alongside daily pre-aggregated rollup marts for sub-4-second Power BI queries.',
    ],
    architectureFlow: [
      'Raw Transactional Tables',
      'Query Execution Plan Audit',
      'Partitioned & Clustered Rollups',
      'Governed Semantic KPI Views',
      'Power BI & Self-Serve SQL',
    ],
    engineeringContributions: [
      'Audited query execution plans to eliminate redundant full-table scans, correlated subqueries, and expensive string joins across multi-million-row tables.',
      'Consolidated core KPI definitions into version-controlled dbt/SQL semantic views used across Finance, Operations, and Product.',
      'Built pre-aggregated daily and monthly rollup tables with composite clustering keys so dashboards query lightweight marts instead of raw logs.',
    ],
    impactMetrics: [
      'Dashboard query latency reduced from ~42s to 3.1s (92% faster)',
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
      'End-to-end analytical data mart and executive BI suite combining SQL cohort modeling, Python statistical profiling, and interactive Power BI / Tableau dashboards to diagnose churn and funnel conversion.',
    problemStatement:
      'Top-line user acquisition hid high Month-2 churn in specific marketing channels, while analysts spent 6+ hours every week manually stitching CSV exports in Excel to track onboarding funnel conversion.',
    howCreatedSteps: [
      'Cohort SQL Modeling: Authored modular SQL window-function models tracking monthly user retention (M0–M12), repeat purchase intervals, and Customer Lifetime Value (LTV).',
      'Statistical Segment Profiling: Used Python (Pandas, NumPy) to quantify conversion drop-offs across device types, payment methods, and onboarding steps.',
      'Interactive BI Delivery: Connected Power BI / Tableau directly to governed Gold cohort marts with drill-down filters by acquisition channel and customer tier.',
    ],
    architectureFlow: [
      'User Lifecycle & Order Facts',
      'SQL Cohort & Funnel Window Models',
      'Python (Pandas) Variance Profiling',
      'Interactive Power BI / Tableau Suite',
    ],
    engineeringContributions: [
      'Authored modular SQL cohort models tracking monthly user retention (M0–M12), repeat purchase intervals, and LTV by acquisition channel.',
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
      'SQL (Complex CTEs, Window Functions, Query Plans)',
      'Python (PySpark, Pandas, NumPy, SQLAlchemy, Boto3)',
      'Bash / Shell Scripting & Cron Automation',
      'Git, GitHub Actions CI/CD & Docker',
    ],
  },
  {
    category: '02. Data Engineering & Orchestration',
    icon: Server,
    skills: [
      'Apache Spark / PySpark (Batch & Structured Streaming)',
      'Apache Airflow (DAG Orchestration, Retries, SLAs)',
      'dbt Core / Cloud (Incremental MERGE, SCD2, Tests)',
      'Apache Kafka & REST API Incremental Ingestion',
    ],
  },
  {
    category: '03. Cloud & Data Warehousing',
    icon: Database,
    skills: [
      'Snowflake, Google BigQuery & PostgreSQL',
      'AWS (S3 Parquet Lake, Glue, Redshift, Lambda)',
      'Medallion Architecture (Bronze / Silver / Gold)',
      'Kimball Dimensional Modeling (Star Schema, SCD2)',
    ],
  },
  {
    category: '04. Data Analytics & BI Delivery',
    icon: BarChart3,
    skills: [
      'Power BI & Tableau (DAX, Governed Semantic Models)',
      'M0–M12 Cohort Retention, Funnel & LTV Analytics',
      'Data Quality Auditing & Row-Count Reconciliation',
      'Partitioning, Clustering & Warehouse Cost Tuning',
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
      'Writing modular dbt and SQL transformations that clean raw staging data, deduplicate records, track historical changes via SCD Type 2, and expose clean Kimball Star Schema (Fact and Dimension) marts that downstream analysts and BI tools can query safely.',
    meta: 'dbt · SQL · Star Schema · SCD Type 2 · 40+ Schema Tests',
  },
  {
    step: '03',
    phase: 'Performance & Reliability Engineering',
    title: 'Query Tuning, Partitioning & Data Quality Gates',
    detail:
      'Inspecting query execution plans to refactor slow joins, configuring date partitioning and clustering keys on multi-million-row tables, tuning PySpark broadcast joins, and enforcing automated data quality checks (null bounds, primary-key uniqueness, row-count reconciliation) before tables refresh.',
    meta: 'Query Execution Plans · Partitioning · PySpark Skew Tuning',
  },
  {
    step: '04',
    phase: 'Analytics & Stakeholder Collaboration',
    title: 'Translating Business Questions into Governed Metrics & BI',
    detail:
      'Working directly with product, finance, and operations teams to turn ambiguous business questions into governed SQL semantic views, M0–M12 cohort/funnel analyses, and self-serve Power BI / Tableau dashboards—eliminating manual spreadsheet work.',
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

interface ProjectEvolutionMilestone {
  id: string;
  linkedProjectId: string;
  yearBadge: string;
  period: string;
  yearGroup: 'Year 1' | 'Year 2' | 'Year 3+';
  roleStage: string;
  projectTitle: string;
  architectureShift: string;
  summary: string;
  milestones: string[];
  technologies: string[];
  impactMetrics: { label: string; value: string }[];
  githubUrl: string;
}

const PROJECT_EVOLUTION_TIMELINE: ProjectEvolutionMilestone[] = [
  {
    id: 'timeline-y1',
    linkedProjectId: 'de-3yoe-4',
    yearBadge: 'YEAR 01 · FOUNDATION',
    period: '2023 – Early 2024',
    yearGroup: 'Year 1',
    roleStage: 'Data Analyst & SQL BI Developer',
    projectTitle: 'Customer Retention Cohort, Funnel & Revenue Attribution Analytics',
    architectureShift: 'Manual CSV/Excel Stitching → Modular SQL Window Models & Automated BI Marts',
    summary:
      'Started by solving executive reporting bottlenecks—replacing 6+ hours/week of error-prone spreadsheet work with reusable SQL window-function cohort models, Python statistical profiling, and interactive Power BI / Tableau dashboards.',
    milestones: [
      'Designed M0–M12 customer retention cohort matrices and repeat-purchase LTV attribution queries using SQL CTEs and window functions.',
      'Used Python (Pandas, NumPy) to run segment variance analysis across mobile/web onboarding steps, isolating a 38% conversion drop-off.',
      'Published governed Power BI & Tableau executive dashboards with automated weekly refresh schedules.',
    ],
    technologies: [
      'SQL (Window Functions, CTEs)',
      'Python (Pandas, NumPy)',
      'PostgreSQL',
      'Power BI',
      'Tableau',
      'Dimensional Marts',
    ],
    impactMetrics: [
      { label: 'Funnel Bottleneck Isolated', value: '38% Drop-Off' },
      { label: 'Manual Excel Work Eliminated', value: '6+ Hrs/Week' },
      { label: 'Cohort Coverage', value: 'M0–M12 Matrix' },
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/customer-cohort-retention-analytics',
  },
  {
    id: 'timeline-y2a',
    linkedProjectId: 'de-3yoe-3',
    yearBadge: 'YEAR 02 · WAREHOUSE OPTIMIZATION',
    period: 'Mid 2024',
    yearGroup: 'Year 2',
    roleStage: 'Analytics Engineer & SQL Performance Specialist',
    projectTitle: 'Enterprise SQL Warehouse Tuning & Unified KPI Semantic Layer',
    architectureShift: '500+ Line Ad-Hoc Queries → Partitioned Rollups & Governed dbt Semantic Views',
    summary:
      'Evolved from building individual dashboards to re-architecting the underlying cloud data warehouse—auditing query execution plans, introducing date partitioning and clustering keys, and unifying conflicting department KPIs.',
    milestones: [
      'Audited Snowflake/BigQuery query execution plans to eliminate redundant full-table scans, correlated subqueries, and unindexed string joins.',
      'Standardized Net Revenue, Rolling 30-Day Active Users, and SLA metrics into version-controlled dbt semantic views across Finance, Ops, and Product.',
      'Built pre-aggregated daily and monthly rollup tables with composite clustering keys for sub-4-second BI loads.',
    ],
    technologies: [
      'Advanced SQL',
      'Query Plan Optimization',
      'dbt',
      'Snowflake',
      'Google BigQuery',
      'Partitioning & Clustering',
      'Power BI',
    ],
    impactMetrics: [
      { label: 'BI Query Latency', value: '42s → 3.1s (-92%)' },
      { label: 'Full-Table Scan Volume', value: '-70% Compute' },
      { label: 'Metric Alignment', value: '3 Core Teams Unified' },
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/sql-warehouse-kpi-semantic-layer',
  },
  {
    id: 'timeline-y2b',
    linkedProjectId: 'de-3yoe-1',
    yearBadge: 'YEAR 02–03 · MEDALLION LAKEHOUSE',
    period: 'Late 2024 – 2025',
    yearGroup: 'Year 2',
    roleStage: 'Data Engineer — Orchestration & Warehouse Architecture',
    projectTitle: 'Production Medallion Lakehouse & Incremental ELT Pipeline',
    architectureShift: 'Fragile Overnight Full Dumps → Airflow DAGs + S3 Parquet + dbt Incremental MERGE',
    summary:
      'Took ownership of end-to-end pipeline engineering—replacing brittle full-table cron dumps with an orchestrated Bronze → Silver → Gold Medallion lakehouse across 35+ source tables (12M+ rows/day).',
    milestones: [
      'Engineered idempotent Python extraction tasks in Apache Airflow with high-watermark state tracking, retries, and Slack SLA alerts.',
      'Implemented dbt incremental MERGE models with 48-hour late-arriving lookback windows and SCD Type 2 snapshots for historical accuracy.',
      'Embedded 40+ automated dbt schema and reconciliation tests into GitHub Actions CI to block bad data before reaching Gold marts.',
    ],
    technologies: [
      'Apache Airflow',
      'dbt Core',
      'Python (Boto3)',
      'Snowflake / PostgreSQL',
      'AWS S3 (Parquet)',
      'SCD Type 2',
      'Docker',
      'GitHub Actions CI',
    ],
    impactMetrics: [
      { label: 'Daily Pipeline Runtime', value: '115m → 41m (-64%)' },
      { label: 'Warehouse Scan Cost', value: '-55% Cost' },
      { label: 'Data Quality Gates', value: '40+ Automated Tests' },
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/medallion-elt-lakehouse-pipeline',
  },
  {
    id: 'timeline-y3',
    linkedProjectId: 'de-3yoe-2',
    yearBadge: 'YEAR 03+ · DISTRIBUTED SCALE',
    period: '2025 – Present',
    yearGroup: 'Year 3+',
    roleStage: 'Data Engineer — Distributed Spark & Streaming Systems',
    projectTitle: 'Distributed Event Telemetry & PySpark Batch/Streaming Pipeline',
    architectureShift: 'Batch Relational Tables → Kafka Streams + PySpark Watermarks & Broadcast Tuning',
    summary:
      'Expanded into high-throughput distributed computing—architecting a fault-tolerant Kafka and PySpark Structured Streaming pipeline processing 15M+ daily JSON telemetry events with dead-letter quarantine and shuffle-skew optimization.',
    milestones: [
      'Built PySpark Structured Streaming consumers reading partitioned Kafka topics with strict StructType schema validation.',
      'Routed malformed JSON records to a dedicated S3 Dead-Letter path for 100% payload recovery without halting streaming jobs.',
      'Applied 15-minute event-time watermarks for late mobile telemetry and replaced sort-merge joins with broadcast joins.',
    ],
    technologies: [
      'Apache Spark / PySpark',
      'Apache Kafka',
      'Spark SQL',
      'Delta Lake / Parquet',
      'AWS S3',
      'Python',
      'Structured Streaming',
    ],
    impactMetrics: [
      { label: 'Daily Event Throughput', value: '15M+ Events/Day' },
      { label: 'Spark Job Speedup', value: '3.4x Faster' },
      { label: 'Pipeline Uptime & Audit', value: '99.9% SLA · 100% DLQ' },
    ],
    githubUrl: 'https://github.com/vishvajeetdhawale/pyspark-event-telemetry-pipeline',
  },
];

interface WorkSectionProps {
  onNavigate?: (tab: NavigationTab) => void;
  isStandaloneWindow?: boolean;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onNavigate }) => {
  // Strictly 2 full-page themes inspired by Modern Data Stack (MotherDuck / Dagster / dbt):
  // 'light' (Default Warm Technical Paper #F8F7F4) & 'carbon' (Obsidian DAG Terminal #0D0E12)
  const [workTheme, setWorkTheme] = useState<WorkThemeMode>(() => {
    try {
      const saved = localStorage.getItem('vd_work_theme_2mode_v1');
      if (saved === 'light' || saved === 'carbon') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const [activeBlueprintStageId, setActiveBlueprintStageId] = useState<string>('stage-silver');
  const [rightChartView, setRightChartView] = useState<'radar' | 'benchmarks'>('radar');

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
      const saved = localStorage.getItem('vd_work_projects_3yoe_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PROJECTS_3YOE;
  });

  const [skillCategoryFilter, setSkillCategoryFilter] = useState<
    'All' | 'Pipelines & Compute' | 'Warehousing & SQL' | 'Analytics & BI'
  >('All');

  const [domainFilter, setDomainFilter] = useState<
    'All' | 'Data Engineering' | 'Analytics Engineering' | 'Data Analytics'
  >('All');
  const [timelineYearFilter, setTimelineYearFilter] = useState<
    'All' | 'Year 1' | 'Year 2' | 'Year 3+'
  >('All');
  const [timelineSortOrder, setTimelineSortOrder] = useState<'chronological' | 'latest-first'>(
    'chronological'
  );
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
  const [projHowCreatedText, setProjHowCreatedText] = useState('');
  const [projFlowText, setProjFlowText] = useState(
    'Source Data -> Python / Airflow -> Bronze Raw -> dbt Silver/Gold -> BI Mart'
  );
  const [projContribsText, setProjContribsText] = useState('');
  const [projImpactText, setProjImpactText] = useState('');
  const [projStackText, setProjStackText] = useState('Python, SQL, Apache Airflow, dbt, Snowflake');
  const [projGithubUrl, setProjGithubUrl] = useState('');

  // Persist theme & sync full-window body background so there is zero bleed-through
  useEffect(() => {
    try {
      localStorage.setItem('vd_work_theme_2mode_v1', workTheme);
    } catch {
      // ignore
    }
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = workTheme === 'light' ? '#F8F7F4' : '#0D0E12';
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, [workTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('vd_work_github_url_v2', githubProfileUrl);
    } catch {
      // ignore
    }
  }, [githubProfileUrl]);

  useEffect(() => {
    try {
      localStorage.setItem('vd_work_projects_3yoe_v2', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  const filteredSkills = useMemo(
    () =>
      SKILL_PROFICIENCY_DATA.filter((s) =>
        skillCategoryFilter === 'All' ? true : s.category === skillCategoryFilter
      ),
    [skillCategoryFilter]
  );

  const filteredProjects = projects.filter((p) =>
    domainFilter === 'All' ? true : p.domain === domainFilter
  );

  const filteredTimeline = useMemo(() => {
    const base = PROJECT_EVOLUTION_TIMELINE.filter((item) =>
      timelineYearFilter === 'All' ? true : item.yearGroup === timelineYearFilter
    );
    return timelineSortOrder === 'latest-first' ? [...base].reverse() : base;
  }, [timelineYearFilter, timelineSortOrder]);

  const activeBlueprintStage =
    MEDALLION_BLUEPRINT_STAGES.find((s) => s.id === activeBlueprintStageId) ||
    MEDALLION_BLUEPRINT_STAGES[2];

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
      howCreatedSteps:
        projHowCreatedText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean).length > 0
          ? projHowCreatedText
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean)
          : [
              'Ingestion: Extracted source data via scheduled Python & Airflow jobs into raw storage.',
              'Transformation: Modeled deduplicated Silver and Star Schema Gold tables in dbt/SQL.',
              'Validation: Added automated schema tests and connected BI reporting views.',
            ],
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
    setProjHowCreatedText('');
    setProjContribsText('');
    setProjImpactText('');
  };

  const handleDeleteCustomProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const isLight = workTheme === 'light';

  // 2 Complete, Cohesive Whole-Page Themes inspired by Modern Data Stack (MotherDuck, Dagster, dbt):
  // 1. Light ("Modern Data Stack Paper" #F8F7F4 + Warehouse Teal #0F766E + dbt Terracotta #EA580C)
  // 2. Carbon ("DAG & Terminal Observatory" #0D0E12 + Warm Copper-Orange #F97316 + Emerald #10B981)
  const ui = isLight
    ? {
        pageBg: 'engineering-theme-light text-[#14151A]',
        navBg: 'bg-[#F8F7F4]/92 border-[#E2E0D8]',
        logoBadge: 'bg-[#0F766E] text-white border-[#0F766E]',
        card: 'bg-[#FFFFFF] border-[#E2E0D8] hover:border-[#0F766E]/55 engineering-card-transition shadow-xs',
        cardSubtle: 'bg-[#F3F1EC] border-[#E2E0D8]',
        cardActive: 'bg-[#FFFFFF] border-[#0F766E] ring-1 ring-[#0F766E]/30 shadow-sm',
        textPrimary: 'text-[#14151A]',
        textSecondary: 'text-[#3F424A]',
        textMuted: 'text-[#6E717A]',
        accent: 'text-[#0F766E]',
        accentWarm: 'text-[#EA580C]',
        accentSecondary: 'text-[#4F46E5]',
        accentEmerald: 'text-[#047857]',
        btnPrimary: 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-xs',
        btnSecondary:
          'bg-[#FFFFFF] hover:bg-[#F3F1EC] text-[#14151A] border border-[#D5D3CA]',
        hairline: 'border-[#E2E0D8]',
        codeBlock: 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A]',
        codeHeader: 'bg-[#F1F5F9] border-[#CBD5E1] text-[#475569]',
        selectOptionBg: 'bg-white text-[#14151A]',
        chartGrid: '#E2E0D8',
        chartAxis: '#52525B',
        chartLabel: '#14151A',
        chartTooltipBg: '#FFFFFF',
        chartTooltipBorder: '#D5D3CA',
        radarStroke: '#0F766E',
        radarFill: '#0F766E',
      }
    : {
        pageBg: 'engineering-theme-carbon text-[#F3F4F6]',
        navBg: 'bg-[#0D0E12]/92 border-[#232632]',
        logoBadge: 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/45',
        card: 'bg-[#14161D] border-[#232632] hover:border-[#F97316]/55 engineering-card-transition shadow-lg shadow-black/35',
        cardSubtle: 'bg-[#0F1117] border-[#232632]',
        cardActive: 'bg-[#181B24] border-[#F97316] ring-1 ring-[#F97316]/35 shadow-md',
        textPrimary: 'text-[#F9FAFB]',
        textSecondary: 'text-[#D1D5DB]',
        textMuted: 'text-[#9CA3AF]',
        accent: 'text-[#F97316]',
        accentWarm: 'text-[#FBBF24]',
        accentSecondary: 'text-[#38BDF8]',
        accentEmerald: 'text-[#10B981]',
        btnPrimary: 'bg-[#F97316] hover:bg-[#EA580C] text-[#0D0E12] font-semibold shadow-xs',
        btnSecondary:
          'bg-[#1B1E28] hover:bg-[#242836] text-[#F3F4F6] border border-[#2E3344]',
        hairline: 'border-[#232632]',
        codeBlock: 'bg-[#090A0E] border-[#232632] text-[#E5E7EB]',
        codeHeader: 'bg-[#11131A] border-[#232632] text-[#9CA3AF]',
        selectOptionBg: 'bg-[#14161D] text-[#F9FAFB]',
        chartGrid: '#232632',
        chartAxis: '#9CA3AF',
        chartLabel: '#F3F4F6',
        chartTooltipBg: '#14161D',
        chartTooltipBorder: '#2E3344',
        radarStroke: '#F97316',
        radarFill: '#F97316',
      };

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 font-sans ${ui.pageBg}`}>
      {/* =====================================================================
          STICKY STANDALONE ENGINEERING HEADER WITH 2-THEME SWITCHER (LIGHT / CARBON)
          ===================================================================== */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 transition-colors duration-200 ${ui.navBg}`}
      >
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer ${ui.btnSecondary}`}
                title="Return to Personal Site"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Personal Site</span>
              </button>
            )}

            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono text-xs font-bold ${ui.logoBadge}`}
            >
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
                <span className={`font-mono text-xs font-semibold ${ui.accent}`}>
                  Data Engineer &amp; Analyst
                </span>
              </div>
              <div className={`text-[11px] font-mono ${ui.textMuted}`}>
                3+ Years Production · Spark, Airflow, dbt, SQL Warehousing &amp; BI
              </div>
            </div>
          </div>

          {/* Section Jump Links & Strictly 2 Whole-Page Themes: Light vs Carbon */}
          <div className="flex items-center gap-3 sm:gap-5">
            <nav
              aria-label="Portfolio sections"
              className="hidden xl:flex items-center gap-5 text-xs font-medium"
            >
              <a
                href="#architecture-blueprint"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Architecture
              </a>
              <a
                href="#proficiency"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Proficiency
              </a>
              <a
                href="#evolution-timeline"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                3-Year Timeline
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
                Day-to-Day
              </a>
              <a
                href="#challenges"
                className={`${ui.textSecondary} hover:${ui.textPrimary} transition-colors`}
              >
                Challenges
              </a>
            </nav>

            <div className="flex items-center gap-2">
              {/* Strictly 2 Whole-Page Themes: Light (Default) & Carbon */}
              <div
                role="group"
                aria-label="Select Work theme"
                className={`inline-flex items-center p-0.5 rounded-lg border ${ui.cardSubtle}`}
              >
                <button
                  type="button"
                  onClick={() => setWorkTheme('light')}
                  className={`px-3 py-1 rounded-md text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    workTheme === 'light'
                      ? ui.btnPrimary
                      : `${ui.textSecondary} hover:${ui.textPrimary}`
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkTheme('carbon')}
                  className={`px-3 py-1 rounded-md text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    workTheme === 'carbon'
                      ? ui.btnPrimary
                      : `${ui.textSecondary} hover:${ui.textPrimary}`
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Carbon</span>
                </button>
              </div>

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
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN PORTFOLIO CONTAINER
          ===================================================================== */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16">
        {/* -------------------------------------------------------------------
            HERO: ROLE SUMMARY, PRODUCTION METRICS & 3+ YOE PROFILE
            ------------------------------------------------------------------- */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className={`font-semibold ${ui.accent}`}>
                  DATA ENGINEER &amp; ANALYTICS ENGINEER
                </span>
                <span className={ui.textMuted} aria-hidden="true">
                  ·
                </span>
                <span className={ui.textSecondary}>3+ Years Production Experience</span>
                <span className={ui.textMuted} aria-hidden="true">
                  ·
                </span>
                <span className={ui.accentWarm}>Medallion Lakehouse &amp; BI Architecture</span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight leading-[1.12] text-balance ${ui.textPrimary}`}
              >
                Architecting fault-tolerant ELT pipelines, governed dbt/SQL warehouses, and high-trust analytics.
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed max-w-[68ch] ${ui.textSecondary}`}>
                I am <strong className={ui.textPrimary}>Vishvajeet V Dhawale</strong>. Over 3+ years in production data engineering and analytics, I have built and maintained incremental pipelines with <strong className={ui.textPrimary}>Apache Airflow, Python, and PySpark</strong>, structured <strong className={ui.textPrimary}>Bronze–Silver–Gold Medallion warehouses in dbt and SQL</strong>, and delivered governed KPI layers and cohort analytics in <strong className={ui.textPrimary}>Power BI &amp; Tableau</strong>.
              </p>

              {/* Primary Action Bar */}
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

                <a
                  href="#architecture-blueprint"
                  className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors ${ui.btnSecondary}`}
                >
                  <Workflow className="w-4 h-4" />
                  <span>Inspect Pipeline Blueprint</span>
                </a>

                <button
                  type="button"
                  onClick={() => setEditingGithub(!editingGithub)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer ${ui.btnSecondary}`}
                >
                  <span>Update GitHub URL</span>
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

            {/* Right 4 Cols: 3-Year Experience Engineering Specification Card */}
            <aside className={`lg:col-span-4 rounded-xl border p-5 space-y-4 ${ui.card}`}>
              <div className={`flex items-center justify-between border-b pb-3 ${ui.hairline}`}>
                <span className={`text-xs font-mono font-semibold ${ui.textPrimary}`}>
                  ENGINEERING SPECIFICATION
                </span>
                <Briefcase className={`w-4 h-4 ${ui.accent}`} />
              </div>

              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className={ui.textMuted}>Engineer</dt>
                  <dd className={`font-semibold text-right ${ui.textPrimary}`}>
                    Vishvajeet V Dhawale
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className={ui.textMuted}>Role</dt>
                  <dd className={`font-semibold text-right ${ui.accent}`}>
                    Data Engineer &amp; Analyst
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className={ui.textMuted}>Production Tenure</dt>
                  <dd className={`font-mono font-semibold text-right ${ui.textPrimary}`}>
                    3+ Years Experience
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className={ui.textMuted}>Core Orchestration</dt>
                  <dd className={`font-mono text-right ${ui.textPrimary}`}>
                    Airflow · dbt · PySpark
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className={ui.textMuted}>Warehouses</dt>
                  <dd className={`font-mono text-right ${ui.textPrimary}`}>
                    Snowflake · BigQuery · Postgres
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className={ui.textMuted}>Architecture Pattern</dt>
                  <dd className={`font-mono text-right ${ui.accentEmerald}`}>
                    Medallion + Kimball Star
                  </dd>
                </div>
              </dl>
            </aside>
          </div>

          {/* 4-Column Quantified Production Benchmarks Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                label: 'DAILY VOLUME PROCESSED',
                value: '15M+ Events/Day',
                sub: 'Kafka + PySpark + Airflow ELT',
              },
              {
                label: 'PIPELINE SLA & QUALITY',
                value: '40+ dbt Tests',
                sub: 'Uniqueness, SCD2 & Freshness Gates',
              },
              {
                label: 'QUERY LATENCY TUNING',
                value: '42s → 3.1s',
                sub: 'Partitioning & Clustered Rollups',
              },
              {
                label: 'DAILY ELT RUNTIME CUT',
                value: '-64% Runtime',
                sub: 'Incremental MERGE vs Full Dump',
              },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border p-4 space-y-1 ${ui.card}`}>
                <div className={`text-[10px] font-mono uppercase tracking-wider ${ui.textMuted}`}>
                  {stat.label}
                </div>
                <div className={`text-xl sm:text-2xl font-bold font-mono ${ui.accent}`}>
                  {stat.value}
                </div>
                <div className={`text-xs ${ui.textSecondary}`}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            01. INTERACTIVE MEDALLION ARCHITECTURE & LINEAGE BLUEPRINT ("HOW IT'S CREATED")
            ------------------------------------------------------------------- */}
        <section id="architecture-blueprint" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                01. SYSTEM ARCHITECTURE &amp; DATA LINEAGE BLUEPRINT
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                How My Production Data Pipelines Are Created
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-md ${ui.textSecondary}`}>
              Select any stage in the pipeline below to inspect how raw operational data is ingested, deduplicated, modeled into Star Schemas, and served to BI.
            </p>
          </div>

          {/* Interactive 5-Stage Pipeline Lineage Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MEDALLION_BLUEPRINT_STAGES.map((stage, idx) => {
              const isSelected = stage.id === activeBlueprintStage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveBlueprintStageId(stage.id)}
                  className={`text-left rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected ? ui.cardActive : ui.card
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className={isSelected ? `font-bold ${ui.accent}` : ui.textMuted}>
                        0{idx + 1} · {stage.id.replace('stage-', '').toUpperCase()}
                      </span>
                      {idx < MEDALLION_BLUEPRINT_STAGES.length - 1 && (
                        <span className={`hidden lg:inline font-mono ${ui.accent}`}>→</span>
                      )}
                    </div>
                    <div className={`font-bold text-sm leading-snug ${ui.textPrimary}`}>
                      {stage.layerName}
                    </div>
                  </div>
                  <div className={`text-[11px] font-mono truncate ${ui.textMuted}`}>
                    {stage.storageFormat}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Inspector */}
          <div className={`rounded-xl border p-5 sm:p-7 space-y-6 ${ui.card}`}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 border-inherit">
              <div className="space-y-1">
                <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                  {activeBlueprintStage.stageCode}
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${ui.textPrimary}`}>
                  {activeBlueprintStage.layerName}
                </h3>
                <p className={`text-xs font-mono ${ui.textSecondary}`}>
                  {activeBlueprintStage.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className={`px-3 py-1.5 rounded-lg border ${ui.cardSubtle} ${ui.textPrimary}`}>
                  SLA: {activeBlueprintStage.slaTarget}
                </span>
                <span className={`px-3 py-1.5 rounded-lg border ${ui.cardSubtle} ${ui.accentEmerald}`}>
                  Format: {activeBlueprintStage.storageFormat}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 6 Cols: How Created + Engineering Rules */}
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1.5">
                  <h4 className={`text-xs font-mono uppercase tracking-wider font-semibold ${ui.textMuted}`}>
                    How This Layer Is Engineered
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                    {activeBlueprintStage.howCreated}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className={`text-xs font-mono uppercase tracking-wider font-semibold ${ui.textMuted}`}>
                    Production Design Guarantees
                  </h4>
                  <ul className={`space-y-2 text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                    {activeBlueprintStage.engineeringRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`font-mono font-bold mt-0.5 ${ui.accent}`}>
                          0{i + 1}.
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`pt-2 flex flex-wrap items-center gap-2 text-xs font-mono ${ui.textMuted}`}>
                  <span>Tools:</span>
                  {activeBlueprintStage.tools.map((t) => (
                    <span
                      key={t}
                      className={`px-2.5 py-1 rounded border ${ui.cardSubtle} ${ui.textPrimary}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right 6 Cols: Stage Implementation Code */}
              <div className="lg:col-span-6">
                <div className={`rounded-lg border overflow-hidden ${ui.codeBlock}`}>
                  <div
                    className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono ${ui.codeHeader}`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>{activeBlueprintStage.codeTitle}</span>
                    </span>
                    <span>Layer Spec</span>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                    <code>{activeBlueprintStage.codeSample}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            02. RECHARTS SKILL PROFICIENCY & OPTIMIZATION BENCHMARK SUITE
            ------------------------------------------------------------------- */}
        <section id="proficiency" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                02. SKILL PROFICIENCY &amp; ARCHITECTURE DEPTH
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                Production Experience Across Tools &amp; Platforms
              </h2>
            </div>

            {/* Category Filter for the Recharts BarChart */}
            <div
              role="group"
              aria-label="Filter skill proficiency chart"
              className={`inline-flex flex-wrap items-center p-1 rounded-lg border ${ui.cardSubtle}`}
            >
              {(
                [
                  'All',
                  'Pipelines & Compute',
                  'Warehousing & SQL',
                  'Analytics & BI',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSkillCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    skillCategoryFilter === cat
                      ? ui.btnPrimary
                      : `${ui.textSecondary} hover:${ui.textPrimary}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: Recharts Horizontal BarChart of Core Tools */}
            <div className={`lg:col-span-7 rounded-xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 ${ui.card}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className={`text-base sm:text-lg font-bold ${ui.textPrimary}`}>
                    Tool &amp; Platform Proficiency (3+ Years Production)
                  </h3>
                  <p className={`text-xs ${ui.textSecondary}`}>
                    Hover or tap any bar to inspect production use cases and years of daily experience.
                  </p>
                </div>
                <span className={`text-xs font-mono font-semibold ${ui.accent}`}>
                  Scale: 0 – 100%
                </span>
              </div>

              <div className="w-full h-[320px] sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredSkills}
                    layout="vertical"
                    margin={{ top: 6, right: 28, left: 12, bottom: 6 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={ui.chartGrid}
                      horizontal={true}
                      vertical={true}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: ui.chartAxis, fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
                      tickFormatter={(val) => `${val}%`}
                      stroke={ui.chartGrid}
                    />
                    <YAxis
                      type="category"
                      dataKey="shortName"
                      width={132}
                      tick={{ fill: ui.chartLabel, fontSize: 11.5, fontWeight: 500 }}
                      stroke={ui.chartGrid}
                    />
                    <Tooltip
                      cursor={{
                        fill: isLight
                          ? 'rgba(15, 118, 110, 0.07)'
                          : 'rgba(249, 115, 22, 0.08)',
                      }}
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const item = payload[0].payload as SkillProficiencyItem;
                        return (
                          <div
                            style={{
                              backgroundColor: ui.chartTooltipBg,
                              borderColor: ui.chartTooltipBorder,
                            }}
                            className="rounded-xl border p-3.5 shadow-xl max-w-xs space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className={`font-bold ${ui.textPrimary}`}>{item.name}</span>
                              <span className={`font-mono font-bold ${ui.accent}`}>
                                {item.proficiency}%
                              </span>
                            </div>
                            <div className={`text-[11px] font-mono ${ui.accentEmerald}`}>
                              {item.yearsUsed} · {item.category}
                            </div>
                            <p className={`text-[11px] leading-relaxed ${ui.textSecondary}`}>
                              {item.productionScope}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="proficiency" radius={[0, 6, 6, 0]} barSize={20}>
                      {filteredSkills.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={isLight ? entry.lightColor : entry.carbonColor}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Compact Legend / Production Context Footer */}
              <div
                className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono ${ui.hairline} ${ui.textMuted}`}
              >
                <span>Primary Daily Stack: SQL · Python · Apache Spark · Airflow · dbt</span>
                <span>3+ Yrs Production</span>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Toggle between 6-Axis Radar & Optimization Benchmarks */}
            <div className={`lg:col-span-5 rounded-xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 ${ui.card}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`text-base sm:text-lg font-bold ${ui.textPrimary}`}>
                    {rightChartView === 'radar'
                      ? 'Engineering & Analytics Balance'
                      : 'Optimization Impact (% Gain)'}
                  </h3>
                  <p className={`text-xs ${ui.textSecondary}`}>
                    {rightChartView === 'radar'
                      ? 'Coverage across orchestration, warehouse modeling & BI.'
                      : 'Measured production gains from partitioning & incremental ELT.'}
                  </p>
                </div>

                <div className={`inline-flex p-0.5 rounded-lg border text-xs font-mono ${ui.cardSubtle}`}>
                  <button
                    type="button"
                    onClick={() => setRightChartView('radar')}
                    className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                      rightChartView === 'radar' ? ui.btnPrimary : ui.textSecondary
                    }`}
                  >
                    Radar
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightChartView('benchmarks')}
                    className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                      rightChartView === 'benchmarks' ? ui.btnPrimary : ui.textSecondary
                    }`}
                  >
                    Impact
                  </button>
                </div>
              </div>

              <div className="w-full h-[270px] sm:h-[290px]">
                {rightChartView === 'radar' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="72%" data={RADAR_COMPETENCY_DATA}>
                      <PolarGrid stroke={ui.chartGrid} />
                      <PolarAngleAxis
                        dataKey="axis"
                        tick={{
                          fill: ui.chartLabel,
                          fontSize: 11,
                          fontFamily: 'IBM Plex Mono, monospace',
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Proficiency"
                        dataKey="score"
                        stroke={ui.radarStroke}
                        strokeWidth={2}
                        fill={ui.radarFill}
                        fillOpacity={0.24}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const data = payload[0].payload as { axis: string; score: number };
                          return (
                            <div
                              style={{
                                backgroundColor: ui.chartTooltipBg,
                                borderColor: ui.chartTooltipBorder,
                              }}
                              className="rounded-lg border px-3 py-2 shadow-lg text-xs font-mono"
                            >
                              <span className={ui.textPrimary}>{data.axis}: </span>
                              <span className={`font-bold ${ui.accent}`}>{data.score}%</span>
                            </div>
                          );
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={OPTIMIZATION_BENCHMARK_DATA}
                      layout="vertical"
                      margin={{ top: 8, right: 24, left: 10, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={ui.chartGrid} />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: ui.chartAxis, fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
                        tickFormatter={(v) => `${v}%`}
                        stroke={ui.chartGrid}
                      />
                      <YAxis
                        type="category"
                        dataKey="metric"
                        width={126}
                        tick={{ fill: ui.chartLabel, fontSize: 11, fontWeight: 500 }}
                        stroke={ui.chartGrid}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const d = payload[0].payload as (typeof OPTIMIZATION_BENCHMARK_DATA)[0];
                          return (
                            <div
                              style={{
                                backgroundColor: ui.chartTooltipBg,
                                borderColor: ui.chartTooltipBorder,
                              }}
                              className="rounded-xl border p-3 shadow-xl text-xs space-y-1"
                            >
                              <div className={`font-bold ${ui.textPrimary}`}>{d.metric}</div>
                              <div className={`font-mono ${ui.textMuted}`}>Before: {d.beforeLabel}</div>
                              <div className={`font-mono font-semibold ${ui.accentEmerald}`}>
                                After: {d.afterLabel} (-{d.improvementPct}%)
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Bar
                        dataKey="improvementPct"
                        radius={[0, 6, 6, 0]}
                        barSize={20}
                        fill={ui.radarStroke}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className={`grid grid-cols-2 gap-2 pt-3 border-t text-xs font-mono ${ui.hairline}`}>
                <div className={`p-2.5 rounded-lg border ${ui.cardSubtle}`}>
                  <div className={`text-[10px] ${ui.textMuted}`}>WAREHOUSE DESIGN</div>
                  <div className={`font-bold ${ui.textPrimary}`}>Star Schema · SCD2</div>
                </div>
                <div className={`p-2.5 rounded-lg border ${ui.cardSubtle}`}>
                  <div className={`text-[10px] ${ui.textMuted}`}>ORCHESTRATION</div>
                  <div className={`font-bold ${ui.textPrimary}`}>Airflow · dbt · Spark</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------
            03. VERTICAL TIMELINE: 3-YEAR DATA ENGINEERING EVOLUTION (2023 → 2026)
            ------------------------------------------------------------------- */}
        <section id="evolution-timeline" className={`pt-12 border-t space-y-8 ${ui.hairline}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                03. 3-YEAR PROJECT &amp; ARCHITECTURE EVOLUTION TIMELINE
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                Evolution of Data Engineering Projects (Year 1 → Year 3+)
              </h2>
              <p className={`text-xs sm:text-sm max-w-2xl ${ui.textSecondary}`}>
                Tracing my progression over the last three years—from analytical SQL cohort modeling and BI automation to cloud warehouse tuning, orchestrated Airflow + dbt Medallion pipelines, and distributed PySpark event streaming.
              </p>
            </div>

            {/* Interactive Controls: Filter by Year Phase + Toggle Chronological Order */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Filter timeline by year"
                className={`inline-flex flex-wrap items-center p-1 rounded-lg border ${ui.cardSubtle}`}
              >
                {(['All', 'Year 1', 'Year 2', 'Year 3+'] as const).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTimelineYearFilter(yr)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                      timelineYearFilter === yr
                        ? ui.btnPrimary
                        : `${ui.textSecondary} hover:${ui.textPrimary}`
                    }`}
                  >
                    {yr === 'All' ? 'All 3 Years' : yr}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setTimelineSortOrder((prev) =>
                    prev === 'chronological' ? 'latest-first' : 'chronological'
                  )
                }
                className={`px-3 py-2 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 transition-colors cursor-pointer ${ui.btnSecondary}`}
                title="Toggle chronological order"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {timelineSortOrder === 'chronological' ? '2023 → Present' : 'Latest First'}
                </span>
              </button>
            </div>
          </div>

          {/* Vertical Spine Timeline Container */}
          <div className="relative pl-6 sm:pl-10 space-y-8">
            {/* Continuous Vertical Structural Spine */}
            <div
              aria-hidden="true"
              className={`absolute left-2.5 sm:left-4 top-2 bottom-2 w-0.5 ${
                isLight ? 'bg-[#D5D3CA]' : 'bg-[#262A38]'
              }`}
            />

            {filteredTimeline.map((item, idx) => (
              <div key={item.id} className="relative group">
                {/* Timeline Spine Node Marker */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-[22px] sm:-left-[30px] top-6 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isLight
                      ? 'bg-[#F8F7F4] border-[#0F766E]'
                      : 'bg-[#0D0E12] border-[#F97316]'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-[#0F766E]' : 'bg-[#F97316]'
                    }`}
                  />
                </div>

                {/* Timeline Card */}
                <div className={`rounded-xl border p-5 sm:p-7 space-y-5 ${ui.card}`}>
                  {/* Top Header: Year Badge, Period, Role Progression & Links */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 border-inherit">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span
                          className={`px-2.5 py-0.5 rounded font-bold ${
                            isLight
                              ? 'bg-[#0F766E]/10 text-[#0F766E]'
                              : 'bg-[#F97316]/15 text-[#F97316]'
                          }`}
                        >
                          {item.yearBadge}
                        </span>
                        <span className={ui.textMuted} aria-hidden="true">
                          ·
                        </span>
                        <span className={`font-semibold ${ui.textPrimary}`}>{item.period}</span>
                        <span className={ui.textMuted} aria-hidden="true">
                          ·
                        </span>
                        <span className={ui.accentWarm}>{item.roleStage}</span>
                      </div>

                      <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${ui.textPrimary}`}>
                        {item.projectTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="#projects"
                        onClick={() => {
                          setDomainFilter('All');
                          setExpandedCodeId(item.linkedProjectId);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 transition-colors ${ui.btnSecondary}`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Inspect Code &amp; Case Study</span>
                      </a>

                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono inline-flex items-center gap-1.5 transition-colors ${ui.btnSecondary}`}
                        title="Open GitHub Repository"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">GitHub</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Architectural Shift Banner */}
                  <div
                    className={`px-4 py-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${ui.cardSubtle}`}
                  >
                    <span className={ui.textMuted}>ARCHITECTURE EVOLUTION:</span>
                    <span className={`font-semibold ${ui.textPrimary}`}>
                      {item.architectureShift}
                    </span>
                  </div>

                  <p className={`text-sm sm:text-base leading-relaxed ${ui.textSecondary}`}>
                    {item.summary}
                  </p>

                  {/* Two-Column Grid: Key Engineering Milestones vs Quantified Impact & Tech Stack */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left 7 Cols: Key Milestones */}
                    <div className="lg:col-span-7 space-y-2.5">
                      <h4
                        className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}
                      >
                        Key Engineering Milestones
                      </h4>
                      <ul className={`space-y-2 text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                        {item.milestones.map((milestone, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-2.5">
                            <span className={`font-mono font-bold mt-0.5 ${ui.accent}`}>
                              0{mIdx + 1}.
                            </span>
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right 5 Cols: Quantified Impact Metrics & Technologies Used */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="space-y-2">
                        <h4
                          className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}
                        >
                          Production Impact
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                          {item.impactMetrics.map((metric) => (
                            <div
                              key={metric.label}
                              className={`px-3.5 py-2 rounded-lg border flex items-center justify-between gap-2 text-xs font-mono ${ui.cardSubtle}`}
                            >
                              <span className={ui.textSecondary}>{metric.label}</span>
                              <span className={`font-bold ${ui.accentEmerald}`}>
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4
                          className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}
                        >
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className={`px-2.5 py-1 rounded border text-xs font-mono ${ui.cardSubtle} ${ui.textPrimary}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            04. TECHNICAL STACK & ECOSYSTEM (3+ YEARS PRODUCTION FOCUS)
            ------------------------------------------------------------------- */}
        <section id="stack" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="space-y-1">
            <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
              04. TECHNICAL STACK
            </div>
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
                        <span className={`font-mono font-bold ${ui.accent}`}>·</span>
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
            05. PRODUCTION PROJECTS (3 YEARS EXPERIENCE SCOPE + HOW CREATED)
            ------------------------------------------------------------------- */}
        <section id="projects" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                05. PRODUCTION ARCHITECTURE &amp; ANALYTICS CASE STUDIES
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${ui.textPrimary}`}>
                Selected Data Engineering &amp; Analytics Work (3+ YOE)
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
                        <span className={`font-semibold ${ui.accentWarm}`}>{project.domain}</span>
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
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 border border-red-500/30 transition-colors cursor-pointer"
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
                      End-to-End Pipeline &amp; Lineage Flow
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {project.architectureFlow.map((node, i) => (
                        <React.Fragment key={node + i}>
                          <span className={`px-2.5 py-1 rounded border ${ui.card} ${ui.textPrimary}`}>
                            {node}
                          </span>
                          {i < project.architectureFlow.length - 1 && (
                            <span className={`font-bold ${ui.accent}`} aria-hidden="true">
                              →
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Problem vs How It Was Created & Engineered */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-3">
                      <div className="space-y-1.5">
                        <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}>
                          Problem &amp; Production Bottleneck
                        </h4>
                        <p className={`text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                          {project.problemStatement}
                        </p>
                      </div>

                      {project.howCreatedSteps && project.howCreatedSteps.length > 0 && (
                        <div className={`p-3.5 rounded-lg border space-y-2 ${ui.cardSubtle}`}>
                          <div className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${ui.accent}`}>
                            How It Was Created (Architecture Steps)
                          </div>
                          <ul className={`space-y-1.5 text-xs leading-relaxed ${ui.textSecondary}`}>
                            {project.howCreatedSteps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2">
                                <span className={`font-mono font-bold ${ui.accent}`}>
                                  {sIdx + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-7 space-y-2">
                      <h4 className={`text-xs font-mono font-semibold uppercase tracking-wider ${ui.textMuted}`}>
                        Key Engineering Contributions &amp; Quality Gates
                      </h4>
                      <ul className={`space-y-2.5 text-xs sm:text-sm leading-relaxed ${ui.textSecondary}`}>
                        {project.engineeringContributions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={`font-mono font-semibold mt-0.5 ${ui.accent}`}>
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
                      <div
                        className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono ${ui.codeHeader}`}
                      >
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
            06. WHAT I DO IN DAY-TO-DAY WORK
            ------------------------------------------------------------------- */}
        <section id="day-to-day" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                06. DAY-TO-DAY ENGINEERING WORKFLOW
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
            07. WHAT IS MOST CHALLENGING IN MY ROLE
            ------------------------------------------------------------------- */}
        <section id="challenges" className={`pt-12 border-t space-y-6 ${ui.hairline}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className={`text-xs font-mono font-semibold ${ui.accent}`}>
                07. PRODUCTION CHALLENGES &amp; SOLUTIONS
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
                    <strong className={`block text-xs font-mono mb-1 ${ui.accentEmerald}`}>
                      HOW I SOLVE IT IN PRODUCTION:
                    </strong>
                    <span className={ui.textPrimary}>{item.solution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------
            FOOTER
            ------------------------------------------------------------------- */}
        <footer
          className={`pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono ${ui.hairline} ${ui.textMuted}`}
        >
          <div>
            Vishvajeet V Dhawale · Data Engineer &amp; Data Analyst (3+ YOE)
          </div>
          <div className="flex items-center gap-4">
            <a
              href={githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:${ui.textPrimary} inline-flex items-center gap-1 transition-colors`}
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:vishudhawle11111@gmail.com"
              className={`hover:${ui.textPrimary} transition-colors`}
            >
              vishudhawle11111@gmail.com
            </a>
          </div>
        </footer>
      </main>

      {/* =====================================================================
          MODAL: ADD NEW DATA ENGINEERING / ANALYTICS PROJECT
          ===================================================================== */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-work-project-title"
        >
          <div className={`w-full max-w-xl rounded-xl border p-6 space-y-5 my-8 ${ui.card}`}>
            <div className={`flex items-center justify-between border-b pb-3 ${ui.hairline}`}>
              <div>
                <span className={`text-xs font-mono font-semibold ${ui.accent}`}>
                  ADD PORTFOLIO PROJECT
                </span>
                <h3 id="add-work-project-title" className={`text-lg font-bold ${ui.textPrimary}`}>
                  New Data Engineering / Analytics Project
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${ui.btnSecondary}`}
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g., Incremental Sales ELT Pipeline with Airflow & dbt"
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>Category *</label>
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
                    <option value="Data Engineering" className={ui.selectOptionBg}>
                      Data Engineering
                    </option>
                    <option value="Analytics Engineering" className={ui.selectOptionBg}>
                      Analytics Engineering
                    </option>
                    <option value="Data Analytics" className={ui.selectOptionBg}>
                      Data Analytics
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>
                    Scope / Scale Tag
                  </label>
                  <input
                    type="text"
                    value={projScaleTag}
                    onChange={(e) => setProjScaleTag(e.target.value)}
                    placeholder="e.g., 10M+ Rows · Airflow + dbt"
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent font-mono ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`block font-mono ${ui.textSecondary}`}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={projGithubUrl}
                    onChange={(e) => setProjGithubUrl(e.target.value)}
                    placeholder={githubProfileUrl}
                    className={`w-full px-3 py-2 rounded-lg border bg-transparent font-mono ${ui.hairline} ${ui.textPrimary}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`block font-mono ${ui.textSecondary}`}>Project Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={projSummary}
                  onChange={(e) => setProjSummary(e.target.value)}
                  placeholder="Concise overview of what you built and the business goal..."
                  className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block font-mono ${ui.textSecondary}`}>
                  How It Was Created (One architecture step per line)
                </label>
                <textarea
                  rows={2}
                  value={projHowCreatedText}
                  onChange={(e) => setProjHowCreatedText(e.target.value)}
                  placeholder={`Ingestion: Pulled incremental records via Airflow Python tasks\nTransformation: Modeled Silver/Gold tables in dbt`}
                  className={`w-full px-3 py-2 rounded-lg border bg-transparent ${ui.hairline} ${ui.textPrimary}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`block font-mono ${ui.textSecondary}`}>
                  Pipeline Flow (separate steps with -&gt;)
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
                  Engineering Contributions (one point per line)
                </label>
                <textarea
                  rows={3}
                  value={projContribsText}
                  onChange={(e) => setProjContribsText(e.target.value)}
                  placeholder={`Built incremental dbt models\nConfigured Airflow DAG alerts`}
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
                    placeholder="50% faster runtime, Zero duplicate rows"
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

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono cursor-pointer ${ui.btnSecondary}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${ui.btnPrimary}`}
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
