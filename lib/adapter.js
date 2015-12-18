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
 * @overview The "client-side" portion of the karma-tibet framework plugin,
 *     injected by Karma thanks to the index.js file loaded by the Karma server.
 *     Functionality here is focused on booting TIBET based on configuration
 *     data specific to karma supplied by a standard tibet.json project file.
 */

//  ----------------------------------------------------------------------------

/* eslint indent:0 */
(function(root) {

    function isObject(obj) {
        return typeof obj === 'object' &&
            Object.prototype.toString.call(obj) === '[object Object]';
    };

    function isValid(aReference) {
        return aReference !== null && aReference !== undefined;
    };

    /**
     * A useful variation on extend from other libs sufficient for parameter
     * block copies. The objects passed are expected to be simple JavaScript
     * objects. No checking is done to support more complex cases. Slots in the
     * target are only overwritten if they don't already exist. Only slots owned
     * by the source will be copied. Arrays are treated with some limited deep
     * copy semantics as well.
     * @param {Object} target The object which will potentially be modified.
     * @param {Object} source The object which provides new property values.
     */
    function blend(target, source) {

        if (!isValid(source)) {
            return target;
        }

        if (Array.isArray(target)) {
            if (!Array.isArray(source)) {
                return target;
            }

            // Both arrays. Blend as best we can.
            source.forEach(function(item, index) {
                //  Items that don't appear in the list get pushed.
                if (target.indexOf(item) === -1) {
                    target.push(item);
                }
            });

            return target;
        }

        if (isValid(target)) {
            //  Target is primitive value. Don't replace.
            if (!isObject(target)) {
                return target;
            }

            //  Target is complex object, but source isn't.
            if (!isObject(source)) {
                return target;
            }
        } else {
            // Target not valid, source should overlay.
            return source;
        }

        Object.keys(source).forEach(function(key) {
            if (key in target) {
                if (isObject(target[key])) {
                    blend(target[key], source[key]);
                } else if (Array.isArray(target[key])) {
                    blend(target[key], source[key]);
                }
                return;
            }

            //  Key isn't in target, build it out with source copy.
            if (Array.isArray(source[key])) {
                // Copy array/object slots deeply as needed.
                target[key] = blend([], source[key]);
            } else if (isObject(source[key])) {
                // Deeply copy other non-primitive objects.
                target[key] = blend({}, source[key]);
            } else {
                target[key] = source[key];
            }
        });

        return target;
    };

    /**
     * @method  getKarmaStartFunction
     * @summary Constructs a simple start function which Karma will invoke
     *     during early stages of startup. The TIBET version of this function
     *     assembles boot parameters and invokes TP.boot.launch to boot TIBET.
     * @param {Object} karma
     * @return {Function}
     */
    function getKarmaStartFunction(karma) {

        return function() {
            var cfg,
                params;

            if (window['TP'] && TP.boot) {

                //  Capture the karma object reference for use in library code.
                TP.extern.karma = karma;

                //  Build a sensible set of defaults for parameters. Turn off
                //  any pause-inducing aspects that require user interaction.
                params = {
                    boot: {
                        pause: false,
                        use_login: false
                    }
                };

                //  karma-tibet should have put any karma-specific values onto
                //  the config block via the config.client.args value.
                if (karma.config && karma.config.args) {
                    cfg = JSON.parse(karma.config.args[0]);
                    blend(params, cfg);
                }

                //  Assign values from configuration data to augment baseline.
                //  NOTE that the data here DOES NOT INCLUDE tibet.json DATA!
                //  We haven't launched yet so it hasn't been loaded yet.
                cfg = TP.sys.cfg('karma.boot');
                Object.keys(cfg).forEach(function(key) {
                    var value,
                        slot;

                    value = TP.sys.cfg(key);
                    slot = key.replace('karma.boot.', '');

                    //  Don't overwrite hard-coded or client.args values.
                    if (!params.boot.hasOwnProperty(slot)) {
                        params.boot[slot] = value;
                    }
                });

                // Uncomment for debugging configuration glitches.
                /*
                karma.info({
                    log: [JSON.stringify(params)],
                    type: 'info'
                });
                */

                //  Here's where the real work begins :) Launch TIBET.
                TP.boot.launch(params);

                return;
            }
        };
    }

    root.__karma__.start = getKarmaStartFunction(root.__karma__);

}(this));

//  ----------------------------------------------------------------------------
//  end
//  ============================================================================
