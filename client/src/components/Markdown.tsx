import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Override table to add responsive wrapper
        table({ node, ...props }) {
          return (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-200 dark:border-gray-700" {...props} />
            </div>
          );
        },
        // Style table headers
        th({ node, ...props }) {
          return (
            <th
              className="border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-medium"
              {...props}
            />
          );
        },
        // Style table cells
        td({ node, ...props }) {
          return (
            <td
              className="border border-gray-200 dark:border-gray-700 px-4 py-2"
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}