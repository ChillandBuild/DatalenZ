# DataLens

A transparent data analysis platform that combines AI-powered code generation with secure sandbox execution.

## Core Philosophy

**Trust through Transparency** - Users can see and understand the code being executed rather than receiving opaque AI responses.

## Architecture

- **Frontend**: Next.js 14 with App Router, Tailwind CSS, Shadcn UI
- **Backend**: Python FastAPI with smolagents framework
- **Sandbox**: E2B Firecracker MicroVMs for isolated code execution
- **AI**: OpenRouter API for unified LLM access
- **Database**: Supabase (PostgreSQL) for authentication and session storage

## Project Structure

```
datalens/
├── frontend/          # Next.js 14 application
├── backend/           # FastAPI Python server
├── .kiro/            # Spec files (requirements, design, tasks)
└── package.json      # Monorepo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- OpenRouter API key
- E2B API key
- Supabase project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd datalens
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (see .env.example files in frontend/ and backend/)

4. Run development servers
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8000

## Development

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend for production

## Documentation

See `.kiro/specs/glassbox-analyst/` for:
- `requirements.md` - Feature requirements and acceptance criteria
- `design.md` - System architecture and design decisions
- `tasks.md` - Implementation task list

## License

MIT
