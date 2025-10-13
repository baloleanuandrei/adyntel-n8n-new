# Contributing to Adyntel N8N

## Branching Strategy

This project uses **[git-flow-next](https://git-flow.sh/)** with the classic preset for branch management.

### Prerequisites

Install git-flow-next:

```bash
# macOS
brew install gittower/tap/git-flow-next

# Or download from https://github.com/gittower/git-flow/releases
```

Initialize in your local repository (first time only):

```bash
git flow init --preset=classic
```

## Branch Structure

### Base Branches

- **`main`** - Production-ready code. Every commit represents a release.
- **`develop`** - Integration branch for ongoing development. Features merge here first.

### Topic Branches

All work must be done in topic branches, never directly on `main` or `develop`.

- **`feature/*`** - New features, enhancements, and non-urgent bug fixes
- **`release/*`** - Release preparation (version bumps, final bug fixes, documentation)
- **`hotfix/*`** - Emergency fixes for production issues

## Workflow

### Working on Features

#### Starting a Feature

```bash
# Start a new feature branch from develop
git flow feature start <feature-name>

# Example for Task Master tasks
git flow feature start task-1/remove-credentials
```

This creates a branch `feature/<feature-name>` based on `develop`.

#### Working on the Feature

```bash
# Make your changes
# Commit regularly with clear, descriptive messages
git add .
git commit -m "feat: implement user authentication"

# Keep your feature up to date with develop
git pull origin develop
```

#### Finishing a Feature

```bash
# Finish the feature (merges to develop and deletes feature branch)
git flow feature finish <feature-name>

# Push develop to remote
git push origin develop
```

**What happens:**
- Feature branch is merged into `develop`
- Feature branch is deleted locally
- You're switched back to `develop`

### Creating Releases

#### Starting a Release

```bash
# Start a release branch from develop
git flow release start <version>

# Example
git flow release start 1.2.0
```

This creates a branch `release/<version>` from `develop`.

#### Working on the Release

```bash
# Make final adjustments:
# - Update version numbers
# - Update CHANGELOG.md
# - Fix last-minute bugs
# - Update documentation

git commit -m "chore: bump version to 1.2.0"
```

#### Finishing a Release

```bash
# Finish the release
git flow release finish <version>

# This will:
# 1. Merge release branch into main
# 2. Tag the release on main
# 3. Merge release branch back into develop
# 4. Delete the release branch
```

**What happens:**
- Release is merged into `main` and tagged
- Release changes are merged back into `develop`
- Release branch is deleted
- You're switched back to `develop`

### Hotfixes (Emergency Production Fixes)

#### Starting a Hotfix

```bash
# Start a hotfix branch from main
git flow hotfix start <version>

# Example
git flow hotfix start 1.2.1
```

This creates a branch `hotfix/<version>` from `main`.

#### Finishing a Hotfix

```bash
# Make your fixes
git commit -m "fix: resolve critical security issue"

# Finish the hotfix
git flow hotfix finish <version>
```

**What happens:**
- Hotfix is merged into `main` and tagged
- Hotfix is merged into `develop`
- Hotfix branch is deleted

## Commit Message Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add JWT token validation"
git commit -m "fix(api): handle null response in getUser"
git commit -m "docs: update git-flow-next setup instructions"
```

## Task Master Integration

This project uses [Task Master AI](https://github.com/cline/task-master-ai) for task management.

### Branch Naming for Tasks

When working on Task Master tasks, use this naming convention:

```bash
# For task with ID "1"
git flow feature start task-1/short-description

# For subtask with ID "1.2"
git flow feature start task-1.2/short-description

# Examples
git flow feature start task-1/remove-credentials
git flow feature start task-2.3/implement-auth-middleware
```

### Updating Task Status

```bash
# Start working on a task
task-master set-status --id=1 --status=in-progress

# When complete
task-master set-status --id=1 --status=done
```

### Logging Implementation Notes

```bash
# Log progress on subtasks
task-master update-subtask --id=1.2 --prompt="Implemented JWT validation. Used bcrypt for hashing."
```

## Pull Request Guidelines

### Creating PRs

When pushing feature branches to remote for review:

```bash
# Push your feature branch
git push origin feature/<feature-name>

# Create PR via gh CLI
gh pr create --base develop --title "feat: <description>" --body "Implements task #X"
```

### PR Requirements

- Target `develop` branch (not `main`)
- Reference Task Master task IDs in description
- Pass all CI/CD checks
- Include tests for new functionality
- Update documentation as needed

## CI/CD Integration

Our CI/CD pipeline runs on:
- **Feature branches** - Run tests and linting
- **Develop branch** - Deploy to staging environment
- **Main branch** - Deploy to production

See `.github/workflows/` for workflow definitions.

## Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd adyntel-n8n-new

# Initialize git-flow-next
git flow init --preset=classic

# Initialize Task Master
task-master init

# Install dependencies
npm install

# Start development
git flow feature start <feature-name>
```

## Getting Help

- **git-flow-next documentation**: https://git-flow.sh/docs/
- **Task Master documentation**: https://github.com/cline/task-master-ai
- **Project issues**: Open an issue in this repository

## Quick Reference

```bash
# Features
git flow feature start <name>          # Start feature
git flow feature finish <name>         # Finish feature

# Releases
git flow release start <version>       # Start release
git flow release finish <version>      # Finish release

# Hotfixes
git flow hotfix start <version>        # Start hotfix
git flow hotfix finish <version>       # Finish hotfix

# Task Master
task-master next                       # Get next task
task-master show <id>                 # View task details
task-master set-status --id=<id> --status=<status>
```

## Branch Protection Rules

The following branches are protected:
- **`main`** - No direct commits. Only release/hotfix merges allowed.
- **`develop`** - No direct commits. Only feature merges allowed.

All changes must go through feature/release/hotfix branches.
