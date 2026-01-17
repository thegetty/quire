# PR Stack Evaluation: CLI Refactor (January 2026)

This document evaluates the current stacked PR structure and provides recommendations for which PRs should be combined before merging to main.

## Current PR Structure

| PR | Branch | Base | Unique Commits | Files | Lines Changed |
|----|--------|------|----------------|-------|---------------|
| #1149 | `feature/log-output-refined` | main | 26 | 33 | +1,315/-191 |
| #1150 | `feature/cli-ux-improvements` | log-output-refined | 31 | 28 | +1,518/-235 |
| #1151 | `feature/cli-engine-config` | cli-ux-improvements | 3 | 13 | +487/-16 |
| #1152 | `feature/cli-doctor-command` | cli-ux-improvements | 32 | 60 | +7,236/-148 |
| #1153 | `feature/lib-reporter` | cli-doctor-command | 7 | 12 | +1,608/-40 |
| #1154 | `refactor/cli-output-modes` | lib-reporter | 2 | 19 | +455/-43 |
| #1158 | `feature/pdf-output-option` | log-output-refined | 18 | 18 | +1,988/-237 |
| #1159 | `feature/epub-output-option` | log-output-refined | 9 | 12 | +1,020/-362 |
| #1162 | `feature/help-topics` | cli-ux-improvements | 60 | 40 | +2,447/-374 |

### Visual Stack Structure

```
main
└── #1149 log-output-refined (26 commits)
    ├── #1150 cli-ux-improvements (31 commits)
    │   ├── #1151 cli-engine-config (3 commits)
    │   ├── #1152 cli-doctor-command (32 commits)
    │   │   └── #1153 lib-reporter (7 commits)
    │   │       └── #1154 cli-output-modes (2 commits)
    │   └── #1162 help-topics (60 commits)
    ├── #1158 pdf-output-option (18 commits)
    └── #1159 epub-output-option (9 commits)
```

## Recommendations

### 1. COMBINE: #1153 `lib-reporter` + #1154 `cli-output-modes`

**Rationale:**
- `cli-output-modes` is only **2 commits** building directly on `lib-reporter`
- Strong file overlap: both modify `reporter/index.js`, `build.js`, `pdf.js`, `epub.js`
- Same concern: output/reporting infrastructure
- Combined size is still reasonable: 9 commits, ~2,000 lines

**Action:** Merge `refactor/cli-output-modes` into `feature/lib-reporter`

**Files modified by both PRs:**
- `packages/cli/src/lib/reporter/index.js`
- `packages/cli/src/commands/build.js`
- `packages/cli/src/commands/build.test.js`
- `packages/cli/src/commands/pdf.js`
- `packages/cli/src/commands/pdf.spec.js`
- `packages/cli/src/commands/epub.js`
- `packages/cli/src/commands/epub.spec.js`

---

### 2. COMBINE: #1158 `pdf-output-option` + #1159 `epub-output-option`

**Rationale:**
- **Identical feature pattern**: both add `--output` option to output commands
- Same architectural approach (metadata modules, error handling refactors)
- Same reviewer context needed (output path handling, error classes)
- Combined: 27 commits, 30 files, ~3,000 lines (still reviewable)
- Currently siblings off same base - natural pairing

**Action:** Merge `feature/epub-output-option` into `feature/pdf-output-option` (or create combined `feature/output-path-option`)

**Parallel changes in each PR:**

| pdf-output-option | epub-output-option |
|-------------------|-------------------|
| Add `--output` option to pdf command | Add `--output` option to epub command |
| Add `lib/pdf/metadata.js` module | Add `lib/epub/metadata.js` module |
| Refactor pdf error handling | Refactor epub error handling |
| Update `which` helper for ToolNotFoundError | (uses same helper) |
| Progress reporter integration | Progress reporter integration |

---

### 3. KEEP SEPARATE: #1149 `log-output-refined` + #1150 `cli-ux-improvements`

**Rationale:**
- Different concerns (logging infrastructure vs UX improvements)
- Combined would be 57 commits, ~2,800 lines - too large for effective review
- Clear dependency relationship works well for staged review
- Allows rollback granularity if UX changes cause issues

---

### 4. KEEP SEPARATE: #1151 `cli-engine-config`

**Rationale:**
- Only 3 commits - small and focused
- Distinct feature: engine configuration via conf system
- Different files from parent (conf/schema, epub/schema, pdf/schema)
- Clean separation of concerns

---

### 5. KEEP SEPARATE: #1152 `cli-doctor-command`

**Rationale:**
- Large standalone feature: 32 commits, 60 files, +7,236 lines
- Self-contained: new `doctor` command with diagnostics
- Already substantial - don't add more scope
- Clear feature boundary

---

### 6. KEEP SEPARATE: #1162 `help-topics`

**Rationale:**
- Large: 60 commits, 40 files, +2,447 lines
- Distinct documentation/help system feature
- No significant overlap with sibling PRs
- Self-contained scope

---

## Summary

| Action | PRs | Result |
|--------|-----|--------|
| **Combine** | #1153 + #1154 | `feature/lib-reporter` (9 commits) |
| **Combine** | #1158 + #1159 | `feature/output-path-option` (27 commits) |
| **Keep** | #1149 | `feature/log-output-refined` |
| **Keep** | #1150 | `feature/cli-ux-improvements` |
| **Keep** | #1151 | `feature/cli-engine-config` |
| **Keep** | #1152 | `feature/cli-doctor-command` |
| **Keep** | #1162 | `feature/help-topics` |

## Resulting Stack After Combinations

```
main
└── #1149 log-output-refined (26 commits)
    ├── #1150 cli-ux-improvements (31 commits)
    │   ├── #1151 cli-engine-config (3 commits)
    │   ├── #1152 cli-doctor-command (32 commits)
    │   │   └── #1153+#1154 lib-reporter (9 commits) ← COMBINED
    │   └── #1162 help-topics (60 commits)
    └── #1158+#1159 output-path-option (27 commits) ← COMBINED
```

**PRs reduced from 9 to 7** with cleaner review boundaries.

## Merge Order

Recommended merge sequence to main:

1. **#1149** `log-output-refined` - Foundation for all other PRs
2. **#1150** `cli-ux-improvements` - UX layer built on logging
3. **#1151** `cli-engine-config` - Small, independent feature
4. **#1158+#1159** `output-path-option` - Sibling feature, can merge after #1149
5. **#1152** `cli-doctor-command` - Large feature, needs careful review
6. **#1153+#1154** `lib-reporter` - Depends on doctor command
7. **#1162** `help-topics` - Can merge independently after #1150

## Combination Criteria Used

When evaluating whether to combine PRs, the following criteria were applied:

### Combine when:
- Very small PR (≤3 commits) building on another
- Strong file overlap (>50% shared files)
- Same functional concern
- Combined size remains reviewable (<40 commits, <4,000 lines)
- Identical feature pattern (e.g., same option added to multiple commands)

### Keep separate when:
- Different functional concerns
- Combined size too large (>50 commits or >3,000 lines)
- Need rollback granularity
- Clear feature boundaries
- Large standalone feature
