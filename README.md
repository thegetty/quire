# Quire

## About Quire 

Developed by Getty, Quire is a new, multiformat publishing tool available for immediate access and use. Quire is in a limited beta, © J. Paul Getty Trust, and not yet released as open-source software. **For a free license to use Quire, please complete [this form](http://bit.ly/quire-signup).**

Quire is an ideal tool for anyone seeking to publish a beautiful, scholarly digital book optimized for visual imagery and designed to ensure its content is widely accessible and stable. 

Quire books feature:

- Page-level citation
- Footnotes
- Bibliographies
- Figure images and image groups
- Zooming images and maps
- Video and audio embeds
- Dynamic tables of contents and menus
- Full-text search
- Responsive web design
- Web accessibility and SEO optimized
- Outputs to web, PDF, and EPUB formats

To learn more about Quire, please refere to our in progress [documentation](https://quire.getty.edu)

Check out [the demo site](https://thegetty.github.io/quire-starter/), and [some of Getty’s books developed with Quire](http://www.getty.edu/publications/digital/digitalpubs.html)

If you’re considering using Quire for the first time, please be sure to visit our [*Implementation Considerations.*](https://quire.getty.edu/documentation/implementation/) If you’re a developer please also visit the [*For Developers*](https://quire.getty.edu/documentation/for-developers/) section of our documentation.

We encourage you to sign up for a [free GitHub account](https://github.com/join) to access the [Quire Community Forum](https://github.com/thegetty/quire/discussions). You can utilize the forum to ask and answer questions, share ideas, provide feedback, and assist your fellow Quire users. [Subscribe to our newsletter](https://newsletters.getty.edu/h/t/3482055B10CD0F24) for the latest news and events, new feature updates, and highlights from our community. 

## Installing Quire

This is the mono-repository for [Quire](https://quire.getty.edu/). It contains:

-   [packages/cli](https://github.com/thegetty/quire/tree/main/packages): the quire command-line interface for Quire
-   [starters/default](https://github.com/thegetty/quire/tree/main/starters): default starter content used as placeholder content when starting a new Quire project
-   [themes/default](https://github.com/thegetty/quire/tree/main/themes): default theme designed to broadly cover a full range of use-cases and to demonstrate the range of the Quire content model

### Quick Install: MacOS

1.  Install Apple’s Xcode with: `xcode-select --install`
2.  Install the LTS version of Node.js: https://nodejs.org
3.  Install Quire with: `npm install --global \@thegetty/quire-cli`
4.  Confirm by pulling up a list of Quire commands: `quire --help`

### Quick Install: Windows

1.  Install Git for Windows: https://gitforwindows.org/
2.  Install the LTS version of Node.js: https://nodejs.org
3.  Install Windows Build Tools with: `npm install --g --production windows-build-tools`
4.  Install Quire with: `npm install --global \@thegetty/quire-cli`
5.  Confirm by pulling up a list of Quire commands: `quire --help`

For full installation instructions, and information about updating and uninstalling Quire please see our [documentation.](https://quire.netlify.app/documentation/install-uninstall/)

### Dependencies

Quire is centered around the static-site generator [Hugo](https://github.com/gohugoio/hugo). The Quire command-line interface is written in Javascript and requires [Node.js LTS](https://nodejs.org/en/) to run.

In order to produce multiple formats using Quire, you must first install the following support software:

- [PrinceXML](https://www.princexml.com/download/) for PDF generation 
- [Pandoc](https://pandoc.org/installing.html) for EPUBs and MOBIs
- [Kindle Previewer](https://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765261) for MOBIs

## Quire Commands 

| Option          | Result                                  | 
| --------------- | --------------------------------------- | 
| -V, --version   | Output the version number               |
| -v, --verbose   | Log verbose output                      |
| -f, --file      | Add Filename and optional new filepath  |
| -e, --env       | Add environment variable                |
| -h, --help      | Output usage information                |


| Command             | Result                                                            |
| ------------------- | ----------------------------------------------------------------- |
| new \<projectName\> | Create a new Quire project in the current directory.              |
| preview             | Run the preview server in the current directory                   |
| install             | Install this project's theme dependencies                         |
| site                | Run the build command in the current directory                    |
| pdf                 | Generate a PDF version of the current project                     |
| process             | Run a Quire process. Currently only supports the "--iiif" option  |
| epub                | Generate an EPUB version of the current project                   |
| mobi                | Generate an MOBI version of the current project                   |
| template            | Download templates to customize your file output (only for EPUB)  |
| debug               | Development use only - log info about current  project            |

For more information about these commands please see the [*Quire Commands*](https://quire.getty.edu/documentation/quire-commands/) section of our [documentation](https://quire.getty.edu/documentation/quire-commands/) 

## Contributing to Quire 

There are [many ways to contribute](https://github.com/thegetty/quire-docs/blob/new-design-v1/CONTRIBUTING.md#identify-a-contribution-to-make). No matter what level of experience you have, we welcome all contributions, big and small.

The first step to any contribution is to post a new issue or comment on an existing issue [on our issue tracker](https://github.com/thegetty/quire/issues). Please label your issues to the best of your abilities.

Possible contributions include:

**Fix or Report a Bug**
-   [Post a new bug](https://github.com/thegetty/quire/issues)
-   [Find an existing bug to work on](https://github.com/thegetty/quire/issues)

**Improve Documentation**
-   [Navigate to Quire documentation repo](https://github.com/thegetty/quire-docs)
-   [Propose a new section or edit](https://github.com/thegetty/quire-docs/issues) 
-   [Find an existing issue](https://github.com/thegetty/quire-docs/issues)
-   [Read the Quire Documentation Style Guide](https://github.com/thegetty/quire-docs/wiki/Quire-Website-&-Documentation-Style-Guide)

**Translate the Documentation**
-   [Volunteer to do some translation](https://github.com/thegetty/quire/issues)

**Write an Article**
-   [Share your article idea](https://github.com/thegetty/quire/issues)

**Develop a New Feature or Theme**
-   [Review features in development](https://github.com/thegetty/quire/discussions/13) 
-   [Read the Quire Technical Style Guide](https://github.com/thegetty/quire/wiki/Quire-Technical-Style-Guide)
-   [Post your feature idea](https://github.com/thegetty/quire/issues)

For more information visit our complete [Contributing Guidelines](https://github.com/thegetty/quire-docs/blob/new-design-v1/CONTRIBUTING.md). 

## Quire Contributors

### Core Team

-   Greg Albers ([\@geealbers](https://github.com/geealbers)), product manager
-   David Newbury ([\@workergnome](https://github.com/workergnome)), product manager
-   Matthew Hrudka ([\@mphstudios](https://github.com/mphstudios)), lead maintainer
-   Erin Cecele Dunigan ([\@Erin-Cecele](https://github.com/Erin-Cecele)), community manager

Contact us at [quire\@getty.edu](mailto:quire@getty.edu).

### Contributors

Thank you to all our growing list of contributors who have made Quire what it is, and are working on what it will be! They’ve contributed code, answered questions on our forum, written and edited documentation, run events, and blogged and spoken about Quire.

-   [\@aheltonsjma](https://github.com/aheltonsjma)
-   [\@anderspollack](https://github.com/anderspollack)
-   [\@antoinentl](https://github.com/antoinentl)
-   [\@chrisdaaz](https://github.com/chrisdaaz) 
-   [\@daniel-keller](https://github.com/daniel-keller)
-   [\@egardner](https://github.com/egardner)
-   [\@fchasen](https://github.com/fchasen)
-   [\@hbalenda](https://github.com/hbalenda)
-   [\@kalvarenga](https://github.com/kalvarenga)
-   [\@kristhayer11](https://github.com/kristhayer11)
-   [\@mandrijauskas](https://github.com/mandrijauskas)
-   [\@MillsArtMuseum](https://github.com/MillsArtMuseum)
-   [\@mbelhu](https://github.com/mbelhu)
-   [\@naeluh](https://github.com/naeluh)
-   [\@nancyum](https://github.com/nancyum)
-   [\@oncletom](https://github.com/oncletom)
-   [\@swambold1](https://github.com/swambold1)
-   [\@victoriabarry](https://github.com/victoriabarry)


## License

Copyright © 2021, J Paul Getty Trust.
