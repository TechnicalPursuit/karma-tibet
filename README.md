# karma-tibet

The `karma-tibet` adapter allows you to use Karma as a test runner for `TIBET`
tests.

TIBET's testing framework supports unified testing in the browser without
the need for installing Selenium or WebDriver components. Using Karma as a
test runner adds the ability to run your tests cross-browser and to integrate
more effectively with various CI environments such as Travis CI and Sauce Labs.

### Installation

First you'll want to install Karma following the instructions for your platform
found at http://karma-runner.github.io/

Once Karma is installed use the following npm command to install the adapter:

```
$ npm install --save-dev karma-tibet
```

As a post-install step the karma-tibet package will copy a prebuilt
`karma.conf.js` file to your TIBET project directory. If you
already have a `karma.conf.js` file it will by moved to `karma.conf.js.orig` to
preserve any settings you have in place.

Once installation is complete you should be able to run your TIBET tests using
the following command from the root of your project:

```
$ karma start
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

TIBET's config command will dump current settings for karma properties by using
the command line. Current values are shown below:

```
$ tibet config karma

{
    "karma.boot.profile": "app#contributor",
    "karma.boot.unminified": false,
    "karma.boot.unpackaged": false,
    "karma.loader": "tibet_loader.min.js",
    "karma.port": 9876,
    "karma.proxy": 9877,
    "karma.script": ":test",
    "karma.slot": "__karma__",
    "karma.timeout": 15000
}
```

### tibet.json

Using TIBET's configuration system or directly editing the `tibet.json` file
allows you to modify any of the karma configuration values. For example, to run
on a specific set of browsers we might use:

```
"karma": {
    "browsers": ["Chrome", "PhantomJS", "Firefox"]
},
```

### More Info

For more information see http://www.technicalpursuit.com and the TIBET wiki at
https://github.com/TechnicalPursuit/TIBET/wiki.
