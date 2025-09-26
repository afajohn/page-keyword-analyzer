/**
 * Keyword Inference Engine
 * Advanced logic for determining primary and secondary keywords with confidence scoring
 */

import { 
  KeywordAnalysis, 
  PrimaryKeywordAnalysis, 
  SecondaryKeywordAnalysis, 
  InferredKeywordsAnalysis,
  StructuredOnPageData 
} from '@/types/seo-analysis';

export class KeywordInferenceEngine {
  private structuredData: StructuredOnPageData;
  private urlKeywords: string[] = [];
  private titleKeywords: string[] = [];
  private headingKeywords: string[] = [];
  private metaKeywords: string[] = [];
  private metaTagKeywords: string[] = [];

  constructor(structuredData: StructuredOnPageData) {
    this.structuredData = structuredData;
    this.extractKeywordSources();
  }

  /**
   * Perform comprehensive keyword inference analysis
   */
  inferKeywords(): InferredKeywordsAnalysis {
    const primaryAnalysis = this.analyzePrimaryKeywords();
    const secondaryAnalysis = this.analyzeSecondaryKeywords();

    return {
      primary: primaryAnalysis,
      secondary: secondaryAnalysis
    };
  }

  /**
   * Analyze and infer primary keywords
   */
  private analyzePrimaryKeywords(): PrimaryKeywordAnalysis {
    const candidateKeywords = this.getPrimaryKeywordCandidates();
    const scoredKeywords = this.scorePrimaryKeywords(candidateKeywords);
    const topKeywords = scoredKeywords.slice(0, 3); // Top 3 primary keywords
    
    const confidenceScore = this.calculatePrimaryConfidence(topKeywords);
    const reasoningSummary = this.generatePrimaryReasoning(topKeywords);

    return {
      confidence_score: confidenceScore,
      keywords: topKeywords,
      reasoning_summary: reasoningSummary
    };
  }

  /**
   * Analyze and infer secondary keywords
   */
  private analyzeSecondaryKeywords(): SecondaryKeywordAnalysis {
    const candidateKeywords = this.getSecondaryKeywordCandidates();
    const scoredKeywords = this.scoreSecondaryKeywords(candidateKeywords);
    const topKeywords = scoredKeywords.slice(0, 10); // Top 10 secondary keywords
    
    const confidenceScore = this.calculateSecondaryConfidence(topKeywords);
    const reasoningSummary = this.generateSecondaryReasoning(topKeywords);

    return {
      confidence_score: confidenceScore,
      keywords: topKeywords,
      reasoning_summary: reasoningSummary
    };
  }

  /**
   * Extract keywords from various sources
   */
  private extractKeywordSources(): void {
    this.urlKeywords = this.structuredData.url_analysis.keywords;
    this.titleKeywords = this.extractKeywordsFromText(this.structuredData.headings_and_keywords[0]?.text || '');
    this.headingKeywords = this.extractAllHeadingKeywords();
    this.metaKeywords = this.structuredData.meta_data_analysis.description_keywords;
    if (this.structuredData.meta_data_analysis.meta_keywords?.length) {
      this.metaTagKeywords = this.structuredData.meta_data_analysis.meta_keywords;
    }
  }

  /**
   * Get primary keyword candidates based on topical relevance
   */
  private getPrimaryKeywordCandidates(): string[] {
    const candidates = new Set<string>();
    
    // 1. Core topic and related terms (highest priority)
    const coreTopicTerms = this.extractCoreTopicTerms();
    coreTopicTerms.forEach(term => candidates.add(term));
    
    // 2. Entity-based keywords (people, organizations, products)
    const entityKeywords = this.extractEntityKeywords();
    entityKeywords.forEach(keyword => candidates.add(keyword));
    
    // 3. Semantic Topic Extraction (AI Overview style)
    const semanticTopics = this.extractSemanticTopics();
    semanticTopics.forEach(topic => candidates.add(topic));
    
    // 4. Context-Aware Phrase Extraction (RankBrain style)
    const headings = this.structuredData.headings_and_keywords.map(h => h.text);
    const mainTopic = this.identifyMainTopicFromStructure(headings);
    const contextualPhrases = this.extractContextualPhrases(mainTopic);
    contextualPhrases.forEach(phrase => candidates.add(phrase));
    
    // 5. User Intent Keywords (Query Fan-out style)
    const intentKeywords = this.extractIntentKeywords();
    intentKeywords.forEach(keyword => candidates.add(keyword));
    
    // 6. Multi-word semantic entities (AI Mode style)
    const semanticEntities = this.extractSemanticEntities();
    semanticEntities.forEach(entity => candidates.add(entity));
    
    // 7. Traditional SEO signals (only add if no semantic keywords found)
    // Only add single words if we don't have enough semantic multi-word keywords
    const multiWordKeywords = Array.from(candidates).filter(kw => kw.includes(' '));
    if (multiWordKeywords.length < 5) {
      this.urlKeywords.forEach(keyword => {
        if (this.isTopicallyRelevant(keyword) && keyword.length > 3) {
          candidates.add(keyword);
        }
      });
      
      this.titleKeywords.forEach(keyword => {
        if (this.isTopicallyRelevant(keyword) && keyword.length > 3) {
          candidates.add(keyword);
        }
      });
      
      const h1Keywords = this.getH1Keywords();
      h1Keywords.forEach(keyword => {
        if (this.isTopicallyRelevant(keyword) && keyword.length > 3) {
          candidates.add(keyword);
        }
      });
    }

    // Filter: only keep multi-word, context-meaningful phrases
    const filtered = Array.from(candidates).filter(kw => this.isValidPrimaryPhrase(kw));
    return filtered;
  }

