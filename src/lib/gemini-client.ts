/**
 * Gemini API Client
 * Advanced AI reasoning for SEO analysis with sophisticated prompt engineering
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SEOAnalysisResult, GeminiAnalysis } from '@/types/seo-analysis';

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

      return this.parseGeminiResponse(text);
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
}
