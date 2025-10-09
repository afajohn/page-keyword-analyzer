/**
 * Gemini API Client
 * Advanced AI reasoning for SEO analysis with sophisticated prompt engineering
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  SEOAnalysisResult, 
  GeminiAnalysis, 
  AuthorityAnalysis, 
  AuthorityRecommendation 
} from '@/types/seo-analysis';

type GenerativeModel = ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash-lite for better availability and performance
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Perform comprehensive SEO analysis using Gemini AI
   */
  async analyzeSEO(analysisData: SEOAnalysisResult): Promise<GeminiAnalysis> {
    try {
      const prompt = this.buildAdvancedPrompt(analysisData);
      const result = await this.model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      if (!result || !result.response) {
        throw new Error('Empty response from Gemini');
      }
      const response = await result.response;
      const text = response.text?.() || '';
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text returned by Gemini');
      }

      const baseAnalysis = this.parseGeminiResponse(text);

      // NEW: Generate AI-Ready Content (async, non-blocking)
      console.log('🚀 Starting AI-Ready Content generation...');
      const aiReadyContent = await this.generateAIReadyContent(analysisData).catch(err => {
        console.error('❌ AI-Ready Content generation failed:', err);
        console.error('Error details:', err.message);
        return null;
      });
      console.log('✅ AI-Ready Content result:', aiReadyContent);

      // NEW: Generate Authority Analysis (async, non-blocking)
      console.log('🚀 Starting Authority Analysis generation...');
      const authorityAnalysis = await this.generateAuthorityAnalysis(analysisData).catch(err => {
        console.error('❌ Authority Analysis generation failed:', err);
        console.error('Error details:', err.message);
        return null;
      });
      console.log('✅ Authority Analysis result:', authorityAnalysis);

      // Merge all analyses
      return {
        ...baseAnalysis,
        ...(aiReadyContent || {}),
        authority_analysis: authorityAnalysis || undefined
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('Gemini model not found. Please check your API configuration.');
        } else if (error.message.includes('403')) {
          throw new Error('Invalid API key or insufficient permissions.');
        } else if (error.message.includes('429')) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else if (error.message.includes('401')) {
          throw new Error('Invalid API key. Please check your configuration.');
        }
      }
      
      throw new Error('AI analysis is currently unavailable. Please try again later.');
    }
  }

  /**
   * Build sophisticated prompt for Gemini analysis
   */
  private buildAdvancedPrompt(data: SEOAnalysisResult): string {
    return `
You are an expert SEO analyst with deep knowledge of Google's latest algorithms as of September 2025, including the "Perspective" update and LLM Optimization (LLMO) best practices.

**Your Mission:**
Analyze the provided comprehensive SEO data and provide expert-level reasoning and recommendations.

**Analysis Data:**
${JSON.stringify(data, null, 2)}

**Your Tasks:**

1. **PRIMARY KEYWORD REASONING** (reasoning_primary_keywords):
   - Analyze the confidence scores and source locations for each primary keyword
   - Explain WHY each keyword is considered primary based on URL, title tag, and H1 presence
   - Identify any missing keywords in critical locations
   - Provide data-backed justification for your assessment

2. **SECONDARY KEYWORD REASONING** (reasoning_secondary_keywords):
   - Evaluate the semantic relationships and co-occurrence scores
   - Explain how secondary keywords support the primary keywords
   - Identify opportunities for long-tail keyword optimization
   - Assess the quality of keyword distribution across content

3. **SEO RECOMMENDATIONS** (seo_recommendations_latest_algorithms):
   - Provide actionable recommendations based on Google's latest algorithm updates
   - Focus on E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness) improvements
   - Address "Intent Satisfaction Metrics" and user query alignment
   - Include specific suggestions for content structure and optimization

4. **E-E-A-T ASSESSMENT** (eeat_assessment):
   - Evaluate the page's demonstration of expertise, experience, authoritativeness, and trustworthiness
   - Identify specific areas for improvement
   - Suggest content additions that would enhance credibility

5. **USER INTENT ALIGNMENT** (user_intent_alignment):
   - Analyze how well the content matches user search intent
   - Identify gaps between content and likely user queries
   - Suggest improvements for better intent satisfaction

6. **AI OVERVIEW OPTIMIZATION** (ai_overview_optimization):
   - Provide specific recommendations for making content "AI-friendly"
   - Suggest FAQ structures, concise summaries, and clear headings
   - Recommend content formatting for potential inclusion in AI Overviews

7. **CONFIDENCE ASSESSMENT** (confidence_assessment):
   - Evaluate the overall quality of the SEO signals
   - Assess the reliability of the keyword analysis
   - Identify any potential issues or limitations in the data

8. **KEYWORD SELECTION FOR RANKING POTENTIAL**:
   - Answer succinctly: Based on all signals, what single keyword and what long-tail keyword have the highest probability of being selected by Google for this page?
   - Justify briefly by referencing confidence scores and source coverage (URL, title, H1, subheadings, meta, content).

**Response Format:**
Provide your analysis as a JSON object with the following structure:
{
  "reasoning_primary_keywords": "Detailed explanation of primary keyword analysis...",
  "reasoning_secondary_keywords": "Detailed explanation of secondary keyword analysis...",
  "seo_recommendations_latest_algorithms": "Actionable SEO recommendations...",
  "eeat_assessment": "E-E-A-T evaluation and suggestions...",
  "user_intent_alignment": "User intent analysis and recommendations...",
  "ai_overview_optimization": "AI Overview optimization suggestions...",
  "confidence_assessment": "Overall confidence and quality assessment...",
  "best_keyword": "single keyword with highest likelihood",
  "best_long_tail_keyword": "long-tail keyword phrase with highest likelihood"
}

**Important Guidelines:**
- Be specific and actionable in your recommendations
- Reference the actual data provided in your analysis
- Focus on the latest Google algorithm updates and best practices
- Provide concrete examples and specific improvements
- Consider both technical SEO and content quality factors
- Address modern search trends including voice search and AI-powered results

**Current Algorithm Context (September 2025):**
- Google's "Perspective" update emphasizes content quality and user satisfaction
- LLM Optimization (LLMO) is crucial for AI-powered search results
- E-E-A-T signals are more important than ever
- User intent satisfaction metrics are key ranking factors
- AI Overviews and zero-click results require specific content structuring
`;
  }

  /**
   * Parse Gemini response into structured format
   */
  private parseGeminiResponse(response: string): GeminiAnalysis {
    try {
      // Try multiple JSON extraction methods
      const jsonStr = this.extractJsonFromResponse(response);
      
      if (jsonStr) {
        // Clean up common JSON issues
        const cleanedJson = this.cleanJsonString(jsonStr);
        
        try {
          const parsed = JSON.parse(cleanedJson);
          
          // Validate and return structured response
          return {
            reasoning_primary_keywords: parsed.reasoning_primary_keywords || 'Analysis not available',
            reasoning_secondary_keywords: parsed.reasoning_secondary_keywords || 'Analysis not available',
            seo_recommendations_latest_algorithms: parsed.seo_recommendations_latest_algorithms || 'Recommendations not available',
            eeat_assessment: parsed.eeat_assessment || 'E-E-A-T assessment not available',
            user_intent_alignment: parsed.user_intent_alignment || 'User intent analysis not available',
            ai_overview_optimization: parsed.ai_overview_optimization || 'AI Overview optimization not available',
            confidence_assessment: parsed.confidence_assessment || 'Confidence assessment not available'
          };
        } catch (jsonError) {
          console.error('JSON parsing failed, trying text parsing:', jsonError);
          console.error('Cleaned JSON that failed:', cleanedJson.substring(0, 500) + '...');
          return this.parseTextResponse(response);
        }
      } else {
        // Fallback: parse as text sections
        return this.parseTextResponse(response);
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Extract JSON from response using multiple methods
   */
  private extractJsonFromResponse(response: string): string | null {
    // Method 1: Look for JSON between ```json and ```
    const codeBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1];
    }
    
    // Method 2: Look for JSON between ``` and ```
    const genericBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
    if (genericBlockMatch && genericBlockMatch[1].trim().startsWith('{')) {
      return genericBlockMatch[1];
    }
    
    // Method 3: Look for JSON object pattern
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    
    return null;
  }

  /**
   * Clean JSON string to fix common formatting issues
   */
  private cleanJsonString(jsonStr: string): string {
    return jsonStr
      // Remove any text before the first {
      .replace(/^[^{]*/, '')
      // Remove any text after the last }
      .replace(/}[^}]*$/, '}')
      // Fix escaped quotes that are double-escaped
      .replace(/\\"/g, '"')
      // Fix unescaped quotes in strings - more comprehensive approach
      .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
        return `"${p1}\\"${p2}\\"${p3}"`;
      })
      // Fix missing colons after property names
      .replace(/"([^"]+)"\s*([^":\s][^"]*)/g, (match, prop, value) => {
        // Only fix if it looks like a property name followed by a value
        if (value.trim() && !value.includes(':')) {
          return `"${prop}": "${value.trim()}"`;
        }
        return match;
      })
      // Remove any control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Fix common JSON formatting issues
      .replace(/\n\s*\n/g, '\n')
      // Ensure proper spacing around colons
      .replace(/:\s*"/g, ': "')
      // Fix specific issue with backticks in strings
      .replace(/"([^"]*`[^"]*)"/g, (match, content) => {
        return `"${content.replace(/`/g, '\\`')}"`;
      })
      // Fix bad escaped characters like \n, \t, etc.
      .replace(/\\([^"\\\/bfnrt])/g, '\\\\$1')
      // Fix specific issue with \n in JSON strings
      .replace(/\\n/g, '\\\\n')
      .trim();
  }

  /**
   * Parse text-based response when JSON parsing fails
   */
  private parseTextResponse(response: string): GeminiAnalysis {
    console.log('Parsing text response as fallback...')
    
    // Try to extract structured information from text
    const extractField = (fieldName: string): string => {
      const patterns = [
        new RegExp(`"${fieldName}"\\s*:\\s*"([^"]+)"`, 'i'),
        new RegExp(`${fieldName}\\s*:\\s*"([^"]+)"`, 'i'),
        new RegExp(`${fieldName}\\s*:\\s*([^\\n]+)`, 'i'),
        new RegExp(`"${fieldName}"\\s*:\\s*([^\\n,}]+)`, 'i')
      ]
      
      for (const pattern of patterns) {
        const match = response.match(pattern)
        if (match && match[1]) {
          return match[1].trim().replace(/^["']|["']$/g, '')
        }
      }
      
      return ''
    }

    // Extract all fields
    const reasoning_primary_keywords = extractField('reasoning_primary_keywords')
    const reasoning_secondary_keywords = extractField('reasoning_secondary_keywords')
    const seo_recommendations_latest_algorithms = extractField('seo_recommendations_latest_algorithms')
    const eeat_assessment = extractField('eeat_assessment')
    const user_intent_alignment = extractField('user_intent_alignment')
    const ai_overview_optimization = extractField('ai_overview_optimization')
    const confidence_assessment = extractField('confidence_assessment')
    const best_keyword = extractField('best_keyword')
    const best_long_tail_keyword = extractField('best_long_tail_keyword')

    // If we couldn't extract structured data, return the raw response formatted
    if (!reasoning_primary_keywords && !reasoning_secondary_keywords) {
      return {
        reasoning_primary_keywords: this.formatRawResponse(response, 'Primary Keywords Analysis'),
        reasoning_secondary_keywords: this.formatRawResponse(response, 'Secondary Keywords Analysis'),
        seo_recommendations_latest_algorithms: this.formatRawResponse(response, 'SEO Recommendations'),
        eeat_assessment: this.formatRawResponse(response, 'E-E-A-T Assessment'),
        user_intent_alignment: this.formatRawResponse(response, 'User Intent Alignment'),
        ai_overview_optimization: this.formatRawResponse(response, 'AI Overview Optimization'),
        confidence_assessment: this.formatRawResponse(response, 'Confidence Assessment'),
        best_keyword: '',
        best_long_tail_keyword: ''
      }
    }

    return {
      reasoning_primary_keywords,
      reasoning_secondary_keywords,
      seo_recommendations_latest_algorithms,
      eeat_assessment,
      user_intent_alignment,
      ai_overview_optimization,
      confidence_assessment,
      best_keyword,
      best_long_tail_keyword
    }
  }

  /**
   * Format raw response into readable sections
   */
  private formatRawResponse(response: string, sectionTitle: string): string {
    // Clean up the response
    const cleaned = response
      .replace(/^[^{]*/, '') // Remove text before first {
      .replace(/}[^}]*$/, '}') // Remove text after last }
      .replace(/\\n/g, '\n') // Convert \n to actual newlines
      .replace(/\\"/g, '"') // Fix escaped quotes
      .replace(/\\`/g, '`') // Fix escaped backticks
      .trim()

    // Try to extract content for this specific section
    const sectionPattern = new RegExp(`"([^"]*${sectionTitle.toLowerCase().replace(/[^a-z0-9]/g, '[^"]*')}[^"]*)"`, 'i')
    const match = cleaned.match(sectionPattern)
    
    if (match && match[1]) {
      return `${sectionTitle}:\n\n${match[1].replace(/\\n/g, '\n')}`
    }

    // If no specific section found, return formatted general content
    return `${sectionTitle}:\n\n${cleaned.substring(0, 500)}${cleaned.length > 500 ? '...' : ''}`
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
      confidence_assessment: 'Unable to assess confidence due to processing error.'
    };
  }

  /**
   * Validate API key format
   */
  static validateApiKey(apiKey: string): boolean {
    return !!apiKey && apiKey.length > 10 && (apiKey.startsWith('AI') || apiKey.startsWith('GEMINI'));
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
   * NEW: Generate AI-Ready Content (Featured Snippets, FAQ Schema, E-E-A-T, Internal Links)
   */
  private async generateAIReadyContent(analysisData: SEOAnalysisResult): Promise<{
    ai_overview_snippet?: string;
    optimized_faq_schema?: string;
    eeat_content_suggestion?: string;
    internal_link_boost_plan?: Array<{ source_page: string; suggested_anchor: string }>;
  }> {
    console.log('📝 Building AI-Ready Content prompt...');
    const prompt = this.buildAIReadyContentPrompt(analysisData);
    console.log('📝 Prompt built, calling Gemini...');
    
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    if (!result?.response) {
      throw new Error('Empty response from Gemini for AI-Ready Content');
    }

    const response = await result.response;
    const text = response.text() || '';
    console.log('📥 Received response, length:', text.length);
    
    return this.parseAIReadyContentResponse(text);
  }

  /**
   * Build prompt for AI-Ready Content
   */
  private buildAIReadyContentPrompt(data: SEOAnalysisResult): string {
    return `# AI-READY CONTENT GENERATION

You are an elite SEO content strategist. Generate specific, ready-to-implement content.

## ANALYSIS DATA
\`\`\`json
${JSON.stringify({
  url: data.page_metadata.url,
  title: data.page_metadata.title_tag,
  primary_keywords: data.inferred_keywords?.primary?.keywords?.slice(0, 3) || [],
  eeat_score: data.semantic_analysis?.eeat_score || {},
  query_fan_out: data.semantic_analysis?.query_fan_out || {},
  headings: data.structured_on_page_data?.headings_and_keywords?.slice(0, 10) || []
}, null, 2)}
\`\`\`

## YOUR TASKS:

1. **DIRECT ANSWER SNIPPET** (ai_overview_snippet):
   - Exactly 25 words or less
   - Direct answer to the main query
   - Natural, conversational language

2. **FAQ SCHEMA** (optimized_faq_schema):
   - Valid JSON-LD FAQPage Schema
   - 3-5 relevant questions
   - Concise answers (50-75 words each)
   - Properly escaped JSON string

3. **E-E-A-T CONTENT** (eeat_content_suggestion):
   - 100-150 words
   - Target the LOWEST E-E-A-T component
   - Ready to insert directly

4. **INTERNAL LINKS** (internal_link_boost_plan):
   - 3 recommendations
   - Format: [{"source_page": "...", "suggested_anchor": "..."}]

## OUTPUT FORMAT (CRITICAL):
Return ONLY valid JSON:

\`\`\`json
{
  "ai_overview_snippet": "Your 25-word answer here",
  "optimized_faq_schema": "{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"FAQPage\\",\\"mainEntity\\":[{\\"@type\\":\\"Question\\",\\"name\\":\\"Q1?\\",\\"acceptedAnswer\\":{\\"@type\\":\\"Answer\\",\\"text\\":\\"A1\\"}}]}",
  "eeat_content_suggestion": "Your 100-150 word content",
  "internal_link_boost_plan": [
    {"source_page": "Homepage", "suggested_anchor": "anchor text"},
    {"source_page": "Category Page", "suggested_anchor": "anchor text"},
    {"source_page": "High-Traffic Article", "suggested_anchor": "anchor text"}
  ]
}
\`\`\`

Return ONLY the JSON object. No markdown, no extra text.`;
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
      const cleanedResponse = response.trim().replace(/^```json\n?|```$/g, '');
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        return {
          ai_overview_snippet: this.validateSnippet(parsed.ai_overview_snippet),
          optimized_faq_schema: this.validateFAQSchema(parsed.optimized_faq_schema),
          eeat_content_suggestion: typeof parsed.eeat_content_suggestion === 'string' ? parsed.eeat_content_suggestion : undefined,
          internal_link_boost_plan: Array.isArray(parsed.internal_link_boost_plan) ? parsed.internal_link_boost_plan : undefined
        };
      }
      
      return {};
    } catch (error) {
      console.error('Error parsing AI-Ready Content:', error);
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
      return words.slice(0, 25).join(' ') + '...';
    }
    return snippet.trim();
  }

  /**
   * Validate FAQ Schema
   */
  private validateFAQSchema(schema: unknown): string | undefined {
    if (typeof schema !== 'string') return undefined;
    try {
      const parsed = JSON.parse(schema);
      if (parsed['@type'] === 'FAQPage' && Array.isArray(parsed.mainEntity)) {
        return JSON.stringify(parsed, null, 2);
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * NEW: Generate Domain/Page Authority Analysis
   */
  private async generateAuthorityAnalysis(analysisData: SEOAnalysisResult): Promise<AuthorityAnalysis> {
    console.log('📝 Building Authority Analysis prompt...');
    const prompt = this.buildAuthorityAnalysisPrompt(analysisData);
    console.log('📝 Prompt built, calling Gemini...');
    
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    if (!result?.response) {
      throw new Error('Empty response from Gemini for Authority Analysis');
    }

    const response = await result.response;
    const text = response.text() || '';
    console.log('📥 Received response, length:', text.length);
    
    return this.parseAuthorityAnalysisResponse(text);
  }

  /**
   * Build prompt for Authority Analysis
   */
  private buildAuthorityAnalysisPrompt(data: SEOAnalysisResult): string {
    return `# DOMAIN & PAGE AUTHORITY ANALYSIS

You are an elite SEO authority specialist. Analyze and provide specific recommendations.

## ARTICLE DATA
\`\`\`json
${JSON.stringify({
  url: data.page_metadata.url,
  title: data.page_metadata.title_tag,
  word_count: data.structured_on_page_data?.word_count || 0,
  content_quality_score: data.semantic_analysis?.content_quality_score || 0,
  eeat_score: data.semantic_analysis?.eeat_score || {},
  primary_keywords: data.inferred_keywords?.primary?.keywords?.slice(0, 3) || []
}, null, 2)}
\`\`\`

## YOUR TASKS:

Provide scores (0-100) and specific recommendations:

1. **Content Linkability Score**: How likely others will link to this
2. **Internal Link Strength**: Quality of internal linking
3. **Backlink Opportunity Score**: Potential for external links

4. **Page Authority Recommendations** (3-5 items):
   - Type: Content, Structure, or Internal Link
   - Priority: High, Medium, or Low
   - Specific, actionable description

5. **Domain Authority Recommendations** (3-5 items):
   - Type: Off-Page, Linkable Asset, or Technical SEO
   - Priority: High, Medium, or Low
   - Specific, actionable description

## OUTPUT FORMAT:
Return ONLY valid JSON:

\`\`\`json
{
  "summary": "2-3 sentence summary of authority status",
  "content_linkability_score": 75,
  "internal_link_strength": 60,
  "backlink_opportunity_score": 80,
  "page_authority_recommendations": [
    {"type": "Content", "priority": "High", "description": "Specific action"}
  ],
  "domain_authority_recommendations": [
    {"type": "Off-Page", "priority": "High", "description": "Specific action"}
  ]
}
\`\`\`

Return ONLY the JSON object.`;
  }

  /**
   * Parse Authority Analysis response
   */
  private parseAuthorityAnalysisResponse(response: string): AuthorityAnalysis {
    try {
      const cleanedResponse = response.trim().replace(/^```json\n?|```$/g, '');
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        return {
          summary: typeof parsed.summary === 'string' ? parsed.summary : 'Authority analysis completed.',
          content_linkability_score: typeof parsed.content_linkability_score === 'number' ? parsed.content_linkability_score : 50,
          internal_link_strength: typeof parsed.internal_link_strength === 'number' ? parsed.internal_link_strength : 50,
          backlink_opportunity_score: typeof parsed.backlink_opportunity_score === 'number' ? parsed.backlink_opportunity_score : 50,
          page_authority_recommendations: Array.isArray(parsed.page_authority_recommendations) ? 
            parsed.page_authority_recommendations.map((rec: any) => ({
              type: rec.type as AuthorityRecommendation['type'],
              priority: rec.priority as AuthorityRecommendation['priority'],
              description: rec.description
            })) : [],
          domain_authority_recommendations: Array.isArray(parsed.domain_authority_recommendations) ? 
            parsed.domain_authority_recommendations.map((rec: any) => ({
              type: rec.type as AuthorityRecommendation['type'],
              priority: rec.priority as AuthorityRecommendation['priority'],
              description: rec.description
            })) : []
        };
      }
      
      throw new Error('No valid JSON found');
    } catch (error) {
      console.error('Error parsing Authority Analysis:', error);
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
