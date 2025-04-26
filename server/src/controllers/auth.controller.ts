import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );
};

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
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
    
    // Create new user
    const user = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      isAdmin: false,
    });
    
    // Generate JWT token
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

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await User.findOne({
      where: {
        email: validatedData.email,
      },
    });
    
    // Check if user exists and password is correct
    if (!user || !(await user.validatePassword(validatedData.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }
    
    // Generate JWT token
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

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User should be attached to the request by the auth middleware
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