import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { ProblemListItem } from '../types';
import { cn, difficultyColors } from '../lib/utils';

interface ProblemsListProps {
  problems: ProblemListItem[];
  isLoading: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  arrays: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  strings: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'hash-table': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  math: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'dynamic-programming': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  sorting: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  greedy: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'depth-first-search': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'binary-search': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'breadth-first-search': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'graph': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export function ProblemsList({ problems, isLoading }: ProblemsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');

  const availableCategories = Array.from(
    new Set(problems.flatMap((problem) => problem.category))
  ).sort();

  const filteredProblems = problems.filter((problem) => {
    // Search term filter
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(problem.difficulty);
    
    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      problem.category.some((category) => selectedCategories.includes(category));
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'solved' && problem.solved) || 
      (statusFilter === 'unsolved' && !problem.solved);
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const resetFilters = () => {
    setSelectedDifficulty([]);
    setSelectedCategories([]);
    setStatusFilter('all');
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-md border bg-background"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleFilter}
              className="flex items-center gap-2 py-2 px-4 rounded-md border hover:bg-muted"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </motion.button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'solved' | 'unsolved')}
              className="py-2 px-4 rounded-md border bg-background"
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 border rounded-md bg-card">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Difficulty</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDifficultyChange('easy')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedDifficulty.includes('easy')
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'bg-muted text-muted-foreground border border-transparent'
                        }`}
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => handleDifficultyChange('medium')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedDifficulty.includes('medium')
                            ? 'bg-warning/20 text-warning border border-warning/30'
                            : 'bg-muted text-muted-foreground border border-transparent'
                        }`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => handleDifficultyChange('hard')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedDifficulty.includes('hard')
                            ? 'bg-destructive/20 text-destructive border border-destructive/30'
                            : 'bg-muted text-muted-foreground border border-transparent'
                        }`}
                      >
                        Hard
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedCategories.includes(category)
                              ? CATEGORY_COLORS[category] || 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-muted text-muted-foreground border border-transparent'
                          }`}
                        >
                          {category.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">#</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Problem</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Difficulty</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Categories</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => (
                <motion.tr
                  key={problem.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
                  className="border-b last:border-b-0 dark:hover:bg-white/5"
                >
                  <td className="py-3 px-4 text-sm">
                    {problem.solved && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                    {!problem.solved && index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/problems/${problem.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        difficultyColors[problem.difficulty]
                      )}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.category.slice(0, 2).map((category) => (
                        <span
                          key={category}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs',
                            CATEGORY_COLORS[category] || 'bg-muted text-muted-foreground'
                          )}
                        >
                          {category.replace(/-/g, ' ')}
                        </span>
                      ))}
                      {problem.category.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                          +{problem.category.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {problem.acceptance.toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredProblems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No problems match your current filters.</p>
              <button
                onClick={resetFilters}
                className="text-primary mt-2 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}