// CSV to JSON converter for question import
export const csvToJson = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length !== headers.length) continue;

    const question = {};
    headers.forEach((header, index) => {
      question[header] = values[index];
    });

    // Convert to our format
    const formattedQuestion = {
      id: Date.now() + Math.random(),
      name: question.name || question.title || question.question || '',
      difficulty: question.difficulty || 'Medium',
      link: question.link || question.url || '',
      tags: question.tags ? question.tags.split(';').map(t => t.trim()) : [],
      frequency: question.frequency || '50.0%',
      acceptance: question.acceptance || question.acceptanceRate || '50.0%',
      company: question.company || 'Unknown',
      category: question.category || 'All Questions',
      createdAt: new Date().toISOString()
    };

    if (formattedQuestion.name) {
      questions.push(formattedQuestion);
    }
  }

  return questions;
};

// Sample CSV format
export const getSampleCSV = () => {
  return `name,difficulty,link,tags,frequency,acceptance,company,category
"Two Sum","Easy","https://leetcode.com/problems/two-sum","Array;Hash Table","85.0%","52.3%","Google","All Questions"
"Add Two Numbers","Medium","https://leetcode.com/problems/add-two-numbers","Linked List;Math","75.0%","42.1%","Amazon","Last 3 Months"
"Longest Substring Without Repeating Characters","Medium","https://leetcode.com/problems/longest-substring-without-repeating-characters","String;Sliding Window","90.0%","35.2%","Microsoft","Last 30 Days"`;
};

// LeetCode format converter
export const convertLeetCodeFormat = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      id: Date.now() + Math.random(),
      name: item.title || item.name || '',
      difficulty: item.difficulty || 'Medium',
      link: item.url || item.link || `https://leetcode.com/problems/${item.slug || ''}`,
      tags: item.topicTags ? item.topicTags.map(tag => tag.name) : [],
      frequency: item.frequency || '50.0%',
      acceptance: item.acRate ? `${item.acRate}%` : '50.0%',
      company: item.company || 'LeetCode',
      category: 'All Questions',
      createdAt: new Date().toISOString()
    }));
  }
  return [];
};