import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import Problem from '../models/problem.model';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface AiFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  complexity: {
    time: string;
    space: string;
  };
  improvedCode?: string;
}

export async function generateCodeFeedback(
  code: string,
  language: string,
  problemId: string
): Promise<AiFeedback> {
  try {
    // Get problem details to provide context
    const problem = await Problem.findByPk(problemId);
    if (!problem) {
      throw new Error('Problem not found');
    }
    
    // Build a prompt for the AI
    const prompt = `
You are an expert coding mentor providing feedback on a coding challenge solution.

PROBLEM TITLE: ${problem.title}
PROBLEM DESCRIPTION: ${problem.description}
DIFFICULTY: ${problem.difficulty}
CONSTRAINTS: ${problem.constraints}

The user has submitted the following ${language} code as their solution:
\`\`\`${language}
${code}
\`\`\`

Please provide detailed, constructive feedback on this code solution with the following sections:
1. Time Complexity Analysis
2. Space Complexity Analysis 
3. Code Strengths (3-5 bullet points)
4. Areas for Improvement (if any, 2-4 bullet points)
5. Specific Optimization Suggestions (2-4 bullet points)
6. An improved version of the code (if the original solution can be significantly improved)

Return your analysis as JSON in this exact format:
{
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "complexity": {
    "time": "The time complexity is O(...) because...",
    "space": "The space complexity is O(...) because..."
  },
  "improvedCode": "// Only include this if you have significant improvements to make\\n..."
}
`;

    // Send the prompt to Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      // Extract JSON from the response text (it might be surrounded by markdown code blocks)
      const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/) || text.match(/{[\s\S]*}/);
      const jsonString = jsonMatch ? jsonMatch[0].replace(/```json?|```/g, '') : text;
      
      const feedback = JSON.parse(jsonString);
      
      // Ensure the response has the expected structure
      return {
        strengths: Array.isArray(feedback.strengths) ? feedback.strengths : [],
        weaknesses: Array.isArray(feedback.weaknesses) ? feedback.weaknesses : [],
        suggestions: Array.isArray(feedback.suggestions) ? feedback.suggestions : [],
        complexity: {
          time: feedback.complexity?.time || 'Analysis not available',
          space: feedback.complexity?.space || 'Analysis not available',
        },
        improvedCode: feedback.improvedCode || undefined,
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback response if parsing fails
      return {
        strengths: ['Good attempt at solving the problem'],
        weaknesses: ['Unable to analyze the specific details of your code'],
        suggestions: ['Review your algorithm logic', 'Check for edge cases'],
        complexity: {
          time: 'Unable to analyze time complexity',
          space: 'Unable to analyze space complexity',
        },
      };
    }
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    throw error;
  }
}