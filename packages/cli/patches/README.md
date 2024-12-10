## Quire CLI Patches

Patches in this directory are applied to locally installed `node_modules` by the npm `postinstall` script ([npm scripts docs](https://docs.npmjs.com/cli/v10/using-npm/scripts)).

See [`patch-package`](https://github.com/ds300/patch-package) documenation for [making](https://github.com/ds300/patch-package#making-patches), [updating](https://github.com/ds300/patch-package#updating-patches), [applying](https://github.com/ds300/patch-package#applying-patches) and [reversing](https://github.com/ds300/patch-package#applying-patches) patches.

*Nota bene*

Patching the `quire-cli` package dependencies changes the way in which it must be must be installed. When installing the `quire-cli` as a _local package dependency_ the `--install-strategy=nested` flag must be used as follows

```sh
npm install quire-cli --install-strategy=nested
```

Installing the `quire-cli` as a global npm module has not changed,

```sh
npm install quire-cli --global
```
