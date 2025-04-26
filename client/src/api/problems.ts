import api from './axios';
import { Problem, ProblemListItem, Submission, ExecutionResult, AiFeedback } from '../types';

export async function getProblems(): Promise<ProblemListItem[]> {
  const response = await api.get('/problems');
  return response.data;
}

export async function getProblem(id: string): Promise<Problem> {
  const response = await api.get(`/problems/${id}`);
  return response.data;
}

export async function executeCode(
  problemId: string,
  code: string,
  language: string
): Promise<ExecutionResult> {
  const response = await api.post('/execute', {
    problemId,
    code,
    language,
  });
  return response.data;
}

export async function submitSolution(
  problemId: string,
  code: string,
  language: string
): Promise<Submission> {
  const response = await api.post('/submissions', {
    problemId,
    code,
    language,
  });
  return response.data;
}

export async function getUserSubmissions(): Promise<Submission[]> {
  const response = await api.get('/submissions/me');
  return response.data;
}

export async function getProblemSubmissions(problemId: string): Promise<Submission[]> {
  const response = await api.get(`/submissions/problem/${problemId}`);
  return response.data;
}

export async function getAiFeedback(
  code: string,
  language: string,
  problemId: string
): Promise<AiFeedback> {
  const response = await api.post('/ai/feedback', {
    code,
    language,
    problemId,
  });
  return response.data;
}