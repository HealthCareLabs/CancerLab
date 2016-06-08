jQuery(document).ready(function ($) {
    $('.form_action_register').initForm(function(result){
        localStorage.setItem('ApiKey', result['ApiKey']);
        window.location.href = "#main";
    }, function(result) {
        console.log(result['Message']);
    });

    $('.form_action_main').initForm(function(result){
        $('.user').text(result['PatientProfile']['LastName']);
    }, function(result) {
        alert(result['Message']);
    });


    $('.button_action_start').click(function() {
        if(localStorage.getItem('ApiKey')) {
            $('#main .text').text('API Key = ' + localStorage.getItem('ApiKey'));
            window.location.href = "#main";
        } else {
            window.location.href = "#auth";
        }
    });

    $('.button_action_clear').click(function() {
        localStorage.clear();
    });
});


$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.initForm = function(successFunction, errorFunction) {
    var frm = this;
    frm.submit(function (ev) {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            contentType: 'application/json',
            data: JSON.stringify(frm.serializeObject()),
            dataType: 'json',
            beforeSend: function(request){
                localStorage.getItem('ApiKey') && request.setRequestHeader('X-ApiKey', localStorage.getItem('ApiKey'));
            },
            success: function (result) {
                if(result['Success']) {
                    successFunction(result);
                } else {
                    errorFunction(result);
                }
            }
        });

        ev.preventDefault();
    });
};
