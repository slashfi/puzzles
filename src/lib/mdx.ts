import fs from 'node:fs';
import path from 'node:path';
import { mdxComponents, mdxOptions } from '@/components/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';

// Helper function to extract frontmatter from MDX content
export async function extractFrontmatter<T>(source: string): Promise<T> {
  const { frontmatter } = await compileMDX<T>({
    source,
    options: {
      parseFrontmatter: true,
      ...mdxOptions,
    },
  });

  return frontmatter;
}

// Helper function to compile MDX content
export async function compileMdxContent(
  source: string,
  components = mdxComponents
) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      ...mdxOptions,
    },
  });

  return content;
}

// Define the blog post metadata type
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
}

// Define the puzzle metadata type
export interface Puzzle {
  slug: string;
  title: string;
  description: string;
  content: string;
  starter_code?: string;
  starter_code_language?: string;
}

// Path to the content directories
const blogDirectory = path.join(process.cwd(), 'src/content/blog');
const puzzlesDirectory = path.join(process.cwd(), 'src/content/puzzles');

// Get all blog post slugs
export function getBlogPostSlugs(): string[] {
  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

// Get all puzzle slugs
export function getPuzzleSlugs(): string[] {
  return fs
    .readdirSync(puzzlesDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

// Get a single blog post by slug
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const filePath = path.join(blogDirectory, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract frontmatter from the MDX content
    const frontmatter = await extractFrontmatter<{
      title: string;
      date: string;
      author: string;
      excerpt: string;
    }>(fileContent);

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      author: frontmatter.author,
      excerpt: frontmatter.excerpt,
      content: fileContent,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

// Get a single puzzle by slug
export async function getPuzzleBySlug(slug: string): Promise<Puzzle | null> {
  try {
    const filePath = path.join(puzzlesDirectory, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract frontmatter from the MDX content
    const frontmatter = await extractFrontmatter<{
      title: string;
      description: string;
      starter_code?: string;
      starter_code_language?: string;
    }>(fileContent);

    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      starter_code: frontmatter.starter_code,
      starter_code_language: frontmatter.starter_code_language,
      content: fileContent,
    };
  } catch (error) {
    console.error(`Error reading puzzle ${slug}:`, error);
    return null;
  }
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const slugs = getBlogPostSlugs();
  const postsPromises = slugs.map((slug) => getBlogPostBySlug(slug));
  const posts = await Promise.all(postsPromises);

  // Filter out any null posts and sort by date (newest first)
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get all puzzles
export async function getAllPuzzles(): Promise<Puzzle[]> {
  const slugs = getPuzzleSlugs();
  const puzzlesPromises = slugs.map((slug) => getPuzzleBySlug(slug));
  const puzzles = await Promise.all(puzzlesPromises);

  // Filter out any null puzzles
  return puzzles.filter((puzzle): puzzle is Puzzle => puzzle !== null);
}
