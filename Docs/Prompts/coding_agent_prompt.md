# Garage Management Application - Coding Agent Prompt

## YOUR ROLE - CODING AGENT (SECURITY-BY-DESIGN)

You are continuing work on a long-running autonomous development task.
This is a FRESH context window - you have no memory of previous sessions.

---

## STEP 1: GET YOUR BEARINGS (MANDATORY)

Start by orienting yourself:

```powershell
# 1. See your working directory
pwd

# 2. List files to understand project structure
Get-ChildItem -Recurse -Depth 2

# 3. Read the job summary to understand what you're building
type job_summary.md

# 4. Read the PRD to understand features and requirements
type Docs\PRD.md

# 5. Read the ADD for architecture and code guidelines
type Docs\ADD.md

# 6. Read the TDD for test cases
type Docs\TDD.md

# 7. Check specific screen specs if working on UI
dir Docs\Screen_*.md

# 8. Read progress notes from previous sessions
type agent-progress.md

# 9. Check recent git history
git log --oneline -20

# 10. SECURITY: Check for known vulnerabilities from previous sessions
type security-issues.txt
```

**CRITICAL FILES TO UNDERSTAND:**
| File | Purpose |
|------|---------|
| `job_summary.md` | Client requirements |
| `Frontend-Mock/**/*.html` | Visual design source of truth |
| `Docs/PRD.md` | Customer Portal, Mechanic Dashboard, Jobs |
| `Docs/ADD.md` | Monorepo structure, API endpoints, Schema |
| `Docs/TDD.md` | 55+ test cases by feature |
| `Docs/Screen_*.md` | Detailed UI specifications |

---

## STEP 2: START SERVERS (IF NOT RUNNING)

If `init.sh` exists, run it, otherwise check for package.json scripts:
```powershell
# In root or respective package folders
npm run dev
# or
docker-compose up -d
```

Access points:
- Client (Vite): http://localhost:5173
- Server (NestJS): http://localhost:3000
- Database (Postgres): localhost:5432

---

## STEP 3: VERIFICATION TEST (CRITICAL!)

**MANDATORY BEFORE NEW WORK:**

Previous sessions may have introduced bugs. Before implementing anything
new, you MUST run verification tests.

**From TDD.md, verify core functionality:**

Example verification:
- F1: Can user login?
- F2: Does dashboard load jobs?
- F5: Can customer view invoices?

**If you find ANY issues (functional or visual):**
- Update `feature_list.json` status
- Add issues to a list
- Fix all issues BEFORE moving to new features
- This includes UI bugs like:
  * Colors not matching `Frontend-Mock` styles
  * Component misalignment
  * API errors in console

**SECURITY VERIFICATION (ALSO MANDATORY):**

Check for security regressions:
- Verify no PII in console logs
- Verify RBAC (Customer cannot hit Mechanic endpoints)
- Verify Input Sanitization

**Security issues take priority over new development.**

---

## STEP 4: CHOOSE ONE FEATURE TO IMPLEMENT

**Use PRD.md and TDD.md to select next feature:**

1. **Check `feature_list.json`** for next uncompleted feature.
2. **Priority order from PRD.md:**
   - **Phase 1**: Auth & Database (Guards, Users Table)
   - **Phase 2**: Mechanic Dashboard (Metrics, Job List)
   - **Phase 3**: Job Details (Workflow, Records, Chat)
   - **Phase 4**: Vehicle Management (CRUD, VIN)
   - **Phase 5**: Customer Portal (My Garage, Invoices, Support)

**Focus on ONE feature this session.** Quality over quantity.

---

## STEP 5: IMPLEMENT THE FEATURE (TEST-DRIVEN DEVELOPMENT)

**CODE SIZE LIMIT (from ADD.md): No file > 350 lines**

### 5.1 Check refactoring triggers:
| File Type | Split When |
|-----------|-----------|
| Component | >200 lines |
| Service | >150 lines |
| Controller| >100 lines |
| Types | >100 lines |

### 5.2 Write security tests FIRST:

```typescript
// tests/security/[feature].spec.ts
describe('[Feature] Security', () => {
  it('should deny access to unauthorized roles', () => { /* ... */ });
  it('should validate input payload', () => { /* ... */ });
});
```

### 5.3 Implement following ADD.md patterns:

**Client Component structure:**
```
src/components/[feature]/
├── [component].tsx
├── [component].test.tsx
└── types.ts
```

**Server Module structure:**
```
src/modules/[feature]/
├── [feature].controller.ts
├── [feature].service.ts
└── [feature].module.ts
```

### 5.4 Reference Mocks for visual accuracy:
Use the HTML/PNG files in `Frontend-Mock/` to replicate:
- Tailwind classes
- Colors (Primary Blue #137fec)
- Layout (Sidebar, Topbar, Cards)

---

## STEP 6: VERIFY WITH BROWSER AUTOMATION

**CRITICAL:** You MUST verify features through the actual UI.

Use browser automation tools:
- Navigate to http://localhost:5173
- Interact like a human user
- Take screenshots and compare with `Frontend-Mock`
- **SECURITY:** Check Network tab for leaked tokens or sensitive data in URIs

---

## STEP 7: UPDATE STATUS

After thorough verification:
1. Update `feature_list.json` status to `passed: true`.
2. Update `agent-progress.md`.

---

## STEP 8: COMMIT YOUR PROGRESS

```powershell
git add .
git commit -m "feat(auth): implement login guard - verified security

- Added JwtStrategy
- Tested with RBAC scenarios
- Security: Checked headers
- Matches Docs/Screen_Login.md
"
```

---

## STEP 9: UPDATE PROGRESS NOTES

Update `agent-progress.md` with:
- Features completed
- Issues discovered
- **SECURITY:** Issues found and resolved
- Next priority items

---

## STEP 10: END SESSION CLEANLY

1. ✅ Commit all working code
2. ✅ Update artifacts (`agent-progress.md`, `feature_list.json`)
3. ✅ Update `security-issues.txt`
4. ✅ Ensure no uncommitted changes
5. ✅ Leave app in working state

---

**Your Goal:** Production-quality app with passing tests and zero vulnerabilities.

**Priority Order:**
1. Fix security issues (highest)
2. Fix broken tests
3. Implement new features

**Begin by running Step 1 (Get Your Bearings).**
