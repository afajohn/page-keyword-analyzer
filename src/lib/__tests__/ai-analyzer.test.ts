/**
 * AI Analyzer Test Suite
 * Tests for the advanced AI analysis functionality
 */

import { AIAnalyzer } from '../ai-analyzer';
import { SEOAnalysisResult } from '@/types/seo-analysis';

// Mock the GoogleGenerativeAI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn()
    })
  }))
}));

describe('AIAnalyzer', () => {
  let analyzer: AIAnalyzer;
  let mockModel: {
    generateContent: jest.Mock;
  };

  beforeEach(() => {
    analyzer = new AIAnalyzer('test-api-key');
    mockModel = {
      generateContent: jest.fn()
    };
  });

  describe('validateApiKey', () => {
    it('should validate correct API key format', () => {
      expect(AIAnalyzer.validateApiKey('AIzaSyTest123456789012345678901234567890')).toBe(true);
    });

    it('should reject invalid API key format', () => {
      expect(AIAnalyzer.validateApiKey('invalid-key')).toBe(false);
      expect(AIAnalyzer.validateApiKey('')).toBe(false);
      expect(AIAnalyzer.validateApiKey('AIzaSyShort')).toBe(false);
    });
  });

  describe('analyzeSEO', () => {
    const mockAnalysisData: SEOAnalysisResult = {
      page_metadata: {
        url: 'https://example.com',
        title_tag: 'Test Page',
        meta_description: 'Test description'
      },
      inferred_keywords_analysis: {
        primary: {
          confidence_score: 0.8,
          keywords: [
            {
              term: 'test keyword',
              extracted_from: ['title_tag'],
              confidence_score: 0.8,
              context_sentences: ['Test context']
            }
          ],
          reasoning_summary: 'Test reasoning'
        },
        secondary: {
          confidence_score: 0.6,
          keywords: [],
          reasoning_summary: 'Test reasoning'
        }
      },
      structured_on_page_data: {
        headings_and_keywords: [],
        url_analysis: {
          slug: 'test-page',
          keywords: ['test'],
          path_segments: ['test', 'page']
        },
        meta_data_analysis: {
          description_keywords: ['test'],
          image_alt_texts: []
        },
        content_length: 1000,
        word_count: 200
      },
      content_semantic_analysis: {
        entity_extraction: {
          people: [],
          organizations: [],
          locations: [],
          products: [],
          technologies: []
        },
        semantic_relationships: [],
        top_frequent_terms: [],
        readability_score: 70,
        content_topics: []
      },
      gemini_analysis: {
        reasoning_primary_keywords: '',
        reasoning_secondary_keywords: '',
        seo_recommendations_latest_algorithms: '',
        eeat_assessment: '',
        user_intent_alignment: '',
        ai_overview_optimization: '',
        confidence_assessment: ''
      },
      analysis_timestamp: '2024-01-01T00:00:00.000Z',
      processing_time_ms: 1000
    };

    it('should parse JSON response correctly', async () => {
      const mockResponse = JSON.stringify({
        reasoning_primary_keywords: 'Primary keyword analysis',
        reasoning_secondary_keywords: 'Secondary keyword analysis',
        seo_recommendations_latest_algorithms: 'SEO recommendations',
        eeat_assessment: 'E-E-A-T assessment',
        user_intent_alignment: 'User intent analysis',
        ai_overview_optimization: 'AI Overview optimization',
        confidence_assessment: 'Confidence assessment',
        best_keyword: 'best keyword',
        best_long_tail_keyword: 'best long tail keyword'
      });

      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => mockResponse
        }
      });

      const result = await analyzer.analyzeSEO(mockAnalysisData);

      expect(result.reasoning_primary_keywords).toBe('Primary keyword analysis');
      expect(result.reasoning_secondary_keywords).toBe('Secondary keyword analysis');
      expect(result.best_keyword).toBe('best keyword');
      expect(result.best_long_tail_keyword).toBe('best long tail keyword');
    });

    it('should handle empty response gracefully', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => ''
        }
      });

      await expect(analyzer.analyzeSEO(mockAnalysisData)).rejects.toThrow('AI analysis is currently unavailable');
    });

    it('should handle API errors gracefully', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('API Error'));

      await expect(analyzer.analyzeSEO(mockAnalysisData)).rejects.toThrow('AI analysis is currently unavailable');
    });

    it('should parse text response when JSON parsing fails', async () => {
      const textResponse = `
        reasoning_primary_keywords: Primary keyword analysis text
        reasoning_secondary_keywords: Secondary keyword analysis text
        seo_recommendations_latest_algorithms: SEO recommendations text
      `;

      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => textResponse
        }
      });

      const result = await analyzer.analyzeSEO(mockAnalysisData);

      expect(result.reasoning_primary_keywords).toContain('Primary keyword analysis text');
      expect(result.reasoning_secondary_keywords).toContain('Secondary keyword analysis text');
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: { text: () => 'Test response' }
      });

      const result = await analyzer.testConnection();
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('Connection failed'));

      const result = await analyzer.testConnection();
      expect(result).toBe(false);
    });
  });
});
