/**
 * Environment Configuration
 * Centralized configuration for the SEO analysis application
 */

export const config = {
  // Gemini API Configuration
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  
  // Analysis Settings
  defaultAnalysisDepth: process.env.NEXT_PUBLIC_DEFAULT_ANALYSIS_DEPTH || 'comprehensive',
  maxAnalysisTime: parseInt(process.env.NEXT_PUBLIC_MAX_ANALYSIS_TIME || '30000'),
  
  // API Settings
  apiTimeout: 10000,
  maxRetries: 3,
  
  // UI Settings
  maxKeywordsDisplay: 50,
  maxContextSentences: 3,
  
  // Validation
  minUrlLength: 10,
  maxUrlLength: 2048,
  
  // Feature Flags
  enableAIAnalysis: !!process.env.GEMINI_API_KEY,
  enableAdvancedSemantics: true,
  enableEntityExtraction: true,
  
  // Error Messages
  messages: {
    urlRequired: 'Please enter a valid URL',
    urlInvalid: 'Invalid URL format',
    fetchError: 'Failed to fetch webpage content',
    parseError: 'Failed to analyze webpage',
    geminiError: 'AI analysis is currently unavailable',
    networkError: 'Network error. Please try again.',
    rateLimitError: 'Too many requests. Please try again later.'
  }
} as const

export type Config = typeof config
