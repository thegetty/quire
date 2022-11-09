## Quire CLI Source Modules

The primary entry point for the cli is the [`main.js`](/src/main.js) module in this directory.

The `Command` module is an abstract class that is used in an interface pattern for individual cli commands. Modules added to the [`src/commands/`](/src/commands/) directory are automatically registered as subcommands of the `quire` cli.

Thanks to [Fernando Doglio](https://fernandodoglio.substack.com/) for sharing [his implementation of this abstract command class pattern](https://blog.bitsrc.io/writing-an-extensible-cli-tool-in-2022-with-node-js-43eb03150be2), which inspired the implementation here.
