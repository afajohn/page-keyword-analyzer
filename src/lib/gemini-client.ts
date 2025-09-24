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
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
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
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
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
   * Parse text-based response when JSON parsing fails
   */
  private parseTextResponse(response: string): GeminiAnalysis {
    const sections = response.split(/\n(?=\d+\.|\*\*)/);
    
    return {
      reasoning_primary_keywords: this.extractSection(sections, 'primary keyword', 'reasoning'),
      reasoning_secondary_keywords: this.extractSection(sections, 'secondary keyword', 'reasoning'),
      seo_recommendations_latest_algorithms: this.extractSection(sections, 'recommendation', 'seo'),
      eeat_assessment: this.extractSection(sections, 'e-e-a-t', 'assessment'),
      user_intent_alignment: this.extractSection(sections, 'user intent', 'alignment'),
      ai_overview_optimization: this.extractSection(sections, 'ai overview', 'optimization'),
      confidence_assessment: this.extractSection(sections, 'confidence', 'assessment')
    };
  }

  /**
   * Extract specific section from text response
   */
  private extractSection(sections: string[], keyword: string, type: string): string {
    const relevantSection = sections.find(section => 
      section.toLowerCase().includes(keyword) || section.toLowerCase().includes(type)
    );
    
    if (relevantSection) {
      return relevantSection.trim();
    }
    
    return `Analysis for ${keyword} ${type} not available in the response.`;
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
