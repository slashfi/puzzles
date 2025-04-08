import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ContentCardProps {
  type: 'blog' | 'puzzle';
  title: string;
  description: string;
  image: string;
  slug: string;
  date?: string;
  author?: string;
}

export function ContentCard({
  type,
  title,
  description,
  image,
  slug,
  date,
  author,
}: ContentCardProps) {
  const href = type === 'blog' ? `/blog/${slug}` : `/puzzles/${slug}`;
  const badgeText = type === 'blog' ? 'Blog Post' : 'Puzzle';
  const badgeStyle =
    type === 'blog'
      ? 'bg-white text-[var(--accent)] hover:bg-white border border-[var(--accent)]'
      : 'bg-[var(--accent)] text-white hover:bg-[var(--accent)] border-0';
  const actionText = type === 'blog' ? 'Read more →' : 'View puzzle →';
  const cardBorder =
    type === 'blog'
      ? 'border border-[var(--accent-light)]'
      : 'border border-[var(--accent-light)]';

  return (
    <Link href={href} className="block group relative">
      <Badge
        className={`absolute top-1 left-4 ${badgeStyle} text-xs z-10 font-medium`}
      >
        {badgeText}
      </Badge>
      <Card
        className={`h-full transition-all hover:shadow-md hover:border-[var(--accent)] overflow-hidden pt-0 pb-2 flex flex-col mt-3 ${cardBorder} gap-2`}
      >
        <div className="h-24 w-full bg-[var(--accent-light)] flex items-center justify-center">
          <div className="h-16 w-16 bg-white rounded-md flex items-center justify-center">
            <img src={image} alt={title} className="h-8 w-8 object-contain" />
          </div>
        </div>
        <div className="p-3 gap-y-0 flex flex-col justify-content-between flex-1">
          <div className="flex flex-col items-start gap-y-1 flex-1">
            <CardTitle className="group-hover:text-[var(--accent)] transition-colors text-sm">
              {title}
            </CardTitle>
            {date && author && (
              <CardDescription className="text-muted-foreground text-xs">
                {date} • {author}
              </CardDescription>
            )}
            <p className="text-muted-foreground text-xs line-clamp-2">
              {description}
            </p>
          </div>
          <div>
            <span
              className={`text-[var(--accent)] text-xs font-medium ${type === 'puzzle' ? 'font-bold' : ''}`}
            >
              {actionText}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
