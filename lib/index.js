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
 * @overview The server-side portion of the karma-tibet framework plugin, loaded
 *     by Karma and executed in the server-side process. Functionality here is
 *     simple; we tell Karma to inject the tibet_loader script and the
 *     client-side of the adapter into each browser being targeted. The adapter
 *     code invokes the TP.launch call using parameters pulled from the
 *     tibet.json file's "karma" key to determine boot values, test suite, etc.
 *     See the adapter.js file for more information on specific parameters.
 */

//  ----------------------------------------------------------------------------

/* eslint indent:0 */
(function(root) {
    var path,
        fs,
        cwd,
        files,
        fullpath,
        offset,
        init;

    path = require('path');
    fs = require('fs');

    cwd = process.cwd();

    //  ---
    //  tibet.json
    //  ---

    fullpath = path.join(cwd, 'tibet.json');
    if (!fs.existsSync(fullpath)) {
        files = fs.readdirSync(cwd);
        files.some(function(file) {
            var stat;

            stat = fs.lstatSync(path.join(cwd, file));
            if (stat.isDirectory()) {
                fullpath = path.join(cwd, file, 'tibet.json');
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

    //  ---
    //  offset
    //  ---

    //  If tibet.json was found under a directory relative to the current path
    //  we need to know that offset for path computation below.
    offset = fullpath.replace(cwd, '');
    offset = offset.replace('tibet.json', '');

    /**
     * @method init
     * @summary The server-side karma-tibet initializer. Performs any setup
     *     necessary to initialize the server-side of the TIBET-Karma bridge.
     * @param {Object} config The Karma config object. See Karma documentation.
     */
    init = function(config) {
        var files,
            json,
            loader,
            loadpath;

        //  Load TIBET's configuration file to check for karma settings.
        json = require(fullpath);

        //  Capture file list so we can insert the files we need supported.
        files = config.files;

        //  TIBET-Karma bridge, the client-side adapter which calls TP.launch.
        files.unshift({
            pattern: path.join(__dirname, 'adapter.js'),
            served: true, included: true, watched: false, nocache: true
        });

        //  TIBET's boot system script. default is tibet_loader.min.js but you
        //  can override by providing the name of another file (without path).
        if (json && json.karma) {
            loader = json.karma.load_script;
            loadpath = json.karma.load_path;
        }

        loader = loader || 'tibet_loader.min.js';
        loadpath = loadpath || 'TIBET-INF/tibet/lib/src';

        loader = path.join(process.cwd(), offset, loadpath, loader);

        //  The TIBET loader should be injected as well, we're not using
        //  index.html (Karma doesn't play nice with html files).
        files.unshift({
            pattern: loader,
            served: true, included: true, watched: false, nocache: true
        });
    };

    //  Inject the Karma configuration block into our init call as a parameter.
    init.$inject = ['config'];

    //  Describe the framework as 'tibet' and provide the startup hook.
    module.exports = {
        'framework:tibet': ['factory', init]
    };

}(this));

//  ----------------------------------------------------------------------------
//  end
//  ============================================================================
