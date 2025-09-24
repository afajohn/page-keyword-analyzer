'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  SEOAnalysisResult, 
  KeywordAnalysis 
} from '@/types/seo-analysis'
import { 
  formatConfidenceScore, 
  formatTimestamp, 
  getConfidenceColor, 
  getConfidenceBgColor,
  truncateText 
} from '@/lib/utils'
import { 
  Download, 
  Copy, 
  CheckCircle, 
  TrendingUp, 
  Target,
  Brain,
  FileText,
  Users,
  Zap
} from 'lucide-react'

interface AnalysisResultsProps {
  result: SEOAnalysisResult
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'ai-analysis' | 'technical'>('overview')

  const handleCopyResults = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = (format: 'json' | 'csv' | 'markdown') => {
    const data = format === 'json' 
      ? JSON.stringify(result, null, 2)
      : format === 'csv'
      ? exportToCSV(result)
      : exportToMarkdown(result)
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-analysis-${Date.now()}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = (result: SEOAnalysisResult): string => {
    const lines: string[] = []
    lines.push('Type,Keyword,Confidence Score,Source Locations')
    
    result.inferred_keywords_analysis.primary.keywords.forEach(kw => {
      lines.push(`Primary,${kw.term},${kw.confidence_score || 0},${kw.extracted_from.join(';')}`)
    })
    
    result.inferred_keywords_analysis.secondary.keywords.forEach(kw => {
      lines.push(`Secondary,${kw.term},${kw.confidence_score || 0},${kw.extracted_from.join(';')}`)
    })
    
    return lines.join('\n')
  }

  const exportToMarkdown = (result: SEOAnalysisResult): string => {
    const lines: string[] = []
    lines.push(`# SEO Analysis Report`)
    lines.push(`**URL:** ${result.page_metadata.url}`)
    lines.push(`**Title:** ${result.page_metadata.title_tag}`)
    lines.push(`**Analysis Date:** ${formatTimestamp(result.analysis_timestamp)}`)
    lines.push('')
    
    lines.push('## Primary Keywords')
    result.inferred_keywords_analysis.primary.keywords.forEach(kw => {
      lines.push(`- **${kw.term}** (${formatConfidenceScore(kw.confidence_score || 0)} confidence)`)
    })
    
    lines.push('## Secondary Keywords')
    result.inferred_keywords_analysis.secondary.keywords.slice(0, 10).forEach(kw => {
      lines.push(`- **${kw.term}** (${formatConfidenceScore(kw.confidence_score || 0)} confidence)`)
    })
    
    if (result.gemini_analysis.reasoning_primary_keywords) {
      lines.push('## AI Analysis')
      lines.push('### SEO Recommendations')
      lines.push(result.gemini_analysis.seo_recommendations_latest_algorithms)
    }
    
    return lines.join('\n')
  }

  const KeywordCard = ({ keyword }: { keyword: KeywordAnalysis }) => (
    <div className={`p-3 rounded-lg border ${getConfidenceBgColor(keyword.confidence_score || 0)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-black">{keyword.term}</span>
        <span className={`text-sm font-medium ${getConfidenceColor(keyword.confidence_score || 0)}`}>
          {formatConfidenceScore(keyword.confidence_score || 0)}
        </span>
      </div>
      <div className="text-xs text-black">
        Found in: {keyword.extracted_from.join(', ')}
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'keywords', label: 'Keywords', icon: Target },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
    { id: 'technical', label: 'Technical', icon: FileText }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Analysis Complete
              </CardTitle>
              <CardDescription>
                {formatTimestamp(result.analysis_timestamp)} • {result.processing_time_ms}ms
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyResults}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('json')}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('markdown')}>
                <Download className="h-4 w-4 mr-2" />
                MD
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'keywords' | 'ai-analysis' | 'technical')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{result.inferred_keywords_analysis.primary.keywords.length}</div>
                  <div className="text-sm text-gray-600">Primary Keywords</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{result.inferred_keywords_analysis.secondary.keywords.length}</div>
                  <div className="text-sm text-gray-600">Secondary Keywords</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{result.structured_on_page_data.word_count.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Word Count</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{result.gemini_analysis.reasoning_primary_keywords ? 'Yes' : 'No'}</div>
                  <div className="text-sm text-gray-600">AI Analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="space-y-6">
          {/* Primary Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Primary Keywords
              </CardTitle>
              <CardDescription>
                Confidence: {formatConfidenceScore(result.inferred_keywords_analysis.primary.confidence_score)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.inferred_keywords_analysis.primary.keywords.map((keyword, index) => (
                  <KeywordCard key={index} keyword={keyword} />
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Reasoning:</strong> {result.inferred_keywords_analysis.primary.reasoning_summary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Secondary Keywords
              </CardTitle>
              <CardDescription>
                Confidence: {formatConfidenceScore(result.inferred_keywords_analysis.secondary.confidence_score)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.inferred_keywords_analysis.secondary.keywords.slice(0, 12).map((keyword, index) => (
                  <KeywordCard key={index} keyword={keyword} />
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Reasoning:</strong> {result.inferred_keywords_analysis.secondary.reasoning_summary}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'ai-analysis' && (
        <div className="space-y-6">
          {!result.gemini_analysis.reasoning_primary_keywords ? (
            <Card>
              <CardHeader>
                <CardTitle>AI analysis is currently unavailable</CardTitle>
                <CardDescription>
                  No Gemini output was returned. Ensure a valid API key is configured or try again later.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <></>
          )}

          {result.gemini_analysis.reasoning_primary_keywords && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI-Powered SEO Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {result.gemini_analysis.seo_recommendations_latest_algorithms}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    E-E-A-T Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {result.gemini_analysis.eeat_assessment}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    AI Overview Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {result.gemini_analysis.ai_overview_optimization}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {activeTab === 'technical' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>URL:</strong> {result.page_metadata.url}</div>
                <div><strong>Title:</strong> {result.page_metadata.title_tag}</div>
                <div><strong>Meta Description:</strong> {truncateText(result.page_metadata.meta_description, 100)}</div>
                <div><strong>Language:</strong> {result.page_metadata.language}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div><strong>Word Count:</strong> {result.structured_on_page_data.word_count.toLocaleString()}</div>
                <div><strong>Content Length:</strong> {result.structured_on_page_data.content_length.toLocaleString()} characters</div>
                <div><strong>Headings:</strong> {result.structured_on_page_data.headings_and_keywords.length}</div>
                <div><strong>Images:</strong> {result.structured_on_page_data.meta_data_analysis.image_alt_texts.length}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semantic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Entities Found:</strong>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">People: {result.content_semantic_analysis.entity_extraction.people.length}</div>
                      <div className="text-sm text-gray-600">Organizations: {result.content_semantic_analysis.entity_extraction.organizations.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Locations: {result.content_semantic_analysis.entity_extraction.locations.length}</div>
                      <div className="text-sm text-gray-600">Technologies: {result.content_semantic_analysis.entity_extraction.technologies.length}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <strong>Top Frequent Terms:</strong>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.content_semantic_analysis.top_frequent_terms.slice(0, 10).map((term, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm text-black">
                        {term.keyword} ({term.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
