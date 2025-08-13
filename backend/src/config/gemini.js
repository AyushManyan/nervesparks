import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Using GEMINI_API_KEY:', process.env.GEMINI_API_KEY);

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
export const getGemini = (model = 'gemini-2.5-flash') =>
  genAI.getGenerativeModel({ model });
