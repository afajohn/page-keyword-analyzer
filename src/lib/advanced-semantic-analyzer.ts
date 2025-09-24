/**
 * Advanced Semantic Analysis Engine
 * Enhanced NLP processing with E-E-A-T scoring, query fan-out optimization, and advanced entity extraction
 */

import { 
  ContentSemanticAnalysis, 
  EntityExtraction, 
  SemanticRelationship, 
  FrequentTerm,
  CoreTopicAnalysis
} from '@/types/seo-analysis';

interface EEATScore {
  expertise: number;
  experience: number;
  authoritativeness: number;
  trustworthiness: number;
  overall: number;
}

interface QueryFanOutAnalysis {
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

interface AdvancedSemanticAnalysis extends ContentSemanticAnalysis {
  eeat_score: EEATScore;
  query_fan_out: QueryFanOutAnalysis;
  content_quality_score: number;
  topical_authority_score: number;
  user_intent_signals: {
    informational: number;
    navigational: number;
    transactional: number;
    commercial: number;
  };
}

export class AdvancedSemanticAnalyzer {
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
   * Perform comprehensive advanced semantic analysis
   */
  analyzeSemantics(): AdvancedSemanticAnalysis {
    const coreTopicAnalysis = this.analyzeCoreTopic();
    const entityExtraction = this.extractEntities();
    const semanticRelationships = this.mapSemanticRelationships();
    const topFrequentTerms = this.analyzeTermFrequency();
    const readabilityScore = this.calculateReadabilityScore();
    const contentTopics = this.identifyContentTopics();
    const eeatScore = this.calculateEEATScore();
    const queryFanOut = this.analyzeQueryFanOut();
    const contentQualityScore = this.calculateContentQualityScore();
    const topicalAuthorityScore = this.calculateTopicalAuthorityScore();
    const userIntentSignals = this.analyzeUserIntentSignals();

    return {
      core_topic_analysis: coreTopicAnalysis,
      entity_extraction: entityExtraction,
      semantic_relationships: semanticRelationships,
      top_frequent_terms: topFrequentTerms,
      readability_score: readabilityScore,
      content_topics: contentTopics,
      eeat_score: eeatScore,
      query_fan_out: queryFanOut,
      content_quality_score: contentQualityScore,
      topical_authority_score: topicalAuthorityScore,
      user_intent_signals: userIntentSignals
    };
  }

  /**
   * Enhanced entity extraction with advanced NLP techniques
   */
  private extractEntities(): EntityExtraction {
    return {
      people: this.extractPeople(),
      organizations: this.extractOrganizations(),
      locations: this.extractLocations(),
      products: this.extractProducts(),
      technologies: this.extractTechnologies()
    };
  }

  /**
   * Extract people names with advanced patterns
   */
  private extractPeople(): string[] {
    const peoplePatterns = [
      /^[A-Z][a-z]+ [A-Z][a-z]+$/, // First Last
      /^[A-Z]\. [A-Z][a-z]+$/, // F. Last
      /^[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+$/, // First M. Last
      /^Dr\. [A-Z][a-z]+ [A-Z][a-z]+$/, // Dr. First Last
      /^Prof\. [A-Z][a-z]+ [A-Z][a-z]+$/ // Prof. First Last
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
   * Extract organization names with enhanced patterns
   */
  private extractOrganizations(): string[] {
    const orgKeywords = [
      'inc', 'corp', 'llc', 'ltd', 'company', 'corporation', 'enterprise', 
      'group', 'systems', 'solutions', 'technologies', 'services', 'consulting',
      'associates', 'partners', 'holdings', 'international', 'global', 'worldwide'
    ];
    const organizations: string[] = [];

    const sentences = this.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i].toLowerCase();
        if (orgKeywords.includes(word)) {
          const potentialOrg = words.slice(Math.max(0, i - 3), i + 1).join(' ');
          if (potentialOrg.length > 5) {
            organizations.push(potentialOrg);
          }
        }
      }
    });

    return [...new Set(organizations)];
  }

