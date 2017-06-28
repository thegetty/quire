## quire-cli

Command line interface for building and managing Quire projects
More info TK.

### Installation

To have a globally available `quire` command, run `npm install -g` inside the
project folder after cloning this repo.
To create a symbolic link (useful if you are developing locally) run `npm link`
in the project directory.

#### Dependencies

- Git 
- [Hugo static site generator](http://gohugo.io)
- Node.js (version?) and NPM
- Prince PDF generator (optional but required for PDF generation)

Quire has a few dependencies which should be installed separately. They include
the [Hugo](http://gohugo.io) static site generator, and (optional, but required
for PDF generation), the [Prince](http://www.princexml.com/) command-line tool.

Git is also required. Mac users can run `xcode-select --install` in the Terminal
app. PC users should look at the Git Bash Shell. PC support for Quire is
strictly experimental at this point.

Mac users using Homebrew can install Hugo by running `brew install hugo`

Hugo is free and open-source software; Prince is proprietary (but you can use a
free version which watermarks the first page of the PDF output).

In the future other PDF generators like WKHTML2PDF may be supported.

