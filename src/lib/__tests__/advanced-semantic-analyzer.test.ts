/**
 * Advanced Semantic Analyzer Test Suite
 * Tests for the enhanced semantic analysis functionality
 */

import { AdvancedSemanticAnalyzer } from '../advanced-semantic-analyzer';

describe('AdvancedSemanticAnalyzer', () => {
  let analyzer: AdvancedSemanticAnalyzer;

  beforeEach(() => {
    analyzer = new AdvancedSemanticAnalyzer(
      'This is a test content about web development. JavaScript is a programming language. React is a popular framework. John Doe is a developer at TechCorp Inc. The company is located in San Francisco, California.',
      [
        { text: 'Web Development Guide', keywords: ['web', 'development', 'guide'] },
        { text: 'JavaScript Tutorial', keywords: ['javascript', 'tutorial'] }
      ],
      ['web', 'development'],
      ['javascript', 'react']
    );
  });

  describe('extractEntities', () => {
    it('should extract people names correctly', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.entity_extraction.people).toContain('John Doe');
    });

    it('should extract organization names correctly', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.entity_extraction.organizations).toContain('TechCorp Inc');
    });

    it('should extract location names correctly', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.entity_extraction.locations).toContain('San Francisco, California');
    });

    it('should extract technology terms correctly', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.entity_extraction.technologies).toContain('javascript');
      expect(result.entity_extraction.technologies).toContain('react');
    });
  });

  describe('EEAT scoring', () => {
    it('should calculate E-E-A-T scores', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.eeat_score).toBeDefined();
      expect(result.eeat_score?.expertise).toBeGreaterThanOrEqual(0);
      expect(result.eeat_score?.experience).toBeGreaterThanOrEqual(0);
      expect(result.eeat_score?.authoritativeness).toBeGreaterThanOrEqual(0);
      expect(result.eeat_score?.trustworthiness).toBeGreaterThanOrEqual(0);
      expect(result.eeat_score?.overall).toBeGreaterThanOrEqual(0);
    });

    it('should have overall score as average of individual scores', () => {
      const result = analyzer.analyzeSemantics();
      
      if (result.eeat_score) {
        const expectedOverall = (
          result.eeat_score.expertise +
          result.eeat_score.experience +
          result.eeat_score.authoritativeness +
          result.eeat_score.trustworthiness
        ) / 4;
        
        expect(result.eeat_score.overall).toBeCloseTo(expectedOverall, 1);
      }
    });
  });

  describe('Query Fan-Out Analysis', () => {
    it('should identify primary topics', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.query_fan_out?.primary_topics).toBeDefined();
      expect(Array.isArray(result.query_fan_out?.primary_topics)).toBe(true);
    });

    it('should generate related queries', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.query_fan_out?.related_queries).toBeDefined();
      expect(Array.isArray(result.query_fan_out?.related_queries)).toBe(true);
    });

    it('should identify content gaps', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.query_fan_out?.content_gaps).toBeDefined();
      expect(Array.isArray(result.query_fan_out?.content_gaps)).toBe(true);
    });

    it('should identify expansion opportunities', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.query_fan_out?.expansion_opportunities).toBeDefined();
      expect(Array.isArray(result.query_fan_out?.expansion_opportunities)).toBe(true);
    });

    it('should build semantic clusters', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.query_fan_out?.semantic_clusters).toBeDefined();
      expect(Array.isArray(result.query_fan_out?.semantic_clusters)).toBe(true);
    });
  });

  describe('Content Quality Scoring', () => {
    it('should calculate content quality score', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.content_quality_score).toBeDefined();
      expect(result.content_quality_score).toBeGreaterThanOrEqual(0);
      expect(result.content_quality_score).toBeLessThanOrEqual(100);
    });

    it('should calculate topical authority score', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.topical_authority_score).toBeDefined();
      expect(result.topical_authority_score).toBeGreaterThanOrEqual(0);
      expect(result.topical_authority_score).toBeLessThanOrEqual(100);
    });
  });

  describe('User Intent Analysis', () => {
    it('should analyze user intent signals', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.user_intent_signals).toBeDefined();
      expect(result.user_intent_signals?.informational).toBeGreaterThanOrEqual(0);
      expect(result.user_intent_signals?.navigational).toBeGreaterThanOrEqual(0);
      expect(result.user_intent_signals?.transactional).toBeGreaterThanOrEqual(0);
      expect(result.user_intent_signals?.commercial).toBeGreaterThanOrEqual(0);
    });

    it('should have all intent scores within valid range', () => {
      const result = analyzer.analyzeSemantics();
      
      if (result.user_intent_signals) {
        expect(result.user_intent_signals.informational).toBeLessThanOrEqual(100);
        expect(result.user_intent_signals.navigational).toBeLessThanOrEqual(100);
        expect(result.user_intent_signals.transactional).toBeLessThanOrEqual(100);
        expect(result.user_intent_signals.commercial).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Readability Scoring', () => {
    it('should calculate readability score', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.readability_score).toBeDefined();
      expect(result.readability_score).toBeGreaterThanOrEqual(0);
      expect(result.readability_score).toBeLessThanOrEqual(100);
    });
  });

  describe('Term Frequency Analysis', () => {
    it('should calculate term frequencies with TF-IDF', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.top_frequent_terms).toBeDefined();
      expect(Array.isArray(result.top_frequent_terms)).toBe(true);
      
      if (result.top_frequent_terms.length > 0) {
        expect(result.top_frequent_terms[0].tf_idf_score).toBeDefined();
        expect(typeof result.top_frequent_terms[0].count).toBe('number');
        expect(typeof result.top_frequent_terms[0].normalized_frequency).toBe('number');
      }
    });

    it('should sort terms by TF-IDF score', () => {
      const result = analyzer.analyzeSemantics();
      
      if (result.top_frequent_terms.length > 1) {
        for (let i = 0; i < result.top_frequent_terms.length - 1; i++) {
          const current = result.top_frequent_terms[i].tf_idf_score || 0;
          const next = result.top_frequent_terms[i + 1].tf_idf_score || 0;
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });
  });

  describe('Semantic Relationships', () => {
    it('should map semantic relationships', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.semantic_relationships).toBeDefined();
      expect(Array.isArray(result.semantic_relationships)).toBe(true);
      
      if (result.semantic_relationships.length > 0) {
        const relationship = result.semantic_relationships[0];
        expect(relationship.term).toBeDefined();
        expect(typeof relationship.co_occurrence_score).toBe('number');
        expect(Array.isArray(relationship.context_sentences)).toBe(true);
      }
    });

    it('should sort relationships by co-occurrence score', () => {
      const result = analyzer.analyzeSemantics();
      
      if (result.semantic_relationships.length > 1) {
        for (let i = 0; i < result.semantic_relationships.length - 1; i++) {
          const current = result.semantic_relationships[i].co_occurrence_score;
          const next = result.semantic_relationships[i + 1].co_occurrence_score;
          expect(current).toBeGreaterThanOrEqual(next);
        }
      }
    });
  });

  describe('Content Topics', () => {
    it('should identify content topics', () => {
      const result = analyzer.analyzeSemantics();
      
      expect(result.content_topics).toBeDefined();
      expect(Array.isArray(result.content_topics)).toBe(true);
    });
  });
});
