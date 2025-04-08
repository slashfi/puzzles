import { ContentLayout } from '@/components/layout/ContentLayout';
import { colors } from '@/lib/theme';
import Link from 'next/link';
import { SlashLogo } from '../ui/SlashLogo';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12">
      <ContentLayout noPadding>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start mb-8 md:mb-0">
            <Link href="/" className="flex items-center mb-3">
              <SlashLogo height={16} color={colors.muted.DEFAULT} />
            </Link>
            <p className="text-sm text-[var(--muted)]">
              © Slash Financial. All rights reserved.
            </p>
          </div>
        </div>
      </ContentLayout>
    </footer>
  );
}
