import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserSubmissions } from '../api/problems';
import { timeAgo, difficultyColors, cn } from '../lib/utils';
import { CheckCircle2, XCircle, AlertCircle, Clock, Code } from 'lucide-react';

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        setLoading(true);
        const data = await getUserSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'wrong_answer':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'time_limit_exceeded':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'runtime_error':
      case 'compile_error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Code className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Your Submissions</h1>
          <p className="text-muted-foreground">
            Track your previous submissions and their results.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Code className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No submissions yet</h2>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any solutions yet. Start solving problems to see your submissions here.
            </p>
            <Link
              to="/problems"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Explore Problems
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Problem</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Language</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Runtime</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Memory</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground text-sm">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission: any) => (
                  <motion.tr
                    key={submission.id}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
                    className="border-b last:border-b-0 dark:hover:bg-white/5"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        <span
                          className={cn(
                            'text-sm',
                            submission.status === 'accepted' ? 'text-success' :
                              submission.status === 'time_limit_exceeded' ? 'text-warning' : 'text-destructive'
                          )}
                        >
                          {getStatusText(submission.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <Link
                          to={`/problems/${submission.problemId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {submission.problemTitle}
                        </Link>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium inline-block w-fit mt-1',
                            difficultyColors[submission.problemDifficulty as keyof typeof difficultyColors]
                          )}
                        >
                          {submission.problemDifficulty.charAt(0).toUpperCase() + submission.problemDifficulty.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {submission.runtime} ms
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {submission.memory} KB
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {timeAgo(submission.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}