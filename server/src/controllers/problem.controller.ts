import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Problem from '../models/problem.model';
import Submission from '../models/submission.model';
import { z } from 'zod';

export const getProblems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { difficulty, category, search } = req.query;
    
    const whereClause: any = {};
    
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    
    if (category) {
      whereClause.category = {
        [Op.contains]: [category],
      };
    }
    
    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }
    
    const problems = await Problem.findAll({
      where: whereClause,
      attributes: ['id', 'title', 'difficulty', 'category', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });
    
    const problemIds = problems.map((p) => p.id);
    const submissions = await Submission.findAll({
      where: {
        problemId: {
          [Op.in]: problemIds,
        },
      },
      attributes: ['problemId', 'status'],
    });
    const submissionsByProblem: Record<string, { total: number; accepted: number }> = {};
    
    submissions.forEach((sub) => {
      if (!submissionsByProblem[sub.problemId]) {
        submissionsByProblem[sub.problemId] = { total: 0, accepted: 0 };
      }
      
      submissionsByProblem[sub.problemId].total += 1;
      
      if (sub.status === 'accepted') {
        submissionsByProblem[sub.problemId].accepted += 1;
      }
    });
    
    const userId = req.user?.id;
    let solvedProblems: string[] = [];
    
    if (userId) {
      const userAcceptedSubmissions = await Submission.findAll({
        where: {
          userId,
          status: 'accepted',
          problemId: {
            [Op.in]: problemIds,
          },
        },
        attributes: ['problemId'],
      });
      
      solvedProblems = userAcceptedSubmissions.map((sub) => sub.problemId);
    }

    const formattedProblems = problems.map((problem) => {
      const { total = 0, accepted = 0 } = submissionsByProblem[problem.id] || {};
      const acceptance = total > 0 ? (accepted / total) * 100 : 0;
      
      return {
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        acceptance,
        solved: userId ? solvedProblems.includes(problem.id) : undefined,
      };
    });
    
    res.status(200).json(formattedProblems);
  } catch (error) {
    next(error);
  }
};

export const getProblem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const problem = await Problem.findByPk(id);
    
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found',
      });
    }
    
    res.status(200).json(problem);
  } catch (error) {
    next(error);
  }
};

const createProblemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  category: z.array(z.string()),
  starterCode: z.record(z.string(), z.string()),
  testCases: z.array(z.string()),
  solutions: z.record(z.string(), z.string()),
  constraints: z.string(),
  hints: z.array(z.string()).optional(),
});

export const createProblem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Admin access required',
      });
    }
    const validatedData = createProblemSchema.parse(req.body);
    
    const problem = await Problem.create(validatedData);
    
    res.status(201).json({
      status: 'success',
      problem,
    });
  } catch (error) {
    next(error);
  }
};
export const updateProblem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Admin access required',
      });
    }
    
    const { id } = req.params;
    const validatedData = createProblemSchema.parse(req.body);
    const problem = await Problem.findByPk(id);
    
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found',
      });
    }
    await problem.update(validatedData);
    
    res.status(200).json({
      status: 'success',
      problem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Admin access required',
      });
    }
    
    const { id } = req.params;
    
    const problem = await Problem.findByPk(id);
    
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found',
      });
    }
  
    await problem.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};