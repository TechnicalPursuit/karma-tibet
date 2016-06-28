//  ============================================================================
/**
 * @copyright Copyright (C) 1999 Technical Pursuit Inc. (TPI) All Rights
 *     Reserved. Patents Pending, Technical Pursuit Inc. Licensed under the
 *     OSI-approved Reciprocal Public License (RPL) Version 1.5. See the RPL
 *     for your rights and responsibilities. Contact TPI to purchase optional
 *     privacy waivers if you must keep your TIBET-based source code private.
 */
//  ============================================================================

/**
 * @overview Karma test runner configuration specific to TIBET projects. Under
 *     normal circumstances you shouldn't need to alter this file, you can use
 *     a "karma" block in your project's tibet.json file to set properties which
 *     drive the various settings of your karma-tibet configuration.
 */

//  ----------------------------------------------------------------------------

/* eslint indent:0, no-console:0, no-extra-parens:0 */
(function(root) {

var app,
    browsers,
    express,
    files,
    fs,
    fullpath,
    http,
    json,
    level,
    path,
    plugins,
    launchers,
    port,
    proxy,
    timeout;

//  ----------------------------------------------------------------------------
//  TIBET Configuration Data
//  ----------------------------------------------------------------------------

    path = require('path');
    fs = require('fs');

    fullpath = path.join(__dirname, 'tibet.json');
    if (!fs.existsSync(fullpath)) {
        files = fs.readdirSync(__dirname);
        files.some(function(file) {
            var stat;

            stat = fs.lstatSync(path.join(__dirname, file));
            if (stat.isDirectory()) {
                fullpath = path.join(__dirname, file, 'tibet.json');
                if (fs.existsSync(fullpath)) {
                    return true;
                }
            }

            fullpath = null;
            return false;
        });
    }

    if (!fullpath) {
        console.error('Unable to find TIBET configuration file tibet.json.');
        process.exit(1);
    }

    //  Load TIBET's configuration file to check for karma settings.
    json = require(fullpath);

    if (json && json.karma) {

        if (json.karma.browsers) {
            browsers = json.karma.browsers;
        }

        if (json.karma.level) {
            level = json.karma.level;
        }

        if (json.karma.plugins) {
            plugins = json.karma.plugins;
        }

        if (json.karma.port) {
            port = json.karma.port;
        }

        if (json.karma.proxy) {
            proxy = json.karma.proxy;
        }

        if (json.karma.timeout) {
            timeout = json.karma.timeout;
        }
    }

    //  Default the values needed by both karma and our proxy server here.
    port = port || 9876;
    proxy = proxy || (port + 1);

//  ----------------------------------------------------------------------------
//  Karma Configuration Data
//  ----------------------------------------------------------------------------

module.exports = function(config) {

    //  Default karma-only settings while inside function where config is valid.
    browsers = browsers || ['Chrome'];
    level = (level !== undefined) ? level : config.LOG_INFO;
    timeout = timeout || 15000;

    //  The PhantomJS launcher for karma doesn't use the proxy and so we have to
    //  do the heavier approach of copying the entire project so it can be
    //  served by the karma web server.
    files = [];
    if (browsers.indexOf('PhantomJS') !== -1) {
        files.unshift({
            pattern: path.join(__dirname, 'public/**/*.*'),
            served: true, included: false, watched: false, nocache: true
        });
    }

    launchers = {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    };

    if (process.env.TRAVIS) {
        browsers = ['Chrome_travis_ci'];
    }

    plugins = plugins || browsers.map(function(item) {
        return 'karma-' + item.toLowerCase() + '-launcher';
    });

    config.set({

    //  ------------------------------------------------------------------------
    //  Stuff You May Want To Change
    //  ------------------------------------------------------------------------

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits, otherwise you
    // hit the DEBUG button to run tests and can re-run via reload etc.
    singleRun: true,

    // start these browsers for testing
    // See https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,

    customLaunchers: launchers,

    // options include: config.LOG_DISABLE ||
    // config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: level !== undefined ? level : config.LOG_INFO,

    // preprocess matching files before serving them to the browser?
    // See https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use. possible values: 'dots', 'progress'.
    // See https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // enable / disable executing tests whenever any file changes
    autoWatch: false,

    //  ------------------------------------------------------------------------
    //  The Other Stuff
    //  ------------------------------------------------------------------------

    frameworks: ['tibet'],

    useIframe: true,

    urlRoot: '/',

    basePath: '',

    port: port,

    //  Note we create a small express server to serve "static" content which
    //  runs on the proxy port defined here. This lets TIBET boot without any
    //  overhead in copying the entirety of TIBET and your application into a
    //  temp directory. It also avoids other Karma issues with file mappings.
    proxies: {
        '/base/': 'http://127.0.0.1:' + proxy + '/'
    },

    //  Pass tibet.json data along as client arguments so the client-side logic
    //  can access those boot parameters. Note we only pass any karma block that
    //  might exist.
    client: {
        args: [JSON.stringify(json.karma || {})]
    },

    //  Yes, there are no files. The adapter loads TIBET and it does the rest.
    //  Adding files will in most cases cause things to fail to boot properly
    //  and creates a ton of overhead on startup while it copies your entire
    //  TIBET project to another directory just so it can serve the same files.
    files: files,

    //  No files, so no need to exclude anything. Don't add exclusions here or
    //  it's likely to cause the TIBET boot process/testing to fail.
    exclude: [],

    //  Tell Karma how long to wait (for boot etc) before inactivity disconnect.
    //  This is necessary since Karma "connects" quickly but depending on your
    //  TIBET boot configuration it can be close to 10 seconds (the default
    //  timeout) before TIBET starts sending output to Karma for testing.
    browserNoActivityTimeout: timeout,

    //  Tell Karma how long to wait for the browser to try to reconnect
    //  (sometimes the browser disconnects) before terminating the testing
    //  session.
    browserDisconnectTimeout: timeout
    });
};

//  ----------------------------------------------------------------------------
//  Micro-Server For TIBET Loading
//  ----------------------------------------------------------------------------

/*
 * We don't want to have to start/stop a separate server instance to launch
 * TIBET properly so we create an ultralight version of a server here that
 * the tibet_loader can take advantage of to acquire the resources it needs.
 * This avoids the necessity of telling Karma about files that aren't tests and
 * having it copy them all just so it can serve them from a temp directory.
 */
express = require('express');
http = require('http');

app = express();
app.use(express.static(__dirname));
http.createServer(app).listen(proxy);

}(this));

//  ----------------------------------------------------------------------------
//  end
//  ============================================================================
