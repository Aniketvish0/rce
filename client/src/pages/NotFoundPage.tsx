import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, Code } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-primary/20 leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="h-24 w-24 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
          Oops! We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}