$(document).ready(() => {
    $.ajax({
        type: 'GET',
        url: '/discount_requests/allow_reverification',
        data: {
            url: window.location.href
        },
        success: function (data) {
            if (!data['allowReVerify']) {
                $('.final-submit').prop('disabled', true);
                let earlyReVerify = $('#earlyReVerifyWarning');
                earlyReVerify.html('Hi, ' + data['username'] + '! You were last verified as a ' + data['userType'] + ' on ' + data['date'] + '. It is not necessary for you to re verify at this time.');
                earlyReVerify.prop('hidden', false);
            }
        }
    });
});
