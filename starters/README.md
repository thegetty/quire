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

#### Pulling changes to the starter project

When changes to a starter project are commited to its `main` branch `thegetty/quire` is updated using `git subtree pull`:

```sh
git fetch quire-starter-default main
git subtree pull --prefix=starters/default quire-starter-default main --squash
```

#### Pushing changes to the starter project

Using the the `git subtree push` command with the `remote` allows us to push changes made to `@thegetty/quire` starter to the upstream starter project repository:

```sh
git subtree push --prefix=starters/default quire-starter-default main
```

For additional documentation see the [GitHub Docs: About Git subtree merges](https://docs.github.com/en/get-started/using-git/about-git-subtree-merges)
