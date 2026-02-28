# Fix All API Integrations (VAPI & Gemini)

## Overview

This guide will help you fix and verify both VAPI and Gemini API integrations throughout the application.

## APIs Used

### 1. Gemini AI (Google)
**Used for:**
- CV analysis and skill extraction
- Generating personalized interview questions
- Creating detailed feedback
- Generating DSA coding questions

**Files using Gemini:**
- `server/services/aiService.js` - CV analysis, questions, feedback
- `server/services/codingService.js` - DSA question generation
- `server/scripts/generate-coding-questions.js` - Bulk question generation

### 2. VAPI (Voice AI)
**Used for:**
- Voice-based interviews
- Real-time speech-to-text
- AI interviewer conversations

**Files using VAPI:**
- `client/src/components/VoiceInterview.jsx` - Voice interview UI

## Quick Test

Run this to test both APIs:
```bash
node test-apis.js
```

Expected output:
```
✅ Gemini API is working!
✅ VAPI tokens configured!
🎉 All APIs are configured correctly!
```

## Configuration

### Gemini API Setup

**Step 1: Get API Key**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

**Step 2: Add to Environment**

In `server/.env`:
```
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...your_key_here
```

**Step 3: Verify**
```bash
node test-apis.js
```

### VAPI Setup

**Step 1: Get Token**
1. Go to https://vapi.ai
2. Sign up / Login
3. Get your Web Token from dashboard

**Step 2: Add to Both Environments**

In `server/.env`:
```
VAPI_WEB_TOKEN=your_vapi_token_here
```

In `client/.env`:
```
VITE_VAPI_WEB_TOKEN=your_vapi_token_here
```

**Step 3: Verify**
```bash
node test-apis.js
```

## Current Configuration

### Server (.env)
```
PORT=5000
USE_MONGODB=false
MONGODB_URI=mongodb+srv://...

# AI Services
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyBYVTVVSzQnWtjBbCJ1pmBTou1sGmPCbwY
VAPI_WEB_TOKEN=a0dca727-03cb-48fa-9630-1637a9c98ef4

NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_VAPI_WEB_TOKEN=a0dca727-03cb-48fa-9630-1637a9c98ef4
```

## Features Using APIs

### Gemini AI Features

**1. CV Upload & Analysis**
- Location: `/cv-upload`
- Function: `analyzeCV()` in `aiService.js`
- Extracts: Skills, education, experience, projects
- Fallback: Text-based extraction if AI fails

**2. Personalized Interview Questions**
- Location: `/personalized-interview`
- Function: `generatePersonalizedQuestions()` in `aiService.js`
- Creates: Custom questions based on CV
- Fallback: Template questions if AI fails

**3. Interview Feedback**
- Location: `/feedback/:id`
- Function: `generateDetailedFeedback()` in `aiService.js`
- Provides: Scores, strengths, weaknesses, suggestions
- Fallback: Basic feedback if AI fails

**4. DSA Coding Questions**
- Location: `/coding-practice`
- Function: `generateDSAQuestions()` in `codingService.js`
- Creates: 10 questions per topic
- Fallback: Pre-generated questions from file/DB

### VAPI Features

**1. Voice Interview**
- Location: `/interview/:id` (voice mode)
- Component: `VoiceInterview.jsx`
- Features:
  - Real-time voice conversation
  - AI interviewer asks questions
  - Speech-to-text transcription
  - Live transcript display

## Error Handling

### Gemini API Errors

**Error: "API key not valid"**
```
Solution:
1. Check API key in server/.env
2. Verify key at https://makersuite.google.com/app/apikey
3. Regenerate key if needed
4. Restart server
```

**Error: "Model not found"**
```
Solution:
The code tries multiple models:
- gemini-1.5-pro (preferred)
- gemini-1.0-pro (fallback)
- gemini-pro (fallback)

If all fail, uses template responses.
```

**Error: "Rate limit exceeded"**
```
Solution:
1. Wait a few minutes
2. Reduce request frequency
3. Use pre-generated questions for coding practice
```

### VAPI Errors

**Error: "VAPI not initialized"**
```
Solution:
1. Check VITE_VAPI_WEB_TOKEN in client/.env
2. Restart client: npm run dev
3. Clear browser cache
```

**Error: "Failed to start interview"**
```
Solution:
1. Check microphone permissions
2. Verify VAPI token is valid
3. Check browser console for details
4. Try different browser (Chrome recommended)
```

**Error: "Connection failed"**
```
Solution:
1. Check internet connection
2. Verify VAPI service status
3. Check firewall/antivirus settings
4. Try again in a few minutes
```

## Fallback Systems

### Gemini Fallbacks

**CV Analysis:**
- Primary: AI extraction
- Fallback: Text-based keyword matching
- Always returns: Valid skills array

