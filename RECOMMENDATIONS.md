
## Anti-patterns

- `eleventyConfig` is mutated everywhere
- plugin load order and hidden dependencies
- side-effects mutate shared state of collections

## Logging

Recommendation: standardize logger usage

## Component architecture

Recommendation: Consolidate around WebC for presentational components, keep Lit for interactive runtime needs.

Recommendation: Refactor component registration to single pattern.

Recommendation: Write a component development guide.

Recommendation: Establish clear guidelines - WebC for components, Liquid for page templates, 11ty.js for complex data manipulation.

Current architecture: Liquid templates + tagged template literals + WebC (for three interactive components). WebC adds complexity rather than reducing it; it is an Eleventy native feature that is not as mature as JSX or MDX, it requires additional technical skill.

The current template + component architecture works and is familiar to authors, however it has the following major short-commings:
- string concatenation in HTML is slow, brittle, and hinders composition
- no true component composition
- no type safety
- complex component registration is a hinderance to development

Recommendation: Gradual migration to convert components one-by-one to JSX without breaking existing content.

**MDX**

Pros:
✅ Native Eleventy support (first-class citizen in v3.0+)
✅ Direct component imports in content
✅ JSX syntax for components
✅ Component composition naturally
✅ Front matter support (data becomes props)
✅ Modern authoring (MDX is industry standard)
✅ Type safety possible (TypeScript)

Cons:
⚠️ Breaking change for authors (Liquid → MDX syntax)
⚠️ Dependencies: `@mdx-js/mdx`, `react-dom`, `react/jsx-runtime`
⚠️ Migration effort for existing content
⚠️ No Liquid preprocessing (different paradigm)

**JSX* + _Liquid_**

Pros:
✅ Non-breaking for content authors
✅ JSX for components (better DX)
✅ Gradual migration possible
✅ Keep Liquid familiarity

Cons:
⚠️ Custom infrastructure (not native)
⚠️ Wrapper complexity (render-to-string boilerplate)
⚠️ Two paradigms (Liquid + JSX)
⚠️ Components can't be imported in content

## IIIF images

Recommendation: Move to incremental processing, configurable separate build step for IIIF process.
  - implement caching for process images
  - make iiif processing incremental
  - implement worker threads for parallel processing

## Data

Recommendation: Break monolithic data file into domain-specific computed files using Eleventy's directory data pattern. Lazy-load expensive computations.

## Plugins

Recommendation: Make dependencies explicit, _add validation_, or _refactor to remove ordering constraints_.

## Testing

Recommendation: Add a comprehensive test suite before any major refactoring.


