/**
 * Advanced AI Analyzer
 * Sophisticated prompt engineering for comprehensive SEO analysis with Chain-of-Thought reasoning
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  SEOAnalysisResult, 
  GeminiAnalysis, 
  OptimizedKeywordRecommendation, 
  MetaDescriptionOptimization,
  BERTContextAnalysis
} from '@/types/seo-analysis';
import { BERTKeywordOptimizer } from './bert-keyword-optimizer';

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
      // Initialize BERT keyword optimizer
      const bertOptimizer = new BERTKeywordOptimizer(analysisData);
      
      // Generate optimized keywords and meta description
      const [optimizedKeywords, optimizedMetaDescription] = await Promise.all([
        bertOptimizer.generateOptimizedKeywords(),
        bertOptimizer.generateOptimizedMetaDescription()
      ]);

      // Build enhanced prompt with BERT analysis
      const prompt = this.buildBERTEnhancedPrompt(analysisData, optimizedKeywords, optimizedMetaDescription);
      
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

      const geminiAnalysis = this.parseGeminiResponse(text);
      
      // NEW: Generate AI-Ready Content (async, non-blocking)
      // TEMPORARILY DISABLED FOR TESTING - Remove the next 2 lines to enable
      const ENABLE_AI_READY_CONTENT = true; // Set to false to temporarily disable
      
      let aiReadyContent = null;
      let authorityAnalysis = null;
      
      if (ENABLE_AI_READY_CONTENT) {
        console.log('🚀 Starting AI-Ready Content generation...');
        aiReadyContent = await this.generateAIReadyContent(analysisData).catch(err => {
          console.error('❌ AI-Ready Content generation failed:', err);
          console.error('Error details:', err.message);
          return null;
        });
        console.log('✅ AI-Ready Content result:', aiReadyContent);

        // NEW: Generate Authority Analysis (async, non-blocking)
        console.log('🚀 Starting Authority Analysis generation...');
        authorityAnalysis = await this.generateAuthorityAnalysis(analysisData).catch(err => {
          console.error('❌ Authority Analysis generation failed:', err);
          console.error('Error details:', err.message);
          return null;
        });
        console.log('✅ Authority Analysis result:', authorityAnalysis);
      } else {
        console.warn('⚠️ AI-Ready Content generation is DISABLED (ENABLE_AI_READY_CONTENT = false)');
      }
      
      // Enhance with BERT analysis and new features
      return {
        ...geminiAnalysis,
        optimized_keywords: optimizedKeywords,
        meta_description_optimization: optimizedMetaDescription,
        bert_context_analysis: this.extractBERTAnalysis(analysisData),
        search_intent_analysis: this.analyzeSearchIntent(analysisData),
        // NEW: AI-Ready Content fields
        ...(aiReadyContent || {}),
        // NEW: Authority Analysis
        authority_analysis: authorityAnalysis || undefined
      };
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

**Modern SEO Approach:**
Primary keywords are selected using a content-first methodology that prioritizes:
- Multi-word phrases over single keywords (semantic SEO)
- Content relevance over search volume data
- Topical authority and entity relationships
- Semantic understanding and contextual relevance
- Long-tail opportunities that may have low volume but high intent alignment

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

**Content-First Philosophy:**
This analysis prioritizes content optimization over search volume data. Keywords are selected based on:
- What the page actually covers (content relevance)
- Semantic relationships and topical authority
- User intent alignment with page content
- Long-tail opportunities that may have low search volume but high conversion potential
- Modern SEO practices focusing on semantic understanding rather than exact keyword matching

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

Provide your complete analysis as a VALID JSON object with this exact structure. Ensure proper JSON formatting with no trailing commas, properly escaped quotes, and valid syntax:

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

**CRITICAL JSON REQUIREMENTS:**
- Use double quotes for all strings
- Escape any quotes within strings with backslashes
- No trailing commas after the last property
- Ensure all strings are properly closed
- Use valid JSON syntax throughout

**CONTENT FORMATTING REQUIREMENTS:**
- Use clear headings for main sections (e.g., "Primary Keyword Analysis:", "SEO Recommendations:")
- Use bullet points (•) for lists and recommendations
- Use numbered lists (1., 2., 3.) for step-by-step instructions
- Include key metrics in format "Metric: Value" (e.g., "Confidence Score: 95%")
- Break content into logical paragraphs with clear spacing
- Use professional, readable language suitable for SEO professionals
- Avoid using backticks (\`) in content as they cause JSON parsing issues
- Use proper line breaks (\n) for paragraph separation

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
   * Build BERT-enhanced prompt with optimized keywords and meta description
   */
  private buildBERTEnhancedPrompt(
    data: SEOAnalysisResult, 
    optimizedKeywords: OptimizedKeywordRecommendation[], 
    optimizedMetaDescription: MetaDescriptionOptimization
  ): string {
    return `# BERT-AWARE SEO ANALYSIS - ENHANCED WITH AI OVERVIEW OPTIMIZATION

## ROLE & EXPERTISE
You are a world-class SEO strategist specializing in BERT-aware optimization, AI Overview preparation, and modern search algorithm compliance. Your expertise includes:

### CORE COMPETENCIES:
- **BERT (Bidirectional Encoder Representations from Transformers)** optimization
- **AI Overview** and **AI Mode** optimization strategies
- **Answer Engine Optimization (AEO)** for featured snippets
- **Google Entity Engine Optimization (GEO)** for local search
- **Search Intent Analysis** with contextual understanding
- **Semantic SEO** and topical authority assessment
- **E-E-A-T** evaluation aligned with Google's quality guidelines

## ANALYSIS DATA
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

## BERT-OPTIMIZED KEYWORD RECOMMENDATIONS
\`\`\`json
${JSON.stringify(optimizedKeywords, null, 2)}
\`\`\`

## OPTIMIZED META DESCRIPTION ANALYSIS
\`\`\`json
${JSON.stringify(optimizedMetaDescription, null, 2)}
\`\`\`

## CHAIN OF THOUGHT ANALYSIS PROCESS

### STEP 1: BERT CONTEXTUAL ANALYSIS
**Thought Process:**
1. Analyze the bidirectional coherence of the content
2. Evaluate contextual relevance using BERT principles
3. Assess natural language processing optimization
4. Measure preposition importance (critical BERT insight)
5. Calculate semantic density for topical authority

### STEP 2: AI OVERVIEW OPTIMIZATION ASSESSMENT
**Thought Process:**
1. Evaluate content structure for AI Overview inclusion
2. Assess answer-focused optimization potential
3. Analyze conversational query handling
4. Measure context richness for AI understanding
5. Evaluate structured data potential

### STEP 3: SEARCH INTENT & USER ALIGNMENT
**Thought Process:**
1. Analyze primary search intent (informational, navigational, transactional, commercial)
2. Evaluate content alignment with user expectations
3. Assess conversational query optimization
4. Measure commercial intent signals
5. Evaluate local search optimization potential

## REQUIRED OUTPUT FORMAT

Provide your analysis in the following JSON structure:

\`\`\`json
{
  "reasoning_primary_keywords": "Detailed analysis of primary keyword strategy with BERT awareness...",
  "reasoning_secondary_keywords": "Analysis of secondary keyword opportunities and semantic coverage...",
  "seo_recommendations_latest_algorithms": "Comprehensive recommendations aligned with Google's September 2025 algorithms...",
  "eeat_assessment": "Detailed E-E-A-T evaluation with specific improvement suggestions...",
  "user_intent_alignment": "Analysis of search intent alignment and user satisfaction optimization...",
  "ai_overview_optimization": "Specific recommendations for AI Overview and AI Mode optimization...",
  "confidence_assessment": "Overall confidence in the analysis and recommendations..."
}
\`\`\`

Provide actionable, data-driven recommendations that will improve search rankings and user satisfaction.`;
  }

  /**
   * Extract BERT analysis from content
   */
  private extractBERTAnalysis(data: SEOAnalysisResult): BERTContextAnalysis {
    const content = data.structured_on_page_data.headings_and_keywords
      .map(h => h.text)
      .join(' ');
    
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    return {
      bidirectional_coherence: this.calculateBidirectionalCoherence(sentences),
      contextual_relevance: this.calculateContextualRelevance(data),
      natural_language_score: this.calculateNaturalLanguageScore(sentences),
      preposition_importance: this.calculatePrepositionImportance(content),
      semantic_density: this.calculateSemanticDensity(data)
    };
  }

  /**
   * Analyze search intent
   */
  private analyzeSearchIntent(data: SEOAnalysisResult): {
    informational: number;
    navigational: number;
    transactional: number;
    commercial: number;
  } {
    const title = data.page_metadata.title_tag.toLowerCase();
    const headingsContent = data.structured_on_page_data.headings_and_keywords
      .map(h => h.text)
      .join(' ')
      .toLowerCase();
    const meta = (data.page_metadata.meta_description || '').toLowerCase();
    const content = `${title} ${headingsContent} ${meta}`.trim();
    
    return {
      informational: this.calculateIntentScore(title, content, 'informational'),
      navigational: this.calculateIntentScore(title, content, 'navigational'),
      transactional: this.calculateIntentScore(title, content, 'transactional'),
      commercial: this.calculateIntentScore(title, content, 'commercial')
    };
  }

  /**
   * Calculate bidirectional coherence
   */
  private calculateBidirectionalCoherence(sentences: string[]): number {
    if (sentences.length < 2) return 0.5;
    
    let coherenceScore = 0;
    for (let i = 0; i < sentences.length - 1; i++) {
      const current = sentences[i].toLowerCase();
      const next = sentences[i + 1].toLowerCase();
      
      const sharedWords = this.findSharedWords(current, next);
      coherenceScore += sharedWords / Math.max(current.split(' ').length, next.split(' ').length);
    }
    
    return Math.min(1.0, coherenceScore / (sentences.length - 1));
  }

  /**
   * Calculate contextual relevance
   */
  private calculateContextualRelevance(data: SEOAnalysisResult): number {
    const coreTopic = data.semantic_analysis.core_topic_analysis.main_topic.topic.toLowerCase();
    const title = data.page_metadata.title_tag.toLowerCase();
    
    const titleRelevance = coreTopic.split(' ').filter(word => 
      title.includes(word) && word.length > 2
    ).length / coreTopic.split(' ').length;
    
    return Math.min(1.0, titleRelevance);
  }

  /**
   * Calculate natural language score
   */
  private calculateNaturalLanguageScore(sentences: string[]): number {
    if (sentences.length === 0) return 0;
    
    let naturalScore = 0;
    sentences.forEach(sentence => {
      const words = sentence.split(' ');
      const hasArticles = words.some(word => ['a', 'an', 'the'].includes(word.toLowerCase()));
      const hasPrepositions = words.some(word => 
        ['for', 'with', 'without', 'in', 'on', 'at', 'by', 'from', 'to', 'of', 'about'].includes(word.toLowerCase())
      );
      
      naturalScore += (hasArticles ? 0.5 : 0) + (hasPrepositions ? 0.5 : 0);
    });
    
    return Math.min(1.0, naturalScore / sentences.length);
  }

  /**
   * Calculate preposition importance
   */
  private calculatePrepositionImportance(content: string): number {
    const words = content.toLowerCase().split(/\s+/);
    const prepositions = ['for', 'with', 'without', 'in', 'on', 'at', 'by', 'from', 'to', 'of', 'about'];
    const prepositionCount = words.filter(word => prepositions.includes(word)).length;
    
    return Math.min(1.0, prepositionCount / (words.length * 0.15));
  }

  /**
   * Calculate semantic density
   */
  private calculateSemanticDensity(data: SEOAnalysisResult): number {
    const entities = data.semantic_analysis.entity_extraction;
    const entityCount = Object.values(entities).flat().length;
    const wordCount = data.structured_on_page_data.word_count;
    
    return Math.min(1.0, entityCount / (wordCount / 100));
  }

  /**
   * Calculate intent score
   */
  private calculateIntentScore(title: string, content: string, intent: string): number {
    const intentKeywords = {
      informational: ['how', 'what', 'why', 'when', 'where', 'guide', 'tutorial', 'learn'],
      navigational: ['official', 'website', 'home', 'login', 'contact'],
      transactional: ['buy', 'purchase', 'order', 'shop', 'price', 'cost'],
      commercial: ['best', 'top', 'review', 'compare', 'vs', 'versus']
    };
    
    const keywords = intentKeywords[intent as keyof typeof intentKeywords];
    const titleMatches = keywords.filter(keyword => title.includes(keyword)).length;
    const contentMatches = keywords.filter(keyword => content.includes(keyword)).length;
    const raw = (titleMatches * 0.6 + contentMatches * 0.4) / Math.max(1, keywords.length);
    // Sensible floor to avoid all-zeros when editorial content exists
    const hasEditorialSignals = /\b(dating|tips|guide|how to|what is|review|best|top)\b/.test(content);
    const floored = Math.max(hasEditorialSignals ? 0.1 : 0, raw);
    return Math.min(1.0, floored);
  }

  /**
   * Find shared words between two sentences
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

  /**
   * NEW FEATURE: Generate AI-Ready Content (Featured Snippets, FAQ Schema, E-E-A-T, Internal Links)
   * Task 2.1-2.4 Implementation
   */
  private async generateAIReadyContent(analysisData: SEOAnalysisResult): Promise<{
    ai_overview_snippet?: string;
    optimized_faq_schema?: string;
    eeat_content_suggestion?: string;
    internal_link_boost_plan?: Array<{ source_page: string; suggested_anchor: string }>;
  }> {
    console.log('📝 Building AI-Ready Content prompt...');
    const prompt = this.buildAIReadyContentPrompt(analysisData);
    console.log('📝 Prompt built successfully, length:', prompt.length);
    
    console.log('🤖 Calling Gemini API for AI-Ready Content...');
    const result = await this.model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt }] 
      }]
    });

    if (!result?.response) {
      throw new Error('Empty response from Gemini for AI-Ready Content');
    }

    const response = await result.response;
    const text = response.text() || '';
    console.log('📥 Received response from Gemini, length:', text.length);
    
    const parsed = this.parseAIReadyContentResponse(text);
    console.log('✅ Parsed AI-Ready Content:', Object.keys(parsed));
    return parsed;
  }

  /**
   * Build prompt for AI-Ready Content Generation
   */
  private buildAIReadyContentPrompt(data: SEOAnalysisResult): string {
    return `# AI-READY CONTENT GENERATION - ACTIONABLE SEO OPTIMIZATION

## ROLE & OBJECTIVE
You are an elite SEO content strategist specializing in AI Overview optimization, Featured Snippet generation, and E-E-A-T enhancement. Your task is to generate specific, ready-to-implement content that will immediately improve this page's ranking in AI-powered search results.

## ANALYSIS DATA
\`\`\`json
${JSON.stringify({
  url: data.page_metadata.url,
  title: data.page_metadata.title_tag,
  primary_keywords: data.inferred_keywords.primary.keywords.slice(0, 3),
  core_topic: data.semantic_analysis.core_topic_analysis,
  eeat_score: data.semantic_analysis.eeat_score,
  query_fan_out: data.semantic_analysis.query_fan_out,
  headings: data.structured_on_page_data.headings_and_keywords.slice(0, 10)
}, null, 2)}
\`\`\`

## TASK 1: DIRECT ANSWER SNIPPET (ai_overview_snippet)
**Requirements:**
- Maximum 25 words
- Answer the core query directly and completely
- Optimized for Google Featured Snippets and AI Overviews
- Use natural, conversational language
- Include the primary keyword naturally

**Format:** Plain text, exactly one sentence, no markdown.

## TASK 2: FAQ SCHEMA GENERATION (optimized_faq_schema)
**Requirements:**
- Select 3-5 most relevant questions from the related queries or infer from content
- Provide concise, accurate answers (50-75 words each)
- Format as valid JSON-LD FAQPage Schema
- Ensure all JSON syntax is correct (no trailing commas, proper escaping)

**Format:** Valid JSON-LD code block ready to copy-paste into <script> tag.

## TASK 3: E-E-A-T CONTENT SUGGESTION (eeat_content_suggestion)
**Analysis:** The E-E-A-T score shows: Expertise=${data.semantic_analysis.eeat_score?.expertise || 0}, Experience=${data.semantic_analysis.eeat_score?.experience || 0}, Authoritativeness=${data.semantic_analysis.eeat_score?.authoritativeness || 0}, Trustworthiness=${data.semantic_analysis.eeat_score?.trustworthiness || 0}

**Requirements:**
- Identify the LOWEST scoring E-E-A-T component
- Generate a 100-150 word content block to boost that specific score
- If Expertise is low: Add technical depth, methodology, or framework explanation
- If Experience is low: Add first-hand account, case study intro, or personal insight
- If Authoritativeness is low: Add citations, expert quotes, or data sources
- If Trustworthiness is low: Add author credentials, contact info, or transparency statement
- Make it ready to insert directly into the page

**Format:** Plain text paragraph, ready to copy-paste.

## TASK 4: INTERNAL LINK STRATEGY (internal_link_boost_plan)
**Requirements:**
- Suggest 3 high-authority pages on the same domain that should link to this article
- For each suggestion, provide: 
  - Source page type (e.g., "Homepage", "Category: [Topic]", "High-Traffic Article: [Title]")
  - Exact anchor text to use (keyword-rich but natural)
- Prioritize pages that would pass the most authority

**Format:** Array of objects.

## OUTPUT FORMAT
Provide your response as a VALID JSON object with this exact structure:

\`\`\`json
{
  "ai_overview_snippet": "Your 25-word direct answer here",
  "optimized_faq_schema": "{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"FAQPage\\",\\"mainEntity\\":[{\\"@type\\":\\"Question\\",\\"name\\":\\"Question 1?\\",\\"acceptedAnswer\\":{\\"@type\\":\\"Answer\\",\\"text\\":\\"Answer 1\\"}}]}",
  "eeat_content_suggestion": "Your 100-150 word content block here",
  "internal_link_boost_plan": [
    {"source_page": "Homepage or High-PA Page Type", "suggested_anchor": "Natural anchor text with keyword"},
    {"source_page": "Category Page: [Topic]", "suggested_anchor": "Another natural anchor"},
    {"source_page": "High-Traffic Article: [Title]", "suggested_anchor": "Third anchor text"}
  ]
}
\`\`\`

**CRITICAL RULES:**
- Return ONLY the JSON object, no additional text
- Ensure all JSON is valid (no trailing commas, proper escaping)
- ai_overview_snippet must be ≤25 words
- optimized_faq_schema must be a valid JSON-LD string (escaped quotes)
- eeat_content_suggestion must be 100-150 words
- internal_link_boost_plan must have exactly 3 items

Generate the content now:`;
  }

  /**
   * Parse AI-Ready Content response
   */
  private parseAIReadyContentResponse(response: string): {
    ai_overview_snippet?: string;
    optimized_faq_schema?: string;
    eeat_content_suggestion?: string;
    internal_link_boost_plan?: Array<{ source_page: string; suggested_anchor: string }>;
  } {
    try {
      const cleanedResponse = response.trim();
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize
        return {
          ai_overview_snippet: this.validateSnippet(parsed.ai_overview_snippet),
          optimized_faq_schema: this.validateFAQSchema(parsed.optimized_faq_schema),
          eeat_content_suggestion: this.sanitizeText(parsed.eeat_content_suggestion),
          internal_link_boost_plan: this.validateInternalLinks(parsed.internal_link_boost_plan)
        };
      }
      
      return {};
    } catch (error) {
      console.error('Error parsing AI-Ready Content response:', error);
      return {};
    }
  }

  /**
   * Validate snippet is ≤25 words
   */
  private validateSnippet(snippet: unknown): string | undefined {
    if (typeof snippet !== 'string') return undefined;
    
    const words = snippet.trim().split(/\s+/);
    if (words.length > 25) {
      // Truncate to 25 words
      return words.slice(0, 25).join(' ') + '...';
    }
    
    return snippet.trim();
  }

  /**
   * Validate FAQ Schema is valid JSON
   */
  private validateFAQSchema(schema: unknown): string | undefined {
    if (typeof schema !== 'string') return undefined;
    
    try {
      // Try to parse to ensure it's valid JSON
      const parsed = JSON.parse(schema);
      
      // Verify it has the required FAQPage structure
      if (parsed['@type'] === 'FAQPage' && Array.isArray(parsed.mainEntity)) {
        return JSON.stringify(parsed, null, 2);
      }
      
      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Validate internal links array
   */
  private validateInternalLinks(links: unknown): Array<{ source_page: string; suggested_anchor: string }> | undefined {
    if (!Array.isArray(links)) return undefined;
    
    const validLinks = links
      .filter(link => 
        typeof link === 'object' && 
        link !== null && 
        typeof link.source_page === 'string' && 
        typeof link.suggested_anchor === 'string'
      )
      .map(link => ({
        source_page: link.source_page,
        suggested_anchor: link.suggested_anchor
      }));
    
    return validLinks.length > 0 ? validLinks : undefined;
  }

  /**
   * NEW FEATURE: Generate Domain/Page Authority Analysis
   * Authority Enhancement Implementation
   */
  private async generateAuthorityAnalysis(analysisData: SEOAnalysisResult): Promise<{
    summary: string;
    page_authority_recommendations: Array<{ type: string; priority: string; description: string }>;
    domain_authority_recommendations: Array<{ type: string; priority: string; description: string }>;
    content_linkability_score: number;
    internal_link_strength: number;
    backlink_opportunity_score: number;
  }> {
    console.log('📝 Building Authority Analysis prompt...');
    const prompt = this.buildAuthorityAnalysisPrompt(analysisData);
    console.log('📝 Prompt built successfully, length:', prompt.length);
    
    console.log('🤖 Calling Gemini API for Authority Analysis...');
    const result = await this.model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt }] 
      }]
    });

    if (!result?.response) {
      throw new Error('Empty response from Gemini for Authority Analysis');
    }

    const response = await result.response;
    const text = response.text() || '';
    console.log('📥 Received response from Gemini, length:', text.length);
    
    const parsed = this.parseAuthorityAnalysisResponse(text);
    console.log('✅ Parsed Authority Analysis, scores:', {
      linkability: parsed.content_linkability_score,
      internal: parsed.internal_link_strength,
      backlink: parsed.backlink_opportunity_score
    });
    return parsed;
  }

  /**
   * Build prompt for Authority Analysis
   */
  private buildAuthorityAnalysisPrompt(data: SEOAnalysisResult): string {
    return `# DOMAIN & PAGE AUTHORITY ENHANCEMENT ANALYSIS

## ROLE & OBJECTIVE
You are an elite SEO authority specialist focusing on Page Authority (PA) and Domain Authority (DA) optimization. Analyze this article and provide specific, actionable recommendations to increase both metrics.

## CONTEXT
**Page Authority (PA):** Page-specific ranking strength (0-100)
**Domain Authority (DA):** Overall website authority (0-100)

**Key Factors:**
- PA: On-page content quality, internal linking, unique linkable assets
- DA: Backlink profile, site-wide trust signals, technical SEO

## ARTICLE DATA
\`\`\`json
${JSON.stringify({
  url: data.page_metadata.url,
  title: data.page_metadata.title_tag,
  word_count: data.structured_on_page_data.word_count,
  headings_count: data.structured_on_page_data.headings_and_keywords.length,
  content_quality_score: data.semantic_analysis.content_quality_score,
  topical_authority_score: data.semantic_analysis.topical_authority_score,
  eeat_score: data.semantic_analysis.eeat_score,
  entities: data.semantic_analysis.entity_extraction,
  primary_keywords: data.inferred_keywords.primary.keywords.slice(0, 3)
}, null, 2)}
\`\`\`

## ANALYSIS TASKS

### 1. CONTENT LINKABILITY ASSESSMENT (0-100 score)
Evaluate if this content is a "linkable asset":
- Does it contain original data, research, or unique insights?
- Is it comprehensive enough to be a definitive resource?
- Does it have visual elements (potential for infographics/tools)?
- Is it evergreen or trending content?

### 2. INTERNAL LINK STRENGTH ASSESSMENT (0-100 score)
Evaluate internal linking structure:
- Quality and quantity of internal links within the article
- Potential for other high-authority pages to link here
- Strategic anchor text opportunities

### 3. BACKLINK OPPORTUNITY ASSESSMENT (0-100 score)
Evaluate external link potential:
- Quotable statistics or expert insights
- Potential for guest post/digital PR angles
- Industry relevance and shareability

## OUTPUT REQUIREMENTS

Provide your response as a VALID JSON object:

\`\`\`json
{
  "summary": "2-3 sentence summary of the article's current authority strengths and most critical improvement areas",
  "content_linkability_score": 75,
  "internal_link_strength": 60,
  "backlink_opportunity_score": 80,
  "page_authority_recommendations": [
    {
      "type": "Content",
      "priority": "High",
      "description": "Specific on-page improvement to boost PA (e.g., 'Expand section X with original survey data from 100+ users to create a unique, quotable statistic')"
    },
    {
      "type": "Internal Link",
      "priority": "High",
      "description": "Specific internal linking strategy (e.g., 'Add internal link from the homepage using anchor text [keyword] to pass authority to this page')"
    },
    {
      "type": "Structure",
      "priority": "Medium",
      "description": "Content structure improvement for better crawlability and featured snippet potential"
    }
  ],
  "domain_authority_recommendations": [
    {
      "type": "Linkable Asset",
      "priority": "High",
      "description": "Specific content repurposing for link building (e.g., 'Transform the 10-point checklist in Section 3 into a free, downloadable PDF tool for outreach campaigns')"
    },
    {
      "type": "Off-Page",
      "priority": "High",
      "description": "Specific link building strategy (e.g., 'Pitch the unique data in Figure 2 to industry publications like [Publication Name] for backlink acquisition')"
    },
    {
      "type": "Technical SEO",
      "priority": "Medium",
      "description": "Site-wide technical improvements (e.g., 'Optimize Core Web Vitals: compress images, implement lazy loading, minify CSS/JS')"
    }
  ]
}
\`\`\`

**RULES:**
- Scores must be realistic (0-100)
- Each recommendation must be SPECIFIC and ACTIONABLE
- Prioritize recommendations: High = Implement immediately, Medium = Plan for next quarter, Low = Long-term
- Focus on recommendations that move the needle on both PA and DA
- Page Authority recommendations: 3-5 items (focus on this specific page)
- Domain Authority recommendations: 3-5 items (focus on site-wide improvements)

Generate the analysis now:`;
  }

  /**
   * Parse Authority Analysis response
   */
  private parseAuthorityAnalysisResponse(response: string): {
    summary: string;
    page_authority_recommendations: Array<{ type: string; priority: string; description: string }>;
    domain_authority_recommendations: Array<{ type: string; priority: string; description: string }>;
    content_linkability_score: number;
    internal_link_strength: number;
    backlink_opportunity_score: number;
  } {
    try {
      const cleanedResponse = response.trim();
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        return {
          summary: typeof parsed.summary === 'string' ? parsed.summary : 'Authority analysis completed.',
          content_linkability_score: typeof parsed.content_linkability_score === 'number' ? parsed.content_linkability_score : 50,
          internal_link_strength: typeof parsed.internal_link_strength === 'number' ? parsed.internal_link_strength : 50,
          backlink_opportunity_score: typeof parsed.backlink_opportunity_score === 'number' ? parsed.backlink_opportunity_score : 50,
          page_authority_recommendations: Array.isArray(parsed.page_authority_recommendations) ? parsed.page_authority_recommendations : [],
          domain_authority_recommendations: Array.isArray(parsed.domain_authority_recommendations) ? parsed.domain_authority_recommendations : []
        };
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error parsing Authority Analysis response:', error);
      
      // Return default structure
      return {
        summary: 'Authority analysis unavailable.',
        content_linkability_score: 50,
        internal_link_strength: 50,
        backlink_opportunity_score: 50,
        page_authority_recommendations: [],
        domain_authority_recommendations: []
      };
    }
  }
}
