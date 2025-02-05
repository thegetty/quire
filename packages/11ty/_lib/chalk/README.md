## A façade module for the `chalk` library

A logging concern for Quire/11ty implemented using [debug.js](https://github.com/debug-js/debug) and [chalk](https://github.com/chalk/).

Log lines are in the format: `[quire] component:subComponent LEVEL ...message...`.

Log level selection responds to globs on the `DEBUG` environment variable as it does for [11ty]() so `cross-env DEBUG='Eleventy*,*quire*' eleventy` will turn on logging for Eleventy itself and for quire while `cross-env DEBUG='*quire*' eleventy` will emit logs for only quire.