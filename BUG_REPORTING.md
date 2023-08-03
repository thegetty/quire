# Bug Reporting Instructions 

Bugs are sneaky, and we need your help spotting and fixing them. The instructions below will help you identify and report suspected bugs so we can create a smooth user experience for our community. 

## TL;DR

If you encounter what you believe is a reproducible bug while working on a Quire project and have confirmed that it has yet to be [reported](https://github.com/thegetty/quire/issues), please create a bug report through our [GitHub Issues tracker](https://github.com/thegetty/quire/issues). You will need to include the following information in your report:

- Description
- Expected behavior 
- Actual behavior
- Steps to reproduce 
- Quire and Node version numbers
- Operating system and web browser numbers
- Optional Terminal/Shell output, supporting info, screenshots, workarounds, etc.  

Your bug report will then be reviewed by the Getty Quire team to determine if it will be selected for development, backlogged, or closed. 

If you encounter a bug that has already been reported and would like to follow along, either comment on the issue to share your experience or subscribe to it. In both instances, you will be pinged when there are updates.  

If you are unsure whether your issue is a bug, please post your thoughts/questions on our [GitHub Discussions board](https://github.com/thegetty/quire/discussions). 

Keep reading for more detailed information about what counts as a bug and why reporting them is an important way to contribute to our community. 

## What is a bug? 

An inevitable part of software development, bugs are coding errors that result in software breaking or, in the case of Quire, not working as described in our [documentation](https://quire.getty.edu/docs-v1/). For something to be considered a bug, it must be concrete and reproducible. Be prepared to provide the steps required to reproduce your bug when reporting it. 

Here are a few good examples of bugs in Quire:

- Receiving errors when running CLI commands: https://github.com/thegetty/quire/issues/671 

- Figure label and caption aren't processing markdown in the lightbox but are on the page: https://github.com/thegetty/quire/issues/687

- References key not working in page YAML: https://github.com/thegetty/quire/issues/654 

Keep in mind, anyone can report a bug! You don’t need to be a developer to spot something that appears broken. If you’re uncertain, ask about it on our [GitHub Discussions board](https://github.com/thegetty/quire/discussions) first. 

## What is not a bug?

To understand what a bug is, it’s helpful to think about what a bug is not. Here is a list of things that might be mistaken for bugs:


- A question 
- A request for advice or help
- A user error
- A new feature or enhancement request
- A suggested improvement
- Feedback 
- Something not reproducible
- You’re not certain if it’s a bug

Anything that falls into the categories above should be posted on our [GitHub Discussions board](https://github.com/thegetty/quire/discussions), where there can be an open conversation with the rest of the community.

A good example of something that is not a bug but might be mistaken for one is https://github.com/thegetty/quire/issues/26. In this case, a user is surprised because Quire does not work as expected (pop-up citations stay open after being clicked and do not close automatically.) However, Quire is working as intended (pop-ups only close after they have been clicked a second time.) Since this is not an instance of Quire being broken or working incorrectly, this serves more as a suggested improvement and should be posted on our [GitHub Discussions board](https://github.com/thegetty/quire/discussions). We track this type of feedback. If enough people find this pop-up behavior problematic we can change it. 

## Why submit a bug?

We are a small team working on a tool with many users. That is why we rely on the extra eyes of our community to help us find bugs and report them. If you spot a suspected bug, don’t assume someone else will report it. Because Quire is so flexible and customizable, you might spot an issue someone else would never encounter. 

Reporting bugs is also a rewarding way to contribute to an open-source project. Unlike proprietary software, your participation can impact the Quire experience for you and your fellow community members. As much as possible, we celebrate these types of contributions from our community, including in our newsletter and in our list of [Quire contributors](https://github.com/thegetty/quire/blob/main/CONTRIBUTING.md#quire-contributors). 

## Before reporting a suspected bug 

There are a few essential things to check before you move on to officially reporting your bug to the Quire team.  

- Make sure your bug is reproducible. In the bug report form, you must include a step-by-step approach to recreating your issue. 

- Check the [GitHub Issues tracker](https://github.com/thegetty/quire/issues) (including [closed issues](https://github.com/thegetty/quire/issues?q=is%3Aissue+is%3Aclosed)) and the [GitHub Discussions board](https://github.com/thegetty/quire/discussions) to see if the bug has already been reported, discussed, or fixed.

- Make sure you are not working with Quire version 0. You can confirm this by running the command `quire --version`. If the version number starts with 0, we cannot provide support as this version is being deprecated in favor of [version 1](https://quire.getty.edu/docs-v1/install-uninstall/).
 
- If you haven’t already, create a [GitHub account](https://github.com/signup). We use Github to host Quire’s repository, track bugs, and create a space for community discussion, so you will need an account to open a new issue or discussion.

## Complete a Bug Report Form 

Once you are certain your suspected bug has not been previously posted or discussed, it’s time for you to report it. Your bug report is more likely to be addressed quickly if it is clear, concise, reproducible, and specific. 

When you are ready, please complete our [bug report form](https://github.com/thegetty/quire/issues/new?assignees=erin-cecele%2Cgeealbers&labels=bug&template=bug_report.yaml). 

The following information will be required: 

- Title (a short description of your issue)
- Confirm you have searched existing issues 
- Expected behavior 
- Actual behavior
- Steps to reproduce 
- Quire version numbers
- Node version number
- Operating system 
- Browsers
- Terminal/Shell output 
- Supporting Info/Screenshots/Workarounds  

Here is an example of a [well-written bug report](https://github.com/thegetty/quire/issues/715) from our colleague [@geealbers](http://github.com/geealbers).

## What to expect next

Once submitted, your bug report will automatically receive a `status:triage needed` label. The Getty Quire team will then review the suspected bug and determine whether it is selected for development, backlogged, or closed because it is not a bug or is considered out of scope. Labels will be applied based on the issue type, status, and core feature that is affected. We will comment on the issue and change the labels as we have updates, workaround, and fixes. We may also tag you with questions or to request more information.

Feel free to reach out with questions or to suggest improvements to this process at [quire@getty.edu](mailto:quire@getty.edu).
