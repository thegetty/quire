# Quire Starter
_A Digital Publishing Framework from Getty Publications_

This is the starter template for
[Quire](http://www.getty.edu/publications/digital/platforms-tools.html), an
open-source multi-format publishing framework built on
[Hugo](https://github.com/gohugoio/hugo). Quire consists of:

- [quire-cli](https://github.com/gettypubs/quire-cli)
- [quire-starter](https://github.com/gettypubs/quire-starter)
- [quire-starter-theme](https://github.com/gettypubs/quire-starter-theme)
- [quire-docs](https://github.com/gettypubs/quire-starter)

## Getting Started

### Quire-CLI

There are two ways to get started using this template for your own projects. If
you are using the [quire-cli](https://github.com/gettypubs/quire-cli), this
template is what you will see after running the `quire new` command in a
terminal session.

To start development on your own project, navigate into your project directory
and run `quire preview` to see changes locally, and `quire build` output static
files. The `quire pdf` and `quire epub` commands are also available if you are
generating other formats for your publication.

### Manual setup

Alternatively, you can clone this repository and begin using it directly. In
that case you will probably want to "flatten" the starter kit and it's
accompanying theme into a single repository so you can keep track of your work
in your own Git repository. You only need to follow these steps if you *are not*
using the `quire` command-line tool (it will take care of that for you).

1. Clone the kit and its theme submodule: 
   `git clone --recursive https://github.com/gettypubs/quire-starter.git`
2. Change into the kit directory and remove the submodule from the repo's tree: 
   `git rm --cached themes/quire-starter-theme`
3. Remove the `.gitmodules` file: `rm .gitmodules`
4. Add the contents of the theme directory to the repo and commit them: 
   `git add themes/quire-starter-theme`
5. Make sure you have a new remote set up to push changes to as you make them.

Quire is built on top of Hugo, so even without the Quire CLI tool you can still
preview or build your project the same as you would in any other Hugo website
(`hugo server`, etc.). In order to see any changes you've made to the theme
files however, you will also need to run Webpack in the
`themes/quire-starter-theme` subfolder (make sure to install the necessary
dependencies there first!). To simulate the `quire preview` experience you will
need to run `hugo server` in the project root and 
`./node_modules/.bin/webpack --watch` in the `themes/quire-starter-theme`
subfolder.

## Deployment

At some point you will probably want to publish what you have built so that it
can be shared with the wider world. Quire currently supports two methods of
deployment: Netlify and Github Pages. Both of these services are fast, free, and
fairly easy to setup. 

### Deploying to Netlify

Assuming you have created a repository for this project on GitHub, sign up or
log in to [Netlify](https://www.netlify.com/) using your GitHub account.

1. Click the big button labeled *new site from Git*
2. Select your repository
3. Configure the basic build settings: choose appropriate branch (`master` by
   default)
4. You can set the default build command to `hugo` and the publish directory to
   `public/`, but this is not necessare since the `netlify.toml` file has all the
   information pre-configured.
5. Netlify will auto-generate a site URL for you, or you can set it yourself.
   The default example uses `http://quire-demo.netlify.com`. Set this as your
   `baseURL` in `config.build.yml`, and set `relativeURLs: true`
6. Now, every time you push up a commit to `master` on GitHub, Netlify will
   automatically rebuild your site using the settings in `netlify.toml`.
   Pretty cool!

### Deploying to GitHub Pages

If you don't need all the features of Netlify, Quire has limited support for
GitHub pages as well, but there are a few caveats. Unlike Netlify, GitHub Pages
does not support continuous deployment for Hugo/Quire websites. This means you
will need to manually deploy the site by running a script provided in
`bin/deploy.sh` in the project folder.

In `config.build.yml`, comment out the Netlify lines and uncomment the GH Pages
settings. Your `baseURL` will need to be in the format that GitHub Pages expects
(https://yourusername.github.io/projectname for most sites). Setting 
`canonifyURLs: true` will help to avoid broken links.

Finally, you will need to remove the `public/` directory from your `.gitignore`
file so that you can check built files into version control.

At this point you can run `bin/deploy.sh` and everything will be pushed up to
GitHub on the `gh-pages` branch. It may take a few moments for everything to
become visible online.

If you get git errors when deploying because of upstream changes, you can always
delete the `gh-pages` branch on GitHub and re-run the deploy script.

### Deploying Elsewhere

Any web server capable of hosting static files will work (S3, FTP server, etc.),
but you will likely need to customize the values in `config.build.yml` to suit
your needs.


