import { ContentLayout } from '@/components/layout/ContentLayout';
import { Badge } from '@/components/ui/badge';
import { getAllBlogPosts, getAllPuzzles } from '@/lib/mdx';
import { SEO } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = SEO.getBaseMetadata();

export default async function Home() {
  // Fetch actual blog posts and puzzles from MDX files
  const blogPosts = await getAllBlogPosts();
  const puzzles = await getAllPuzzles();

  // Combine and sort all content by date (newest first)
  const allContent = [
    ...blogPosts.map((post) => ({ ...post, type: 'blog' as const })),
    ...puzzles.map((puzzle) => ({ ...puzzle, type: 'puzzle' as const })),
  ].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  return (
    <div>
      <ContentLayout>
        {/* Hero Section */}
        <section className="mb-16 text-left">
          <Badge className="mb-6 bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent-light)]">
            Engineering at Slash
          </Badge>
          <h1 className="text-[42px] font-semibold mb-3 tracking-tight">
            Slash Engineering: How We Build
          </h1>
          <p className="text-muted-foreground max-w-2xl text-[18px] leading-relaxed mb-8">
            Welcome to Puzzles — our engineering blog and showcase of challenges
            we find interesting. We're looking for like-minded engineers who
            share our enthusiasm for creative problem-solving and building
            systems to join us.
          </p>
        </section>

        {/* Content List */}
        <section id="content-list">
          <div className="space-y-6">
            {allContent.map((item) => {
              const href =
                item.type === 'blog'
                  ? `/blog/${item.slug}`
                  : `/puzzles/${item.slug}`;
              const badgeText = item.type === 'blog' ? 'Blog Post' : 'Puzzle';
              const badgeStyle =
                item.type === 'blog'
                  ? 'bg-white text-[var(--accent)] hover:bg-white border border-[var(--accent)]'
                  : 'bg-[var(--accent)] text-white hover:bg-[var(--accent)] border-0';
              return (
                <Link
                  key={item.slug}
                  href={href}
                  className="block group relative"
                >
                  <Badge
                    className={`absolute -top-2 left-4 ${badgeStyle} text-xs z-10 font-medium`}
                  >
                    {badgeText}
                  </Badge>
                  <div className="p-4 pt-4 border border-gray-200 rounded-lg hover:border-[var(--accent)] hover:shadow-sm transition-all mt-2">
                    {/* Content */}
                    <div className="w-full">
                      {/* Title */}
                      <h3 className="text-base font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors mt-2">
                        {item.title}
                      </h3>

                      {/* Author + date (for blog posts only) */}
                      {item.type === 'blog' && item.date && (
                        <div className="text-muted-foreground text-xs mb-2">
                          {item.author} • {item.date}
                        </div>
                      )}

                      {/* Excerpt/description */}
                      {item.type === 'blog' && item.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.excerpt}
                        </p>
                      )}
                      {item.type === 'puzzle' && item.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </ContentLayout>
    </div>
  );
}
