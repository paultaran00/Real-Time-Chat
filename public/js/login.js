$('.message .create').click(function(){
    $('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow");
    $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('.message .login').click(function(){
    $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
    $('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('.message .change').click(function(){
    $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
    $('.changepass-form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('.message .clogin').click(function(){
    $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
    $('.changepass-form').animate({height: "toggle", opacity: "toggle"}, "slow");
});