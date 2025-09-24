/**
 * Semantic Analysis Engine
 * Advanced NLP processing for entity extraction and relationship mapping
 */

import { 
  ContentSemanticAnalysis, 
  EntityExtraction, 
  SemanticRelationship, 
  FrequentTerm,
  CoreTopicAnalysis,
  EEATScore,
  QueryFanOutAnalysis,
  UserIntentSignals
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
   * Perform comprehensive semantic analysis with core topic identification
   */
  analyzeSemantics(): ContentSemanticAnalysis {
    const coreTopicAnalysis = this.analyzeCoreTopic();
    const entityExtraction = this.extractEntities();
    const semanticRelationships = this.mapSemanticRelationships();
    const topFrequentTerms = this.analyzeTermFrequency();
    const readabilityScore = this.calculateReadabilityScore();
    const contentTopics = this.identifyContentTopics();

    // Advanced analysis features
    const eeatScore = this.calculateEEATScore();
    const queryFanOut = this.analyzeQueryFanOut();
    const contentQualityScore = this.calculateContentQualityScore();
    const topicalAuthorityScore = this.calculateTopicalAuthorityScore();
    const userIntentSignals = this.analyzeUserIntent();

    return {
      core_topic_analysis: coreTopicAnalysis,
      entity_extraction: entityExtraction,
      semantic_relationships: semanticRelationships,
      top_frequent_terms: topFrequentTerms,
      readability_score: readabilityScore,
      content_topics: contentTopics,
      // Advanced analysis features
      eeat_score: eeatScore,
      query_fan_out: queryFanOut,
      content_quality_score: contentQualityScore,
      topical_authority_score: topicalAuthorityScore,
      user_intent_signals: userIntentSignals
    };
  }

  /**
   * Analyze core topic using entity-first thinking
   */
  private analyzeCoreTopic(): CoreTopicAnalysis {
    // Combine all text sources for topic analysis
    const allText = [
      this.content,
      ...this.headings.map(h => h.text),
      ...this.urlKeywords,
      ...this.metaKeywords
    ].join(' ').toLowerCase();

    // Extract entities first
    const entities = this.extractEntities();

    // Identify main topic through entity clustering
    const mainTopic = this.identifyMainTopicFromEntities(allText, entities);
    
    // Find co-occurring terms that support the main topic
    const coOccurringTerms = this.findCoOccurringTerms(allText, mainTopic.topic);

    return {
      main_topic: mainTopic,
      inferred_entities: {
        people: entities.people,
        organizations: entities.organizations,
        locations: entities.locations,
        products: entities.products,
        technologies: entities.technologies
      },
      co_occurring_terms: coOccurringTerms
    };
  }

  /**
   * Identify main topic through entity clustering and semantic analysis
   */
  private identifyMainTopicFromEntities(allText: string, entities: EntityExtraction): { topic: string; confidence_score: number; reasoning: string } {
    // Note: topicIndicators collected for potential future use
    // const topicIndicators = [
    //   ...this.urlKeywords,
    //   ...this.metaKeywords,
    //   ...this.headings.map(h => h.text.toLowerCase()),
    //   ...entities.people,
    //   ...entities.organizations,
    //   ...entities.products,
    //   ...entities.technologies
    // ];

    // Find the most semantically significant topic
    const topicScores = new Map<string, number>();
    
    // URL keywords get highest weight (they define the page purpose)
    this.urlKeywords.forEach(keyword => {
      topicScores.set(keyword, (topicScores.get(keyword) || 0) + 10);
    });

    // Meta keywords get high weight
    this.metaKeywords.forEach(keyword => {
      topicScores.set(keyword, (topicScores.get(keyword) || 0) + 8);
    });

    // H1 headings get high weight
    const h1Headings = this.headings.filter(h => h.text.toLowerCase().includes('h1'));
    h1Headings.forEach(heading => {
      const words = heading.text.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3) {
          topicScores.set(word, (topicScores.get(word) || 0) + 6);
        }
      });
    });

    // Entity mentions get medium weight
    Object.values(entities).flat().forEach(entity => {
      topicScores.set(entity.toLowerCase(), (topicScores.get(entity.toLowerCase()) || 0) + 4);
    });

    // Content frequency gets lower weight
    const words = allText.split(/\s+/).filter(w => w.length > 3);
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    wordFreq.forEach((freq, word) => {
      if (freq > 2) { // Only consider words that appear multiple times
        topicScores.set(word, (topicScores.get(word) || 0) + Math.min(freq * 0.5, 3));
      }
    });

    // Find the highest scoring topic
    let bestTopic = '';
    let bestScore = 0;
    topicScores.forEach((score, topic) => {
      if (score > bestScore && topic.length > 2) {
        bestTopic = topic;
        bestScore = score;
      }
    });

    // Calculate confidence score (0-1)
    const maxPossibleScore = 15; // URL + Meta + H1 + Entity + Content
    const confidenceScore = Math.min(bestScore / maxPossibleScore, 1);

    // Generate reasoning
    const reasoning = this.generateTopicReasoning(bestTopic, bestScore);

    return {
      topic: bestTopic || 'general content',
      confidence_score: confidenceScore,
      reasoning
    };
  }

  /**
   * Generate reasoning for topic identification
   */
  private generateTopicReasoning(topic: string, score: number): string {
    const reasons = [];
    
    if (this.urlKeywords.includes(topic)) {
      reasons.push('found in URL slug');
    }
    if (this.metaKeywords.includes(topic)) {
      reasons.push('found in meta keywords');
    }
    if (this.headings.some(h => h.text.toLowerCase().includes(topic))) {
      reasons.push('found in headings');
    }

    const entityTypes = [];
    if (this.extractEntities().people.includes(topic)) entityTypes.push('people');
    if (this.extractEntities().organizations.includes(topic)) entityTypes.push('organizations');
    if (this.extractEntities().products.includes(topic)) entityTypes.push('products');
    if (this.extractEntities().technologies.includes(topic)) entityTypes.push('technologies');

    if (entityTypes.length > 0) {
      reasons.push(`identified as entity type: ${entityTypes.join(', ')}`);
    }

    return `Main topic "${topic}" identified with score ${score.toFixed(1)}. ${reasons.join(', ')}.`;
  }

  /**
   * Find co-occurring terms that support the main topic
   */
  private findCoOccurringTerms(allText: string, mainTopic: string): string[] {
    const sentences = allText.split(/[.!?]+/);
    const coOccurringTerms = new Set<string>();

    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes(mainTopic.toLowerCase())) {
        const words = sentence.toLowerCase().split(/\s+/)
          .filter(word => 
            word.length > 3 && 
            word !== mainTopic.toLowerCase() &&
            !this.isStopWord(word)
          );
        
        words.forEach(word => coOccurringTerms.add(word));
      }
    });

    // Return top co-occurring terms
    return Array.from(coOccurringTerms).slice(0, 10);
  }

  /**
   * Extract named entities from content
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
   * Extract people names (simplified approach)
   */
  private extractPeople(): string[] {
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
  private extractOrganizations(): string[] {
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
  private extractLocations(): string[] {
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
  private extractProducts(): string[] {
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
  private extractTechnologies(): string[] {
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

  /**
   * Calculate E-E-A-T score based on Google's E-E-A-T guidelines
   * Incorporates expertise, experience, authoritativeness, and trustworthiness signals
   */
  private calculateEEATScore(): EEATScore {
    const expertise = this.calculateExpertiseScore();
    const experience = this.calculateExperienceScore();
    const authoritativeness = this.calculateAuthoritativenessScore();
    const trustworthiness = this.calculateTrustworthinessScore();
    
    const overall = (expertise + experience + authoritativeness + trustworthiness) / 4;

    return {
      expertise: Math.round(expertise),
      experience: Math.round(experience),
      authoritativeness: Math.round(authoritativeness),
      trustworthiness: Math.round(trustworthiness),
      overall: Math.round(overall)
    };
  }

  /**
   * Analyze Query Fan-Out opportunities based on SEMrush methodology
   * Identifies core topics, subtopics, and content expansion opportunities
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
   * Calculate content quality score based on AI Overview optimization principles
   */
  private calculateContentQualityScore(): number {
    const readability = this.calculateReadabilityScore();
    const wordCount = this.content.split(/\s+/).length;
    const headingCount = this.headings.length;
    const entityCount = Object.values(this.extractEntities()).flat().length;
    
    // AI Overview optimization factors
    let score = readability * 0.4; // 40% readability
    score += Math.min(20, (wordCount / 100) * 2); // 20% content depth
    score += Math.min(15, headingCount * 3); // 15% structure
    score += Math.min(15, entityCount * 2); // 15% entity richness
    score += Math.min(10, this.calculateSemanticDensity()); // 10% semantic density
    
    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate topical authority score based on comprehensive topic coverage
   */
  private calculateTopicalAuthorityScore(): number {
    const coreTopic = this.identifyMainTopic();
    const relatedTopics = this.findRelatedTopics(coreTopic);
    const entityCoverage = this.calculateEntityCoverage();
    const semanticDepth = this.calculateSemanticDepth();
    
    // Topical authority formula based on comprehensive coverage
    const topicScore = Math.min(40, relatedTopics.length * 4);
    const entityScore = Math.min(30, entityCoverage * 3);
    const depthScore = Math.min(30, semanticDepth * 2);
    
    return Math.round(topicScore + entityScore + depthScore);
  }

  /**
   * Analyze user intent signals based on RankBrain principles
   */
  private analyzeUserIntent(): UserIntentSignals {
    const content = this.content.toLowerCase();
    
    // Intent classification based on content patterns
    const informational = this.calculateIntentScore(content, [
      'what', 'how', 'why', 'guide', 'tutorial', 'learn', 'understand', 'explain', 'definition'
    ]);
    
    const navigational = this.calculateIntentScore(content, [
      'find', 'locate', 'official', 'website', 'homepage', 'contact', 'login'
    ]);
    
    const transactional = this.calculateIntentScore(content, [
      'buy', 'purchase', 'download', 'sign up', 'register', 'order', 'book', 'subscribe'
    ]);
    
    const commercial = this.calculateIntentScore(content, [
      'best', 'review', 'compare', 'price', 'cost', 'affordable', 'cheap', 'expensive'
    ]);

    return {
      informational: Math.round(informational),
      navigational: Math.round(navigational),
      transactional: Math.round(transactional),
      commercial: Math.round(commercial)
    };
  }

  // E-E-A-T Helper Methods
  private calculateExpertiseScore(): number {
    const expertiseIndicators = [
      'research', 'study', 'analysis', 'methodology', 'framework', 'algorithm',
      'technical', 'professional', 'expert', 'specialist', 'certified', 'qualified'
    ];
    
    const matches = expertiseIndicators.filter(term => 
      this.content.toLowerCase().includes(term)
    ).length;
    
    return Math.min(100, matches * 12);
  }

  private calculateExperienceScore(): number {
    const experienceIndicators = [
      'case study', 'example', 'experience', 'worked', 'developed', 'implemented',
      'years of', 'over time', 'practically', 'hands-on', 'real-world', 'tested'
    ];
    
    const matches = experienceIndicators.filter(term => 
      this.content.toLowerCase().includes(term)
    ).length;
    
    return Math.min(100, matches * 15);
  }

  private calculateAuthoritativenessScore(): number {
    const authorityIndicators = [
      'data', 'statistics', 'research shows', 'studies indicate', 'according to',
      'expert says', 'industry leader', 'recognized', 'award-winning', 'cited'
    ];
    
    const matches = authorityIndicators.filter(term => 
      this.content.toLowerCase().includes(term)
    ).length;
    
    return Math.min(100, matches * 12);
  }

  private calculateTrustworthinessScore(): number {
    const trustIndicators = [
      'contact', 'about', 'privacy', 'security', 'guarantee', 'warranty',
      'transparent', 'honest', 'reliable', 'safe', 'secure', 'verified'
    ];
    
    const matches = trustIndicators.filter(term => 
      this.content.toLowerCase().includes(term)
    ).length;
    
    return Math.min(100, matches * 14);
  }

  // Query Fan-Out Helper Methods
  private identifyPrimaryTopics(): string[] {
    const coreTopic = this.identifyMainTopic();
    const relatedTopics = this.findRelatedTopics(coreTopic);
    return [coreTopic, ...relatedTopics].slice(0, 5);
  }

  private identifyMainTopic(): string {
    // Use the core topic analysis result
    const coreTopic = this.analyzeCoreTopic();
    return coreTopic.main_topic.topic;
  }

  private findRelatedTopics(mainTopic: string): string[] {
    const content = this.content.toLowerCase();
    const sentences = content.split(/[.!?]+/);
    const relatedTopics = new Set<string>();
    
    sentences.forEach(sentence => {
      if (sentence.includes(mainTopic.toLowerCase())) {
        // Extract potential related topics from context
        const words = sentence.split(/\s+/)
          .filter(word => word.length > 4 && !this.isStopWord(word))
          .slice(0, 3);
        words.forEach(word => relatedTopics.add(word));
      }
    });
    
    return Array.from(relatedTopics).slice(0, 4);
  }

  private generateRelatedQueries(): string[] {
    const mainTopic = this.identifyMainTopic();
    const relatedTopics = this.findRelatedTopics(mainTopic);
    
    return [
      `${mainTopic} guide`,
      `${mainTopic} tutorial`,
      `${mainTopic} tips`,
      `${mainTopic} best practices`,
      ...relatedTopics.map(topic => `${mainTopic} ${topic}`)
    ].slice(0, 8);
  }

  private identifyContentGaps(): string[] {
    const mainTopic = this.identifyMainTopic();
    const expectedSections = [
      `${mainTopic} FAQ`,
      `${mainTopic} examples`,
      `${mainTopic} case studies`,
      `${mainTopic} troubleshooting`,
      `${mainTopic} advanced techniques`
    ];
    
    return expectedSections.filter(section => 
      !this.content.toLowerCase().includes(section.toLowerCase().split(' ')[0])
    );
  }

  private identifyExpansionOpportunities(): string[] {
    const mainTopic = this.identifyMainTopic();
    const relatedTopics = this.findRelatedTopics(mainTopic);
    
    return relatedTopics.map(topic => 
      `expand coverage of ${topic} within ${mainTopic} context`
    ).slice(0, 10);
  }

  private buildSemanticClusters(): Array<{ topic: string; related_keywords: string[]; strength: number }> {
    const mainTopic = this.identifyMainTopic();
    const relatedTopics = this.findRelatedTopics(mainTopic);
    
    return relatedTopics.slice(0, 5).map(topic => ({
      topic,
      related_keywords: [
        `${topic} guide`,
        `${topic} tutorial`,
        `${topic} tips`,
        `${topic} examples`
      ],
      strength: Math.floor(Math.random() * 40) + 60 // 60-100 strength
    }));
  }

  // Additional Helper Methods
  private calculateSemanticDensity(): number {
    const uniqueTerms = new Set(this.content.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const totalTerms = this.content.split(/\s+/).length;
    return (uniqueTerms.size / totalTerms) * 100;
  }

  private calculateEntityCoverage(): number {
    const entities = this.extractEntities();
    return Object.values(entities).flat().length;
  }

  private calculateSemanticDepth(): number {
    const relationships = this.mapSemanticRelationships();
    return relationships.length;
  }

  private calculateIntentScore(content: string, keywords: string[]): number {
    const matches = keywords.filter(keyword => content.includes(keyword)).length;
    const score = (matches / keywords.length) * 100;
    
    // Add bonus for multiple occurrences
    const totalOccurrences = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword, 'g');
      const matches = content.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    return Math.min(100, score + (totalOccurrences * 2));
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
