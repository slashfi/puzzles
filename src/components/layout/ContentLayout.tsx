'use client';

import type React from 'react';

interface ContentLayoutProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  fullWidth?: boolean;
}

export function ContentLayout({
  children,
  className = '',
  noPadding = false,
  fullWidth = false,
}: ContentLayoutProps) {
  return (
    <div
      className={`${fullWidth ? 'w-full' : 'max-w-5xl'} mx-auto px-4 ${noPadding ? '' : 'py-16'} ${className}`}
    >
      {children}
    </div>
  );
}
