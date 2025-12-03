# Visual Quick Start Guide

## The Structure at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                      TT-RECRUIT APP                          │
│                    (Main Entry: App.jsx)                     │
└──────┬──────────────────────────────────────────────┬────────┘
       │                                              │
       │                          ┌─────────────────────────┐
       │                          │   Configuration        │
       │                          │   /config              │
       │                          │  • firebase.js         │
       │                          │  • constants.js        │
       │                          └─────────────────────────┘
       │
       │  ┌─────────────────────────────────────────────────┐
       │  │         SHARED INFRASTRUCTURE                   │
       │  │                                                 │
       │  │  HOOKS (/hooks)          UTILS (/utils)        │
       │  │  • useFirebaseUser   •   • callGemini          │
       │  │  • useApiKey         •                         │
       │  └─────────────────────────────────────────────────┘
       │
       └──────────────┬──────────────────────────────────────────┐
                      │                                          │
                ┌─────▼──────┐                    ┌──────────────▼──┐
                │ 3D VISUALS │                    │ LAYOUT/SHELL    │
                │ (/3d)      │                    │ (/layout)       │
                │            │                    │                 │
                │ • Background    │                │ • Sidebar       │
                │ • PieChart  │                    │   - Tasks       │
                │            │                    │   - Timer       │
                └────────────┘                    │   - Nav         │
                                                 └─────────────────┘
                      
                      ┌──────────────────────────────────────┐
                      │    FEATURE MODULES (/modules)        │
                      │                                      │
                      │  8 Modules, each is independent:    │
                      │                                      │
                      │  1. Dashboard          (HOME)       │
                      │  2. PlaybookGenerator  (AI)         │
                      │  3. OfferOptimizer     (CALC)       │
                      │  4. OfferJustification (AI MEMO)    │
                      │  5. InterviewAnalyzer  (AI)         │
                      │  6. CandidateSourcing  (AI)         │
                      │  7. CommunicationBuilder(AI)        │
                      │  8. SettingsModule     (CONFIG)     │
                      │                                      │
                      └──────────────────────────────────────┘
```

## File Locations Quick Reference

### Need to...

| Task | Go to |
|------|-------|
| Add a new feature | Create `/components/modules/YourFeature.jsx` |
| Update colors | Edit `/config/constants.js` |
| Add API call | Use `callGemini()` from `/utils` |
| Add state logic | Create hook in `/hooks` |
| Fix authentication | Edit `/config/firebase.js` |
| Update navigation | Edit `/components/layout/Sidebar.jsx` |
| Add shared function | Add to `/utils` |
| Fix a module | Find in `/components/modules/` |
| Check constants | Look in `/config/constants.js` |

## Import Cheat Sheet

```javascript
// CONFIG
import { API_KEY_STORAGE_KEY, COLORS, GEMINI_CONFIG } from '../../config';
import { db, auth, appId } from '../../config';

// HOOKS
import { useFirebaseUser, useApiKey } from '../../hooks';

// UTILS  
import { callGemini } from '../../utils';

// COMPONENTS
import PrintButton from '../../components/PrintButton';
import { ThreeBackground, ThreePieChart } from '../../components/3d';
import Sidebar from '../../components/layout';
import { Dashboard, PlaybookGenerator } from '../../components/modules';

// FIREBASE
import { addDoc, collection, serverTimestamp, onSnapshot, query } from 'firebase/firestore';

// REACT
import { useState, useEffect, useMemo } from 'react';

// LUCIDE ICONS
import { Icon1, Icon2, Icon3 } from 'lucide-react';

// THREE.JS
import * as THREE from 'three';
```

## The Three Layers

### Layer 1: Configuration & Setup
```
config/          ← Initialization (runs once)
hooks/           ← State logic (reusable)
utils/           ← Pure functions (reusable)
```
**Direction**: Everything flows OUT from here

### Layer 2: Presentation Shell
```
components/
├── 3d/          ← Visualizations
└── layout/      ← Navigation & wrapper
```
**Direction**: Receives props from App, manages layout

### Layer 3: Features
```
components/modules/     ← The 8 recruiting modules
```
**Direction**: React to user input, call utils & config

## Data Flow Examples

### User Asks for Playbook
```
User clicks "Generate Playbook"
    ↓
PlaybookGenerator.jsx (local state)
    ↓
callGemini(prompt, system) [from utils]
    ↓
Gemini API response
    ↓
setResult(response)
    ↓
Firebase saves (optional, if user logged in)
    ↓
