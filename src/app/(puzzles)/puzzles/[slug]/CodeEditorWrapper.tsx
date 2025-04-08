'use client';

import { CodeEditor } from '@/components/CodeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface CodeEditorWrapperProps {
  starterCode: string;
  title: string;
  description: string;
  instructions: React.ReactNode;
  language?: string;
}
export function CodeEditorWrapper({
  starterCode,
  title,
  description,
  instructions,
  language = 'typescript',
}: CodeEditorWrapperProps) {
  const [, setCode] = useState(starterCode);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateEditorHeight = () => {
      if (containerRef.current && headerRef.current && tabsListRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const headerHeight = headerRef.current.offsetHeight;
        const tabsListHeight = tabsListRef.current.offsetHeight;

        // Calculate available height (viewport height - container top - header height - tabs list height - bottom padding)
        const availableHeight =
          window.innerHeight -
          containerTop -
          headerHeight -
          tabsListHeight -
          20;

        setEditorHeight(availableHeight);
      }
    };

    updateEditorHeight();
    window.addEventListener('resize', updateEditorHeight);

    return () => {
      window.removeEventListener('resize', updateEditorHeight);
    };
  }, []);

  const handleSave = (newCode: string) => {
    setCode(newCode);
    console.log('Code saved:', newCode);
  };

  return (
    <>
      {/* Large screen view */}
      <div className="hidden lg:flex w-full mx-auto bg-white dark:bg-[#282c34] flex-col sticky top-0 h-[100vh]">
        <div className="flex-1">
          <CodeEditor
            defaultValue={starterCode}
            language={language}
            onSave={handleSave}
            height={'calc(100vh - 32px)'}
            storageKey={`puzzle-solution-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="border-none rounded-none"
          />
        </div>
      </div>

      {/* Small/medium screen view with tabs */}
      <div
        ref={containerRef}
        className="lg:hidden w-full mx-auto bg-white dark:bg-[#282c34] rounded-lg dark:border-[#3e4451] overflow-hidden"
      >
        <div ref={headerRef} className="p-4">
          <Link
            href="/"
            className="text-[var(--accent)] hover:underline inline-block mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Tabs defaultValue="instructions" className="w-full">
          <div ref={tabsListRef}>
            <TabsList className="w-full grid grid-cols-2 bg-gray-100 dark:bg-[#21252b] mb-0">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="code">Code Editor</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="instructions"
            className="text-gray-800 dark:text-[#abb2bf] px-4"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {instructions}
            </div>
          </TabsContent>
          <TabsContent
            value="code"
            style={{ height: 808 }}
            className={'flex flex-col'}
          >
            <CodeEditor
              defaultValue={starterCode}
              language={language}
              height={`calc(${editorHeight}px - 32px)`}
              onSave={handleSave}
              storageKey={`puzzle-solution-${title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
