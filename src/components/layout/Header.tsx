import { ContentLayout } from '@/components/layout/ContentLayout';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SlashLogo } from '../ui/SlashLogo';

export default function Header() {
  return (
    <header className="">
      <ContentLayout
        noPadding
        className="py-4 flex justify-between items-center"
      >
        <div className="flex items-center">
          <Link href="https://www.slash.com" className="flex items-center">
            <SlashLogo />
          </Link>
        </div>
        <nav className="flex items-center">
          <div className="hidden md:flex space-x-8 mr-8">
            <NavLink href="https://github.com/slashfi/puzzles" external>
              <div
                className="w-6 h-6 mask-github bg-[#333333] hover:bg-[var(--accent)]"
                style={{
                  maskImage: 'url(/github-mark-white.svg)',
                  maskSize: 'contain',
                  WebkitMaskImage: 'url(/github-mark-white.svg)',
                  WebkitMaskSize: 'contain',
                }}
              />
            </NavLink>
          </div>
        </nav>
      </ContentLayout>
    </header>
  );
}

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  external?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

function NavLink({
  href,
  children,
  className,
  external = false,
  active = false,
  ...props
}: NavLinkProps) {
  const baseStyles = 'text-sm transition-colors';
  const styles = active
    ? 'text-[var(--accent)] font-medium'
    : 'text-[var(--foreground)] hover:text-[var(--accent)]';

  if (external) {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseStyles, styles, className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(baseStyles, styles, className)} {...props}>
      {children}
    </Link>
  );
}
