# Resume Converter - Jobilla

Transform your resume into humorous, theme-driven job profiles with AI-powered conversion and professional portfolio generation.

## Features

- **AI-Powered Resume Conversion**: Transform resumes into Kerala-themed professional profiles (Coconut Climber, Toddy Tapper, Auto Rickshaw Driver, Pani Puri Seller)
- **Cold Mail Generation**: Professional cold email templates integrated with resume conversion
- **Portfolio Creation**: Beautiful, shareable portfolio pages with username URLs
- **File Upload Support**: PDF and DOCX resume parsing
- **Supabase Integration**: Persistent storage with fallback to in-memory storage
- **Professional Design**: Modern, responsive UI with gradient designs and animations

## Tech Stack

- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o
- **Database**: Supabase (optional)
- **Deployment**: Vercel
- **File Processing**: PDF-parse, Mammoth

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Required - OpenAI API Key for resume conversion
OPENAI_API_KEY=your_openai_api_key_here

# Optional - Supabase Configuration (will use in-memory fallback if not provided)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Environment
NODE_ENV=production
```

### 2. Installation

```bash
npm install
```

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build

```bash
npm run build
npm run start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Required Environment Variables for Vercel:
- `OPENAI_API_KEY` (Required)
- `NEXT_PUBLIC_SUPABASE_URL` (Optional)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Optional)

## Supabase Setup (Optional)

If you want persistent portfolio storage:

1. Create a Supabase project
2. Create the following table:

```sql
CREATE TABLE portfolio_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  converted_resume JSONB NOT NULL,
  portfolio_data JSONB NOT NULL,
  role_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Add your Supabase credentials to environment variables

## API Routes

- `POST /api/parse` - Parse uploaded resume files
- `POST /api/convert` - Convert parsed resume to themed version
- `GET/POST /api/portfolio/[username]` - Portfolio management
- `GET /api/portfolio/[username]/download` - Download resume as PDF
- `POST /api/cold-mail` - Generate cold mail (legacy)

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── [username]/        # Dynamic portfolio pages
│   ├── api/               # API routes
│   └── page.tsx          # Landing page
├── components/
│   └── upload/           # File upload components
├── lib/
│   ├── promptBuilder.ts  # AI prompt engineering
│   ├── supabase.ts       # Database operations
│   ├── pdfParser.ts      # File parsing utilities
│   └── types.ts          # TypeScript interfaces
└── styles/               # Global styles
```

## Key Features

### Resume Transformation Roles:
1. **Coconut Climber** - Tech skills → Tree climbing expertise
2. **Toddy Tapper** - Development experience → Traditional brewing
3. **Auto Rickshaw Driver** - Project management → Route navigation
4. **Pani Puri Seller** - Customer service → Street food mastery

### Generated Content:
- Themed professional summary
- Converted work experience with humor
- Role-specific skills and certifications  
- Professional cold mail template
- Shareable portfolio website

## Configuration Files

- `next.config.js` - Next.js configuration with build optimizations
- `vercel.json` - Vercel deployment configuration
- `eslint.config.mjs` - Lenient ESLint rules for deployment
- `tailwind.config.ts` - Tailwind CSS configuration

## Build Optimizations

The project includes several optimizations for deployment:

- TypeScript and ESLint errors converted to warnings during build
- Webpack fallbacks for Node.js modules in browser
- External package handling for PDF parsing libraries
- CORS headers configuration for API routes
- Function timeout and memory configurations

## Troubleshooting

### Build Issues:
- Ensure all environment variables are set
- Clear `.next` directory if build fails: `rm -rf .next`
- Check Node.js version compatibility (Node 18+)

### Supabase Issues:
- App works without Supabase (uses in-memory fallback)
- Verify database table schema matches expected structure
- Check environment variable names and values

### API Issues:
- Verify OpenAI API key is valid and has credits
- Check API route paths and methods
- Monitor Vercel function logs for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.