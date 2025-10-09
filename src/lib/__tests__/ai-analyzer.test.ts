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

  describe('AI-Ready Content Generation', () => {
    const mockAnalysisData: SEOAnalysisResult = {
      page_metadata: {
        url: 'https://example.com/test-article',
        title_tag: 'Complete Guide to SEO Optimization',
        meta_description: 'Learn advanced SEO optimization techniques'
      },
      inferred_keywords: {
        primary: {
          confidence_score: 0.9,
          keywords: [
            {
              term: 'SEO optimization',
              extracted_from: ['title_tag', 'h1_heading'],
              confidence_score: 0.9,
              context_sentences: ['SEO optimization is crucial for ranking']
            }
          ],
          reasoning_summary: 'Primary keyword identified from title and H1'
        },
        secondary: {
          confidence_score: 0.7,
          keywords: [],
          reasoning_summary: 'Secondary keywords from content'
        }
      },
      structured_on_page_data: {
        headings_and_keywords: [
          { tag: 'h1', text: 'Complete Guide to SEO Optimization', keywords: ['SEO', 'optimization', 'guide'] }
        ],
        url_analysis: {
          slug: 'seo-optimization-guide',
          keywords: ['seo', 'optimization', 'guide'],
          path_segments: ['blog', 'seo-optimization-guide']
        },
        meta_data_analysis: {
          description_keywords: ['SEO', 'optimization', 'techniques'],
          image_alt_texts: []
        },
        content_length: 5000,
        word_count: 1200
      },
      semantic_analysis: {
        core_topic_analysis: {
          main_topic: {
            topic: 'SEO optimization',
            confidence_score: 0.9,
            reasoning: 'Main topic identified from content analysis'
          },
          inferred_entities: {
            people: [],
            organizations: ['Google'],
            locations: [],
            products: [],
            technologies: []
          },
          co_occurring_terms: ['ranking', 'keywords', 'search']
        },
        entity_extraction: {
          people: [],
          organizations: ['Google'],
          locations: [],
          products: [],
          technologies: ['HTML', 'JavaScript']
        },
        semantic_relationships: [],
        top_frequent_terms: [],
        readability_score: 75,
        content_topics: ['SEO', 'optimization', 'ranking'],
        eeat_score: {
          expertise: 60,
          experience: 45,
          authoritativeness: 70,
          trustworthiness: 80,
          overall: 63.75
        },
        query_fan_out: {
          primary_topics: ['SEO optimization', 'keyword research'],
          related_queries: ['how to optimize for SEO', 'SEO best practices'],
          content_gaps: ['case studies', 'data analysis'],
          expansion_opportunities: ['SEO tools comparison', 'advanced techniques'],
          semantic_clusters: []
        }
      },
      ai_insights: null,
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
      processing_time_ms: 2000
    };

    describe('Direct Answer Snippet Generation', () => {
      it('should generate snippet with 25 words or less', async () => {
        const mockResponse = JSON.stringify({
          ai_overview_snippet: 'SEO optimization involves improving website visibility through keyword research, on-page optimization, quality content, and technical enhancements to rank higher in search results.',
          optimized_faq_schema: '{}',
          eeat_content_suggestion: 'Test content',
          internal_link_boost_plan: []
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.ai_overview_snippet).toBeDefined();
        if (result.ai_overview_snippet) {
          const wordCount = result.ai_overview_snippet.split(/\s+/).length;
          expect(wordCount).toBeLessThanOrEqual(25);
        }
      });

      it('should truncate snippets exceeding 25 words', async () => {
        const longSnippet = 'This is a very long snippet that definitely exceeds the twenty-five word limit and should be truncated by the validation function to ensure it meets the requirements for featured snippets and AI overviews in search results';
        
        const mockResponse = JSON.stringify({
          ai_overview_snippet: longSnippet,
          optimized_faq_schema: '{}',
          eeat_content_suggestion: 'Test content',
          internal_link_boost_plan: []
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.ai_overview_snippet).toBeDefined();
        if (result.ai_overview_snippet) {
          const wordCount = result.ai_overview_snippet.split(/\s+/).length;
          expect(wordCount).toBeLessThanOrEqual(26); // 25 + ellipsis
        }
      });
    });

    describe('FAQ Schema Generation', () => {
      it('should generate valid JSON-LD FAQ schema', async () => {
        const validFAQSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is SEO optimization?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'SEO optimization is the process of improving website visibility in search engine results.'
              }
            }
          ]
        };

        const mockResponse = JSON.stringify({
          ai_overview_snippet: 'Test snippet',
          optimized_faq_schema: JSON.stringify(validFAQSchema),
          eeat_content_suggestion: 'Test content',
          internal_link_boost_plan: []
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.optimized_faq_schema).toBeDefined();
        if (result.optimized_faq_schema) {
          const parsed = JSON.parse(result.optimized_faq_schema);
          expect(parsed['@type']).toBe('FAQPage');
          expect(Array.isArray(parsed.mainEntity)).toBe(true);
        }
      });

      it('should reject invalid FAQ schema', async () => {
        const mockResponse = JSON.stringify({
          ai_overview_snippet: 'Test snippet',
          optimized_faq_schema: 'invalid json',
          eeat_content_suggestion: 'Test content',
          internal_link_boost_plan: []
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.optimized_faq_schema).toBeUndefined();
      });
    });

    describe('E-E-A-T Content Suggestion', () => {
      it('should generate E-E-A-T content suggestion', async () => {
        const mockResponse = JSON.stringify({
          ai_overview_snippet: 'Test snippet',
          optimized_faq_schema: '{}',
          eeat_content_suggestion: 'As an SEO consultant with over 10 years of experience, I have helped hundreds of businesses improve their search rankings through data-driven optimization strategies. My approach combines technical expertise with real-world testing to deliver measurable results for clients across various industries.',
          internal_link_boost_plan: []
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.eeat_content_suggestion).toBeDefined();
        if (result.eeat_content_suggestion) {
          const wordCount = result.eeat_content_suggestion.split(/\s+/).length;
          expect(wordCount).toBeGreaterThan(50); // Should be substantial content
        }
      });
    });

    describe('Internal Link Strategy', () => {
      it('should generate internal link recommendations', async () => {
        const mockResponse = JSON.stringify({
          ai_overview_snippet: 'Test snippet',
          optimized_faq_schema: '{}',
          eeat_content_suggestion: 'Test content',
          internal_link_boost_plan: [
            { source_page: 'Homepage', suggested_anchor: 'SEO optimization guide' },
            { source_page: 'Blog Category: Marketing', suggested_anchor: 'learn SEO optimization' },
            { source_page: 'High-Traffic Article: Digital Marketing Basics', suggested_anchor: 'advanced SEO techniques' }
          ]
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.internal_link_boost_plan).toBeDefined();
        expect(Array.isArray(result.internal_link_boost_plan)).toBe(true);
        if (result.internal_link_boost_plan) {
          expect(result.internal_link_boost_plan.length).toBeGreaterThan(0);
          result.internal_link_boost_plan.forEach(link => {
            expect(link.source_page).toBeDefined();
            expect(link.suggested_anchor).toBeDefined();
          });
        }
      });
    });

    describe('Domain/Page Authority Analysis', () => {
      it('should generate authority analysis with scores', async () => {
        const mockResponse = JSON.stringify({
          summary: 'The article demonstrates strong content quality but lacks sufficient backlink potential.',
          content_linkability_score: 75,
          internal_link_strength: 60,
          backlink_opportunity_score: 80,
          page_authority_recommendations: [
            {
              type: 'Content',
              priority: 'High',
              description: 'Add original data or case studies to increase linkability'
            }
          ],
          domain_authority_recommendations: [
            {
              type: 'Off-Page',
              priority: 'High',
              description: 'Conduct outreach to industry publications for backlinks'
            }
          ]
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        expect(result.authority_analysis).toBeDefined();
        if (result.authority_analysis) {
          expect(result.authority_analysis.summary).toBeDefined();
          expect(result.authority_analysis.content_linkability_score).toBeGreaterThanOrEqual(0);
          expect(result.authority_analysis.content_linkability_score).toBeLessThanOrEqual(100);
          expect(result.authority_analysis.internal_link_strength).toBeGreaterThanOrEqual(0);
          expect(result.authority_analysis.backlink_opportunity_score).toBeGreaterThanOrEqual(0);
          expect(Array.isArray(result.authority_analysis.page_authority_recommendations)).toBe(true);
          expect(Array.isArray(result.authority_analysis.domain_authority_recommendations)).toBe(true);
        }
      });

      it('should validate recommendation priorities', async () => {
        const mockResponse = JSON.stringify({
          summary: 'Test summary',
          content_linkability_score: 70,
          internal_link_strength: 65,
          backlink_opportunity_score: 75,
          page_authority_recommendations: [
            { type: 'Content', priority: 'High', description: 'High priority task' },
            { type: 'Internal Link', priority: 'Medium', description: 'Medium priority task' },
            { type: 'Structure', priority: 'Low', description: 'Low priority task' }
          ],
          domain_authority_recommendations: []
        });

        mockModel.generateContent.mockResolvedValue({
          response: { text: () => mockResponse }
        });

        const result = await analyzer.analyzeSEO(mockAnalysisData);

        if (result.authority_analysis && result.authority_analysis.page_authority_recommendations) {
          result.authority_analysis.page_authority_recommendations.forEach(rec => {
            expect(['High', 'Medium', 'Low']).toContain(rec.priority);
          });
        }
      });
    });
  });
});
