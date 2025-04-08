'use client';

import { editor } from 'monaco-editor';

// GitHub-inspired theme
export const githubTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'd73a49' },
    { token: 'string', foreground: '032f62' },
    { token: 'number', foreground: '005cc5' },
    { token: 'regexp', foreground: '032f62' },
    { token: 'type', foreground: '6f42c1' },
    { token: 'class', foreground: '6f42c1' },
    { token: 'function', foreground: '6f42c1' },
    { token: 'variable', foreground: '24292e' },
    { token: 'variable.predefined', foreground: '005cc5' },
    { token: 'interface', foreground: '6f42c1' },
    { token: 'namespace', foreground: '6f42c1' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#24292e',
    'editor.lineHighlightBackground': '#f1f8ff',
    'editorLineNumber.foreground': '#1b1f234d',
    'editorLineNumber.activeForeground': '#24292e',
    'editor.selectionBackground': '#0366d625',
    'editor.inactiveSelectionBackground': '#0366d625',
    'editorIndentGuide.background': '#eeeeee',
    'editorIndentGuide.activeBackground': '#cccccc',
  },
};

// One Dark theme (Atom-inspired)
export const oneDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'c678dd' },
    { token: 'string', foreground: '98c379' },
    { token: 'number', foreground: 'd19a66' },
    { token: 'regexp', foreground: '98c379' },
    { token: 'type', foreground: '61afef' },
    { token: 'class', foreground: 'e5c07b' },
    { token: 'function', foreground: '61afef' },
    { token: 'variable', foreground: 'e06c75' },
    { token: 'variable.predefined', foreground: 'd19a66' },
    { token: 'interface', foreground: 'e5c07b' },
    { token: 'namespace', foreground: 'e5c07b' },
  ],
  colors: {
    'editor.background': '#282c34',
    'editor.foreground': '#abb2bf',
    'editor.lineHighlightBackground': '#2c313c',
    'editorLineNumber.foreground': '#495162',
    'editorLineNumber.activeForeground': '#abb2bf',
    'editor.selectionBackground': '#3e4451',
    'editor.inactiveSelectionBackground': '#3a3f4b',
    'editorIndentGuide.background': '#3b4048',
    'editorIndentGuide.activeBackground': '#4b5364',
  },
};

// Nord theme
export const nordTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '616e88', fontStyle: 'italic' },
    { token: 'keyword', foreground: '81a1c1' },
    { token: 'string', foreground: 'a3be8c' },
    { token: 'number', foreground: 'b48ead' },
    { token: 'regexp', foreground: 'ebcb8b' },
    { token: 'type', foreground: '8fbcbb' },
    { token: 'class', foreground: '8fbcbb' },
    { token: 'function', foreground: '88c0d0' },
    { token: 'variable', foreground: 'd8dee9' },
    { token: 'variable.predefined', foreground: '5e81ac' },
    { token: 'interface', foreground: '8fbcbb' },
    { token: 'namespace', foreground: '8fbcbb' },
  ],
  colors: {
    'editor.background': '#2e3440',
    'editor.foreground': '#d8dee9',
    'editor.lineHighlightBackground': '#3b4252',
    'editorLineNumber.foreground': '#4c566a',
    'editorLineNumber.activeForeground': '#d8dee9',
    'editor.selectionBackground': '#434c5e',
    'editor.inactiveSelectionBackground': '#3b4252',
    'editorIndentGuide.background': '#434c5e',
    'editorIndentGuide.activeBackground': '#4c566a',
  },
};

// Register the themes
export function registerMonacoThemes() {
  editor.defineTheme('github', githubTheme);
  editor.defineTheme('oneDark', oneDarkTheme);
  editor.defineTheme('nord', nordTheme);
}
