(function strict() { // strict mode wrapper
    'use strict';

    /**
     * Creates a new serializable object.
     *
     * @public
     * @returns {object[]} Serializable object.
     */
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


    /**
     * Init an application form.
     *
     * @public
     */
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
}());
