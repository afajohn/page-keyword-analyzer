/**
 * BERT-Aware Keyword Optimization Engine
 * Advanced keyword analysis based on BERT principles, search volume potential, and modern SEO algorithms
 * Aligned with Google's AEO, GEO, AI Overview, and AI Mode principles (September 2025)
 */

import { 
  SEOAnalysisResult, 
  OptimizedKeywordRecommendation, 
  MetaDescriptionOptimization,
  BERTContextAnalysis,
  SearchVolumePotential
} from '@/types/seo-analysis';

export class BERTKeywordOptimizer {
  private analysisData: SEOAnalysisResult;
  private content: string;
  private title: string;
  private metaDescription: string;
  // Selection thresholds tuned for AI Overview + SEO relevance
  private MIN_CONTEXTUAL_RELEVANCE = 0.65; // 65%+
  private MIN_ESTIMATED_SEARCHES = 2000;   // US SV minimum (requested)

  // Words that are meaningful inside phrases but should NOT appear alone as primary keywords
  private bertImportantWords = new Set([
    'how', 'what', 'why', 'when', 'where', 'which', 'who', 'can', 'will', 'should',
    'best', 'top', 'guide', 'tutorial', 'review', 'comparison', 'vs', 'versus',
    'free', 'premium', 'pro', 'advanced', 'beginner', 'expert', 'professional'
  ]);

  // High-value semantic connectors
  private semanticConnectors = new Set([
    'for', 'with', 'without', 'in', 'on', 'at', 'by', 'from', 'to', 'of', 'about',
    'and', 'or', 'but', 'so', 'because', 'if', 'when', 'where', 'while', 'since'
  ]);

  // Strong filter for single common/generic words that should never surface alone
  private genericSingleWordBlocklist = new Set([
    'before','after','into','scene','know','these','those','thing','things','stuff','good','bad',
    'great','new','best','top','guide','review','with','without','about','for','and','or','but',
    'philippine','women','dating' // avoid ultra-generic single tokens; we prefer phrases like "filipina dating"
  ]);

  constructor(analysisData: SEOAnalysisResult) {
    this.analysisData = analysisData;
    this.content = this.extractMainContent();
    this.title = analysisData.page_metadata.title_tag;
    this.metaDescription = analysisData.page_metadata.meta_description;
  }

