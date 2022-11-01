## Quire Starter Project Templates

Quire project starter templates are managed as `subtree` dependencies of the `@thegetty/quire` monorepo. The `subtree` is a reference to another repository (URL and branch/tag).

### Adding a starter project dependency

First, the starter project repository is added as a Git `remote` using
`git remote add --fetch <name> <remote-repository-url>`. For example:

```sh
git remote add --fetch quire-starter-default https://github.com/thegetty/quire-starter-default.git
```

Next, the Quire starter project repository is added to the `@thegetty/quire` monorepo as a dependency. The `git subtree` command is run from the top level of the working tree to clone the remote repository into local repository directory: `git subtree add --prefix=<local-path-prefix> <remote-repository-url> <remote-repository-branch>`.

Continuing the example above, the `@thegetty/quire-starter-default` repository is cloned into `@thegetty/quire/starters/default` by running the command:

```sh
git subtree add --prefix=starters/default quire-starter-default main --squash
```

### Updating a starter project dependency

#### _Pulling changes from the starter project repository_

When changes to a starter project are commited to its `main` branch `thegetty/quire` is updated using `git subtree pull`:

```sh
git fetch quire-starter-default main
git subtree pull --prefix=starters/default quire-starter-default main --squash
```

#### _Pushing changes to the starter project repository_

Using the the `git subtree push` command changes made to `@thegetty/quire` starter are pushed to the `remote` repository for the starter project:

```sh
git subtree push --prefix=starters/default quire-starter-default main
```

For additional documentation see the [GitHub Docs: About Git subtree merges](https://docs.github.com/en/get-started/using-git/about-git-subtree-merges)


### Listing starter project subtrees

Subtrees in the `@thegetty/quire` repository can be listed using `git log`:

```sh
git log | grep git-subtree-dir | tr -d ' ' | cut -d ':' -f2 | sort | uniq
```

or

```sh
git log | grep git-subtree-dir | awk '{ print $2 }' | sort | uniq
```

The above shell command can be expanded to exclude subtree directories that do not exist in the repository:

```sh
git log | grep git-subtree-dir | awk '{ print $2 }' | sort | uniq | xargs -I {} bash -c 'if [ -d $(git rev-parse --show-toplevel)/{} ] ; then echo {}; fi'
```
