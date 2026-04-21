# Quire Releases

## Before releasing

- Complete the normal PR review process with quire team members and run `npm audit` in the package workspace to be released (for example `npm -w packages/cli audit` for the CLI package).

- Update the package version with `npm -w packages/cli version minor` or manual editing.

- Update the appropriate package `CHANGELOG.md` and commit the changes to the PR.

## Creating a release

After review steps have been approved, release the package in question by following a git tagging flow:
  1. Create a tag on `main` appropriate for the package and semantic version of the release. 

  2. For the tag name, concatenate with a `-`:
    - One of `cli`, `11ty`, or `cli+11ty` for the package(s) to be released
    - The release's semantic version (`v1.0.1`).
    - The distribution tag to use: use an empty string for `latest` or `rc` with a candidate version. For example, `cli-v1.0.1` for public distribution vs `cli-v.1.0.1-rc.1` during release candidate QA. See [below](#distribution-tags)

  3. The tag's message will become the release notes for the package(s). Markdown, etc, is encouraged for use in the message text. 

  4. Push the tag to `origin`.

  5. Verify in quire's CI/CD pipeline that the release job succeeded: https://app.circleci.com/pipelines/github/thegetty/quire .

## Distribution tags

Quire uses two distribution tags on `npm`:
  - `rc`: Release candidate channel, releases are only automatically pushed to `rc`.
  - `latest`: Main public release channel.

