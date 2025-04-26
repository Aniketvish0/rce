import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Problem from '../models/problem.model';
import { executeCode } from '../services/docker.service';

// Execute code without submitting
const executeCodeSchema = z.object({
  problemId: z.string().uuid(),
  code: z.string(),
  language: z.string(),
});

export const runCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = executeCodeSchema.parse(req.body);
    const { problemId, code, language } = validatedData;
    
    // Get problem test cases
    const problem = await Problem.findByPk(problemId);
    
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found',
      });
    }
    
    // Execute code
    const result = await executeCode(code, language, problem.testCases);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};