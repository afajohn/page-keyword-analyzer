/**
 * Enhanced SEO Analysis Types
 * Comprehensive type definitions for the sophisticated SEO analysis system
 */

export interface KeywordAnalysis {
  term: string;
  extracted_from: string[];
  confidence_score?: number;
  context_sentences?: string[];
}

export interface PrimaryKeywordAnalysis {
  confidence_score: number;
  keywords: KeywordAnalysis[];
  reasoning_summary: string;
}

export interface SecondaryKeywordAnalysis {
  confidence_score: number;
  keywords: KeywordAnalysis[];
  reasoning_summary: string;
}

export interface InferredKeywordsAnalysis {
  primary: PrimaryKeywordAnalysis;
  secondary: SecondaryKeywordAnalysis;
}

export interface HeadingWithKeywords {
  tag: string;
  text: string;
  keywords: string[];
  position?: number;
}

export interface ImageAltText {
  text: string;
  keywords: string[];
  src?: string;
}

export interface UrlAnalysis {
  slug: string;
  keywords: string[];
  path_segments: string[];
}

export interface MetaDataAnalysis {
  description_keywords: string[];
  image_alt_texts: ImageAltText[];
  canonical_url?: string;
  robots_meta?: string;
  meta_keywords?: string[];
}

export interface StructuredOnPageData {
  headings_and_keywords: HeadingWithKeywords[];
  url_analysis: UrlAnalysis;
  meta_data_analysis: MetaDataAnalysis;
  content_length: number;
  word_count: number;
}

export interface EntityExtraction {
  people: string[];
  organizations: string[];
  locations: string[];
  products: string[];
  technologies: string[];
}

export interface SemanticRelationship {
  term: string;
  related_to_primary_keyword: boolean;
  relationship_type: 'synonym' | 'related_topic' | 'attribute' | 'competitor' | 'brand';
  context_sentences: string[];
  co_occurrence_score: number;
}

export interface FrequentTerm {
  keyword: string;
  count: number;
  normalized_frequency: number;
  tf_idf_score?: number;
}

export interface CoreTopicAnalysis {
  main_topic: {
    topic: string;
    confidence_score: number;
    reasoning: string;
  };
  inferred_entities: {
    people: string[];
    organizations: string[];
    locations: string[];
    products: string[];
    technologies: string[];
  };
  co_occurring_terms: string[];
}

export interface ContentSemanticAnalysis {
  core_topic_analysis: CoreTopicAnalysis;
  entity_extraction: EntityExtraction;
  semantic_relationships: SemanticRelationship[];
  top_frequent_terms: FrequentTerm[];
  readability_score?: number;
  content_topics: string[];
  // Advanced analysis features
  eeat_score?: EEATScore;
  query_fan_out?: QueryFanOutAnalysis;
  content_quality_score?: number;
  topical_authority_score?: number;
  user_intent_signals?: UserIntentSignals;
}

export interface AIInsights {
  topical_authority_score: {
    score: number;
    reasoning: string;
  };
  keyword_gap_analysis: {
    missing_primary_keywords: string[];
    missing_long_tail_keywords: string[];
  };
  optimization_potential: {
    aeo: { score: number; reasoning: string };
    geo: { score: number; reasoning: string };
  };
  content_strategy_recommendation: {
    summary: string;
    suggestions: string[];
  };
}

export interface GeminiAnalysis {
  reasoning_primary_keywords: string;
  reasoning_secondary_keywords: string;
  seo_recommendations_latest_algorithms: string;
  eeat_assessment: string;
  user_intent_alignment: string;
  ai_overview_optimization: string;
  confidence_assessment: string;
  best_keyword?: string;
  best_long_tail_keyword?: string;
  processing_time_ms?: number;
  timestamp?: string;
}

export interface EEATScore {
  expertise: number;
  experience: number;
  authoritativeness: number;
  trustworthiness: number;
  overall: number;
}

export interface QueryFanOutAnalysis {
  primary_topics: string[];
  related_queries: string[];
  content_gaps: string[];
  expansion_opportunities: string[];
  semantic_clusters: Array<{
    topic: string;
    related_keywords: string[];
    strength: number;
  }>;
}

export interface UserIntentSignals {
  informational: number;
  navigational: number;
  transactional: number;
  commercial: number;
}

export interface AdvancedSemanticAnalysis extends ContentSemanticAnalysis {
  eeat_score?: EEATScore;
  query_fan_out?: QueryFanOutAnalysis;
  content_quality_score?: number;
  topical_authority_score?: number;
  user_intent_signals?: UserIntentSignals;
}

export interface PageMetadata {
  url: string;
  title_tag: string;
  meta_description: string;
  favicon_url?: string;
  language?: string;
  charset?: string;
}

export interface SEOAnalysisResult {
  page_metadata: PageMetadata;
  structured_on_page_data: StructuredOnPageData;
  semantic_analysis: ContentSemanticAnalysis;
  inferred_keywords: InferredKeywordsAnalysis;
  ai_insights: AIInsights | null;
  gemini_analysis: GeminiAnalysis;
  analysis_timestamp: string;
  processing_time_ms: number;
}

export interface AnalysisError {
  type: 'URL_INVALID' | 'FETCH_ERROR' | 'PARSE_ERROR' | 'GEMINI_ERROR' | 'RATE_LIMIT';
  message: string;
  details?: string;
  timestamp: string;
}

export interface AnalysisRequest {
  url: string;
  include_ai_analysis?: boolean;
  analysis_depth?: 'basic' | 'standard' | 'comprehensive';
}

export interface AnalysisResponse {
  success: boolean;
  data?: SEOAnalysisResult;
  error?: AnalysisError;
}
