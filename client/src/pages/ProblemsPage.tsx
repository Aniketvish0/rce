import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getProblems } from '../api/problems';
import { ProblemsList } from '../components/ProblemsList';
import { ProblemListItem } from '../types';

export function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const problemsData = await getProblems();
        setProblems(problemsData);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Problems</h1>
          <p className="text-muted-foreground">
            Practice coding problems, submit solutions, and track your progress.
          </p>
        </div>

        <ProblemsList problems={problems} isLoading={loading} />
      </div>
    </div>
  );
}