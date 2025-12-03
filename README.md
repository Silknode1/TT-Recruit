# TT-Recruit

AI-powered technical recruiting platform with real-time compensation modeling, interview analysis, and strategic sourcing tools.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

The application is organized into a modular architecture. See [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) for detailed documentation of the codebase organization.

```
src/
├── App.jsx              # Main entry point
├── config/              # Configuration & constants
├── hooks/               # Custom React hooks
├── utils/               # Utility functions & API integrations
└── components/          # React components
    ├── 3d/             # 3D visualizations (Three.js)
    ├── layout/         # Layout components (Sidebar, etc.)
    └── modules/        # Feature modules
        ├── Dashboard
        ├── PlaybookGenerator
        ├── OfferOptimizer
        ├── OfferJustification
        ├── InterviewAnalyzer
        ├── CandidateSourcing
        ├── CommunicationBuilder
        └── SettingsModule
```

## Key Features

- **Dashboard**: Overview of all recruiting tools
- **Playbook Generator**: AI-generated recruiting strategies
- **Compensation Calculator**: 3D offer modeling with real-time visualization
- **Offer Justification**: Generate data-driven offer memos
- **Interview Analyzer**: AI feedback on interview notes
- **Candidate Sourcing**: Boolean search compiler & sourcing matrix
- **Communications Builder**: Tone-tuned outreach messages
- **Task Management**: Integrated Pomodoro timer and task tracking

## Environment Setup

Create a `.env` file with:
```
VITE_FIREBASE_CONFIG=your_firebase_config_json
VITE_INITIAL_AUTH_TOKEN=your_auth_token
```

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **3D Graphics**: Three.js
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Google Gemini API
- **Icons**: Lucide React

## File Organization Guide

For detailed information about the modular structure and how to add new features, see [FILE_STRUCTURE.md](./FILE_STRUCTURE.md).

### Key Directories

- `/src/config` - Application configuration
- `/src/hooks` - Reusable React hooks
- `/src/utils` - Utility functions
- `/src/components` - React components organized by type
- `/src/components/modules` - Feature modules

## Contributing

When adding new features:
1. Create new components in appropriate directories
2. Use the established import patterns (index exports)
3. Follow the existing code structure and styling conventions
4. Update relevant index files for re-exports