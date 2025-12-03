# CLAUDE.md - AI Assistant Guide for TT-Recruit

**Last Updated:** 2025-12-03
**Repository:** Silknode1/TT-Recruit
**Current Status:** Initial/Bootstrap Phase

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Current State](#current-state)
3. [Development Workflows](#development-workflows)
4. [Branching Strategy](#branching-strategy)
5. [Code Conventions](#code-conventions)
6. [Project Structure Guidelines](#project-structure-guidelines)
7. [Testing Strategy](#testing-strategy)
8. [Documentation Standards](#documentation-standards)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Future Roadmap](#future-roadmap)

---

## Repository Overview

### Purpose
TT-Recruit appears to be a recruitment or talent tracking system (inferred from the repository name). The exact scope and functionality will be defined as the project evolves.

### Tech Stack
**Status:** To be determined

Common possibilities based on the project name:
- Backend: Node.js, Python (Django/Flask), Java, or Go
- Frontend: React, Vue, Angular, or similar
- Database: PostgreSQL, MongoDB, MySQL
- Cloud/Infrastructure: AWS, GCP, Azure, or containerized solutions

**Note:** Update this section once technology decisions are made.

---

## Current State

### Repository Status
- **Phase:** Initial bootstrap
- **Files:** README.md (minimal)
- **Commits:** 1 (Initial commit: 2f2ba3c)
- **Branches:** Feature branch structure in place

### What Exists
```
TT-Recruit/
├── .git/           # Git repository metadata
└── README.md       # Basic project title
```

### Immediate Next Steps
1. Define project scope and requirements
2. Choose technology stack
3. Set up project scaffolding (package managers, build tools)
4. Establish directory structure
5. Configure CI/CD pipelines
6. Add linting and formatting tools
7. Set up testing frameworks

---

## Development Workflows

### Git Workflow

#### Branch Naming Convention
All AI assistant branches must follow this pattern:
```
claude/claude-md-{identifier}-{session-id}
```

Current working branch:
```
claude/claude-md-miqcgwhzmbzvl8m4-01WyUjrWD36YEyb82rWSrcc4
```

#### Commit Guidelines
- **Format:** Use conventional commits format
  ```
  <type>(<scope>): <subject>

  <body>

  <footer>
  ```

- **Types:**
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation changes
  - `style:` Code style changes (formatting, no logic change)
  - `refactor:` Code refactoring
  - `test:` Adding or updating tests
  - `chore:` Maintenance tasks
  - `perf:` Performance improvements

- **Examples:**
  ```
  feat(auth): add user authentication system

  - Implement JWT-based authentication
  - Add login and registration endpoints
  - Include password hashing with bcrypt

  Closes #123
  ```

#### Push/Pull Operations
- **Push:** Always use `git push -u origin <branch-name>`
- **Network Failures:** Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- **Fetch:** Prefer specific branches: `git fetch origin <branch-name>`

### Pre-commit Hooks (To Be Implemented)
When the project matures, consider adding:
- Code formatting checks (Prettier, Black, gofmt, etc.)
- Linting (ESLint, pylint, golangci-lint, etc.)
- Unit test execution
- Security vulnerability scanning

---

## Branching Strategy

### Main Branches
- `main` or `master`: Production-ready code
- `develop` (if using Gitflow): Integration branch for features

### Feature Branches
- Pattern: `feature/<feature-name>` or `claude/<identifier>`
- Merge target: Usually `develop` or `main`
- Lifecycle: Delete after merge

### Other Branch Types
- `hotfix/*`: Critical production fixes
- `release/*`: Release preparation
- `bugfix/*`: Non-critical bug fixes

---

## Code Conventions

### General Principles
1. **Simplicity First:** Avoid over-engineering
2. **YAGNI:** You Aren't Gonna Need It - don't add features speculatively
3. **DRY with Caution:** Don't Repeat Yourself, but avoid premature abstraction
4. **Clear Naming:** Use descriptive, self-documenting names
5. **Small Functions:** Keep functions focused and testable

### Language-Specific Conventions (To Be Updated)

#### JavaScript/TypeScript
```javascript
// Use const/let, never var
const MAX_RETRIES = 3;
let currentAttempt = 0;

// Prefer arrow functions for callbacks
const processUsers = users.map(user => user.name);

// Use async/await over raw promises
async function fetchUserData(userId) {
  try {
    const response = await api.getUser(userId);
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
}
```

#### Python
```python
# Follow PEP 8
# Use type hints for function signatures
from typing import List, Optional

def process_candidates(
    candidates: List[dict],
    filter_active: bool = True
) -> List[dict]:
    """
    Process and filter candidate records.

    Args:
        candidates: List of candidate dictionaries
        filter_active: Whether to filter for active candidates only

    Returns:
        Filtered list of candidates
    """
    return [c for c in candidates if not filter_active or c.get('active')]
```

### Security Best Practices
- **Never commit secrets:** Use environment variables or secret managers
- **Validate input:** Sanitize all user input
- **Use parameterized queries:** Prevent SQL injection
- **Implement authentication/authorization:** Secure all endpoints
- **Keep dependencies updated:** Regular security patches
- **OWASP Top 10:** Be aware of common vulnerabilities

---

## Project Structure Guidelines

### Recommended Structure (To Be Implemented)

#### Backend API Structure
```
TT-Recruit/
├── src/
│   ├── api/                # API routes/controllers
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   ├── middleware/         # Express/framework middleware
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── tests/              # Test files
├── migrations/             # Database migrations
├── scripts/                # Build/deployment scripts
├── docs/                   # Documentation
├── .env.example            # Environment variable template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies (Node.js)
├── requirements.txt       # Dependencies (Python)
└── README.md              # Project documentation
```

#### Frontend Structure
```
TT-Recruit/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API clients
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── styles/           # Global styles
│   └── tests/            # Test files
├── public/               # Static assets
└── package.json          # Dependencies
```

### File Naming Conventions
- **Components:** PascalCase (e.g., `UserProfile.tsx`, `CandidateCard.jsx`)
- **Utilities:** camelCase (e.g., `formatDate.js`, `validateEmail.ts`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **Config:** kebab-case (e.g., `database-config.js`, `api-client.ts`)

---

## Testing Strategy

### Test Pyramid
1. **Unit Tests (70%):** Test individual functions/methods
2. **Integration Tests (20%):** Test component interactions
3. **E2E Tests (10%):** Test complete user workflows

### Testing Frameworks (To Be Decided)
- **JavaScript/TypeScript:** Jest, Vitest, Mocha, Cypress, Playwright
- **Python:** pytest, unittest, nose2
- **Go:** go test
- **Java:** JUnit, TestNG

### Testing Conventions
```javascript
// Test file naming: *.test.js or *.spec.js
// Place tests adjacent to source files or in __tests__ directory

describe('CandidateService', () => {
  describe('createCandidate', () => {
    it('should create a new candidate with valid data', async () => {
      // Arrange
      const candidateData = { name: 'John Doe', email: 'john@example.com' };

      // Act
      const result = await candidateService.createCandidate(candidateData);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('John Doe');
    });

    it('should throw error with invalid email', async () => {
      // Arrange
      const candidateData = { name: 'John Doe', email: 'invalid' };

      // Act & Assert
      await expect(
        candidateService.createCandidate(candidateData)
      ).rejects.toThrow('Invalid email format');
    });
  });
});
```

### Coverage Goals
- Minimum: 70% code coverage
- Critical paths: 90%+ coverage
- New code: Should not decrease overall coverage

---

## Documentation Standards

### Code Documentation

#### Inline Comments
- Explain **why**, not **what**
- Use comments for complex logic only
- Keep comments up-to-date with code changes

```javascript
// Good: Explains reasoning
// Use exponential backoff to avoid overwhelming the API during outages
const delay = Math.pow(2, attempt) * 1000;

// Bad: States the obvious
// Set delay to 2 to the power of attempt times 1000
const delay = Math.pow(2, attempt) * 1000;
```

#### Function Documentation
- Document public APIs and exported functions
- Include parameters, return values, and exceptions
- Add usage examples for complex functions

### README.md Structure
The README.md should include:
1. Project title and description
2. Features/functionality
3. Technology stack
4. Installation instructions
5. Usage examples
6. Configuration options
7. Contributing guidelines
8. License information

---

## AI Assistant Guidelines

### Core Principles for AI Development

#### 1. Read Before Writing
- **ALWAYS** read existing files before modifying them
- Understand the current codebase structure and patterns
- Follow established conventions in the project

#### 2. Minimal Changes
- Make only requested changes
- Avoid refactoring unless explicitly asked
- Don't add "improvements" beyond the scope
- No premature optimization

#### 3. Security First
- Scan for OWASP Top 10 vulnerabilities
- Never introduce SQL injection, XSS, or command injection
- Validate input at system boundaries
- Use secure authentication and authorization

#### 4. Task Management
- Use TodoWrite tool for multi-step tasks
- Mark tasks as `in_progress` before starting
- Complete tasks one at a time
- Mark tasks `completed` immediately after finishing

#### 5. Tool Usage
- Use specialized tools over bash commands
  - `Read` instead of `cat`
  - `Edit` instead of `sed/awk`
  - `Write` instead of `echo >`
- Run independent tool calls in parallel
- Use `Task` tool with `Explore` agent for codebase exploration

#### 6. Error Handling
- Fix errors immediately upon discovery
- Don't mark tasks complete if errors exist
- Create new tasks for blockers

### Git Operations for AI

#### Committing Changes
Only commit when explicitly requested by the user.

**Commit Process:**
1. Run in parallel: `git status`, `git diff`, `git log`
2. Analyze changes and draft commit message
3. Stage files with `git add`
4. Commit with descriptive message using HEREDOC:
   ```bash
   git commit -m "$(cat <<'EOF'
   feat(module): add new feature

   Detailed description of changes
   EOF
   )"
   ```
5. Run `git status` to verify

**Important:**
- Never use `--no-verify` or skip hooks
- Never force push to main/master
- Check authorship before amending: `git log -1 --format='%an %ae'`
- Don't commit files with secrets (.env, credentials.json)

#### Creating Pull Requests
1. Run in parallel:
   - `git status`
   - `git diff`
   - Check if branch tracks remote
   - `git log` and `git diff [base]...HEAD`
2. Analyze ALL commits in the PR, not just the latest
3. Create PR with `gh pr create`:
   ```bash
   gh pr create --title "Title" --body "$(cat <<'EOF'
   ## Summary
   - Key change 1
   - Key change 2

   ## Test plan
   - [ ] Test scenario 1
   - [ ] Test scenario 2
   EOF
   )"
   ```

### Communication Style
- Be concise and technical
- Use markdown formatting
- No emojis unless requested
- Prioritize accuracy over validation
- Provide objective technical guidance

---

## Future Roadmap

### Phase 1: Foundation (Current)
- [ ] Define project scope and requirements
- [ ] Choose technology stack
- [ ] Set up project structure
- [ ] Configure development environment
- [ ] Add linting and formatting tools

### Phase 2: Core Development
- [ ] Implement authentication system
- [ ] Set up database schema
- [ ] Create API endpoints
- [ ] Build frontend interface
- [ ] Write unit and integration tests

### Phase 3: Enhancement
- [ ] Add advanced features
- [ ] Implement caching layer
- [ ] Optimize performance
- [ ] Enhance security measures
- [ ] Add monitoring and logging

### Phase 4: Production
- [ ] Set up CI/CD pipelines
- [ ] Configure production environment
- [ ] Implement backup strategies
- [ ] Add documentation
- [ ] Deploy to production

---

## Updating This Document

This CLAUDE.md file should be updated:
- When project structure changes significantly
- When new conventions are established
- When technology stack is decided
- When workflow processes change
- At major project milestones

**To Update:**
1. Read the current version
2. Make specific, necessary changes
3. Update the "Last Updated" date
4. Commit with message: `docs: update CLAUDE.md with [specific changes]`

---

## Quick Reference

### Essential Commands
```bash
# Development
npm install          # Install dependencies (Node.js)
npm test            # Run tests
npm run lint        # Run linter
npm run build       # Build for production

# Git
git status          # Check status
git log --oneline   # View commits
git diff            # View changes
git add .           # Stage all changes
git commit -m "msg" # Commit changes
git push -u origin branch-name  # Push to remote

# Docker (if used)
docker-compose up   # Start services
docker-compose down # Stop services
docker ps           # List containers
```

### Important Files (To Be Created)
- `.gitignore` - Files to ignore in version control
- `.env.example` - Template for environment variables
- `package.json` / `requirements.txt` - Dependencies
- `README.md` - User-facing documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - Project license

### Key Resources
- Repository: http://local_proxy@127.0.0.1:41225/git/Silknode1/TT-Recruit
- Main Branch: TBD
- Current Feature Branch: `claude/claude-md-miqcgwhzmbzvl8m4-01WyUjrWD36YEyb82rWSrcc4`

---

## Contact & Support

For questions or issues:
1. Check this CLAUDE.md file first
2. Review README.md for project-specific info
3. Consult relevant documentation in `/docs`
4. Reach out to project maintainers

---

**Remember:** This is a living document. Keep it updated as the project evolves!