  /**
   * Generate optimized keyword recommendations with BERT-aware analysis
   */
  async generateOptimizedKeywords(): Promise<OptimizedKeywordRecommendation[]> {
    const recommendations: OptimizedKeywordRecommendation[] = [];

    // 1. Analyze existing content for BERT context
    const bertAnalysis = this.analyzeBERTContext();
    
    // 2. Extract potential keywords with high search volume potential
    const potentialKeywords = this.extractHighVolumeKeywords();
    
    // 3. Analyze each keyword with BERT principles
    for (const keyword of potentialKeywords) {
      const recommendation = await this.analyzeKeywordWithBERT(keyword, bertAnalysis);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    // 4. Sort by combined BERT score and search volume potential
    return recommendations.sort((a, b) => {
      const scoreA = this.calculateOverallScore(a);
      const scoreB = this.calculateOverallScore(b);
      return scoreB - scoreA;
    }).slice(0, 15); // Top 15 recommendations
  }

  /**
   * Generate optimized meta description with AEO/GEO/AI Overview principles
   */
  async generateOptimizedMetaDescription(): Promise<MetaDescriptionOptimization> {
    const currentDesc = this.metaDescription;
    const bertAnalysis = this.analyzeBERTContext();
    
    // Extract key entities and topics
    const keyEntities = this.extractKeyEntities();
    const primaryIntent = this.analyzeSearchIntent();
    
    // Generate optimized description
    const optimizedDesc = await this.createOptimizedDescription(
      currentDesc, 
      keyEntities, 
      primaryIntent,
      bertAnalysis
    );

    // Analyze optimization aspects
    const aeoOptimization = this.analyzeAEOOptimization(optimizedDesc);
    const geoOptimization = this.analyzeGEOOptimization(optimizedDesc);
    const aiOverviewOptimization = this.analyzeAIOverviewOptimization(optimizedDesc);

    const optimizationScore = this.calculateMetaDescriptionScore(
      aeoOptimization,
      geoOptimization,
      aiOverviewOptimization
    );

    return {
      current_description: currentDesc,
      optimized_description: optimizedDesc,
      optimization_score: optimizationScore,
      aeo_optimization: aeoOptimization,
      geo_optimization: geoOptimization,
      ai_overview_optimization: aiOverviewOptimization,
      reasoning: this.generateMetaDescriptionReasoning(
        optimizedDesc,
        aeoOptimization,
        geoOptimization,
        aiOverviewOptimization
      ),
      improvements: this.generateMetaDescriptionImprovements(
        currentDesc,
        optimizedDesc,
        optimizationScore
      )
    };
  }

  /**
   * Analyze content with BERT principles
   */
  private analyzeBERTContext(): BERTContextAnalysis {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Calculate bidirectional coherence
    const bidirectionalCoherence = this.calculateBidirectionalCoherence(sentences);
    
    // Calculate contextual relevance
    const contextualRelevance = this.calculateContextualRelevance(sentences);
    
    // Calculate natural language score
    const naturalLanguageScore = this.calculateNaturalLanguageScore();
    
    // Calculate preposition importance (key BERT insight)
    const prepositionImportance = this.calculatePrepositionImportance();
    
    // Calculate semantic density
    const semanticDensity = this.calculateSemanticDensity();

    return {
      bidirectional_coherence: bidirectionalCoherence,
      contextual_relevance: contextualRelevance,
      natural_language_score: naturalLanguageScore,
      preposition_importance: prepositionImportance,
      semantic_density: semanticDensity
    };
  }

  /**
   * Extract keywords with high search volume potential
   */
  private extractHighVolumeKeywords(): string[] {
    const keywords = new Set<string>();
    
    // 1. Extract from title with BERT awareness
    const titleKeywords = this.extractBERTAwareKeywords(this.title);
    titleKeywords.forEach(kw => keywords.add(kw));
    
    // 2. Extract from headings
    this.analysisData.structured_on_page_data.headings_and_keywords.forEach(heading => {
      const headingKeywords = this.extractBERTAwareKeywords(heading.text);
      headingKeywords.forEach(kw => keywords.add(kw));
    });
    
    // 3. Extract from content with semantic analysis
    const contentKeywords = this.extractSemanticKeywords();
    contentKeywords.forEach(kw => keywords.add(kw));
    
    // 4. Generate long-tail variations
    const longTailKeywords = this.generateLongTailKeywords(Array.from(keywords));
    longTailKeywords.forEach(kw => keywords.add(kw));
    
    return Array.from(keywords).filter(kw => this.hasSearchVolumePotential(kw));
  }

  /**
   * Extract BERT-aware keywords from text
   */
  private extractBERTAwareKeywords(text: string): string[] {
    if (!text) return [];
    
    const keywords = new Set<string>();
    const words = text.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Extract only bigrams and trigrams with BERT awareness (no unigrams)
    for (let i = 0; i < words.length; i++) {
      // Two-word phrases (bigrams)
      if (i + 1 < words.length) {
        const bigram = `${words[i]} ${words[i + 1]}`;
        if (this.isValuableBigram(bigram)) {
          keywords.add(bigram);
        }
      }
      
      // Three-word phrases (trigrams)
      if (i + 2 < words.length) {
        const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        if (this.isValuableTrigram(trigram)) {
          keywords.add(trigram);
        }
      }
    }
    
    return Array.from(keywords);
  }

  /**
   * Check if a unigram has value for BERT analysis
   */
  private isValuableUnigram(_word: string): boolean {
    // We intentionally do not surface unigrams as standalone recommendations
    // They can still participate inside bigrams/trigrams
    return false;
  }

  /**
   * Check if a bigram has value
   */
  private isValuableBigram(bigram: string): boolean {
    const words = bigram.split(' ');
    const [first, second] = words;
    
    // Block generic phrases and ensure both tokens are substantive
    if (this.genericSingleWordBlocklist.has(first) || this.genericSingleWordBlocklist.has(second)) {
      return false;
    }

    // Include combinations with semantic connectors
    if (this.semanticConnectors.has(first) || this.semanticConnectors.has(second)) {
      return true;
    }
    
    // Include combinations with BERT-important words
    if (this.bertImportantWords.has(first) || this.bertImportantWords.has(second)) {
      return true;
    }
    
    // Include substantive word combinations
    return this.isSubstantiveWord(first) && this.isSubstantiveWord(second);
  }

  /**
   * Check if a trigram has value
   */
  private isValuableTrigram(trigram: string): boolean {
    const words = trigram.split(' ');
    
    // Long-tail keywords are valuable
    if (words.length === 3 && words.every(word => word.length > 2)) {
      // Avoid trigrams dominated by generic tokens
      if (words.some(w => this.genericSingleWordBlocklist.has(w))) return false;
      return words.every(w => !this.semanticConnectors.has(w));
    }
    
    // Include question patterns
    if (this.isQuestionPattern(words)) {
      return true;
    }
    
    // Include comparison patterns
    if (this.isComparisonPattern(words)) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if words form a question pattern
   */
  private isQuestionPattern(words: string[]): boolean {
    const questionWords = ['how', 'what', 'why', 'when', 'where', 'which', 'who'];
    return questionWords.includes(words[0]);
  }

  /**
   * Check if words form a comparison pattern
   */
  private isComparisonPattern(words: string[]): boolean {
    const comparisonWords = ['vs', 'versus', 'compared', 'comparison', 'best', 'top'];
    return words.some(word => comparisonWords.includes(word));
  }

  /**
   * Check if a word is substantive (noun, adjective, action word)
   */
  private isSubstantiveWord(word: string): boolean {
    // Simple heuristic - words that are likely substantive
    const commonSubstantivePatterns = [
      /ing$/, // gerunds
      /tion$/, // nouns ending in -tion
      /ness$/, // nouns ending in -ness
      /able$/, // adjectives ending in -able
      /ible$/, // adjectives ending in -ible
      /ful$/, // adjectives ending in -ful
    ];
    
    return commonSubstantivePatterns.some(pattern => pattern.test(word)) ||
           word.length >= 4; // Longer words are more likely to be substantive
  }

  /**
   * Analyze a keyword with BERT principles
   */
  private async analyzeKeywordWithBERT(
    keyword: string, 
    bertAnalysis: BERTContextAnalysis
  ): Promise<OptimizedKeywordRecommendation | null> {
    
    // Calculate search volume potential
    const searchVolume = this.estimateSearchVolume(keyword);
    
    // Calculate BERT context score
    const bertScore = this.calculateKeywordBERTScore(keyword, bertAnalysis);
    
    // Analyze current performance
    const currentPerformance = this.analyzeCurrentKeywordPerformance(keyword);
    
    // Generate optimization recommendations
    const optimizationRecommendations = this.generateKeywordOptimizationRecommendations(
      keyword, 
      currentPerformance
    );
    
    // Hard filters to enforce relevance & volume
    if (bertScore.contextual_relevance < this.MIN_CONTEXTUAL_RELEVANCE) return null;
    if (searchVolume.estimated_monthly_searches < this.MIN_ESTIMATED_SEARCHES) return null;

    // Calculate overall confidence
    const confidenceScore = this.calculateKeywordConfidence(
      keyword,
      searchVolume,
      bertScore,
      currentPerformance
    );
    
    if (confidenceScore < 0.3) return null; // Filter out low-confidence keywords
    
    return {
      keyword,
      keyword_type: this.classifyKeywordType(keyword),
      search_volume_potential: searchVolume,
      bert_context_score: bertScore,
      confidence_score: confidenceScore,
      reasoning: this.generateKeywordReasoning(keyword, searchVolume, bertScore, currentPerformance),
      current_performance: currentPerformance,
      optimization_recommendations: optimizationRecommendations
    };
  }

  /**
   * Estimate search volume potential (simplified heuristic)
   */
  private estimateSearchVolume(keyword: string): SearchVolumePotential {
    const wordCount = keyword.split(' ').length;
    const hasCommercialIntent = this.hasCommercialIntent(keyword);
    const hasQuestionIntent = this.hasQuestionIntent(keyword);
    // const entityAlignment = this.computeEntityAlignmentScore(keyword);
    
    let estimatedSearches = 1000; // Base estimate
    
    // Adjust based on keyword characteristics
    if (hasQuestionIntent) estimatedSearches *= 1.5;
    if (hasCommercialIntent) estimatedSearches *= 1.3;
    if (wordCount === 1) estimatedSearches *= 2; // Single words typically have higher volume
    if (wordCount === 2) estimatedSearches *= 1.5; // Two-word phrases
    if (wordCount >= 3) estimatedSearches *= 0.8; // Long-tail keywords
    
    // Determine competition level
    let competitionLevel: 'low' | 'medium' | 'high' = 'medium';
    if (hasCommercialIntent || wordCount === 1) competitionLevel = 'high';
    if (wordCount >= 4) competitionLevel = 'low';
    
    return {
      estimated_monthly_searches: Math.round(estimatedSearches),
      competition_level: competitionLevel,
      search_trend: 'stable', // Default assumption
      seasonal_pattern: this.hasSeasonalPattern(keyword)
    };
  }

  /**
   * Calculate BERT context score for a keyword
   */
  private calculateKeywordBERTScore(keyword: string, bertAnalysis: BERTContextAnalysis): BERTContextAnalysis {
    const keywordFrequency = this.countKeywordFrequency(keyword);
    const contextualRelevance = this.calculateKeywordContextualRelevance(keyword);
    
    return {
      bidirectional_coherence: Math.min(1.0, bertAnalysis.bidirectional_coherence + (keywordFrequency * 0.1)),
      contextual_relevance: contextualRelevance,
      natural_language_score: bertAnalysis.natural_language_score,
      preposition_importance: this.calculateKeywordPrepositionImportance(keyword),
      semantic_density: Math.min(1.0, bertAnalysis.semantic_density + (keywordFrequency * 0.05))
    };
  }

  /**
   * Analyze current keyword performance
   */
  private analyzeCurrentKeywordPerformance(keyword: string) {
    const keywordLower = keyword.toLowerCase();
    
    return {
      found_in_title: this.title.toLowerCase().includes(keywordLower),
      found_in_meta_description: this.metaDescription.toLowerCase().includes(keywordLower),
      found_in_h1: this.analysisData.structured_on_page_data.headings_and_keywords
        .some(h => h.tag === 'h1' && h.text.toLowerCase().includes(keywordLower)),
      found_in_content: this.content.toLowerCase().includes(keywordLower),
      frequency: this.countKeywordFrequency(keyword)
    };
  }

  /**
   * Count keyword frequency in content
   */
  private countKeywordFrequency(keyword: string): number {
    const keywordLower = keyword.toLowerCase();
    const contentLower = this.content.toLowerCase();
    
    // Simple frequency count
    const matches = contentLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    return matches ? matches.length : 0;
  }

  /**
   * Helper methods for analysis
   */
  private extractMainContent(): string {
    // Use the existing content extraction logic
    return this.analysisData.semantic_analysis.top_frequent_terms
      .map(term => term.keyword)
      .join(' ');
  }



  private hasSeasonalPattern(keyword: string): boolean {
    const seasonalWords = ['christmas', 'holiday', 'summer', 'winter', 'spring', 'fall', 'back to school'];
    return seasonalWords.some(word => keyword.toLowerCase().includes(word));
  }

  private classifyKeywordType(keyword: string): 'primary' | 'secondary' | 'long_tail' | 'LSI' | 'semantic' {
    const wordCount = keyword.split(' ').length;
    
    // Enforce multi-word primaries as requested
    if (wordCount === 1) return 'semantic';
    if (wordCount === 2) return 'primary';
    if (wordCount >= 3) return 'long_tail';
    if (this.hasLSIPattern(keyword)) return 'LSI';
    return 'semantic';
  }

  private hasLSIPattern(keyword: string): boolean {
    // LSI keywords are typically semantically related but not exact matches
    const lsiPatterns = ['guide', 'tutorial', 'tips', 'tricks', 'how to', 'what is', 'why'];
    return lsiPatterns.some(pattern => keyword.toLowerCase().includes(pattern));
  }

  /** Compute AEO readiness score (0..1) */
  private computeAEOReadinessScore(keyword: string): number {
    const k = keyword.toLowerCase();
    const questionPatterns = ['how to', 'what is', 'why', 'best', 'top'];
    const includesQuestion = questionPatterns.some(p => k.startsWith(p));
    const includesEntity = this.computeEntityAlignmentScore(keyword) > 0.5;
    const lengthOK = k.split(' ').length <= 6;
    let score = 0;
    if (includesQuestion) score += 0.45;
    if (includesEntity) score += 0.35;
    if (lengthOK) score += 0.2;
    return Math.min(1, score);
  }

  /** Entity alignment score (0..1) */
  private computeEntityAlignmentScore(keyword: string): number {
    const k = keyword.toLowerCase();
    const core = this.analysisData.semantic_analysis.core_topic_analysis.main_topic.topic.toLowerCase();
    const entities = new Set<string>([
      core,
      ...this.analysisData.semantic_analysis.entity_extraction.people,
      ...this.analysisData.semantic_analysis.entity_extraction.organizations,
      ...this.analysisData.semantic_analysis.entity_extraction.locations,
      ...this.analysisData.semantic_analysis.entity_extraction.products,
      ...this.analysisData.semantic_analysis.entity_extraction.technologies
    ].map(e => e.toLowerCase()));
    let hits = 0;
    entities.forEach(e => { if (k.includes(e)) hits++; });
    const denom = Math.max(1, Math.min(4, entities.size));
    return Math.min(1, hits / denom);
  }

  /**
   * Calculate bidirectional coherence of sentences
   */
  private calculateBidirectionalCoherence(sentences: string[]): number {
    if (sentences.length < 2) return 0.5;
    
    let coherenceScore = 0;
    for (let i = 0; i < sentences.length - 1; i++) {
      const current = sentences[i].toLowerCase();
      const next = sentences[i + 1].toLowerCase();
      
      // Check for semantic connections between sentences
      const sharedWords = this.findSharedWords(current, next);
      coherenceScore += sharedWords / Math.max(current.split(' ').length, next.split(' ').length);
    }
    
    return Math.min(1.0, coherenceScore / (sentences.length - 1));
  }

  /**
   * Helper method to find shared words between sentences
   */
  private findSharedWords(sentence1: string, sentence2: string): number {
    const words1 = new Set(sentence1.split(' ').filter(w => w.length > 2));
    const words2 = new Set(sentence2.split(' ').filter(w => w.length > 2));
    
    let shared = 0;
    for (const word of words1) {
      if (words2.has(word)) shared++;
    }
    
    return shared;
  }

  /**
   * Calculate overall keyword score
   */
  private calculateOverallScore(recommendation: OptimizedKeywordRecommendation): number {
    const searchVolumeWeight = 0.3;
    const bertWeight = 0.4;
    const confidenceWeight = 0.3;
    
    const searchVolumeScore = Math.min(1.0, recommendation.search_volume_potential.estimated_monthly_searches / 10000);
    const bertScore = (recommendation.bert_context_score.bidirectional_coherence + 
                      recommendation.bert_context_score.contextual_relevance + 
                      recommendation.bert_context_score.natural_language_score + 
                      recommendation.bert_context_score.semantic_density) / 4;
    
    const aeoScore = this.computeAEOReadinessScore(recommendation.keyword);
    return (searchVolumeScore * searchVolumeWeight) + 
           (bertScore * bertWeight) + 
           (aeoScore * 0.15) +
           (recommendation.confidence_score * confidenceWeight);
  }

  /**
   * Calculate contextual relevance
   */
  private calculateContextualRelevance(sentences: string[]): number {
    const coreTopic = this.analysisData.semantic_analysis.core_topic_analysis.main_topic.topic.toLowerCase();
    let relevanceScore = 0;
    
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      const topicWords = coreTopic.split(' ');
      const matches = topicWords.filter(word => sentenceLower.includes(word)).length;
      relevanceScore += matches / topicWords.length;
    });
    
    return Math.min(1.0, relevanceScore / sentences.length);
  }

