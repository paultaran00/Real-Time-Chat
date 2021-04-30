
$(".fa-times").hide();
$(".fa-check").hide();

function get_username(){
    var usr = "";
    $.ajax({
        url: "/getusername",
        type: "POST",
        'async':false,
        dataType: 'text',
        success: function (res){
            usr = res;
            
        }
    });
    return usr;
    
}
$(".myusername-container").append(`<div class="username">@${get_username()}</div>`);





//conect to server socket
var socket = io.connect("http://localhost:80");
socket.emit("set_online", get_username());



	


    
// functie care deschide window-ul create group la apasarea butonului
$(document).ready(function() {     
    $('.create-group').click(function(){
        
        $('.creategroup-window').animate({opacity: "toggle"}, "slow");
            
    });
});

//buton chat-group message

$(document).ready(function() {
    $('.toggle-body').click(function(){
        $(".toggle-body").toggleClass("toggle-body--on");
        $(".toggle-btn").toggleClass("toggle-btn--on");
        $(".frec_chat").toggleClass("change-color-grey");
        $(".frec_groups").toggleClass("change-color-white");
        $('.chat-list').animate({height: "toggle", opacity: "toggle"}, "slow");
        $('.group-list').animate({height: "toggle", opacity: "toggle"}, "slow");
        $('.create-group').animate({height: "toggle", opacity: "toggle"}, "slow");
        $(".creategroup-window").hide();
    });
});

//group button
$(document).ready(function() {
    $('.frec_groups').click(function(){
        if ($('.group-list').is(':visible')){
            
        }else{
            $(".toggle-body").toggleClass("toggle-body--on");
            $(".toggle-btn").toggleClass("toggle-btn--on");
            $(".frec_chat").toggleClass("change-color-grey");
            $(".frec_groups").toggleClass("change-color-white");
            $('.chat-list').animate({height: "toggle", opacity: "toggle"}, "slow");
            $('.group-list').animate({height: "toggle", opacity: "toggle"}, "slow");
            $('.create-group').animate({height: "toggle", opacity: "toggle"}, "slow");
        }
        
    });
});

//chat button
$(document).ready(function() {
    $('.frec_chat').click(function(){
        if ($('.chat-list').is(':visible')){
            
        }else{
            $(".toggle-body").toggleClass("toggle-body--on");
            $(".toggle-btn").toggleClass("toggle-btn--on");
            $(".frec_chat").toggleClass("change-color-grey");
            $(".frec_groups").toggleClass("change-color-white");
            $('.chat-list').animate({height: "toggle", opacity: "toggle"}, "slow");
            $('.group-list').animate({height: "toggle", opacity: "toggle"}, "slow");
            $('.create-group').animate({height: "toggle", opacity: "toggle"}, "slow");
            $(".creategroup-window").hide();
        }
        
    });
});


//add group to group-list when creating group

function add_group_to_list(){
    var regform3 = $(".creategroup-form");
    if(regform3[0].checkValidity()) {
        var gname = $('.creategroup-name').val();
        // console.log(gname);
        var users = $('.creategroup-users').val();
        var gdiv = `<li class="lgrup">${gname}<div class="status"><div class="fas fa-envelope"></div></div></li>`;
        
        $(".group-list").prepend(gdiv);

        
    };

};
$(document).ready(function() {
    add_group_to_list();
});




//add name to chat when you click on li

$(document).ready(function() {
    $('.lom').click(function(){
        var username = $(this).find('.name').text();
        $('.om').remove();
        $('.grup').remove();
        var omdiv = `<div class="om">${username}</div>`;
        $(".people").append(omdiv);
        $('.people').css('padding-right','2%');
        $('.people').css('background','#5154638c');
        $('.people_menu').hide();
        $('.people').show();
        if ($('.begin').is(':visible')){
            $('.begin').animate({height: "toggle", opacity: "toggle"}, "slow");
            $('.right').animate({height: "toggle", opacity: "toggle"}, "slow");
        };
    });
});

//add group to chat when you click on li

$(document).ready(function() {
    $(document).on('click', '.lgrup', function() {
        var username = $(this).text();
        $('.om').remove();
        $('.grup').remove();
        var grupdiv = `<div class="grup">${username}</div>`;
        $(".people").append(grupdiv);
        $('.people').css('padding-right','5%');
        $('.people').css('background','#5154638c');
        $('.people_menu').show();
        $('.people').show();
        if ($('.begin').is(':visible')){
            $('.begin').animate({height: "toggle", opacity: "toggle"}, "slow");
            $('.right').animate({height: "toggle", opacity: "toggle"}, "slow");
        };
    });
    
});

