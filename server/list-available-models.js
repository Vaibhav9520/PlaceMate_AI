import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function listModels() {
  console.log('🔍 Listing available Gemini models...\n');
  
  if (!API_KEY) {
    console.log('❌ No API key found');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    // Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.models) {
      console.log('✅ Available models:\n');
      data.models.forEach(model => {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`✓ ${model.name}`);
          console.log(`  Display Name: ${model.displayName}`);
          console.log(`  Description: ${model.description}`);
          console.log('');
        }
      });
    } else {
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
  }
}

listModels();
