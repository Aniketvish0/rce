import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Split from 'react-split';
import { Markdown } from '../components/Markdown';
import { CodeEditor } from '../components/CodeEditor';
import { Loader, Check, X, Rotate, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProblem, executeCode, submitSolution, getAiFeedback } from '../api/problems';
import { Problem, ExecutionResult, AiFeedback } from '../types';
import { useAuthStore } from '../stores/authStore';

export function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'results' | 'feedback'>('description');

  useEffect(() => {
    async function loadProblem() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getProblem(id);
        setProblem(data);
        setCode(data.starterCode[language] || '');
      } catch (error) {
        toast.error('Failed to load problem');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language] || problem.starterCode.javascript || '');
    }
  }, [language, problem]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleRun = async () => {
    if (!id) return;
    
    try {
      setIsRunning(true);
      setActiveTab('results');
      const result = await executeCode(id, code, language);
      setResult(result);
    } catch (error) {
      toast.error('Failed to execute code');
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    if (!token) {
      toast.error('You must be logged in to submit solutions');
      navigate('/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setActiveTab('results');
      const submission = await submitSolution(id, code, language);
      setResult({
        status: submission.status,
        runtime: submission.runtime,
        memory: submission.memory,
        stdout: '',
        stderr: '',
      });
      
      if (submission.status === 'accepted') {
        toast.success('Solution accepted!');
      } else {
        toast.error(`Solution failed: ${submission.status.replace(/_/g, ' ')}`);
      }
    } catch (error) {
      toast.error('Failed to submit solution');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!problem) return;
    setCode(problem.starterCode[language] || '');
  };

  const handleRequestAiFeedback = async () => {
    if (!id) return;
    if (!token) {
      toast.error('You must be logged in to get AI feedback');
      navigate('/login');
      return;
    }
    
    try {
      setIsGettingFeedback(true);
      setActiveTab('feedback');
      const feedback = await getAiFeedback(code, language, id);
      setAiFeedback(feedback);
    } catch (error) {
      toast.error('Failed to get AI feedback');
      console.error(error);
    } finally {
      setIsGettingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold mb-2">Problem not found</h2>
        <p className="text-muted-foreground mb-4">The problem you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/problems')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Problems
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-background">
      <Split
        className="split h-full"
        sizes={[40, 60]}
        minSize={300}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
      >
        <div className="h-full overflow-y-auto flex flex-col">
          <div className="p-4 border-b sticky top-0 bg-background z-10 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{problem.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${problem.difficulty === 'easy' ? 'bg-success/10 text-success' : 
                      problem.difficulty === 'medium' ? 'bg-warning/10 text-warning' : 
                      'bg-destructive/10 text-destructive'}`}
                >
                  {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </span>
                {problem.category.slice(0, 2).map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {cat.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeTab === 'description' ? 
                  'bg-primary text-primary-foreground' :
                  'hover:bg-muted'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeTab === 'results' ? 
                  'bg-primary text-primary-foreground' :
                  'hover:bg-muted'
                }`}
              >
                Results
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  activeTab === 'feedback' ? 
                  'bg-primary text-primary-foreground' :
                  'hover:bg-muted'
                }`}
              >
                AI Feedback
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <Markdown content={problem.description} />
                
                <h3 className="font-bold mt-6 mb-2">Constraints</h3>
                <Markdown content={problem.constraints} />
                
                {problem.hints.length > 0 && (
                  <>
                    <h3 className="font-bold mt-6 mb-2">Hints</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {problem.hints.map((hint, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {hint}
                        </motion.li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'results' && (
              <div>
                {isRunning || isSubmitting ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">
                      {isRunning ? 'Running your code...' : 'Submitting your solution...'}
                    </p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {result.status === 'accepted' ? (
                        <div className="flex items-center gap-2 text-success">
                          <Check className="h-5 w-5" />
                          <span className="font-medium">Accepted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-destructive">
                          <X className="h-5 w-5" />
                          <span className="font-medium">
                            {result.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {(result.testCasesPassed !== undefined && result.totalTestCases !== undefined) && (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Test Cases</span>
                          <span>
                            {result.testCasesPassed} / {result.totalTestCases} passed
                          </span>
                        </div>
                        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success"
                            style={{ width: `${(result.testCasesPassed / result.totalTestCases) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm text-muted-foreground mb-1">Runtime</div>
                        <div className="font-medium">{result.runtime} ms</div>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm text-muted-foreground mb-1">Memory</div>
                        <div className="font-medium">{result.memory} KB</div>
                      </div>
                    </div>
                    
                    {result.stdout && (
                      <div>
                        <div className="text-sm font-medium mb-1">Output</div>
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                          {result.stdout}
                        </pre>
                      </div>
                    )}
                    
                    {result.stderr && (
                      <div>
                        <div className="text-sm font-medium mb-1 text-destructive">Errors</div>
                        <pre className="bg-destructive/10 text-destructive p-3 rounded-md overflow-x-auto text-sm">
                          {result.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Rotate className="h-12 w-12 text-muted-foreground mb-4 opacity-70" />
                    <h3 className="text-lg font-medium mb-1">No Results Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Run your code to test it against our test cases, or submit your solution when you're ready.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'feedback' && (
              <div>
                {isGettingFeedback ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Getting AI feedback on your code...</p>
                  </div>
                ) : aiFeedback ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Code Analysis</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-3 rounded-md">
                          <div className="text-sm text-success font-medium mb-1">Time Complexity</div>
                          <div>{aiFeedback.complexity.time}</div>
                        </div>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="text-sm text-primary font-medium mb-1">Space Complexity</div>
                          <div>{aiFeedback.complexity.space}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Strengths</h3>
                      <ul className="space-y-2">
                        {aiFeedback.strengths.map((strength, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {aiFeedback.weaknesses.map((weakness, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <ChevronRight className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                            <span>{weakness}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Suggestions</h3>
                      <ul className="space-y-2">
                        {aiFeedback.suggestions.map((suggestion, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-accent font-bold mt-0.5 flex-shrink-0">{index + 1}.</span>
                            <span>{suggestion}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    {aiFeedback.improvedCode && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Improved Solution</h3>
                        <div className="relative">
                          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                            {aiFeedback.improvedCode}
                          </pre>
                          <button
                            onClick={() => setCode(aiFeedback.improvedCode || '')}
                            className="absolute top-2 right-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded"
                          >
                            Apply Solution
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <motion.div 
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: 0 }}
                    >
                      <Loader className="h-12 w-12 text-muted-foreground mb-4 opacity-70" />
                    </motion.div>
                    <h3 className="text-lg font-medium mb-1">No AI Feedback Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Get personalized feedback on your code from our AI assistant. 
                      It will analyze your solution and provide suggestions for improvement.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRequestAiFeedback}
                      className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-md flex items-center gap-2"
                    >
                      Get AI Feedback
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="h-full flex flex-col">
          <div className="border-b p-2 flex gap-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background px-3 py-1.5 rounded-md text-sm border"
            >
              {Object.keys(problem.starterCode).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              code={code}
              language={language}
              onChange={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              onRequestAiFeedback={handleRequestAiFeedback}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              isGettingFeedback={isGettingFeedback}
            />
          </div>
        </div>
      </Split>
    </div>
  );
}