  /**
   * Get secondary keyword candidates
   */
  private getSecondaryKeywordCandidates(): string[] {
    const candidates = new Set<string>();
    
    // Keywords from H2-H6 headings
    const subHeadingKeywords = this.getSubHeadingKeywords();
    subHeadingKeywords.forEach(keyword => candidates.add(keyword));
    
    // Keywords from meta description
    this.metaKeywords.forEach(keyword => candidates.add(keyword));
    
    // Keywords from image alt texts
    const altTextKeywords = this.getAltTextKeywords();
    altTextKeywords.forEach(keyword => candidates.add(keyword));
    
    // Keywords that appear frequently but not in primary locations
    const frequentKeywords = this.getFrequentNonPrimaryKeywords();
    frequentKeywords.forEach(keyword => candidates.add(keyword));

    // Filter out generic single-word tokens from secondary suggestions
    const filtered = Array.from(candidates).filter(kw => this.isAcceptableSecondary(kw));
    return filtered;
  }

  /**
   * Score primary keywords based on multiple factors
   */
  private scorePrimaryKeywords(candidates: string[]): KeywordAnalysis[] {
    return candidates.map(keyword => {
      const extractedFrom: string[] = [];
      let confidenceScore = 0;

      // NEW SCORING SYSTEM: Prioritize semantic and multi-word keywords
      
      // 1. Multi-word keywords get highest priority (RankBrain + Query Fan-Out)
      if (keyword.includes(' ') && keyword.split(' ').length >= 2) {
        confidenceScore += 0.6; // Highest base score for multi-word phrases
        extractedFrom.push('semantic_analysis');
      }
      
      // 2. Single words are not eligible as primaries
      else if (keyword.split(' ').length === 1) {
        confidenceScore += 0;
      }
      // Core topic exact match (multi-word only)
      else if (this.isFromCoreTopic(keyword) && keyword.split(' ').length >= 2) {
        confidenceScore += 0.5;
        extractedFrom.push('core_topic_analysis');
      }
      
      // 3. Traditional SEO signals (reduced weight)
      if (this.urlKeywords.includes(keyword)) {
        extractedFrom.push('url_slug');
        confidenceScore += 0.2; // Reduced from 0.4
      }

      if (this.titleKeywords.includes(keyword)) {
        extractedFrom.push('title_tag');
        confidenceScore += 0.15; // Reduced from 0.3
      }

      if (this.getH1Keywords().includes(keyword)) {
        extractedFrom.push('h1_heading');
        confidenceScore += 0.15; // Reduced from 0.3
      }

      // 4. Semantic context bonuses
      if (this.hasSemanticContext(keyword)) {
        confidenceScore += 0.2;
        extractedFrom.push('semantic_context');
      }

      // 5. Length bonuses (favor meaningful phrases)
      if (keyword.length >= 5 && keyword.length <= 30) {
        confidenceScore += 0.1;
      }

      // 6. Multiple location bonus (reduced)
      if (extractedFrom.length > 1) {
        confidenceScore += 0.05; // Reduced from 0.1
      }

      return {
        term: keyword,
        extracted_from: extractedFrom,
        confidence_score: Math.min(1, confidenceScore),
        context_sentences: this.getContextSentences(keyword)
      };
    }).sort((a, b) => b.confidence_score! - a.confidence_score!);
  }

  /**
   * Check if keyword is from core topic analysis
   */
  private isFromCoreTopic(keyword: string): boolean {
    const headings = this.structuredData.headings_and_keywords.map(h => h.text);
    const mainTopic = this.identifyMainTopicFromStructure(headings);
    return keyword.toLowerCase() === mainTopic.toLowerCase();
  }

