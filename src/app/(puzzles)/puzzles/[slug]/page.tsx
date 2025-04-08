import { ContentLayout } from '@/components/layout/ContentLayout';
import { mdxComponents } from '@/components/mdx-components';
import { getPuzzleBySlug, getPuzzleSlugs } from '@/lib/mdx';
import { SEO } from '@/lib/seo';
import type { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeEditorWrapper } from './CodeEditorWrapper';

// Generate static params for all puzzles
export async function generateStaticParams() {
  const slugs = getPuzzleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Define the page props
interface PuzzlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the puzzle page
export async function generateMetadata({
  params,
}: PuzzlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const puzzle = await getPuzzleBySlug(slug);

  // If the puzzle doesn't exist, return default metadata
  if (!puzzle) {
    return {
      title: 'Puzzle Not Found | Slash Engineering',
      description: 'The requested puzzle could not be found.',
    };
  }

  // Generate article metadata
  return SEO.getArticleMetadata({
    title: `${puzzle.title} | Slash Engineering`,
    description: puzzle.description,
    path: `puzzles/${slug}`,
    // Puzzles don't have authors or published dates, but the metadata structure is the same
  });
}

export default async function PuzzlePage({ params }: PuzzlePageProps) {
  const puzzle = await getPuzzleBySlug((await params).slug);

  // If the puzzle doesn't exist, show a 404 page
  if (!puzzle) {
    notFound();
  }

  // Use next-mdx-remote to compile the MDX content
  const { content } = await compileMDX({
    source: puzzle.content,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  // Get the starter code from the frontmatter or use a default
  const starterCode = puzzle.starter_code || '// Write your solution here';
  const language = puzzle.starter_code_language || 'typescript';

  return (
    <ContentLayout fullWidth noPadding>
      <div className="max-w-5xl lg:max-w-7xl mx-auto">
        <div className="lg:bg-white lg:dark:bg-[#282c34]">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left column: Puzzle instructions */}
            <div className="prose prose-lg dark:prose-invert max-w-none hidden lg:block lg:w-[40%] lg:min-w-[500px]">
              <div className="p-6">
                <Link
                  href="/"
                  className="text-[var(--accent)] hover:underline inline-block"
                >
                  ← Back to Home
                </Link>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">{puzzle.title}</h1>
                  <p className="text-muted-foreground">{puzzle.description}</p>
                </div>

                {content}
              </div>
            </div>

            {/* Code editor */}
            <div className="lg:flex-1 lg:border-t lg:border-b lg:border-r lg:border-l lg:border-gray-200 lg:dark:border-gray-700 border-gray-200">
              <CodeEditorWrapper
                starterCode={starterCode}
                language={language}
                title={puzzle.title}
                description={puzzle.description}
                instructions={content}
              />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
