import { mdxComponents } from '@/components/mdx-components';
import { getBlogPostBySlug, getBlogPostSlugs } from '@/lib/mdx';
import { SEO } from '@/lib/seo';
import type { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { BlogPostContent } from './BlogPostContent';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Define the page props
interface Params {
  slug: string;
}

// Generate metadata for the blog post
export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  // If the post doesn't exist, return default metadata
  if (!post) {
    return {
      title: 'Blog Post Not Found | Slash Engineering',
      description: 'The requested blog post could not be found.',
    };
  }

  // Extract description from content
  const description = SEO.extractDescription({
    content: post.content,
    excerpt: post.excerpt,
    fallbackTitle: post.title,
    fallbackAuthor: post.author,
  });

  // Generate article metadata
  return SEO.getArticleMetadata({
    title: `${post.title} | Slash Engineering`,
    description,
    path: `blog/${slug}`,
    publishedTime: post.date,
    authors: [post.author],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // Access slug directly
  const slug = (await params).slug;
  const post = await getBlogPostBySlug(slug);

  // If the post doesn't exist, show a 404 page
  if (!post) {
    notFound();
  }

  // Use next-mdx-remote to compile the MDX content
  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return (
    <BlogPostContent
      post={{
        title: post.title,
        date: post.date,
        author: post.author,
        content: content,
      }}
    />
  );
}
