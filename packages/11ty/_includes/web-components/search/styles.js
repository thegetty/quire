import { css } from 'lit'

export const searchResultsListStyles = css`
  :host {

  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-family: var(--quire-primary-font, 'Noto Sans', sans-serif);
    margin: 1.5rem 0 0 0;
  }

  .result-link {
    width: fit-content;
    color: var(--accent-color, #CB3434);
    border-bottom: 1px dotted var(--accent-color, #CB3434);
    letter-spacing: 0px;
    text-decoration: none;
    &:hover {
      border-bottom: 1px solid var(--accent-color-hover, #a02a2a);
    }
    & * {
      color: var(--accent-color, #CB3434);
    }
  }

  .result-title {
    font-size: 1.25rem;
    line-height: 1.4;
    font-family: var(--quire-headings-font, 'IBM Plex Sans Condensed', sans-serif);
    text-transform: none;
    margin-bottom: .25em;
  }

  .result-meta {
    font-style: italic;
  }

  .result-item {
    display: flex;
    align-items: flex-start;
  }

  .result-item-content {
    flex: 1;
  }

  .result-item-content p {
    margin: 0 0 0.5rem 0;
  }

  .result-excerpt {
    margin: 0;
  }

  .result-item-image {
    margin-right: 1rem;
    margin-top: 0.25rem;
  }

  .result-item-image img {
    object-fit: contain;
    max-height: 6rem;
  }

  .subresults-item {
    margin: 1rem 0 0 0;
  }

  .subresults-item .result-link {
    display: block;
    margin-bottom: 0.25rem;
  }

  mark {
    background-color:#ff0;
    border-radius:2px;
    padding:0 2px;
    color:#000
  }
  `