//functie insert mesage
function insert_message(){
    if( $(".sendmsg_input").val().length > 0){
        var mesaj = $(".sendmsg_input").val();
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes();
        $('.sendmsg_input').val('');
        var este = 1;
        if ($('.om').is(':visible')){
            var limesaj = `<li class="left_msg"><div class="ul">${time}</div><div class="msg">${mesaj}</div></li>`;
            
            var lnx = $('.chat-list .lom .name');  //verifica daca userul este in lista de frecventi
            var este = 0;
            for (let i = 0; i < lnx.length; i++) {
                var txt = lnx[i].textContent;
                if(txt == $(".om").text()){
                    este = 1;
                }
            }

        }
        if ($('.grup').is(':visible')){
            var limesaj = `<li class="left_msg"><div class="ul">@${get_username()} ${time}</div><div class="msg">${mesaj}</div></li>`;
        }
        if(este == 0){    //il adauga in lista de frecventi daca nu este
            var om = $(".om").text();
            var a = `<li class="lom"><span class="name">${om}</span><div class="fas fa-envelope"></div><div class="status"><div class="fas fa-circle"><div class="on-off">offline</div></div></div></li>`
            $(".chat-list").prepend(a);

            socket.emit("add_friends_list", [om.slice(1), get_username()]);

        }

        $(".chat").append(limesaj);
        document.querySelector(".chat").scrollTo(0,document.body.scrollHeight);

        
    };
}

//send message enter
$(document).ready(function() {
    $('.sendmsg_input').on('keypress', function (e) {
        if(e.which === 13){
            insert_message();
        }
  });
});

//send message sageata
$(document).ready(function() {
    $('.fa-paper-plane').click(function(){
        insert_message();
    });
});



//people menu

$(document).ready(function() {
    $('.people_menu').click(function(){
        $(".fa-chevron-down").toggleClass("toggle-arrow");
        $('.group_users').animate({opacity: "toggle"}, "slow");
        
    });
});

// se ascund windowurile
$(document).ready(function() {
    $('.sendmsg_input, .lgrup, .lom, .search, .background_pattern, .group-list').click(function(){
        if ($('.group_users').is(':visible')){
            $(".fa-chevron-down").toggleClass("toggle-arrow");
            $('.group_users').animate({opacity: "toggle"}, "slow");
        }
        if( $('.creategroup-window').is(':visible') ) {
            // $(".creategroup-window").hide();
            $('.creategroup-window').animate({opacity: "toggle"}, "slow");
        }
    });
});



//functie schimbare status online offline new msg

function status(person, on, newmsg){  // (%person, 1/0, 1/0)
    if(on==1){
        $(`.lom:contains("${person}") .on-off`).text('online');
        $(`.lom:contains("${person}") .fa-circle`).css("color","#43A047");
    }
    else{
        $(`.lom:contains("${person}") .on-off`).text('offline');
        $(`.lom:contains("${person}") .fa-circle`).css("color","#8d8d8d");
    }
    if(newmsg==1){
        $(`.lom:contains("${person}") .fa-envelope`).css("color","#01bfbf");
    }
    else{
        $(`.lom:contains("${person}") .fa-envelope`).css("color","#01bfbf1a");
    }  
};
//exemple de adaugare online si new message
$(document).ready(function() {
    status("@szucseduard", 1, 0);
    status("@tacotaalexandru", 1, 1);
    status("@ionutd", 0, 1);
    status("@alexandrabaciu", 1, 0);
});


//logout

$(document).ready(function() {
    $('.logout').click(function(){
        $.ajax({
            url: "/logout",
            type: "GET",
            dataType: 'text'
        });
        location.reload();
    });
});


//search input send ajax 1 second after stop typing 

var typingTimer;
var doneTypingInterval = 1000;
$('.search').on('keyup', function() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

$('.search').on('keydown', function() {
  clearTimeout(typingTimer);
});

function doneTyping() {
    var src_usr = $('.search').val();
    $.ajax({
        url: "/searchuser",
        type: "POST",
        dataType: 'text',
        data: {src_usr:src_usr},
        success: function (res){
            if(res == "not_exists" || src_usr == get_username()){
                $(".fa-times").show().delay(1000).fadeOut();
            } else{
                $(".fa-check").show().delay(1000).fadeOut();
                $(".search").val("");

                $('.om').remove();
                $('.grup').remove();
                var omdiv = `<div class="om">@${src_usr}</div>`;
                $(".people").append(omdiv);
                $('.people').css('padding-right','2%');
                $('.people').css('background','#5154638c');
                $('.people_menu').hide();
                $('.people').show();
                if ($('.begin').is(':visible')){
                    $('.begin').animate({height: "toggle", opacity: "toggle"}, "slow");
                    $('.right').animate({height: "toggle", opacity: "toggle"}, "slow");
                };
            }
        }
    });
}



//listen for add to friends list

socket.on('add_friend_to_list',(data)=>{
    var new_friend = `<li class="lom"><span class="name">@${data}</span><div class="fas fa-envelope"></div><div class="status"><div class="fas fa-circle"><div class="on-off">offline</div></div></div></li>`;
    $(".chat-list").prepend(new_friend);
});