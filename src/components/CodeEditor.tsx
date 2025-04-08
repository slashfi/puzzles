'use client';

import Editor from '@monaco-editor/react';

import clsx from 'clsx';

interface CodeEditorProps {
  defaultValue?: string;
  language?: string;
  height?: string;
  theme?: 'vs-dark' | 'light';
  onSave?: (code: string) => void;
  storageKey?: string;
  className?: string | undefined;
}

export function CodeEditor({
  defaultValue = '// Write your code here',
  language = 'typescript',
  theme = 'light',
  className,
  height,
}: CodeEditorProps) {
  return (
    <div className={clsx('rounded-md', className)}>
      <div className="bg-gray-100 dark:bg-[#282c34] px-3 h-[32px] flex justify-between items-center border-b border-gray-200 dark:border-[#3e4451]">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Editor
        </div>
      </div>
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={defaultValue}
        theme={theme}
        options={{
          minimap: { enabled: true, scale: 10, showSlider: 'mouseover' },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderLineHighlight: 'all',
          padding: { top: 16, bottom: 16 },
          guides: { indentation: true },
          colorDecorators: true,
        }}
      />
    </div>
  );
}
