import { cn } from '@/lib/utils';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options } from 'rehype-pretty-code';
import { Video } from './Video';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

// Shiki configuration for syntax highlighting
export const rehypePrettyCodeOptions: Partial<Options> = {
  theme: 'github-dark',
  keepBackground: true,
  // Disable language badge
  filterMetaString: (meta) => meta.replace(/language-\w+/, ''),
  // Callback to get the highlighted code as an HTML string
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  // Callback to add custom styles to the code blocks
  onVisitHighlightedLine(node) {
    node.properties.className = ['highlighted'];
  },
  // Callback to add custom styles to the highlighted characters
  onVisitHighlightedChars(node) {
    node.properties.className = ['word'];
  },
};

// MDX rehype plugins configuration
export const mdxOptions: MDXRemoteProps['options'] = {
  mdxOptions: {
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
};

// Define custom components for MDX content
export const mdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn('mt-10 mb-4 text-3xl font-bold tracking-tight', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'mt-8 mb-3 text-2xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'mt-6 mb-2 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('mb-4 leading-6', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('mb-4 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('mb-4 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-2 border-[var(--accent)] pl-6 italic',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'mb-4 mt-4 overflow-x-auto rounded-lg border bg-black p-4',
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        'font-medium text-[var(--accent)] underline underline-offset-4',
        className
      )}
      {...props}
    />
  ),
  // Custom components that can be used in MDX
  Badge,
  Card,
  Button,
  Video,
};
