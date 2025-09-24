/**
 * Internal AI Analysis API Route
 * Secure wrapper for Gemini API with origin validation and structured prompting
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIAnalyzer } from '@/lib/ai-analyzer';

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * POST /api/ai-analyze
 * Internal endpoint for AI analysis - only accessible from localhost
 */
export async function POST(request: NextRequest) {
  try {
    // Security check - only allow localhost/internal requests
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    const forwarded = request.headers.get('x-forwarded-for');
    
    if (!isInternalRequest(origin, host, forwarded)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'ACCESS_DENIED', 
            message: 'Internal endpoint - access denied',
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }

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

    // Validate request body
    const body = await request.json();
    const { analysisData } = body;

    if (!analysisData) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'INVALID_REQUEST', 
            message: 'Analysis data is required',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Validate Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey || !AIAnalyzer.validateApiKey(geminiApiKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'API_KEY_INVALID', 
            message: 'Gemini API key is not configured or invalid',
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

    // Initialize AI analyzer
    const aiAnalyzer = new AIAnalyzer(geminiApiKey);

    // Test connection first
    const isConnected = await aiAnalyzer.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            type: 'AI_UNAVAILABLE', 
            message: 'AI service is currently unavailable',
            timestamp: new Date().toISOString()
          }
        },
        { status: 503 }
      );
    }

    // Perform AI analysis
    const startTime = Date.now();
    const aiAnalysis = await aiAnalyzer.analyzeSEO(analysisData);
    const processingTime = Date.now() - startTime;

    // Log successful analysis
    console.log(`AI Analysis completed in ${processingTime}ms for URL: ${analysisData.page_metadata?.url || 'unknown'}`);

    return NextResponse.json({
      success: true,
      data: {
        ...aiAnalysis,
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI Analysis API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          type: 'AI_ERROR', 
          message: 'AI analysis failed',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

/**
 * Check if request is from internal/localhost
 */
function isInternalRequest(origin: string | null, host: string | null, forwarded: string | null): boolean {
  // Allow requests from localhost
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    return true;
  }

  // Allow requests from same host (internal)
  if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
    return true;
  }

  // Allow requests from forwarded localhost
  if (forwarded && (forwarded.includes('127.0.0.1') || forwarded.includes('localhost'))) {
    return true;
  }

  // In production, you might want to allow specific internal domains
  // For now, we're restrictive for security
  return false;
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

  const key = `ai_${clientIP}`;
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
 * GET /api/ai-analyze
 * Health check and status endpoint
 */
export async function GET() {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: 'AI Analysis API',
    version: '1.0.0',
    endpoints: {
      'POST /api/ai-analyze': 'Perform AI-powered SEO analysis (internal only)'
    },
    configuration: {
      gemini_configured: !!geminiApiKey && AIAnalyzer.validateApiKey(geminiApiKey),
      rate_limit: '10 requests per minute per IP',
      access: 'Internal/localhost only'
    },
    timestamp: new Date().toISOString()
  });
}
