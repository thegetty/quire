module.exports = {
  name: 'style',
  attrs: {
    xmlns: 'http://purl.org/net/xbiblio/csl',
    class: 'note',
    version: '1.0',
    'demote-non-dropping-particle': 'display-and-sort',
    'page-range-format': 'chicago',
  },
  children: [
    {
      name: 'info',
      attrs: {},
      children: [
        {
          name: 'title',
          attrs: {},
          children: ['Chicago Manual of Style 17th edition (full note)'],
        },
        {
          name: 'id',
          attrs: {},
          children: [
            'http://www.zotero.org/styles/chicago-fullnote-bibliography',
          ],
        },
        {
          name: 'link',
          attrs: {
            href: 'http://www.zotero.org/styles/chicago-fullnote-bibliography',
            rel: 'self',
          },
          children: [],
        },
        {
          name: 'link',
          attrs: {
            href:
              'http://www.chicagomanualofstyle.org/tools_citationguide.html',
            rel: 'documentation',
          },
          children: [],
        },
        {
          name: 'author',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Julian Onions'] },
            { name: 'email', attrs: {}, children: ['julian.onions@gmail.com'] },
          ],
        },
        {
          name: 'contributor',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Simon Kornblith'] },
            { name: 'email', attrs: {}, children: ['simon@simonster.com'] },
          ],
        },
        {
          name: 'contributor',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Elena Razlogova'] },
            {
              name: 'email',
              attrs: {},
              children: ['elena.razlogova@gmail.com'],
            },
          ],
        },
        {
          name: 'contributor',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Frank Bennett'] },
            { name: 'email', attrs: {}, children: ['biercenator@gmail.com'] },
          ],
        },
        {
          name: 'contributor',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Andrew Dunning'] },
            {
              name: 'email',
              attrs: {},
              children: ['andrew.dunning@utoronto.ca'],
            },
          ],
        },
        {
          name: 'contributor',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Sebastian Karcher'] },
          ],
        },
        {
          name: 'contributor',
          attrs: {},
          children: [
            { name: 'name', attrs: {}, children: ['Brenton M. Wiernik'] },
          ],
        },
        {
          name: 'category',
          attrs: { 'citation-format': 'note' },
          children: [],
        },
        { name: 'category', attrs: { field: 'generic-base' }, children: [] },
        {
          name: 'summary',
          attrs: {},
          children: ['Chicago format with full notes and bibliography'],
        },
        { name: 'updated', attrs: {}, children: ['2017-10-12T12:00:00+00:00'] },
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
          name: 'terms',
          attrs: {},
          children: [
            {
              name: 'term',
              attrs: { name: 'editor', form: 'verb-short' },
              children: ['ed.'],
            },
            {
              name: 'term',
              attrs: { name: 'translator', form: 'verb-short' },
              children: ['trans.'],
            },
            {
              name: 'term',
              attrs: { name: 'translator', form: 'short' },
              children: ['trans.'],
            },
            {
              name: 'term',
              attrs: { name: 'editortranslator', form: 'verb-short' },
              children: ['ed. and trans.'],
            },
            {
              name: 'term',
              attrs: { name: 'editortranslator', form: 'verb' },
              children: ['Edited and translated by'],
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
      attrs: { name: 'editor-translator' },
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
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        variable: 'container-author reviewed-author',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'group',
                          attrs: {},
                          children: [
                            {
                              name: 'names',
                              attrs: {
                                variable: 'container-author reviewed-author',
                              },
                              children: [
                                {
                                  name: 'label',
                                  attrs: {
                                    form: 'verb-short',
                                    'text-case': 'lowercase',
                                    suffix: ' ',
                                  },
                                  children: [],
                                },
                                {
                                  name: 'name',
                                  attrs: { and: 'text', delimiter: ', ' },
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
            {
              name: 'names',
              attrs: { variable: 'editor translator', delimiter: ', ' },
              children: [
                {
                  name: 'label',
                  attrs: {
                    form: 'verb-short',
                    'text-case': 'lowercase',
                    suffix: ' ',
                  },
                  children: [],
                },
                {
                  name: 'name',
                  attrs: { and: 'text', delimiter: ', ' },
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
      attrs: { name: 'secondary-contributors-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'chapter entry-dictionary entry-encyclopedia paper-conference',
                match: 'none',
              },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'editor-translator' },
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
      attrs: { name: 'container-contributors-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'chapter entry-dictionary entry-encyclopedia paper-conference',
                match: 'any',
              },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'editor-translator' },
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
      attrs: { name: 'secondary-contributors' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'chapter entry-dictionary entry-encyclopedia paper-conference',
                match: 'none',
              },
              children: [
                {
                  name: 'names',
                  attrs: { variable: 'editor translator', delimiter: '. ' },
                  children: [
                    {
                      name: 'label',
                      attrs: {
                        form: 'verb',
                        'text-case': 'capitalize-first',
                        suffix: ' ',
                      },
                      children: [],
                    },
                    {
                      name: 'name',
                      attrs: { and: 'text', delimiter: ', ' },
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
      attrs: { name: 'container-contributors' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'chapter entry-dictionary entry-encyclopedia paper-conference',
                match: 'any',
              },
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
                          attrs: { variable: 'author' },
                          children: [
                            {
                              name: 'choose',
                              attrs: {},
                              children: [
                                {
                                  name: 'if',
                                  attrs: {
                                    variable: 'container-author',
                                    match: 'any',
                                  },
                                  children: [
                                    {
                                      name: 'names',
                                      attrs: { variable: 'container-author' },
                                      children: [
                                        {
                                          name: 'label',
                                          attrs: {
                                            form: 'verb-short',
                                            'text-case': 'lowercase',
                                            suffix: ' ',
                                          },
                                          children: [],
                                        },
                                        {
                                          name: 'name',
                                          attrs: {
                                            and: 'text',
                                            delimiter: ', ',
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
                              name: 'choose',
                              attrs: {},
                              children: [
                                {
                                  name: 'if',
                                  attrs: {
                                    variable: 'container-author author',
                                    match: 'all',
                                  },
                                  children: [
                                    {
                                      name: 'group',
                                      attrs: { delimiter: '. ' },
                                      children: [
                                        {
                                          name: 'text',
                                          attrs: { variable: 'page' },
                                          children: [],
                                        },
                                        {
                                          name: 'names',
                                          attrs: {
                                            variable: 'editor translator',
                                            delimiter: ', ',
                                          },
                                          children: [
                                            {
                                              name: 'label',
                                              attrs: {
                                                form: 'verb',
                                                suffix: ' ',
                                              },
                                              children: [],
                                            },
                                            {
                                              name: 'name',
                                              attrs: {
                                                and: 'text',
                                                delimiter: ', ',
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
                                  name: 'else',
                                  attrs: {},
                                  children: [
                                    {
                                      name: 'names',
                                      attrs: {
                                        variable: 'editor translator',
                                        delimiter: ', ',
                                      },
                                      children: [
                                        {
                                          name: 'label',
                                          attrs: {
                                            form: 'verb',
                                            'text-case': 'lowercase',
                                            suffix: ' ',
                                          },
                                          children: [],
                                        },
                                        {
                                          name: 'name',
                                          attrs: {
                                            and: 'text',
                                            delimiter: ', ',
                                          },
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
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'recipient-note' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'recipient', delimiter: ', ' },
          children: [
            {
              name: 'label',
              attrs: { form: 'verb', 'text-case': 'lowercase', suffix: ' ' },
              children: [],
            },
            {
              name: 'name',
              attrs: { and: 'text', delimiter: ', ' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'contributors-note' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ' ' },
          children: [
            {
              name: 'names',
              attrs: { variable: 'author' },
              children: [
                {
                  name: 'name',
                  attrs: {
                    and: 'text',
                    'sort-separator': ', ',
                    delimiter: ', ',
                  },
                  children: [],
                },
                {
                  name: 'label',
                  attrs: { form: 'short', prefix: ', ' },
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
                  ],
                },
              ],
            },
            { name: 'text', attrs: { macro: 'recipient-note' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'editor' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'editor' },
          children: [
            {
              name: 'name',
              attrs: {
                'name-as-sort-order': 'first',
                and: 'text',
                'sort-separator': ', ',
                delimiter: ', ',
                'delimiter-precedes-last': 'always',
              },
              children: [],
            },
            {
              name: 'label',
              attrs: { form: 'short', prefix: ', ' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'translator' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'translator' },
          children: [
            {
              name: 'name',
              attrs: {
                'name-as-sort-order': 'first',
                and: 'text',
                'sort-separator': ', ',
                delimiter: ', ',
                'delimiter-precedes-last': 'always',
              },
              children: [],
            },
            {
              name: 'label',
              attrs: { form: 'verb-short', prefix: ', ' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'recipient' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ' ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { type: 'personal_communication' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { variable: 'genre' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                variable: 'genre',
                                'text-case': 'capitalize-first',
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
                                term: 'letter',
                                'text-case': 'capitalize-first',
                              },
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
            { name: 'text', attrs: { macro: 'recipient-note' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'contributors' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: '. ' },
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
                    'sort-separator': ', ',
                    delimiter: ', ',
                    'delimiter-precedes-last': 'always',
                  },
                  children: [],
                },
                {
                  name: 'substitute',
                  attrs: {},
                  children: [
                    { name: 'text', attrs: { macro: 'editor' }, children: [] },
                    {
                      name: 'text',
                      attrs: { macro: 'translator' },
                      children: [],
                    },
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: {
                            type:
                              'article-magazine article-newspaper webpage post-weblog',
                            match: 'any',
                          },
                          children: [
                            {
                              name: 'text',
                              attrs: { variable: 'container-title' },
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
            { name: 'text', attrs: { macro: 'recipient' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'recipient-short' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'recipient' },
          children: [
            {
              name: 'label',
              attrs: { form: 'verb', 'text-case': 'lowercase', suffix: ' ' },
              children: [],
            },
            {
              name: 'name',
              attrs: { form: 'short', and: 'text', delimiter: ', ' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'contributors-short' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ' ' },
          children: [
            {
              name: 'names',
              attrs: { variable: 'author' },
              children: [
                {
                  name: 'name',
                  attrs: { form: 'short', and: 'text', delimiter: ', ' },
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
                  ],
                },
              ],
            },
            { name: 'text', attrs: { macro: 'recipient-short' }, children: [] },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'contributors-sort' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'author' },
          children: [
            {
              name: 'name',
              attrs: {
                'name-as-sort-order': 'all',
                and: 'text',
                'sort-separator': ', ',
                delimiter: ', ',
                'delimiter-precedes-last': 'always',
              },
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
      attrs: { name: 'interviewer-note' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'interviewer', delimiter: ', ' },
          children: [
            {
              name: 'label',
              attrs: { form: 'verb', 'text-case': 'lowercase', suffix: ' ' },
              children: [],
            },
            {
              name: 'name',
              attrs: { and: 'text', delimiter: ', ' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'interviewer' },
      children: [
        {
          name: 'names',
          attrs: { variable: 'interviewer', delimiter: ', ' },
          children: [
            {
              name: 'label',
              attrs: {
                form: 'verb',
                'text-case': 'capitalize-first',
                suffix: ' ',
              },
              children: [],
            },
            {
              name: 'name',
              attrs: { and: 'text', delimiter: ', ' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'title-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'title', match: 'none' },
              children: [
                { name: 'text', attrs: { variable: 'genre' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: {
                type: 'book graphic map motion_picture song',
                match: 'any',
              },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    'text-case': 'title',
                    'font-style': 'italic',
                  },
                  children: [],
                },
                {
                  name: 'group',
                  attrs: { delimiter: ' ', prefix: ', ' },
                  children: [
                    { name: 'text', attrs: { term: 'version' }, children: [] },
                    {
                      name: 'text',
                      attrs: { variable: 'version' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'legal_case interview patent', match: 'any' },
              children: [
                { name: 'text', attrs: { variable: 'title' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { variable: 'reviewed-author' },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    'font-style': 'italic',
                    prefix: 'review of ',
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
                    'text-case': 'title',
                    quotes: 'true',
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
      attrs: { name: 'title' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'title', match: 'none' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { type: 'personal_communication', match: 'none' },
                      children: [
                        {
                          name: 'text',
                          attrs: {
                            variable: 'genre',
                            'text-case': 'capitalize-first',
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
              name: 'else-if',
              attrs: { type: 'book graphic motion_picture song', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    'text-case': 'title',
                    'font-style': 'italic',
                  },
                  children: [],
                },
                {
                  name: 'group',
                  attrs: { prefix: ' (', suffix: ')', delimiter: ' ' },
                  children: [
                    { name: 'text', attrs: { term: 'version' }, children: [] },
                    {
                      name: 'text',
                      attrs: { variable: 'version' },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { variable: 'reviewed-author' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'title',
                        'font-style': 'italic',
                        prefix: 'Review of ',
                      },
                      children: [],
                    },
                    {
                      name: 'names',
                      attrs: { variable: 'reviewed-author' },
                      children: [
                        {
                          name: 'label',
                          attrs: {
                            form: 'verb-short',
                            'text-case': 'lowercase',
                            suffix: ' ',
                          },
                          children: [],
                        },
                        {
                          name: 'name',
                          attrs: { and: 'text', delimiter: ', ' },
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
                type: 'bill legislation legal_case interview patent',
                match: 'any',
              },
              children: [
                { name: 'text', attrs: { variable: 'title' }, children: [] },
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
                    'text-case': 'title',
                    quotes: 'true',
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
              attrs: { variable: 'title', match: 'none' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { type: 'interview' },
                      children: [
                        {
                          name: 'text',
                          attrs: { term: 'interview' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: { type: 'manuscript speech', match: 'any' },
                      children: [
                        {
                          name: 'text',
                          attrs: { variable: 'genre', form: 'short' },
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
              attrs: { type: 'book graphic motion_picture song', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    'text-case': 'title',
                    form: 'short',
                    'font-style': 'italic',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: {
                type: 'legal_case',
                variable: 'title-short',
                match: 'all',
              },
              children: [
                {
                  name: 'text',
                  attrs: {
                    variable: 'title',
                    'font-style': 'italic',
                    form: 'short',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'patent interview', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: { variable: 'title', form: 'short' },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'legal_case bill legislation', match: 'any' },
              children: [
                { name: 'text', attrs: { variable: 'title' }, children: [] },
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
                    'text-case': 'title',
                    form: 'short',
                    quotes: 'true',
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
      attrs: { name: 'date-disambiguate' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                disambiguate: 'true',
                type: 'personal_communication',
                match: 'any',
              },
              children: [
                { name: 'text', attrs: { macro: 'issued' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'description-note' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'text',
              attrs: { macro: 'interviewer-note' },
              children: [],
            },
            { name: 'text', attrs: { variable: 'medium' }, children: [] },
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { variable: 'title', match: 'none' },
                  children: [],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'manuscript thesis speech', match: 'any' },
                  children: [],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'patent' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { variable: 'authority' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { variable: 'number' },
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
                      attrs: { variable: 'genre' },
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
                  attrs: { type: 'map' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'scale' },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'graphic' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'dimensions' },
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
      attrs: { name: 'description' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'group',
              attrs: { delimiter: '. ' },
              children: [
                { name: 'text', attrs: { macro: 'interviewer' }, children: [] },
                {
                  name: 'text',
                  attrs: {
                    variable: 'medium',
                    'text-case': 'capitalize-first',
                  },
                  children: [],
                },
              ],
            },
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { variable: 'title', match: 'none' },
                  children: [],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'thesis speech', match: 'any' },
                  children: [],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'patent' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { variable: 'authority' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { variable: 'number' },
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
                        variable: 'genre',
                        'text-case': 'capitalize-first',
                      },
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
                  attrs: { type: 'map' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'scale' },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'graphic' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'dimensions' },
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
      attrs: { name: 'container-title-note' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ' ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: {
                    type:
                      'chapter entry-dictionary entry-encyclopedia paper-conference',
                    match: 'any',
                  },
                  children: [
                    { name: 'text', attrs: { term: 'in' }, children: [] },
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
                  attrs: { type: 'webpage' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'container-title' },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'post-weblog' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'container-title',
                        'text-case': 'title',
                        'font-style': 'italic',
                        suffix: ' (blog)',
                      },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'bill legislation legal_case', match: 'none' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'container-title',
                        'text-case': 'title',
                        'font-style': 'italic',
                      },
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
      attrs: { name: 'container-title' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ' ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: {
                    type:
                      'chapter entry-dictionary entry-encyclopedia paper-conference',
                    match: 'any',
                  },
                  children: [
                    {
                      name: 'text',
                      attrs: { term: 'in', 'text-case': 'capitalize-first' },
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
                  attrs: { type: 'webpage' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'container-title' },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'post-weblog' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'container-title',
                        'text-case': 'title',
                        'font-style': 'italic',
                        suffix: ' (blog)',
                      },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: { type: 'bill legislation legal_case', match: 'none' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'container-title',
                        'text-case': 'title',
                        'font-style': 'italic',
                      },
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
      attrs: { name: 'collection-title' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { match: 'none', type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        match: 'none',
                        'is-numeric': 'collection-number',
                      },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ', ' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                variable: 'collection-title',
                                'text-case': 'title',
                              },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'collection-number' },
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
                          attrs: { delimiter: ' ' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                variable: 'collection-title',
                                'text-case': 'title',
                              },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'collection-number' },
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
      attrs: { name: 'collection-title-journal' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'collection-title' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'collection-number' },
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
      attrs: { name: 'edition-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'book chapter graphic motion_picture paper-conference report song',
                match: 'any',
              },
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
                          attrs: { variable: 'edition' },
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
    {
      name: 'macro',
      attrs: { name: 'edition' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'book chapter graphic motion_picture paper-conference report song',
                match: 'any',
              },
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
                            suffix: '.',
                          },
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
    {
      name: 'macro',
      attrs: { name: 'locators-note-join-with-space' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type: 'article-journal',
                variable: 'volume',
                match: 'all',
              },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { match: 'none', variable: 'collection-title' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'locators-note' },
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
    {
      name: 'macro',
      attrs: { name: 'locators-note-join-with-comma' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal', match: 'none' },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'locators-note' },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'volume', match: 'none' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'locators-note' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: { match: 'any', variable: 'collection-title' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'locators-note' },
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
    {
      name: 'macro',
      attrs: { name: 'locators-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'collection-title-journal' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'volume' },
                      children: [],
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
                        {
                          name: 'text',
                          attrs: { variable: 'issue' },
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
              attrs: { type: 'bill legislation legal_case', match: 'any' },
              children: [
                { name: 'text', attrs: { macro: 'legal-cites' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: {
                type:
                  'book chapter graphic motion_picture paper-conference report song',
                match: 'any',
              },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'edition-note' },
                      children: [],
                    },
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { term: 'volume', form: 'short' },
                          children: [],
                        },
                        {
                          name: 'number',
                          attrs: { variable: 'volume', form: 'numeric' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { variable: 'locator', match: 'none' },
                          children: [
                            {
                              name: 'group',
                              attrs: { delimiter: ' ' },
                              children: [
                                {
                                  name: 'number',
                                  attrs: {
                                    variable: 'number-of-volumes',
                                    form: 'numeric',
                                  },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: {
                                    term: 'volume',
                                    form: 'short',
                                    plural: 'true',
                                  },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'legal-cites' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'legal_case', match: 'any' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { variable: 'container-title' },
                          children: [
                            {
                              name: 'text',
                              attrs: { variable: 'volume' },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'container-title' },
                              children: [],
                            },
                            {
                              name: 'group',
                              attrs: { delimiter: ' ' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { term: 'section', form: 'symbol' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'section' },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'page' },
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
                              attrs: { variable: 'number', prefix: 'No. ' },
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
              name: 'else-if',
              attrs: { type: 'bill legislation', match: 'any' },
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
                          attrs: { variable: 'number' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                variable: 'number',
                                prefix: 'Pub. L. No. ',
                              },
                              children: [],
                            },
                            {
                              name: 'group',
                              attrs: { delimiter: ' ' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { term: 'section', form: 'symbol' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'section' },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'group',
                              attrs: { delimiter: ' ' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { variable: 'volume' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'container-title' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'page-first' },
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
                              attrs: { delimiter: ' ' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { variable: 'volume' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'container-title' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { term: 'section', form: 'symbol' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'section' },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'locators-join-with-space' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type: 'article-journal',
                variable: 'volume',
                match: 'all',
              },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { match: 'none', variable: 'collection-title' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'locators' },
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
    {
      name: 'macro',
      attrs: { name: 'locators-join-with-comma' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type: 'bill chapter legislation legal_case paper-conference',
                match: 'any',
              },
              children: [
                { name: 'text', attrs: { macro: 'locators' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'volume', match: 'none' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'locators' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: { match: 'any', variable: 'collection-title' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'locators' },
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
    {
      name: 'macro',
      attrs: { name: 'locators-join-with-period' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'bill legislation legal_case article-journal chapter paper-conference',
                match: 'none',
              },
              children: [
                { name: 'text', attrs: { macro: 'locators' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'locators' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'collection-title-journal' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'volume' },
                      children: [],
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
                        {
                          name: 'text',
                          attrs: { variable: 'issue' },
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
              attrs: { type: 'bill legislation legal_case', match: 'any' },
              children: [
                { name: 'text', attrs: { macro: 'legal-cites' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: {
                type: 'book graphic motion_picture report song',
                match: 'any',
              },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: '. ' },
                  children: [
                    { name: 'text', attrs: { macro: 'edition' }, children: [] },
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
                          name: 'number',
                          attrs: { variable: 'volume', form: 'numeric' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'number',
                          attrs: {
                            variable: 'number-of-volumes',
                            form: 'numeric',
                          },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: {
                            term: 'volume',
                            form: 'short',
                            plural: 'true',
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
              name: 'else-if',
              attrs: {
                type:
                  'chapter entry-dictionary entry-encyclopedia paper-conference',
                match: 'any',
              },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: '. ' },
                  children: [
                    { name: 'text', attrs: { macro: 'edition' }, children: [] },
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { variable: 'page', match: 'none' },
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
                                  name: 'number',
                                  attrs: {
                                    variable: 'volume',
                                    form: 'numeric',
                                  },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'locators-newspaper' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-newspaper' },
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
                          name: 'number',
                          attrs: { variable: 'edition' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { term: 'edition' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { term: 'section', form: 'short' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { variable: 'section' },
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
    {
      name: 'macro',
      attrs: { name: 'event-note' },
      children: [{ name: 'text', attrs: { variable: 'event' }, children: [] }],
    },
    {
      name: 'macro',
      attrs: { name: 'event' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'title' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { variable: 'genre' },
                          children: [
                            {
                              name: 'text',
                              attrs: { term: 'presented at' },
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
                                term: 'presented at',
                                'text-case': 'capitalize-first',
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'event' },
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
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        term: 'presented at',
                        'text-case': 'capitalize-first',
                      },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'event' },
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
      attrs: { name: 'originally-published' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: ', ' },
          children: [
            {
              name: 'group',
              attrs: { delimiter: ': ' },
              children: [
                {
                  name: 'text',
                  attrs: { variable: 'original-publisher-place' },
                  children: [],
                },
                {
                  name: 'text',
                  attrs: { variable: 'original-publisher' },
                  children: [],
                },
              ],
            },
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { 'is-uncertain-date': 'original-date' },
                  children: [
                    {
                      name: 'date',
                      attrs: {
                        variable: 'original-date',
                        form: 'numeric',
                        'date-parts': 'year',
                        prefix: '[',
                        suffix: '?]',
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
                      name: 'date',
                      attrs: {
                        variable: 'original-date',
                        form: 'numeric',
                        'date-parts': 'year',
                      },
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
      attrs: { name: 'reprint-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'original-date issued', match: 'all' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        variable: 'original-publisher original-publisher-place',
                        match: 'none',
                      },
                      children: [
                        {
                          name: 'text',
                          attrs: { value: 'repr.' },
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
    {
      name: 'macro',
      attrs: { name: 'reprint' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'original-date issued', match: 'all' },
              children: [
                {
                  name: 'text',
                  attrs: { value: 'reprint', 'text-case': 'capitalize-first' },
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
      attrs: { name: 'publisher' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'thesis' },
              children: [
                {
                  name: 'text',
                  attrs: { variable: 'publisher' },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'speech' },
              children: [
                {
                  name: 'text',
                  attrs: { variable: 'event-place' },
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
                  attrs: { delimiter: ': ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'publisher-place' },
                      children: [],
                    },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'issued' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'issued' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { type: 'legal_case' },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ' ' },
                          children: [
                            {
                              name: 'text',
                              attrs: { variable: 'authority' },
                              children: [],
                            },
                            {
                              name: 'choose',
                              attrs: {},
                              children: [
                                {
                                  name: 'if',
                                  attrs: {
                                    variable: 'container-title',
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
                                  name: 'else',
                                  attrs: {},
                                  children: [
                                    {
                                      name: 'date',
                                      attrs: {
                                        variable: 'issued',
                                        form: 'text',
                                      },
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
                      name: 'else-if',
                      attrs: {
                        type:
                          'book bill chapter  legislation motion_picture paper-conference song thesis',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { 'is-uncertain-date': 'issued' },
                              children: [
                                {
                                  name: 'date',
                                  attrs: {
                                    variable: 'issued',
                                    form: 'numeric',
                                    'date-parts': 'year',
                                    prefix: '[',
                                    suffix: '?]',
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
                          ],
                        },
                      ],
                    },
                    {
                      name: 'else-if',
                      attrs: { type: 'patent' },
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
                                  name: 'text',
                                  attrs: { value: 'filed' },
                                  children: [],
                                },
                                {
                                  name: 'date',
                                  attrs: {
                                    variable: 'submitted',
                                    form: 'text',
                                  },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'group',
                              attrs: { delimiter: ' ' },
                              children: [
                                {
                                  name: 'choose',
                                  attrs: {},
                                  children: [
                                    {
                                      name: 'if',
                                      attrs: {
                                        variable: 'issued submitted',
                                        match: 'all',
                                      },
                                      children: [
                                        {
                                          name: 'text',
                                          attrs: { term: 'and' },
                                          children: [],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  name: 'text',
                                  attrs: { value: 'issued' },
                                  children: [],
                                },
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
                      name: 'else',
                      attrs: {},
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { 'is-uncertain-date': 'issued' },
                              children: [
                                {
                                  name: 'date',
                                  attrs: {
                                    variable: 'issued',
                                    form: 'text',
                                    prefix: '[',
                                    suffix: '?]',
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
                  ],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { variable: 'status' },
              children: [
                { name: 'text', attrs: { variable: 'status' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { variable: 'accessed URL', match: 'all' },
              children: [],
            },
            {
              name: 'else',
              attrs: {},
              children: [
                {
                  name: 'text',
                  attrs: { term: 'no date', form: 'short' },
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
      attrs: { name: 'point-locators-subsequent' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'legal_case', variable: 'locator', match: 'all' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { locator: 'page' },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ':' },
                          children: [
                            {
                              name: 'text',
                              attrs: { variable: 'volume' },
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
                          attrs: { delimiter: ' ' },
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
            {
              name: 'else-if',
              attrs: { variable: 'locator' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { locator: 'page', match: 'none' },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ' ' },
                          children: [
                            {
                              name: 'choose',
                              attrs: {},
                              children: [
                                {
                                  name: 'if',
                                  attrs: {
                                    type:
                                      'book graphic motion_picture report song',
                                    match: 'any',
                                  },
                                  children: [
                                    {
                                      name: 'choose',
                                      attrs: {},
                                      children: [
                                        {
                                          name: 'if',
                                          attrs: { variable: 'volume' },
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
                                                      name: 'text',
                                                      attrs: {
                                                        term: 'volume',
                                                        form: 'short',
                                                      },
                                                      children: [],
                                                    },
                                                    {
                                                      name: 'number',
                                                      attrs: {
                                                        variable: 'volume',
                                                        form: 'numeric',
                                                      },
                                                      children: [],
                                                    },
                                                  ],
                                                },
                                                {
                                                  name: 'label',
                                                  attrs: {
                                                    variable: 'locator',
                                                    form: 'short',
                                                  },
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
                                              name: 'label',
                                              attrs: {
                                                variable: 'locator',
                                                form: 'short',
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
                                  name: 'else',
                                  attrs: {},
                                  children: [
                                    {
                                      name: 'label',
                                      attrs: {
                                        variable: 'locator',
                                        form: 'short',
                                      },
                                      children: [],
                                    },
                                  ],
                                },
                              ],
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
                      name: 'else-if',
                      attrs: {
                        type: 'book graphic motion_picture report song',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ':' },
                          children: [
                            {
                              name: 'number',
                              attrs: { variable: 'volume', form: 'numeric' },
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
    {
      name: 'macro',
      attrs: { name: 'point-locators-join-with-colon' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'locator page', match: 'any' },
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { variable: 'volume issue', match: 'any' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'point-locators' },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'point-locators-join-with-comma' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal', match: 'none' },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'point-locators' },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { variable: 'volume issue', match: 'none' },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'point-locators' },
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
      attrs: { name: 'point-locators' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { variable: 'locator', match: 'none' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        type: 'article-journal chapter paper-conference',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'text',
                          attrs: { variable: 'page' },
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
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { locator: 'page', match: 'none' },
                          children: [
                            {
                              name: 'label',
                              attrs: {
                                variable: 'locator',
                                form: 'short',
                                suffix: ' ',
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
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
            { name: 'else-if', attrs: { type: 'legal_case' }, children: [] },
            {
              name: 'else',
              attrs: {},
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { locator: 'page', match: 'none' },
                          children: [
                            {
                              name: 'label',
                              attrs: { variable: 'locator', form: 'short' },
                              children: [],
                            },
                          ],
                        },
                      ],
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
    {
      name: 'macro',
      attrs: { name: 'locators-chapter' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'chapter entry-dictionary entry-encyclopedia paper-conference',
                match: 'any',
              },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        variable: 'author container-author',
                        match: 'all',
                      },
                      children: [],
                    },
                    {
                      name: 'else',
                      attrs: {},
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { variable: 'page' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { variable: 'volume', suffix: ':' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { variable: 'page' },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'locators-journal-join-with-colon' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'volume issue', match: 'any' },
                      children: [
                        {
                          name: 'text',
                          attrs: { variable: 'page' },
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
    {
      name: 'macro',
      attrs: { name: 'locators-journal-join-with-comma' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'volume issue', match: 'none' },
                      children: [
                        {
                          name: 'text',
                          attrs: { variable: 'page' },
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
    {
      name: 'macro',
      attrs: { name: 'archive-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'thesis' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'archive' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: {
                        variable: 'archive_location',
                        prefix: '(',
                        suffix: ')',
                      },
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
                      attrs: { variable: 'archive_location' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'archive' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'archive-place' },
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
      attrs: { name: 'archive' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'thesis' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'archive' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: {
                        variable: 'archive_location',
                        prefix: '(',
                        suffix: ')',
                      },
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
                  attrs: { delimiter: '. ' },
                  children: [
                    {
                      name: 'text',
                      attrs: {
                        variable: 'archive_location',
                        'text-case': 'capitalize-first',
                      },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'archive' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'archive-place' },
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
      attrs: { name: 'issue-note-join-with-space' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'article-journal bill legislation legal_case manuscript thesis',
                variable: 'publisher-place event-place publisher',
                match: 'any',
              },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { type: 'article-newspaper', match: 'none' },
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { type: 'article-journal', match: 'none' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'issue-note' },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'else-if',
                              attrs: { variable: 'issue volume', match: 'any' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'issue-note' },
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
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'issue-note-join-with-comma' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type:
                  'article-journal bill legislation legal_case manuscript speech thesis',
                variable: 'publisher-place publisher',
                match: 'none',
              },
              children: [
                { name: 'text', attrs: { macro: 'issue-note' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-newspaper' },
              children: [
                { name: 'text', attrs: { macro: 'issue-note' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'volume issue', match: 'none' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issue-note' },
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
    {
      name: 'macro',
      attrs: { name: 'issue-map-graphic' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'graphic map', match: 'any' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        variable: 'publisher publisher-place',
                        match: 'none',
                      },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issued' },
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
    {
      name: 'macro',
      attrs: { name: 'issue-note' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'bill legislation legal_case', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'issued', prefix: '(', suffix: ')' },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'volume issue', match: 'any' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issued', prefix: '(', suffix: ')' },
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
                          attrs: { macro: 'issued' },
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
              attrs: { type: 'article-newspaper' },
              children: [
                { name: 'text', attrs: { macro: 'issued' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'manuscript thesis speech', match: 'any' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ', ', prefix: '(', suffix: ')' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { variable: 'title', match: 'any' },
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
                    {
                      name: 'text',
                      attrs: { variable: 'event' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'event-place' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'publisher' },
                      children: [],
                    },
                    { name: 'text', attrs: { macro: 'issued' }, children: [] },
                  ],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: {
                variable: 'publisher-place event-place publisher',
                match: 'any',
              },
              children: [
                {
                  name: 'group',
                  attrs: { prefix: '(', suffix: ')', delimiter: ', ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'event-note' },
                      children: [],
                    },
                    {
                      name: 'group',
                      attrs: { delimiter: '; ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'originally-published' },
                          children: [],
                        },
                        {
                          name: 'group',
                          attrs: { delimiter: ', ' },
                          children: [
                            {
                              name: 'text',
                              attrs: { macro: 'reprint-note' },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { macro: 'publisher' },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    { name: 'text', attrs: { macro: 'issued' }, children: [] },
                  ],
                },
              ],
            },
            {
              name: 'else',
              attrs: {},
              children: [
                { name: 'text', attrs: { macro: 'issued' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'issue-join-with-space' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'article-journal', match: 'any' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'issue volume', match: 'any' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issue' },
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
              attrs: { type: 'bill legislation legal_case', match: 'any' },
              children: [
                { name: 'text', attrs: { macro: 'issue' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'issue-join-with-period' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: {
                type: 'article-journal bill legislation legal_case',
                match: 'none',
              },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: {
                        type: 'speech',
                        variable: 'publisher publisher-place',
                        match: 'any',
                      },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issue' },
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
    {
      name: 'macro',
      attrs: { name: 'issue-join-with-comma' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'bill legislation legal_case', match: 'none' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { type: 'article-journal', match: 'none' },
                      children: [
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: {
                                type: 'speech',
                                variable: 'publisher publisher-place',
                                match: 'none',
                              },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'issue' },
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
                      attrs: { variable: 'volume issue', match: 'none' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issue' },
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
    {
      name: 'macro',
      attrs: { name: 'issue' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'bill legislation legal_case', match: 'any' },
              children: [
                {
                  name: 'text',
                  attrs: { macro: 'issued', prefix: '(', suffix: ')' },
                  children: [],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-journal' },
              children: [
                {
                  name: 'choose',
                  attrs: {},
                  children: [
                    {
                      name: 'if',
                      attrs: { variable: 'issue volume', match: 'any' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'issued', prefix: '(', suffix: ')' },
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
                          attrs: { macro: 'issued' },
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
              attrs: { type: 'speech' },
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
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { variable: 'title', match: 'none' },
                              children: [],
                            },
                            {
                              name: 'else',
                              attrs: {},
                              children: [
                                {
                                  name: 'text',
                                  attrs: {
                                    variable: 'genre',
                                    'text-case': 'capitalize-first',
                                  },
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: 'text',
                          attrs: { macro: 'event' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'event-place' },
                      children: [],
                    },
                    { name: 'text', attrs: { macro: 'issued' }, children: [] },
                  ],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'article-newspaper' },
              children: [
                { name: 'text', attrs: { macro: 'issued' }, children: [] },
              ],
            },
            {
              name: 'else-if',
              attrs: { variable: 'publisher-place publisher', match: 'any' },
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
                          attrs: { type: 'thesis' },
                          children: [
                            {
                              name: 'text',
                              attrs: {
                                variable: 'genre',
                                'text-case': 'capitalize-first',
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'group',
                      attrs: { delimiter: '. ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'originally-published' },
                          children: [],
                        },
                        {
                          name: 'group',
                          attrs: { delimiter: ', ' },
                          children: [
                            {
                              name: 'text',
                              attrs: { macro: 'reprint' },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { macro: 'publisher' },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    { name: 'text', attrs: { macro: 'issued' }, children: [] },
                  ],
                },
              ],
            },
            {
              name: 'else-if',
              attrs: { type: 'graphic map', match: 'none' },
              children: [
                { name: 'text', attrs: { macro: 'issued' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'macro',
      attrs: { name: 'access-note' },
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
                  attrs: { type: 'graphic report', match: 'any' },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'archive-note' },
                      children: [],
                    },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: {
                    type:
                      'article-journal bill book chapter legal_case legislation motion_picture paper-conference',
                    match: 'none',
                  },
                  children: [
                    {
                      name: 'text',
                      attrs: { macro: 'archive-note' },
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
                  attrs: { variable: 'issued', match: 'none' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ' ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { term: 'accessed' },
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
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { type: 'legal_case', match: 'none' },
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
                              attrs: {
                                variable: 'DOI',
                                prefix: 'https://doi.org/',
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
                              attrs: { variable: 'URL' },
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
      attrs: { name: 'access' },
      children: [
        {
          name: 'group',
          attrs: { delimiter: '. ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { type: 'graphic report', match: 'any' },
                  children: [
                    { name: 'text', attrs: { macro: 'archive' }, children: [] },
                  ],
                },
                {
                  name: 'else-if',
                  attrs: {
                    type:
                      'article-journal bill book chapter legal_case legislation motion_picture paper-conference',
                    match: 'none',
                  },
                  children: [
                    { name: 'text', attrs: { macro: 'archive' }, children: [] },
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
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { type: 'legal_case', match: 'none' },
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
                              attrs: {
                                variable: 'DOI',
                                prefix: 'https://doi.org/',
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
                              attrs: { variable: 'URL' },
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
      attrs: { name: 'case-locator-subsequent' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'legal_case' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'text',
                      attrs: { variable: 'volume' },
                      children: [],
                    },
                    {
                      name: 'text',
                      attrs: { variable: 'container-title' },
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
      attrs: { name: 'case-pinpoint-subsequent' },
      children: [
        {
          name: 'choose',
          attrs: {},
          children: [
            {
              name: 'if',
              attrs: { type: 'legal_case' },
              children: [
                {
                  name: 'group',
                  attrs: { delimiter: ' ' },
                  children: [
                    {
                      name: 'choose',
                      attrs: {},
                      children: [
                        {
                          name: 'if',
                          attrs: { locator: 'page' },
                          children: [
                            {
                              name: 'text',
                              attrs: { term: 'at' },
                              children: [],
                            },
                            {
                              name: 'text',
                              attrs: { variable: 'locator' },
                              children: [],
                            },
                          ],
                        },
                        {
                          name: 'else',
                          attrs: {},
                          children: [
                            {
                              name: 'label',
                              attrs: { variable: 'locator' },
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
      name: 'citation',
      attrs: {
        'et-al-min': '4',
        'et-al-use-first': '1',
        'disambiguate-add-names': 'true',
      },
      children: [
        {
          name: 'layout',
          attrs: { suffix: '.', delimiter: '; ' },
          children: [
            {
              name: 'choose',
              attrs: {},
              children: [
                {
                  name: 'if',
                  attrs: { position: 'ibid ibid-with-locator', match: 'any' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ', ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'contributors-short' },
                          children: [],
                        },
                        {
                          name: 'group',
                          attrs: { delimiter: ' ' },
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
                                      attrs: {
                                        variable: 'author editor translator',
                                        match: 'none',
                                      },
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
                                {
                                  name: 'text',
                                  attrs: { macro: 'case-locator-subsequent' },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'text',
                              attrs: { macro: 'case-pinpoint-subsequent' },
                              children: [],
                            },
                          ],
                        },
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { match: 'none', type: 'legal_case' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'point-locators-subsequent' },
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
                  name: 'else-if',
                  attrs: { position: 'subsequent' },
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ', ' },
                      children: [
                        {
                          name: 'text',
                          attrs: { macro: 'contributors-short' },
                          children: [],
                        },
                        {
                          name: 'group',
                          attrs: { delimiter: ' ' },
                          children: [
                            {
                              name: 'group',
                              attrs: { delimiter: ', ' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'title-short' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { macro: 'date-disambiguate' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { macro: 'case-locator-subsequent' },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'text',
                              attrs: { macro: 'case-pinpoint-subsequent' },
                              children: [],
                            },
                          ],
                        },
                        {
                          name: 'choose',
                          attrs: {},
                          children: [
                            {
                              name: 'if',
                              attrs: { match: 'none', type: 'legal_case' },
                              children: [
                                {
                                  name: 'text',
                                  attrs: { macro: 'point-locators-subsequent' },
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
                  name: 'else',
                  attrs: {},
                  children: [
                    {
                      name: 'group',
                      attrs: { delimiter: ', ' },
                      children: [
                        {
                          name: 'group',
                          attrs: { delimiter: ': ' },
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
                                      name: 'group',
                                      attrs: { delimiter: ', ' },
                                      children: [
                                        {
                                          name: 'group',
                                          attrs: { delimiter: ' ' },
                                          children: [
                                            {
                                              name: 'group',
                                              attrs: { delimiter: ', ' },
                                              children: [
                                                {
                                                  name: 'group',
                                                  attrs: { delimiter: ', ' },
                                                  children: [
                                                    {
                                                      name: 'text',
                                                      attrs: {
                                                        macro:
                                                          'contributors-note',
                                                      },
                                                      children: [],
                                                    },
                                                    {
                                                      name: 'text',
                                                      attrs: {
                                                        macro: 'title-note',
                                                      },
                                                      children: [],
                                                    },
                                                    {
                                                      name: 'text',
                                                      attrs: {
                                                        macro:
                                                          'issue-map-graphic',
                                                      },
                                                      children: [],
                                                    },
                                                  ],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro: 'description-note',
                                                  },
                                                  children: [],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro:
                                                      'secondary-contributors-note',
                                                  },
                                                  children: [],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro:
                                                      'container-title-note',
                                                  },
                                                  children: [],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro:
                                                      'container-contributors-note',
                                                  },
                                                  children: [],
                                                },
                                              ],
                                            },
                                            {
                                              name: 'text',
                                              attrs: {
                                                macro:
                                                  'locators-note-join-with-space',
                                              },
                                              children: [],
                                            },
                                          ],
                                        },
                                        {
                                          name: 'text',
                                          attrs: {
                                            macro:
                                              'locators-note-join-with-comma',
                                          },
                                          children: [],
                                        },
                                        {
                                          name: 'text',
                                          attrs: { macro: 'collection-title' },
                                          children: [],
                                        },
                                        {
                                          name: 'text',
                                          attrs: {
                                            macro: 'issue-note-join-with-comma',
                                          },
                                          children: [],
                                        },
                                      ],
                                    },
                                    {
                                      name: 'text',
                                      attrs: {
                                        macro: 'issue-note-join-with-space',
                                      },
                                      children: [],
                                    },
                                  ],
                                },
                                {
                                  name: 'text',
                                  attrs: { macro: 'locators-newspaper' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: {
                                    macro: 'point-locators-join-with-comma',
                                  },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'text',
                              attrs: {
                                macro: 'point-locators-join-with-colon',
                              },
                              children: [],
                            },
                          ],
                        },
                        {
                          name: 'text',
                          attrs: { macro: 'access-note' },
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
    {
      name: 'bibliography',
      attrs: {
        'hanging-indent': 'true',
        'et-al-min': '11',
        'et-al-use-first': '7',
        'subsequent-author-substitute': '———',
        'entry-spacing': '0',
      },
      children: [
        {
          name: 'sort',
          attrs: {},
          children: [
            {
              name: 'key',
              attrs: { macro: 'contributors-sort' },
              children: [],
            },
            { name: 'key', attrs: { variable: 'title' }, children: [] },
            { name: 'key', attrs: { variable: 'genre' }, children: [] },
            { name: 'key', attrs: { variable: 'issued' }, children: [] },
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
                {
                  name: 'group',
                  attrs: { delimiter: ': ' },
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
                              name: 'group',
                              attrs: { delimiter: '. ' },
                              children: [
                                {
                                  name: 'group',
                                  attrs: { delimiter: ' ' },
                                  children: [
                                    {
                                      name: 'group',
                                      attrs: { delimiter: ', ' },
                                      children: [
                                        {
                                          name: 'group',
                                          attrs: { delimiter: '. ' },
                                          children: [
                                            {
                                              name: 'group',
                                              attrs: { delimiter: '. ' },
                                              children: [
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro: 'contributors',
                                                  },
                                                  children: [],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: { macro: 'title' },
                                                  children: [],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro: 'issue-map-graphic',
                                                  },
                                                  children: [],
                                                },
                                              ],
                                            },
                                            {
                                              name: 'text',
                                              attrs: { macro: 'description' },
                                              children: [],
                                            },
                                            {
                                              name: 'text',
                                              attrs: {
                                                macro: 'secondary-contributors',
                                              },
                                              children: [],
                                            },
                                            {
                                              name: 'group',
                                              attrs: { delimiter: ', ' },
                                              children: [
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro: 'container-title',
                                                  },
                                                  children: [],
                                                },
                                                {
                                                  name: 'text',
                                                  attrs: {
                                                    macro:
                                                      'container-contributors',
                                                  },
                                                  children: [],
                                                },
                                              ],
                                            },
                                            {
                                              name: 'text',
                                              attrs: {
                                                macro:
                                                  'locators-join-with-period',
                                              },
                                              children: [],
                                            },
                                          ],
                                        },
                                        {
                                          name: 'text',
                                          attrs: {
                                            macro: 'locators-join-with-comma',
                                          },
                                          children: [],
                                        },
                                        {
                                          name: 'text',
                                          attrs: { macro: 'locators-chapter' },
                                          children: [],
                                        },
                                      ],
                                    },
                                    {
                                      name: 'text',
                                      attrs: {
                                        macro: 'locators-join-with-space',
                                      },
                                      children: [],
                                    },
                                  ],
                                },
                                {
                                  name: 'text',
                                  attrs: { macro: 'collection-title' },
                                  children: [],
                                },
                                {
                                  name: 'text',
                                  attrs: { macro: 'issue-join-with-period' },
                                  children: [],
                                },
                              ],
                            },
                            {
                              name: 'text',
                              attrs: { macro: 'issue-join-with-space' },
                              children: [],
                            },
                          ],
                        },
                        {
                          name: 'text',
                          attrs: { macro: 'issue-join-with-comma' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { macro: 'locators-journal-join-with-comma' },
                          children: [],
                        },
                        {
                          name: 'text',
                          attrs: { macro: 'locators-newspaper' },
                          children: [],
                        },
                      ],
                    },
                    {
                      name: 'text',
                      attrs: { macro: 'locators-journal-join-with-colon' },
                      children: [],
                    },
                  ],
                },
                { name: 'text', attrs: { macro: 'access' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
  ],
}
