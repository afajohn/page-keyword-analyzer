/**
 * API Route for SEO Analysis
 * Handles analysis requests with comprehensive error handling and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { SEOAnalyzer } from '@/lib/seo-analyzer';
import { AnalysisRequest } from '@/types/seo-analysis';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { url, include_ai_analysis = true, analysis_depth = 'comprehensive' } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'URL_INVALID', 
            message: 'URL is required',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'URL_INVALID', 
            message: 'Invalid URL format',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Get Gemini API key from environment
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    // Initialize analyzer
    const analyzer = new SEOAnalyzer(geminiApiKey);

    // Create analysis request
    const analysisRequest: AnalysisRequest = {
      url,
      include_ai_analysis: include_ai_analysis && !!geminiApiKey,
      analysis_depth
    };

    // Perform analysis
    const result = await analyzer.analyzeURL(analysisRequest);

    // Return result
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          type: 'PARSE_ERROR', 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'SEO Analysis API',
      version: '1.0.0',
      endpoints: {
        'POST /api/analyze': 'Analyze a URL for SEO insights'
      },
      parameters: {
        url: 'string (required) - URL to analyze',
        include_ai_analysis: 'boolean (optional) - Include AI-powered analysis',
        analysis_depth: 'string (optional) - Analysis depth: basic, standard, comprehensive'
      }
    },
    { status: 200 }
  );
}
