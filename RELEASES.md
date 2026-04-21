# Quire Releases

## Before releasing

- Complete the normal PR review process with quire team members and run `npm audit` in the package workspace to be released (for example `npm -w packages/cli audit` for the CLI package).

- Update the package version with `npm -w packages/cli version minor` or manual editing.

- Update the appropriate package `CHANGELOG.md` and commit the changes to the PR.

## Creating a release

After review steps have been approved, release the package in question by following a git tagging flow:
  1. Create a tag on `main` appropriate for the package and semantic version of the release. 

  For the name, concatenate one of `cli`, `11ty`, or `cli+11ty` for the package(s) to be released and the release's semantic version with a `-` (`cli-v1.0.1`, `11ty-v1.0.1`, `cli+11ty-v1.0.1`). The tag's message will become the release notes for the package(s).

  Markdown, etc, is fine to use in the message text. 

  2. Push the tag to `main`.

  3. Verify in quire's CI/CD pipeline that the release job succeeded: https://app.circleci.com/pipelines/github/thegetty/quire .

  4. Perform any further release QA as appropriate and manually tag and releases headed for the general public channels with `npm dist-tag add @thegetty/quire-cli@1.0.1 latest` (for example).

## Distribution tags

Quire uses two distribution tags on `npm`:
  - `latest`: Main public release channel
  - `rc`: Release candidate channel, releases are only automatically pushed to `rc`.

