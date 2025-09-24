/**
 * Simple test script to verify SEO analysis functionality
 * Run with: node test-analysis.js
 */

const { SEOAnalyzer } = require('./src/lib/seo-analyzer.ts');

async function testAnalysis() {
  console.log('🧪 Testing SEO Analysis Tool...\n');
  
  try {
    // Initialize analyzer without Gemini API key for basic testing
    const analyzer = new SEOAnalyzer();
    
    // Test URL
    const testUrl = 'https://example.com';
    
    console.log(`📊 Analyzing: ${testUrl}`);
    console.log('⏳ This may take a few seconds...\n');
    
    const result = await analyzer.analyzeURL({
      url: testUrl,
      include_ai_analysis: false,
      analysis_depth: 'comprehensive'
    });
    
    if (result.success) {
      console.log('✅ Analysis completed successfully!');
      console.log(`📈 Processing time: ${result.data.processing_time_ms}ms`);
      console.log(`🔍 Primary keywords: ${result.data.inferred_keywords_analysis.primary.keywords.length}`);
      console.log(`🎯 Secondary keywords: ${result.data.inferred_keywords_analysis.secondary.keywords.length}`);
      console.log(`📝 Word count: ${result.data.structured_on_page_data.word_count}`);
      console.log(`🏷️  Headings found: ${result.data.structured_on_page_data.headings_and_keywords.length}`);
      
      console.log('\n📋 Primary Keywords:');
      result.data.inferred_keywords_analysis.primary.keywords.forEach((kw, i) => {
        console.log(`  ${i + 1}. ${kw.term} (${Math.round((kw.confidence_score || 0) * 100)}% confidence)`);
      });
      
      console.log('\n🎉 Test completed successfully!');
    } else {
      console.log('❌ Analysis failed:', result.error?.message);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the test
testAnalysis();
