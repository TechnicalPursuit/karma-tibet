/**
 * Simple post-install script to copy the karma.conf.js file necessary for
 * running TIBET tests successfully through Karma to the containing project.
 */

(function() {
    var path,
        sh,
        src,
        dest;

    path = require('path');
    sh = require('shelljs');

    src = path.join(__dirname, '..', 'karma.conf.js');

    // Since the CLI can be invoked from anywhere we need to be explicit here
    // relative to the cwd. If we find a project file, and it's 'tibet' we're
    // truly _inside_ the library.
    dir = __dirname;
    file = 'package.json';
    while (dir.length > 0) {
        fullpath = path.join(dir, file);
        if (sh.test('-f', fullpath)) {
            //  First one we find will be the karma-tibet module itself. Keep
            //  going until we find the "consumer" of this module.
            if (require(fullpath).name !== 'karma-tibet') {
                dest = dir;
                break;
            }
        }
        dir = dir.slice(0, dir.lastIndexOf(path.sep));
    }

    if (!dest) {
        console.error('Unable to locate project root directory.');
        process.exit(0);
    }

    console.log('Installing karma-tibet configuration file karma.conf.js.');

    //  Update to check for the target configuration file, not just directory.
    dest = path.join(dest, 'karma.conf.js');
    if (sh.test('-e', dest)) {
        console.log('File karma.conf.js already exists; copying it to *.orig.');

        sh.mv(dest, dest + '.orig');
        err = sh.error();
        if (err) {
            console.log(
                'Placing karma-tibet karma.conf.js in karma.conf.js.tibet.');
            sh.cp(src, dest + '.tibet');
            err = sh.error();
            if (err) {
                console.error(
                    'See documentation for configuration instructions.');
            }
            process.exit(0);
        }
    }

    sh.cp('-f', src, dest);
    err = sh.error();
    if (err) {
        console.error('See documentation for configuration instructions.');
        process.exit(0);
    }

}(this));
