# TODO: Epub Implementation

After multiple false starts it is clear that a more careful approach is needed
to properly implement this feature. Many aspects of the entire Quire CLI will
need to be re-written to accomodate this.

## Separation of concerns

The core `Quire` class is getting cluttered with a lot of utilitarian helper
methods. These should be moved elsewhere into `utils.js` or similar for clarity.

A clear separation of the `make-a-new-project-from-scratch` functionality and
the `read/manage-existing-quire-project-with-arbitrary-configuration`
functionality is key.

Existing projects need the ability to install dependencies, run custom themes, etc.

## Use Promises

Wherever possible use promise-based interfaces for async operations. Juggling
multiple ways of doing this leads to more confusing code.

Use the `bluebird` promise library for consistency.

## Use an external library for Epub generation

Use the People's Epub library for this rather than writing from scratch.

## Use the Path API properly

## Refactor method names
