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
  private urlKeywords: string[];
  private titleKeywords: string[];
  private headingKeywords: string[];
  private metaKeywords: string[];
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
   * Get primary keyword candidates
   */
  private getPrimaryKeywordCandidates(): string[] {
    const candidates = new Set<string>();
    
    // Keywords that appear in URL
    this.urlKeywords.forEach(keyword => candidates.add(keyword));
    
    // Keywords that appear in title
    this.titleKeywords.forEach(keyword => candidates.add(keyword));
    
    // Keywords that appear in H1
    const h1Keywords = this.getH1Keywords();
    h1Keywords.forEach(keyword => candidates.add(keyword));
    
    // Keywords that appear in multiple high-priority locations
    const multiLocationKeywords = this.findMultiLocationKeywords();
    multiLocationKeywords.forEach(keyword => candidates.add(keyword));

    return Array.from(candidates);
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

    return Array.from(candidates);
  }

  /**
   * Score primary keywords based on multiple factors
   */
  private scorePrimaryKeywords(candidates: string[]): KeywordAnalysis[] {
    return candidates.map(keyword => {
      const extractedFrom: string[] = [];
      let confidenceScore = 0;

      // Check URL presence
      if (this.urlKeywords.includes(keyword)) {
        extractedFrom.push('url_slug');
        confidenceScore += 0.4;
      }

      // Check title presence
      if (this.titleKeywords.includes(keyword)) {
        extractedFrom.push('title_tag');
        confidenceScore += 0.3;
      }

      // Check H1 presence
      if (this.getH1Keywords().includes(keyword)) {
        extractedFrom.push('h1_heading');
        confidenceScore += 0.3;
      }

      // Meta keywords alignment boosts confidence slightly
      if (this.metaTagKeywords.includes(keyword)) {
        extractedFrom.push('meta_keywords');
        confidenceScore += 0.1;
      }

      // Bonus for appearing in multiple locations
      if (extractedFrom.length > 1) {
        confidenceScore += 0.1;
      }

      // Bonus for keyword length (not too short, not too long)
      if (keyword.length >= 3 && keyword.length <= 20) {
        confidenceScore += 0.05;
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

    if (keywords.length > 1) {
      reasoning += `Additional primary keywords: ${keywords.slice(1).map(kw => kw.term).join(', ')}.`;
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
    reasoning += "They provide semantic support and long-tail opportunities for the primary keywords.";

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

  private isSemanticallyRelevant(keyword: string): boolean {
    // Simplified semantic relevance check
    const primaryKeywords = this.getPrimaryKeywordCandidates();
    return primaryKeywords.some(pk => 
      keyword.includes(pk) || pk.includes(keyword) || 
      this.calculateSimilarity(keyword, pk) > 0.7
    );
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
}
