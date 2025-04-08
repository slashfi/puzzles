import type { Metadata } from 'next';

// Base URL for the site
const BASE_URL = 'https://puzzles.slash.com';

// Default metadata values
const DEFAULT_METADATA = {
  title: 'Slash Engineering | Puzzles',
  description:
    "Explore Slash's engineering blog and coding puzzles where we share our technical insights and interesting challenges.",
  siteName: 'Slash | Puzzles',
  image: '/og-image.png',
  imageWidth: 1200,
  imageHeight: 630,
};

// Types for SEO utility functions
interface BaseMetadataParams {
  title?: string;
  description?: string;
  path?: string;
}

interface ArticleMetadataParams extends BaseMetadataParams {
  publishedTime?: string;
  authors?: string[];
}

interface DescriptionParams {
  content: string;
  excerpt?: string;
  fallbackTitle?: string;
  fallbackAuthor?: string;
}

/**
 * SEO utility functions
 */
export const SEO = {
  /**
   * Generate base metadata with common properties
   */
  getBaseMetadata({
    title = DEFAULT_METADATA.title,
    description = DEFAULT_METADATA.description,
    path = '',
  }: BaseMetadataParams = {}): Metadata {
    const url = path ? `${BASE_URL}/${path}` : BASE_URL;

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url,
        title,
        description,
        siteName: DEFAULT_METADATA.siteName,
        images: [
          {
            url: DEFAULT_METADATA.image,
            width: DEFAULT_METADATA.imageWidth,
            height: DEFAULT_METADATA.imageHeight,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [DEFAULT_METADATA.image],
      },
    };
  },

  /**
   * Generate article metadata for blog posts and puzzles
   */
  getArticleMetadata({
    title,
    description,
    path,
    publishedTime,
    authors,
  }: ArticleMetadataParams): Metadata {
    const baseMetadata = this.getBaseMetadata({ title, description, path });

    return {
      ...baseMetadata,
      openGraph: {
        ...baseMetadata.openGraph,
        type: 'article',
        publishedTime,
        authors,
      },
    };
  },

  /**
   * Extract description from content
   */
  extractDescription({
    content,
    excerpt,
    fallbackTitle,
    fallbackAuthor,
  }: DescriptionParams): string {
    return (() => {
      if (excerpt) return excerpt;

      // Simple regex to extract the first paragraph text
      const firstParagraphMatch = content.match(
        /<p>(.*?)<\/p>|^(.*?)(\n\n|\n$)/m
      );
      const extractedText = firstParagraphMatch
        ? firstParagraphMatch[1] || firstParagraphMatch[2]
        : fallbackTitle && fallbackAuthor
          ? `Read ${fallbackTitle} by ${fallbackAuthor} on Puzzles`
          : 'Read more on Slash Engineering Puzzles';

      // Strip any markdown or HTML tags and limit length
      return extractedText.replace(/<[^>]*>?/gm, '').substring(0, 160);
    })();
  },
};
