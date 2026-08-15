# AGENTS.md — PU-GPT AI Development Instructions

## 1. Project

**Name:** PU-GPT  
**Repository:** https://github.com/AMAN417/PU-GPT

PU-GPT is an AI assistant for Punjabi University students and applicants. It should provide accurate, useful answers about admissions, courses, fees, hostel information, scholarships, notices, and other university information.

The project is built as a student-focused full-stack application with a React/TypeScript frontend and Node.js/Express backend.

---

## 2. Most Important Rule: Do Not Hallucinate University Facts

Accuracy is more important than sounding confident.

Never invent or guess Punjabi University-specific information such as:

- Fees
- Admission deadlines
- Eligibility
- Hostel fees
- Hostel rules
- Scholarship amounts
- Scholarship deadlines
- Exam dates
- Faculty information
- Placement statistics
- Contact numbers
- Official notices
- University policies

If verified information is not available in the knowledge base, clearly say that the information is currently unavailable.

Example:

> I don't currently have verified information about the 2026-27 hostel fee in the PU-GPT knowledge base.

Do not turn an assumption, old information, or general web knowledge into an "official" university fact.

---

## 3. Source of Truth

The actual repository code is the source of truth for implementation details.

Before changing architecture, inspect the existing code.

Before adding university facts, inspect the knowledge base.

Before changing an API, inspect its existing consumers.

Do not assume a file, endpoint, component, or dependency exists just because this document mentions it.

---

## 4. Technology

### Frontend

The project uses:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router

### Backend

The project uses:

- Node.js
- Express
- CORS
- dotenv
- Google/OpenRouter-compatible AI integration as currently implemented

The backend has previously run on:

`http://localhost:5000`

Always check the actual project configuration before assuming ports or commands.

---

## 5. Project Structure

The repository contains frontend and backend code, including a knowledge base.

The important areas are expected to include:

```text
PU-GPT/
├── src/
├── server/
│   ├── knowledge/
│   │   ├── admissions.txt
│   │   ├── courses.txt
│   │   ├── fees.txt
│   │   ├── hostel.txt
│   │   ├── scholarships.txt
│   │   ├── university.txt
│   │   └── notices/
│   └── ...
├── public/
├── README.md
├── .gitignore
├── package.json
└── ...
```

Inspect the current repository before relying on this structure.

---

## 6. Knowledge Base

University-specific information should primarily live in the knowledge base rather than being hard-coded into frontend components.

The knowledge base is under:

`server/knowledge/`

Known categories include:

- Admissions
- Courses
- Fees
- Hostel
- Scholarships
- University information
- Notices

When answering a university question:

1. Identify the relevant knowledge files.
2. Retrieve only relevant information.
3. Prefer current/session-specific information.
4. Respect the source and date of information.
5. If the information is missing, say so.
6. Never fill missing university facts with guesses.

---

## 7. Academic Session Rules

University information is time-sensitive.

Never assume that information from one academic session applies to another.

For example:

- 2025-26 fees must not automatically become 2026-27 fees.
- An old notice must not be presented as a current notice.
- A historical deadline must not be presented as an upcoming deadline.

Whenever possible, clearly identify the academic session and date.

---

## 8. B.Tech CSE Knowledge

The knowledge base currently contains B.Tech CSE information such as:

- 4-year duration
- 10+2 eligibility
- Physics and Mathematics requirements
- Relevant third-subject requirements
- Minimum aggregate requirements recorded in the knowledge base
- Admission process information
- Form No. 18
- Application information
- JEE Main counselling / 10+2 merit information as recorded in the knowledge base

Do not change these facts unless the knowledge base is updated with verified information.

---

## 9. Hostel Fee Decision

The project owner has specifically decided to postpone adding/updating **2026-27 hostel fee information** until a proper official document is available.

Therefore:

**Do not invent, estimate, scrape, or add a 2026-27 hostel fee without a proper verified document/source.**

If asked about it while no verified information exists, explain that the PU-GPT knowledge base does not currently contain verified 2026-27 hostel fee information.

---

## 10. Notice System

The project includes a notice system using:

`server/knowledge/notices/`

The notice system has been developed to support:

- Notice discovery
- Notice parsing
- Date sorting
- Categories
- Current notices
- Expired notices
- Upcoming notices

There has previously been a sample notice for testing.

