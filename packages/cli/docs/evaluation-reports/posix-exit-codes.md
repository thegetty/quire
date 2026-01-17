# Evaluation: PR #1143, #1148 Support for POSIX Exit Codes

## Executive Summary

This evaluation analyzes the exit code conventions in PR #1143 (Refactored CLI Errors) and PR #1148 (Process Control) against standard POSIX errno values from the Chromium reference.

**Verdict:** The PRs use **application-specific exit codes** rather than standard POSIX errno values. This is the **correct approach** for a high-level CLI application like Quire.

---

## POSIX errno vs Application Exit Codes

### Standard POSIX errno Values

| Code | Symbol | Meaning |
|------|--------|---------|
| 1 | EPERM | Operation not permitted |
| 2 | ENOENT | No such file or directory |
| 3 | ESRCH | No such process |
| 4 | EINTR | Interrupted system call |
| 5 | EIO | Input/output error |
| 13 | EACCES | Permission denied |
| 22 | EINVAL | Invalid argument |
| 130 | — | Terminated by Ctrl-C (128 + SIGINT) |
| 143 | — | Terminated by SIGTERM (128 + SIGTERM) |

### PR #1143 Exit Codes (Custom Application Codes)

| Code | Error Category | Error Classes |
|------|----------------|---------------|
| 1 | General error | `QuireError` (default) |
| 2 | Project errors | `NotInProjectError`, `ProjectCreateError` |
| 3 | Build errors | `BuildFailedError`, `ConfigFieldMissingError`, `ConfigFileNotFoundError` |
| 4 | Validation errors | `ValidationError`, `YamlDuplicateError`, `YamlParseError`, `YamlValidationError` |
| 5 | Output errors | `PdfGenerationError`, `EpubGenerationError`, `ToolNotFoundError`, `MissingBuildOutputError`, `InvalidPdfLibraryError`, `InvalidEpubLibraryError` |
| 6 | Install errors | `DependencyInstallError`, `VersionNotFoundError` |

### PR #1148 Signal Exit Codes (POSIX-Compliant)

| Code | Signal | Convention |
|------|--------|------------|
| 130 | SIGINT | 128 + 2 (Ctrl-C) |
| 143 | SIGTERM | 128 + 15 |
| 1 | Force exit | Double Ctrl-C |

---

## Analysis

### Why NOT Use Standard POSIX errno?

Standard POSIX errno values (1-125) are designed for **system-level errors** encountered by low-level programs:

| POSIX Code | System Meaning | Quire Equivalent |
|------------|---------------|------------------|
| 2 (ENOENT) | File not found | Could mean: config missing, project not found, build output missing |
| 5 (EIO) | I/O error | Could mean: build failed, PDF failed, EPUB failed |
| 22 (EINVAL) | Invalid argument | Could mean: bad config, bad CLI option, validation error |

Using POSIX codes would **lose semantic precision**. Code 2 (`ENOENT`) doesn't distinguish between:
- `quire build` run outside a project (user error)
- `_config.yml` missing (configuration error)
- Build output missing for PDF generation (workflow error)

### Current Approach: Application-Specific Codes

PR #1143's exit code scheme provides **domain-specific semantics**:

```
Exit Code → Error Category → Specific Error → User Action
    2     →    Project     → NotInProjectError → cd to project
    3     →    Build       → BuildFailedError → quire build --debug
    5     →    Output      → ToolNotFoundError → install PrinceXML
```

This allows:
- **Programmatic handling**: Scripts can branch on exit codes
- **Debugging clarity**: Exit code immediately indicates failure category
- **User guidance**: Error messages can suggest specific fixes

### Signal Handling (PR #1148)

PR #1148 correctly implements **POSIX signal conventions**:

```javascript
process.exit(signal === 'SIGINT' ? 130 : 143)
```

| Signal | Exit Code | Calculation |
|--------|-----------|-------------|
| SIGINT (Ctrl-C) | 130 | 128 + 2 |
| SIGTERM | 143 | 128 + 15 |

This follows the Unix convention where terminated-by-signal exit codes are `128 + signal_number`.

---

## Compliance Assessment

| Aspect | POSIX Compliance | Assessment |
|--------|------------------|------------|
| Signal exit codes | ✅ Yes | 130 (SIGINT), 143 (SIGTERM) |
| Application exit codes | ⚠️ N/A | Not applicable—POSIX errno is for system calls |
| Exit code range | ✅ Yes | Codes 1-6 are in valid range (0-255) |
| Code 0 for success | ✅ Yes | Implied by error-only exit handling |
| Reserved codes avoided | ✅ Yes | Avoids 126 (not executable), 127 (command not found), 128+ (signals) |

---

## Recommendations

### 1. Keep Current Exit Code Scheme

The application-specific codes (1-6) are appropriate for Quire's use case:

```
Code 0: Success
Code 1: General error (unknown/unexpected)
Code 2: Project context errors
Code 3: Build process errors
Code 4: Validation errors
Code 5: Output generation errors
Code 6: Installation errors
```

### 2. Document Exit Codes for Programmatic Use

Update CLI documentation with exit code reference for script authors:

```bash
quire build
case $? in
  0) echo "Build succeeded" ;;
  2) echo "Not in a Quire project" ;;
  3) echo "Build failed" ;;
  4) echo "Validation error" ;;
  *) echo "Unknown error" ;;
esac
```

### 3. Consider Expanding Code Range (Optional)

For finer granularity, could expand to decade-based grouping:

```
10-19: Project errors
20-29: Build errors
30-39: Validation errors
40-49: Output errors
50-59: Installation errors
```

This matches the pattern documented in `pr-merge-strategy-1.0.0.md` but would require updating all error classes.

### 4. Add SIGHUP Handler (Nice-to-Have)

PR #1148 handles SIGINT and SIGTERM. Consider adding SIGHUP (exit code 129) for terminal disconnect scenarios:

```javascript
process.on('SIGHUP', () => shutdown('SIGHUP'))
// Exit with 129 (128 + 1)
```

---

## Conclusion

**PR #1143 and #1148 are correctly designed.** They:

1. Use POSIX-compliant signal exit codes (130, 143)
2. Use meaningful application-specific codes (1-6) instead of overloading POSIX errno
3. Avoid reserved exit codes (126, 127, 128+)
4. Provide semantic clarity for programmatic error handling

The current implementation is **superior to using raw POSIX errno values** because it provides domain-specific error categories that are actionable for both users and scripts.

---

## Exit Code Summary

| Code | Category | Signal/Meaning |
|------|----------|----------------|
| 0 | Success | — |
| 1 | General | Unexpected error |
| 2 | Project | Not in project, project creation failed |
| 3 | Build | Eleventy build failed, config errors |
| 4 | Validation | YAML errors, schema validation |
| 5 | Output | PDF/EPUB generation, missing tools |
| 6 | Install | npm install, version not found |
| 130 | Signal | SIGINT (Ctrl-C) |
| 143 | Signal | SIGTERM |
