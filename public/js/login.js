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



//LOGIN 
var usr;
function loginacc() {
    
    var user = $('.login_username').val();
    var pass = $('.login_password').val();
    usr = user;
    $.ajax({
        url: "/login",
        type: "POST",
        dataType: 'text',
        data: {username:user, password:pass},
        success: function (res){
            if(res == "not_exist"){
                atentionare("User does not exist");
            } else if (res == "pass_incorrect") {
                atentionare("Incorrect password");
            }else{
                location.reload();
            }
            
        }
    });
    
}
//LOGIN END





function checkChpas(){
    var regform2 = $('.changepass-form');
    if(regform2[0].checkValidity()) {
        
        var user = $('.Cpass_username').val();
        var question = $('.Cpass_question').val();
        var answer = $('.Cpass_answer').val();
        var newpass = $('.Cpass_newpass').val();
        $.ajax({
            url: "/changepass",
            type: "POST",
            dataType: 'text',
            data: {username:user, question:question, answer:answer},
            success: function (res){
                if(res == "not_exist"){
                    atentionare("User does not exist");
                } else if (res == "question_incorrect") {
                    atentionare("Incorrect question");
                } else if (res == "answer_incorrect") {
                    atentionare("Incorrect answer");
                }else if (res == "succes") {
                    $.ajax({
                        url: "/changepasdatabase",
                        type: "POST",
                        dataType: 'text',
                        data: {username:user, password:newpass},
                        success: function (res){
                            atentionare("Password succesfully changed");
                            $('.changepass-form').animate({height: "toggle", opacity: "toggle"}, "slow");
                            $('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
                            
                        }
                    });
                    
                }

            }
        });

    }else{
        if ($('.changepass-form').is(':visible')){
            atentionare("Fill up every container");
        };
    };
};

// $(document).ready(function() {
//     checkReg();
//     checkChpas();
//     loginacc();
// });


//account created/ passowrd changed pe formul de login dupa ce se completeaza formurile
function atentionare(care) {
    $('.attention').text(`${care}`);
    $('.attention').animate({height: "toggle", opacity: "toggle"}, "fast");
    setTimeout('hide()',3000);
  
};
function hide(){
    $('.attention').animate({height: "toggle", opacity: "toggle"}, "fast");
};

