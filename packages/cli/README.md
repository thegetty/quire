# quire-cli

{{< q-class "box warning" >}}
- Quire is in a limited beta, © J. Paul Getty Trust, and not yet released as open source software. For a free license to use Quire for your publication projects (and for additional access to support) [please sign up](https://goo.gl/forms/Ih4SOHje0Z9dm3C73).
{{< /q-class >}}

## macOS Installation

Installing and running Quire requires using the Terminal {{< q-def "command-line shell" >}}. Open it from your Applications/Utilities folder or by pressing Command–Space Bar and typing “Terminal”. If you are new to the command-line, read our tutorial [*Working in a Command-line Shell*](/learn/tutorial/#1-working-in-a-command-line-shell).

### Quick Install

If you’re eager to get started, this will install the complete Quire package but without e-book or PDF output capability. These may be added later, by following steps 3–5 in the Full Install guidelines below.

1. In Terminal, install Apple’s Xcode with: `xcode-select --install`
2. Download and install the **LTS** version of Node.js: [https://nodejs.org](https://nodejs.org)
3. In Terminal, install Quire with: `npm install --global @thegetty/quire-cli`
4. Confirm installation by pulling up a list of Quire commands: `quire --help`

The Quire installation process may take a minute or two, during which time there will be messaging output in Terminal. The only messages of any concern are those labeled as ERROR or ERR. If you see these errors, or if you see "command not found" after entering `quire --help` in step 4., search our [Discussions Forum](https://github.com/thegetty/quire/discussions) to troubleshoot installation issues.

### Full Install

Follow the steps below to first install the support software for Quire, and then Quire itself.

1. **Apple’s Xcode** is a set of developer tools for your mac. More information can be found [here](https://en.wikipedia.org/wiki/Xcode). Install Apple's Xcode by copying and pasting the following command and pressing enter. If Xcode is not already installed, an additional alert notification will pop up. Click “Install” and follow the prompts.

    ```text
    xcode-select --install
    ```

2. **Node.js** enables you to run javascript on your computer. Visit the Node.js site, and download and install the older LTS (long-term support) version, which is sufficient and more stable than the higher “Current” version that is also available for download: [https://nodejs.org](https://nodejs.org).

3. **Pandoc** serves two purposes in Quire: You can use it to [convert Word documents to Markdown](/fundamentals/#microsoft-word-to-markdown-conversion), and it enables you to create EPUB e-book files of your Quire project with the `quire epub` command. Download the macOS installer, double-click it and follow the prompts to install: https://pandoc.org/installing.html

4. **Kindle Previewer**, along with Pandoc, enables you to create MOBI e-book files of your Quire project with the `quire mobi` command. Visit Amazon’s Kindle Previewer page and download the Mac version: https://kdp.amazon.com/en_US/help/topic/G202131170. Install by double clicking the icon and following the prompts.

5. **PrinceXML** enables you to create a PDF version of your Quire project with the `quire pdf` command. Visit the PrinceXML site, download the Mac OS version, uncompress the folder, and rename it to "prince": [http://www.princexml.com/download/](http://www.princexml.com/download/).

    Open Terminal and type these lines in, hitting enter after each:

    ```text
    cd Downloads/prince
    sudo ./install.sh
    ```

    You will be prompted to enter your computer password. Press enter. You should receive a message that PrinceXML will be installed in the `/usr/local` directory. Press enter again. If successful you will see a message in the Terminal saying "installation complete." Or, if you get a "no such file or directory" message after the first line, the file you dowloaded is either not in your Downloads folder, or is not named "prince". Correct as necessary and try again.

    When complete, type `cd` into the Terminal to return to your {{< q-def "home directory">}}.

    ```text
    cd
    ```

6. **Quire** is operated through a {{< q-def "command-line interface" >}} (CLI) that enables you to create, preview and output publications using Terminal with commands like `quire new`, `quire preview` and `quire site`. You can learn more in the [*Quire Commands*](/documentation/quire-cli/) chapter of our guide. Copy and paste the following line into Terminal to install Quire:

    ```text
    npm install --global @thegetty/quire-cli
    ```

    The Quire installation process may take a minute or two, during which time there will be messaging output in Terminal. The only messages of any concern are those labeled as ERROR or ERR. These likely indicate a failed installation.

    To verify installation, enter the command below. This will give you a list of [commands](/documentation/quire-cli/) that will help you get started using and navigating Quire. And if you get "command not found" it means it was not installed correctly.

    ```text
    quire --help
    ```

    Search or post to our [Discussions Forum](https://github.com/thegetty/quire/discussions) to troubleshoot installation issues.

## Windows Installation

Installing Quire requires using Windows PowerShell {{< q-def "command-line shell" >}} as an Administrator. Open it by right clicking on Start and selecting “Windows PowerShell (Admin)”, or search for it in the search bar and select “Run as Administrator”. If you are new to the command-line, read our tutorial [*Working in a Command-line Shell*](/learn/tutorial/#1-working-in-a-command-line-shell).

### Quick Install

If you’re eager to get started, this will install the complete Quire package but without e-book or PDF output capability. These may be added later, by following steps 3–5 in the Full Install guidelines below.

1. Download and install Git for Windows: https://gitforwindows.org/
2. Download and install the **LTS** version of Node.js: [https://nodejs.org](https://nodejs.org)
3. In Windows PowerShell (Admin), install Windows Build Tools with: `npm install --g --production windows-build-tools`
4. In Windows PowerShell (Admin), install Quire with: `npm install --global @thegetty/quire-cli`
5. Confirm installation by pulling up a list of Quire commands: `quire --help`

The Quire installation process may take a minute or two, during which time there will be messaging output in PowerShell. The only messages of any concern are those labeled as ERROR or ERR. If you see these errors, or if you see "command not found" after entering `quire --help` in step 5., search our [Discussions Forum](https://github.com/thegetty/quire/discussions) to troubleshoot installation issues.

### Full Install

1. **Git for Windows** installs useful version control software on your computer. Download the EXE installer file at https://gitforwindows.org/, click on it and hit "run", you should see a setup wizard screen that will install Git for Windows. During the installation, use the default settings.

2. **Node.js** enables you to run javascript on your computer. Visit the Node.js site, and download and install the older LTS (long-term support) version, which is sufficient and more stable than the higher “Current” version that is also available for download. The MSI installer will be downloaded, open it and a setup wizard screen will guide you through the process: [https://nodejs.org](https://nodejs.org).

3. **Pandoc** serves two purposes in Quire: You can use it to [convert Word documents to Markdown](/fundamentals/#microsoft-word-to-markdown-conversion), and it enables you to create EPUB e-book files of your Quire project with the `quire epub` command. Download the Pandoc MSI installer file, open it and a setup wizard screen will guide you through the process: https://pandoc.org/installing.html

4. **Kindle Previewer**, along with Pandoc, enables you to create MOBI e-book files of your Quire project with the `quire mobi` command. Visit Amazon’s Kindle Previewer page and downoad the Widows version: https://kdp.amazon.com/en_US/help/topic/G202131170. Install by double clicking the icon and following the prompts.

5. **PrinceXML** enables you to create a PDF version of your Quire project. At https://www.princexml.com/download/, download either the 32-bit or 64-bit EXE installer depending on your operating system. (If you’re not sure of your system  open the Settings app by pressing Windows+I. Go to System > About and look for the “System type” entry on the right side.) Click on the downloaded file and hit "run", you should see a setup wizard screen that will guide you through install.

6. **Windows Build Tools** is a set of developer tools for your PC. To install them, open PowerShell as administrator, type the following command, and hit enter:

    ```text
    npm install --g --production windows-build-tools
    ```

    This command installs c++ 2015 build tools and python 2 required for node-gyp. The process will take some time and you’ll see the starting prompt with the name of your computer once it’s complete.

6. **Quire** is operated through a {{< q-def "command-line interface" >}} (CLI) that enables you to create, preview and output publications using Windows PowerShell with commands like `quire new`, `quire preview` and `quire site`. You can learn more in the [*Quire Commands*](/documentation/quire-cli/) chapter of our guide. Copy and paste the following line into PowerShell to install Quire:

    ```text
    npm install --global @thegetty/quire-cli
    ```

    The Quire installation process may take a minute or two, during which time there will be messaging output in PowerShell. The only messages of any concern are those labeled as ERROR or ERR. These likely indicate a failed installation.

    To verify installation, enter the command below. This will give you a list of [commands](/documentation/quire-cli/) that will help you get started using and navigating Quire. And if you get "command not found" it means it was not installed correctly.

    ```text
    quire --help
    ```

    Search or post to our [Discussions Forum](https://github.com/thegetty/quire/discussions) to troubleshoot installation issues.

## Update Quire

{{< q-class "box warning" >}}
- Updating Quire will not effect your existing projects. It will only take effect on any new projects you start after updating.
{{< /q-class >}}

To update Quire to the latest version, you can run the single install command again. In your command-line shell (Terminal on macOS and PowerShell in Administrator mode on Windows), type the following text and hit enter:

```text
npm install --global @thegetty/quire-cli
```

Note that while any *new* projects you start at this point will use the latest version of Quire just installed, older, previously started projects will remain untouched. This is to avoid any unforeseen and unintended changes to publications that are completed or in progress as the version of Quire you use can effect layouts of a page, availablility of features, etcetera.

While it will not make changes to older projects, you should still be able to run commands from the new version of Quire on old Quire projects. Commands like `quire preview` and `quire pdf`. If you run into trouble with this and find commands do not run as intended or you see errors logged in your command-line, search or post to our [Discussions Forum](https://github.com/thegetty/quire/discussions) for help.

### Update an Existing Project

If you have an existing project that you want to migrate to a newer version of Quire, we recommend the following process:

1. Update Quire following the instructions above.
2. Start a new quire project.
3. Delete the `content`, `data`, `static` and `layouts` folders in the new project, and replace them with those from your old project.
4. Copy over any style customization changes you made in the `themes/default/layouts/source/css/variables.scss` file or others. (In older versions of Quire this file would be `themes/quire-starter-theme/layouts/source/css/variables.scss`.)

Run `quire preview --verbose` to test. If you see errors logged in the command-line, or if the preview doesn’t display as intended on http://localhost:1313/, search our [Discussions Forum](https://github.com/thegetty/quire/discussions) for help.

## Uninstall Quire

In your command-line shell (Terminal on macOS and PowerShell in Administrator mode on Windows), type the following text and hit enter:

```text
npm uninstall --global @thegetty/quire-cli
```

This will only uninstall Quire itself. External software you installed as part of Quire (inlcuding Node.js, Pandoc, Kindle Previewer, and PrinceXML) will need to be uninstalled individually according to the directions they provide.

## **Developing the Quire CLI**

1. Enter the quire root directory
    ```tx
    cd quire-cli
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
    cd quire-cli
    ```
2. Install devDependencies 
    ```tx
    npm install
    ```
3. Run Jest test command to run tests against the Quire CLI (**Must have completed the entire Quire CLI install process before testing.**)
    ```tx
    npm run test
    ```
## Quire Commands 

Quire Commands are typically run from Terminal on a Mac and Git Bash (or its equivalent) on a PC. They control creating, previewing, and outputting Quire projects. The following commands are available.

{{< q-class "box tip" >}}
- Run `quire --help` in your command-line shell for a full list of the Quire commands and options defined below.
{{< /q-class >}}

### Start and Preview Projects

`quire new project-name`
: Create a new Quire project named `project-name` in the current directory. The name can be anything, but shouldn’t contain spaces or special characters.

`quire preview`
: Run a local server to preview the project in a browser. Defaults to previewing at http://localhost:1313/, but will use other port numbers (such as http://localhost:6532/) if 1313 is busy. The specific address will be listed in your command-line terminal after running the command. If you’re having any issue with the preview, try running `quire preview --verbose` instead. This outputs error, warning, and other processing information that can sometimes be useful in troubleshooting.

`quire install`
: Install this project's theme dependencies when you update or change themes.

`quire stop`
: Stop the preview from running. This can also be done by typing Control-C.


### Output Files

`quire site`
: Build the final web files for your publication into its `site` directory. These include all the pages, images, and styles necessary for your project, and can be hosted on any web server.

`quire pdf`
: Generate a PDF version of your publication into its `static/downloads/` directory as `output.pdf`.

`quire epub`
: Generate an EPUB version of your publication into its `static/downloads/` directory as `output.epub`.

`quire mobi`
: Generate an MOBI (Kindle) version of your publication into its `static/downloads/` directory as `output.mobi`.

---

For the PDF, EPUB, and MOBI commands you can specify a new filename with the `--file` option.

```
quire pdf --file=photography
```

Outputs as: `static/downloads/photography.pdf`

Or you can specify a name and an alternative file path. If the directories don’t already exist in your project, Quire will create them and output the file there. We recommend always outputting somewhere into the `static` directory as this will automatically be included in your project when you run `quire site` to output the final web files.

```
quire epub --file=static/ebooks/photography
```

Outputs as: `static/ebooks/photography.epub`.

---

Also for the PDF, EPUB, and MOBI commands, developers may  use the `--env` option to specify and environmental variable.


### Customize File Templates

`quire template epub`
: Download the built-in template for customization of the cover and title pages of the EPUB and MOBI files Quire outputs. `epub/template.xhtml` All other template customization (for the website and pdf/print versions) is done in the `theme` directory.

### Get Help

`quire -V` `quire --version`
: Output the version number.

`quire -h` `quire --help`
: Output usage information.

`quire preview --verbose`
: Show verbose output in the command-line. Includes warnings, errors, and process information.

`quire debug`
: Development use only. Log info about current project.


## License

Copyright (c) 2021, J Paul Getty Trust.
