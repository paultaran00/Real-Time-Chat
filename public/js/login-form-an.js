//animations

$(document).ready(function() {
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

});



//check validation

function checkReg() {
    var regform = $('.register-form');
    if(regform[0].checkValidity()) {
        // $(".register-form").css("display", "none");
        // $(".login-form").css("display", "block");\
        $('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
    };
};

function checkChpas(){
    var regform2 = $('.changepass-form');
    if(regform2[0].checkValidity()) {
        // $(".changepass-form").css("display", "none");
        // $(".login-form").css("display", "block");
        $('.changepass-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
    };
};

$(document).ready(function() {
    checkReg();
    checkChpas();
});


// var regform3 = $('login-form');
// if(regform3[0].checkValidity()) {
//     $('loginbut').click(function(){
//         window.location='http://www.google.com';
//     });
// };