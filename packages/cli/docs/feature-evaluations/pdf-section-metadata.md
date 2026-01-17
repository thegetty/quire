# Evaluation: Set PDF Sectional Doc Metadata

**TODO Location:** [split.js:33](../../src/lib/pdf/split.js#L33)

## What It Means

The TODO refers to adding PDF metadata to each split section when Quire generates individual chapter/section PDFs from the full publication PDF.

## Current Behavior

When `splitPdf()` creates a section PDF (e.g., `mybook-intro.pdf`), it:
1. Copies the full PDF document
2. Removes pages outside the section's range
3. Optionally inserts a cover page
4. Saves the result

**Problem**: The split PDF inherits the *full publication's* metadata (title, author, subject, etc.), which is incorrect for a section-level PDF.

## What Should Happen

Each sectional PDF should have its own metadata reflecting that specific section:

| Metadata Field | Source | Example Value |
|----------------|--------|---------------|
| `setTitle()` | Page/section title from pageMap | "Chapter 1: Introduction" |
| `setAuthor()` | `publication.contributor` | "Jane Doe" |
| `setSubject()` | Publication title + section context | "The Art of Venice - Chapter 1" |
| `setCreator()` | Fixed | "Quire" |
| `setProducer()` | Fixed | "pdf-lib via Quire CLI" |
| `setModificationDate()` | Current date | `new Date()` |

## Implementation Approach

Using [pdf-lib's metadata methods](https://pdf-lib.js.org/docs/api/classes/pdfdocument):

```javascript
// After: const sectionDoc = await pdfDoc.copy()

// Set section-specific metadata
const sectionTitle = pageConfig.title || sectionId
sectionDoc.setTitle(sectionTitle, { showInWindowTitleBar: true })
sectionDoc.setSubject(`${publicationTitle} - ${sectionTitle}`)
sectionDoc.setAuthor(publicationAuthor)
sectionDoc.setCreator('Quire')
sectionDoc.setProducer('pdf-lib via Quire CLI')
sectionDoc.setModificationDate(new Date())
```

## Effort & Priority

| Factor | Assessment |
|--------|------------|
| **Effort** | Low (10-20 lines of code) |
| **Impact** | Medium - improves UX when organizing/searching downloaded PDFs |
| **Risk** | Low - metadata is non-breaking, purely additive |
| **Dependencies** | Need access to page titles and publication metadata in `splitPdf()` |

## Recommendation

**Low priority enhancement**. The current behavior works - PDFs are generated correctly. This is a polish feature that would benefit users who download multiple section PDFs and want them properly labeled in their PDF readers.

The main challenge is that `splitPdf()` currently only receives `pageMap` with page ranges, not the rich metadata (section titles, publication info) needed. The function signature would need to accept additional metadata, or the pageMap structure would need to include title information.

## References

- [pdf-lib Documentation](https://pdf-lib.js.org/)
- [PDFDocument API - pdf-lib](https://pdf-lib.js.org/docs/api/classes/pdfdocument)
- [Set Document Metadata Example](https://jsfiddle.net/Hopding/vcwmfnbe/2/)
