<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# Jobilla.com

## Basic Details
### Team Name: Undefined


### Team Members
- Team Lead: Soorya Krishna P R - Christ College of Engineering, IJK
- Member 2: Jyothis Mariya Joy - Christ College of Engineering, IJK

### Project Description
Transform your boring professional resume into a comedy masterpiece! Upload your serious CV and watch our AI turn it into themed, humorous resumes for unconventional career paths like Coconut Climber or Pani Puri Entrepreneur.

### The Problem (that doesn't exist)
Everyone's tired of looking at boring, professional resumes that actually make sense. Why should your resume be readable and relevant when it could be hilarious and completely unrelated to any real job? The world desperately needs more confusion in the hiring process!

### The Solution (that nobody asked for)
We built an AI-powered resume destroyer that converts your serious professional experience into themed career disasters. Want to be a Coconut Climber? We'll turn your React skills into "React-ive Tree Climbing." Applied to be a Software Engineer? Nah, you're now a Toddy Tapper with expertise in "Natural Fermentation and Bug Debugging."

## Technical Details
### Technologies/Components Used
For Software:
- **Languages**: TypeScript, JavaScript
- **Frameworks**: Next.js 15, React 18
- **Libraries**: Framer Motion (animations), OpenAI GPT-4o (AI conversion), jsPDF (PDF generation), pdf-parse & mammoth (file parsing), Tailwind CSS (styling)
- **Database**: Supabase (PostgreSQL) for portfolio persistence
- **Tools**: Vercel (deployment), ESLint (linting), PostCSS (CSS processing)

### Key Features
- ✨ **Smooth Animations**: Beautiful framer-motion animations throughout the landing page
- 🤖 **AI-Powered Conversion**: GPT-4o transforms your resume into hilarious themed versions
- 📄 **Multi-Format Support**: Upload PDF or DOCX files
- 🌐 **Personal Portfolios**: Get your own portfolio URL (e.g., `/username`) 
- 📊 **Database Persistence**: Portfolios saved with Supabase (optional)
- 📧 **Cold Email Templates**: AI-generated professional cold emails
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🔧 **Graceful Fallbacks**: Works even without database configuration

For Hardware:
- [List main components]
- [List specifications]
- [List tools required]

### Implementation
For Software:

## Quick Start

```bash
# Clone the repository
git clone https://github.com/SooryaCodes/jobilla.git
cd jobilla

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OpenAI API key to .env.local:
# OPENAI_API_KEY=sk-your-openai-key-here

# Start development server
npm run dev
# Navigate to http://localhost:3000
```

## Full Setup (with Portfolio Feature)

For persistent portfolios, set up Supabase:

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project

2. **Add Supabase Credentials** to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Setup Database**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions

4. **Health Check**: Visit `http://localhost:3000/api/health` to verify setup

## Environment Variables

```bash
# Required for AI conversion
OPENAI_API_KEY=sk-your-openai-key-here

# Optional for portfolio persistence  
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot1](https://via.placeholder.com/800x400?text=Resume+Converter+Demo)
*Main landing page with file upload interface and role selection*

![Screenshot2](https://via.placeholder.com/800x600?text=Portfolio+Demo)
*Generated portfolio page showing transformed professional identity*

![Screenshot3](https://via.placeholder.com/800x500?text=Resume+Output+Demo)
*AI-generated resume with humorous role-specific transformations*

# Diagrams
![Workflow](https://via.placeholder.com/1000x600?text=System+Architecture+Diagram)
*System workflow: File Upload → AI Processing → Resume Generation → Portfolio Creation*


### Project Demo
# Video
[Add your demo video link here]
*Demonstrates the complete resume transformation process from upload to comedy gold*

# Additional Demos
- Live deployment: [jobilla.vercel.app](https://jobilla.vercel.app)

## Team Contributions
- [Team Lead]: AI prompt engineering, resume parsing logic, project architecture
- [Member 2]: Frontend development, UI/UX design, portfolio generation
- [Member 3]: Database integration, PDF generation, deployment configuration

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)



