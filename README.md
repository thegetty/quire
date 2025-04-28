# Quire
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/thegetty/quire/tree/main.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/thegetty/quire/tree/main)

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
5. Vist the [*Get Started*](https://quire.getty.edu/docs-v1/getting-started) section of the documentation to begin a new Quire project.

### Windows

1. Download and install Git for Windows: https://gitforwindows.org/. 
2. Download and install the LTS version of Node.js: https://nodejs.org/en/download/. 
3. In PowerShell (Admin) install Quire with `npm install --global @thegetty/quire-cli`
4. Once Quire has been installed, change your PowerShell permissions settings with  `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`. 
5. Confirm installation with `quire --version`. You should see a version number that begins with a 1. If you receive the message "command not found" this means installation was unsuccessful.
6. Vist the [*Get Started*](https://quire.getty.edu/docs-v1/getting-started/) section of the documentation to begin a new Quire project.

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

## Thank you, Contributors

Thank you to our growing list of contributors who have made Quire what it is and are working on what it will be! They’ve participated in the forum, shared their projects, reported bugs, written/edited documentation, contributed code, and spoken about Quire at conferences.
  
- [@1000camels](https://github.com/1000camels)
- [@ACMAA](https://github.com/ACMAA)
- [@aebancroft](https://github.com/aebancroft)
- [@aheltonsjma](https://github.com/aheltonsjma)
- [@alexhallenbeck](https://github.com/alexhallenbeck)
- [@anderspollack](https://github.com/anderspollack)
- [@andreas152](https://github.com/andreas152)
- [@annaficek](https://github.com/annaficek)
- [@anniemcewen](https://github.com/anniemcewen)
- [@antoinentl](https://github.com/antoinentl)
- [@aprigge](https://github.com/aprigge)
- [@audreywarne](https://github.com/audreywarne)
- [@badragan](https://github.com/badragan)
- [@basiakapolka](https://github.com/basiakapolka)
- [@belmendo](https://github.com/belmendo)
- [bjhewitt](https://github.com/bjhewitt)
- [@brm202322](https://github.com/brm202322)
- [@brrd](https://github.com/brrd)
- [@brutaldigital](https://github.com/brutaldigital)
- [@butcharchivist](https://github.com/butcharchivist)
- [@bulbil](https://github.com/bulbil)
- [@cbutcosk](https://github.com/cbutcosk)
- [@chrisdaaz](https://github.com/chrisdaaz)
- [@christinaweyl](https://github.com/christinaweyl)
- [@cmillhauser](https://github.com/cmillhauser)
- [@cyr1l0u](https://github.com/cyr1l0u)
- [@daniel-keller](https://github.com/daniel-keller)
- [@davidschober](https://github.com/davidschober)
- [@dawei-wang](https://github.com/dawei-wang)
- [@designforcontext](https://github.com/designforcontext)
- [@dimrkh](https://github.com/dimrkh)
- [@drbobbyduke](https://github.com/drbobbyduke)
- [@egardner](https://github.com/egardner)
- [@ellenarchie](https://github.com/ellenarchie)
- [@emptyhut](https://github.com/emptyhut)
- [@ewolfe1](https://github.com/ewolfe1)
- [@evale124](https://github.com/evale124)
- [@fchasen](https://github.com/fchasen)
- [@garrettdashnelson](https://github.com/garrettdashnelson)
- [@goodweather-vancouver/](https://github.com/goodweather-vancouver)
- [@gitgilleszeimet](https://github.com/gitgilleszeimet)
- [@gspy72](https://github.com/gspy72)
- [@ggarcia0596](https://github.com/ggarcia0596)
- [@halfempty](https://github.com/halfempty)
- [@hbalenda](https://github.com/hbalenda)
- [@hlj24](https://github.com/hlj24)
- [@hughlilly](https://github.com/hughlilly)
- [@its-leofisher](https://github.com/its-leofisher)
- [@itspangler](https://github.com/itspangler)
- [@jenpark-getty](https://github.com/jenpark-getty)
- [@jorrego](https://github.com/jorrego)
- [@joshahill](https://github.com/joshahill)
- [@jpattersonHL](https://github.com/jpattersonHL)
- [@jtackesiii](https://github.com/jtackesiii)
- [@julieannfry/](https://github.com/julieannfry)
- [@julientaq](https://github.com/julientaq)
- [@junedtan](https://github.com/junedtan)
- [@kalvarenga](https://github.com/kalvarenga)
- [@kanotson](https://github.com/kanotson)
- [@kbejado](https://github.com/kbejado)
- [@kjell](https://github.com/kjell)
- [@KJustement](https://github.com/KJustement)
- [@kristhayer11](https://github.com/kristhayer11)
- [@kyungnapark](https://github.com/kyungnapark)
- [@LeeWarnock](https://github.com/LeeWarnock)
- [@leslie-martinez15](https://github.com/leslie-martinez15)
- [@lizneely](https://github.com/lizneely/)
- [@lmurrell](https://github.com/lmurrell/)
- [@lucafalefoto](https://github.com/lucafalefoto)
- [@mandrijauskas](https://github.com/mandrijauskas)
- [@mantasandri](https://github.com/mantasandri)
- [@Mapachosa](https://github.com/Mapachosa/)
- [@margaretnagawa](https://github.com/margaretnagawa)
- [@materiajournal](https://github.com/materiajournal)
- [@mbelhu](https://github.com/mbelhu)
- [@metro-glenn](https://github.com/metro-glenn)
- [@mgray4](https://github.com/mgray4)
- [@miandfetter](https://github.com/miandfetter)
- [@MillsArtMuseum](https://github.com/MillsArtMuseum)
- [@mmpadilla15](https://github.com/mmpadilla15)
- [@mphstudios](https://github.com/mphstudios)
- [@mpopke](https://github.com/mpopke)
- [@naeluh](https://github.com/naeluh)
- [@nancyum](https://github.com/nancyum)
- [@natalienardello](https://github.com/natalienardello)
- [@ncamachoh](https://github.com/ncamachoh)
- [@Neal-B-Johnson](https://github.com/Neal-B-Johnson)
- [@pancaketents](https://github.com/pancaketents)
- [@pselinsk](https://github.com/pselinsk)
- [@piyushsonawane07](https://github.com/piyushsonawane07)
- [@rabarth1](https://github.com/rabarth1)
- [@Raven-Lawson](https://github.com/Raven-Lawson)
- [@ronvoluted](https://github.com/ronvoluted)
- [@rrolonNelson](https://github.com/rrolonNelson)
- [@rtrepagn](https://github.com/rtrepagn)
- [@Sadia-QM-audio](https://github.com/Sadia-QM-audio)
- [@salger1](https://github.com/salger1)
- [@sarakaustin](https://github.com/sarakaustin)
- [@shanor](https://github.com/shanor)
- [@shineslike](https://github.com/shineslike)
- [@skolacha](https://github.com/skolacha)
- [@sophielamb](https://github.com/sophielamb)
- [@srebick](https://github.com/srebick)
- [@swambold1](https://github.com/swambold1)
- [@swroberts](https://github.com/swroberts)
- [@thom4parisot](https://github.com/thom4parisot)
- [@tiffanysprague](https://github.com/tiffanysprague)
- [@tinykite](https://github.com/tinykite)
- [@tipeslowly](https://github.com/tipeslowly)
- [@tlgould](https://github.com/tlgould)
- [@Tooba-QM](https://github.com/Tooba-QM)
- [@trantran199](https://github.com/trantran199)
- [@vhellstein](https://github.com/vhellstein)
- [@victoriabarry](https://github.com/victoriabarry)
- [@workergnome](https://github.com/workergnome)
- [@yl5682](https://github.com/yl5682)
- [@YLLAM88](https://github.com/YLLAM88)
- [@zoosky](https://github.com/zoosky)
- [@zsofiaj](https://github.com/zsofiaj)

Special acknowledgment is due to Eric Gardner ([@egardner](https://github.com/egardner)), who served as Digital Publications Developer at Getty from 2014 to 2018, and who conceived and spearheaded the original development of Quire. Thank you, Eric!

## License

Copyright © 2022, J Paul Getty Trust.
