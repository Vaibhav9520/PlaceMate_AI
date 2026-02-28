# Setup Pre-Generated Question Database

## Overview

Instead of generating questions on-the-fly (slow and unreliable), we'll:
1. **Generate** 10 questions for each topic using AI (one-time)
2. **Store** them in MongoDB or JSON file
3. **Retrieve** them instantly when users request

## Benefits

✅ **Fast** - Instant retrieval instead of waiting for AI
✅ **Reliable** - Questions always available, no AI failures
✅ **Consistent** - Same quality questions every time
✅ **Scalable** - Can handle many users simultaneously

## Setup Process

### Step 1: Generate Questions (One-Time)

Run this command to generate 150 questions (10 per topic):

```bash
generate-questions.bat
```

This will:
- Use Gemini AI to generate 10 unique questions for each of 15 topics
- Save them to `server/data/coding-questions.json`
- Take approximately 5-10 minutes
- Create 150 total questions

**Topics covered:**
- Arrays, Strings, Linked Lists
- Stacks, Queues, Trees, Graphs
- Sorting, Searching, Dynamic Programming
- Recursion, Backtracking, Greedy
- Hash Tables, Heaps

### Step 2: Seed MongoDB (Optional)

If you want to use MongoDB Atlas:

```bash
seed-questions.bat
```

This will:
- Upload all questions to MongoDB Atlas
- Create `codingquestions` collection
- Index by topic for fast retrieval

**Note:** If you don't use MongoDB, questions will be loaded from the JSON file.

### Step 3: Restart Server

```bash
restart-server-now.bat
```

The server will now use pre-generated questions!

## How It Works

### Question Retrieval Priority

1. **MongoDB** (if enabled)
   - Fetches random questions from the topic
   - Fast database query
   - Scalable for production

2. **File-based** (fallback)
   - Loads from `coding-questions.json`
   - Works without MongoDB
   - Perfect for development

3. **AI Generation** (last resort)
   - Only if no pre-generated questions found
   - Generates on-the-fly
   - Slowest option

### User Experience

**Before (AI generation):**
```
User clicks "Generate Questions"
→ Wait 10-30 seconds for AI
→ Sometimes fails
→ Inconsistent quality
```

**After (Pre-generated):**
```
User clicks "Generate Questions"
→ Instant retrieval (< 1 second)
→ Always works
→ Consistent quality
```

## File Structure

```
server/
├── data/
│   └── coding-questions.json          # Generated questions
├── models_backup/
│   └── CodingQuestion.js              # MongoDB model
├── scripts/
│   ├── generate-coding-questions.js   # AI generation script
│   └── seed-coding-questions.js       # MongoDB seeding script
└── services/
    └── codingService.js               # Updated to fetch from DB
```

## Question Format

Each question includes:
```json
{
  "topic": "Arrays",
  "questionNumber": 1,
  "title": "Two Sum",
  "difficulty": "Easy",
  "description": "Given an array of integers...",
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "nums[0] + nums[1] == 9"
    }
  ],
  "constraints": [
    "2 <= nums.length <= 10^4",
    "Only one valid answer exists"
  ],
  "testCases": [
    {
      "input": "[2,7,11,15]\\n9",
      "expectedOutput": "[0,1]",
      "hidden": false
    },
    {
      "input": "[3,3]\\n6",
      "expectedOutput": "[0,1]",
      "hidden": true
    }
  ]
}
```

## MongoDB Schema

```javascript
{
  topic: String (indexed),
  questionNumber: Number,
  title: String,
  difficulty: String (Easy/Medium/Hard),
  description: String,
  examples: Array,
  constraints: Array,
  testCases: Array,
  timestamps: true
}
```

## Configuration

### Enable MongoDB

In `server/.env`:
```
USE_MONGODB=true
MONGODB_URI=mongodb+srv://...
```

### Disable MongoDB (Use File-Based)

In `server/.env`:
```
USE_MONGODB=false
```

Questions will be loaded from `server/data/coding-questions.json`.

## Usage

### Generate Questions for First Time

```bash
# Step 1: Generate with AI
generate-questions.bat

# Step 2: (Optional) Upload to MongoDB
seed-questions.bat

# Step 3: Restart server
restart-server-now.bat
```

### Update Questions Later

To regenerate questions (e.g., to improve quality):

```bash
# Regenerate all questions
generate-questions.bat

# Re-seed MongoDB
seed-questions.bat

# Restart server
restart-server-now.bat
```

## Testing

### Test Question Retrieval

1. Start server
2. Open http://localhost:5173
3. Login
4. Click "DSA Coding Practice"
5. Select "Arrays" topic
6. Choose "10 Questions"
7. Click "Generate Questions"
8. Should load instantly! ⚡

### Check Server Logs

You should see:
```
📚 Fetching 10 questions for Arrays from database...
✅ Retrieved 10 questions from MongoDB
```

Or:
```
📚 Fetching 10 questions for Arrays from database...
📁 Trying file-based question storage...
✅ Retrieved 10 questions from file storage
```

## Troubleshooting

### Questions Not Generating

**Problem:** `generate-questions.bat` fails

**Solutions:**
1. Check Gemini API key in `server/.env`
2. Verify internet connection
3. Check server logs for errors
4. Try running manually:
   ```bash
   cd server
   node scripts/generate-coding-questions.js
   ```

### MongoDB Seeding Fails

**Problem:** `seed-questions.bat` fails

**Solutions:**
1. Check MongoDB connection string in `server/.env`
2. Verify MongoDB Atlas cluster is running
3. Check IP whitelist in MongoDB Atlas
4. Ensure `coding-questions.json` exists
5. Try running manually:
   ```bash
   cd server
   node scripts/seed-coding-questions.js
   ```

### Questions Not Loading

**Problem:** Still generating with AI instead of using pre-generated

**Solutions:**
1. Check if `server/data/coding-questions.json` exists
2. Verify file has content (should be ~500KB)
3. Restart server completely
4. Check server logs for errors
5. Verify MongoDB connection if enabled

### Want to Add More Questions

Edit the generation script:
```javascript
// In server/scripts/generate-coding-questions.js
// Change the prompt to generate more questions
const prompt = `Generate EXACTLY 20 different...`; // Instead of 10
```

Then regenerate:
```bash
generate-questions.bat
seed-questions.bat
restart-server-now.bat
```

## Performance Comparison

### Before (AI Generation)
- **Time:** 10-30 seconds per request
- **Success Rate:** ~70% (AI failures)
- **Concurrent Users:** Limited (API rate limits)
- **Cost:** API calls per request

### After (Pre-Generated)
- **Time:** < 1 second per request
- **Success Rate:** 100%
- **Concurrent Users:** Unlimited
- **Cost:** One-time generation only

## Maintenance

### Regular Updates

Regenerate questions every few months to:
- Improve question quality
- Add new problem types
- Update based on user feedback

### Monitoring

Check MongoDB Atlas dashboard:
- Collection: `codingquestions`
- Documents: Should have 150 (10 per topic × 15 topics)
- Indexes: `topic_1_questionNumber_1`

## Summary

**Setup Steps:**
1. Run `generate-questions.bat` (one-time, 5-10 minutes)
2. Run `seed-questions.bat` (optional, for MongoDB)
3. Run `restart-server-now.bat`
4. Test in browser - questions load instantly!

**Result:**
- ⚡ Instant question loading
- 🎯 100% reliability
- 📊 150 pre-generated questions
- 🚀 Production-ready

---

**Ready to setup?**

```bash
generate-questions.bat
```

This will take 5-10 minutes to generate all 150 questions!