Do not replace the existing notice architecture without first understanding how it works and why a replacement is necessary.

When changing the notice system, test:

- Current notices
- Upcoming notices
- Expired notices
- Categories
- Empty results
- Date sorting

---

## 11. Notice Status

Notice status should be determined from actual notice metadata and dates rather than guessed.

Use clear categories such as:

- CURRENT
- UPCOMING
- EXPIRED

Do not present an expired notice as current.

When dates are missing or ambiguous, do not invent them.

---

## 12. AI Integration

The backend uses an external AI model/API.

The current implementation must be inspected before changing:

- Provider
- Model
- API request format
- Environment variable names
- System prompts
- Response handling

Do not silently replace the AI provider or model.

If a provider/model change is requested, update the configuration carefully and test the complete `/chat` flow.

---

## 13. Secrets and Environment Variables

Never hard-code API keys.

Never commit:

- `.env`
- API keys
- passwords
- access tokens
- private credentials

Use environment variables.

Example:

```env
OPENROUTER_API_KEY=your_key_here
```

The actual variable names in the repository are authoritative.

If a secret is accidentally exposed, recommend rotating it and remove it from the working tree/history when appropriate.

---

## 14. Frontend Rules

Before changing frontend code:

1. Inspect the existing component structure.
2. Reuse existing components when possible.
3. Preserve the existing design language.
4. Preserve responsive behavior.
5. Avoid unnecessary dependencies.
6. Avoid rewriting working pages.
7. Test routing after route changes.
8. Test API/chat flows after backend-related frontend changes.

Do not replace React/Vite/Tailwind/Router architecture unless explicitly requested.

---

## 15. Backend Rules

Before changing backend code:

1. Inspect the server entry point.
2. Inspect knowledge loading.
3. Inspect notice loading/parsing.
4. Inspect existing API routes.
5. Check frontend consumers of the route.
6. Preserve existing API contracts unless a change is required.
7. Add proper error handling.
8. Never expose secrets.

Make incremental changes instead of rewriting the server.

---

## 16. API Rules

Before changing an existing endpoint:

- Find every frontend usage.
- Understand the current request/response structure.
- Preserve compatibility when possible.
- Update consumers if the response contract changes.

Known functionality has included:

`GET /notices`

The actual current routes should always be confirmed from the server code.

When adding an endpoint, document:

- Method
- Route
- Request format
- Response format
- Errors

---

## 17. Code Quality

Prefer:

- Clear variable/function names
- Small functions
- Reusable components
- Existing project conventions
- Minimal duplication
- Explicit error handling

Avoid:

- Giant functions
- Duplicate logic
- Dead code
- Unused imports
- Unnecessary dependencies
- Temporary debugging code left behind
- Hard-coded university facts in UI code

---

## 18. Development Workflow for AI Agents

When an AI agent starts working on PU-GPT:

### First inspect

Read:

- `AGENTS.md`
- `README.md`
- `package.json`

Then inspect:

- Frontend entry point
- Backend entry point
- Knowledge directory
- Notice system
- Current Git status
- Existing relevant components

### Before editing

Briefly determine:

1. What is currently implemented?
2. What files are relevant?
3. What is the smallest safe change?
4. Could the change break existing functionality?

Do not modify unrelated files.

### After editing

Run appropriate checks, for example:

```powershell
npm run build
```

Use the actual scripts defined in `package.json`.

For backend changes, start/test the server when practical.

Then inspect:

```powershell
git status
git diff
```

---

## 19. Git Workflow

Repository:

`AMAN417/PU-GPT`

Main branch:

`main`

Normal workflow:

```powershell
git status
git add .
git commit -m "Describe the change"
git push
```

Before large changes:

```powershell
git status
git branch
```

Never use destructive commands such as:

```powershell
git reset --hard
git clean -fd
```

unless the project owner explicitly requests them.

Do not overwrite unrelated user changes.

---

## 20. Do Not Break Existing Work

PU-GPT has already gone through multiple development stages.

Treat existing working functionality as valuable.

Before replacing a system:

- Understand it.
- Find where it is used.
- Determine whether it is actually broken.
- Prefer a small improvement.
- Preserve existing behavior unless the requested feature requires a change.

Do not rewrite the entire application just because another architecture looks cleaner.

---

## 21. Knowledge File Guidelines

When adding university information:

