# Quire 

Developed by Getty, Quire is a new, multiformat publishing tool available for immediate access and use. Quire is in a limited beta, © J. Paul Getty Trust, and not yet released as open-source software. For a free license to use Quire, please complete [this form](https://docs.google.com/forms/d/e/1FAIpQLScKOJEq9ivhwizmdazjuhxBII-s-5SUsnerWmyF8VteeeRBhA/viewform).

## Quire CLI

For information on **installing, updating, and uninstalling Quire (macOS + Windows) and Quire commands** please refer to the [Quire documentation](https://quire.getty.edu/documentation/install-uninstall/). 

### **Developing the Quire CLI**

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

### **Testing the Quire CLI**

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
