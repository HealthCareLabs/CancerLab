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

/*global $*/
/**
 * ModifierManager class constructor.
 *
 * @public
 * @constructor
 */
function ModifierManager() {
    'use strict';

    return;
}

(function strict() {
    'use strict';

    ModifierManager.prototype = {

        /**
         * Returns all modifiers.
         *
         * @public
         * @returns {object} Returns all modifiers.
         */
        getAll: function getAll() {
            return this.modifiers;
        },

        /**
         * Modifiers definitions.
         *
         * @private
         * @type {object}
         */
        modifiers: {

            /**
             * Changes string into jQuery span element and returns it.
             *
             * @public
             * @param {string} str
             * @returns {jQuery}
             */
            escape: function escape(str) {
                return $('<span>').text(str).html();
            }
        }
    };
}());