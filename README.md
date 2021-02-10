Quire
=====
multi-format digital publishing
-------------------------------

This is the mono-repository for [Quire](https://quire.getty.edu), an open-source multi-format publishing framework. This multi-package repository contains:

- `packages/cli`: the `quire` command-line interface
- `starters/default`: a default starter project 
- `themes/default`: the default publication theme


Getting Started
===============
Quire uses [lerna](https://github.com/lerna/lerna) for version management, with [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) for package management.


Installation
------------
Install `lerna`:
`npm install -g lerna`

Install dependencies:
`lerna bootstrap`