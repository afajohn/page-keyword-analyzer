# Advanced SEO Analysis Tool

A sophisticated SEO analysis application that combines advanced HTML parsing, semantic analysis, and AI-powered reasoning using Google's Gemini API. This tool elevates from simple keyword extraction to comprehensive SEO intelligence.

## 🚀 Features

### Core Capabilities
- **Advanced HTML Parsing**: Extracts comprehensive on-page elements with semantic context
- **Semantic Analysis**: NLP processing with entity extraction and relationship mapping
- **AI-Powered Reasoning**: Gemini API integration for expert-level SEO analysis
- **Confidence Scoring**: Machine learning-based keyword confidence assessment
- **Latest Algorithm Insights**: Recommendations based on Google's Perspective update and LLMO

### Analysis Components
- **Primary Keyword Identification**: URL, title tag, and H1 analysis with confidence scoring
- **Secondary Keyword Discovery**: H2-H6 headings, meta descriptions, and content analysis
- **E-E-A-T Assessment**: Expertise, Experience, Authoritativeness, Trustworthiness evaluation
- **User Intent Alignment**: Content optimization for search intent satisfaction
- **AI Overview Optimization**: Structuring content for AI-powered search results

## 🛠️ Technical Architecture

### Enhanced JSON Schema
The application uses a sophisticated data structure that transforms raw HTML into a knowledge graph:

```json
{
  "page_metadata": {
    "url": "string",
    "title_tag": "string",
    "meta_description": "string"
  },
  "inferred_keywords_analysis": {
    "primary": {
      "confidence_score": "number (0-1)",
      "keywords": [
        {
          "term": "string",
          "extracted_from": ["title_tag", "h1_heading", "url_slug"],
          "confidence_score": "number",
          "context_sentences": ["string"]
        }
      ],
      "reasoning_summary": "string"
    }
  },
  "content_semantic_analysis": {
    "entity_extraction": {
      "people": ["string"],
      "organizations": ["string"],
      "locations": ["string"],
      "products": ["string"],
      "technologies": ["string"]
    },
    "semantic_relationships": [
      {
        "term": "string",
        "related_to_primary_keyword": "boolean",
        "relationship_type": "synonym|related_topic|attribute",
        "context_sentences": ["string"],
        "co_occurrence_score": "number"
      }
    ]
  },
  "gemini_analysis": {
    "reasoning_primary_keywords": "string",
    "reasoning_secondary_keywords": "string",
    "seo_recommendations_latest_algorithms": "string",
    "eeat_assessment": "string",
    "user_intent_alignment": "string",
    "ai_overview_optimization": "string",
    "confidence_assessment": "string"
  }
}
```

### AI Reasoning Process
The Gemini API receives a sophisticated prompt that includes:
- Complete structured data from HTML parsing
- Semantic relationships and confidence scores
- Entity extraction results
- Context sentences and co-occurrence patterns

The AI then provides:
- Data-backed reasoning for keyword identification
- Actionable recommendations based on latest algorithms
- E-E-A-T assessment and improvement suggestions
- User intent alignment analysis
- AI Overview optimization strategies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key (optional, for AI analysis)

### Installation

1. **Clone and install dependencies:**
```bash
cd kw-listing
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Get Gemini API Key:**
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add it to your `.env.local` file

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:3000`

## 📊 Usage

### Basic Analysis
1. Enter a valid URL in the analysis form
2. Choose whether to include AI-powered analysis
3. Click "Analyze SEO" to start the process
4. View comprehensive results across multiple tabs

### Export Options
- **JSON**: Complete structured data export
- **CSV**: Keyword-focused spreadsheet format
- **Markdown**: Human-readable report format

### Analysis Tabs
- **Overview**: Key metrics and summary statistics
- **Keywords**: Detailed primary and secondary keyword analysis
- **AI Analysis**: Gemini-powered insights and recommendations
- **Technical**: Raw data and technical details

## 🔧 Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_DEFAULT_ANALYSIS_DEPTH=comprehensive
NEXT_PUBLIC_MAX_ANALYSIS_TIME=30000
```

### Analysis Depth Options
- `basic`: Essential keyword extraction only
- `standard`: Includes semantic analysis
- `comprehensive`: Full analysis with AI reasoning (default)

## 🏗️ Architecture

### Core Components
- **HTMLParser**: Advanced HTML parsing with semantic extraction
- **SemanticAnalyzer**: NLP processing and entity recognition
- **KeywordInferenceEngine**: ML-based keyword identification
- **GeminiClient**: AI reasoning and analysis
- **SEOAnalyzer**: Main orchestration service

### API Endpoints
- `POST /api/analyze`: Perform comprehensive SEO analysis
- `GET /api/analyze`: API documentation and status

### Security Features
- Server-side API key management
- Input validation and sanitization
- Error handling with user-friendly messages
- Rate limiting and timeout protection

## 🎯 SEO Analysis Features

### Keyword Intelligence
- **Primary Keywords**: Identified from URL, title, and H1 with confidence scoring
- **Secondary Keywords**: Discovered from subheadings, meta tags, and content
- **Semantic Relationships**: Co-occurrence analysis and relationship mapping
- **Context Analysis**: Sentence-level keyword context extraction

### Content Analysis
- **Entity Extraction**: People, organizations, locations, products, technologies
- **Semantic Relationships**: Synonym detection and topic clustering
- **Frequency Analysis**: TF-IDF scoring and term frequency analysis
- **Readability Assessment**: Simplified Flesch Reading Ease scoring

### AI-Powered Insights
- **E-E-A-T Assessment**: Expertise, Experience, Authoritativeness, Trustworthiness
- **User Intent Alignment**: Content optimization for search intent
- **Algorithm Recommendations**: Based on Google's latest updates
- **AI Overview Optimization**: Structuring for AI-powered search results

## 🔍 Advanced Features

### Semantic Enrichment
The application goes beyond simple keyword extraction by:
- Mapping semantic relationships between terms
- Calculating co-occurrence scores
- Identifying entity types and relationships
- Providing context sentences for each keyword

### Confidence Scoring
Each keyword receives a confidence score based on:
- Presence in critical locations (URL, title, H1)
- Frequency across multiple elements
- Semantic relevance to primary keywords
- Co-occurrence patterns with other terms

### AI Reasoning
The Gemini integration provides:
- Expert-level analysis from a senior SEO perspective
- Data-backed reasoning for all recommendations
- Latest algorithm insights and best practices
- Specific, actionable improvement suggestions

## 🚧 Error Handling

The application includes comprehensive error handling:
- **URL Validation**: Format and accessibility checking
- **Network Errors**: Timeout and connection handling
- **Parse Errors**: Graceful HTML parsing failures
- **API Errors**: Gemini API failure handling
- **Rate Limiting**: Request throttling and retry logic

## 📈 Performance

### Optimization Features
- Parallel processing of analysis components
- Efficient HTML parsing with Cheerio
- Caching of semantic analysis results
- Optimized API calls with timeout handling

### Scalability
- Server-side processing for security
- Configurable analysis depth
- Export options for large datasets
- Responsive UI for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini API for advanced AI reasoning
- Cheerio for efficient HTML parsing
- Natural language processing libraries
- Modern React and Next.js ecosystem

---

**Built with ❤️ for the SEO community**

This tool represents the next generation of SEO analysis, combining traditional parsing techniques with cutting-edge AI reasoning to provide insights that go far beyond simple keyword extraction.