import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { generateCodeFeedback } from '../services/ai.service';

const aiFeedbackSchema = z.object({
  code: z.string(),
  language: z.string(),
  problemId: z.string().uuid(),
});

export const getCodeFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = aiFeedbackSchema.parse(req.body);
    const { code, language, problemId } = validatedData;
    
    const feedback = await generateCodeFeedback(code, language, problemId);
    
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};