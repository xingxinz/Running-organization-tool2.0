$('#Login').modal('show');
$('#Login').modal('hide');
$(".navbar-nav a").click(function(e){
    $(this).tab("show");
})
$(document).ready(function(){
    //产生随机数
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    $('#captchaOperation').html([randomNumber(1, 100), '+', randomNumber(1, 200), '='].join(' '));
    $('#LoginForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
         },
        fields:{
            loginusername:{
                message: 'The username is not valid',
                validators:{
                    notEmpty:{
                        message: ' 用户名不能为空！'
                    }
                }
             },
            loginpassword:{
                validators: {
                    notEmpty:{
                        message: '  密码不能为空！'
                    }

                }
            }
        }
    })
    $('#RegisterForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            registerusername:{
                message: '无效工号',
                validators: {
                    notEmpty: {
                        message: '工号不能为空！'
                    },
                    regexp: {
                        regexp: 0-9,
                        message: '工号由数字组成！'
                    },
                    remote: {
                        type: 'POST',
                        url: '#',
                        message: '该工号已注册！'
                    }
                }
            },
            registerpassword: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    }
                }
            },
            registerpasswordtwice: {
                validators: {
                    notEmpty: {
                        message: '验证密码不能为空！'
                    },
                    identical: {
                        field: 'registerpassword',
                            message: '两次输入的密码不同！'
                    }
                }
            },
            registeremail: {
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空！'
                    },
                    emailAddress: {
                        message: '这不是一个有效的邮箱！'
                    }
                }
            },
            registertel: {
                message: 'The phone number is not valid',
                validators: {
                    notEmpty: {
                        message: '电话号码不能为空！'
                    },
                    digits: {
                        message: '电话号码只能由数字组成！'
                    }
                }
            },
            captcha: {
                validators: {
                    callback: {
                        message: '错误！',
                        callback: function(value, validator) {
                            var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
                            return value == sum;
                        }
                    }
                }
            }
        }
    });
    $('#registerReset').click(function() {
        $('#RegisterForm').data('bootstrapValidator').resetForm(true);
    });
});