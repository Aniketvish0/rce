import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Problem from '../models/problem.model';
import Submission from '../models/submission.model';
import User from '../models/user.model';
import { executeCode } from '../services/docker.service';
import { generateCodeFeedback } from '../services/ai.service';

const submitSolutionSchema = z.object({
  problemId: z.string().uuid(),
  code: z.string(),
  language: z.string(),
});

export const submitSolution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }
    
    const validatedData = submitSolutionSchema.parse(req.body);
    const { problemId, code, language } = validatedData;
    
    const problem = await Problem.findByPk(problemId);
    
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found',
      });
    }
    
    const result = await executeCode(code, language, problem.testCases);
    
    const submission = await Submission.create({
      userId: req.user.id,
      problemId,
      language,
      code,
      status: result.status,
      runtime: result.runtime,
      memory: result.memory,
    });
    
    res.status(201).json({
      id: submission.id,
      problemId: submission.problemId,
      userId: submission.userId,
      language: submission.language,
      status: submission.status,
      runtime: submission.runtime,
      memory: submission.memory,
      createdAt: submission.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }
    
    const submissions = await Submission.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Problem,
          as: 'problem',
          attributes: ['id', 'title', 'difficulty'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    const formattedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      problemId: sub.problemId,
      problemTitle: sub.problem ? sub.problem.title : 'Unknown',
      problemDifficulty: sub.problem ? sub.problem.difficulty : 'unknown',
      language: sub.language,
      status: sub.status,
      runtime: sub.runtime,
      memory: sub.memory,
      createdAt: sub.createdAt,
    }));
    
    res.status(200).json(formattedSubmissions);
  } catch (error) {
    next(error);
  }
};

export const getProblemSubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemId } = req.params;
    
    const submissions = await Submission.findAll({
      where: {
        problemId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 100, 
    });
    
    const formattedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      userId: sub.userId,
      username: sub.user ? sub.user.username : 'Unknown',
      language: sub.language,
      status: sub.status,
      runtime: sub.runtime,
      memory: sub.memory,
      createdAt: sub.createdAt,
    }));
    
    res.status(200).json(formattedSubmissions);
  } catch (error) {
    next(error);
  }
};

export const getSubmission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const submission = await Submission.findByPk(id, {
      include: [
        {
          model: Problem,
          as: 'problem',
          attributes: ['id', 'title', 'difficulty'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
    });
    
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found',
      });
    }
    
    if (!req.user?.isAdmin && submission.userId !== req.user?.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You can only view your own submissions',
      });
    }
    
    res.status(200).json({
      id: submission.id,
      problemId: submission.problemId,
      problemTitle: submission.problem ? submission.problem.title : 'Unknown',
      userId: submission.userId,
      username: submission.user ? submission.user.username : 'Unknown',
      language: submission.language,
      code: submission.code,
      status: submission.status,
      runtime: submission.runtime,
      memory: submission.memory,
      aiFeedback: submission.aiFeedback,
      createdAt: submission.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getAiFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const submission = await Submission.findByPk(id);
    
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found',
      });
    }
    
    if (!req.user?.isAdmin && submission.userId !== req.user?.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You can only get feedback for your own submissions',
      });
    }
    
    const feedback = await generateCodeFeedback(
      submission.code,
      submission.language,
      submission.problemId
    );
    
    await submission.update({
      aiFeedback: JSON.stringify(feedback),
    });
    
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};