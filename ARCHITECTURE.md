# Architecture & Data Flow

## Component Hierarchy

```
App.jsx (Main)
│
├─ ThreeBackground (3D Background)
│
└─ Sidebar (Navigation & Controls)
   ├── Pomodoro Timer
   ├── Task Manager
   └── Nav Items (route handlers)
│
└─ Main Content (Dynamic based on activeTab)
   ├── Dashboard
   ├── PlaybookGenerator ──> Gemini API
   ├── OfferOptimizer ──> ThreePieChart
   ├── OfferJustification ──> Gemini API
   ├── InterviewAnalyzer ──> Gemini API + Firestore
   ├── CandidateSourcing ──> Gemini API
   ├── CommunicationBuilder ──> Gemini API
   └── SettingsModule
```

## Data Flow

### Authentication Flow
```
useFirebaseUser Hook
    ↓
Firebase Auth (Firebase Config)
    ↓
signInAnonymously / signInWithCustomToken
    ↓
User State (passed to components)
```

### AI Integration Flow
```
User Input (in modules)
    ↓
callGemini(prompt, systemInstruction)
    ↓
Gemini API (via geminiApi.js)
    ↓
Response Processing
    ↓
State Update / UI Render
```

### Task Management Flow
```
Sidebar Task Input
    ↓
addTask / smartAddTask
    ↓
Firebase Firestore (if authenticated)
    ↓
Real-time onSnapshot listener
    ↓
Tasks State Update
```

### Configuration Flow
```
Environment Variables
    ↓
/config/firebase.js + constants.js
    ↓
Throughout App via imports
    ↓
Type-safe, centralized configuration
```

## State Management Strategy

### Local State (React useState)
- Module-specific UI state
- Form inputs
- Temporary UI flags

### Global State (Firebase)
- User authentication
- Task persistence
- Playbook history
- Interview notes
- User artifacts

### Shared State (Custom Hooks)
- `useFirebaseUser` - Authentication status
- `useApiKey` - API key availability

### Constants (Configuration)
- Color scheme
- API endpoints
- Default values
- Magic strings

## Module Dependencies Map

```
App.jsx
├── depends on: All modules, useFirebaseUser, Sidebar
├── depends on: Dashboard, PlaybookGenerator, etc.
└── uses: setActiveTab state

Sidebar
├── depends on: useApiKey, callGemini, Firebase
├── depends on: All nav item icons
└── uses: addTask, smartAddTask, toggleTask, deleteTask

PlaybookGenerator
├── depends on: callGemini, Firebase
├── depends on: PrintButton
└── uses: Gemini API for playbook generation

OfferOptimizer
├── depends on: ThreePieChart, useMemo
└── uses: local state for compensation values

InterviewAnalyzer
├── depends on: callGemini, Firebase
├── depends on: PrintButton
└── uses: streaming text effect

CandidateSourcing
├── depends on: callGemini
└── uses: Boolean search compilation

CommunicationBuilder
├── depends on: callGemini
├── depends on: PrintButton
└── uses: tone slider + witty checkbox

OfferJustification
├── depends on: callGemini
├── depends on: PrintButton
└── uses: multi-textarea inputs

Dashboard
└── uses: module navigation cards

SettingsModule
└── uses: localStorage for API key

PrintButton (Utility Component)
└── uses: window.print()

Gemini API (Utility)
├── depends on: API_KEY_STORAGE_KEY constant
├── depends on: GEMINI_CONFIG constant
└── uses: Fetch API

Firebase Config
└── depends on: Environment variables

useFirebaseUser Hook
├── depends on: Firebase auth
├── depends on: signInAnonymously, signInWithCustomToken
└── uses: onAuthStateChanged listener

useApiKey Hook
├── depends on: localStorage
└── uses: setInterval for polling

3D Components
├── ThreeBackground - uses: Three.js Scene, Camera, Renderer
└── ThreePieChart - uses: Three.js Mesh, Geometry, Materials
```

## File Access Patterns

### Direct Imports (Recommended)
```javascript
import { useFirebaseUser } from './hooks';
import Dashboard from './components/modules/Dashboard';
import { callGemini } from './utils';
```

### Accessing Configuration
```javascript
import { API_KEY_STORAGE_KEY } from './config';
import { db, auth, appId } from './config';
```

### Cross-Module Communication
```
// App.jsx manages activeTab state
// Passes setActiveTab as prop to all modules
// Modules call setActiveTab('moduleName') to navigate

// Sidebar has direct access to changeTab via props
// Sidebar manages local state (tasks, pomodoro)
// Firebase syncs task state across sessions
```

## Error Handling Flow

```
Module Function (e.g., generatePlaybook)
    ↓
callGemini() with try/catch
    ├── Success → setState(result)
    └── Catch(error)
        ├── MISSING_KEY → setActiveTab('settings'), alert()
        └── Other → setState('Error: ' + message)
```

## Scalability Patterns

### Adding a New Module
1. Create `/src/components/modules/NewModule.jsx`
2. Export in `/src/components/modules/index.js`
3. Import in `App.jsx`
4. Add route case in `renderContent()`
5. Add nav item in Sidebar

### Adding a New Hook
1. Create `/src/hooks/useNewHook.js`
2. Export in `/src/hooks/index.js`
3. Import where needed

### Adding a New Utility
1. Create `/src/utils/newUtility.js`
2. Export in `/src/utils/index.js`
3. Import where needed

### Adding a New Constant
1. Add to `/src/config/constants.js`
2. Export from `/src/config/index.js`
3. Import where needed

## Testing Strategy

### Unit Tests
```javascript
// Test utils independently
import { callGemini } from './utils';
// Mock Fetch API

// Test hooks independently
import { useFirebaseUser } from './hooks';
// Mock Firebase auth
```

### Component Tests
```javascript
// Test modules with mocked dependencies
import Dashboard from './components/modules/Dashboard';
// Mock setActiveTab prop
```

### Integration Tests
```javascript
// Test full data flows
// Mock Firebase + Gemini
// Verify state updates
```

## Performance Considerations

### Code Splitting (Recommended)
```javascript
// In App.jsx
const Dashboard = lazy(() => import('./components/modules/Dashboard'));
const PlaybookGenerator = lazy(() => import('./components/modules/PlaybookGenerator'));
// Wrap with Suspense
```

### Memoization
```javascript
// OfferOptimizer already uses useMemo for chartData
// Add React.memo to heavy modules
export default React.memo(PlaybookGenerator);
```

### Bundle Analysis
```bash
npm run build -- --report
# Identify largest modules
# Consider code splitting further
```

## Deployment Checklist

- ✅ All imports use relative paths (no absolute)
- ✅ Environment variables configured
- ✅ Firebase credentials secured
- ✅ Gemini API key in env (not hardcoded)
- ✅ No console.logs in production
- ✅ Error boundaries added
- ✅ Loading states implemented
- ✅ Mobile responsiveness tested
