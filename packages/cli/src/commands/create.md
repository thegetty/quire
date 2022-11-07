### Quire CLI `new` Command

#### Setup _project root directory_

1. Test if _project root directory_ exists and is an empty directory
  - if the _project root directory_ is not empty notify and return
  - create _project root directory_

#### Initialize project `init-starter`

1. Clone the starter template to the _project root directory_ and remove its `.git` directory.

2. Initialize the _project root directory_ as a new git repository.

3. Create an initial commit, something like the following

```javascript
try {
  const initialCommitMessage = translate('initialCommitMessage')
  execaSync('git add --all', { cwd: projectRoot })
  execaSync(`git commit -m "${initialCommitMessage}"`, { cwd: projectRoot })
} catch (error) {
  console.error(`Failed to initialize ${projectRoot} as a git repository.`, error)
  fs.removeSync(path.join(projectRoot, '.git'))
}
```

`locales/en/new.json`
```json
{
  "initialCommitMessage": "Initial commit of {{ projectName }}"
}
```

#### Check and install `quire-11ty` version

1. Read required `quire-11ty` version from the starter `package.json` `peerDependencies`

2. Using the `semver` module to compare version strings, test if installed versions of `quire-11ty` cover the version in the project `.quire` file.

  - If the require version does not exist in  `quire-cli/lib/quire/versions/${version}` install it.
