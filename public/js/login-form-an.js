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
        atentionare("Account created");
    };
};

function checkChpas(){
    var regform2 = $('.changepass-form');
    if(regform2[0].checkValidity()) {
        // $(".changepass-form").css("display", "none");
        // $(".login-form").css("display", "block");
        $('.changepass-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        atentionare("Password changed");
    };
};

$(document).ready(function() {
    checkReg();
    checkChpas();
});


//account created/ passowrd changed pe formul de login dupa ce se completeaza formurile
function atentionare(care) {
    $('.attention').text(`${care}`);
    $('.attention').animate({height: "toggle", opacity: "toggle"}, "fast");
    setTimeout('hide()',3000);
  
};
function hide(){
    $('.attention').animate({height: "toggle", opacity: "toggle"}, "fast");
    
};