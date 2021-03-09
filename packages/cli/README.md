# Quire CLI

For information on **installing, updating, and uninstalling Quire (macOS + Windows) and Quire commands** please refer to the main [README.md](https://github.com/thegetty/quire/blob/main/README.md) for this repository. 

## **Developing the Quire CLI**

1. Enter the quire root directory
    ```tx
    cd quire/packages/cli
    ```
2. Install devDependencies 
    ```tx
    npm install
    ```
3. Run Rollup.JS watch command to build as you make changes to the files or you can also build at any time with build
    ```bash
    # watch command
    npm run watch
    # build command
    npm run build
    ```
4. The Quire CLI core code is under lib/ with an entry point of `index.js`

5. If running the watch command `Control + C` to quit

## **Testing the Quire CLI**

1. Enter the quire root directory
    ```tx
    cd quire/packages/cli
    ```
2. Install devDependencies 
    ```tx
    npm install
    ```
3. Run Jest test command to run tests against the Quire CLI (**Must have completed the entire Quire CLI install process before testing.**)
    ```tx
    npm run test

## License

Copyright © 2021, J Paul Getty Trust.
