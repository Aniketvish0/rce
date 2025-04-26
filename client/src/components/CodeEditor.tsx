import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { vscodeDark, vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import { motion } from 'framer-motion';
import { Play, Save, RefreshCw, Wand2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { languageExtensions } from '../lib/utils';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  onRequestAiFeedback: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isGettingFeedback: boolean;
}

export function CodeEditor({
  code,
  language,
  onChange,
  onRun,
  onSubmit,
  onReset,
  onRequestAiFeedback,
  isRunning,
  isSubmitting,
  isGettingFeedback,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [extensions, setExtensions] = useState<any[]>([]);

  useEffect(() => {
    // Set up language extensions
    switch (language) {
      case 'javascript':
        setExtensions([javascript({ jsx: true, typescript: false })]);
        break;
      case 'typescript':
        setExtensions([javascript({ jsx: true, typescript: true })]);
        break;
      case 'python':
        setExtensions([python()]);
        break;
      case 'java':
        setExtensions([java()]);
        break;
      case 'c++':
        setExtensions([cpp()]);
        break;
      default:
        setExtensions([javascript()]);
    }
  }, [language]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {languageExtensions[language as keyof typeof languageExtensions]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-xs rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={onReset}
            title="Reset Code"
          >
            <RefreshCw size={16} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-xs rounded-md hover:bg-accent/10 text-accent hover:text-accent"
            onClick={onRequestAiFeedback}
            disabled={isGettingFeedback}
            title="Get AI Feedback"
          >
            {isGettingFeedback ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Wand2 size={16} />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-xs rounded-md bg-primary/10 hover:bg-primary/20 text-primary"
            onClick={onRun}
            disabled={isRunning}
            title="Run Code"
          >
            {isRunning ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-xs rounded-md bg-success/10 hover:bg-success/20 text-success"
            onClick={onSubmit}
            disabled={isSubmitting}
            title="Submit Solution"
          >
            {isSubmitting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
          </motion.button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <CodeMirror
          value={code}
          height="100%"
          extensions={extensions}
          onChange={onChange}
          theme={theme === 'dark' ? vscodeDark : vscodeDarkInit}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            foldGutter: true,
            syntaxHighlighting: true,
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}