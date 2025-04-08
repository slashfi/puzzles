'use client';

import { ContentLayout } from '@/components/layout/ContentLayout';
import Link from 'next/link';
import { useRef } from 'react';
import StickyHeader from './StickyHeader';

interface BlogPostContentProps {
  post: {
    title: string;
    date: string;
    author: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    content: any;
  };
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const titleContainerRef = useRef<HTMLDivElement>(null);

  return (
    <ContentLayout>
      <StickyHeader title={post.title} titleRef={titleContainerRef} />

      <Link
        href="/"
        className="text-[var(--accent)] hover:underline mb-8 inline-block"
      >
        ← Back to Home
      </Link>

      <div className="max-w-xl mx-auto">
        <div className="mb-8" ref={titleContainerRef}>
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <p className="text-muted-foreground">
            {post.date} • {post.author}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">{post.content}</div>
      </div>
    </ContentLayout>
  );
}