  /**
   * Calculate natural language score
   */
  private calculateNaturalLanguageScore(): number {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    let naturalScore = 0;
    
    sentences.forEach(sentence => {
      const words = sentence.split(' ');
      // Check for natural language patterns
      const hasArticles = words.some(word => ['a', 'an', 'the'].includes(word.toLowerCase()));
      const hasPrepositions = words.some(word => this.semanticConnectors.has(word.toLowerCase()));
      const hasConnectors = words.some(word => ['and', 'or', 'but', 'so', 'because'].includes(word.toLowerCase()));
      
      naturalScore += (hasArticles ? 0.3 : 0) + (hasPrepositions ? 0.4 : 0) + (hasConnectors ? 0.3 : 0);
    });
    
    return Math.min(1.0, naturalScore / sentences.length);
  }

  /**
   * Calculate preposition importance (key BERT insight)
   */
  private calculatePrepositionImportance(): number {
    const words = this.content.toLowerCase().split(/\s+/);
    const prepositionCount = words.filter(word => this.semanticConnectors.has(word)).length;
    const totalWords = words.length;
    
    return Math.min(1.0, prepositionCount / (totalWords * 0.15)); // 15% is optimal preposition ratio
  }

  /**
   * Calculate semantic density
   */
  private calculateSemanticDensity(): number {
    const entities = this.analysisData.semantic_analysis.entity_extraction;
    const entityCount = Object.values(entities).flat().length;
    const wordCount = this.content.split(/\s+/).length;
    
    return Math.min(1.0, entityCount / (wordCount / 100)); // Entities per 100 words
  }