  /**
   * Extract location names with geographic indicators
   */
  private extractLocations(): string[] {
    const locationKeywords = [
      'city', 'state', 'country', 'street', 'avenue', 'road', 'boulevard', 
      'park', 'square', 'plaza', 'district', 'region', 'province', 'county',
      'nation', 'continent', 'island', 'peninsula', 'valley', 'mountain'
    ];
    const locations: string[] = [];

    const sentences = this.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i].toLowerCase();
        if (locationKeywords.includes(word)) {
          const potentialLocation = words.slice(Math.max(0, i - 2), i + 1).join(' ');
          if (potentialLocation.length > 4) {
            locations.push(potentialLocation);
          }
        }
      }
    });

    return [...new Set(locations)];
  }

  /**
   * Extract product names with version patterns
   */
  private extractProducts(): string[] {
    const productKeywords = [
      'model', 'version', 'series', 'pro', 'max', 'mini', 'plus', 'edition',
      'premium', 'standard', 'basic', 'advanced', 'professional', 'enterprise'
    ];
    const products: string[] = [];

    const sentences = this.content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word = words[i].toLowerCase();
        if (productKeywords.includes(word)) {
          const potentialProduct = words.slice(Math.max(0, i - 2), i + 1).join(' ');
          if (potentialProduct.length > 4) {
            products.push(potentialProduct);
          }
        }
      }
    });

    return [...new Set(products)];
  }

  /**
   * Extract technology terms with comprehensive coverage
   */
  private extractTechnologies(): string[] {
    const techKeywords = [
      'api', 'javascript', 'python', 'react', 'vue', 'angular', 'node', 'php', 'java', 'c++', 'c#',
      'html', 'css', 'sql', 'mongodb', 'mysql', 'postgresql', 'redis', 'docker', 'kubernetes',
      'aws', 'azure', 'gcp', 'machine learning', 'ai', 'artificial intelligence', 'blockchain',
      'typescript', 'graphql', 'rest', 'microservices', 'serverless', 'devops', 'ci/cd',
      'react native', 'flutter', 'swift', 'kotlin', 'rust', 'go', 'ruby', 'scala'
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
   * Map semantic relationships with enhanced scoring
   */
  private mapSemanticRelationships(): SemanticRelationship[] {
    const relationships: SemanticRelationship[] = [];
    const allKeywords = this.getAllKeywords();
    
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
   * Analyze term frequency with advanced TF-IDF scoring
   */
  private analyzeTermFrequency(): FrequentTerm[] {
    const wordCounts = new Map<string, number>();
    const words = this.content.split(/\s+/).filter(word => word.length > 2);
    
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });

    const totalWords = words.length;
    const frequentTerms: FrequentTerm[] = [];

    wordCounts.forEach((count, keyword) => {
      const normalizedFrequency = count / totalWords;
      const tfIdfScore = this.calculateAdvancedTFIDF(keyword, count, totalWords);
      
      frequentTerms.push({
        keyword,
        count,
        normalized_frequency: normalizedFrequency,
        tf_idf_score: tfIdfScore
      });
    });

    return frequentTerms
      .sort((a, b) => (b.tf_idf_score || 0) - (a.tf_idf_score || 0))
      .slice(0, 50);
  }

  /**
   * Calculate advanced TF-IDF with normalization
   */
  private calculateAdvancedTFIDF(term: string, termFreq: number, totalTerms: number): number {
    const tf = termFreq / totalTerms;
    const idf = Math.log(totalTerms / termFreq);
    
    // Apply length normalization (shorter terms get slight boost)
    const lengthBonus = term.length <= 5 ? 1.1 : 1.0;
    
    // Apply position bonus (terms in headings get boost)
    const positionBonus = this.getPositionBonus(term);
    
    return tf * idf * lengthBonus * positionBonus;
  }

  /**
   * Get position bonus for terms in headings
   */
  private getPositionBonus(term: string): number {
    const headingText = this.headings.map(h => h.text.toLowerCase()).join(' ');
    return headingText.includes(term) ? 1.2 : 1.0;
  }

  /**
   * Calculate readability score with enhanced formula
   */
  private calculateReadabilityScore(): number {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.content.split(/\s+/).filter(w => w.length > 0);
    const syllables = this.countSyllables(this.content);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Enhanced Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Apply content quality adjustments
    const qualityAdjustment = this.getQualityAdjustment(words, sentences);
    
    return Math.max(0, Math.min(100, score + qualityAdjustment));
  }

  /**
   * Get quality adjustment for readability score
   */
  private getQualityAdjustment(words: string[], sentences: string[]): number {
    let adjustment = 0;
    
    // Bonus for varied sentence lengths
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const lengthVariance = this.calculateVariance(sentenceLengths);
    adjustment += lengthVariance > 50 ? 5 : 0;
    
    // Bonus for varied word lengths
    const wordLengths = words.map(w => w.length);
    const wordVariance = this.calculateVariance(wordLengths);
    adjustment += wordVariance > 3 ? 3 : 0;
    
    return adjustment;
  }

  /**
   * Calculate variance of an array
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate E-E-A-T score
   */
  private calculateEEATScore(): EEATScore {
    const expertise = this.calculateExpertiseScore();
    const experience = this.calculateExperienceScore();
    const authoritativeness = this.calculateAuthoritativenessScore();
    const trustworthiness = this.calculateTrustworthinessScore();
    
    const overall = (expertise + experience + authoritativeness + trustworthiness) / 4;
    
    return {
      expertise,
      experience,
      authoritativeness,
      trustworthiness,
      overall
    };
  }

  /**
   * Calculate expertise score
   */
  private calculateExpertiseScore(): number {
    let score = 0;
    
    // Technical terms and jargon
    const technicalTerms = this.extractTechnologies();
    score += Math.min(technicalTerms.length * 5, 30);
    
    // Professional language indicators
    const expertiseIndicators = [
      'research', 'study', 'analysis', 'methodology', 'framework', 'best practices',
      'expert', 'specialist', 'professional', 'certified', 'licensed', 'qualified'
    ];
    
    expertiseIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 2;
    });
    
    // Citations and references
    const citationPattern = /\[(\d+)\]|\(\d{4}\)|et al\.|according to|research shows/i;
    const citations = (this.content.match(citationPattern) || []).length;
    score += Math.min(citations * 3, 20);
    
    return Math.min(score, 100);
  }

  /**
   * Calculate experience score
   */
  private calculateExperienceScore(): number {
    let score = 0;
    
    // First-person indicators
    const experienceIndicators = [
      'i have', 'i worked', 'i experienced', 'in my experience', 'i found',
      'we developed', 'we implemented', 'our team', 'our company'
    ];
    
    experienceIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 5;
    });
    
    // Case studies and examples
    const caseStudyIndicators = [
      'case study', 'example', 'for instance', 'specifically', 'in practice',
      'real-world', 'actual', 'concrete', 'practical'
    ];
    
    caseStudyIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 3;
    });
    
    // Time-based indicators
    const timeIndicators = [
      'years of experience', 'over the years', 'since', 'for the past',
      'long-term', 'established', 'proven track record'
    ];
    
    timeIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 4;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Calculate authoritativeness score
   */
  private calculateAuthoritativenessScore(): number {
    let score = 0;
    
    // External links and references
    const linkPattern = /https?:\/\/[^\s]+/g;
    const externalLinks = (this.content.match(linkPattern) || []).length;
    score += Math.min(externalLinks * 5, 25);
    
    // Authority indicators
    const authorityIndicators = [
      'according to', 'research shows', 'studies indicate', 'experts say',
      'industry leader', 'recognized', 'award-winning', 'certified'
    ];
    
    authorityIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 3;
    });
    
    // Author credentials
    const credentialIndicators = [
      'phd', 'md', 'professor', 'doctor', 'expert', 'specialist',
      'certified', 'licensed', 'qualified', 'authority'
    ];
    
    credentialIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 2;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Calculate trustworthiness score
   */
  private calculateTrustworthinessScore(): number {
    let score = 0;
    
    // Contact information
    const contactPattern = /contact|email|phone|address|location/i;
    if (contactPattern.test(this.content)) score += 15;
    
    // Privacy and security indicators
    const trustIndicators = [
      'privacy policy', 'terms of service', 'secure', 'encrypted',
      'ssl', 'gdpr', 'compliant', 'certified', 'verified'
    ];
    
    trustIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 5;
    });
    
    // Transparency indicators
    const transparencyIndicators = [
      'about us', 'our mission', 'company info', 'team', 'leadership',
      'transparent', 'honest', 'open', 'clear'
    ];
    
    transparencyIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 3;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Analyze query fan-out opportunities
   */
  private analyzeQueryFanOut(): QueryFanOutAnalysis {
    const primaryTopics = this.identifyPrimaryTopics();
    const relatedQueries = this.generateRelatedQueries();
    const contentGaps = this.identifyContentGaps();
    const expansionOpportunities = this.identifyExpansionOpportunities();
    const semanticClusters = this.buildSemanticClusters();

    return {
      primary_topics: primaryTopics,
      related_queries: relatedQueries,
      content_gaps: contentGaps,
      expansion_opportunities: expansionOpportunities,
      semantic_clusters: semanticClusters
    };
  }

  /**
   * Identify primary topics from content
   */
  private identifyPrimaryTopics(): string[] {
    const topics: string[] = [];
    const sentences = this.content.split(/[.!?]+/);
    
    const topicIndicators = [
      'about', 'regarding', 'concerning', 'discussing', 'exploring',
      'focusing on', 'centered around', 'revolves around', 'main topic',
      'primary focus', 'key subject', 'core theme'
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
   * Generate related queries based on content analysis
   */
  private generateRelatedQueries(): string[] {
    const queries: string[] = [];
    const topics = this.identifyPrimaryTopics();
    
    topics.forEach(topic => {
      queries.push(`what is ${topic}`);
      queries.push(`how to ${topic}`);
      queries.push(`${topic} guide`);
      queries.push(`${topic} tips`);
      queries.push(`${topic} best practices`);
    });

    return [...new Set(queries)].slice(0, 20);
  }

  /**
   * Identify content gaps
   */
  private identifyContentGaps(): string[] {
    const gaps: string[] = [];
    const headings = this.headings.map(h => h.text.toLowerCase());
    
    const commonGaps = [
      'faq', 'frequently asked questions', 'troubleshooting', 'support',
      'contact', 'about us', 'privacy policy', 'terms of service',
      'case studies', 'testimonials', 'reviews', 'pricing'
    ];

    commonGaps.forEach(gap => {
      if (!headings.some(heading => heading.includes(gap))) {
        gaps.push(gap);
      }
    });

    return gaps;
  }

  /**
   * Identify expansion opportunities
   */
  private identifyExpansionOpportunities(): string[] {
    const opportunities: string[] = [];
    const entities = this.extractEntities();
    
    // Expand on people mentioned
    entities.people.forEach(person => {
      opportunities.push(`${person} biography`);
      opportunities.push(`${person} achievements`);
    });
    
    // Expand on organizations
    entities.organizations.forEach(org => {
      opportunities.push(`${org} services`);
      opportunities.push(`${org} reviews`);
    });
    
    // Expand on technologies
    entities.technologies.forEach(tech => {
      opportunities.push(`${tech} tutorial`);
      opportunities.push(`${tech} alternatives`);
    });

    return [...new Set(opportunities)].slice(0, 15);
  }

  /**
   * Build semantic clusters
   */
  private buildSemanticClusters(): Array<{
    topic: string;
    related_keywords: string[];
    strength: number;
  }> {
    const clusters: Array<{
      topic: string;
      related_keywords: string[];
      strength: number;
    }> = [];
    
    const topics = this.identifyPrimaryTopics();
    
    topics.forEach(topic => {
      const relatedKeywords = this.findRelatedKeywords(topic);
      const strength = this.calculateClusterStrength(topic, relatedKeywords);
      
      clusters.push({
        topic,
        related_keywords: relatedKeywords,
        strength
      });
    });

    return clusters.sort((a, b) => b.strength - a.strength).slice(0, 5);
  }

  /**
   * Find keywords related to a topic
   */
  private findRelatedKeywords(topic: string): string[] {
    const allKeywords = this.getAllKeywords();
    const relatedKeywords: string[] = [];
    
    allKeywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(topic.toLowerCase()) || 
          topic.toLowerCase().includes(keyword.toLowerCase())) {
        relatedKeywords.push(keyword);
      }
    });

    return relatedKeywords.slice(0, 10);
  }

  /**
   * Calculate cluster strength
   */
  private calculateClusterStrength(topic: string, keywords: string[]): number {
    const topicFrequency = (this.content.match(new RegExp(topic, 'gi')) || []).length;
    const keywordFrequency = keywords.reduce((sum, kw) => {
      return sum + (this.content.match(new RegExp(kw, 'gi')) || []).length;
    }, 0);
    
    return topicFrequency + keywordFrequency;
  }

  /**
   * Calculate content quality score
   */
  private calculateContentQualityScore(): number {
    let score = 0;
    
    // Length bonus
    const wordCount = this.content.split(/\s+/).length;
    score += Math.min(wordCount / 100, 30); // Max 30 points for length
    
    // Structure bonus
    const headingCount = this.headings.length;
    score += Math.min(headingCount * 2, 20); // Max 20 points for structure
    
    // Readability bonus
    const readability = this.calculateReadabilityScore();
    score += readability * 0.3; // Max 30 points for readability
    
    // Entity diversity bonus
    const entities = this.extractEntities();
    const entityCount = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
    score += Math.min(entityCount * 0.5, 20); // Max 20 points for entity diversity
    
    return Math.min(score, 100);
  }

  /**
   * Calculate topical authority score
   */
  private calculateTopicalAuthorityScore(): number {
    let score = 0;
    
    // Keyword density and relevance
    const primaryKeywords = this.urlKeywords.concat(this.metaKeywords);
    primaryKeywords.forEach(keyword => {
      const frequency = (this.content.match(new RegExp(keyword, 'gi')) || []).length;
      score += Math.min(frequency * 2, 10);
    });
    
    // Semantic relationship strength
    const relationships = this.mapSemanticRelationships();
    const avgCoOccurrence = relationships.reduce((sum, rel) => sum + rel.co_occurrence_score, 0) / relationships.length;
    score += avgCoOccurrence * 30;
    
    // Content depth indicators
    const depthIndicators = [
      'detailed', 'comprehensive', 'in-depth', 'thorough', 'complete',
      'advanced', 'expert', 'professional', 'technical'
    ];
    
    depthIndicators.forEach(indicator => {
      if (this.content.includes(indicator)) score += 2;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Analyze user intent signals
   */
  private analyzeUserIntentSignals(): {
    informational: number;
    navigational: number;
    transactional: number;
    commercial: number;
  } {
    const informational = this.calculateInformationalIntent();
    const navigational = this.calculateNavigationalIntent();
    const transactional = this.calculateTransactionalIntent();
    const commercial = this.calculateCommercialIntent();

    return {
      informational,
      navigational,
      transactional,
      commercial
    };
  }

  /**
   * Calculate informational intent score
   */
  private calculateInformationalIntent(): number {
    const indicators = [
      'what is', 'how to', 'guide', 'tutorial', 'explain', 'definition',
      'learn', 'understand', 'information', 'facts', 'research'
    ];
    
    let score = 0;
    indicators.forEach(indicator => {
      const matches = (this.content.match(new RegExp(indicator, 'gi')) || []).length;
      score += matches * 5;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Calculate navigational intent score
   */
  private calculateNavigationalIntent(): number {
    const indicators = [
      'login', 'sign in', 'account', 'profile', 'dashboard', 'portal',
      'home', 'main', 'navigation', 'menu', 'contact'
    ];
    
    let score = 0;
    indicators.forEach(indicator => {
      const matches = (this.content.match(new RegExp(indicator, 'gi')) || []).length;
      score += matches * 5;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Calculate transactional intent score
   */
  private calculateTransactionalIntent(): number {
    const indicators = [
      'buy', 'purchase', 'order', 'download', 'subscribe', 'register',
      'sign up', 'get started', 'try', 'free trial', 'pricing'
    ];
    
    let score = 0;
    indicators.forEach(indicator => {
      const matches = (this.content.match(new RegExp(indicator, 'gi')) || []).length;
      score += matches * 5;
    });
    
    return Math.min(score, 100);
  }

  /**
   * Calculate commercial intent score
   */
  private calculateCommercialIntent(): number {
    const indicators = [
      'compare', 'review', 'best', 'top', 'recommend', 'alternative',
      'vs', 'versus', 'pros and cons', 'features', 'benefits'
    ];
    
    let score = 0;
    indicators.forEach(indicator => {
      const matches = (this.content.match(new RegExp(indicator, 'gi')) || []).length;
      score += matches * 5;
    });
    
    return Math.min(score, 100);
  }

  // Helper methods from original semantic analyzer
  private getAllKeywords(): string[] {
    const allKeywords = new Set<string>();
    
    this.urlKeywords.forEach(keyword => allKeywords.add(keyword));
    this.metaKeywords.forEach(keyword => allKeywords.add(keyword));
    
    this.headings.forEach(heading => {
      heading.keywords.forEach(keyword => allKeywords.add(keyword));
    });

    return Array.from(allKeywords);
  }

  private calculateCoOccurrenceScore(keyword: string): number {
    const sentences = this.content.split(/[.!?]+/);
    let coOccurrenceCount = 0;
    
    sentences.forEach(sentence => {
      if (sentence.includes(keyword)) {
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

  private getContextSentences(keyword: string): string[] {
    const sentences = this.content.split(/[.!?]+/);
    const contextSentences: string[] = [];
    
    sentences.forEach(sentence => {
      if (sentence.includes(keyword) && sentence.trim().length > 10) {
        contextSentences.push(sentence.trim());
      }
    });

    return contextSentences.slice(0, 3);
  }

  private determineRelationshipType(keyword: string): SemanticRelationship['relationship_type'] {
    if (this.urlKeywords.includes(keyword)) return 'related_topic';
    if (this.metaKeywords.includes(keyword)) return 'attribute';
    
    const synonyms = this.findSynonyms(keyword);
    if (synonyms.length > 0) return 'synonym';
    
    return 'related_topic';
  }

  private isRelatedToPrimary(keyword: string): boolean {
    return this.urlKeywords.includes(keyword) || this.metaKeywords.includes(keyword);
  }

  private findSynonyms(keyword: string): string[] {
    const synonymMap: Record<string, string[]> = {
      'car': ['automobile', 'vehicle', 'auto'],
      'phone': ['mobile', 'cellphone', 'smartphone'],
      'computer': ['pc', 'laptop', 'desktop'],
      'website': ['site', 'webpage', 'web page']
    };

    return synonymMap[keyword.toLowerCase()] || [];
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;
    
    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length === 0) return;
      
      const vowelGroups = word.match(/[aeiouy]+/g);
      syllables += vowelGroups ? vowelGroups.length : 1;
      
      if (word.endsWith('e')) syllables--;
      
      syllables = Math.max(1, syllables);
    });
    
    return syllables;
  }

  private identifyContentTopics(): string[] {
    const topics: string[] = [];
    const sentences = this.content.split(/[.!?]+/);
    
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
   * Analyze core topic and related entities
   */
  private analyzeCoreTopic(): CoreTopicAnalysis {
    const mainTopic = this.identifyMainTopic();
    const inferredEntities = this.extractEntities();
    const coOccurringTerms = this.findCoOccurringTerms(mainTopic);

    return {
      main_topic: {
        topic: mainTopic,
        confidence_score: this.calculateTopicConfidence(mainTopic),
        reasoning: this.generateTopicReasoning(mainTopic)
      },
      inferred_entities: {
        people: inferredEntities.people,
        organizations: inferredEntities.organizations,
        locations: inferredEntities.locations,
        products: inferredEntities.products,
        technologies: inferredEntities.technologies
      },
      co_occurring_terms: coOccurringTerms
    };
  }

  /**
   * Identify the main topic of the content
   */
  private identifyMainTopic(): string {
    const words = this.content.split(/\s+/)
      .filter(word => word.length > 4 && !this.isStopWord(word))
      .map(word => word.toLowerCase());

    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    // Find the most frequent meaningful word
    let maxFreq = 0;
    let mainTopic = '';
    
    wordFreq.forEach((freq, word) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mainTopic = word;
      }
    });

    return mainTopic || 'general topic';
  }

  /**
   * Find terms that co-occur with the main topic
   */
  private findCoOccurringTerms(mainTopic: string): string[] {
    const sentences = this.content.split(/[.!?]+/);
    const coOccurringTerms = new Set<string>();

    sentences.forEach(sentence => {
      if (sentence.includes(mainTopic)) {
        const words = sentence.split(/\s+/)
          .filter(word => word.length > 3 && !this.isStopWord(word) && word !== mainTopic)
          .map(word => word.toLowerCase());
        
        words.forEach(word => coOccurringTerms.add(word));
      }
    });

    return Array.from(coOccurringTerms).slice(0, 10);
  }

  /**
   * Calculate confidence score for the main topic
   */
  private calculateTopicConfidence(topic: string): number {
    const topicOccurrences = (this.content.match(new RegExp(topic, 'g')) || []).length;
    const totalWords = this.content.split(/\s+/).length;
    const frequency = topicOccurrences / totalWords;
    
    return Math.min(1, frequency * 100);
  }

  /**
   * Generate reasoning for the main topic identification
   */
  private generateTopicReasoning(topic: string): string {
    const frequency = (this.content.match(new RegExp(topic, 'g')) || []).length;
    return `Identified "${topic}" as the main topic based on ${frequency} occurrences throughout the content and its semantic prominence in key sections.`;
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
      'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ]);
    return stopWords.has(word);
  }
}