  /**
   * Check if keyword has semantic context (appears in meaningful patterns)
   */
  private hasSemanticContext(keyword: string): boolean {
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    const patterns = [
      new RegExp(`${keyword}\\s+(tips|guide|strategies|techniques|advice)`, 'gi'),
      new RegExp(`(how to|guide to|best)\\s+${keyword}`, 'gi'),
      new RegExp(`${keyword}\\s+(for|that|which)\\s+`, 'gi')
    ];
    
    return patterns.some(pattern => pattern.test(content));
  }

  /**
   * Validate primary keyword phrase: multi-word, not generic, meaningful
   */
  private isValidPrimaryPhrase(phrase: string): boolean {
    const genericBlocklist = new Set([
      'before','after','into','scene','know','these','those','thing','things','good','bad',
      'great','new','with','without','about','for','and','or','but','dating','filipina','filipino','women','men'
    ]);
    const tokens = phrase.toLowerCase().trim().split(/\s+/).filter(t => t.length > 1);
    if (tokens.length < 2) return false;
    if (tokens.some(t => genericBlocklist.has(t))) {
      const strong = tokens.some(t => !genericBlocklist.has(t) && t.length >= 4);
      if (!strong) return false;
    }
    const connectors = new Set(['for','with','without','in','on','at','by','from','to','of','about']);
    const nonConnectorCount = tokens.filter(t => !connectors.has(t)).length;
    return nonConnectorCount >= 2;
  }

  /**
   * Acceptable secondary: allow phrases or non-generic single nouns
   */
  private isAcceptableSecondary(keyword: string): boolean {
    const tokens = keyword.toLowerCase().trim().split(/\s+/);
    if (tokens.length >= 2) return true;
    const genericSingles = new Set(['before','after','into','scene','know','these','those','dating','filipina','foreign','men','women']);
    return !genericSingles.has(tokens[0]);
  }

  /**
   * Score secondary keywords based on different criteria
   */
  private scoreSecondaryKeywords(candidates: string[]): KeywordAnalysis[] {
    return candidates.map(keyword => {
      const extractedFrom: string[] = [];
      let confidenceScore = 0;

      // Check H2-H6 presence
      if (this.getSubHeadingKeywords().includes(keyword)) {
        extractedFrom.push('h2_headings');
        confidenceScore += 0.3;
      }

      // Check meta description presence
      if (this.metaKeywords.includes(keyword)) {
        extractedFrom.push('meta_description');
        confidenceScore += 0.2;
      }

      // Check alt text presence
      if (this.getAltTextKeywords().includes(keyword)) {
        extractedFrom.push('image_alt_texts');
        confidenceScore += 0.2;
      }

      // Meta keywords presence
      if (this.metaTagKeywords.includes(keyword)) {
        extractedFrom.push('meta_keywords');
        confidenceScore += 0.1;
      }

      // Check frequency in content
      const frequency = this.getKeywordFrequency(keyword);
      if (frequency > 2) {
        extractedFrom.push('content_body');
        confidenceScore += 0.2;
      }

      // Bonus for semantic relevance
      if (this.isSemanticallyRelevant(keyword)) {
        confidenceScore += 0.1;
      }

      return {
        term: keyword,
        extracted_from: extractedFrom,
        confidence_score: Math.min(1, confidenceScore),
        context_sentences: this.getContextSentences(keyword)
      };
    }).sort((a, b) => b.confidence_score! - a.confidence_score!);
  }

  /**
   * Calculate overall confidence for primary keywords
   */
  private calculatePrimaryConfidence(keywords: KeywordAnalysis[]): number {
    if (keywords.length === 0) return 0;
    
    const avgConfidence = keywords.reduce((sum, kw) => sum + (kw.confidence_score || 0), 0) / keywords.length;
    const diversityBonus = keywords.length > 1 ? 0.1 : 0;
    
    return Math.min(1, avgConfidence + diversityBonus);
  }

  /**
   * Calculate overall confidence for secondary keywords
   */
  private calculateSecondaryConfidence(keywords: KeywordAnalysis[]): number {
    if (keywords.length === 0) return 0;
    
    const avgConfidence = keywords.reduce((sum, kw) => sum + (kw.confidence_score || 0), 0) / keywords.length;
    const diversityBonus = keywords.length > 5 ? 0.1 : 0;
    
    return Math.min(1, avgConfidence + diversityBonus);
  }

