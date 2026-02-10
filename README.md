# News Search App

A modern news search application built with Vanilla JS and GNews API, optimized for Vercel.

## Local Development

Since this project uses Vercel serverless functions, you cannot use a simple static server like Live Server for the API to work.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   This will start `vercel dev`, which correctly handles the `/api` routes and your `.env` file.

3. **Configure API Key**:
   Create a `.env` file in the root directory and add your key:
   ```
   NEWS_API_KEY=your_actual_key_here
   ```
