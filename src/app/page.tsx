'use client'

import { useState } from 'react'
import { AnalysisForm } from '@/components/analysis-form'
import { AnalysisResults } from '@/components/analysis-results'
import { AnalysisResponse, SEOAnalysisResult } from '@/types/seo-analysis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Brain, Target, Zap } from 'lucide-react'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<SEOAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalysisComplete = (response: AnalysisResponse) => {
    setIsLoading(false)
    if (response.success && response.data) {
      setAnalysisResult(response.data)
    }
  }

  const handleNewAnalysis = () => {
    setAnalysisResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced SEO Analysis Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive SEO analysis powered by AI reasoning. Analyze keywords, 
            content structure, and get actionable recommendations based on the latest Google algorithms.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Smart Parsing</h3>
              <p className="text-sm text-gray-600">
                Advanced HTML parsing with semantic analysis and entity extraction
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Keyword Intelligence</h3>
              <p className="text-sm text-gray-600">
                AI-powered primary and secondary keyword identification with confidence scoring
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">AI Reasoning</h3>
              <p className="text-sm text-gray-600">
                Gemini-powered analysis with E-E-A-T assessment and algorithm insights
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Latest Algorithms</h3>
              <p className="text-sm text-gray-600">
                Recommendations based on Google's Perspective update and LLMO best practices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {!analysisResult ? (
          <div className="flex flex-col items-center">
            <AnalysisForm 
              onAnalysisComplete={handleAnalysisComplete}
              isLoading={isLoading}
              onStartLoading={() => setIsLoading(true)}
            />
            
            {/* Instructions */}
            <Card className="w-full max-w-2xl mt-8">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Our advanced SEO analysis process combines multiple AI techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">HTML Parsing & Extraction</h4>
                      <p className="text-sm text-gray-600">
                        Advanced parsing extracts title tags, headings, meta descriptions, 
                        URL structure, and content elements with semantic context.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Semantic Analysis</h4>
                      <p className="text-sm text-gray-600">
                        NLP processing identifies entities, relationships, and frequent terms 
                        with TF-IDF scoring and co-occurrence analysis.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Keyword Inference</h4>
                      <p className="text-sm text-gray-600">
                        Machine learning algorithms analyze keyword signals across multiple 
                        locations with confidence scoring and reasoning.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">AI-Powered Insights</h4>
                      <p className="text-sm text-gray-600">
                        Gemini AI provides expert-level analysis with recommendations 
                        based on the latest Google algorithm updates and E-E-A-T principles.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={handleNewAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Analysis
              </button>
            </div>
            <AnalysisResults result={analysisResult} />
          </div>
        )}
      </div>
    </div>
  )
}