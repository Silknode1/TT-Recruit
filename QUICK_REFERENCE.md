# Quick Reference & Troubleshooting

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Importing

#### Import a module (recommended way)
```javascript
import { PlaybookGenerator } from './components/modules';
```

#### Import a hook
```javascript
import { useFirebaseUser } from './hooks';
```

#### Import a utility
```javascript
import { callGemini } from './utils';
```

#### Import configuration
```javascript
import { API_KEY_STORAGE_KEY, COLORS } from './config';
import { db, auth } from './config';
```

## File Organization Decisions

### When to create a new file?
- ✅ New React component (feature or reusable)
- ✅ New utility function (used by 2+ modules)
- ✅ New hook (shared state logic)
- ❌ Small inline helpers (keep in component unless reused)

### Where to put things?

| What | Where | Example |
|------|-------|---------|
| Feature module | `/components/modules` | `NewModule.jsx` |
| Reusable component | `/components` or `/components/layout` | `Badge.jsx` |
| Custom hook | `/hooks` | `useMyHook.js` |
| Utility function | `/utils` | `validation.js` |
| Constant | `/config/constants.js` | `COLORS`, `API_KEYS` |
| Firebase setup | `/config/firebase.js` | Already setup |
| 3D component | `/components/3d` | `MyVisualization.jsx` |

## Common Patterns

### Pattern 1: Creating a new module

```javascript
// src/components/modules/MyModule.jsx
import React, { useState } from 'react';
import { Icon } from 'lucide-react';
import { callGemini } from '../../utils';
import PrintButton from '../PrintButton';

const MyModule = ({ setActiveTab }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await callGemini(input, 'Your system prompt');
      setOutput(result);
    } catch (e) {
      if (e.message === "MISSING_KEY") {
        alert("API key required");
        setActiveTab('settings');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="bg-[#0d0d0d] border border-[#222] p-6">
        <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <Icon className="w-4 h-4" /> Input
        </h2>
        {/* Your input components */}
      </div>
      <div className="bg-[#0d0d0d] border border-[#222] p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#00f0ff] font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <Icon className="w-4 h-4" /> Output
          </h2>
          {output && <PrintButton />}
        </div>
        {/* Your output display */}
      </div>
    </div>
  );
};

export default MyModule;
```

### Pattern 2: Using Firebase with a module

```javascript
import { db, appId } from '../../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Inside component
if (user && db) {
  await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'data'), {
    content: result,
    timestamp: serverTimestamp()
  });
}
```

### Pattern 3: Creating a custom hook

```javascript
// src/hooks/useMyHook.js
import { useState, useEffect } from 'react';

export const useMyHook = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, []);

  return state;
};

// Export in src/hooks/index.js
export { useMyHook } from './useMyHook';

// Use in component
import { useMyHook } from '../../hooks';
const MyComponent = () => {
  const value = useMyHook();
  // ...
};
```

## Troubleshooting

### Import Error: "Cannot find module"
```
❌ Error: Cannot find module './MyModule'
```
**Solution**: Check file path and verify it exists
```javascript
// ❌ Wrong
import Component from './mymodule'; // Wrong case

// ✅ Correct
import Component from './MyModule'; // Exact case
```

### "API_KEY_STORAGE_KEY is not defined"
```
❌ ReferenceError: API_KEY_STORAGE_KEY is not defined
```
**Solution**: Import from config
```javascript
// ❌ Wrong
const key = localStorage.getItem(API_KEY_STORAGE_KEY);

// ✅ Correct
import { API_KEY_STORAGE_KEY } from '../../config';
const key = localStorage.getItem(API_KEY_STORAGE_KEY);
```

### Firebase not initializing
```
❌ Cannot read property 'collection' of null
```
**Solution**: Check Firebase config and environment variables
```javascript
// Verify in src/config/firebase.js
console.log('Firebase Config:', firebaseConfig);
console.log('DB initialized:', db !== null);
```

### Circular dependencies
```
❌ Cannot find module (circular dependency)
```
**Solution**: Refactor imports
```javascript
// ❌ Bad: A imports from B, B imports from A
// A.js → B.js → A.js (circular)

// ✅ Good: Use a shared utils file
// A.js → utils.js ← B.js
```

### Styling not applying
```
❌ Tailwind classes not showing
```
**Solution**: Verify Tailwind configuration
```bash
# Rebuild Tailwind
npm run build -- --force

# Or check that index.css imports Tailwind
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### State not updating after Firebase operation
```javascript
// ❌ Async issue - state may not update immediately
await addDoc(...);
setTasks([...]); // May use old state

// ✅ Use onSnapshot for real-time updates
useEffect(() => {
  const q = query(collection(...));
  const unsub = onSnapshot(q, (snapshot) => {
    setTasks(snapshot.docs.map(d => d.data()));
  });
  return () => unsub();
}, []);
```

## Performance Tips

### 1. Lazy load modules
```javascript
// In App.jsx
const Dashboard = lazy(() => import('./components/modules/Dashboard'));
const PlaybookGenerator = lazy(() => import('./components/modules/PlaybookGenerator'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### 2. Memoize expensive calculations
```javascript
import { useMemo } from 'react';

const expensiveResult = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### 3. Prevent unnecessary re-renders
```javascript
import { memo } from 'react';

const MyComponent = memo(({ prop }) => {
  return <div>{prop}</div>;
});

export default MyComponent;
```

### 4. Use React DevTools Profiler
```bash
# In browser console
# Check Chrome React DevTools for component render times
# Identify bottlenecks and optimize
```

## Git Best Practices

### Commit message format
```
[type]: [description]

Types: feat, fix, refactor, docs, style, test

Examples:
✅ feat: add new CandidateSourcing module
✅ fix: handle missing API key error
✅ refactor: extract gemini calls to utils
```

### Branch naming
```
feat/new-module
fix/import-error
docs/update-readme
refactor/extract-hooks
```

## Deployment Tips

### Environment Variables
```bash
# .env.local (development)
VITE_FIREBASE_CONFIG='{"apiKey":"..."}'
VITE_INITIAL_AUTH_TOKEN=your_token

# .env.production (production)
# Use secure deployment platform (Netlify, Vercel, etc.)
```

### Production Build
```bash
# Check bundle size
npm run build

# Preview
npm run preview

# Deploy
# (Configure in package.json or CI/CD pipeline)
```

### Performance Budget
- Main bundle: < 500KB
- CSS: < 50KB
- Images: < 100KB
- Total: < 1MB

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Gemini API](https://ai.google.dev)

## Getting Help

1. **Check FILE_STRUCTURE.md** - Understand the organization
2. **Check ARCHITECTURE.md** - Understand data flows
3. **Look at similar modules** - Copy/paste and modify
4. **Read error messages** - They usually point to the problem
5. **Use console.log()** - Debug state and props
6. **Check browser console** - Frontend errors
7. **Check network tab** - API call issues

## Next Steps

- [ ] Install dependencies: `npm install`
- [ ] Set up environment variables
- [ ] Run dev server: `npm run dev`
- [ ] Test each module
- [ ] Deploy to production
- [ ] Monitor performance
