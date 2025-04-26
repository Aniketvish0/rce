export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  isAdmin: boolean;
};

export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string[];
  starterCode: Record<string, string>;
  testCases: string[];
  solutions: Record<string, string>;
  constraints: string;
  hints: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProblemListItem = {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string[];
  solved?: boolean;
  acceptance: number;
};

export type Submission = {
  id: string;
  problemId: string;
  userId: string;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compile_error';
  runtime: number;
  memory: number;
  createdAt: string;
  aiFeedback?: string;
};

export type ExecutionResult = {
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compile_error';
  runtime: number;
  memory: number;
  stdout: string;
  stderr: string;
  testCasesPassed?: number;
  totalTestCases?: number;
};

export type AiFeedback = {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  complexity: {
    time: string;
    space: string;
  };
  improvedCode?: string;
};