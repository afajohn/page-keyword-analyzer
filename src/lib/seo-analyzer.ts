/**
 * Main SEO Analysis Service
 * Orchestrates the complete SEO analysis pipeline with AI reasoning
 */

import { HTMLParser } from './html-parser';
import { AdvancedSemanticAnalyzer } from './advanced-semantic-analyzer';
import { KeywordInferenceEngine } from './keyword-inference';
import { GeminiClient } from './gemini-client';
import { 
  SEOAnalysisResult, 
  AnalysisRequest, 
  AnalysisResponse, 
  AnalysisError
} from '@/types/seo-analysis';

export class SEOAnalyzer {
  private geminiClient: GeminiClient | null = null;

  constructor(geminiApiKey?: string) {
    if (geminiApiKey && GeminiClient.validateApiKey(geminiApiKey)) {
      this.geminiClient = new GeminiClient(geminiApiKey);
    }
  }

  /**
   * Perform comprehensive SEO analysis
   */
  async analyzeURL(request: AnalysisRequest): Promise<AnalysisResponse> {
    const startTime = Date.now();
    
    try {
      // Validate URL
      if (!this.isValidURL(request.url)) {
        return this.createErrorResponse('URL_INVALID', 'Invalid URL format');
      }

      // Fetch HTML content
      const html = await this.fetchHTML(request.url);
      if (!html) {
        return this.createErrorResponse('FETCH_ERROR', 'Failed to fetch webpage content');
      }

      // Parse HTML and extract structured data
      const parser = new HTMLParser(html, request.url);
      const pageMetadata = parser.extractPageMetadata();
      const structuredData = parser.buildStructuredOnPageData();
      const content = parser.extractMainContent();

      // Perform advanced semantic analysis
      const semanticAnalyzer = new AdvancedSemanticAnalyzer(
        content,
        structuredData.headings_and_keywords,
        structuredData.url_analysis.keywords,
        structuredData.meta_data_analysis.description_keywords
      );
      const semanticAnalysis = semanticAnalyzer.analyzeSemantics();

      // Infer keywords
      const keywordEngine = new KeywordInferenceEngine(structuredData);
      const keywordAnalysis = keywordEngine.inferKeywords();

      // Create base analysis result with new structure
      const analysisResult: SEOAnalysisResult = {
        page_metadata: pageMetadata,
        structured_on_page_data: structuredData,
        semantic_analysis: semanticAnalysis,
        inferred_keywords: keywordAnalysis,
        ai_insights: null, // Will be populated by AI analysis if enabled
        gemini_analysis: {
          reasoning_primary_keywords: '',
          reasoning_secondary_keywords: '',
          seo_recommendations_latest_algorithms: '',
          eeat_assessment: '',
          user_intent_alignment: '',
          ai_overview_optimization: '',
          confidence_assessment: ''
        },
        analysis_timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime
      };

      // Add AI analysis if requested and available
      if (request.include_ai_analysis && this.geminiClient) {
        try {
          const aiAnalysis = await this.geminiClient.analyzeSEO(analysisResult);
          analysisResult.gemini_analysis = aiAnalysis;
        } catch (error) {
          console.warn('AI analysis failed, continuing with basic analysis:', error);
          // Continue without AI analysis rather than failing completely
        }
      }

      return {
        success: true,
        data: analysisResult
      };

    } catch (error) {
      console.error('SEO Analysis Error:', error);
      return this.createErrorResponse('PARSE_ERROR', 'Failed to analyze webpage');
    }
  }

  /**
   * Validate URL format
   */
  private isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Fetch HTML content from URL
   */
  private async fetchHTML(url: string): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      clearTimeout(timeoutId);
      return text;
    } catch (error) {
      console.error('Fetch Error:', error);
      return null;
    }
  }

  /**
   * Create error response
   */
  private createErrorResponse(type: AnalysisError['type'], message: string): AnalysisResponse {
    return {
      success: false,
      error: {
        type,
        message,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Test Gemini API connection
   */
  async testGeminiConnection(): Promise<boolean> {
    if (!this.geminiClient) {
      return false;
    }
    
    try {
      return await this.geminiClient.testConnection();
    } catch {
      return false;
    }
  }

  /**
   * Get analysis summary for quick overview
   */
  getAnalysisSummary(result: SEOAnalysisResult): {
    primaryKeywords: string[];
    secondaryKeywords: string[];
    wordCount: number;
    headingCount: number;
    hasAIAnalysis: boolean;
  } {
    return {
      primaryKeywords: result.inferred_keywords.primary.keywords.map(kw => kw.term),
      secondaryKeywords: result.inferred_keywords.secondary.keywords.map(kw => kw.term),
      wordCount: result.structured_on_page_data.word_count,
      headingCount: result.structured_on_page_data.headings_and_keywords.length,
      hasAIAnalysis: !!result.gemini_analysis.reasoning_primary_keywords
    };
  }

  /**
   * Export analysis to different formats
   */
  exportAnalysis(result: SEOAnalysisResult, format: 'json' | 'csv' | 'markdown'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(result, null, 2);
      
      case 'csv':
        return this.exportToCSV(result);
      
      case 'markdown':
        return this.exportToMarkdown(result);
      
      default:
        return JSON.stringify(result, null, 2);
    }
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(result: SEOAnalysisResult): string {
    const lines: string[] = [];
    
    // Header
    lines.push('Type,Keyword,Confidence Score,Source Locations');
    
    // Primary keywords
    result.inferred_keywords.primary.keywords.forEach(kw => {
      lines.push(`Primary,${kw.term},${kw.confidence_score || 0},${kw.extracted_from.join(';')}`);
    });
    
    // Secondary keywords
    result.inferred_keywords.secondary.keywords.forEach(kw => {
      lines.push(`Secondary,${kw.term},${kw.confidence_score || 0},${kw.extracted_from.join(';')}`);
    });
    
    return lines.join('\n');
  }

  /**
   * Export to Markdown format
   */
  private exportToMarkdown(result: SEOAnalysisResult): string {
    const lines: string[] = [];
    
    lines.push(`# SEO Analysis Report`);
    lines.push(`**URL:** ${result.page_metadata.url}`);
    lines.push(`**Title:** ${result.page_metadata.title_tag}`);
    lines.push(`**Analysis Date:** ${new Date(result.analysis_timestamp).toLocaleString()}`);
    lines.push('');
    
    // Primary Keywords
    lines.push('## Primary Keywords');
    result.inferred_keywords.primary.keywords.forEach(kw => {
      lines.push(`- **${kw.term}** (${Math.round((kw.confidence_score || 0) * 100)}% confidence)`);
      lines.push(`  - Found in: ${kw.extracted_from.join(', ')}`);
    });
    lines.push('');
    
    // Secondary Keywords
    lines.push('## Secondary Keywords');
    result.inferred_keywords.secondary.keywords.slice(0, 10).forEach(kw => {
      lines.push(`- **${kw.term}** (${Math.round((kw.confidence_score || 0) * 100)}% confidence)`);
    });
    lines.push('');
    
    // AI Analysis
    if (result.gemini_analysis.reasoning_primary_keywords) {
      lines.push('## AI Analysis');
      lines.push('### Primary Keyword Reasoning');
      lines.push(result.gemini_analysis.reasoning_primary_keywords);
      lines.push('');
      lines.push('### SEO Recommendations');
      lines.push(result.gemini_analysis.seo_recommendations_latest_algorithms);
    }
    
    return lines.join('\n');
  }
}