**Interview Questions:**
- Primary: AI-generated personalized questions
- Fallback: Template questions (10 pre-defined)
- Always returns: Valid question array

**Feedback:**
- Primary: AI-generated detailed analysis
- Fallback: Template feedback with basic scores
- Always returns: Valid feedback object

**Coding Questions:**
- Primary: MongoDB/File pre-generated questions
- Secondary: AI generation on-the-fly
- Fallback: Template questions (5 per topic)
- Always returns: Requested number of questions

### VAPI Fallbacks

**Voice Interview:**
- Primary: VAPI voice conversation
- Fallback: Text-based interview (if VAPI fails)
- User can always switch to text mode

## Testing Each Feature

### Test CV Analysis
1. Go to `/cv-upload`
2. Upload a PDF CV
3. Check console for: "✅ AI analysis successful"
4. Verify skills are extracted

### Test Personalized Questions
1. Upload CV first
2. Go to `/personalized-interview`
3. Configure interview
4. Click "Start Interview"
5. Check questions are generated

### Test Feedback
1. Complete an interview
2. Go to feedback page
3. Check detailed analysis appears
4. Verify scores and suggestions

### Test Coding Questions
1. Go to `/coding-practice`
2. Select topic
3. Choose question count
4. Click "Generate Questions"
5. Should load instantly (< 1 second)

### Test Voice Interview
1. Go to `/interview/:id`
2. Click "Connect" button
3. Allow microphone access
4. AI should start speaking
5. Respond to questions
6. Check transcript appears

## Monitoring

### Server Logs

**Gemini API:**
```
🤖 Attempting AI analysis...
✅ AI analysis successful, skills found: 15
```

**VAPI:**
```
Call started
User started speaking
Message: {...}
```

### Browser Console

**VAPI Events:**
```
Call started
Message: {type: 'transcript', role: 'assistant', ...}
User stopped speaking
```

## Performance

### Gemini API
- **CV Analysis:** 2-5 seconds
- **Question Generation:** 5-10 seconds
- **Feedback Generation:** 3-7 seconds
- **Coding Questions:** Instant (pre-generated)

### VAPI
- **Connection:** 1-2 seconds
- **Response Time:** Real-time
- **Transcription:** Real-time
- **Latency:** < 500ms

## Troubleshooting

### Gemini Not Working

1. **Test API key:**
   ```bash
   node test-apis.js
   ```

2. **Check server logs:**
   - Look for "AI analysis successful"
   - Or "AI analysis not available, using fallback"

3. **Verify .env file:**
   - Check `server/.env` has correct key
   - No extra spaces or quotes

4. **Restart server:**
   ```bash
   restart-server-now.bat
   ```

### VAPI Not Working

1. **Test token:**
   ```bash
   node test-apis.js
   ```

2. **Check browser console:**
   - Look for VAPI errors
   - Check microphone permissions

3. **Verify .env files:**
   - `server/.env` has VAPI_WEB_TOKEN
   - `client/.env` has VITE_VAPI_WEB_TOKEN

4. **Restart client:**
   ```bash
   cd client
   npm run dev
   ```

### Both Not Working

1. **Check internet connection**
2. **Verify API keys are valid**
3. **Check firewall settings**
4. **Try different network**
5. **Contact API providers**

## API Limits

### Gemini API (Free Tier)
- **Requests:** 60 per minute
- **Tokens:** 32,000 per request
- **Daily:** Generous free quota

**Recommendation:** Use pre-generated questions for coding practice to save API calls.

### VAPI (Free Tier)
- **Minutes:** Check your plan
- **Concurrent Calls:** Limited
- **Features:** Basic voice features

**Recommendation:** Test with short interviews first.

## Best Practices

### Gemini API
1. ✅ Use pre-generated questions when possible
2. ✅ Implement fallbacks for all features
3. ✅ Cache responses when appropriate
4. ✅ Handle rate limits gracefully
5. ✅ Log errors for debugging

### VAPI
1. ✅ Check microphone permissions first
2. ✅ Provide clear user instructions
3. ✅ Show connection status
4. ✅ Handle errors gracefully
5. ✅ Offer text alternative

## Summary

**APIs Configured:**
- ✅ Gemini AI - For CV analysis, questions, feedback
- ✅ VAPI - For voice interviews

**Fallbacks Implemented:**
- ✅ All features work without APIs
- ✅ Graceful degradation
- ✅ User-friendly error messages

**Testing:**
```bash
node test-apis.js
```

**Next Steps:**
1. Test APIs with the script
2. Fix any configuration issues
3. Generate coding questions
4. Test all features in browser

---

**Ready to test?**
```bash
node test-apis.js
```
