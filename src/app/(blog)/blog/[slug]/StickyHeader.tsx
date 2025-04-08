'use client';

import { ContentLayout } from '@/components/layout/ContentLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StickyHeaderProps {
  title: string;
  titleRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyHeader({ title, titleRef }: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the title is not intersecting (out of view), show the sticky header
        setIsVisible(!entry.isIntersecting);
      },
      {
        // Adjust threshold as needed - 0 means as soon as even one pixel is out of view
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    observer.observe(titleElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-transform duration-200 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <ContentLayout noPadding className="py-4">
        <div className="flex items-center justify-between">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[var(--accent)] hover:underline text-sm"
          >
            ↑ Back to top
          </Link>

          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-sm font-semibold truncate">{title}</h2>
          </div>

          <div />
        </div>
      </ContentLayout>
    </div>
  );
}
