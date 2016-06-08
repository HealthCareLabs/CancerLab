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

/*jslint devel:true*/
/*global Config, Model, Ui, tizen */

/**
 * Application class constructor.
 *
 * @public
 * @constructor
 */
var App = null;

(function strict() { // strict mode wrapper
    'use strict';

    /**
     * Creates a new application object.
     *
     * @public
     * @constructor
     */
    App = function App() {
        return;
    };

    App.prototype = {

        /**
         * Array with application dependencies.
         *
         * @private
         * @type {string[]}
         */
        requires: [],

        /**
         * Config object.
         *
         * @private
         * @type {Config}
         */
        config: null,

        /**
         * Model object.
         *
         * @private
         * @type {Model}
         */
        model: null,

        /**
         * Ui object.
         *
         * @private
         * @type {Ui}
         */
        ui: null,

        /**
         * Initializes application.
         *
         * @public
         * @returns {App}
         */
        init: function init() {
            // instantiate the libs
            this.ui = new Ui();

            return this;
        },

        /**
         * Returns this application id.
         *
         * @public
         * @returns {number} Application id.
         */
        getId: function getId() {
            return tizen.application.getCurrentApplication().appInfo.id;
        },

        /**
         * Closes application.
         *
         * @public
         */
        exit: function exit() {
            tizen.application.getCurrentApplication().exit();
        }
    };
}());
