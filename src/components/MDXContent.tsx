import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from './mdx-components';

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
