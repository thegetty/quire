# Quire

## About Quire 

Developed by Getty, Quire is a digital publishing tool that can create dynamic publications in a variety of formats, including web, print, and e-book. Quire is an ideal tool for publishing beautiful, scholarly digital books optimized for visual imagery and designed to ensure publication content is widely accessible and stable.

Quire is open source and free to use. View Quire's [3-clause BSD open source license](https://github.com/thegetty/quire/blob/main/LICENSE).  

Please note: Quire v1 is currently in a pre-release phase. Testing and improvements are ongoing.

Quire books feature:

- Page-level citation
- Footnotes
- Bibliographies
- Figure images and image groups
- Image layers and deep linking 
- Zooming images and maps
- Video and audio embeds
- Dynamic tables of contents and menus
- Full-text search
- Responsive web design
- Web accessibility and SEO optimized
- Outputs to web, PDF, and EPUB formats

To learn more about Quire, please visit our [website](https://quire.getty.edu) which includes documentation, helpful resources, and information about how to get involved with the community. 

Check out [publications from the Quire community](https://quire.getty.edu/community/community-showcase) and [some of Getty’s books developed with Quire](http://www.getty.edu/publications/digital/digitalpubs.html).

If you’re considering using Quire for the first time, please be sure to visit our [*Implementation Considerations*](https://quire.getty.edu/docs-v1/implementation/). 

We encourage you to sign up for a [free GitHub account](https://github.com/join) to access the [Quire Community Forum](https://github.com/thegetty/quire/discussions). You can utilize the forum to ask and answer questions, share ideas, provide feedback, and assist your fellow Quire users. [Subscribe to our newsletter](https://newsletters.getty.edu/h/t/DDE7B9372AAF01E4) for the latest news and events, new feature updates, and highlights from our community. 

### Quire Repositories

There are three Quire repositories hosted on GitHub:

- [**quire**](https://github.com/thegetty/quire): Quire’s primary repository, with the command-line interface and 11ty template packages
- [**quire-starter-default**](https://github.com/thegetty/quire-starter-default): The default starter content for a Quire project
- [**quire-docs**](https://github.com/thegetty/quire-docs): Quire website and documentation.

## Installation and Usage for Quire

### macOS

1. Download and install the LTS version of Node.js: https://nodejs.org/en/download/.
2. Install Quire with `npm install --global @thegetty/quire-cli`
3. If you receive an error message that says "Error: EACCES: permission denied," run `sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`. Then try step 2 again.
4. Confirm installation with `quire --version`. You should see a version number that begins with a 1. If you receive the message "command not found" this means installation was unsuccessful.
5. Vist the [*Get Started*](https://quire.getty.edu/docs-v1/get-started) section of the documentation to begin a new Quire project.

### Windows

1. Download and install Git for Windows: https://gitforwindows.org/. 
2. Download and install the LTS version of Node.js: https://nodejs.org/en/download/. 
3. In PowerShell (Admin) install Quire with `npm install --global @thegetty/quire-cli`
4. Once Quire has been installed, change your PowerShell permissions settings with  `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`. 
5. Confirm installation with `quire --version`. You should see a version number that begins with a 1. If you receive the message "command not found" this means installation was unsuccessful.
6. Vist the [*Get Started*](https://quire.getty.edu/docs-v1/get-started) section of the documentation to begin a new Quire project.

## Dependencies

Quire is centered around the static-site generator [Eleventy](https://www.11ty.dev/). The Quire command-line interface is written in JavaScript and requires [Node.js LTS](https://nodejs.org/en/) to run.

Either [PrinceXML](https://www.princexml.com/download/) or [Paged.js](https://pagedjs.org/) can be used for PDF generation.


## Quire Commands 

| Option            | Result                                  | 
| ----------------- | --------------------------------------- | 
| `-V, --version`   | Output the version number               |
| `-h, --help`      | Output usage information                |

| Command               | Result                                                            |
| --------------------- | ----------------------------------------------------------------- |
| `new \<projectName\>` | Create a new Quire project in the current directory               |
| `preview`             | Run the preview server in the current directory                   |
| `build`               | Run the build command to generate the html site files             |
| `pdf`                 | Output Quire project in PDF format (must run `quire build` first) |
| `epub`                | Output Quire project in EPUB format (must run `quire build` first)|
| `clean`               | Remove old `build` outputs                                        | 

For more information about these commands please see the [*Quire Commands*](https://quire.getty.edu/docs-v1/quire-commands/) section of our documentation.

## Contributing to Quire 

There are [many ways to contribute](https://github.com/thegetty/quire/blob/main/CONTRIBUTING.md#identify-a-contribution-to-make). No matter what level of experience you have, we welcome all contributions, big and small.

The first step to any contribution is to post a new issue or comment on an existing issue [on our issue tracker](https://github.com/thegetty/quire/issues). Please label your issues to the best of your abilities.

Possible contributions include:

**Fix or Report a Bug**
-   [Post a new bug](https://github.com/thegetty/quire/issues)
-   [Find an existing bug to work on](https://github.com/thegetty/quire/issues)

**Improve Documentation**
-   [Propose a new section or edit](https://github.com/thegetty/quire-docs/issues) 
-   [Find an existing improvement to work on](https://github.com/thegetty/quire-docs/issues)

**Translate the Documentation**
-   [Volunteer to do some translation](https://github.com/thegetty/quire-docs/issues)

**Write an Article**
-   [Share your article idea](https://github.com/thegetty/quire/issues)

**Develop a New Feature or Theme**

-   [Post your feature idea](https://github.com/thegetty/quire/issues)

For more information visit our complete [Contributing Guidelines](https://github.com/thegetty/quire/blob/main/CONTRIBUTING.md). 

## License

Copyright © 2022, J Paul Getty Trust.
