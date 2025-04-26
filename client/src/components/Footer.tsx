import { Link } from 'react-router-dom';
import { Code, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">CodeHub</span>
        </div>
        
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} CodeHub. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            to="/privacy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </a>
        </div>
      </div>
    </footer>
  );
}