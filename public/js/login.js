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
    console.log(regform[0].checkValidity());
    if(regform[0].checkValidity()) {
        $('.createbut').click(function(){
            $(".register-form").css("display", "none");
            $(".login-form").css("display", "block");
        });
    };
};

function checkChpas(){
    var regform2 = $('.changepass-form');
    console.log(regform2[0].checkValidity());
    if(regform2[0].checkValidity()) {
        $('.changepassbut').click(function(){
            $(".changepass-form").css("display", "none");
            $(".login-form").css("display", "block");
        });
    };
};



// var regform3 = $('login-form');
// if(regform3[0].checkValidity()) {
//     $('loginbut').click(function(){
//         window.location='http://www.google.com';
//     });
// };