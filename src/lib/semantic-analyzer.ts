/**
 * Semantic Analysis Engine
 * Advanced NLP processing for entity extraction and relationship mapping
 */

import { 
  ContentSemanticAnalysis, 
  EntityExtraction, 
  SemanticRelationship, 
  FrequentTerm
} from '@/types/seo-analysis';

export class SemanticAnalyzer {
  private content: string;
  private headings: Array<{ text: string; keywords: string[] }>;
  private urlKeywords: string[];
  private metaKeywords: string[];

  constructor(
    content: string,
    headings: Array<{ text: string; keywords: string[] }>,
    urlKeywords: string[],
    metaKeywords: string[]
  ) {
    this.content = content.toLowerCase();
    this.headings = headings;
    this.urlKeywords = urlKeywords;
    this.metaKeywords = metaKeywords;
  }

  /**
   * Perform comprehensive semantic analysis
   */
  analyzeSemantics(): ContentSemanticAnalysis {
    const entityExtraction = this.extractEntities();
    const semanticRelationships = this.mapSemanticRelationships();
    const topFrequentTerms = this.analyzeTermFrequency();
    const readabilityScore = this.calculateReadabilityScore();
    const contentTopics = this.identifyContentTopics();

    return {
      entity_extraction: entityExtraction,
      semantic_relationships: semanticRelationships,
      top_frequent_terms: topFrequentTerms,
      readability_score: readabilityScore,
      content_topics: contentTopics
    };
  }

  /**
   * Extract named entities from content
   */
  private extractEntities(): EntityExtraction {
    return {
      people: this.extractPeople(this.content.split(/\s+/)),
      organizations: this.extractOrganizations(this.content.split(/\s+/)),
      locations: this.extractLocations(this.content.split(/\s+/)),
      products: this.extractProducts(this.content.split(/\s+/)),
      technologies: this.extractTechnologies(this.content.split(/\s+/))
    };
  }