  /**
   * Extract semantic keywords from content
   */
  private extractSemanticKeywords(): string[] {
    const keywords = new Set<string>();
    
    // Extract from entities
    Object.values(this.analysisData.semantic_analysis.entity_extraction).forEach((entities: string[]) => {
      entities.forEach((entity: string) => {
        const entityKeywords = this.extractBERTAwareKeywords(entity);
        entityKeywords.forEach(kw => keywords.add(kw));
      });
    });
    
    // Extract from semantic relationships
    this.analysisData.semantic_analysis.semantic_relationships.forEach(rel => {
      keywords.add(rel.term);
    });
    
    return Array.from(keywords);
  }

  /**
   * Generate long-tail keyword variations
   */
  private generateLongTailKeywords(baseKeywords: string[]): string[] {
    const longTailKeywords = new Set<string>();
    
    baseKeywords.forEach(keyword => {
      // Add question variations
      longTailKeywords.add(`how to ${keyword}`);
      longTailKeywords.add(`what is ${keyword}`);
      longTailKeywords.add(`best ${keyword}`);
      
      // Add commercial variations
      longTailKeywords.add(`${keyword} guide`);
      longTailKeywords.add(`${keyword} tutorial`);
      longTailKeywords.add(`${keyword} tips`);
    });
    
    return Array.from(longTailKeywords);
  }

