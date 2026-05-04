# Quire Releases

## Before releasing

You should complete a few checks before publishing a branch for release:

- Complete the normal PR review process with quire team members and run `npm audit` in the package workspace to be released (for example `npm -w packages/cli audit` for the CLI package).

- Update the appropriate package `CHANGELOG.md` and commit the changes to the PR.

## Creating a release

After review steps have been approved, release the package in question by following a git tagging flow:

  1. Create a git tag on a branch appropriate for the package and semantic version of the release. Ensure that the version has not been published by running `npm info` (for example `npm info @thegetty/quire-cli@0.999.0-rc.50` should error). 
  
      Release candidates can be tagged from any branch but only tags on `main` can publish to `latest` and carry prime (ie, non-rc) versions.

      If your branch needs to be published to both packages use two tags.

  2. Update the package version in the repo with `npm version` to match the tag (for example `npm version -w packages/cli version 0.999.0-rc.50`) and commit the change.

  3. For the tag name, concatenate with an `@`:

      - The package name to be released, `@thegetty/quire-cli` or `@thegetty/quire-11ty`.

      - The release's semantic version with distribution tag, eg `0.9.5-rc.3`, `1.0.1`, etc.
    
      The version tail (nothing or `-rc.3`) uses npm's "distribution tag" to route versions to the release candidate or latest channels. For example, `@thegetty/quire-cli@v1.0.1` will publish to public distribution while `@thegetty/quire-cli@v.1.0.1-rc.1` will publish a release candidate version. See [*Distribution Tags*](#distribution-tags) below.

  4. Copy this release's changelog entry into the tag's message. These will become the releases' draft notes. Please use markdown, links to relevant PRs, commits, and files to orient future readers.

      Note that not all clients support multiline git tag messages so it may be necessary to use another client (or `git` directly). Tags and releases with multiline messages can also be created directly in the GitHub UI, and messages can be edited there after publishing. 

  5. Push the tag to `origin` and wait for tests to finish using quire's CI/CD pipeline to verify: https://app.circleci.com/pipelines/github/thegetty/quire.

      If individual tests fail for transient reasons (eg, github downtime, dockerhub slowness, etc), Circle's "Re-run from failed" option will help only re-run the failing sections of a test run.

  6. After testing and release pipeilne succeeds, verify releases were published to npm and GitHub:

      - `quire-cli` on npm: https://www.npmjs.com/package/@thegetty/quire-cli?activeTab=versions
      - `quire-11ty` on npm: https://www.npmjs.com/package/@thegetty/quire-11ty?activeTab=versions
      - Both packages on GitHub: https://github.com/thegetty/quire/releases

      The npm packages can also be verified with `npm info @thegetty/quire-cli` and `npm info @thegetty/quire-11ty`.

## Distribution tags

Quire uses two distribution tags on `npm`:

  - `rc`: Release candidate channel, releases are only automatically pushed to `rc`.
  - `latest`: Main public release channel.