  /**
   * Extract people names (simplified approach)
   */
  private extractPeople(words: string[]): string[] {
    const peoplePatterns = [
      /^[A-Z][a-z]+ [A-Z][a-z]+$/, // First Last
      /^[A-Z]\. [A-Z][a-z]+$/, // F. Last
      /^[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+$/ // First M. Last
    ];

    const people: string[] = [];
    const sentences = this.content.split(/[.!?]+/);

    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const potentialName = `${words[i]} ${words[i + 1]}`;
        if (peoplePatterns.some(pattern => pattern.test(potentialName))) {
          people.push(potentialName);
        }
      }
    });

    return [...new Set(people)];
  }

  /**
   * Extract organization names
   */
  private extractOrganizations(words: string[]): string[] {
    const orgKeywords = ['inc', 'corp', 'llc', 'ltd', 'company', 'corporation', 'enterprise', 'group', 'systems', 'solutions'];
    const organizations: string[] = [];

    const sentences = this.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i].toLowerCase();
        if (orgKeywords.includes(word)) {
          // Look for company name before the keyword
          const potentialOrg = words.slice(Math.max(0, i - 2), i + 1).join(' ');
          if (potentialOrg.length > 3) {
            organizations.push(potentialOrg);
          }
        }
      }
    });

    return [...new Set(organizations)];
  }

  /**
   * Extract location names
   */
  private extractLocations(words: string[]): string[] {
    const locationKeywords = ['city', 'state', 'country', 'street', 'avenue', 'road', 'boulevard', 'park', 'square'];
    const locations: string[] = [];

    const sentences = this.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i].toLowerCase();
        if (locationKeywords.includes(word)) {
          const potentialLocation = words.slice(Math.max(0, i - 1), i + 1).join(' ');
          if (potentialLocation.length > 3) {
            locations.push(potentialLocation);
          }
        }
      }
    });

    return [...new Set(locations)];
  }

  /**
   * Extract product names
   */
  private extractProducts(words: string[]): string[] {
    const productKeywords = ['model', 'version', 'series', 'pro', 'max', 'mini', 'plus', 'edition'];
    const products: string[] = [];

    const sentences = this.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i].toLowerCase();
        if (productKeywords.includes(word)) {
          const potentialProduct = words.slice(Math.max(0, i - 1), i + 1).join(' ');
          if (potentialProduct.length > 3) {
            products.push(potentialProduct);
          }
        }
      }
    });

    return [...new Set(products)];
  }

  /**
   * Extract technology terms
   */
  private extractTechnologies(words: string[]): string[] {
    const techKeywords = [
      'api', 'javascript', 'python', 'react', 'vue', 'angular', 'node', 'php', 'java', 'c++', 'c#',
      'html', 'css', 'sql', 'mongodb', 'mysql', 'postgresql', 'redis', 'docker', 'kubernetes',
      'aws', 'azure', 'gcp', 'machine learning', 'ai', 'artificial intelligence', 'blockchain'
    ];

    const technologies: string[] = [];
    techKeywords.forEach(tech => {
      if (this.content.includes(tech.toLowerCase())) {
        technologies.push(tech);
      }
    });

    return [...new Set(technologies)];
  }

  /**
   * Map semantic relationships between terms
   */
  private mapSemanticRelationships(): SemanticRelationship[] {
    const relationships: SemanticRelationship[] = [];
    const allKeywords = this.getAllKeywords();
    
    // Analyze co-occurrence patterns
    allKeywords.forEach(keyword => {
      const coOccurrenceScore = this.calculateCoOccurrenceScore(keyword);
      const contextSentences = this.getContextSentences(keyword);
      const relationshipType = this.determineRelationshipType(keyword);
      
      relationships.push({
        term: keyword,
        related_to_primary_keyword: this.isRelatedToPrimary(keyword),
        relationship_type: relationshipType,
        context_sentences: contextSentences,
        co_occurrence_score: coOccurrenceScore
      });
    });

    return relationships.sort((a, b) => b.co_occurrence_score - a.co_occurrence_score);
  }

  /**
   * Analyze term frequency with TF-IDF scoring
   */
  private analyzeTermFrequency(): FrequentTerm[] {
    const wordCounts = new Map<string, number>();
    const words = this.content.split(/\s+/).filter(word => word.length > 2);
    
    // Count word frequencies
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });

    // Calculate normalized frequencies and TF-IDF scores
    const totalWords = words.length;
    const frequentTerms: FrequentTerm[] = [];

    wordCounts.forEach((count, keyword) => {
      const normalizedFrequency = count / totalWords;
      const tfIdfScore = this.calculateTFIDF(keyword, count, totalWords);
      
      frequentTerms.push({
        keyword,
        count,
        normalized_frequency: normalizedFrequency,
        tf_idf_score: tfIdfScore
      });
    });

    return frequentTerms
      .sort((a, b) => b.tf_idf_score! - a.tf_idf_score!)
      .slice(0, 50); // Top 50 terms
  }

  /**
   * Calculate readability score (simplified Flesch Reading Ease)
   */
  private calculateReadabilityScore(): number {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.content.split(/\s+/).filter(w => w.length > 0);
    const syllables = this.countSyllables(this.content);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Simplified Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Identify main content topics
   */
  private identifyContentTopics(): string[] {
    const topics: string[] = [];
    const sentences = this.content.split(/[.!?]+/);
    
    // Look for topic indicators
    const topicIndicators = [
      'about', 'regarding', 'concerning', 'discussing', 'exploring',
      'focusing on', 'centered around', 'revolves around'
    ];

    sentences.forEach(sentence => {
      topicIndicators.forEach(indicator => {
        if (sentence.includes(indicator)) {
          const topic = sentence.split(indicator)[1]?.trim().split(/[.!?]/)[0];
          if (topic && topic.length > 5 && topic.length < 100) {
            topics.push(topic);
          }
        }
      });
    });

    return [...new Set(topics)].slice(0, 10);
  }

  /**
   * Get all keywords from various sources
   */
  private getAllKeywords(): string[] {
    const allKeywords = new Set<string>();
    
    // Add URL keywords
    this.urlKeywords.forEach(keyword => allKeywords.add(keyword));
    
    // Add meta keywords
    this.metaKeywords.forEach(keyword => allKeywords.add(keyword));
    
    // Add heading keywords
    this.headings.forEach(heading => {
      heading.keywords.forEach(keyword => allKeywords.add(keyword));
    });

    return Array.from(allKeywords);
  }

  /**
   * Calculate co-occurrence score for a keyword
   */
  private calculateCoOccurrenceScore(keyword: string): number {
    const sentences = this.content.split(/[.!?]+/);
    let coOccurrenceCount = 0;
    
    sentences.forEach(sentence => {
      if (sentence.includes(keyword)) {
        // Count other keywords in the same sentence
        const otherKeywords = this.getAllKeywords().filter(k => k !== keyword);
        otherKeywords.forEach(otherKeyword => {
          if (sentence.includes(otherKeyword)) {
            coOccurrenceCount++;
          }
        });
      }
    });

    return coOccurrenceCount / sentences.length;
  }

  /**
   * Get context sentences for a keyword
   */
  private getContextSentences(keyword: string): string[] {
    const sentences = this.content.split(/[.!?]+/);
    const contextSentences: string[] = [];
    
    sentences.forEach(sentence => {
      if (sentence.includes(keyword) && sentence.trim().length > 10) {
        contextSentences.push(sentence.trim());
      }
    });

    return contextSentences.slice(0, 3); // Return top 3 context sentences
  }

  /**
   * Determine relationship type for a keyword
   */
  private determineRelationshipType(keyword: string): SemanticRelationship['relationship_type'] {
    // Simple heuristics for relationship type
    if (this.urlKeywords.includes(keyword)) return 'related_topic';
    if (this.metaKeywords.includes(keyword)) return 'attribute';
    
    // Check if it's a synonym or related term
    const synonyms = this.findSynonyms(keyword);
    if (synonyms.length > 0) return 'synonym';
    
    return 'related_topic';
  }

  /**
   * Check if keyword is related to primary keywords
   */
  private isRelatedToPrimary(keyword: string): boolean {
    return this.urlKeywords.includes(keyword) || this.metaKeywords.includes(keyword);
  }

  /**
   * Calculate TF-IDF score
   */
  private calculateTFIDF(term: string, termFreq: number, totalTerms: number): number {
    const tf = termFreq / totalTerms;
    // Simplified IDF calculation
    const idf = Math.log(totalTerms / termFreq);
    return tf * idf;
  }

  /**
   * Count syllables in text (simplified)
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;
    
    words.forEach(word => {
      // Remove punctuation
      word = word.replace(/[^a-z]/g, '');
      if (word.length === 0) return;
      
      // Count vowel groups
      const vowelGroups = word.match(/[aeiouy]+/g);
      syllables += vowelGroups ? vowelGroups.length : 1;
      
      // Adjust for silent 'e'
      if (word.endsWith('e')) syllables--;
      
      // Minimum 1 syllable per word
      syllables = Math.max(1, syllables);
    });
    
    return syllables;
  }

  /**
   * Find synonyms (simplified approach)
   */
  private findSynonyms(keyword: string): string[] {
    // This is a simplified approach - in a real implementation,
    // you'd use a proper synonym dictionary or NLP library
    const synonymMap: Record<string, string[]> = {
      'car': ['automobile', 'vehicle', 'auto'],
      'phone': ['mobile', 'cellphone', 'smartphone'],
      'computer': ['pc', 'laptop', 'desktop'],
      'website': ['site', 'webpage', 'web page']
    };

    return synonymMap[keyword.toLowerCase()] || [];
  }
}
