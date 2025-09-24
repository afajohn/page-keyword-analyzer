# 🚀 SEO Analysis Tool - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd kw-listing
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**To get your Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

### 3. Run the Application
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration Options

### Environment Variables
```env
# Required for AI analysis
GEMINI_API_KEY=your_api_key_here

# Optional settings
NEXT_PUBLIC_DEFAULT_ANALYSIS_DEPTH=comprehensive
NEXT_PUBLIC_MAX_ANALYSIS_TIME=30000
```

### Analysis Depth Options
- `basic`: Essential keyword extraction only
- `standard`: Includes semantic analysis
- `comprehensive`: Full analysis with AI reasoning (recommended)

## 🧪 Testing the Application

### Test Without AI Analysis
1. Leave `GEMINI_API_KEY` empty in `.env.local`
2. Run the application
3. Enter any valid URL
4. Uncheck "Include AI-powered analysis"
5. Click "Analyze SEO"

### Test With AI Analysis
1. Add your Gemini API key to `.env.local`
2. Run the application
3. Enter a URL
4. Keep "Include AI-powered analysis" checked
5. Click "Analyze SEO"

## 📊 Understanding the Results

### Overview Tab
- **Primary Keywords**: High-confidence keywords from URL, title, and H1
- **Secondary Keywords**: Supporting keywords from subheadings and content
- **Word Count**: Total words in the analyzed content
- **AI Analysis**: Whether Gemini analysis was included

### Keywords Tab
- **Confidence Scores**: Percentage confidence for each keyword
- **Source Locations**: Where each keyword was found
- **Reasoning**: Explanation for keyword identification

### AI Analysis Tab (with Gemini API)
- **SEO Recommendations**: Actionable advice based on latest algorithms
- **E-E-A-T Assessment**: Expertise, Experience, Authoritativeness, Trustworthiness
- **User Intent Alignment**: How well content matches search intent
- **AI Overview Optimization**: Suggestions for AI-powered search results

### Technical Tab
- **Page Metadata**: Title, description, language, etc.
- **Content Analysis**: Word count, headings, images
- **Semantic Analysis**: Entities, relationships, frequent terms

## 🎯 Example URLs to Test

### E-commerce Sites
- `https://shop.example.com/products/wireless-headphones`
- `https://store.example.com/categories/electronics`

### Content Sites
- `https://blog.example.com/seo-best-practices-2024`
- `https://news.example.com/technology/ai-updates`

### Service Sites
- `https://agency.example.com/services/seo-consulting`
- `https://company.example.com/about-us`

## 🔍 Troubleshooting

### Common Issues

**"AI analysis is currently unavailable"**
- Check if `GEMINI_API_KEY` is set correctly
- Verify the API key is valid and has quota remaining
- Check your internet connection

**"Failed to fetch webpage content"**
- Ensure the URL is accessible
- Check if the site blocks automated requests
- Try a different URL

**"Invalid URL format"**
- Make sure the URL includes `http://` or `https://`
- Check for typos in the URL

### Performance Tips

1. **Use HTTPS URLs** when possible for better security
2. **Avoid very large pages** (over 1MB) for faster analysis
3. **Enable AI analysis** only when needed to save API quota
4. **Export results** to avoid losing analysis data

## 🚀 Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Similar to Vercel, supports Next.js
- **Railway**: Good for full-stack applications
- **DigitalOcean App Platform**: Scalable hosting option

### Environment Variables for Production
```env
GEMINI_API_KEY=your_production_api_key
NEXT_PUBLIC_DEFAULT_ANALYSIS_DEPTH=comprehensive
NEXT_PUBLIC_MAX_ANALYSIS_TIME=30000
```

## 📈 Advanced Usage

### API Integration
The tool provides a REST API at `/api/analyze`:

```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    include_ai_analysis: true,
    analysis_depth: 'comprehensive'
  })
});

const result = await response.json();
```

### Export Formats
- **JSON**: Complete structured data
- **CSV**: Keyword-focused spreadsheet
- **Markdown**: Human-readable report

### Custom Analysis
Modify the analysis depth and parameters in `src/config/environment.ts` to customize the analysis behavior.

## 🎉 You're Ready!

Your advanced SEO analysis tool is now set up and ready to provide sophisticated insights beyond simple keyword extraction. The AI-powered reasoning will help you understand not just what keywords are present, but why they matter and how to optimize for the latest search algorithms.

Happy analyzing! 🚀
