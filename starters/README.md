## Quire Starter Project Templates

Quire project starter templates are managed as `subtree` dependencies of the `@thegetty/quire` monorepo.

### Adding a starter project dependency

First, the starter project repository is added as a Git `remote`:

```sh
git remote add --fetch quire-starter-default https://github.com/thegetty/quire-starter-default.git
```

Next, the Git `subtree` command is used to add the Quire starter project repository as a dependency; the `@thegetty/quire-starter-default` repository is duplicated into the `@thegetty/quire/starters/default` directory:

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
