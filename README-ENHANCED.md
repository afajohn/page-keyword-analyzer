# 🚀 Advanced AI-Powered SEO Analysis Engine

A sophisticated, production-ready SEO analysis application that combines advanced HTML parsing, semantic analysis, and AI-powered reasoning using Google's Gemini API. This tool represents the next generation of SEO analysis, providing comprehensive insights that go far beyond simple keyword extraction.

## ✨ Key Features

### 🧠 Advanced AI Integration
- **Chain-of-Thought Prompting**: Sophisticated prompt engineering for comprehensive analysis
- **Gemini 1.5 Pro Integration**: Latest AI model for expert-level SEO insights
- **Structured AI Responses**: JSON-formatted outputs with fallback text parsing
- **Internal API Security**: Secure internal AI endpoint with origin validation

### 📊 Enhanced Semantic Analysis
- **E-E-A-T Scoring**: Expertise, Experience, Authoritativeness, and Trustworthiness assessment
- **Query Fan-Out Analysis**: Content expansion opportunities and related query identification
- **Advanced Entity Extraction**: People, organizations, locations, products, and technologies
- **User Intent Analysis**: Informational, navigational, transactional, and commercial intent signals
- **Content Quality Metrics**: Readability, topical authority, and semantic clustering

### 🔒 Production-Ready Security
- **SSRF Protection**: Comprehensive URL validation and security checks
- **Rate Limiting**: IP-based request throttling with cleanup
- **Input Validation**: Zod schema validation for all API inputs
- **Error Handling**: Structured error responses with detailed logging
- **Internal API Protection**: Localhost-only AI endpoint access

### 🎯 Advanced Keyword Analysis
- **Confidence Scoring**: Machine learning-based keyword confidence assessment
- **Multi-Source Analysis**: URL, title, headings, meta tags, and content analysis
- **Semantic Relationships**: Co-occurrence patterns and relationship mapping
- **TF-IDF Analysis**: Advanced term frequency and document frequency scoring

### 🎨 Modern UI/UX
- **Shadcn/UI Components**: Beautiful, accessible component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Tabs**: Overview, Keywords, E-E-A-T, Query Fan-Out, AI Analysis, and Technical views
- **Export Options**: JSON, CSV, and Markdown export formats
- **Loading States**: Skeleton loading and progress indicators

## 🏗️ Architecture

### Core Components
```
src/
├── lib/
│   ├── ai-analyzer.ts              # Advanced AI analysis with Chain-of-Thought
│   ├── advanced-semantic-analyzer.ts # Enhanced semantic analysis
│   ├── keyword-inference.ts        # ML-based keyword identification
│   ├── html-parser.ts              # Robust HTML parsing
│   └── seo-analyzer.ts             # Main orchestration service
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # Main analysis endpoint
│   │   └── ai-analyze/route.ts     # Internal AI endpoint
│   └── page.tsx                    # Main application page
├── components/
│   ├── analysis-form.tsx           # URL input and configuration
│   ├── analysis-results.tsx        # Comprehensive results display
│   └── ui/                         # Shadcn/UI components
└── types/
    └── seo-analysis.ts             # Comprehensive type definitions
```

### API Endpoints

#### `POST /api/analyze`
Main analysis endpoint with comprehensive features:
- **Input**: `{ url: string, include_ai_analysis?: boolean, analysis_depth?: 'basic'|'standard'|'comprehensive' }`
- **Security**: URL validation, SSRF protection, rate limiting
- **Processing**: Deterministic analysis + optional AI enhancement
- **Output**: Complete SEO analysis with all metrics