  /**
   * Check if keyword has search volume potential
   */
  private hasSearchVolumePotential(keyword: string): boolean {
    // Filter out very short or very long keywords
    if (keyword.length < 3 || keyword.length > 50) return false;
    
    // Filter out stop words only
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = keyword.split(' ');
    
    if (words.length === 1 && stopWords.includes(keyword.toLowerCase())) return false;
    
    return true;
  }

  /**
   * Calculate keyword contextual relevance
   */
  private calculateKeywordContextualRelevance(keyword: string): number {
    const keywordLower = keyword.toLowerCase();
    const coreTopic = this.analysisData.semantic_analysis.core_topic_analysis.main_topic.topic.toLowerCase();
    
    // Check direct match with core topic
    if (coreTopic.includes(keywordLower) || keywordLower.includes(coreTopic)) {
      return 1.0;
    }
    
    // Check semantic relationships
    const semanticMatch = this.analysisData.semantic_analysis.semantic_relationships
      .some(rel => rel.term.toLowerCase().includes(keywordLower) || keywordLower.includes(rel.term.toLowerCase()));
    
    if (semanticMatch) return 0.8;
    
    // Check entity matches
    const entityMatch = Object.values(this.analysisData.semantic_analysis.entity_extraction)
      .flat()
      .some(entity => entity.toLowerCase().includes(keywordLower) || keywordLower.includes(entity.toLowerCase()));
    
    return entityMatch ? 0.7 : 0.3;
  }

