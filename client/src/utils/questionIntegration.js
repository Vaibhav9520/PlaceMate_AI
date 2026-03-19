// Integration utilities for combining custom questions with company data
import { loadCompanyData, COMPANIES } from '../data/companyQuestions';

// Merge custom questions with company data
export const mergeQuestionsWithCompanyData = async (companyName, customQuestions = []) => {
  try {
    // Load original company data
    const originalData = await loadCompanyData(companyName);
    
    // Get custom questions for this company
    const companyCustomQuestions = customQuestions.filter(q => 
      q.company.toLowerCase() === companyName.toLowerCase()
    );
    
    // Group custom questions by category
    const customByCategory = companyCustomQuestions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {});
    
    // Merge with original data
    const mergedData = { ...originalData };
    
    Object.keys(customByCategory).forEach(category => {
      if (mergedData[category]) {
        mergedData[category] = [...mergedData[category], ...customByCategory[category]];
      } else {
        mergedData[category] = customByCategory[category];
      }
    });
    
    return mergedData;
  } catch (error) {
    console.error('Error merging questions:', error);
    // Return only custom questions if company data fails
    const companyCustomQuestions = customQuestions.filter(q => 
      q.company.toLowerCase() === companyName.toLowerCase()
    );
    
    return companyCustomQuestions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {});
  }
};

// Get all companies (original + custom)
export const getAllCompanies = (customQuestions = []) => {
  const customCompanies = [...new Set(customQuestions.map(q => q.company))];
  const allCompanies = [...new Set([...COMPANIES, ...customCompanies])];
  return allCompanies.sort();
};

// Export questions in different formats
export const exportQuestions = (questions, format = 'json') => {
  switch (format) {
    case 'csv':
      return exportToCSV(questions);
    case 'leetcode':
      return exportToLeetCodeFormat(questions);
    default:
      return JSON.stringify(questions, null, 2);
  }
};

const exportToCSV = (questions) => {
  const headers = ['name', 'difficulty', 'link', 'tags', 'frequency', 'acceptance', 'company', 'category'];
  const csvRows = [headers.join(',')];
  
  questions.forEach(q => {
    const row = [
      `"${q.name}"`,
      `"${q.difficulty}"`,
      `"${q.link}"`,
      `"${q.tags.join(';')}"`,
      `"${q.frequency}"`,
      `"${q.acceptance}"`,
      `"${q.company}"`,
      `"${q.category}"`
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};

const exportToLeetCodeFormat = (questions) => {
  return questions.map(q => ({
    title: q.name,
    difficulty: q.difficulty,
    url: q.link,
    topicTags: q.tags.map(tag => ({ name: tag })),
    acRate: parseFloat(q.acceptance.replace('%', '')),
    frequency: q.frequency,
    company: q.company
  }));
};

// Validate question data
export const validateQuestion = (question) => {
  const errors = [];
  
  if (!question.name || question.name.trim().length === 0) {
    errors.push('Question name is required');
  }
  
  if (!question.company || question.company.trim().length === 0) {
    errors.push('Company name is required');
  }
  
  if (!['Easy', 'Medium', 'Hard'].includes(question.difficulty)) {
    errors.push('Difficulty must be Easy, Medium, or Hard');
  }
  
  if (question.link && !isValidUrl(question.link)) {
    errors.push('Invalid URL format');
  }
  
  return errors;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Search questions across all data
export const searchQuestions = (query, companyData, customQuestions = []) => {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  // Search in company data
  Object.keys(companyData).forEach(category => {
    companyData[category].forEach(question => {
      if (
        question.name.toLowerCase().includes(searchTerm) ||
        question.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({ ...question, source: 'company', category });
      }
    });
  });
  
  // Search in custom questions
  customQuestions.forEach(question => {
    if (
      question.name.toLowerCase().includes(searchTerm) ||
      question.company.toLowerCase().includes(searchTerm) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ) {
      results.push({ ...question, source: 'custom' });
    }
  });
  
  return results;
};