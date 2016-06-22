function Ui() {
    'use strict';

    return;
}

(function strict() { // strict mode wrapper
    'use strict';

    Ui.prototype = {

        /**
         * Template manager object.
         *
         * @public
         * @type {TemplateManager}
         */
        templateManager: null,

        /**
         * UI module initialization.
         *
         * @param {App} app
         * @public
         */
        init: function UI_init(app) {
            this.app = app;
            this.templateManager = new TemplateManager();
            $(document).ready(this.domInit.bind(this));

            // init inner objects
            this.splash.context = this;
            this.auth.context = this;
            this.registration.context = this;
            this.login.context = this;
            this.home.context = this;
            this.new_treatment.context = this;
            this.profile.context = this;
            this.options.context = this;
            this.location.context = this;
            this.time.context = this;
        },

        /**
         * When DOM is ready, initializes it.
         *
         * @private
         */
        domInit: function UI_domInit() {
            this.templateManager.loadToCache(
                [
                    'treatment'
                ],
                this.initPages.bind(this)
            );
            $.mobile.tizen.disableSelection(document);
        },

        /**
         * Appends pages to the body and initializes them.
         *
         * @private
         */
        initPages: function UI_initPages() {
            this.splash.init();
            this.auth.init();
            this.registration.init();
            this.login.init();
            this.home.init();
            this.new_treatment.init();
            this.profile.init();
            this.options.init();
            this.location.init();
            this.time.init();

            window.addEventListener('tizenhwkey', function onTizenHwKey(e) {
                var activePageId = tau.activePage.id;
                if (e.keyName === 'back') {
                    if (activePageId === 'splash') {
                        app.exit();
                    } else {
                        history.back();
                    }
                }
            });
        },

        /**
         * Contains methods related to the splash page.
         *
         * @public
         * @type {object}
         */
        splash: {

            /**
             * Initializes splash page.
             *
             * @public
             */
            init: function UI_splash_init() {
                this.addEvents();
            },

            /**
             * Binds events to the splash page.
             *
             * @public
             */
            addEvents: function addEvents() {
                $('.button_action_start').click(function() {
                    if(localStorage.getItem('ApiKey')) {
                        $('#main .text').text('API Key = ' + localStorage.getItem('ApiKey'));
                        tau.changePage("#home");
                    } else {
                        tau.changePage("#auth");
                    }
                });

                $('.button_action_clear').on('click', function() {
                    localStorage.clear();
                });
            }
        },


        /**
         * Contains methods related to the auth page.
         *
         * @public
         * @type {object}
         */
        auth: {

            /**
             * Initializes auth page.
             *
             * @public
             */
            init: function UI_auth_init() {

            }
        },


        /**
         * Contains methods related to the registration page.
         *
         * @public
         * @type {object}
         */
        registration: {

            /**
             * Initializes registration page.
             *
             * @public
             */
            init: function UI_registration_init() {
                $('.form_action_register').initForm(function(result){
                    localStorage.setItem('ApiKey', result['ApiKey']);
                    tau.changePage("#home");
                }, function(result) {
                    console.log(result['Message']);
                });
            }
        },


        /**
         * Contains methods related to the login page.
         *
         * @public
         * @type {object}
         */
        login: {

            /**
             * Initializes login page.
             *
             * @public
             */
            init: function UI_login_init() {

            }
        },


        /**
         * Contains methods related to the home page.
         *
         * @public
         * @type {object}
         */
        home: {

            /**
             * Initializes home page.
             *
             * @public
             */
            init: function UI_home_init() {

            }
        },


        /**
         * Contains methods related to the new_treatment page.
         *
         * @public
         * @type {object}
         */
        new_treatment: {

            /**
             * Initializes new_treatment page.
             *
             * @public
             */
            init: function UI_new_treatment_init() {
                this.addEvents();
            },

            /**
             * Binds events to the new_treatment page.
             *
             * @public
             */
            addEvents: function addEvents() {
                $('#issueFiles').on('change', function readSelectedFiles() {
                    var html = '',
                        displaySection = document.getElementById('selectedFilesList'),
                        files = document.getElementById('issueFiles').files;

                    if (files.length === 0) {
                        return;
                    }

                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];

                        var reader = new FileReader();

                        /* Check whether the file is an image */
                        if (!file.type.match('image.*')) {
                            continue;
                        }

                        reader.onload = (function(e) {
                            var fileItem = document.createElement('div');
                            fileItem.className = 'file-list__item';

                            var img = '<img class="img" src="'+ e.target.result +'" title="'+ escape(file.name) +'"/>';

                            fileItem.innerHTML = img + '<div class="file-list__inner"><strong>File name: </strong>' + escape(file.name) + '<br />' +
                                'type: ' + file.type + '<br />' +
                                'size: ' + file.size + 'bytes<br />' +
                                'lastModifiedDate: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : '') +
                                '<br /></div>';
                            displaySection.appendChild(fileItem);
                        });

                        reader.readAsDataURL(file);
                    }
                });
            }
        },


        /**
         * Contains methods related to the profile page.
         *
         * @public
         * @type {object}
         */
        profile: {

            /**
             * Initializes profile page.
             *
             * @public
             */
            init: function UI_profile_init() {
                this.addEvents();
            },

            /**
             * Handles pageshow event on the profile page.
             *
             * @private
             */
            onShow: function onShow() {
                this.displayList();
            },

            /**
             * Binds events to the profile page.
             *
             * @public
             */
            addEvents: function addEvents() {
                $('#profile').on('pageshow', this.onShow.bind(this));
            },

            /**
             * Builds profile info HTML list and adds it to page.
             *
             * @private
             */
            displayList: function displayList() {
                var list = '',
                    infoList = document.getElementById('profile_info');

                $.ajax({
                    type: 'get',
                    url: app.config.get('profileRequest'),
                    contentType: 'application/json',
                    dataType: 'json',
                    beforeSend: function(request){
                        localStorage.getItem('ApiKey') && request.setRequestHeader('X-ApiKey', localStorage.getItem('ApiKey'));
                    },
                    success: function (result) {
                        if(result['Success']) {
                            list = '' +
                                '<li class="list__item">Last name: <span class="string profile__lname">'+ result["PatientProfile"]["LastName"] +'</span></li>'+
                                '<li class="list__item">Name: <span class="string profile__name">'+ result["PatientProfile"]["Name"] +'</span></li>'+
                                '<li class="list__item">Second name: <span class="string profile__sname">'+ result["PatientProfile"]["SecondName"] +'</span></li>'+
                                '<li class="list__item">Date of birth: <span class="string profile__birthday">'+ result["PatientProfile"]["BirthdayDate"] +'</span></li>'+
                                '<li class="list__item">Gender: <span class="string profile__gender">'+ result["PatientProfile"]["Gender"] +'</span></li>'+
                                '<li class="list__item">Policy number: <span class="string profile__policy">'+ result["PatientProfile"]["PolicyNumber"] +'</span></li>'+
                                '<li class="list__item">Phone number: <span class="string profile__phone">'+ result["PatientProfile"]["PhoneNumber"] +'</span></li>'+
                                '<li class="list__item">Email: <span class="string profile__email">'+ result["PatientProfile"]["Email"] +'</span></li>'+
                                '<li class="list__item">Registration date: <span class="string profile__ger">'+ result["PatientProfile"]["RegisterDate"] +'</span></li>';
                            infoList.innerHTML = list;
                            tau.engine.createWidgets(infoList);
                            tau.widget.Listview(infoList).refresh();
                        } else {
                            console.log('no');
                        }
                    }
                });
            }
        },


        /**
         * Contains methods related to the options page.
         *
         * @public
         * @type {object}
         */
        options: {

            /**
             * Initializes options page.
             *
             * @public
             */
            init: function UI_options_init() {

            }
        },

        /**
         * Contains methods related to the location page.
         *
         * @public
         * @type {object}
         */
        location: {

            /**
             * Initializes location page.
             *
             * @public
             */
            init: function UI_location_init() {
                this.addEvents();
            },

            /**
             * Binds events to the location page.
             *
             * @public
             */
            addEvents: function addEvents() {
                // Holds information that uniquely identifies a watch operation.
                var watchId;

                function successCallback(position) {
                    document.getElementById("locationInfo").innerHTML = "Latitude: " +
                        position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
                }

                function errorCallback(error) {
                    var errorInfo = document.getElementById("locationInfo");

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorInfo.innerHTML = "User denied the request for Geolocation.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorInfo.innerHTML = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorInfo.innerHTML = "The request to get user location timed out.";
                            break;
                        case error.UNKNOWN_ERROR:
                            errorInfo.innerHTML = "An unknown error occurred.";
                            break;
                    }
                }

                $('#oneShot').on('click', function oneShotFunc() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
                    } else {
                        document.getElementById("locationInfo").innerHTML = "Geolocation is not supported.";
                    }
                });

                $('#watchPos').on('click', function watchFunc() {
                    if (navigator.geolocation) {
                        watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);
                    } else {
                        document.getElementById("locationInfo").innerHTML = "Geolocation is not supported.";
                    }
                });

                $('#stopWatchPos').on('click', function stopWatchFunc() {
                    if (navigator.geolocation) {
                        navigator.geolocation.clearWatch(watchId);
                    } else {
                        document.getElementById("locationInfo").innerHTML = "Geolocation is not supported.";
                    }
                });
            }
        },


        /**
         * Contains methods related to the time page.
         *
         * @public
         * @type {object}
         */
        time: {

            /**
             * Initializes time page.
             *
             * @public
             */
            init: function UI_time_init() {
                $('#currentTime').text(tizen.time.getCurrentDateTime().toLocaleString());
                $('#currentZone').text(tizen.time.getLocalTimezone());
                $('#zonesCount').text(tizen.time.getAvailableTimezones().length);
                $('#dateFormat').text(tizen.time.getDateFormat());
                $('#timeFormat').text(tizen.time.getTimeFormat());
            }
        },


        /**
         * Contains methods related to the react page.
         *
         * @public
         * @type {object}
         */
        react: {

            /**
             * Initializes react page.
             *
             * @public
             */
            init: function UI_react_init(){
            },

            loadContacts: function loadContacts(){
                var contacts;
                tizen.contact.getDefaultAddressBook().find(successCallback());
            }

        }
    };

    /**
     * Creates and displays popup widget.
     *
     * @public
     * @param {string} text Text information.
     * @param {object} buttons Buttons template object.
     */
    Ui.prototype.popup = function showPopup(text, buttons) {
        var i = 0,
            popupNumber = Object.keys(buttons).length,
            popup = document.getElementById('popup'),
            popupButtons = $('#popupButtons'),
            popupText = document.getElementById('popupText'),
            tauPopup = tau.widget.Popup(popup),
            buttonsCount = 0;

        // if buttons template wasn't add, use default template
        if (!buttons) {
            buttons = {
                'OK': function ok() {
                    tauPopup.close();
                }
            };
        }

        // clear popup
        popupButtons.empty();

        popup.className = popup.className.replace(/\bcenter_basic.*?\b/g, '');
        popup.classList.add('center_basic_' + popupNumber + 'btn');

        // adds buttons to popup HTML element
        for (i in buttons) {
            if (buttons.hasOwnProperty(i)) {
                buttonsCount += 1;
                if (buttons[i]) {
                    $('<a/>').text(i).attr({
                        'data-inline': 'true'
                    }).addClass('ui-btn').bind('click', buttons[i]).appendTo(
                        popupButtons
                    );
                }
            }
        }
        if (buttonsCount === 2) {
            popupButtons.addClass('ui-grid-col-2');
        } else {
            popupButtons.removeClass('ui-grid-col-2');
        }
        // adds text to popup HTML element
        popupText.innerHTML = '<p>' + text + '</p>';

        tau.engine.createWidgets(popup);
        tau.widget.Popup(popup).open();
    };

}());