  /**
   * Calculate keyword preposition importance
   */
  private calculateKeywordPrepositionImportance(keyword: string): number {
    const words = keyword.split(' ');
    const prepositionCount = words.filter(word => this.semanticConnectors.has(word.toLowerCase())).length;
    
    return Math.min(1.0, prepositionCount / words.length);
  }

  /**
   * Calculate keyword confidence score
   */
  private calculateKeywordConfidence(
    keyword: string,
    searchVolume: SearchVolumePotential,
    bertScore: BERTContextAnalysis,
    currentPerformance: {
      found_in_title: boolean;
      found_in_meta_description: boolean;
      found_in_h1: boolean;
      found_in_content: boolean;
      frequency: number;
    }
  ): number {
    let confidence = 0;
    
    // Search volume factor (30%)
    const volumeScore = Math.min(1.0, searchVolume.estimated_monthly_searches / 10000);
    confidence += volumeScore * 0.3;
    
    // BERT context factor (40%)
    const bertScoreAvg = (bertScore.bidirectional_coherence + bertScore.contextual_relevance + 
                         bertScore.natural_language_score + bertScore.semantic_density) / 4;
    confidence += bertScoreAvg * 0.4;
    
    // Current performance factor (20%)
    const performanceScore = (currentPerformance.found_in_title ? 0.4 : 0) +
                            (currentPerformance.found_in_h1 ? 0.3 : 0) +
                            (currentPerformance.found_in_content ? 0.2 : 0) +
                            (currentPerformance.found_in_meta_description ? 0.1 : 0);
    confidence += performanceScore * 0.2;
    
    // Competition factor (10%)
    const competitionScore = searchVolume.competition_level === 'low' ? 1.0 : 
                           searchVolume.competition_level === 'medium' ? 0.7 : 0.4;
    confidence += competitionScore * 0.1;
    
    return Math.min(1.0, confidence);
  }

