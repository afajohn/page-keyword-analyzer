/**
 * Enhanced API Route for SEO Analysis
 * Handles analysis requests with comprehensive error handling, security, and AI integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { SEOAnalyzer } from '@/lib/seo-analyzer';
import { AnalysisRequest } from '@/types/seo-analysis';
import { z } from 'zod';

// Request validation schema
const AnalysisRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  include_ai_analysis: z.boolean().optional().default(true),
  analysis_depth: z.enum(['basic', 'standard', 'comprehensive']).optional().default('comprehensive')
});

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = AnalysisRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'VALIDATION_ERROR', 
            message: 'Invalid request parameters',
            details: validationResult.error.errors.map(e => e.message).join(', '),
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const { url, include_ai_analysis, analysis_depth } = validationResult.data;

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'RATE_LIMITED', 
            message: 'Too many requests. Please try again later.',
            timestamp: new Date().toISOString()
          }
        },
        { status: 429 }
      );
    }

    // Enhanced URL validation with security checks
    const urlValidation = validateUrlSecurity(url);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'URL_INVALID', 
            message: urlValidation.message,
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

    // Perform deterministic analysis
    const result = await analyzer.analyzeURL(analysisRequest);

    if (!result.success || !result.data) {
      return NextResponse.json(result, { status: 500 });
    }

    // If AI analysis is requested and API key is available, call internal AI endpoint
    if (include_ai_analysis && geminiApiKey) {
      try {
        const aiResponse = await fetch(`${getBaseUrl(request)}/api/ai-analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analysisData: result.data
          })
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          if (aiResult.success && aiResult.data) {
            // Merge AI analysis into the result
            result.data.gemini_analysis = {
              ...result.data.gemini_analysis,
              ...aiResult.data
            };
          }
        } else {
          console.warn('AI analysis failed, returning deterministic analysis only');
        }
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        // Continue with deterministic analysis only
      }
    }

    // Add processing time
    const totalProcessingTime = Date.now() - startTime;
    result.data.processing_time_ms = totalProcessingTime;

    // Log successful analysis
    console.log(`Analysis completed in ${totalProcessingTime}ms for URL: ${url}`);

    return NextResponse.json(result, { status: 200 });

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

/**
 * Enhanced URL validation with security checks
 */
function validateUrlSecurity(url: string): { isValid: boolean; message: string } {
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, message: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Check for private/localhost IPs (SSRF protection)
    if (urlObj.hostname === 'localhost' || 
        urlObj.hostname === '127.0.0.1' ||
        urlObj.hostname.startsWith('192.168.') ||
        urlObj.hostname.startsWith('10.') ||
        urlObj.hostname.startsWith('172.') ||
        urlObj.hostname === '0.0.0.0') {
      return { isValid: false, message: 'Private/localhost URLs are not allowed' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /file:\/\//,
      /ftp:\/\//,
      /gopher:\/\//,
      /data:/,
      /javascript:/,
      /vbscript:/
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return { isValid: false, message: 'Suspicious URL pattern detected' };
    }

    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Invalid URL format' };
  }
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Check rate limit for client IP
 */
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 10; // Max 10 requests per minute per IP

  const key = `analyze_${clientIP}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  // Increment count
  current.count++;
  rateLimitStore.set(key, current);

  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance
    cleanupExpiredEntries();
  }

  return true;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get base URL for internal API calls
 */
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  return 'http://localhost:3000';
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
