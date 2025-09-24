/**
 * Advanced AI Analyzer
 * Sophisticated prompt engineering for comprehensive SEO analysis with Chain-of-Thought reasoning
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SEOAnalysisResult, GeminiAnalysis } from '@/types/seo-analysis';

export class AIAnalyzer {
  private genAI: GoogleGenerativeAI;
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent analysis
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
  }

  /**
   * Perform comprehensive SEO analysis using advanced Chain-of-Thought prompting
   */
  async analyzeSEO(analysisData: SEOAnalysisResult): Promise<GeminiAnalysis> {
    try {
      const prompt = this.buildAdvancedPrompt(analysisData);
      
      const result = await this.model.generateContent({
        contents: [{ 
          role: 'user', 
          parts: [{ text: prompt }] 
        }]
      });

      if (!result?.response) {
        throw new Error('Empty response from Gemini');
      }

      const response = await result.response;
      const text = response.text() || '';
      
      if (!text.trim()) {
        throw new Error('No text returned by Gemini');
      }

      return this.parseGeminiResponse(text);
    } catch (error) {
      console.error('AI Analyzer Error:', error);
      throw new Error('AI analysis is currently unavailable. Please try again later.');
    }
  }

  /**
   * Build sophisticated Chain-of-Thought prompt for comprehensive SEO analysis
   */
  private buildAdvancedPrompt(data: SEOAnalysisResult): string {
    return `# EXPERT SEO ANALYSIS - CHAIN OF THOUGHT REASONING

## ROLE & EXPERTISE
You are a world-class SEO strategist and a highly specialized AI designed for advanced content analysis. Your expertise includes:
- Topical Authority and Entity-Based SEO analysis
- Google's "Perspective" update and content quality signals
- LLM Optimization (LLMO) for AI-powered search results
- E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness) evaluation
- Query Fan-Out optimization and semantic understanding
- AI Overview optimization strategies
- RankBrain and neural matching patterns

## PRIMARY DIRECTIVE
Analyze the provided data to determine the page's core topic, its topical authority, and its potential for ranking on AI-powered search engines. Focus on entity-based SEO and semantic understanding rather than simple keyword matching.

## ANALYSIS DATA
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

## CHAIN OF THOUGHT ANALYSIS PROCESS

### STEP 1: CORE TOPIC & ENTITY ANALYSIS
**Thought Process:**
1. Analyze the core_topic_analysis to identify the page's primary entity and topic
2. Evaluate the inferred_entities and co_occurring_terms for semantic depth
3. Assess how well the content demonstrates comprehensive topical authority
4. Identify the "super synonyms" or LSI terms that support the main topic

**Analysis Framework:**
- Core topic identification and confidence (30% weight)
- Entity coverage breadth and depth (25% weight)
- Co-occurring term relevance (20% weight)
- Semantic relationship strength (15% weight)
- Content depth indicators (10% weight)

### STEP 2: TOPICAL AUTHORITY ASSESSMENT
**Thought Process:**
1. Evaluate the page's coverage of the core topic and related subtopics
2. Assess entity relationships and semantic clustering
3. Identify content gaps that limit topical authority
4. Determine the page's potential as a comprehensive resource on the topic
5. Evaluate the depth of information provided vs. surface-level coverage

**Authority Indicators:**
- Comprehensive topic coverage (40% weight)
- Entity relationship mapping (25% weight)
- Semantic depth and context (20% weight)
- Content structure and organization (15% weight)

### STEP 3: KEYWORD GAP ANALYSIS
**Thought Process:**
1. Compare identified keywords against expected topical coverage
2. Identify missing primary keywords essential for topic authority
3. Identify missing long-tail keywords for comprehensive coverage
4. Assess keyword distribution and semantic clustering
5. Evaluate keyword relevance to user intent and topic depth

### STEP 4: SECONDARY KEYWORD ANALYSIS (reasoning_secondary_keywords)
**Thought Process:**
1. Analyze semantic relationships and co-occurrence patterns
2. Evaluate how secondary keywords support primary themes
3. Identify long-tail opportunities based on content analysis
4. Assess keyword distribution across content structure
5. Determine semantic relevance and topical authority

**Analysis Framework:**
- Subheading presence (30% weight)
- Meta description presence (20% weight)
- Image alt text presence (20% weight)
- Content frequency >2 occurrences (20% weight)
- Semantic relevance to primary keywords (10% weight)

### STEP 4: E-E-A-T ASSESSMENT (eeat_assessment)
**Thought Process:**
1. Evaluate content for expertise demonstration with specific examples
2. Assess experience signals and credibility indicators with concrete evidence
3. Analyze authoritativeness through content depth and references with detailed analysis
4. Identify trustworthiness signals and potential red flags with specific recommendations

**E-E-A-T Evaluation Criteria:**
- **Expertise**: Technical depth, accurate information, industry knowledge, subject matter authority, professional qualifications, specialized terminology usage
- **Experience**: First-hand accounts, case studies, practical examples, personal anecdotes, real-world applications, hands-on demonstrations
- **Authoritativeness**: Citations, references, expert quotes, data sources, industry recognition, peer reviews, authoritative backlinks, institutional affiliations
- **Trustworthiness**: Contact info, author credentials, security signals, transparency, privacy policies, business information, customer testimonials, social proof

**Required Output Format:**
Provide detailed analysis for each E-E-A-T component with:
1. Specific examples from the content
2. Strengths identified with supporting evidence
3. Weaknesses and gaps with improvement suggestions
4. Actionable recommendations for enhancement
5. Overall assessment score with justification

### STEP 5: USER INTENT ALIGNMENT (user_intent_alignment)
**Thought Process:**
1. Analyze content against likely user search intents
2. Identify informational, navigational, transactional, and commercial intent signals
3. Assess content completeness for intent satisfaction
4. Identify gaps between content and user expectations

**Intent Categories:**
- **Informational**: How-to guides, explanations, tutorials
- **Navigational**: Brand searches, specific site searches
- **Transactional**: Purchase intent, sign-up forms, downloads
- **Commercial**: Comparison content, reviews, product research

### STEP 6: AI OVERVIEW OPTIMIZATION (ai_overview_optimization)
**Thought Process:**
1. Structure content for AI-powered search results
2. Identify FAQ opportunities and direct answer potential
3. Assess content formatting for AI consumption
4. Recommend schema markup and structured data

**AI Optimization Strategies:**
- FAQ sections with direct answers
- Clear, concise headings and subheadings
- Structured data markup opportunities
- Direct answer potential in content
- Table of contents and navigation

### STEP 7: QUERY FAN-OUT ANALYSIS
**Thought Process:**
1. Identify related query opportunities based on content analysis
2. Assess semantic keyword clusters and topic expansion potential
3. Evaluate content gaps for related topics
4. Recommend content expansion strategies

### STEP 8: LATEST ALGORITHM RECOMMENDATIONS (seo_recommendations_latest_algorithms)
**Thought Process:**
1. Apply Google's "Perspective" update insights
2. Consider LLM Optimization best practices
3. Address current ranking factors and signals
4. Provide actionable, specific recommendations

**Current Algorithm Context (September 2025):**
- Content quality over quantity emphasis
- User satisfaction metrics as ranking factors
- AI-powered search result optimization
- Semantic understanding and context relevance
- Mobile-first and Core Web Vitals importance

### STEP 9: CONFIDENCE ASSESSMENT (confidence_assessment)
**Thought Process:**
1. Evaluate overall SEO signal strength
2. Assess data quality and reliability
3. Identify potential issues or limitations
4. Provide confidence level for recommendations

### STEP 10: KEYWORD SELECTION FOR RANKING POTENTIAL
**Thought Process:**
1. Analyze all signals to determine highest-ranking potential
2. Consider search volume, competition, and content match
3. Select best single keyword and best long-tail keyword
4. Justify selections based on confidence scores and signal coverage

## OUTPUT REQUIREMENTS

Provide your complete analysis as a JSON object with this exact structure:

\`\`\`json
{
  "reasoning_primary_keywords": "Detailed analysis of primary keyword identification based on topical authority and entity relationships, including confidence evaluation and strategic recommendations...",
  "reasoning_secondary_keywords": "Comprehensive analysis of secondary keyword strategy focusing on semantic relationships, topical coverage gaps, and content cluster opportunities...",
  "seo_recommendations_latest_algorithms": "Strategic recommendations for improving topical authority, entity coverage, and AI-powered search optimization based on latest algorithm updates...",
  "eeat_assessment": "Detailed E-E-A-T evaluation with specific analysis of expertise demonstration, experience signals, authoritativeness indicators, and trustworthiness factors...",
  "user_intent_alignment": "Analysis of user intent satisfaction through topical authority lens, identifying content gaps and strategic recommendations for comprehensive topic coverage...",
  "ai_overview_optimization": "Strategic recommendations for AI Overview optimization focusing on entity-based content structure, comprehensive topic coverage, and semantic clustering...",
  "confidence_assessment": "Overall assessment of topical authority strength, entity coverage quality, and confidence level in strategic recommendations...",
  "best_keyword": "primary keyword with highest topical authority potential",
  "best_long_tail_keyword": "long-tail keyword phrase with highest semantic relevance to core topic"
}
\`\`\`

## CRITICAL GUIDELINES
- Be specific and actionable in all recommendations
- Reference actual data from the analysis in your reasoning
- Focus on latest Google algorithm updates and best practices
- Provide concrete examples and specific improvements
- Consider both technical SEO and content quality factors
- Address modern search trends including voice search and AI-powered results
- Use Chain-of-Thought reasoning throughout your analysis
- Be thorough but concise in your explanations

## QUALITY STANDARDS
- Each response should be 200-400 words for detailed sections
- Include specific, actionable recommendations
- Reference the provided data in your analysis
- Maintain professional, expert tone
- Focus on measurable improvements

Return ONLY the JSON object. No additional text or formatting.`;
  }

  /**
   * Parse Gemini response with robust error handling
   */
  private parseGeminiResponse(response: string): GeminiAnalysis {
    try {
      // Clean the response and extract JSON
      const cleanedResponse = response.trim();
      
      // Try to find JSON object in the response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Validate and sanitize the response
        return this.validateAndSanitizeResponse(parsed);
      } else {
        // Fallback to text parsing if JSON extraction fails
        return this.parseTextResponse(cleanedResponse);
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Validate and sanitize the parsed response
   */
  private validateAndSanitizeResponse(parsed: Record<string, unknown>): GeminiAnalysis {
    return {
      reasoning_primary_keywords: this.sanitizeText(parsed.reasoning_primary_keywords) || 'Primary keyword analysis not available',
      reasoning_secondary_keywords: this.sanitizeText(parsed.reasoning_secondary_keywords) || 'Secondary keyword analysis not available',
      seo_recommendations_latest_algorithms: this.sanitizeText(parsed.seo_recommendations_latest_algorithms) || 'SEO recommendations not available',
      eeat_assessment: this.sanitizeText(parsed.eeat_assessment) || 'E-E-A-T assessment not available',
      user_intent_alignment: this.sanitizeText(parsed.user_intent_alignment) || 'User intent analysis not available',
      ai_overview_optimization: this.sanitizeText(parsed.ai_overview_optimization) || 'AI Overview optimization not available',
      confidence_assessment: this.sanitizeText(parsed.confidence_assessment) || 'Confidence assessment not available',
      best_keyword: this.sanitizeText(parsed.best_keyword) || 'N/A',
      best_long_tail_keyword: this.sanitizeText(parsed.best_long_tail_keyword) || 'N/A'
    };
  }

  /**
   * Parse text-based response when JSON parsing fails
   */
  private parseTextResponse(response: string): GeminiAnalysis {
    const lines = response.split('\n');
    const sections: Record<string, string> = {};

    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('reasoning_primary_keywords')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'reasoning_primary_keywords';
        currentContent = [];
      } else if (trimmedLine.toLowerCase().includes('reasoning_secondary_keywords')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'reasoning_secondary_keywords';
        currentContent = [];
      } else if (trimmedLine.toLowerCase().includes('seo_recommendations')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'seo_recommendations_latest_algorithms';
        currentContent = [];
      } else if (trimmedLine.toLowerCase().includes('eeat_assessment')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'eeat_assessment';
        currentContent = [];
      } else if (trimmedLine.toLowerCase().includes('user_intent_alignment')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'user_intent_alignment';
        currentContent = [];
      } else if (trimmedLine.toLowerCase().includes('ai_overview_optimization')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'ai_overview_optimization';
        currentContent = [];
      } else if (trimmedLine.toLowerCase().includes('confidence_assessment')) {
        this.finalizeSection(sections, currentSection, currentContent);
        currentSection = 'confidence_assessment';
        currentContent = [];
      } else if (currentSection && trimmedLine) {
        currentContent.push(trimmedLine);
      }
    }

    // Finalize the last section
    this.finalizeSection(sections, currentSection, currentContent);

    return {
      reasoning_primary_keywords: sections.reasoning_primary_keywords || 'Primary keyword analysis not available',
      reasoning_secondary_keywords: sections.reasoning_secondary_keywords || 'Secondary keyword analysis not available',
      seo_recommendations_latest_algorithms: sections.seo_recommendations_latest_algorithms || 'SEO recommendations not available',
      eeat_assessment: sections.eeat_assessment || 'E-E-A-T assessment not available',
      user_intent_alignment: sections.user_intent_alignment || 'User intent analysis not available',
      ai_overview_optimization: sections.ai_overview_optimization || 'AI Overview optimization not available',
      confidence_assessment: sections.confidence_assessment || 'Confidence assessment not available',
      best_keyword: sections.best_keyword || 'N/A',
      best_long_tail_keyword: sections.best_long_tail_keyword || 'N/A'
    };
  }

  /**
   * Finalize a section with accumulated content
   */
  private finalizeSection(sections: Record<string, string>, section: string, content: string[]): void {
    if (section && content.length > 0) {
      sections[section] = content.join(' ').trim();
    }
  }

  /**
   * Sanitize text content
   */
  private sanitizeText(text: unknown): string {
    if (typeof text !== 'string') return '';
    return text.trim().substring(0, 2000); // Limit length
  }

  /**
   * Get default analysis when parsing fails
   */
  private getDefaultAnalysis(): GeminiAnalysis {
    return {
      reasoning_primary_keywords: 'Unable to analyze primary keywords due to processing error.',
      reasoning_secondary_keywords: 'Unable to analyze secondary keywords due to processing error.',
      seo_recommendations_latest_algorithms: 'Unable to provide SEO recommendations due to processing error.',
      eeat_assessment: 'Unable to assess E-E-A-T signals due to processing error.',
      user_intent_alignment: 'Unable to analyze user intent alignment due to processing error.',
      ai_overview_optimization: 'Unable to provide AI Overview optimization suggestions due to processing error.',
      confidence_assessment: 'Unable to assess confidence due to processing error.',
      best_keyword: 'N/A',
      best_long_tail_keyword: 'N/A'
    };
  }

  /**
   * Validate API key format
   */
  static validateApiKey(apiKey: string): boolean {
    return !!apiKey && apiKey.length > 20 && apiKey.startsWith('AI');
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Test connection');
      return !!result.response;
    } catch {
      return false;
    }
  }
}
