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
            this.sensors.context = this;
            this.sound.context = this;
            this.led.context = this;
            this.system.context = this;
            this.radio.context = this;
            this.alarm.context = this;
            this.battery.context = this;
            this.video.context = this;
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
            this.sensors.init();
            this.sound.init();
            this.led.init();
            this.system.init();
            this.radio.init();
            this.alarm.init();
            this.battery.init();
            this.video.init();

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
                $('.button_action_start').click(function () {
                    if (localStorage.getItem('ApiKey')) {
                        $('#main .text').text('API Key = ' + localStorage.getItem('ApiKey'));
                        tau.changePage("#home");
                    } else {
                        tau.changePage("#auth");
                    }
                });

                $('.button_action_clear').on('click', function () {
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
                $('.form_action_register').initForm(function (result) {
                    localStorage.setItem('ApiKey', result['ApiKey']);
                    tau.changePage("#home");
                }, function (result) {
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

                        reader.onload = (function (e) {
                            var fileItem = document.createElement('div');
                            fileItem.className = 'file-list__item';

                            var img = '<img class="img" src="' + e.target.result + '" title="' + escape(file.name) + '"/>';

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
                    beforeSend: function (request) {
                        localStorage.getItem('ApiKey') && request.setRequestHeader('X-ApiKey', localStorage.getItem('ApiKey'));
                    },
                    success: function (result) {
                        if (result['Success']) {
                            list = '' +
                                '<li class="list__item">Last name: <span class="string profile__lname">' + result["PatientProfile"]["LastName"] + '</span></li>' +
                                '<li class="list__item">Name: <span class="string profile__name">' + result["PatientProfile"]["Name"] + '</span></li>' +
                                '<li class="list__item">Second name: <span class="string profile__sname">' + result["PatientProfile"]["SecondName"] + '</span></li>' +
                                '<li class="list__item">Date of birth: <span class="string profile__birthday">' + result["PatientProfile"]["BirthdayDate"] + '</span></li>' +
                                '<li class="list__item">Gender: <span class="string profile__gender">' + result["PatientProfile"]["Gender"] + '</span></li>' +
                                '<li class="list__item">Policy number: <span class="string profile__policy">' + result["PatientProfile"]["PolicyNumber"] + '</span></li>' +
                                '<li class="list__item">Phone number: <span class="string profile__phone">' + result["PatientProfile"]["PhoneNumber"] + '</span></li>' +
                                '<li class="list__item">Email: <span class="string profile__email">' + result["PatientProfile"]["Email"] + '</span></li>' +
                                '<li class="list__item">Registration date: <span class="string profile__ger">' + result["PatientProfile"]["RegisterDate"] + '</span></li>';
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
         * Contains methods related to the sensors page.
         *
         * @public
         * @type {object}
         */
        sensors: {

            /**
             * Initializes sensors page.
             *
             * @public
             */
            init: function UI_sensors_init() {
                var sensorCapabilities = tizen.sensorservice.getAvailableSensors();

                sensorCapabilities.forEach(function (item, i, arr) {
                    var sensor = tizen.sensorservice.getDefaultSensor(item);
                    var line = "<li class=\"list__item\"><p class=\"text\">" + item + " val: <span id=\"" + item + "-Value\"></span></p></li>";
                    $('#sensors-list').append(line);
                    sensor.setChangeListener(function (sensorData) {
                        if (typeof(sensorData.proximityState) !== 'undefined') {
                            $('#PROXIMITY-Value').text(sensorData.proximityState);
                        }
                    });

                    sensor.start(function () {
                        console.log(item + ' started');
                    });
                })
            },

            addSensor: function addSensor(sensorType, sensor) {
                console.log(sensorType);
                console.log(sensor);
            },

            onSuccess: function onSuccess() {
                console.log('Sensor started successfully');
            }
        },


        /**
         * Contains methods related to the sound page.
         *
         * @public
         * @type {object}
         */
        sound: {

            /**
             * Initializes sound page.
             *
             * @public
             */
            init: function UI_sound_init() {
                var SOUND_TYPES = ["SYSTEM", "NOTIFICATION", "ALARM", "MEDIA", "VOICE", "RINGTONE"];

                SOUND_TYPES.forEach(function(item,i,arr){
                    var volume = tizen.sound.getVolume(item);
                    var line = '<li class="list__item"><p class="text">'+item+' type volume: <span id="'+ item+'-volume">'+volume+'</span>';
                    var slider = '<br /><input class="slider" id="'+item+'-slider" type="range" min="0" max="10" step="1" value="'+ volume*10 +'"/></p></li>';
                    $('#sound-info-list').append(line + slider);
                    var id = '#'+item+'-slider';

                    $(id).on('change',function(){
                        var type = '#' + item + '-slider';
                        var value = $(type).val();
                        tizen.sound.setVolume(item,value/10);
                    })
                });

                $('#currentSoundMode').text(tizen.sound.getSoundMode());
                tizen.sound.setVolumeChangeListener(function (soundType, volume) {
                    var volumeId = '#'+soundType+'-volume';
                    $(volumeId).text(volume);
                    var sliderId = '#'+soundType+'-slider';
                    $(sliderId).attr("value", volume*10);
                });

                tizen.sound.setSoundModeChangeListener(function(soundMode){
                   $('#currentSoundMode').text(soundMode);
                });
            }
        },

        /**
         * Contains methods related to the led page.
         *
         * @public
         * @type {object}
         */
        led: {

            /**
             * Initializes led page.
             *
             * @public
             */
            init: function UI_led_init() {
                this.addEvents();
            },

            /**
             * Binds events to the led page.
             *
             * @public
             */
            addEvents: function addEvents() {
                $('.button_led_on').on('click', function() {
                    $(this).hide();
                    tizen.systeminfo.getPropertyValue("CAMERA_FLASH",
                        function (flash) {
                            try {
                                flash.setBrightness(1);
                                $('.button_led_off').show();
                            } catch (error) {
                                console.log("Setting flash brightness failed: " + error.message);
                            }
                        },
                        function (error) {
                            console.log("Error, name: " + error.name + ", message: " + error.message);
                        }
                    );
                });

                $('.button_led_off').on('click', function() {
                    $(this).hide();
                    tizen.systeminfo.getPropertyValue("CAMERA_FLASH",
                        function (flash) {
                            flash.setBrightness(0);
                            $('.button_led_on').show();
                        },
                        function (error) {
                            console.log("Error, name: " + error.name + ", message: " + error.message);
                        }
                    );
                });
            }
        },


        /**
         * Contains methods related to the system page.
         *
         * @public
         * @type {object}
         */
        system: {

            /**
             * Initializes system page.
             *
             * @public
             */
            init: function UI_system_init() {
                function onPowerSuccessCallback(battery) { $('#batteryLevel').text((battery.level*100).toFixed(1) + '%'); }
                function onDeviceOrientation(deviceOrientation) { $('#orientation').text(deviceOrientation.status); }
                function onCPUSuccessCallback(cpu) { $('#cpu').text((cpu.load*100).toFixed(1) + '%'); }

                tizen.systeminfo.getPropertyValue('BATTERY', onPowerSuccessCallback);
                tizen.systeminfo.getPropertyValue('DEVICE_ORIENTATION', onDeviceOrientation);
                tizen.systeminfo.getPropertyValue('CPU', onCPUSuccessCallback);
                tizen.systeminfo.addPropertyValueChangeListener('BATTERY', onPowerSuccessCallback);
                tizen.systeminfo.addPropertyValueChangeListener('DEVICE_ORIENTATION', onDeviceOrientation);
                tizen.systeminfo.addPropertyValueChangeListener('CPU', onCPUSuccessCallback);

                $('#totalMemory').text(tizen.systeminfo.getTotalMemory() + ' bytes.');
                $('#availableMemory').text(tizen.systeminfo.getAvailableMemory() + ' bytes.');
            }
        },


        /**
         * Contains methods related to the radio page.
         *
         * @public
         * @type {object}
         */
        radio: {

            /**
             * Initializes radio page.
             *
             * @public
             */
            init: function UI_radio_init() {
                this.addEvents();
            },

            /**
             * Binds events to the radio page.
             *
             * @public
             */
            addEvents: function addEvents() {
                $('.button_radio_on').on('click', function() {
                    startRadio();
                });

                $('.button_radio_off').on('click', function() {
                    stopRadio();
                });

                $('.button_radio_scan').on('click', function() {
                    if (tizen.fmradio.state === "PLAYING") {
                        tizen.fmradio.seekUp(successCallback);
                    }
                });

                if(tizen.fmradio.isAntennaConnected) {
                    $('#radioTitle').text('Turn on the Radio');
                } else {
                    $('#radioTitle').text('Plug in a headset');
                }

                tizen.fmradio.setAntennaChangeListener(antennaCallback);

                function antennaCallback(isAntennaConnected) {
                    if(!isAntennaConnected) {
                        stopRadio();
                        $('#radioTitle').text('Plug in a headset')
                    } else {
                        $('#radioTitle').text('Turn on the Radio');
                    }
                }

                function startRadio() {
                    var radioState = tizen.fmradio.state;
                    var frequencyToPlay = 92.3;

                    if ((radioState == "READY" || radioState == "PLAYING") && tizen.fmradio.isAntennaConnected) {
                        $('.button_radio_on').hide();
                        $('.button_radio_scan, .button_radio_off').show();
                        tizen.fmradio.start(frequencyToPlay);
                        $('#radioTitle').text('Playing ' + frequencyToPlay);
                        $('.fm-img').show();
                    }
                }

                function stopRadio() {
                    $('.button_radio_scan, .button_radio_off').hide();
                    $('.button_radio_on').show();
                    if (tizen.fmradio.state == "PLAYING") {
                        tizen.fmradio.stop();
                        $('#radioTitle').text('Turn on the Radio');
                        $('.fm-img').hide();
                    }
                }

                function successCallback() {
                    $('#radioTitle').text(tizen.fmradio.frequency);
                }
            }
        },

        /**
         * Contains methods related to the alarm page.
         *
         * @public
         * @type {object}
         */
        alarm: {

            /**
             * Initializes alarm page.
             *
             * @public
             */
            init: function UI_alarm_init() {
                this.updateAlarmInfo();
                this.addEvents(this);
            },

            /**
             * Binds events to the alarm page.
             *
             * @public
             */
            addEvents: function addEvents(alarm) {
                $('.button_alarm_on').on('click', function() {
                    var input = $('#alarm_period');
                    if(alarm.validateInput()) {
                        var num = input.val();
                        var period = tizen.alarm.PERIOD_MINUTE;
                        var newAlarm = new tizen.AlarmRelative(num * period, num * period);

                        tizen.alarm.add(newAlarm, tizen.application.getCurrentApplication().appInfo.id);
                        input.val('');

                        alarm.updateAlarmInfo();
                    }
                });

                $('.button_alarm_off').on('click', function() {
                    tizen.alarm.removeAll();
                    alarm.updateAlarmInfo();
                });

                $('.button_alarm_update').on('click', function() {
                    alarm.updateAlarmInfo();
                });
            },

            /**
             * Update information about available alarms
             *
             * @public
             */
            updateAlarmInfo: function updateAlarmInfo() {
                var alarms = tizen.alarm.getAll();
                $('#alarm_number').text(alarms.length);
            },


            /**
             * Validate input for correct numeric value
             *
             * @public
             */
            validateInput: function validateInput() {
                var input = $('#alarm_period');
                var period = input.val();
                if (period >= 1 && period <=59) {
                    input.removeClass('input_error_yes');
                    return true;
                } else {
                    input.addClass('input_error_yes');
                    return false;
                }
            }
        },

        /**
         * Contains methods related to the battery page.
         *
         * @public
         * @type {object}
         */
        battery: {

            /**
             * Initializes battery page.
             *
             * @public
             */
            init: function UI_battery_init() {
                this.addEvents();
            },

            /**
             * Binds events to the battery page.
             *
             * @public
             */
            addEvents: function addEvents() {
                var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;

                window.addEventListener('load', getBatteryState);

                /* Detects changes in the battery charging status */
                battery.addEventListener('chargingchange', getBatteryState);
                /* Detects changes in the battery charging time */
                battery.addEventListener('chargingtimechange', getBatteryState);
                /* Detects changes in the battery discharging time */
                battery.addEventListener('dischargingtimechange', getBatteryState);
                /* Detects changes in the battery level */
                battery.addEventListener('levelchange', getBatteryState);

                function getBatteryState()
                {
                    var message = "";

                    var charging = battery.charging;
                    var chargingTime = getTimeFormat(battery.chargingTime);
                    var dischargingTime = getTimeFormat(battery.dischargingTime);
                    var level = Math.floor(battery.level * 100);

                    if (charging == false && level < 100)
                    {
                        /* Not charging */
                        message = dischargingTime.hour + ":" + dischargingTime.minute + " remained.";
                        if (battery.dischargingTime == "Infinity")
                        {
                            message = "";
                        }
                    }
                    else if (charging && level < 100)
                    {
                        /* Charging */
                        message = "Charging is complete after "
                            + chargingTime.hour + ":" + chargingTime.minute;
                        if (battery.chargingTime == "Infinity")
                        {
                            message = "";
                        }
                    }
                    else if (level == 100)
                    {
                        message = "Charging is completed";
                    }

                    if (charging) {
                        document.querySelector('#charging').textContent = 'charging...';
                    } else if (!charging && level <= 90) {
                        document.querySelector('#charging').textContent = 'Please connect the charger';
                    } else if (!charging && level > 90) {
                        document.querySelector('#charging').textContent = 'You do not need the charger';
                    }

                    document.querySelector('#level').textContent = level + "%";
                    document.querySelector('#progress').value = level;
                    document.querySelector('#message').textContent = message;
                }

                /* Time is received in seconds, converted to hours and minutes, and returned */
                function getTimeFormat(time)
                {
                    /* Time parameter is second */
                    var tempMinute = time / 60;

                    var hour = parseInt(tempMinute / 60, 10);
                    var minute = parseInt(tempMinute % 60, 10);
                    minute = minute < 10 ? "0" + minute : minute;

                    return {"hour": hour, "minute": minute};
                }
            }
        },

        /**
         * Contains methods related to the video page.
         *
         * @public
         * @type {object}
         */
        video: {

            /**
             * Initializes video page.
             *
             * @public
             */
            init: function UI_video_init() {
                this.addEvents();
            },

            /**
             * Binds events to the video page.
             *
             * @public
             */
            addEvents: function addEvents() {
                $('.video-input').on('change', function readSelectedFiles() {
                    var URL = window.URL || window.webkitURL;
                    var files = document.getElementById('videoFile').files,
                        displaySection = document.getElementById('video-container');

                    if (files.length === 0) {
                        return;
                    } else {
                        displaySection.innerHTML = '<video class="video-player" id="video-p" src="' + URL.createObjectURL(files[0]) + '" poster="" preload="auto" controls muted></video>';
                    }
                });
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
