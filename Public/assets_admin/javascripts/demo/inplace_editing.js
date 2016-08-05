$(function(){
    $.mockjaxSettings.responseTime = 500;

    $.mockjax({
        url: '/post',
        response: function(settings) {
            log(settings, this);
        }
    });

    $.mockjax({
        url: '/error',
        status: 400,
        statusText: 'Bad Request',
        response: function(settings) {
            this.responseText = 'Please input correct value';
            log(settings, this);
        }
    });

    $.mockjax({
        url: '/status',
        status: 500,
        response: function(settings) {
            this.responseText = 'Internal Server Error';
            log(settings, this);
        }
    });

    $.mockjax({
        url: '/groups',
        response: function(settings) {
            this.responseText = [
                {value: 0, text: 'Guest'},
                {value: 1, text: 'Service'},
                {value: 2, text: 'Customer'},
                {value: 3, text: 'Operator'},
                {value: 4, text: 'Support'},
                {value: 5, text: 'Admin'}
            ];
            log(settings, this);
        }
    });

    function log(settings, response) {
        var s = [], str;
        s.push(settings.type.toUpperCase() + ' url = "' + settings.url + '"');
        for(var a in settings.data) {
            if(settings.data[a] && typeof settings.data[a] === 'object') {
                str = [];
                for(var j in settings.data[a]) {str.push(j+': "'+settings.data[a][j]+'"');}
                str = '{ '+str.join(', ')+' }';
            } else {
                str = '"'+settings.data[a]+'"';
            }
            s.push(a + ' = ' + str);
        }
        s.push('RESPONSE: status = ' + response.status);

        if(response.responseText) {
            if($.isArray(response.responseText)) {
                s.push('[');
                $.each(response.responseText, function(i, v){
                    s.push('{value: ' + v.value+', text: "'+v.text+'"}');
                });
                s.push(']');
            } else {
                s.push($.trim(response.responseText));
            }
        }
        s.push('--------------------------------------\n');
        $('#inplaceediting-console').val(s.join('\n') + $('#inplaceediting-console').val());
    }

});

$(function(){

    //defaults
    $.fn.editable.defaults.url = '/post';

    //enable / disable
    $('#inplaceediting-enable').click(function() {
        $('#inplaceediting-user .editable').editable('toggleDisabled');
    });

    //editables
    $('#inplaceediting-name').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'name',
        title: 'Enter name'
    });

    $('#inplaceediting-number').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'number',
        title: 'Enter number'
    });

    $('#inplaceediting-money').editable({
        url: '/post',
        type: 'text',
        pk: 1,
        name: 'money',
        title: 'Enter money'
    });

    $('#inplaceediting-status').editable();

    $('#inplaceediting-group').editable({
        showbuttons: false
    });

    $('#inplaceediting-time').editable();

    $('#inplaceediting-note').editable();

    $('#inplaceediting-pencil').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('#inplaceediting-note').editable('toggle');
    });

    $('#inplaceediting-user .editable').on('hidden', function(e, reason){
        if(reason === 'save' || reason === 'nochange') {
            var $next = $(this).closest('tr').next().find('.editable');
            if($('#inplaceediting-autoopen').is(':checked')) {
                setTimeout(function() {
                    $next.editable('show');
                }, 300);
            } else {
                $next.focus();
            }
        }
    });
});

