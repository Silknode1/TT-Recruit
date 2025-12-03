# TT-Recruit File Structure Guide

## Project Organization

Your React application has been organized into a modular, maintainable file structure:

```
src/
├── App.jsx                 # Main app entry point
├── config/                 # Configuration files
│   ├── index.js           # Config exports
│   ├── firebase.js        # Firebase initialization
│   └── constants.js       # App constants and colors
├── hooks/                 # Custom React hooks
│   ├── index.js
│   ├── useFirebaseUser.js # Firebase authentication hook
│   └── useApiKey.js       # API key management hook
├── utils/                 # Utility functions
│   ├── index.js
│   └── geminiApi.js       # Gemini API integration
├── components/            # React components
│   ├── index.js
│   ├── PrintButton.jsx    # Print/PDF export button
│   ├── 3d/               # 3D visualization components
│   │   ├── index.js
│   │   ├── ThreeBackground.jsx    # Animated background
│   │   └── ThreePieChart.jsx      # 3D compensation chart
│   ├── layout/           # Layout components
│   │   ├── index.js
│   │   └── Sidebar.jsx   # Navigation sidebar with tasks & timer
│   └── modules/          # Feature modules
│       ├── index.js
│       ├── Dashboard.jsx           # Main dashboard
│       ├── PlaybookGenerator.jsx   # Recruiting playbook creator
│       ├── OfferOptimizer.jsx      # Compensation calculator
│       ├── OfferJustification.jsx  # Offer justification memo
│       ├── InterviewAnalyzer.jsx   # Interview feedback analyzer
│       ├── CandidateSourcing.jsx   # Search matrix & boolean builder
│       ├── CommunicationBuilder.jsx # Email/message generator
│       └── SettingsModule.jsx      # API key management
```

## Directory Breakdown

### `/config`
Centralized configuration management:
- **firebase.js**: Firebase app initialization and instances
- **constants.js**: API keys, colors, default values, and Gemini config

### `/hooks`
Custom React hooks for shared logic:
- **useFirebaseUser**: Manages Firebase authentication state
- **useApiKey**: Tracks API key availability in localStorage

### `/utils`
Pure utility functions and API integrations:
- **geminiApi.js**: Handles all Gemini API calls with error handling

### `/components/3d`
Three.js-based 3D visualizations:
- **ThreeBackground**: Animated grid with particles background
- **ThreePieChart**: 3D compensation breakdown visualization

### `/components/layout`
Core layout and navigation:
- **Sidebar**: Navigation menu, Pomodoro timer, task management

### `/components/modules`
Feature-specific modules (one module = one feature):
- **Dashboard**: Homepage with module cards
- **PlaybookGenerator**: AI-powered recruiting playbook creator
- **OfferOptimizer**: Interactive compensation calculator
- **OfferJustification**: Generate offer memos with AI
- **InterviewAnalyzer**: AI feedback on interview notes
- **CandidateSourcing**: Boolean search compiler & sourcing matrix
- **CommunicationBuilder**: Tone-controlled email generator
- **SettingsModule**: API key configuration

## Import Patterns

### Using Index Exports
```javascript
// Instead of:
import { useFirebaseUser } from '../../hooks/useFirebaseUser';

// You can use:
import { useFirebaseUser } from '../../hooks';
```

### Module Imports
```javascript
// Import a single module:
import Dashboard from './modules/Dashboard';

// Or import multiple:
import { Dashboard, OfferOptimizer, PlaybookGenerator } from './modules';
```

## Key Features by File

| Feature | Location | Dependencies |
|---------|----------|--------------|
| Firebase Auth | `/config/firebase.js` | None (Firebase SDK) |
| Gemini AI Calls | `/utils/geminiApi.js` | Gemini API Key |
| Component State | Each module | React hooks |
| Task Management | `/components/layout/Sidebar.jsx` | Firestore |
| 3D Visualization | `/components/3d/*` | Three.js |
| Navigation Logic | `/components/layout/Sidebar.jsx` | React state |

## Adding New Features

To add a new module:

1. Create `/src/components/modules/YourFeature.jsx`
2. Export it in `/src/components/modules/index.js`
3. Import and add to `App.jsx`'s content map

```javascript
// In App.jsx
const renderContent = () => {
  const contentMap = {
    // ... existing modules
    yourfeature: <YourFeature user={user} setActiveTab={setActiveTab} />,
  };
  return contentMap[activeTab] || contentMap.dashboard;
};
```

## Styling
All components use Tailwind CSS with the color scheme defined in `/src/config/constants.js`:
- Primary: `#00f0ff` (cyan)
- Background: `#050505` (near black)
- Text: `#ffffff` (white)

## Environment Variables
Configure in your `.env`:
```
VITE_FIREBASE_CONFIG=your_firebase_config
VITE_INITIAL_AUTH_TOKEN=your_token
```

## Development Tips

- **Reusable Components**: Keep components in `/components` only if used in multiple modules
- **Module-Specific Code**: Keep code in module files if only used there
- **Shared Logic**: Use `/utils` for functions called from multiple modules
- **Custom Hooks**: Create hooks in `/hooks` for complex state management
- **Constants**: Add magic strings/numbers to `/config/constants.js`

This structure makes the codebase:
- ✅ Easy to navigate and maintain
- ✅ Simple to test individual modules
- ✅ Scalable for new features
- ✅ Clear separation of concerns
