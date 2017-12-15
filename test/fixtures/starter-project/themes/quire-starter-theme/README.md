# Quire Starter Theme

This starter theme is designed to showcase many of Quire's features out of the
box, while remaining easy to customize.

## Features

- [Bulma](http://bulma.io) CSS Framework is included
- jQuery included by default
- Several accessibility features have been built in
- Flexbox layouts throughout

## Development Info

This theme is included in the Quire Starter Kit as a Git Submodule. Most users
will want to "flatten" everything into a single repository containing content
and theme when they first create a site (so they can version their changes as 
they build out their own publications). 

You can use the following steps to download the Starter kit along with this
theme and then flatten them into a single project:

1. Clone the kit and its theme submodule: `git clone --recursive https://github.com/gettypubs/quire-starter.git`
2. Change into the kit directory and remove the submodule from the repo's tree: `git rm --cached themes/quire-starter-theme`
3. Remove the `.gitmodules` file: `rm .gitmodules`
4. Add the contents of the theme directory to the repo and commit them: `git add themes/quire-starter-theme`
5. Make sure you have a new remote set up to push changes to as you make them.

- 
