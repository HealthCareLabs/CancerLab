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

/**
 * Config class  constructor.
 *
 * @public
 * @constructor
 */
function Config() {
    'use strict';

    return;
}

(function strict() { // strict mode wrapper
    'use strict';

    Config.prototype = {

        /**
         * Config object properties.
         *
         * @private
         * @type {object}
         */
        properties: {
            /**
             * Path to default avatar.
             *
             * @private
             * @type {string}
             */
            'defaultAvatarUrl': 'img/default.png',

            /**
             * Templates directory name.
             *
             * @private
             * @type {string}
             */
            'templateDir': 'templates',

            /**
             * Template files extension.
             *
             * @private
             * @type {string}
             */
            'templateExtension': '.tpl',

            /**
             * Profile request link
             *
             * @private
             * @type {string}
             */
            'profileRequest': 'http://alpha.cancerlab.pro/api/account/getProfile'
        },

        /**
         * Returns config value connected to the key or defaultValue.
         *
         * @public
         * @param {string} value
         * @param {string} [defaultValue='']
         * @returns {string} Value connected to the key or defaultValue.
         */
        get: function get(value, defaultValue) {
            defaultValue = defaultValue || '';

            if (this.properties.hasOwnProperty(value)) {
                return this.properties[value];
            }

            return defaultValue;
        }
    };
}());
