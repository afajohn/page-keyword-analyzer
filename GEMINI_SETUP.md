# Gemini API Setup Guide

## Quick Fix for AI Analysis Tab

The "AI analysis is currently unavailable" error occurs because the Gemini API key is not configured. Here's how to fix it:

### Step 1: Get Your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Configure the API Key
1. Create a file named `.env.local` in your project root
2. Add the following line:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with the API key you copied

### Step 3: Restart the Development Server
1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again
3. The AI analysis should now work

### Example .env.local file:
```
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Troubleshooting
- Make sure the file is named exactly `.env.local` (not `.env`)
- Ensure there are no spaces around the `=` sign
- The API key should start with `AIza` or similar
- Restart the development server after making changes

### What Changed
- Updated the Gemini model from `gemini-1.5-pro` to `gemini-1.5-flash` for better availability
- Added better error handling with specific error messages
- Added helpful UI guidance for API key setup
- Improved API key validation

The webapp will work without the API key, but you'll only get basic keyword analysis without the AI-powered insights.