#### `POST /api/ai-analyze` (Internal)
Secure AI analysis endpoint:
- **Access**: Localhost/internal requests only
- **Input**: Structured analysis data
- **Processing**: Gemini 1.5 Pro with advanced prompting
- **Output**: AI insights and recommendations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Gemini API key (optional, for AI analysis)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd page-keyword-analyzer
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

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck
```

## 📊 Analysis Features

### Overview Tab
- **Primary Keywords**: High-confidence keywords from critical locations
- **Secondary Keywords**: Supporting keywords from content analysis
- **Word Count**: Total content analysis
- **AI Analysis**: Gemini integration status
- **E-E-A-T Score**: Overall quality assessment
- **Related Queries**: Query fan-out opportunities

### Keywords Tab
- **Confidence Scores**: Percentage confidence for each keyword
- **Source Locations**: Where each keyword was found (URL, title, H1, etc.)
- **Reasoning**: Detailed explanation for keyword identification
- **Visual Indicators**: Color-coded confidence levels

### E-E-A-T Analysis Tab
- **Expertise Score**: Technical depth and knowledge demonstration
- **Experience Score**: First-hand accounts and practical examples
- **Authoritativeness Score**: Citations, references, and credibility
- **Trustworthiness Score**: Contact info, security, and transparency
- **Overall Score**: Weighted average with progress visualization

### Query Fan-Out Tab
- **Primary Topics**: Main content themes identified
- **Related Queries**: Generated query suggestions
- **Content Gaps**: Missing content opportunities
- **Expansion Opportunities**: Specific content recommendations
- **Semantic Clusters**: Topic groups with strength scores

### AI Analysis Tab
- **SEO Recommendations**: Latest algorithm insights
- **E-E-A-T Assessment**: AI-powered quality evaluation
- **User Intent Alignment**: Search intent optimization
- **AI Overview Optimization**: Structured content for AI search
- **Confidence Assessment**: Overall analysis reliability

### Technical Tab
- **Page Metadata**: URL, title, description, language
- **Content Analysis**: Word count, headings, images
- **Semantic Analysis**: Entities, relationships, frequent terms
- **Raw Data**: Complete structured data export

## 🔧 Configuration

### Environment Variables
```env
# Required for AI analysis
GEMINI_API_KEY=your_api_key_here

# Optional settings
NEXT_PUBLIC_DEFAULT_ANALYSIS_DEPTH=comprehensive
NEXT_PUBLIC_MAX_ANALYSIS_TIME=30000
```

### Analysis Depth Options
- **basic**: Essential keyword extraction only
- **standard**: Includes semantic analysis
- **comprehensive**: Full analysis with AI reasoning (recommended)

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Contract Tests**: Data structure validation
- **Security Tests**: URL validation and SSRF protection

### Test Files
- `src/lib/__tests__/ai-analyzer.test.ts` - AI analysis functionality
- `src/lib/__tests__/advanced-semantic-analyzer.test.ts` - Semantic analysis
- `src/lib/__tests__/api-contract.test.ts` - API contract validation

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add `GEMINI_API_KEY` in Vercel dashboard
3. **Build Settings**: Uses `next build --turbopack` by default
4. **Deploy**: Automatic deployment on push to main branch

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📈 Performance

### Optimization Features
- **Parallel Processing**: Concurrent analysis components
- **Efficient Parsing**: Cheerio-based HTML processing
- **Caching**: Semantic analysis result caching
- **Rate Limiting**: Request throttling and cleanup
- **Memory Management**: Efficient data structures

### Scalability
- **Server-side Processing**: Secure, scalable analysis
- **Configurable Depth**: Adjustable analysis complexity
- **Export Options**: Large dataset handling
- **Responsive UI**: All screen sizes supported

## 🔒 Security

### Security Features
- **SSRF Protection**: Private IP and localhost blocking
- **URL Validation**: Comprehensive security checks
- **Rate Limiting**: IP-based request throttling
- **Input Sanitization**: Zod schema validation
- **Internal API Security**: Origin validation for AI endpoint
- **Error Handling**: No sensitive data exposure

### Security Headers
- **CORS**: Same-origin policy
- **Content Security Policy**: XSS protection
- **Rate Limiting**: DDoS protection
- **Input Validation**: Injection attack prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Maintain test coverage above 70%
- Use conventional commit messages
- Ensure all linting passes
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for advanced AI reasoning capabilities
- **Cheerio** for efficient HTML parsing
- **Shadcn/UI** for beautiful, accessible components
- **Next.js** for the robust React framework
- **TypeScript** for type safety and developer experience

---

**Built with ❤️ for the SEO community**

This tool represents the cutting edge of SEO analysis, combining traditional parsing techniques with advanced AI reasoning to provide insights that help websites rank better in the age of AI-powered search.

## 🔮 Future Enhancements

- **Real-time Analysis**: WebSocket-based live analysis
- **Batch Processing**: Multiple URL analysis
- **Custom Models**: Fine-tuned AI models for specific industries
- **API Integration**: Third-party SEO tool connections
- **Advanced Metrics**: Core Web Vitals and technical SEO analysis
- **Competitor Analysis**: Comparative SEO insights
- **Content Suggestions**: AI-generated content recommendations
