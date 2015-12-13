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
    dest = path.join(__dirname, '../../..', 'karma.conf.js');

    console.log('Installing karma-tibet configuration file karma.conf.js.');

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
                process.exit(0);
            }
        }
    }

    sh.cp('-f', src, dest);
    err = sh.error();
    if (err) {
        console.error('See documentation for configuration instructions.');
        process.exit(0);
    }

}(this));
