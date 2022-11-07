module.exports = {
  name: 'style',
  attrs: {
    xmlns: 'http://purl.org/net/xbiblio/csl',
    class: 'in-text',
    version: '1.0',
    'demote-non-dropping-particle': 'never',
    'page-range-format': 'minimal-two',
  },
  children: [
    {
      name: 'info',
      attrs: {},
      children: [
        {
          name: 'title',
          attrs: {},
          children: ['Modern Language Association 9th edition'],
        },
        { name: 'title-short', attrs: {}, children: ['MLA'] },
        {
          name: 'id',
          attrs: {},
          children: [
            'http://www.zotero.org/styles/modern-language-association',
          ],
        },
        {
          name: 'link',
          attrs: {
            href: 'http://www.zotero.org/styles/modern-language-association',
            rel: 'self',
          },
          children: [],
        },
        {
          name: 'link',
          attrs: { href: 'http://style.mla.org', rel: 'documentation' },
          children: [],
        },
        {
          name: 'author',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Sebastian Karcher'] },
          ],
        },
        {
          name: 'category',
          attrs: { 'citation-format': 'author' },
          children: [],
        },
        { name: 'category', attrs: { field: 'generic-base' }, children: [] },
        {
          name: 'summary',
          attrs: {},
          children: [
            'This style adheres to the MLA 9th edition handbook. Follows the structure of references as outlined in the MLA Manual closely',
          ],
        },
        { name: 'updated', attrs: {}, children: ['2021-07-13T20:05:10+00:00'] },
        {
          name: 'rights',
          attrs: { license: 'http://creativecommons.org/licenses/by-sa/3.0/' },
          children: [
            'This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License',
          ],
        },
      ],
    },
    {
      name: 'locale',
      attrs: { 'xml:lang': 'en' },
      children: [
        {
          name: 'date',
          attrs: { form: 'text' },
          children: [
            {
              name: 'date-part',
              attrs: { name: 'day', suffix: ' ' },
              children: [],
            },
            {
              name: 'date-part',
              attrs: { name: 'month', suffix: ' ', form: 'short' },
              children: [],
            },
            { name: 'date-part', attrs: { name: 'year' }, children: [] },
          ],
        },
        {
          name: 'terms',
          attrs: {},
          children: [
            {
              name: 'term',
              attrs: { name: 'month-01', form: 'short' },
              children: ['Jan.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-02', form: 'short' },
              children: ['Feb.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-03', form: 'short' },
              children: ['Mar.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-04', form: 'short' },
              children: ['Apr.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-05', form: 'short' },
              children: ['May'],
            },
            {
              name: 'term',
              attrs: { name: 'month-06', form: 'short' },
              children: ['June'],
            },
            {
              name: 'term',
              attrs: { name: 'month-07', form: 'short' },
              children: ['July'],
            },
            {
              name: 'term',
              attrs: { name: 'month-08', form: 'short' },
              children: ['Aug.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-09', form: 'short' },
              children: ['Sept.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-10', form: 'short' },
              children: ['Oct.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-11', form: 'short' },
              children: ['Nov.'],
            },
            {
              name: 'term',
              attrs: { name: 'month-12', form: 'short' },
              children: ['Dec.'],
            },
            {
              name: 'term',
              attrs: { name: 'translator', form: 'short' },
              children: ['trans.'],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'author' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'author' },
          children: [
            {
              name: 'name',
              attrs: {
                'name-as-sort-order': 'first',
                and: 'text',
                'delimiter-precedes-last': 'always',
                'delimiter-precedes-et-al': 'always',
                initialize: 'false',
                'initialize-with': '. ',
              },
              children: [],
            },
            {
              name: 'label',
              attrs: { form: 'long', prefix: ', ' },
              children: [],
            },
            {
              name: 'substitute',
              attrs: {},
              children: [
                { name: 'names', attrs: { variable: 'editor' }, children: [] },
                {
                  name: 'names',
                  attrs: { variable: 'translator' },
                  children: [],
                },
                { name: 'text', attrs: { macro: 'title' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'author-short' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'names',
              attrs: { variable: 'author' },
              children: [
                {
                  name: 'name',
                  attrs: {
                    form: 'short',
                    'initialize-with': '. ',
                    and: 'text',
                  },
                  children: [],
                },
                {
                  name: 'substitute',
                  attrs: {},
                  children: [
                    {
                      name: 'names',
                      attrs: { variable: 'editor' },
                      children: [],
                    },
                    {
                      name: 'names',
                      attrs: { variable: 'translator' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { macro: 'title-short' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { disambiguate: 'true' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'title-short' },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'title' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'container-title', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    quotes: 'true',
                    'text-case': 'title',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'else',
              attrs: {},
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    'font-style': 'italic',
                    'text-case': 'title',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'title-short' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'container-title', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    form: 'short',
                    quotes: 'true',
                    'text-case': 'title',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'else',
              attrs: {},
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    form: 'short',
                    'font-style': 'italic',
                    'text-case': 'title',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'container-title' },
      children: [
        {
          name: 'text',
          attrs: {
            variable: 'container-title',
            'font-style': 'italic',
            'text-case': 'title',
          },
          children: [],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'other-contributors' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'container-title', match: 'any' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'names',
                      attrs: { variable: 'container-author', delimiter: ', ' },
                      children: [
                        {
                          name: 'label',
                          attrs: { form: 'verb', suffix: ' ' },
                          children: [],
                        },
                        { name: 'name', attrs: { and: 'text' }, children: [] },
                      ],
                    },
                    {
                      name: 'names',
                      attrs: { variable: 'editor translator', delimiter: ', ' },
                      children: [
                        {
                          name: 'label',
                          attrs: { form: 'verb', suffix: ' ' },
                          children: [],
                        },
                        { name: 'name', attrs: { and: 'text' }, children: [] },
                      ],
                    },
                    {
                      name: 'names',
                      attrs: {
                        variable: 'director illustrator interviewer',
                        delimiter: ', ',
                      },
                      children: [
                        {
                          name: 'label',
                          attrs: { form: 'verb', suffix: ' ' },
                          children: [],
                        },
                        { name: 'name', attrs: { and: 'text' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'else',
              attrs: {},
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'names',
                      attrs: { variable: 'container-author', delimiter: ', ' },
                      children: [
                        {
                          name: 'label',
                          attrs: {
                            form: 'verb',
                            suffix: ' ',
                            'text-case': 'capitalize-first',
                          },
                          children: [],
                        },
                        { name: 'name', attrs: { and: 'text' }, children: [] },
                      ],
                    },
                    {
                      name: 'names',
                      attrs: { variable: 'editor translator', delimiter: ', ' },
                      children: [
                        {
                          name: 'label',
                          attrs: {
                            form: 'verb',
                            suffix: ' ',
                            'text-case': 'capitalize-first',
                          },
                          children: [],
                        },
                        { name: 'name', attrs: { and: 'text' }, children: [] },
                      ],
                    },
                    {
                      name: 'names',
                      attrs: {
                        variable: 'director illustrator interviewer',
                        delimiter: ', ',
                      },
                      children: [
                        {
                          name: 'label',
                          attrs: {
                            form: 'verb',
                            suffix: ' ',
                            'text-case': 'capitalize-first',
                          },
                          children: [],
                        },
                        { name: 'name', attrs: { and: 'text' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'version' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { 'is-numeric': 'edition' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'number',
                          attrs: { variable: 'edition', form: 'ordinal' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { term: 'edition', form: 'short' },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'else',
                  attrs: {},
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'edition',
                        'text-case': 'capitalize-first',
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            { name: 'text', attrs: { variable: 'version' }, children: [] },
            { name: 'text', attrs: { variable: 'medium' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'volume-lowercase' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ' ' },
          children: [
            {
              name: 'text',
              attrs: { term: 'volume', form: 'short' },
              children: [],
            },
            { name: 'text', attrs: { variable: 'volume' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'number' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'group',
              attrs: {},
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        variable: 'edition container-title',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'volume-lowercase' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: { variable: 'author', match: 'all' },
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: {
                                variable:
                                  'editor translator container-author illustrator interviewer director',
                                match: 'any',
                              },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'volume-lowercase' },
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: { variable: 'editor', match: 'all' },
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: {
                                variable:
                                  'translator container-author illustrator interviewer director',
                                match: 'any',
                              },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'volume-lowercase' },
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: {
                        variable:
                          'container-author illustrator interviewer director',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'volume-lowercase' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'else',
                      attrs: {},
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ' ' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                term: 'volume',
                                form: 'short',
                                'text-case': 'capitalize-first',
                              },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'volume' },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'group',
              attrs: { delimiter: ' ' },
              children: [
                {
                  name: 'text',
                  attrs: { term: 'issue', form: 'short' },
                  children: [],
                },
                { name: 'text', attrs: { variable: 'issue' }, children: [] },
              ],
            },
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { type: 'report' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'genre' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            { name: 'text', attrs: { variable: 'number' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'publisher' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type: 'article-magazine article-newspaper article-journal',
                match: 'none',
              },
              children: [
                {
                  name: 'text',
                  attrs: { variable: 'publisher' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'publication-date' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type: 'book chapter paper-conference motion_picture',
                match: 'any',
              },
              children: [
                {
                  name: 'date',
                  attrs: {
                    variable: 'issued',
                    form: 'numeric',
                    'date-parts': 'year',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-journal', match: 'any' },
              children: [
                {
                  name: 'date',
                  attrs: {
                    variable: 'issued',
                    form: 'text',
                    'date-parts': 'year-month',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'speech', match: 'none' },
              children: [
                {
                  name: 'date',
                  attrs: { variable: 'issued', form: 'text' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'location' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'group',
              attrs: { delimiter: ' ' },
              children: [
                {
                  name: 'label',
                  attrs: { variable: 'page', form: 'short' },
                  children: [],
                },
                { name: 'text', attrs: { variable: 'page' }, children: [] },
              ],
            },
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { variable: 'source', match: 'none' },
                  children: [
                    { name: 'text', attrs: { macro: 'URI' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'container2-title' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { type: 'speech' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'event' },
                      children: [],
                    },
                    {
                      name: 'date',
                      attrs: { variable: 'event-date', form: 'text' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'event-place' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            { name: 'text', attrs: { variable: 'archive' }, children: [] },
            {
              name: 'text',
              attrs: { variable: 'archive-place' },
              children: [],
            },
            {
              name: 'text',
              attrs: { variable: 'archive_location' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'container2-location' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'source' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'DOI URL', match: 'any' },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ', ' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                variable: 'source',
                                'font-style': 'italic',
                              },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { macro: 'URI' },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'URI' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'DOI' },
              children: [
                {
                  name: 'text',
                  attrs: { variable: 'DOI', prefix: 'https://doi.org/' },
                  children: [],
                },
              ],
            },
            {
              name: 'else',
              attrs: {},
              children: [
                { name: 'text', attrs: { variable: 'URL' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'accessed' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'issued', match: 'none' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        term: 'accessed',
                        'text-case': 'capitalize-first',
                      },
                      children: [],
                    },
                    {
                      name: 'date',
                      attrs: { variable: 'accessed', form: 'text' },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'citation',
      attrs: {
        'et-al-min': '3',
        'et-al-use-first': '1',
        'disambiguate-add-names': 'true',
        'disambiguate-add-givenname': 'true',
      },
      children: [
        {
          name: 'layout',
          attrs: { prefix: '(', suffix: ')', delimiter: '; ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { locator: 'page line', match: 'any' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'author-short' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { variable: 'locator' },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'else',
                  attrs: {},
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ', ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'author-short' },
                          children: [],
                        },
                        {
                          name: 'group',
                          attrs: {},
                          children: [
                            {
                              name: 'label',
                              attrs: { variable: 'locator', form: 'short' },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'locator' },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'bibliography',
      attrs: {
        'hanging-indent': 'true',
        'et-al-min': '3',
        'et-al-use-first': '1',
        'line-spacing': '2',
        'entry-spacing': '0',
        'subsequent-author-substitute': '---',
      },
      children: [
        {
          name: 'sort',
          attrs: {},
          children: [
            { name: 'key', attrs: { macro: 'author' }, children: [] },
            { name: 'key', attrs: { variable: 'title' }, children: [] },
          ],
        },
        {
          name: 'layout',
          attrs: { suffix: '.' },
          children: [
            {
              name: 'group',
              attrs: { delimiter: '. ' },
              children: [
                { name: 'text', attrs: { macro: 'author' }, children: [] },
                { name: 'text', attrs: { macro: 'title' }, children: [] },
                {
                  name: 'date',
                  attrs: {
                    variable: 'original-date',
                    form: 'numeric',
                    'date-parts': 'year',
                  },
                  children: [],
                },
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'container-title' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { macro: 'other-contributors' },
                      children: [],
                    },
                    { name: 'text', attrs: { macro: 'version' }, children: [] },
                    { name: 'text', attrs: { macro: 'number' }, children: [] },
                    {
                      name: 'text',
                      attrs: { macro: 'publisher' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { macro: 'publication-date' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { macro: 'location' },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'container2-title' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { macro: 'container2-location' },
                      children: [],
                    },
                  ],
                },
                { name: 'text', attrs: { macro: 'accessed' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
  ],
}