UI updates with result
```

### User Adds Task
```
Sidebar.jsx - User types task
    ↓
Press Enter or click +
    ↓
addTask() or smartAddTask()
    ↓
callGemini() if "magic" [from utils]
    ↓
addDoc() to Firestore
    ↓
onSnapshot() listener fires
    ↓
setTasks(updatedList)
    ↓
Task appears in list
```

### API Key Management
```
User enters API key in SettingsModule
    ↓
localStorage.setItem(API_KEY_STORAGE_KEY, key)
    ↓
useApiKey() hook detects change
    ↓
Sidebar shows "System Online"
    ↓
All modules can now use callGemini()
```

## One-Minute Tutorials

### Add a New Module

**File**: `/src/components/modules/MyFeature.jsx`
```javascript
import React, { useState } from 'react';
import { SomeIcon } from 'lucide-react';
import { callGemini } from '../../utils';
import PrintButton from '../PrintButton';

const MyFeature = ({ setActiveTab }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const generate = async () => {
    try {
      const result = await callGemini(input, 'Your system prompt');
      setOutput(result);
    } catch (e) {
      if (e.message === "MISSING_KEY") {
        setActiveTab('settings');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="bg-[#0d0d0d] border border-[#222] p-6">
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={generate}>Generate</button>
      </div>
      <div className="bg-[#0d0d0d] border border-[#222] p-6">
        {output && <PrintButton />}
        <div>{output}</div>
      </div>
    </div>
  );
};

export default MyFeature;
```

Then in `/src/components/modules/index.js`:
```javascript
export { default as MyFeature } from './MyFeature';
```

Then in `/src/App.jsx`:
```javascript
import { MyFeature } from './components/modules';

// In renderContent():
myfeature: <MyFeature user={user} setActiveTab={setActiveTab} />,
```

Then in `/src/components/layout/Sidebar.jsx`:
```javascript
// In navItems array:
{ id: 'myfeature', label: 'My Feature', icon: SomeIcon },
```

**Done!** Your module is now integrated.

### Fix a Color

**File**: `/src/config/constants.js`
```javascript
export const COLORS = {
  primary: '#00ff00',      // Change this ← 
  background: '#050505',
  // ... rest stays same
};
```

All components using `COLORS.primary` now show green!

### Add an API Call

**In your module**:
```javascript
import { callGemini } from '../../utils';

// Then:
try {
  const result = await callGemini(
    'User prompt here',
    'System instruction here'
  );
  // Use result
} catch (e) {
  if (e.message === "MISSING_KEY") {
    alert("API key needed!");
    setActiveTab('settings');
  }
}
```

**Done!** Your module now uses AI.

### Save Data to Firebase

**In your module**:
```javascript
import { db, appId } from '../../config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Inside function:
if (user && db) {
  await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'mydata'), {
    content: data,
    timestamp: serverTimestamp()
  });
}
```

**Done!** Data persists in Firebase.

## File Naming Convention

```
/hooks/
  useMyHook.js           ← Lowercase "use", camelCase

/utils/
  myUtility.js           ← Lowercase, camelCase

/components/
  ├── MyComponent.jsx    ← PascalCase
  ├── layout/
  │   └── MyLayout.jsx   ← PascalCase
  └── modules/
      └── MyFeature.jsx  ← PascalCase

/config/
  myConfig.js            ← Lowercase, camelCase
```

## Testing Checklist

Before committing:
- ✅ All imports resolve
- ✅ No console errors
- ✅ Feature works in isolation
- ✅ Doesn't break other modules
- ✅ Styling looks good
- ✅ Mobile responsive
- ✅ API key error handled

## Debugging Quick Tips

```javascript
// Log component renders
console.log('MyComponent rendering', { prop1, prop2 });

// Log state changes
console.log('State updated:', state);

// Check Firebase
console.log('DB initialized:', db !== null);

// Check API key
console.log('Has key:', localStorage.getItem('tt_recruit_gemini_key'));

// Log network requests
// Open DevTools → Network tab → Filter "generativelanguage"
```

## Common Mistakes to Avoid

❌ Forgetting to export in index.js
✅ Always add to index: `export { default as MyModule } from './MyModule';`

❌ Wrong import path
✅ Use relative paths: `'../../utils'` not `'./utils'`

❌ Not handling MISSING_KEY
✅ Always catch and redirect to settings

❌ Hardcoding constants
✅ Put in `/config/constants.js`

❌ Creating circular imports
✅ Config → Utils → Hooks → Components (one direction)

---

**You're all set!** Refer back to these guides as you build. 🎉
