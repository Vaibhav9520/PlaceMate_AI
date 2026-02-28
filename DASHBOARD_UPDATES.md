# Dashboard & CV-Based Interview Updates

## Changes Made

### 1. Dashboard Quick Actions - Reordered
**File: `client/src/pages/Dashboard.jsx`**

Changed the order of Quick Actions:
1. ✅ **Quick Practice** (First - Green icon)
   - Quick practice session without setup
   - Goes to `/interview`

2. ✅ **CV-Based Interview** (Second - Primary icon)
   - Personalized questions based on your CV
   - Goes to `/interview/personalized`

3. ✅ **View All Interviews** (Third - Blue icon)
   - See your interview history and progress

### 2. CV-Based Interview Page - Enhanced
**File: `client/src/pages/PersonalizedInterview.jsx`**

#### New Features:

1. **CV Upload Check**
   - Automatically checks if user has uploaded CV
   - If no CV: Shows warning screen and redirects to CV upload page
   - Toast notification: "Please upload your CV first"

2. **Interview Type Selection**
   - Mixed (Technical + HR) - Default
   - Technical Only - Focus on technical skills
   - HR/Behavioral Only - Focus on soft skills
   - Shows description for each type

3. **Enhanced Configuration Form**
   - Interview Type dropdown with descriptions
   - Target Job Role selection
   - Difficulty Level (Easy, Medium, Hard)
   - Number of Questions with time estimates:
     - 5 Questions (~10 minutes)
     - 10 Questions (~20 minutes)
     - 15 Questions (~30 minutes)
     - 20 Questions (~40 minutes)

4. **Skills Display from CV**
   - Shows all skills extracted from uploaded CV
   - Displayed as blue pills/badges
   - Message: "Questions will be tailored to these skills"
   - Shows count of skills extracted

5. **Enhanced Profile Summary**
   - CV Status with checkmark (✓ Uploaded / ✗ Not Uploaded)
   - Total Interviews count
   - Skills Extracted count
   - Color-coded status indicators

## User Flow

### Scenario 1: User Has CV Uploaded
1. Click "CV-Based Interview" from Dashboard
2. See profile summary with skills
3. Configure interview:
   - Select interview type (Mixed/Technical/HR)
   - Choose job role
   - Set difficulty level
   - Pick number of questions
4. See extracted skills from CV
5. Click "Start CV-Based Interview"
6. Interview begins with personalized questions

### Scenario 2: User Has NO CV
1. Click "CV-Based Interview" from Dashboard
2. See warning screen: "CV Required"
3. Automatically redirected to CV upload page after 2 seconds
4. Or click "Upload CV Now" button immediately

## Benefits

✅ Clear separation between Quick Practice and CV-Based interviews
✅ Prevents users from starting CV-based interview without CV
✅ Shows what skills will be used for questions
✅ More control over interview type and difficulty
✅ Time estimates help users plan their practice
✅ Better user experience with clear feedback

## Technical Details

### New State Variables
```javascript
interviewType: "mixed" // Can be: mixed, technical, hr
```

### CV Check Logic
```javascript
useEffect(() => {
  if (!user?.cvURL) {
    toast.error("Please upload your CV first");
    setTimeout(() => navigate("/cv-upload"), 2000);
  }
}, [user, navigate]);
```

### Skills Display
- Reads from `user.skills` array
- Shows as styled badges
- Falls back to "No skills extracted yet" if empty

## Testing Checklist

- [ ] Dashboard shows correct order: Quick Practice → CV-Based → View All
- [ ] CV-Based Interview redirects if no CV uploaded
- [ ] Interview type dropdown works (Mixed/Technical/HR)
- [ ] Skills from CV are displayed correctly
- [ ] All form fields are functional
- [ ] Submit creates personalized interview
- [ ] Time estimates show for question counts