  /**
   * Generate keyword reasoning
   */
  private generateKeywordReasoning(
    keyword: string,
    searchVolume: SearchVolumePotential,
    bertScore: BERTContextAnalysis,
    currentPerformance: {
      found_in_title: boolean;
      found_in_meta_description: boolean;
      found_in_h1: boolean;
      found_in_content: boolean;
      frequency: number;
    }
  ): string {
    const reasoning = [];
    
    reasoning.push(`Keyword "${keyword}" shows strong potential with ${searchVolume.estimated_monthly_searches.toLocaleString()} estimated monthly searches.`);
    
    if (bertScore.contextual_relevance > 0.7) {
      reasoning.push('High contextual relevance aligns with BERT\'s bidirectional understanding.');
    }
    const aeoScore = this.computeAEOReadinessScore(keyword);
    if (aeoScore >= 0.6) {
      reasoning.push('Phrase structure is AEO-ready, improving AI Overview/Mode inclusion probability.');
    }
    
    if (currentPerformance.found_in_title) {
      reasoning.push('Currently appears in title tag, providing strong SEO signal.');
    } else {
      reasoning.push('Not found in title tag - consider including for better optimization.');
    }
    
    if (searchVolume.competition_level === 'low') {
      reasoning.push('Low competition level suggests good ranking opportunity.');
    }
    
    return reasoning.join(' ');
  }

  /**
   * Generate keyword optimization recommendations
   */
  private generateKeywordOptimizationRecommendations(keyword: string, currentPerformance: {
    found_in_title: boolean;
    found_in_meta_description: boolean;
    found_in_h1: boolean;
    found_in_content: boolean;
    frequency: number;
  }): string[] {
    const recommendations = [];
    
    if (!currentPerformance.found_in_title) {
      recommendations.push(`Include "${keyword}" in the title tag for better SEO performance.`);
    }
    
    if (!currentPerformance.found_in_h1) {
      recommendations.push(`Consider using "${keyword}" in the main H1 heading.`);
    }
    
    if (!currentPerformance.found_in_meta_description) {
      recommendations.push(`Add "${keyword}" to the meta description for better click-through rates.`);
    }
    
    if (currentPerformance.frequency < 3) {
      recommendations.push(`Increase usage of "${keyword}" throughout the content for better topical authority.`);
    }
    
    return recommendations;
  }

  /**
   * Extract key entities for meta description optimization
   */
  private extractKeyEntities(): string[] {
    const entities = [];
    
    // Extract from core topic
    entities.push(this.analysisData.semantic_analysis.core_topic_analysis.main_topic.topic);
    
    // Extract from semantic relationships
    this.analysisData.semantic_analysis.semantic_relationships
      .filter(rel => rel.related_to_primary_keyword)
      .slice(0, 3)
      .forEach(rel => entities.push(rel.term));
    
    return entities;
  }

  /**
   * Analyze search intent
   */
  private analyzeSearchIntent(): string {
    const title = this.title.toLowerCase();
    const content = this.content.toLowerCase();
    
    if (this.hasQuestionIntent(title) || this.hasQuestionIntent(content)) {
      return 'informational';
    }
    
    if (this.hasCommercialIntent(title) || this.hasCommercialIntent(content)) {
      return 'commercial';
    }
    
    if (title.includes('guide') || title.includes('tutorial') || title.includes('how to')) {
      return 'informational';
    }
    
    return 'informational'; // Default
  }

  /**
   * Check if keyword has question intent
   */
  private hasQuestionIntent(text: string): boolean {
    const questionWords = ['how', 'what', 'why', 'when', 'where', 'which', 'who'];
    return questionWords.some(word => text.toLowerCase().startsWith(word));
  }

  /**
   * Check if keyword has commercial intent
   */
  private hasCommercialIntent(text: string): boolean {
    const commercialWords = ['buy', 'purchase', 'price', 'cost', 'cheap', 'deal', 'sale', 'discount'];
    return commercialWords.some(word => text.toLowerCase().includes(word));
  }

