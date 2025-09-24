'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { AnalysisRequest, AnalysisResponse } from '@/types/seo-analysis'

interface AnalysisFormProps {
  onAnalysisComplete: (result: AnalysisResponse) => void
  isLoading: boolean
  onStartLoading: () => void
}

export const AnalysisForm = ({ onAnalysisComplete, isLoading, onStartLoading }: AnalysisFormProps) => {
  const [url, setUrl] = useState('')
  const [includeAI, setIncludeAI] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    try {
      onStartLoading()
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          include_ai_analysis: includeAI,
          analysis_depth: 'comprehensive'
        } as AnalysisRequest),
      })

      const result: AnalysisResponse = await response.json()
      
      if (result.success) {
        onAnalysisComplete(result)
      } else {
        setError(result.error?.message || 'Analysis failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Analysis error:', err)
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          SEO Analysis Tool
        </CardTitle>
        <CardDescription>
          Enter a URL to perform comprehensive SEO analysis with AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={error ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-ai"
              checked={includeAI}
              onChange={(e) => setIncludeAI(e.target.checked)}
              className="rounded border-gray-300"
              disabled={isLoading}
            />
            <label htmlFor="include-ai" className="text-sm font-medium">
              Include AI-powered analysis (requires Gemini API key)
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !url.trim() || !isValidUrl(url)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze SEO
              </>
            )}
          </Button>
        </form>

        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 flex items-center gap-3 rounded-md bg-blue-50 px-4 py-3 text-blue-900"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Processing your data…</span>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What this tool analyzes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Primary and secondary keyword identification</li>
            <li>• On-page SEO elements (title, headings, meta tags)</li>
            <li>• Content structure and semantic analysis</li>
            <li>• AI-powered recommendations based on latest algorithms</li>
            <li>• E-E-A-T assessment and optimization suggestions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
