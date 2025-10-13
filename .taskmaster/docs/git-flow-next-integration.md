# Git-Flow-Next Integration with Task Master

## Overview

This project uses **[git-flow-next](https://git-flow.sh/)** for branch management in conjunction with **Task Master AI** for task tracking. This document explains how the two systems work together.

## Branch Strategy

### Base Branches

- **`main`** - Production branch. Only receives merges from release and hotfix branches.
- **`develop`** - Integration branch. All feature branches merge here first.

### Topic Branches

- **`feature/*`** - New features and enhancements
- **`release/*`** - Release preparation
- **`hotfix/*`** - Emergency production fixes

## Task Master Configuration

The `.taskmaster/config.json` file includes git-flow-next integration:

```json
{
  "gitflow": {
    "enabled": true,
    "branchStrategy": "git-flow-next",
    "baseBranches": {
      "production": "main",
      "integration": "develop"
    },
    "topicBranches": {
      "feature": "feature/",
      "release": "release/",
      "hotfix": "hotfix/"
    },
    "taskBranchNaming": "task-{id}/{description}",
    "enforceWorkflow": true,
    "autoCreateBranches": false
  }
}
```

### Default Tag Changed

The `defaultTag` in Task Master is set to `"develop"` to align with the integration branch where most development happens.

## Workflow Integration

### Standard Feature Development

```bash
# 1. Get next task from Task Master
task-master next

# 2. Create feature branch using git-flow-next
git flow feature start task-1/remove-credentials

# 3. Mark task as in-progress
task-master set-status --id=1 --status=in-progress

# 4. Implement the feature
# ... make changes ...

# 5. Log implementation notes
task-master update-subtask --id=1.1 --prompt="Implemented credential removal. Verified no references remain."

# 6. Commit changes
git add .
git commit -m "feat(credentials): remove duplicate adyntelPicsApi credentials file"

# 7. Finish feature (merges to develop)
git flow feature finish task-1/remove-credentials

# 8. Mark task as done
task-master set-status --id=1 --status=done

# 9. Push develop
git push origin develop
```

### Working with Subtasks

For tasks with multiple subtasks:

```bash
# Show task details
task-master show 2

# Create feature branch for parent task
git flow feature start task-2/implement-auth

# Work through subtasks one by one
task-master set-status --id=2.1 --status=in-progress
# ... implement subtask 2.1 ...
git commit -m "feat(auth): add JWT middleware"
task-master set-status --id=2.1 --status=done

task-master set-status --id=2.2 --status=in-progress
# ... implement subtask 2.2 ...
git commit -m "feat(auth): add user validation"
task-master set-status --id=2.2 --status=done

# Finish feature when all subtasks complete
git flow feature finish task-2/implement-auth
task-master set-status --id=2 --status=done
```

### Release Workflow

```bash
# 1. Check all tasks for release are complete
task-master list --status=done

# 2. Start release branch
git flow release start 1.2.0

# 3. Update version and changelog
npm version 1.2.0 --no-git-tag-version
# Edit CHANGELOG.md with release notes

# 4. Commit release preparation
git commit -m "chore: prepare release 1.2.0"

# 5. Finish release (merges to main and develop, creates tag)
git flow release finish 1.2.0

# 6. Push everything
git push origin main develop --tags
```

### Hotfix Workflow

```bash
# 1. Create urgent task in Task Master (if needed)
task-master add-task --prompt="Fix critical security vulnerability in auth" --priority=critical

# 2. Start hotfix branch from main
git flow hotfix start 1.2.1

# 3. Mark task as in-progress
task-master set-status --id=X --status=in-progress

# 4. Implement fix
# ... make changes ...
git commit -m "fix(security): patch auth vulnerability CVE-2024-XXXX"

# 5. Finish hotfix (merges to main and develop)
git flow hotfix finish 1.2.1

# 6. Mark task as done
task-master set-status --id=X --status=done

# 7. Push everything
git push origin main develop --tags
```

## Branch Naming Conventions

### For Task Master Tasks

Follow this pattern: `task-{id}/{short-description}`

**Examples:**

```bash
# Main task
git flow feature start task-1/remove-credentials

# Subtask
git flow feature start task-1.2/update-references

# Complex task
git flow feature start task-5/implement-oauth-flow
```

### For Non-Task Work

```bash
# Bug fixes
git flow feature start fix/login-error

# Enhancements
git flow feature start enhance/improve-error-messages

# Documentation
git flow feature start docs/update-api-docs

# Refactoring
git flow feature start refactor/simplify-auth-logic
```

## CI/CD Integration

The `.github/workflows/` directory contains workflows for each branch type:

- **`feature-branch.yml`** - Runs tests and linting on feature branches
- **`develop-branch.yml`** - Deploys to staging when develop is updated
- **`main-branch.yml`** - Deploys to production when main is updated
- **`release-branch.yml`** - Validates release preparation
- **`hotfix-branch.yml`** - Fast-tracks critical fixes with validation

All workflows enforce the git-flow-next branching strategy.

## Task Master Tags

Task Master supports tags for organizing tasks across different contexts. For git-flow-next integration:

```bash
# Create tag for release
task-master add-tag release-1.2.0 --copy-from-current

# Switch to release tag
task-master use-tag release-1.2.0

# View tasks for this release
task-master list

# Create tag for hotfix
task-master add-tag hotfix-critical
```

## Pull Request Workflow

When working with PRs instead of direct merges:

```bash
# 1. Start feature
git flow feature start task-1/feature-name

# 2. Push feature branch to remote
git push -u origin feature/task-1/feature-name

# 3. Create PR targeting develop
gh pr create --base develop --title "feat: implement feature" --body "Implements task #1"

# 4. After PR approval and merge, clean up locally
git checkout develop
git pull origin develop
git branch -d feature/task-1/feature-name
```

## Best Practices

### 1. Always Work in Feature Branches

❌ **Never** commit directly to `main` or `develop`

✅ Always use `git flow feature start`

### 2. Keep Feature Branches Short-Lived

- Complete features within 1-3 days
- Break large tasks into smaller subtasks
- Merge frequently to avoid conflicts

### 3. Update Task Master Regularly

```bash
# At start of work
task-master set-status --id=X --status=in-progress

# During implementation
task-master update-subtask --id=X.Y --prompt="Progress notes"

# At completion
task-master set-status --id=X --status=done
```

### 4. Sync with Develop Regularly

```bash
# While working on a feature
git checkout develop
git pull origin develop
git checkout feature/task-1/feature-name
git merge develop
```

### 5. Use Descriptive Branch Names

```bash
# ✅ Good
git flow feature start task-1/remove-duplicate-credentials
git flow feature start task-5/add-oauth-support

# ❌ Bad
git flow feature start fix
git flow feature start task-1
```

## Troubleshooting

### git-flow-next Not Initialized

```bash
# Initialize with classic preset
git flow init --preset=classic

# Verify configuration
git config --local --list | grep gitflow
```

### Task Master Default Tag Issue

If tasks aren't showing up, check the active tag:

```bash
# View current configuration
cat .taskmaster/config.json | grep defaultTag

# Should show: "defaultTag": "develop"

# Switch to develop tag if needed
task-master use-tag develop
```

### Branch Already Exists

```bash
# If feature branch already exists locally
git branch -d feature/task-1/old-branch

# If exists on remote
git push origin --delete feature/task-1/old-branch
```

### Merge Conflicts During Finish

```bash
# If git flow feature finish fails due to conflicts
git checkout develop
git merge --no-ff feature/task-1/feature-name

# Resolve conflicts
git add .
git commit -m "Merge feature/task-1/feature-name into develop"

# Delete feature branch manually
git branch -d feature/task-1/feature-name
```

## References

- **git-flow-next Documentation**: https://git-flow.sh/docs/
- **Task Master Documentation**: https://github.com/cline/task-master-ai
- **Project Contributing Guide**: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Conventional Commits**: https://www.conventionalcommits.org/

## Quick Command Reference

```bash
# Task Master
task-master next                                    # Get next task
task-master show <id>                              # View task details
task-master set-status --id=<id> --status=<status> # Update status
task-master update-subtask --id=<id> --prompt="notes"

# git-flow-next
git flow feature start <name>                       # Start feature
git flow feature finish <name>                      # Finish feature
git flow release start <version>                    # Start release
git flow release finish <version>                   # Finish release
git flow hotfix start <version>                     # Start hotfix
git flow hotfix finish <version>                    # Finish hotfix

# Combined Workflow
task-master next && \
  git flow feature start task-X/description && \
  task-master set-status --id=X --status=in-progress
```
