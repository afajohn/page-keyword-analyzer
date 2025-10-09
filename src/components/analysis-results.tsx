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
  const [activeTab, setActiveTab] = useState<'overview' | 'eeat-analysis' | 'ai-analysis' | 'ai-ready-content' | 'technical' | 'query-fanout'>('overview')

  /**
   * Format AI analysis text for better readability
   */
  const formatAnalysisText = (text: string): React.ReactElement => {
    if (!text) return <></>

    // First, convert \n to actual newlines and clean up the text
    const cleanedText = text
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\`/g, '`')
      .trim()

    // Split text into paragraphs
    const paragraphs = cleanedText.split(/\n\s*\n/).filter(p => p.trim())
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          const trimmed = paragraph.trim()
          
          // Check if it's a heading (starts with specific patterns)
          if (trimmed.match(/^(Primary|Secondary|SEO|E-E-A-T|User Intent|AI Overview|Confidence|Recommendations?|Analysis|Assessment)/i)) {
            return (
              <div key={index} className="border-b border-blue-200 pb-2 mb-3">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{trimmed}</h3>
              </div>
            )
          }
          
          // Check if it contains bullet points or lists
          if (trimmed.includes('•') || trimmed.includes('-') || trimmed.includes('*')) {
            const lines = trimmed.split(/\n/)
            const listItems = lines.filter(line => line.trim().match(/^[•\-\*]\s/))
            const nonListItems = lines.filter(line => !line.trim().match(/^[•\-\*]\s/))
            
            return (
              <div key={index} className="space-y-2">
                {nonListItems.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-gray-700 leading-relaxed">
                    {formatInlineText(line.trim())}
                  </p>
                ))}
                {listItems.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {listItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700 leading-relaxed">
                        {formatInlineText(item.replace(/^[•\-\*]\s/, ''))}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          }
          
          // Check if it contains numbered lists
          if (trimmed.match(/^\d+\./)) {
            const lines = trimmed.split(/\n/)
            const numberedItems = lines.filter(line => line.trim().match(/^\d+\./))
            const nonNumberedItems = lines.filter(line => !line.trim().match(/^\d+\./))
            
            return (
              <div key={index} className="space-y-2">
                {nonNumberedItems.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-gray-700 leading-relaxed">
                    {formatInlineText(line.trim())}
                  </p>
                ))}
                {numberedItems.length > 0 && (
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    {numberedItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700 leading-relaxed">
                        {formatInlineText(item.replace(/^\d+\.\s/, ''))}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )
          }
          
          // Check if it contains key-value pairs (like "Confidence: 100%")
          if (trimmed.includes(':') && trimmed.split(':').length === 2) {
            const [key, value] = trimmed.split(':')
            return (
              <div key={index} className="bg-white p-3 rounded border-l-2 border-blue-300">
                <div className="flex">
                  <span className="font-semibold text-blue-900 min-w-0 flex-shrink-0 mr-2">
                    {key.trim()}:
                  </span>
                  <span className="text-gray-700">{formatInlineText(value.trim())}</span>
                </div>
              </div>
            )
          }
          
          // Regular paragraph - check if it contains markdown formatting
          const lines = trimmed.split(/\n/)
          if (lines.length > 1) {
            return (
              <div key={index} className="space-y-2">
                {lines.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-gray-700 leading-relaxed">
                    {formatInlineText(line.trim())}
                  </p>
                ))}
              </div>
            )
          }
          
          // Single line paragraph
          return (
            <p key={index} className="text-gray-700 leading-relaxed">
              {formatInlineText(trimmed)}
            </p>
          )
        })}
      </div>
    )
  }

  /**
   * Format inline text with markdown-like elements
   */
  const formatInlineText = (text: string): React.ReactElement => {
    if (!text) return <></>

    // Split by **bold** patterns
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            return (
              <strong key={index} className="font-semibold text-gray-900 break-words">
                {part.slice(2, -2)}
              </strong>
            )
          } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            // Italic text
            return (
              <em key={index} className="italic text-gray-800 break-words">
                {part.slice(1, -1)}
              </em>
            )
          } else if (part.includes('`')) {
            // Handle inline code
            const codeParts = part.split(/(`[^`]+`)/)
            return (
              <span key={index} className="break-words">
                {codeParts.map((codePart, codeIndex) => {
                  if (codePart.startsWith('`') && codePart.endsWith('`')) {
                    return (
                      <code key={codeIndex} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800 break-all">
                        {codePart.slice(1, -1)}
                      </code>
                    )
                  }
                  return <span key={codeIndex} className="break-words">{codePart}</span>
                })}
              </span>
            )
          } else {
            return <span key={index} className="break-words">{part}</span>
          }
        })}
      </>
    )
  }

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
    
    result.inferred_keywords.primary.keywords.forEach(kw => {
      lines.push(`Primary,${kw.term},${kw.confidence_score || 0},${kw.extracted_from.join(';')}`)
    })

    result.inferred_keywords.secondary.keywords.forEach(kw => {
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
    result.inferred_keywords.primary.keywords.forEach(kw => {
      lines.push(`- **${kw.term}** (${formatConfidenceScore(kw.confidence_score || 0)} confidence)`)
    })
    
    lines.push('## Secondary Keywords')
    result.inferred_keywords.secondary.keywords.slice(0, 10).forEach(kw => {
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
    { id: 'eeat-analysis', label: 'E-E-A-T', icon: Users },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
    { id: 'ai-ready-content', label: 'AI-Ready Content', icon: Zap },
    { id: 'technical', label: 'Technical', icon: FileText }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
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
              onClick={() => setActiveTab(tab.id as 'overview' | 'eeat-analysis' | 'query-fanout' | 'ai-analysis' | 'ai-ready-content' | 'technical')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{result.inferred_keywords.primary.keywords.length}</div>
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
                  <div className="text-2xl font-bold">{result.inferred_keywords.secondary.keywords.length}</div>
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="text-2xl font-bold">{result.semantic_analysis.eeat_score?.overall || 0}%</div>
                  <div className="text-sm text-gray-600">E-E-A-T Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{result.semantic_analysis.query_fan_out?.related_queries.length || 0}</div>
                  <div className="text-sm text-gray-600">Related Queries</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 ${result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.has_meta_keywords ? 'text-yellow-600' : 'text-green-600'}`}>
                  {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.has_meta_keywords ? '⚠️' : '✅'}
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.has_meta_keywords ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-600">Meta Keywords</div>
                  {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.has_meta_keywords && (
                    <div className="text-xs text-yellow-600 mt-1">
                      {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.keyword_count} found
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      {activeTab === 'eeat-analysis' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                E-E-A-T Analysis
              </CardTitle>
              <CardDescription>
                Expertise, Experience, Authoritativeness, and Trustworthiness Assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.semantic_analysis.eeat_score?.expertise || 0}%
                  </div>
                  <div className="text-sm text-blue-800">Expertise</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {result.semantic_analysis.eeat_score?.experience || 0}%
                  </div>
                  <div className="text-sm text-green-800">Experience</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.semantic_analysis.eeat_score?.authoritativeness || 0}%
                  </div>
                  <div className="text-sm text-purple-800">Authoritativeness</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {result.semantic_analysis.eeat_score?.trustworthiness || 0}%
                  </div>
                  <div className="text-sm text-orange-800">Trustworthiness</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-black">Overall E-E-A-T Score</span>
                  <span className="text-2xl font-bold">
                    {result.semantic_analysis.eeat_score?.overall || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${result.semantic_analysis.eeat_score?.overall || 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E-E-A-T Assessment Explanations */}
          {result.gemini_analysis?.eeat_assessment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  AI E-E-A-T Assessment
                </CardTitle>
                <CardDescription>
                  Detailed analysis of expertise, experience, authoritativeness, and trustworthiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                  <div className="prose prose-sm max-w-none break-words overflow-hidden">
                    <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                      {formatAnalysisText(result.gemini_analysis.eeat_assessment || '')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'query-fanout' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Query Fan-Out Analysis
              </CardTitle>
              <CardDescription>
                Content expansion opportunities and related query analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Primary Topics</h4>
                  <div className="space-y-2">
                    {result.semantic_analysis.query_fan_out?.primary_topics.map((topic, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded text-sm text-black font-medium">
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Related Queries</h4>
                  <div className="space-y-2">
                    {result.semantic_analysis.query_fan_out?.related_queries.slice(0, 8).map((query, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded text-sm text-black font-medium">
                        {query}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Content Gaps</h4>
                <div className="flex flex-wrap gap-2">
                  {result.semantic_analysis.query_fan_out?.content_gaps.map((gap, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-black rounded-full text-sm font-medium">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Expansion Opportunities</h4>
                <div className="flex flex-wrap gap-2">
                  {result.semantic_analysis.query_fan_out?.expansion_opportunities.slice(0, 10).map((opportunity, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-black rounded-full text-sm font-medium">
                      {opportunity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Semantic Clusters</h4>
                <div className="space-y-4">
                  {result.semantic_analysis.query_fan_out?.semantic_clusters.map((cluster, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{cluster.topic}</span>
                        <span className="text-sm text-gray-600">Strength: {cluster.strength}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cluster.related_keywords.map((keyword, kIndex) => (
                          <span key={kIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-gray-400" />
                  AI Analysis Unavailable
                </CardTitle>
                <CardDescription>
                  No Gemini output was returned. Ensure a valid API key is configured or try again later.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              {/* Primary Keywords Analysis */}
              {result.gemini_analysis.reasoning_primary_keywords && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Primary Keywords Analysis
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis of primary keyword identification and strategy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.reasoning_primary_keywords || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Secondary Keywords Analysis */}
              {result.gemini_analysis.reasoning_secondary_keywords && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Secondary Keywords Analysis
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis of secondary keyword strategy and opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.reasoning_secondary_keywords || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SEO Recommendations */}
              {result.gemini_analysis.seo_recommendations_latest_algorithms && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      SEO Recommendations
                    </CardTitle>
                    <CardDescription>
                      Strategic recommendations based on latest Google algorithms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.seo_recommendations_latest_algorithms || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* E-E-A-T Assessment */}
              {result.gemini_analysis.eeat_assessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                      E-E-A-T Assessment
                    </CardTitle>
                    <CardDescription>
                      Expertise, Experience, Authoritativeness, and Trustworthiness analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.eeat_assessment || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Intent Alignment */}
              {result.gemini_analysis.user_intent_alignment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      User Intent Alignment
                    </CardTitle>
                    <CardDescription>
                      Analysis of how well content matches user search intent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.user_intent_alignment || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Overview Optimization */}
              {result.gemini_analysis.ai_overview_optimization && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      AI Overview Optimization
                    </CardTitle>
                    <CardDescription>
                      Recommendations for optimizing content for AI-powered search results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.ai_overview_optimization || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Confidence Assessment */}
              {result.gemini_analysis.confidence_assessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Confidence Assessment
                    </CardTitle>
                    <CardDescription>
                      Overall assessment of analysis quality and reliability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <div className="prose prose-sm max-w-none break-words overflow-hidden">
                        <div className="text-gray-800 leading-relaxed break-words whitespace-normal">
                          {formatAnalysisText(result.gemini_analysis.confidence_assessment || '')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* BERT Optimization tab removed */}
      {false && (
        <div className="space-y-6">
          {/* BERT Context Analysis */}
          {result.gemini_analysis.bert_context_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  BERT Context Analysis
                </CardTitle>
                <CardDescription>
                  Analysis based on BERT&apos;s bidirectional understanding principles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Bidirectional Coherence</div>
                    <div className="text-2xl font-bold text-purple-600">0%</div>
                    <div className="text-xs text-gray-500">Content flow in both directions</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Contextual Relevance</div>
                    <div className="text-2xl font-bold text-blue-600">0%</div>
                    <div className="text-xs text-gray-500">Topic alignment and relevance</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Natural Language Score</div>
                    <div className="text-2xl font-bold text-green-600">0%</div>
                    <div className="text-xs text-gray-500">Conversational optimization</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Preposition Importance</div>
                    <div className="text-2xl font-bold text-orange-600">0%</div>
                    <div className="text-xs text-gray-500">Context-providing prepositions</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Semantic Density</div>
                    <div className="text-2xl font-bold text-indigo-600">0%</div>
                    <div className="text-xs text-gray-500">Information richness</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimized Keywords (disabled) */}
          {false && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  BERT-Optimized Keywords
                </CardTitle>
                <CardDescription>
                  High-potential keywords with search volume analysis and BERT context scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(result.gemini_analysis.optimized_keywords || []).slice(0, 10).map((keyword, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                            {keyword.keyword_type}
                          </span>
                          <span className="font-semibold text-lg text-black">{keyword.keyword}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {keyword.search_volume_potential.estimated_monthly_searches.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">monthly searches</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Competition</div>
                          <div className={`font-medium ${
                            keyword.search_volume_potential.competition_level === 'low' ? 'text-green-600' :
                            keyword.search_volume_potential.competition_level === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {keyword.search_volume_potential.competition_level}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">BERT Score</div>
                          <div className="font-medium text-purple-600">
                            {Math.round(keyword.bert_context_score.contextual_relevance * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Confidence</div>
                          <div className="font-medium text-blue-600">
                            {Math.round(keyword.confidence_score * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Current Usage</div>
                          <div className="font-medium text-gray-700">
                            {keyword.current_performance.frequency}x
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm text-gray-600 mb-1">Current Performance:</div>
                        <div className="flex flex-wrap gap-2">
                          {keyword.current_performance.found_in_title && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Title</span>
                          )}
                          {keyword.current_performance.found_in_h1 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">H1</span>
                          )}
                          {keyword.current_performance.found_in_meta_description && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Meta</span>
                          )}
                          {keyword.current_performance.found_in_content && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Content</span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 mb-2">{keyword.reasoning}</div>
                      
                      {keyword.optimization_recommendations.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Recommendations:</div>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {keyword.optimization_recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meta Description Optimization */}
          {result.gemini_analysis.meta_description_optimization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Meta Description Optimization
                </CardTitle>
                <CardDescription>
                  AEO, GEO, and AI Overview optimized meta description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Current Description:</div>
                    <div className="p-3 bg-gray-50 rounded border text-sm text-black">
                      {result.gemini_analysis.meta_description_optimization?.current_description || ''}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Optimized Description:</div>
                    <div className="p-3 bg-green-50 rounded border text-sm text-black">
                      {result.gemini_analysis.meta_description_optimization?.optimized_description || ''}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600">Optimization Score</div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((result.gemini_analysis.meta_description_optimization?.optimization_score || 0) * 100)}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600">AEO Ready</div>
                      <div className="flex gap-2">
                        {result.gemini_analysis.meta_description_optimization?.aeo_optimization?.answer_focused && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Answer-focused</span>
                        )}
                        {result.gemini_analysis.meta_description_optimization?.aeo_optimization?.featured_snippet_ready && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Snippet-ready</span>
                        )}
                        {result.gemini_analysis.meta_description_optimization?.aeo_optimization?.conversational_tone && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Conversational</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600">AI Overview Ready</div>
                      <div className="flex gap-2">
                        {result.gemini_analysis.meta_description_optimization?.ai_overview_optimization?.structured_for_ai && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Structured</span>
                        )}
                        {result.gemini_analysis.meta_description_optimization?.ai_overview_optimization?.context_rich && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Context-rich</span>
                        )}
                        {result.gemini_analysis.meta_description_optimization?.ai_overview_optimization?.intent_aligned && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Intent-aligned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Reasoning:</div>
                    <div className="text-sm text-gray-700 text-white">
                      {result.gemini_analysis.meta_description_optimization?.reasoning || ''}
                    </div>
                  </div>

                  {((result.gemini_analysis.meta_description_optimization?.improvements || []).length > 0) && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Improvements:</div>
                      <ul className="text-sm text-gray-700 space-y-1 text-white">
                        {(result.gemini_analysis.meta_description_optimization?.improvements || []).map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Intent Analysis */}
          {result.gemini_analysis.search_intent_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Search Intent Analysis
                </CardTitle>
                <CardDescription>
                  BERT-aware analysis of user search intent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Informational</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(((result.gemini_analysis.search_intent_analysis?.informational) || 0) * 100)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Navigational</div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(((result.gemini_analysis.search_intent_analysis?.navigational) || 0) * 100)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Transactional</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(((result.gemini_analysis.search_intent_analysis?.transactional) || 0) * 100)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Commercial</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(((result.gemini_analysis.search_intent_analysis?.commercial) || 0) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* NEW: AI-Ready Content Tab */}
      {activeTab === 'ai-ready-content' && (
        <div className="space-y-6">
          {!result.gemini_analysis.ai_overview_snippet && 
           !result.gemini_analysis.optimized_faq_schema && 
           !result.gemini_analysis.eeat_content_suggestion && 
           !result.gemini_analysis.internal_link_boost_plan &&
           !result.gemini_analysis.authority_analysis ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gray-400" />
                  AI-Ready Content Unavailable
                </CardTitle>
                <CardDescription>
                  AI-generated content recommendations are not available. Ensure AI analysis is enabled and the Gemini API key is configured.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              {/* Direct Answer Snippet for Featured Snippets */}
              {result.gemini_analysis.ai_overview_snippet && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Featured Snippet / AI Overview Answer
                    </CardTitle>
                    <CardDescription>
                      Optimized direct answer (≤25 words) ready for Featured Snippets and AI Overviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-900 leading-relaxed">
                            {result.gemini_analysis.ai_overview_snippet}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(result.gemini_analysis.ai_overview_snippet || '');
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              {copied ? 'Copied!' : 'Copy Snippet'}
                            </Button>
                            <span className="text-xs text-gray-500">
                              {result.gemini_analysis.ai_overview_snippet.split(/\s+/).length} words
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>How to use:</strong> Add this answer at the very beginning of your article or in a prominent FAQ section to increase chances of appearing in Featured Snippets and AI Overviews.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAQ Schema (JSON-LD) */}
              {result.gemini_analysis.optimized_faq_schema && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      FAQ Schema (JSON-LD)
                    </CardTitle>
                    <CardDescription>
                      Ready-to-implement FAQPage Schema Markup for enhanced SERP visibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg p-4 relative overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-words">
                          {result.gemini_analysis.optimized_faq_schema}
                        </pre>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700"
                          onClick={() => {
                            navigator.clipboard.writeText(result.gemini_analysis.optimized_faq_schema || '');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copied ? 'Copied!' : 'Copy Code'}
                        </Button>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-green-900">
                          <strong>Implementation Instructions:</strong>
                        </p>
                        <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                          <li>Copy the JSON-LD code above</li>
                          <li>Paste it inside a <code className="bg-green-100 px-1 rounded">&lt;script type=&quot;application/ld+json&quot;&gt;</code> tag</li>
                          <li>Place the script tag in the <code className="bg-green-100 px-1 rounded">&lt;head&gt;</code> section of your HTML</li>
                          <li>Test using Google&apos;s <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="underline font-medium">Rich Results Test</a></li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* E-E-A-T Content Suggestion */}
              {result.gemini_analysis.eeat_content_suggestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      E-E-A-T Enhancement Content
                    </CardTitle>
                    <CardDescription>
                      Ready-to-insert content block to boost your lowest E-E-A-T score component
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                        <div className="prose prose-sm max-w-none text-gray-800">
                          {result.gemini_analysis.eeat_content_suggestion}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(result.gemini_analysis.eeat_content_suggestion || '');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copied ? 'Copied!' : 'Copy Content'}
                        </Button>
                        <span className="text-xs text-gray-500">
                          {result.gemini_analysis.eeat_content_suggestion.split(/\s+/).length} words
                        </span>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-900">
                          <strong>Where to add:</strong> Insert this content in the &quot;About the Author&quot; section, case study introduction, or as a credibility statement near the top of your article.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Internal Link Strategy */}
              {result.gemini_analysis.internal_link_boost_plan && result.gemini_analysis.internal_link_boost_plan.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Internal Link Strategy
                    </CardTitle>
                    <CardDescription>
                      High-authority pages that should link to this article to boost Page Authority
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b-2 border-gray-200">
                            <th className="text-left p-3 font-semibold text-gray-700">Source Page</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Suggested Anchor Text</th>
                            <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.gemini_analysis.internal_link_boost_plan.map((link, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-3 text-gray-800">{link.source_page}</td>
                              <td className="p-3">
                                <code className="bg-orange-50 text-orange-800 px-2 py-1 rounded text-sm">
                                  {link.suggested_anchor}
                                </code>
                              </td>
                              <td className="p-3 text-center">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${link.source_page}: "${link.suggested_anchor}"`);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-900">
                        <strong>Implementation:</strong> Add internal links from these high-authority pages using the suggested anchor text to pass link equity to this article and improve its Page Authority score.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Domain/Page Authority Analysis */}
              {result.gemini_analysis.authority_analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      Domain & Page Authority Enhancement
                    </CardTitle>
                    <CardDescription>
                      Comprehensive analysis and actionable recommendations to boost PA and DA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Summary */}
                      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
                        <p className="text-sm text-indigo-900">{result.gemini_analysis.authority_analysis.summary}</p>
                      </div>

                      {/* Authority Scores */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-600 mb-2">Content Linkability</div>
                          <div className="text-3xl font-bold text-blue-600">
                            {result.gemini_analysis.authority_analysis.content_linkability_score}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Out of 100</div>
                        </div>
                        <div className="bg-white border rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-600 mb-2">Internal Link Strength</div>
                          <div className="text-3xl font-bold text-green-600">
                            {result.gemini_analysis.authority_analysis.internal_link_strength}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Out of 100</div>
                        </div>
                        <div className="bg-white border rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-600 mb-2">Backlink Opportunity</div>
                          <div className="text-3xl font-bold text-purple-600">
                            {result.gemini_analysis.authority_analysis.backlink_opportunity_score}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Out of 100</div>
                        </div>
                      </div>

                      {/* Page Authority Recommendations */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          Page Authority (PA) Recommendations
                        </h4>
                        <div className="space-y-3">
                          {result.gemini_analysis.authority_analysis.page_authority_recommendations.map((rec, index) => (
                            <div 
                              key={index} 
                              className={`border-l-4 p-4 rounded-lg ${
                                rec.priority === 'High' ? 'border-red-500 bg-red-50' :
                                rec.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                                'border-gray-500 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                      rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {rec.priority} Priority
                                    </span>
                                    <span className="text-xs font-medium text-gray-600">{rec.type}</span>
                                  </div>
                                  <p className="text-sm text-gray-800">{rec.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Domain Authority Recommendations */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-purple-600" />
                          Domain Authority (DA) Recommendations
                        </h4>
                        <div className="space-y-3">
                          {result.gemini_analysis.authority_analysis.domain_authority_recommendations.map((rec, index) => (
                            <div 
                              key={index} 
                              className={`border-l-4 p-4 rounded-lg ${
                                rec.priority === 'High' ? 'border-red-500 bg-red-50' :
                                rec.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                                'border-gray-500 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                      rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {rec.priority} Priority
                                    </span>
                                    <span className="text-xs font-medium text-gray-600">{rec.type}</span>
                                  </div>
                                  <p className="text-sm text-gray-800">{rec.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                
                {/* Meta Keywords Analysis */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <strong>Meta Keywords:</strong>
                    {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.has_meta_keywords ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        Found ({result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.keyword_count} keywords)
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Not Found
                      </span>
                    )}
                  </div>
                  
                  {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.has_meta_keywords && (
                    <div className="space-y-2">
                      {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.warning && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <div className="text-yellow-600">⚠️</div>
                            <div className="text-sm text-yellow-800">
                              {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.warning}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.raw_content && (
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Raw Content:</div>
                          <div className="text-sm bg-gray-50 p-2 rounded border font-mono text-black">
                            {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.raw_content}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Extracted Keywords:</div>
                        <div className="flex flex-wrap gap-1">
                          {result.structured_on_page_data.meta_data_analysis.meta_keywords_analysis.keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                      <div className="text-sm text-gray-600">People: {result.semantic_analysis.entity_extraction.people.length}</div>
                      <div className="text-sm text-gray-600">Organizations: {result.semantic_analysis.entity_extraction.organizations.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Locations: {result.semantic_analysis.entity_extraction.locations.length}</div>
                      <div className="text-sm text-gray-600">Technologies: {result.semantic_analysis.entity_extraction.technologies.length}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <strong>Top Frequent Terms:</strong>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.semantic_analysis.top_frequent_terms.slice(0, 10).map((term, index) => (
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

