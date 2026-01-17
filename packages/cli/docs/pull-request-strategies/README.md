# Pull Request Strategies

Documentation for managing stacked PRs and merge strategies in the Quire project.

## Documents

- [PR Stack Evaluation (January 2026)](pr-stack-evaluation.md) - Analysis of CLI refactor PR stack with combination recommendations

## General Guidelines

### When to Use Stacked PRs

Stacked PRs are useful when:
- A large feature can be broken into logical, reviewable chunks
- Changes have clear dependencies (B requires A to be merged first)
- You want to enable parallel review of independent features
- The total change set would be too large for a single PR

### PR Size Guidelines

| Size | Commits | Lines | Reviewability |
|------|---------|-------|---------------|
| Small | 1-5 | <500 | Easy |
| Medium | 6-15 | 500-1,500 | Moderate |
| Large | 16-30 | 1,500-3,000 | Challenging |
| Too Large | >30 | >3,000 | Split recommended |

### When to Combine PRs

Consider combining when:
- One PR has ≤3 commits and builds directly on another
- >50% file overlap between PRs
- Same functional concern (e.g., both modify error handling)
- Combined size stays under 40 commits / 4,000 lines
- Identical feature pattern applied to multiple areas

### When to Keep PRs Separate

Keep separate when:
- Different functional concerns
- Combined size exceeds review thresholds
- Rollback granularity is important
- Clear feature boundaries exist
- Either PR is already large (>30 commits)

## Tools for Analysis

```bash
# Count unique commits in a PR
git log --oneline base-branch..feature-branch | wc -l

# Get file change statistics
git diff --stat base-branch..feature-branch | tail -1

# List files changed
git diff --name-only base-branch..feature-branch

# Find common ancestor of two branches
git merge-base branch-a branch-b
```
