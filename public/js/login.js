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



//REGISTER

function checkReg() {
    var regform = $('.register-form');
    if(regform[0].checkValidity()) {
        var username = $('.reg_username').val();
        var password = $('.reg_password').val();
        var question = $('.reg_question').val();
        var answer = $('.reg_answer').val();

        $.ajax({
            url: "/regverify",
            type: "POST",
            dataType: 'text',
            data: {username:username, password:password, answer:answer},
            success: function (res){
                        if (res==0){
                            atentionare("You're using forbidden characters");
                        } else if (res==1){
                            atentionare("Username don't have enough characters");
                        } else if (res==2){
                            atentionare("Username has too many characters");
                        } else if (res==3){
                            atentionare("Password don't have enough characters");
                        } else if (res==4){
                            atentionare("Username has too many characters");
                        } else if (res==5){
                            atentionare("The answer don't have enough characters");
                        } else if (res==6){
                            atentionare("The answer has too many characters");
                        }
                        else if(res==7){
                            $.ajax({
                                url: "/reg",
                                type: "POST",
                                dataType: 'text',
                                data: {username:username},
                                success: function (res){
                                    
                                    if(res=="succes"){
                
                                            $.ajax({
                                                url: "/regadd",
                                                type: "POST",
                                                dataType: 'text',
                                                data: {add:1,username:username, password:password, question:question, answer:answer},
                                                success: function (res){
                                            
                                                }
                                            });
                                        
                                            $('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow");
                                            $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
                                            atentionare("Account created");
                                        
                                    }
                                    else{
                                        atentionare("Username already taken");
                                    }
                
                                }
                            });
                        }
            }
        });
        
    }else{
        if ($('.register-form').is(':visible')){
            atentionare("Fill up every container");
        };
    };
};
//REGISTER END


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

