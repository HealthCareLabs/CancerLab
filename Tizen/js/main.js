/*
 * Copyright (c) 2012 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint devel: true*/
/*global $ , App  */

/**
 * This file acts as a loader for the application and its dependencies.
 *
 * First, the 'app.js' script is loaded .
 * Then, scripts defined in 'app.requires' are loaded.
 * Finally, the app is initialized - the app is instantiated ('app = new App()')
 * and 'app.init()' is called.
 */

/**
 * App object instance.
 *
 * @public
 * @type {App}
 */
var app = null;

(function strict() { // strict mode wrapper
    'use strict';

    ({
        /**
         * Initializes application.
         *
         * @public
         */
        init: function init() {
            var self = this;

            $.getScript('js/app.js').done(function onAppLoaded() {
                // once the app is loaded, create the app object
                // and load the libraries
                app = new App();
                self.loadLibs();
            }).fail(this.onGetScriptError);
        },

        /**
         * Loads dependencies.
         *
         * @private
         */
        loadLibs: function loadLibs() {
            var loadedLibs = 0,
                i = 0,
                filename = null,
                len = app.requires.length;

            function onGetScriptDone() {
                loadedLibs += 1;
                if (loadedLibs >= len) {
                    app.init();
                }
            }

            if ($.isArray(app.requires)) {
                for (i = 0; i < len; i += 1) {
                    filename = app.requires[i];
                    $.getScript(filename)
                        .done(onGetScriptDone)
                        .fail(this.onGetScriptError);
                }
            }
        },

        /**
         * Handles errors.
         *
         * @private
         */
        onGetScriptError: function onGetScriptError() {
            console.error('An error occurred on loading dependencies');
        }
    }).init(); // run the loader

}());
