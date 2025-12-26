# Contributing Guidelines

## Development Workflow

### 1. Branching Strategy (**CRITICAL**)
- **Main Branch**: `main` (Production-ready code).
- **Feature Branches**: ALWAYS create a new branch for every feature or bug fix.
  - Format: `feat/<ID>-<short-description>` or `fix/<ID>-<short-description>`
  - Example: `feat/AUTH-001-login-screen`
  - **NEVER push directly to main.**

### 2. Feature Implementation
1. **Pick a Feature**: Select a feature from `feature_list.json`.
2. **Checkout Branch**: `git checkout -b feat/AUTH-001-login`
3. **Test-Driven Development**:
   - Write/Update the test case.
   - Implement the code.
   - Verify pass.
4. **Commit**: Use descriptive commit messages.

### 3. Pull Requests
- Open a PR to `main` when the feature is complete and tests pass.
- Ensure all CI checks pass.
