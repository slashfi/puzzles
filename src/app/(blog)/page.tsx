import { ContentCard } from '@/components/ContentCard';
import { ContentLayout } from '@/components/layout/ContentLayout';
import { Badge } from '@/components/ui/badge';
import { getAllBlogPosts, getAllPuzzles } from '@/lib/mdx';
import { SEO } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = SEO.getBaseMetadata();

export default async function Home() {
  // Fetch actual blog posts and puzzles from MDX files
  const blogPosts = await getAllBlogPosts();
  const puzzles = await getAllPuzzles();
  return (
    <div>
      <ContentLayout>
        {/* Hero Section */}
        <section className="mb-24 text-left">
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

        {/* Content Grid */}
        <section id="content-grid">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {/* Blog Posts */}
            {blogPosts.map((post) => (
              <ContentCard
                key={post.slug}
                type="blog"
                title={post.title}
                description={''}
                image={post.image || '/globe.svg'} // Use custom image if available, otherwise default
                slug={post.slug}
                date={post.date}
                author={post.author}
              />
            ))}

            {/* Puzzles */}
            {puzzles.map((puzzle) => (
              <ContentCard
                key={puzzle.slug}
                type="puzzle"
                title={puzzle.title}
                description={puzzle.description}
                image={puzzle.image || '/file.svg'} // Use custom image if available, otherwise default
                slug={puzzle.slug}
              />
            ))}
          </div>
        </section>
      </ContentLayout>
    </div>
  );
}
