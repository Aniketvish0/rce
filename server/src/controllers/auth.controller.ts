import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const userExists = await User.findOne({
      where: {
        email: validatedData.email,
      },
    });
    
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }
    
    const user = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      isAdmin: false,
    });
    
    const token = generateToken(user.id);
    
    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const user = await User.findOne({
      where: {
        email: validatedData.email,
      },
    });
    
    if (!user || !(await user.validatePassword(validatedData.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }
    
    const token = generateToken(user.id);
    
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};