1. Put it in the appropriate knowledge file.
2. Include academic session/year when relevant.
3. Include dates when relevant.
4. Include source information when available.
5. Avoid mixing sessions without labels.
6. Avoid duplicate facts.
7. Avoid contradictory information.
8. Keep the format readable by both humans and the retrieval code.

For notices, follow the format expected by the existing notice parser.

---

## 22. Conflicting Information

If two knowledge sources conflict:

1. Check academic session.
2. Check publication date.
3. Check source/authority.
4. Check whether one is outdated.
5. Do not silently choose a value when the conflict cannot be resolved.

If necessary, flag the conflict for the project owner.

---

## 23. User Experience

PU-GPT responses should be:

- Clear
- Concise
- Student-friendly
- Helpful
- Honest about uncertainty

When information is unavailable, do not simply respond with a generic error.

Explain what is missing.

For example:

> I don't currently have verified information about that in the PU-GPT knowledge base.

If appropriate, explain what official document or information would be needed to add it.

---

## 24. Current Project Direction

The long-term goal is a polished university AI assistant.

Important areas include:

### AI Q&A

- Natural language questions
- Knowledge retrieval
- Accurate answers
- Missing-information handling
- Helpful follow-ups

### Notices

- Current notices
- Upcoming notices
- Expired notices
- Categories
- Search/filtering
- Notice details

### University information

Potential verified knowledge areas:

- Admissions
- Courses
- Fees
- Hostel
- Scholarships
- Departments
- Faculty
- Placements
- Exams
- Academic calendar
- Student services
- Important contacts

Only add university-specific information when verified.

---

## 25. Future Features

Potential future improvements include:

- Better retrieval
- Source citations
- Notice search
- Notice detail pages
- Better filtering
- Conversation history
- Authentication
- Student dashboard
- Admin dashboard
- Knowledge-base management
- Document ingestion
- PDF processing
- Better ranking
- Automated tests
- Production deployment
- Monitoring
- Improved security

Do not implement all of these automatically. Build incrementally based on the current project priority.

---

## 26. Priority Order

When deciding what to improve, prioritize:

1. Correctness
2. Stability
3. Knowledge-base reliability
4. Notice reliability
5. Security
6. User experience
7. Maintainability
8. Performance
9. New features

Do not sacrifice reliable university information for flashy features.

---

## 27. Testing

For knowledge-base changes, test:

- Information that exists
- Information that does not exist
- Different academic sessions
- Missing fields
- Relevant notices

For notice changes, test:

- Current
- Upcoming
- Expired
- Categories
- Empty results
- Date sorting

For frontend changes, test:

- Page loading
- Navigation
- Responsive layout
- Chat
- API requests

For backend changes, test:

- Server startup
- API responses
- Error handling
- AI request flow
- Knowledge retrieval

---

## 28. Error Handling

Errors should be useful to developers and safe for users.

Never expose:

- API keys
- Passwords
- Sensitive environment variables
- Unnecessary stack traces
- Internal sensitive paths

Development logs are useful, but remove excessive debugging logs when appropriate.

---

## 29. Deployment

Before deployment, verify:

- Environment variables
- API keys
- CORS
- Frontend/backend URLs
- Production API configuration
- Build output
- Knowledge files
- Notice dates
- Error handling
- `.gitignore`
- No secrets committed

Never deploy development credentials.

---

## 30. Project Owner Decisions

Respect these existing decisions:

- PU-GPT must not hallucinate university-specific facts.
- Verified documents should drive university-specific knowledge.
- 2026-27 hostel fee remains unavailable until a proper official document is provided.
- The notice system should be preserved and improved rather than casually replaced.
- GitHub is the project's source-control repository.

If a new instruction conflicts with these decisions, follow the newer explicit instruction from the project owner.

---

## 31. When Unsure

Do not guess.

First:

1. Inspect the repository.
2. Search the code.
3. Search the knowledge base.
4. Check existing documentation.
5. Determine whether the information already exists.
6. Make the smallest safe change.

Only ask the project owner when the ambiguity materially affects the implementation.

---

## 32. Final Principle

**Build PU-GPT as a reliable Punjabi University assistant, not as a generic chatbot.**

Preserve working functionality, use verified knowledge, avoid hallucinations, keep secrets secure, make incremental changes, and always inspect the actual repository before making assumptions.
