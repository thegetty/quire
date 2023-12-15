# Quire Contributor Guidelines

*Thank you for your interest in contributing to Quire! No matter what level of experience you have, we welcome all contributions, big and small.* 

Developed by [Getty](http://www.getty.edu), [Quire](https://quire.getty.edu) is a digital publishing tool that can create dynamic publications in a variety of formats, including web, print, and e-book. Quire is an ideal tool for publishing beautiful, scholarly digital books optimized for visual imagery and designed to ensure publication content is widely accessible and stable.

Quire is open-source and free to use. View Quire's [3-clause BSD open source license](https://github.com/thegetty/quire/blob/main/LICENSE). Please note: Quire v1 is currently in a pre-release phase. Testing and improvements are ongoing.

At the moment, the primary ways to contribute to Quire are reporting and fixing bugs or writing and improving the documentation. In time we will expand this to include suggesting features and enhancements. Please read the following guidelines carefully. Our goal is to make the process as effective and transparent as possible and to ensure that your contributions become part of Quire. Thank you for taking the time.

🗣**CALLING ALL FIRST-TIMERS!** — We can’t stress enough that Quire is open to contributors at all levels. That could mean making a modest fix, like correcting a typo in the docs, to a more intensive contribution, like fixing broken code. Here are a few resources especially for you:

- Find [“good first issues”](https://github.com/thegetty/quire/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) tagged in our issue tracker for the main `thegetty/quire` repo
- Find [“good first issues”](https://github.com/thegetty/quire-docs/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tagged in our issue tracker for the `thegetty/quire-docs` repo
- Read the Quire guide to Making Your First Contribution — *in progress*
- Learn more about contributing to open source at [First Timers Only](http://www.firsttimersonly.com/)

## Important Resources

- [Issue tracker](https://github.com/thegetty/quire/issues/)
- [Forum](https://github.com/thegetty/quire/discussions)
- [Website](https://quire.getty.edu) 
- [Documentation](https://quire.getty.edu/docs-v1)

**Quire Core Team:**

Greg Albers ([@geealbers](https://github.com/geealbers)), product manager<br />
David Newbury ([@workergnome](https://github.com/workergnome)), product manager<br />
Matthew Hrudka ([@mphstudios](https://github.com/mphstudios)), lead maintainer<br />
Erin Cecele Dunigan ([@Erin-Cecele](https://github.com/Erin-Cecele)), community manager<br />

Contact us at [quire@getty.edu](mailto:quire@getty.edu)

**All are welcome.** As an open-source community, Quire is committed to providing a safe, welcoming, transparent, and inclusive environment for all our community members and those wishing to become involved. Please see our **[Code of Conduct](https://github.com/thegetty/quire/blob/main/CODE_OF_CONDUCT.md)** for more on the expectations and protections for our community members.

## Quire Code Repositories

There are three main code repositories for Quire hosted on GitHub.

- [**quire**](https://github.com/thegetty/quire): Quire’s primary repository, with the command-line interface and 11ty template packages
- [**quire-starter-default**](https://github.com/thegetty/quire-starter-default): The default starter content for a Quire project 
- [**quire-docs**](https://github.com/thegetty/quire-docs): The Quire website and documentation.
 
## Before Getting Started

In order to post or comment on an issue or submit contributions, you will first need to [create a GitHub account](https://github.com/join). 

*We manage Quire through GitHub. If you are new to GitHub, we recommend starting with [GitHub Docs](https://docs.github.com/en). We also encourage you to check out Coding Train’s fantastic video series [Git and Github for Poets](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZF9C0YMKuns9sLDzK6zoiV). GitHub can be accessed through the command line or [GitHub Desktop](https://desktop.github.com/).*

## Identify a Contribution to Make

**The first step to any contribution** is to post a new issue or comment on an existing issue via our [issue tracker](https://github.com/thegetty/quire/issues/). Be sure to briefly describe your proposed solution and say whether you may need help with any aspect of it. This approach has several advantages:

- Lets people know you’re working on it
- Gives the core team and the community a chance to give feedback before you do any work
- Helps to ensure your contribution will be accepted and successfully merged in

**The second step to any contribution**, once you’ve identified what you’d like to contribute, is to start work on it and eventually prepare to submit it. Read our [submission guide](#submit-your-contribution) below.

### Report a Potential Bug

If you encounter what you believe is a reproducible bug while working on a Quire project and have confirmed that it has yet to be reported on our issue tracker, please complete the bug report form.

You will need to include the following information in your report:

- Description
- Expected behavior 
- Actual behavior
- Steps to reproduce 
- Quire and Node version numbers
- Operating system and web browser numbers
- Optional Terminal/Shell output, supporting info, screenshots, workarounds, etc.  

Your bug report will then be reviewed by the core team to determine if it will be selected for development, backlogged, or closed.

[Review our Bug Reporting Instructions](https://github.com/thegetty/quire/blob/main/BUG_REPORTING.md)<br />
[Check the issue tracker before posting your issue](https://github.com/thegetty/quire/issues)<br />
[Complete the bug report form](https://github.com/thegetty/quire/issues/new?assignees=erin-cecele%2Cgeealbers&labels=bug&projects=&template=bug_report.yaml)<br />
[Post your thoughts/questions on our GitHub Discussions board if you are unsure](https://github.com/thegetty/quire/discussions)<br /> 

### Fix a Bug

If you encounter a bug on our [issue tracker](https://github.com/thegetty/quire/issues) that you would like to work on, take these two steps before getting started:

- Comment on the issue to let people know you are working on it
- Share your proposed solution so the core team and community can provide feedback or assistance
  
[Follow the guidelines below to submit your contribution](#submit-your-contribution).

### Improve the Documentation

The Quire [documentation](https://quire.getty.edu/docs-v1/) and [website](http://quire.getty.edu) are hosted in a separate [`quire-docs` repository](https://github.com/thegetty/quire-docs). The documentation is continuously being updated for clarity and completeness, but it’s not always easy to keep up with the pace of Quire’s development!

If there’s a section that you think is missing or could be improved, we’d love your help. And the documentation is itself a Quire site (built with [v0](https://quire.getty.edu/docs-v0/)), so it should be somewhat familiar to work in.

[Find an existing issue to work on](https://github.com/thegetty/quire-docs/issues)<br />
[Propose a new section or edit](https://github.com/thegetty/quire-docs/issues/new)<br />
[Read the Quire Documentation Style Guide](https://github.com/thegetty/quire-docs/wiki/Quire-Website-&-Documentation-Style-Guide)

### Translate the Documentation

The Quire community is global, and we hope to be able to continue to expand access to Quire, including to non-English speakers. Though we haven’t yet done any translation work on any of the documentation or materials, if that’s something you’re interested in doing, we’d love to talk to you.

[Volunteer to do some translation](https://github.com/thegetty/quire-docs/issues/new)

### Write a Recipe

We’re always interested in adding step-by-step guides on creating popular customizations to the [Resources](https://quire.getty.edu/resources/recipes/) section of our website. Maybe you have some tips on modifying shortcodes or styling in CSS in the `custom.css`. Chances are, the community would love to read about it.

[Share your recipe idea](https://github.com/thegetty/quire-docs/issues/new)

### Suggest a Feature or Enhancement 

Coming Soon... 

## Submit Your Contribution

Once you’ve identified your contribution on our GitHub [issue tracker](https://github.com/thegetty/quire/issues), you’ll next work on it and prepare to submit it to us for review as a pull request. A pull request says, “Hey, I did something useful for you, want to pull it in and merge it into your project?”

A pull request is a chance for Quire’s core team to evaluate the proposed changes made and decide whether to:

- merge them in as is
- merge them in with changes
- reject them

To avoid changes being rejected, we recommend you post about proposed changes on our issues board before you start work and also submit the pull request while work is still in progress.

A pull request doesn’t have to represent finished work. We always recommend opening a pull request early on, so others can watch or give feedback on your progress. Just mark it as a “WIP” (Work in Progress) in the subject line. As you make new commits to that branch and push them to GitHub, they’ll automatically be added to the open pull request.

This is something like what the development process may look like for you:

1. Fork the repository and clone it locally.
  - Learn more about forks and clones in GitHub’s docs on “[Contributing and collaborating using GitHub Desktop](https://docs.github.com/en/free-pro-team@latest/desktop/contributing-and-collaborating-using-github-desktop)”
2. Create a branch and make your changes.
  - Contribute in the style of the project to the best of your abilities. We’re going to be writing Quire’s Style Guides to help with this, but in the meantime, please try to follow the patterns you see in the existing pages, for instance, in naming classes, structuring page templates, and commenting your code for technical contributions, or in heading structure, tone, and tense for documentation contributions.
  - Test your changes by running `npm install` followed by `quire preview`. Depending on the changes you’ve made, you may also need to run `quire build`, `quire pdf`, and `quire epub` to make sure your changes worked. You may need to check various mobile views as well, which you can do using responsive design mode in your browser. In general, your goal with testing is to make sure your changes don’t break Quire’s existing styles or functionality. Of course, the project’s core team will be doing this, too, and can help guide you if something’s not working as expected.
3. Submit a pull request through GitHub.
  - If this is your first time putting in a pull request on a project like this, we recommend the [*First Contributions* command line](https://github.com/firstcontributions/first-contributions), or [GitHub Desktop](https://github.com/firstcontributions/first-contributions/blob/master/gui-tool-tutorials/github-desktop-tutorial.md) tutorial. Or, Kent C. Dodds' video series, “[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)”
  - Reference any relevant issues or supporting documentation in your pull request description (for example, “Closes #203.”)
  - Explain what the changes do and what your approach was. If there were alternate ways of doing it, mention them and tell us why you didn’t choose them.
  - If this is a Work in Progress pull request, comment on where you are and what your next steps are.
  - Include screenshots of the before and after if your changes include differences in HTML/CSS. Drag and drop the images into the body of your pull request as needed.
4. Respond as needed to the review of your work by Quire’s core team.
  - Answer questions in the pull request comments.
  - Make changes and new commits if needed, or suggest alternate solutions if you have them.
5. See your work merged into Quire! 🎉

Learn more in the *Open Source Guide*’s “[How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)”.

**At this point, we hope you feel ready to contribute! But don’t hesitate to [ask for help or clarification](mailto:quire@getty.edu). Everyone’s a beginner at first. And thank you again for your interest in making Quire a better tool for all!** 🦄

## Quire Contributors

Thank you to our growing list of contributors who have made Quire what it is and are working on what it will be! They’ve contributed code, written and edited documentation, answered questions or shared their work on our forum, run events, and blogged or spoken about Quire.

- [@1000camels](https://github.com/1000camels)
- [@ACMAA](https://github.com/ACMAA)
- [@aebancroft](https://github.com/aebancroft)
- [@aheltonsjma](https://github.com/aheltonsjma)
- [@anderspollack](https://github.com/anderspollack)
- [@andreas152](https://github.com/andreas152)
- [@anniemcewen](https://github.com/anniemcewen/)
- [@antoinentl](https://github.com/antoinentl)
- [@aprigge](https://github.com/aprigge)
- [@audreywarne](https://github.com/audreywarne)
- [@badragan](https://github.com/badragan)
- [@belmendo](https://github.com/belmendo)
- [@brrd](https://github.com/brrd)
- [@brutaldigital](https://github.com/brutaldigital)
- [@butcharchivist](https://github.com/butcharchivist)
- [@cbutcosk](https://github.com/cbutcosk)
- [@chrisdaaz](https://github.com/chrisdaaz)
- [@christinaweyl](https://github.com/christinaweyl/)
- [@cmillhauser](https://github.com/cmillhauser)
- [@daniel-keller](https://github.com/daniel-keller)
- [@dawei-wang](https://github.com/dawei-wang)
- [@designforcontext](https://github.com/designforcontext)
- [@dimrkh](https://github.com/dimrkh)
- [@drbobbyduke](https://github.com/drbobbyduke)
- [@egardner](https://github.com/egardner)
- [@ellenarchie](https://github.com/ellenarchie/)
- [@emptyhut](https://github.com/emptyhut)
- [@evale124](https://github.com/evale124)
- [@fchasen](https://github.com/fchasen)
- [@garrettdashnelson](https://github.com/garrettdashnelson)
- [@gitgilleszeimet](https://github.com/gitgilleszeimet/)
- [@gspy72](https://github.com/gspy72)
- [@ggarcia0596](https://github.com/ggarcia0596)
- [@halfempty](https://github.com/halfempty/)
- [@hbalenda](https://github.com/hbalenda)
- [@hlj24](https://github.com/hlj24)
- [@hughlilly](https://github.com/hughlilly)
- [@jenpark-getty](https://github.com/jenpark-getty)
- [@jorrego](https://github.com/jorrego)
- [@joshahill](https://github.com/joshahill)
- [@jpattersonHL](https://github.com/jpattersonHL)
- [@jtackesiii](https://github.com/jtackesiii/)
- [@julientaq](https://github.com/julientaq)
- [@junedtan](https://github.com/junedtan)
- [@kalvarenga](https://github.com/kalvarenga)
- [@kanotson](https://github.com/kanotson)
- [@kbejado](https://github.com/kbejado)
- [@kjell](https://github.com/kjell)
- [@kristhayer11](https://github.com/kristhayer11)
- [@kyungnapark](https://github.com/kyungnapark)
- [@LeeWarnock](https://github.com/LeeWarnock)
- [@leslie-martinez15](https://github.com/leslie-martinez15)
- [@lizneely](https://github.com/lizneely/)
- [@mandrijauskas](https://github.com/mandrijauskas)
- [@mantasandri](https://github.com/mantasandri)
- [@Mapachosa](https://github.com/Mapachosa/)
- [@margaretnagawa](https://github.com/margaretnagawa/)
- [@materiajournal](https://github.com/materiajournal)
- [@mbelhu](https://github.com/mbelhu)
- [@metro-glenn](https://github.com/metro-glenn)
- [@mgray4](https://github.com/mgray4)
- [@MillsArtMuseum](https://github.com/MillsArtMuseum)
- [@mmpadilla15](https://github.com/mmpadilla15/)
- [@mphstudios](https://github.com/mphstudios)
- [@mpopke](https://github.com/mpopke)
- [@naeluh](https://github.com/naeluh)
- [@nancyum](https://github.com/nancyum)
- [@natalienardello](https://github.com/natalienardello/)
- [@ncamachoh](https://github.com/ncamachoh)
- [@Neal-B-Johnson](https://github.com/Neal-B-Johnson)
- [@pancaketents](https://github.com/pancaketents)
- [@pselinsk](https://github.com/pselinsk)
- [@piyushsonawane07](https://github.com/piyushsonawane07)
- [@rabarth1](https://github.com/rabarth1)
- [@Raven-Lawson](https://github.com/Raven-Lawson)
- [@ronvoluted](https://github.com/ronvoluted)
- [@rrolonNelson](https://github.com/rrolonNelson)
- [@Sadia-QM-audio](https://github.com/Sadia-QM-audio)
- [@salger1](https://github.com/salger1)
- [@sarakaustin](https://github.com/sarakaustin)
- [@shanor](https://github.com/shanor/)
- [@shineslike](https://github.com/shineslike/)
- [@skolacha](https://github.com/skolacha)
- [@sophielamb](https://github.com/sophielamb)
- [@swambold1](https://github.com/swambold1)
- [@swroberts](https://github.com/swroberts)
- [@thom4parisot](https://github.com/thom4parisot)
- [@tipeslowly](https://github.com/tipeslowly)
- [@Tooba-QM](https://github.com/Tooba-QM)
- [@trantran199](https://github.com/trantran199)
- [@victoriabarry](https://github.com/victoriabarry)
- [@workergnome](https://github.com/workergnome)
- [@yl5682](https://github.com/yl5682)
- [@zsofiaj](https://github.com/zsofiaj)

Special acknowledgment is due to Eric Gardner ([@egardner](https://github.com/egardner)), who served as Digital Publications Developer at Getty from 2014 to 2018, and who conceived and spearheaded the original development of Quire. Thank you, Eric!