  /**
   * Generate reasoning summary for primary keywords
   */
  private generatePrimaryReasoning(keywords: KeywordAnalysis[]): string {
    if (keywords.length === 0) {
      return "No primary keywords identified. The page lacks clear keyword signals in critical locations (URL, title, H1).";
    }

    const topKeyword = keywords[0];
    let reasoning = `Primary keyword "${topKeyword.term}" identified with ${Math.round((topKeyword.confidence_score || 0) * 100)}% confidence. `;
    
    reasoning += `Found in: ${topKeyword.extracted_from.join(', ')}. `;
    
    if (topKeyword.extracted_from.includes('url_slug')) {
      reasoning += "Strong signal from URL slug. ";
    }
    if (topKeyword.extracted_from.includes('title_tag')) {
      reasoning += "Reinforced by title tag. ";
    }
    if (topKeyword.extracted_from.includes('h1_heading')) {
      reasoning += "Confirmed by H1 heading. ";
    }

    // Add modern SEO philosophy explanation
    reasoning += this.getModernSEOExplanation(topKeyword);

    if (keywords.length > 1) {
      reasoning += ` Additional primary keywords: ${keywords.slice(1).map(kw => kw.term).join(', ')}.`;
    }

    return reasoning;
  }

  /**
   * Generate reasoning summary for secondary keywords
   */
  private generateSecondaryReasoning(keywords: KeywordAnalysis[]): string {
    if (keywords.length === 0) {
      return "No secondary keywords identified. The page lacks supporting keyword signals in subheadings and meta elements.";
    }

    const topKeywords = keywords.slice(0, 3);
    let reasoning = `Identified ${keywords.length} secondary keywords. Top candidates: ${topKeywords.map(kw => kw.term).join(', ')}. `;
    
    reasoning += "These keywords appear in subheadings, meta descriptions, image alt texts, and content body. ";
    reasoning += "They provide semantic support and long-tail opportunities for the primary keywords. ";
    
    // Add content-first approach explanation
    reasoning += this.getContentFirstExplanation();

    return reasoning;
  }