  /**
   * Create optimized meta description
   */
  private async createOptimizedDescription(
    currentDesc: string,
    keyEntities: string[],
    primaryIntent: string,
    _bertAnalysis: BERTContextAnalysis
  ): Promise<string> {
    // This would integrate with AI for description generation
    // For now, return an optimized version based on BERT principles
    
    const maxLength = 155;
    let optimizedDesc = '';
    
    // Start with primary entity
    if (keyEntities.length > 0) {
      optimizedDesc += keyEntities[0];
    }
    
    // Add value proposition based on intent
    if (primaryIntent === 'informational') {
      optimizedDesc += ' - Complete guide with expert insights';
    } else if (primaryIntent === 'commercial') {
      optimizedDesc += ' - Best options and expert reviews';
    }
    
    // Add secondary entity if space allows
    if (keyEntities.length > 1 && optimizedDesc.length < maxLength - 30) {
      optimizedDesc += `. Learn about ${keyEntities[1]}`;
    }
    
    // Ensure it's within character limit
    if (optimizedDesc.length > maxLength) {
      optimizedDesc = optimizedDesc.substring(0, maxLength - 3) + '...';
    }
    
    return optimizedDesc;
  }

  /**
   * Analyze AEO optimization
   */
  private analyzeAEOOptimization(description: string): {
    answer_focused: boolean;
    featured_snippet_ready: boolean;
    conversational_tone: boolean;
  } {
    return {
      answer_focused: description.includes('?') || description.includes('how') || description.includes('what'),
      featured_snippet_ready: description.length <= 155 && (description.includes('complete') || description.includes('best')),
      conversational_tone: description.includes('you') || description.includes('your')
    };
  }

  /**
   * Analyze GEO optimization
   */
  private analyzeGEOOptimization(description: string): {
    location_relevant: boolean;
    local_intent_clear: boolean;
    geo_schema_ready: boolean;
  } {
    // Simple location detection
    const locationWords = ['near', 'local', 'area', 'city', 'state', 'country'];
    const hasLocation = locationWords.some(word => description.toLowerCase().includes(word));
    
    return {
      location_relevant: hasLocation,
      local_intent_clear: hasLocation,
      geo_schema_ready: hasLocation
    };
  }

  /**
   * Analyze AI Overview optimization
   */
  private analyzeAIOverviewOptimization(description: string): {
    structured_for_ai: boolean;
    context_rich: boolean;
    intent_aligned: boolean;
  } {
    return {
      structured_for_ai: description.includes('guide') || description.includes('complete'),
      context_rich: description.split(' ').length >= 15,
      intent_aligned: description.includes('learn') || description.includes('discover')
    };
  }

  /**
   * Calculate meta description optimization score
   */
  private calculateMetaDescriptionScore(
    aeo: { answer_focused: boolean; featured_snippet_ready: boolean; conversational_tone: boolean },
    geo: { location_relevant: boolean; local_intent_clear: boolean; geo_schema_ready: boolean },
    ai: { structured_for_ai: boolean; context_rich: boolean; intent_aligned: boolean }
  ): number {
    let score = 0;
    
    // AEO factors (40%)
    if (aeo.answer_focused) score += 0.15;
    if (aeo.featured_snippet_ready) score += 0.15;
    if (aeo.conversational_tone) score += 0.1;
    
    // GEO factors (20%)
    if (geo.location_relevant) score += 0.1;
    if (geo.local_intent_clear) score += 0.1;
    
    // AI Overview factors (40%)
    if (ai.structured_for_ai) score += 0.15;
    if (ai.context_rich) score += 0.15;
    if (ai.intent_aligned) score += 0.1;
    
    return Math.min(1.0, score);
  }

  /**
   * Generate meta description reasoning
   */
  private generateMetaDescriptionReasoning(
    optimized: string, 
    aeo: { answer_focused: boolean; featured_snippet_ready: boolean; conversational_tone: boolean },
    geo: { location_relevant: boolean; local_intent_clear: boolean; geo_schema_ready: boolean },
    ai: { structured_for_ai: boolean; context_rich: boolean; intent_aligned: boolean }
  ): string {
    const reasoning = [];
    
    reasoning.push(`Optimized description: "${optimized}"`);
    
    if (aeo.answer_focused) {
      reasoning.push('Answer-focused structure for better AEO performance.');
    }
    
    if (ai.structured_for_ai) {
      reasoning.push('Structured for AI Overview inclusion.');
    }
    
    if (geo.location_relevant) {
      reasoning.push('Location-relevant for GEO optimization.');
    }
    
    return reasoning.join(' ');
  }

  /**
   * Generate meta description improvements
   */
  private generateMetaDescriptionImprovements(current: string, optimized: string, score: number): string[] {
    const improvements = [];
    
    if (current.length > 155) {
      improvements.push('Reduce length to under 155 characters for better display.');
    }
    
    if (score < 0.7) {
      improvements.push('Include more action-oriented language.');
    }
    
    if (!optimized.includes('?')) {
      improvements.push('Consider adding a question to improve AEO performance.');
    }
    
    return improvements;
  }
}
