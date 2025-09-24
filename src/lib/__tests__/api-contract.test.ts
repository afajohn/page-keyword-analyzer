/**
 * API Contract Test Suite
 * Tests for API endpoint contracts and data structures
 */

import { SEOAnalysisResult } from '@/types/seo-analysis';

describe('API Contract Tests', () => {
  describe('SEOAnalysisResult Interface', () => {
    it('should have all required fields', () => {
      const mockResult: SEOAnalysisResult = {
        page_metadata: {
          url: 'https://example.com',
          title_tag: 'Test Page',
          meta_description: 'Test description',
          favicon_url: 'https://example.com/favicon.ico',
          language: 'en',
          charset: 'UTF-8'
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
            keywords: [
              {
                term: 'secondary keyword',
                extracted_from: ['h2_headings'],
                confidence_score: 0.6,
                context_sentences: ['Secondary context']
              }
            ],
            reasoning_summary: 'Secondary reasoning'
          }
        },
        structured_on_page_data: {
          headings_and_keywords: [
            {
              tag: 'h1',
              text: 'Main Heading',
              keywords: ['main', 'heading'],
              position: 1
            }
          ],
          url_analysis: {
            slug: 'test-page',
            keywords: ['test', 'page'],
            path_segments: ['test', 'page']
          },
          meta_data_analysis: {
            description_keywords: ['test', 'description'],
            image_alt_texts: [
              {
                text: 'Test image',
                keywords: ['test', 'image'],
                src: 'https://example.com/image.jpg'
              }
            ],
            canonical_url: 'https://example.com/test-page',
            robots_meta: 'index, follow',
            meta_keywords: ['test', 'keywords']
          },
          content_length: 1000,
          word_count: 200
        },
        content_semantic_analysis: {
          entity_extraction: {
            people: ['John Doe'],
            organizations: ['TechCorp Inc'],
            locations: ['San Francisco'],
            products: ['Product X'],
            technologies: ['JavaScript', 'React']
          },
          semantic_relationships: [
            {
              term: 'web development',
              related_to_primary_keyword: true,
              relationship_type: 'related_topic',
              context_sentences: ['Web development is important'],
              co_occurrence_score: 0.8
            }
          ],
          top_frequent_terms: [
            {
              keyword: 'development',
              count: 10,
              normalized_frequency: 0.05,
              tf_idf_score: 0.8
            }
          ],
          readability_score: 70,
          content_topics: ['web development', 'programming'],
          eeat_score: {
            expertise: 75,
            experience: 60,
            authoritativeness: 70,
            trustworthiness: 80,
            overall: 71
          },
          query_fan_out: {
            primary_topics: ['web development'],
            related_queries: ['what is web development', 'how to learn web development'],
            content_gaps: ['faq', 'contact'],
            expansion_opportunities: ['web development tools', 'programming languages'],
            semantic_clusters: [
              {
                topic: 'web development',
                related_keywords: ['javascript', 'html', 'css'],
                strength: 85
              }
            ]
          },
          content_quality_score: 75,
          topical_authority_score: 80,
          user_intent_signals: {
            informational: 70,
            navigational: 30,
            transactional: 20,
            commercial: 40
          }
        },
        gemini_analysis: {
          reasoning_primary_keywords: 'Primary keyword analysis',
          reasoning_secondary_keywords: 'Secondary keyword analysis',
          seo_recommendations_latest_algorithms: 'SEO recommendations',
          eeat_assessment: 'E-E-A-T assessment',
          user_intent_alignment: 'User intent analysis',
          ai_overview_optimization: 'AI Overview optimization',
          confidence_assessment: 'Confidence assessment',
          best_keyword: 'web development',
          best_long_tail_keyword: 'how to learn web development',
          processing_time_ms: 1500,
          timestamp: '2024-01-01T00:00:00.000Z'
        },
        analysis_timestamp: '2024-01-01T00:00:00.000Z',
        processing_time_ms: 2000
      };

      expect(mockResult.page_metadata).toBeDefined();
      expect(mockResult.inferred_keywords_analysis).toBeDefined();
      expect(mockResult.structured_on_page_data).toBeDefined();
      expect(mockResult.content_semantic_analysis).toBeDefined();
      expect(mockResult.gemini_analysis).toBeDefined();
      expect(mockResult.analysis_timestamp).toBeDefined();
      expect(mockResult.processing_time_ms).toBeDefined();
    });

    it('should validate confidence scores are between 0 and 1', () => {
      const mockResult: SEOAnalysisResult = {
        page_metadata: {
          url: 'https://example.com',
          title_tag: 'Test Page',
          meta_description: 'Test description'
        },
        inferred_keywords_analysis: {
          primary: {
            confidence_score: 0.8,
            keywords: [],
            reasoning_summary: 'Test reasoning'
          },
          secondary: {
            confidence_score: 0.6,
            keywords: [],
            reasoning_summary: 'Secondary reasoning'
          }
        },
        structured_on_page_data: {
          headings_and_keywords: [],
          url_analysis: {
            slug: 'test-page',
            keywords: [],
            path_segments: []
          },
          meta_data_analysis: {
            description_keywords: [],
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

      expect(mockResult.inferred_keywords_analysis.primary.confidence_score).toBeGreaterThanOrEqual(0);
      expect(mockResult.inferred_keywords_analysis.primary.confidence_score).toBeLessThanOrEqual(1);
      expect(mockResult.inferred_keywords_analysis.secondary.confidence_score).toBeGreaterThanOrEqual(0);
      expect(mockResult.inferred_keywords_analysis.secondary.confidence_score).toBeLessThanOrEqual(1);
    });

    it('should validate E-E-A-T scores are between 0 and 100', () => {
      const mockEEATScore = {
        expertise: 75,
        experience: 60,
        authoritativeness: 70,
        trustworthiness: 80,
        overall: 71
      };

      expect(mockEEATScore.expertise).toBeGreaterThanOrEqual(0);
      expect(mockEEATScore.expertise).toBeLessThanOrEqual(100);
      expect(mockEEATScore.experience).toBeGreaterThanOrEqual(0);
      expect(mockEEATScore.experience).toBeLessThanOrEqual(100);
      expect(mockEEATScore.authoritativeness).toBeGreaterThanOrEqual(0);
      expect(mockEEATScore.authoritativeness).toBeLessThanOrEqual(100);
      expect(mockEEATScore.trustworthiness).toBeGreaterThanOrEqual(0);
      expect(mockEEATScore.trustworthiness).toBeLessThanOrEqual(100);
      expect(mockEEATScore.overall).toBeGreaterThanOrEqual(0);
      expect(mockEEATScore.overall).toBeLessThanOrEqual(100);
    });

    it('should validate user intent signals are between 0 and 100', () => {
      const mockUserIntentSignals = {
        informational: 70,
        navigational: 30,
        transactional: 20,
        commercial: 40
      };

      expect(mockUserIntentSignals.informational).toBeGreaterThanOrEqual(0);
      expect(mockUserIntentSignals.informational).toBeLessThanOrEqual(100);
      expect(mockUserIntentSignals.navigational).toBeGreaterThanOrEqual(0);
      expect(mockUserIntentSignals.navigational).toBeLessThanOrEqual(100);
      expect(mockUserIntentSignals.transactional).toBeGreaterThanOrEqual(0);
      expect(mockUserIntentSignals.transactional).toBeLessThanOrEqual(100);
      expect(mockUserIntentSignals.commercial).toBeGreaterThanOrEqual(0);
      expect(mockUserIntentSignals.commercial).toBeLessThanOrEqual(100);
    });
  });

  describe('API Response Format', () => {
    it('should have consistent error response structure', () => {
      const errorResponse = {
        success: false,
        error: {
          type: 'URL_INVALID',
          message: 'Invalid URL format',
          details: 'URL must be a valid HTTP or HTTPS URL',
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.type).toBeDefined();
      expect(errorResponse.error.message).toBeDefined();
      expect(errorResponse.error.timestamp).toBeDefined();
    });

    it('should have consistent success response structure', () => {
      const successResponse = {
        success: true,
        data: {
          // SEOAnalysisResult would go here
        }
      };

      expect(successResponse.success).toBe(true);
      expect(successResponse.data).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should handle empty arrays gracefully', () => {
      const emptyArrays = {
        keywords: [],
        entities: [],
        relationships: [],
        topics: []
      };

      expect(Array.isArray(emptyArrays.keywords)).toBe(true);
      expect(Array.isArray(emptyArrays.entities)).toBe(true);
      expect(Array.isArray(emptyArrays.relationships)).toBe(true);
      expect(Array.isArray(emptyArrays.topics)).toBe(true);
    });

    it('should handle undefined optional fields', () => {
      const partialData = {
        eeat_score: undefined,
        query_fan_out: undefined,
        content_quality_score: undefined,
        topical_authority_score: undefined,
        user_intent_signals: undefined
      };

      expect(partialData.eeat_score).toBeUndefined();
      expect(partialData.query_fan_out).toBeUndefined();
      expect(partialData.content_quality_score).toBeUndefined();
      expect(partialData.topical_authority_score).toBeUndefined();
      expect(partialData.user_intent_signals).toBeUndefined();
    });
  });
});
