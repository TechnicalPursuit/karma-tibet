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

                //  Assign values from configuration data to augment baseline.
                //  NOTE that cfg data is loaded by TIBET in any case, what we
                //  focus on here are the boot parameters only since we have
                //  different names (karma.boot vs. boot).
                cfg = TP.sys.cfg('karma.boot');

                Object.keys(cfg).forEach(function(key) {
                    var value,
                        slot;

                    value = TP.sys.cfg(key);
                    slot = key.replace('karma.boot.', '');

                    params.boot[slot] = value;
                });

                /*
                 * Uncomment for debugging configuration glitches.
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