  /**
   * Helper methods
   */
  private extractKeywordsFromText(text: string): string[] {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && word.length < 50);
  }

  private extractAllHeadingKeywords(): string[] {
    const allKeywords: string[] = [];
    this.structuredData.headings_and_keywords.forEach(heading => {
      allKeywords.push(...heading.keywords);
    });
    return allKeywords;
  }

  private getH1Keywords(): string[] {
    const h1Heading = this.structuredData.headings_and_keywords.find(h => h.tag === 'h1');
    return h1Heading ? h1Heading.keywords : [];
  }

  private getSubHeadingKeywords(): string[] {
    const subHeadings = this.structuredData.headings_and_keywords.filter(h => ['h2', 'h3', 'h4', 'h5', 'h6'].includes(h.tag));
    const keywords: string[] = [];
    subHeadings.forEach(heading => {
      keywords.push(...heading.keywords);
    });
    return keywords;
  }

  private getAltTextKeywords(): string[] {
    const keywords: string[] = [];
    this.structuredData.meta_data_analysis.image_alt_texts.forEach(alt => {
      keywords.push(...alt.keywords);
    });
    return keywords;
  }

  private findMultiLocationKeywords(): string[] {
    const allKeywords = new Set<string>();
    const multiLocationKeywords: string[] = [];
    
    // Collect all keywords
    this.urlKeywords.forEach(kw => allKeywords.add(kw));
    this.titleKeywords.forEach(kw => allKeywords.add(kw));
    this.getH1Keywords().forEach(kw => allKeywords.add(kw));
    
    // Find keywords that appear in multiple locations
    allKeywords.forEach(keyword => {
      let locationCount = 0;
      if (this.urlKeywords.includes(keyword)) locationCount++;
      if (this.titleKeywords.includes(keyword)) locationCount++;
      if (this.getH1Keywords().includes(keyword)) locationCount++;
      
      if (locationCount >= 2) {
        multiLocationKeywords.push(keyword);
      }
    });
    
    return multiLocationKeywords;
  }

  private getFrequentNonPrimaryKeywords(): string[] {
    // This would require content analysis - simplified for now
    return this.metaKeywords.filter(keyword => 
      !this.urlKeywords.includes(keyword) && 
      !this.titleKeywords.includes(keyword) &&
      !this.getH1Keywords().includes(keyword)
    );
  }

  private getKeywordFrequency(keyword: string): number {
    // Simplified frequency calculation
    const content = this.structuredData.headings_and_keywords
      .map(h => h.text)
      .join(' ')
      .toLowerCase();
    
    const matches = content.match(new RegExp(`\\b${keyword}\\b`, 'g'));
    return matches ? matches.length : 0;
  }


  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private getContextSentences(keyword: string): string[] {
    // Simplified context extraction
    const sentences: string[] = [];
    this.structuredData.headings_and_keywords.forEach(heading => {
      if (heading.text.toLowerCase().includes(keyword.toLowerCase())) {
        sentences.push(heading.text);
      }
    });
    return sentences.slice(0, 3);
  }

  /**
   * Extract core topic terms based on semantic analysis
   */
  /**
   * Extract core topic terms using RankBrain semantic analysis and Query Fan-Out methodology
   * This implements the advanced SEO concepts from Google's documentation
   */
  private extractCoreTopicTerms(): string[] {
    const topicCluster = this.buildTopicCluster();
    const semanticKeywords = this.extractSemanticKeywords(topicCluster.mainTopic);
    const contextualPhrases = this.extractContextualPhrases(topicCluster.mainTopic);
    
    return [
      topicCluster.mainTopic,
      ...topicCluster.subtopics,
      ...semanticKeywords,
      ...contextualPhrases
    ].slice(0, 8);
  }

  /**
   * Build topic cluster using Query Fan-Out methodology
   * Identifies main topic and related subtopics for comprehensive coverage
   */
  private buildTopicCluster(): { mainTopic: string; subtopics: string[] } {
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    const headings = this.structuredData.headings_and_keywords.map(h => h.text);
    
    // Identify main topic from page structure (not frequency)
    const mainTopic = this.identifyMainTopicFromStructure(headings);
    
    // Extract subtopics using Query Fan-Out analysis
    const subtopics = this.extractSubtopics(content, mainTopic);
    
    return { mainTopic, subtopics };
  }

  /**
   * Identify main topic from page structure using SEO best practices
   * Priority: H1 > URL slug > Title tag > Content analysis
   */
  private identifyMainTopicFromStructure(headings: string[]): string {
    // Priority 1: H1 heading (most important for topic identification)
    const h1Text = headings[0] || '';
    if (h1Text) {
      const h1Topic = this.extractTopicFromHeading(h1Text);
      if (h1Topic) return h1Topic;
    }
    
    // Priority 2: URL slug keywords (strong topic signal)
    const urlKeywords = this.structuredData.url_analysis.keywords;
    if (urlKeywords.length > 0) {
      return urlKeywords[0]; // First URL keyword is usually the main topic
    }
    
    // Priority 3: Title tag analysis
    const titleText = this.structuredData.headings_and_keywords[0]?.text || '';
    const titleTopic = this.extractTopicFromHeading(titleText);
    if (titleTopic) return titleTopic;
    
    return 'general topic';
  }

  /**
   * Extract topic from heading text using semantic analysis
   * Implements RankBrain natural language understanding
   */
  private extractTopicFromHeading(heading: string): string {
    const words = heading.toLowerCase().split(/\s+/);
    
    // Look for topic-defining patterns (RankBrain-style understanding)
    const topicPatterns = [
      /how to\s+([a-zA-Z\s]{3,30})/gi,
      /guide to\s+([a-zA-Z\s]{3,30})/gi,
      /what is\s+([a-zA-Z\s]{3,30})/gi,
      /best\s+([a-zA-Z\s]{3,30})/gi,
      /([a-zA-Z\s]{3,30})\s+tips/gi,
      /([a-zA-Z\s]{3,30})\s+guide/gi,
      /([a-zA-Z\s]{3,30})\s+strategies/gi,
      /([a-zA-Z\s]{3,30})\s+techniques/gi
    ];
    
    for (const pattern of topicPatterns) {
      const match = heading.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    
    // Fallback: return the most meaningful multi-word phrase
    const meaningfulWords = words.filter(word => 
      word.length > 3 && !this.isStopWord(word)
    );
    
    // Look for 2-3 word phrases that make sense
    if (meaningfulWords.length >= 2) {
      return meaningfulWords.slice(0, 2).join(' ');
    }
    
    return meaningfulWords[0] || '';
  }

  /**
   * Extract subtopics using Query Fan-Out methodology
   * Identifies related topics that fan out from the main topic
   */
  private extractSubtopics(content: string, mainTopic: string): string[] {
    const subtopics = new Set<string>();
    
    // Look for subtopic indicators in headings and content
    const subtopicPatterns = [
      new RegExp(`${mainTopic}\\s+(\\w+\\s+\\w+)`, 'gi'),
      new RegExp(`(\\w+\\s+\\w+)\\s+${mainTopic}`, 'gi'),
      /tips\s+for\s+(\w+\s+\w+)/gi,
      /guide\s+to\s+(\w+\s+\w+)/gi,
      /how\s+to\s+(\w+\s+\w+)/gi,
      /best\s+(\w+\s+\w+)/gi,
      /(\w+\s+\w+)\s+strategies/gi,
      /(\w+\s+\w+)\s+techniques/gi
    ];
    
    subtopicPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const subtopic = match.replace(mainTopic, '')
            .replace(/^(tips|guide|how|to|for|best)\s+/gi, '')
            .replace(/\s+(strategies|techniques)$/gi, '')
            .trim();
          if (subtopic.length > 3 && subtopic.length < 30) {
            subtopics.add(subtopic);
          }
        });
      }
    });
    
    return Array.from(subtopics).slice(0, 5);
  }

  /**
   * Extract semantic keywords using RankBrain principles
   * Identifies conceptually related terms, not just frequency-based
   */
  private extractSemanticKeywords(mainTopic: string): string[] {
    const semanticKeywords = new Set<string>();
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    
    // Define semantic keyword patterns based on topic type
    const semanticPatterns = this.getSemanticPatterns(mainTopic);
    
    semanticPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const keyword = match.trim();
          if (keyword.length > 3 && keyword.length < 25) {
            semanticKeywords.add(keyword);
          }
        });
      }
    });
    
    return Array.from(semanticKeywords).slice(0, 6);
  }

  /**
   * Get semantic patterns based on main topic type
   * Implements RankBrain's understanding of topic relationships
   */
  private getSemanticPatterns(mainTopic: string): RegExp[] {
    const topicLower = mainTopic.toLowerCase();
    
    // Technology/Digital patterns
    if (topicLower.includes('digital') || topicLower.includes('tech') || topicLower.includes('software')) {
      return [
        /digital\s+(\w+\s+\w+)/gi,
        /software\s+(\w+\s+\w+)/gi,
        /technology\s+(\w+\s+\w+)/gi,
        /(\w+\s+\w+)\s+automation/gi,
        /(\w+\s+\w+)\s+integration/gi,
        /(\w+\s+\w+)\s+platform/gi
      ];
    }
    
    // Business/Marketing patterns
    if (topicLower.includes('business') || topicLower.includes('marketing') || topicLower.includes('sales')) {
      return [
        /business\s+(\w+\s+\w+)/gi,
        /marketing\s+(\w+\s+\w+)/gi,
        /sales\s+(\w+\s+\w+)/gi,
        /(\w+\s+\w+)\s+strategy/gi,
        /(\w+\s+\w+)\s+optimization/gi,
        /(\w+\s+\w+)\s+growth/gi
      ];
    }
    
    // Health/Fitness patterns
    if (topicLower.includes('health') || topicLower.includes('fitness') || topicLower.includes('wellness')) {
      return [
        /health\s+(\w+\s+\w+)/gi,
        /fitness\s+(\w+\s+\w+)/gi,
        /wellness\s+(\w+\s+\w+)/gi,
        /(\w+\s+\w+)\s+benefits/gi,
        /(\w+\s+\w+)\s+techniques/gi,
        /(\w+\s+\w+)\s+programs/gi
      ];
    }
    
    // Dating/Relationships patterns (based on your example)
    if (topicLower.includes('dating') || topicLower.includes('relationship') || topicLower.includes('love')) {
      return [
        /dating\s+(\w+\s+\w+)/gi,
        /relationship\s+(\w+\s+\w+)/gi,
        /(\w+\s+\w+)\s+advice/gi,
        /(\w+\s+\w+)\s+tips/gi,
        /(\w+\s+\w+)\s+strategies/gi,
        /(\w+\s+\w+)\s+success/gi
      ];
    }
    
    // Default patterns for general topics
    return [
      new RegExp(`${mainTopic}\\s+(\\w+\\s+\\w+)`, 'gi'),
      new RegExp(`(\\w+\\s+\\w+)\\s+${mainTopic}`, 'gi'),
      /(\w+\s+\w+)\s+methods/gi,
      /(\w+\s+\w+)\s+approaches/gi,
      /(\w+\s+\w+)\s+solutions/gi,
      /(\w+\s+\w+)\s+techniques/gi
    ];
  }

  /**
   * Extract contextual phrases using natural language understanding
   * Implements AI Overview optimization principles
   */
  private extractContextualPhrases(_mainTopic: string): string[] {
    const phrases = new Set<string>();
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    
    // Look for contextual phrase patterns that AI Overviews would extract
    const phrasePatterns = [
      /(\w+\s+\w+\s+\w+)\s+that\s+help/gi,
      /(\w+\s+\w+\s+\w+)\s+for\s+beginners/gi,
      /(\w+\s+\w+\s+\w+)\s+best\s+practices/gi,
      /(\w+\s+\w+\s+\w+)\s+step\s+by\s+step/gi,
      /(\w+\s+\w+\s+\w+)\s+complete\s+guide/gi,
      /(\w+\s+\w+\s+\w+)\s+proven\s+methods/gi
    ];
    
    phrasePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const phrase = match.trim();
          if (phrase.length > 10 && phrase.length < 40) {
            phrases.add(phrase);
          }
        });
      }
    });
    
    return Array.from(phrases).slice(0, 4);
  }

  /**
   * Extract entity-based keywords
   */
  private extractEntityKeywords(): string[] {
    const entityKeywords: string[] = [];
    
    // Extract from headings (which contain entity information)
    this.structuredData.headings_and_keywords.forEach(heading => {
      heading.keywords.forEach(keyword => {
        // Check if keyword represents an entity (proper noun patterns)
        if (this.isEntityKeyword(keyword)) {
          entityKeywords.push(keyword);
        }
      });
    });
    
    // Extract from meta data
    if (this.structuredData.meta_data_analysis.description_keywords) {
      this.structuredData.meta_data_analysis.description_keywords.forEach(keyword => {
        if (this.isEntityKeyword(keyword)) {
          entityKeywords.push(keyword);
        }
      });
    }
    
    return [...new Set(entityKeywords)];
  }

  /**
   * Check if a keyword represents an entity
   */
  private isEntityKeyword(keyword: string): boolean {
    // Check for proper noun patterns
    if (/^[A-Z]/.test(keyword)) return true;
    
    // Check for common entity patterns
    const entityPatterns = [
      /(inc|corp|llc|ltd|company|organization|group)$/i,
      /(university|college|school|institute|center)$/i,
      /(software|platform|system|tool|application)$/i,
      /(city|state|country|region)$/i,
      /(doctor|professor|expert|specialist)$/i
    ];
    
    return entityPatterns.some(pattern => pattern.test(keyword));
  }

  /**
   * Extract semantic topics using AI Overview principles
   */
  private extractSemanticTopics(): string[] {
    const topics: string[] = [];
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    
    // Look for topic-defining phrases that AI Overviews would extract
    const topicPatterns = [
      // How-to and tutorial topics
      /how to\s+([a-zA-Z\s]{3,30})/gi,
      /guide to\s+([a-zA-Z\s]{3,30})/gi,
      /tutorial on\s+([a-zA-Z\s]{3,30})/gi,
      /learn about\s+([a-zA-Z\s]{3,30})/gi,
      
      // Definition and explanation topics
      /what is\s+([a-zA-Z\s]{3,30})/gi,
      /definition of\s+([a-zA-Z\s]{3,30})/gi,
      /explanation of\s+([a-zA-Z\s]{3,30})/gi,
      
      // Process and method topics
      /process of\s+([a-zA-Z\s]{3,30})/gi,
      /method for\s+([a-zA-Z\s]{3,30})/gi,
      /approach to\s+([a-zA-Z\s]{3,30})/gi,
      
      // Comparison and analysis topics
      /comparison between\s+([a-zA-Z\s]{3,30})/gi,
      /analysis of\s+([a-zA-Z\s]{3,30})/gi,
      /review of\s+([a-zA-Z\s]{3,30})/gi
    ];

    topicPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const topic = match.replace(/^(how to|guide to|tutorial on|learn about|what is|definition of|explanation of|process of|method for|approach to|comparison between|analysis of|review of)\s+/i, '').trim();
          if (topic.length > 3 && topic.length < 50) {
            topics.push(topic);
          }
        });
      }
    });

    return [...new Set(topics)].slice(0, 5);
  }


  /**
   * Extract user intent keywords using Query Fan-out principles
   */
  private extractIntentKeywords(): string[] {
    const intentKeywords: string[] = [];
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    
    // Intent-driven keyword patterns
    const intentPatterns = [
      // Informational intent
      /best\s+([a-zA-Z\s]{2,25})/gi,
      /top\s+([a-zA-Z\s]{2,25})/gi,
      /list of\s+([a-zA-Z\s]{2,25})/gi,
      
      // Commercial intent
      /buy\s+([a-zA-Z\s]{2,25})/gi,
      /purchase\s+([a-zA-Z\s]{2,25})/gi,
      /price of\s+([a-zA-Z\s]{2,25})/gi,
      
      // Navigational intent
      /official\s+([a-zA-Z\s]{2,25})/gi,
      /website for\s+([a-zA-Z\s]{2,25})/gi,
      
      // Transactional intent
      /download\s+([a-zA-Z\s]{2,25})/gi,
      /sign up for\s+([a-zA-Z\s]{2,25})/gi,
      /register for\s+([a-zA-Z\s]{2,25})/gi
    ];

    intentPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const keyword = match.replace(/^(best|top|list of|buy|purchase|price of|official|website for|download|sign up for|register for)\s+/i, '').trim();
          if (keyword.length > 2 && keyword.length < 30) {
            intentKeywords.push(keyword);
          }
        });
      }
    });

    return [...new Set(intentKeywords)].slice(0, 5);
  }

  /**
   * Extract semantic entities using AI Mode principles
   */
  private extractSemanticEntities(): string[] {
    const entities: string[] = [];
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    
    // Multi-word entity patterns that AI Mode would recognize
    const entityPatterns = [
      // Professional entities
      /([A-Z][a-zA-Z\s]{2,20})\s+(expert|specialist|professional|consultant|advisor)/gi,
      /([A-Z][a-zA-Z\s]{2,20})\s+(company|corporation|organization|institute|center)/gi,
      
      // Geographic entities
      /([A-Z][a-zA-Z\s]{2,20})\s+(city|state|country|region|area)/gi,
      /([A-Z][a-zA-Z\s]{2,20})\s+(university|college|school|institution)/gi,
      
      // Product entities
      /([A-Z][a-zA-Z\s]{2,20})\s+(software|application|platform|system|tool)/gi,
      /([A-Z][a-zA-Z\s]{2,20})\s+(service|solution|product|technology)/gi,
      
      // Method and approach entities
      /([a-zA-Z\s]{3,20})\s+(method|approach|technique|strategy|framework)/gi,
      /([a-zA-Z\s]{3,20})\s+(process|procedure|workflow|system)/gi
    ];

    entityPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const entity = match.trim();
          if (entity.length > 5 && entity.length < 60) {
            entities.push(entity);
          }
        });
      }
    });

    return [...new Set(entities)].slice(0, 5);
  }

  /**
   * Enhanced topical relevance check
   */
  private isTopicallyRelevant(keyword: string): boolean {
    // Filter out common stop words and low-value terms
    const stopWords = [
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
      'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
    ];

    if (stopWords.includes(keyword.toLowerCase())) return false;
    
    // Must be at least 3 characters and not just numbers
    if (keyword.length < 3) return false;
    if (/^\d+$/.test(keyword)) return false;
    
    // Check topical relevance based on core topic
    const headings = this.structuredData.headings_and_keywords.map(h => h.text);
    const mainTopic = this.identifyMainTopicFromStructure(headings);
    if (mainTopic && this.isRelatedToMainTopic(keyword, mainTopic)) {
      return true;
    }
    
    // Check if it appears in meaningful contexts (headings)
    const meaningfulContexts = this.structuredData.headings_and_keywords
      .filter(h => h.tag === 'h1' || h.tag === 'h2' || h.tag === 'h3')
      .map(h => h.text.toLowerCase());
    
    const hasMeaningfulContext = meaningfulContexts.some(context => 
      context.includes(keyword.toLowerCase())
    );
    
    return hasMeaningfulContext;
  }

  /**
   * Check if keyword is related to main topic
   */
  private isRelatedToMainTopic(keyword: string, mainTopic: string): boolean {
    // Direct match
    if (keyword.toLowerCase() === mainTopic.toLowerCase()) return true;
    
    // Check if keyword co-occurs with main topic in sentences
    const content = this.structuredData.headings_and_keywords.map(h => h.text).join(' ');
    const sentences = content.split(/[.!?]+/);
    
    return sentences.some(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return lowerSentence.includes(keyword.toLowerCase()) && 
             lowerSentence.includes(mainTopic.toLowerCase());
    });
  }

  /**
   * Legacy method for backward compatibility
   */
  private isSemanticallyRelevant(keyword: string): boolean {
    return this.isTopicallyRelevant(keyword);
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

  /**
   * Generate modern SEO philosophy explanation for primary keywords
   */
  private getModernSEOExplanation(keyword: KeywordAnalysis): string {
    const isMultiWord = keyword.term.includes(' ');
    const hasSemanticSignals = keyword.extracted_from?.includes('semantic_analysis') || 
                              keyword.extracted_from?.includes('semantic_context');
    
    let explanation = "";
    
    if (isMultiWord) {
      explanation += "This multi-word phrase aligns with modern semantic SEO practices, ";
      explanation += "where Google prioritizes contextual understanding over exact keyword matching. ";
    }
    
    if (hasSemanticSignals) {
      explanation += "The semantic analysis approach identifies content-relevant terms that may have ";
      explanation += "lower search volume but higher topical relevance and user intent alignment. ";
    }
    
    explanation += "This content-first methodology focuses on optimizing for what your page actually covers ";
    explanation += "rather than chasing high-volume, competitive keywords.";
    
    return explanation;
  }

  /**
   * Generate content-first approach explanation for secondary keywords
   */
  private getContentFirstExplanation(): string {
    return "This analysis prioritizes content optimization over search volume data, " +
          "identifying semantically relevant terms that support your page's topical authority " +
          "and help search engines understand your content's comprehensive coverage of the subject matter.";
  }
}
