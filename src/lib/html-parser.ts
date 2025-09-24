/**
 * Advanced HTML Parser for SEO Analysis
 * Extracts comprehensive on-page elements with semantic context
 */

import { load } from 'cheerio';
import { 
  PageMetadata, 
  StructuredOnPageData, 
  HeadingWithKeywords, 
  ImageAltText, 
  UrlAnalysis, 
  MetaDataAnalysis 
} from '@/types/seo-analysis';

type CheerioRoot = ReturnType<typeof load>;

export class HTMLParser {
  private $: CheerioRoot;
  private url: string;

  constructor(html: string, url: string) {
    this.$ = load(html);
    this.url = url;
  }

  /**
   * Extract comprehensive page metadata
   */
  extractPageMetadata(): PageMetadata {
    const title = this.$('title').text().trim();
    const metaDescription = this.$('meta[name="description"]').attr('content') || '';
    const favicon = this.$('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || '';
    const language = this.$('html').attr('lang') || 'en';
    const charset = this.$('meta[charset]').attr('charset') || 'utf-8';

    return {
      url: this.url,
      title_tag: title,
      meta_description: metaDescription,
      favicon_url: this.resolveUrl(favicon),
      language,
      charset
    };
  }

  /**
   * Extract headings with keyword analysis
   */
  extractHeadingsWithKeywords(): HeadingWithKeywords[] {
    const headings: HeadingWithKeywords[] = [];
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    headingTags.forEach((tag, index) => {
      this.$(tag).each((i, element) => {
        const text = this.$(element).text().trim();
        if (text) {
          headings.push({
            tag,
            text,
            keywords: this.extractKeywordsFromText(text),
            position: index
          });
        }
      });
    });

    return headings;
  }

  /**
   * Analyze URL structure and extract keywords
   */
  analyzeUrl(): UrlAnalysis {
    try {
      const urlObj = new URL(this.url);
      const pathname = urlObj.pathname;
      const slug = pathname.split('/').pop() || '';
      const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
      
      // Extract keywords from URL segments
      const urlKeywords = pathSegments
        .flatMap(segment => this.extractKeywordsFromText(segment.replace(/[-_]/g, ' ')))
        .filter(keyword => keyword.length > 2);

      return {
        slug,
        keywords: urlKeywords,
        path_segments: pathSegments
      };
    } catch {
      return {
        slug: '',
        keywords: [],
        path_segments: []
      };
    }
  }

  /**
   * Extract meta data analysis
   */
  extractMetaDataAnalysis(): MetaDataAnalysis {
    const metaDescription = this.$('meta[name="description"]').attr('content') || '';
    const metaKeywordsContent = this.$('meta[name="keywords"]').attr('content') || '';
    const canonicalUrl = this.$('link[rel="canonical"]').attr('href') || '';
    const robotsMeta = this.$('meta[name="robots"]').attr('content') || '';

    // Extract keywords from meta description
    const descriptionKeywords = this.extractKeywordsFromText(metaDescription);
    const metaKeywords = metaKeywordsContent
      ? metaKeywordsContent
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(k => k.length > 1)
      : [];

    // Extract image alt texts
    const imageAltTexts: ImageAltText[] = [];
    this.$('img').each((i, element) => {
      const alt = this.$(element).attr('alt') || '';
      const src = this.$(element).attr('src') || '';
      if (alt) {
        imageAltTexts.push({
          text: alt,
          keywords: this.extractKeywordsFromText(alt),
          src: this.resolveUrl(src)
        });
      }
    });

    return {
      description_keywords: descriptionKeywords,
      image_alt_texts: imageAltTexts,
      canonical_url: canonicalUrl,
      robots_meta: robotsMeta,
      meta_keywords: metaKeywords
    };
  }

  /**
   * Extract main content text for analysis
   */
  extractMainContent(): string {
    // Try to find main content areas
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '#content'
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const element = this.$(selector).first();
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }

    // Fallback to body if no main content found
    if (!content) {
      content = this.$('body').text();
    }

    return content.trim();
  }

  /**
   * Get word count and content length
   */
  getContentMetrics(content: string): { word_count: number; content_length: number } {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    return {
      word_count: words.length,
      content_length: content.length
    };
  }

  /**
   * Build structured on-page data
   */
  buildStructuredOnPageData(): StructuredOnPageData {
    const headings = this.extractHeadingsWithKeywords();
    const urlAnalysis = this.analyzeUrl();
    const metaDataAnalysis = this.extractMetaDataAnalysis();
    const content = this.extractMainContent();
    const contentMetrics = this.getContentMetrics(content);

    return {
      headings_and_keywords: headings,
      url_analysis: urlAnalysis,
      meta_data_analysis: metaDataAnalysis,
      content_length: contentMetrics.content_length,
      word_count: contentMetrics.word_count
    };
  }

  /**
   * Extract keywords from text using simple NLP techniques
   */
  private extractKeywordsFromText(text: string): string[] {
    if (!text) return [];

    // Clean and normalize text
    const cleaned = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Split into words and filter
    const tokens = cleaned.split(' ')
      .filter(word => 
        word.length > 2 && 
        word.length < 50 &&
        !this.isStopWord(word)
      );

    // Build unigrams, bigrams, trigrams
    const phrases = new Set<string>();
    for (let i = 0; i < tokens.length; i++) {
      phrases.add(tokens[i]);
      if (i + 1 < tokens.length) {
        phrases.add(`${tokens[i]} ${tokens[i + 1]}`);
      }
      if (i + 2 < tokens.length) {
        phrases.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
      }
    }

    // Filter out phrases that start or end with stop words
    const filtered = Array.from(phrases).filter(p => {
      const parts = p.split(' ');
      if (parts.length === 0) return false;
      const first = parts[0];
      const last = parts[parts.length - 1];
      return !this.isStopWord(first) && !this.isStopWord(last);
    });

    return filtered;
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
      'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ]);
    return stopWords.has(word);
  }

  /**
   * Resolve relative URLs to absolute URLs
   */
  private resolveUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) {
      try {
        const baseUrl = new URL(this.url);
        return `${baseUrl.protocol}//${baseUrl.host}${url}`;
      } catch {
        return url;
      }
    }
    return url;
  }
}
