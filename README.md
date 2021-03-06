# karma-tibet

The `karma-tibet` adapter allows you to use Karma as a test runner for `TIBET`
tests.

TIBET's testing framework supports unified testing in the browser without
the need for installing Selenium or WebDriver components. Using Karma as a
test runner adds the ability to run your tests cross-browser and to integrate
more effectively with various CI environments such as Travis CI and Sauce Labs.

### Installation

Install Karma following the instructions for your platform found at
https://karma-runner.github.io/latest/intro/installation.html. For example:

``` bash
# position yourself in your TIBET project
cd {{project}}

# globally install the karma-cli module (to let you run karma easily).
npm install -g karma-cli

# locally install the karma module
npm install --save-dev karma

# locally install target browser launchers (Chrome, Firefox, Safari, IE etc.)
npm install --save-dev karma-chrome-launcher
npm install --save-dev karma-firefox-launcher
npm install --save-dev karma-safari-launcher
npm install --save-dev karma-ie-launcher
```

Once Karma is installed use the following npm command to install `karma-tibet`:

``` bash
# locally install the karma-tibet framework module
npm install --save-dev karma-tibet
```

As a post-install step the `karma-tibet` package will copy a prebuilt
`karma.conf.js` file to your TIBET project directory. If you
already have a `karma.conf.js` file it will by moved to `karma.conf.js.orig` to
preserve any settings you have in place.

Once installation is complete you should be able to run your TIBET tests using
the following command from the root of your project:

``` bash
# using the 'tibet test' command:
tibet test

# with karma-cli module installed:
karma start

# without the karma-cli module installed:
./node_modules/.bin/karma start
```


### karma.conf.js

The `karma-tibet` adapter includes a prebuilt `karma.conf.js` file which is
specifically designed to integrate with TIBET projects. This integration means
that for the most part you won't need to edit your `karma.conf.js` file but can
instead make use of TIBET's configuration system to define how you want your
tests to run.

Because TIBET is an emphatically single-page framework that boots once on
startup it's important to rely on the default configuration for karma startup
and define you test targets via normal TIBET means.

### tibet config karma

TIBET's `tibet config` command can dump current settings for karma properties at
the command line. Sample values are shown below:

```
$ tibet config karma

{
    "karma.boot.inlined": true,
    "karma.boot.minified": true,
    "karma.boot.profile": "main@developer",
    "karma.boot.teamtibet": false,
    "karma.load_path": "TIBET-INF/tibet/lib/src",
    "karma.load_script": "tibet_loader.min.js",
    "karma.port": 9876,
    "karma.proxy": 9877,
    "karma.script": ":test",
    "karma.slot": "__karma__",
    "karma.timeout": 60000
}
```

### tibet.json

Using TIBET's configuration system or directly editing the `public/tibet.json`
file allows you to modify any of the karma configuration values. For example, to
run on a specific set of browsers we might use:

```
"karma": {
    "browsers": ["Chrome", "Firefox", "Safari", "IE"]
},
```

### Troubleshooting

##### Browser Doesn't Launch

One thing that can occur if your Chrome, Firefox, or other browser installation
location doesn't match the location a particular karma launch plugin expects
is you'll type `karma start` but the browser(s) won't appear. If that happens
ensure you set the appropriate environment variables using syntax for your
platform and shell similar to:

``` bash
# Chrome
export CHROME_BIN=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

# Firefox
export FIREFOX_BIN=/Applications/Firefox420.app/Contents/MacOS/firefox
```

Note that you'll need to use the paths specific to your machine and browser
install directories, however once you get these variables set properly you
should see karma start and execute your tests properly.


### More Info

For more information see http://www.technicalpursuit.com and the TIBET wiki at
https://github.com/TechnicalPursuit/TIBET/wiki.
