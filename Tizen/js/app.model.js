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
/*global window, Alarm, app */

/**
 * Model class constructor.
 *
 * @public
 * @constructor
 */
var Model = function Model() {
    'use strict';

    return;
};

(function strict() { // strict mode wrapper
    'use strict';

    Model.prototype = {

        /**
         * Initializes model instance of the model.
         *
         * @public
         * @param {App} app
         */
        init: function Model_init(app) {
            var apiKey = window.localStorage.getItem('ApiKey');

            this.app = app;
            this.apiKey = apiKey ? JSON.parse(apiKey) : null;
        },


        /**
         * Saves data in the local storage.
         *
         * @private
         */
        updateStorage: function Model_updateStorage() {
            try {
                window.localStorage.setItem(
                    'test',
                    JSON.stringify(this.apiKey)
                );
            } catch (e) {
                if (e.code === 22) {
                    // QuotaExceededError
                    app.ui.popup(
                        'Not enough memory to save data.' +
                        ' Please remove unnecessary files.'
                    );
                }
            }
        }
    };
}());
