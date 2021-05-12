const express = require('express');
const app = express();
var session = require('express-session');
const http = require('http').createServer(app);
const url = require('url');
var io = require('socket.io')(http);
const mongo = require("mongodb");
const bcrypt = require('bcrypt');

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const uri ="mongodb://localhost:27017";
var MongoClient = mongo.MongoClient;

app.use(session({
	secret: 'secret',
	resave: true,
	cookie: { maxAge: 3600000 },
	saveUninitialized: true
}));

app.get("/socket.io",(req, res)=>{
	res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});







app.get('/', function(request, response){
    if (request.session.username!=undefined)
		return response.redirect("/chat")
    response.sendFile(__dirname + '/public/html/login.html');
});

//verify characters
function verifystr(str){
    var substrings = ['@','/','\\','|','[',']','{','}','(',')','=',':',';','`','~',"'",'"',',','#','$','%','^',"&","*",'!','?',' '],
    length = substrings.length;
    var r = 0;
    while(length--) {
        if (str.indexOf(substrings[length])!=-1) {
            return r = 1;
        }
    }
    return r;
}

//REGISTER

app.post('/regverify', function(request, response){
    var user = request.body.username;
    var pass = request.body.password;
    var ans = request.body.answer;


    if (verifystr(user) == 1 || verifystr(pass) == 1 || verifystr(ans) == 1){
        response.send("0");
    } else if (user.length < 3){
        response.send("1");
    } else if (user.length > 20){
        response.send("2");
    } else if (pass.length < 6){
        response.send("3");
    } else if (pass.length > 20){
        response.send("4");
    } else if (ans.length < 1){
        response.send("5");
    } else if (ans.length > 20){
        response.send("6");
    } else{
        response.send("7");
    }
});

var ok = 0;
app.post('/reg', function(request, response){
    
    var user = request.body.username;
    
        MongoClient.connect(uri, function(err, db) {
            var dbc = db.db("chat");
            var a = 0;
            dbc.collection("accounts").find({username: user}).toArray(function (err, result){
                a = result.length;
                if(a==1){
                    response.send("already_exist");
                }
                else{
                    ok = 1;
                    response.send("succes");
                }
            });
                
            db.close();
	    });
});


app.post('/regadd', function(request, response){
    if(ok == 1){
        var add = request.body.add;
        var user = request.body.username;
        var pass = request.body.password;
        var quest = request.body.question;
        var ans = request.body.answer;

        //crypt pass and answer
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passhash = bcrypt.hashSync(pass, salt);
        const anshash = bcrypt.hashSync(ans, salt);




        if (add==1){
            MongoClient.connect(uri, function(err, db) {
                obj={username: user, password: passhash, question: quest, answer: anshash, friends:[], groups:[]};
                var dbc = db.db("chat");
                dbc.collection("accounts").insertOne(obj);

                db.close();
            });
        }
        response.send("am primit");
        ok = 0;
    }
    
});
//REGISTER END


//LOGIN
app.post("/login", function(request,response){ 
    var user = request.body.username; 
    var pass = request.body.password;

    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").find({username: { $eq: user}}).toArray(function (err, result){
            len = result.length;
            if(len == 0){
                response.send("not_exist");
            }
            else{
                var a = result[0];
                if(bcrypt.compareSync(pass, a.password)){
                    request.session.username=user;
                    response.redirect("/chat")
                    
                }
                else{
                    response.send("pass_incorrect");
                }
            }
            
        });

        db.close();
    });

});
//LOGIN END


//CHANGE PASSWORD
app.post("/changepass", function(request,response){
    var user=request.body.username;
    var question=request.body.question;
    var answer=request.body.answer;
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").find({username: { $eq: user}}).toArray(function (err, result){
            len = result.length;
            if(len == 0){
                response.send("not_exist");
            }
            else{
                var a = result[0];
                if(question == a.question){
                    if(bcrypt.compareSync(answer, a.answer)){
                        response.send("succes");
                    }
                    else{
                        response.send("answer_incorrect");
                    }

                }
                else{
                    response.send("question_incorrect");
                }
            }

        });

        db.close();
    });


});

app.post("/changepasdatabase", function(request,response){
    var user=request.body.username;
    var newpass=request.body.password;
    if(newpass.length<6){
        response.send("tooshort");
    }
    else if(newpass.length >= 6){
        //criptare
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const newpasshash = bcrypt.hashSync(newpass, salt);

        MongoClient.connect(uri, function(err, db) {
            response.send("changed");
            var dbc = db.db("chat");
            dbc.collection("accounts").updateOne({username: { $eq: user}},{$set: { password : newpasshash}});
            db.close();
        });
    }
    
});
//CHANGE PASSWORD END



app.post("/getusername", function(request,response){ 
    response.send(request.session.username);
    console.log(request.session.username);

});

app.get('/chat', function(req, res){
    if (req.session.username==undefined)
	    return res.redirect("/")
	res.sendFile(__dirname + '/public/html/chat.html');
});


app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect("/");
});


//search user
app.post("/searchuser", function(request,response){ 
    var user = request.body.src_usr;
    
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").find({username: { $eq: user}}).toArray(function (err, result){
            len = result.length;
            if(len == 0){
                response.send("not_exists");
            }
            else{
                response.send("exists");
            }

        });

        db.close();
    });

});

// populate friend list
app.post("/populate_friends", function(request,response){
    var user = request.body.user;
    
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").find({username: { $eq: user}}).toArray(function (err, result){
            response.send(result[0].friends);
            
        });

        db.close();
    });

});

// populate group list
app.post("/populate_groups", function(request,response){
    var user = request.body.user;
    
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").find({username: { $eq: user}}).toArray(function (err, result){
            
            response.send(result[0].groups);
            
        });

        db.close();
    });

});

function create_group_db(gname, arr, len){
    seen_list = [];

    for (var i = 0; i<len; i++ ){
        seen_list.push(0);
    }
    // console.log(seen_list);
    var group_obj = {group_name: gname, users: arr, users_seen: seen_list, msgs: []}
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("group_messages").insertOne(group_obj)
        db.close();
    });
}

//update users groups
function update_users_groups(user, group){
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").updateOne(
            {username: { $eq: user}},
                {
                $push: {
                    groups: group
                }
                }
        )

    db.close();  
    });
}

//create group
app.post("/create_group", function(request,response){
    var g_name = request.body.group_n;
    var userss = request.body.users;
    var from = request.body.from;
    var array = userss.split(' ');
    // console.log(array);
    var send_update = userss.split(' ');
    // console.log(send_update);
    array.push(from);
    
    len = array.length;
    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("group_messages").find({group_name: { $eq: g_name}}).toArray(function (err, result){
            lenn = result.length;
            if (lenn != 0){
                response.send("exists");
            }else{
                create_group_db(g_name, array, len);
                response.send("created");

                for (i in array){
                    update_users_groups(array[i], g_name);
                }
                
                //send to online users to update real time
                for (var i in send_update){
                    var to;
                    for (var j in users){
                        // console.log(j + ":" + send_update[i]);
                        if (users[j] == send_update[i]){
                            
                            to = j;
                            // console.log(to);
                            io.to(to).emit('add_group', g_name);
                        }
                    }
                }

            }

        });

        db.close();  
    });
});

//group users
app.post("/group_users", function(request,response){
    var groupname = request.body.group_n;

    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("group_messages").find({group_name: { $eq: groupname}}).toArray(function (err, result){
            // console.log(result[0]);
            response.send(result[0].users);
            
        });

        db.close();
    });

});
// app.post("/online_status", function(request,response){
//     var arr = request.body.arr;
//     console.log(user);
    

// });


//socket 
users={};
var users_list = [];
io.on('connection', function(socket){

	socket.on('set_online',(name)=>{//se user online
        console.log("user connected");
        users[socket.id] = name;
        if (users_list.indexOf(name) === -1)
            users_list.push(name)
        console.log(users);
	});
    
    socket.on('disconnect',()=>{//se user offline
        console.log("user disconnected");
        users_list = users_list.filter(e => e !== users[socket.id] );
		delete users[socket.id];
        
        console.log(users);
	});

    socket.on('add_friends_list',(data)=>{//add new friend
        
        MongoClient.connect(uri, function(err, db) {
            var dbc = db.db("chat");
            dbc.collection("accounts").updateOne(
            {username: { $eq: data[0]}},
                {
                $push: {
                    friends:data[1]
                }
                }
            )

            dbc.collection("accounts").updateOne(
                {username: { $eq: data[1]}},
                    {
                    $push: {
                        friends:data[0]
                    }
                    }
                )
            db.close();
        });

        for (var i in users){// daca userul care trebe sa primeasca mesajul e online, se adauga la friend list
            if (users[i] == data[0]){ //verifica daca userul exista in lista de useri online
                io.to(i).emit('add_friend_to_list', data[1]);
            }
        }

	});


    socket.on('onoff',(data)=>{//status online offline users
        
        // console.log(users_list);
        obj = data[1];
        // console.log(data[1][0].key());
        var from;
        for (var i in users){
            if (users[i] == data[0]){
                from = i;
            }
        }

        for (var i in obj){
            // console.log(sdata[1]);
            var key = Object.keys(obj[i])[0];
            
            if(users_list.includes(key)){
                // console.log("am intrat in if");
                for (var k in obj[i]){
                    obj[i][k] = 1;
                }
            }else{
                // console.log("am intrat pe else");
                for (var k in obj[i]){
                    obj[i][k] = 0;
                }
            }
            
        }
        // console.log(obj);
        // console.log(users);
        
        io.to(from).emit('onoff_client', obj);
	});
    socket.on('message_chat_first', function(data){ //when receive first message on socket
        var message_obj = {user1: data.from, user2: data.to, user1_seen: data.user1_seen, user2_seen: 1, msgs: [data.mesg]}
		MongoClient.connect(uri, function(err, db) {
			var dbc = db.db("chat");
			dbc.collection("chat_messages").insertOne(message_obj)
            // console.log(data.mesg);
            // dbc.collection("chat_messages").updateOne({user1: data.from, user2: data.to}, {$push : { msgs: data.mesg }});
            // console.log(data.mesg);

            db.close();
		});

        var to;
        for (var i in users){
            if (users[i] == data.to){
                to = i;
            }
        }

        io.to(to).emit("message_client", data.mesg);

	});

	socket.on('message_chat', function(data){ //when receive message on socket
        // console.log(data.mesg);
		
		//insert message to db
		MongoClient.connect(uri, function(err, db) {
			var dbc = db.db("chat");
			dbc.collection("chat_messages").updateOne({user1: data.from, user2: data.to}, {$push : { msgs: data.mesg }});
            dbc.collection("chat_messages").updateOne({user1: data.to, user2: data.from}, {$push : { msgs: data.mesg }});

            db.close();
		});


        //update seen
        const list = new Promise(function (resolve, reject) {
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("chat_messages").find({$or: [ {user1: data.from, user2: data.to}, {user1: data.to, user2: data.from} ]}).toArray(function (err, result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);         
                   }
                   
                });
            db.close();
               
            });
        });

          list.then(result => {  
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                if(result[0].user1 == data.from){//partea de seen la mesaj
                    dbc.collection("chat_messages").updateOne({user1: { $eq: data.from}, user2: { $eq: data.to}},{$set: { user2_seen : 1}});

                }else if(result[0].user2 == data.from){
                    dbc.collection("chat_messages").updateOne({user1: { $eq: data.to}, user2: { $eq: data.from}},{$set: { user1_seen : 1}});

                }
                
                db.close();
            });
            
          }).catch(err => console.log(err.message));




        var to;
        for (var i in users){
            if (users[i] == data.to){
                to = i;
            }
        }

        io.to(to).emit("message_client", data.mesg);

        

	});

    socket.on('update_chat', function(data){ // populate chat
        var from;
        for (var i in users){
            if (users[i] == data.from){
                from = i;
            }
        }
        // console.log(from);
        // console.log(data);
		
        const list = new Promise(function (resolve, reject) {
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("chat_messages").find({$or: [ {user1: data.from, user2: data.to}, {user1: data.to, user2: data.from} ]}).toArray(function (err, result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);         
                   }
                   
                });
                
            
            
            
            db.close();
               
            });
        });

          list.then(arrayList => {
            // console.log(arrayList[0].msgs);
            io.to(from).emit("populate_msgs", arrayList[0].msgs);
          }).catch(err => console.log(err.message));

        
	});





    function searchdb(from, user, key){
        if(user == '') 
            return;
        if(key == '') 
            return;
        if(typeof user === 'undefined') 
            return;
        if(typeof key === 'undefined') 
            return;
        var ok;
        const list = new Promise(function (resolve, reject) {
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("chat_messages").find({$or: [ {user1: key, user2: user}, {user1: user, user2: key} ]}).toArray(function (err, result){
                    // console.log(result[0]);
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);         
                    }
                    
                });
            db.close();
               
            });
            
        });
        var obj = {};
          list.then(result => {  
            //   console.log(result[0]);
            if(result[0].user1 == key){
                ok = 1;
             }
             else{
                ok = 2;
             }
            if (ok == 1){
                obj[result[0].user1] = result[0].user2_seen;
            }else{
                obj[result[0].user2] =result[0].user1_seen;
            }
            // console.log(obj);
            io.to(from).emit("seen_client", obj);
          }).catch(err => console.log(err.message));

    }




    socket.on('update_seen', function(data){ //when receive message on socket
        // console.log(data[1]);
        // console.log(users_list);
        suser = data[0]
        obj = data[1];
        // console.log(data[1][0].key());
        var from;
        for (var i in users){
            if (users[i] == data[0]){
                from = i;
            }
        }
        for (var i in obj){
            var key = Object.keys(obj[i])[0];
            searchdb(from, suser, key);
        }
	});
    


    socket.on('remove_seen', function(data){ //remove seen
        MongoClient.connect(uri, function(err, db) {
            var dbc = db.db("chat");
            
            dbc.collection("chat_messages").updateOne({user1: { $eq: data.from}, user2: { $eq: data.to}},{$set: { user1_seen : 0}});
            dbc.collection("chat_messages").updateOne({user1: { $eq: data.to}, user2: { $eq: data.from}},{$set: { user2_seen : 0}});
  
            db.close();
        });
	});

    socket.on('group_chat', function(data){ //group chat
        // console.log(data);
        from = data.from;
        seen_list = [];
        var l = data.group_memb;
        //update seen
        for(var i = 0; i<data.group_memb.length; i++){
            if(data.group_memb[i] != from){
                seen_list.push(1);
            }else{
                seen_list.push(0);
            }
        }
        MongoClient.connect(uri, function(err, db) {
            var dbc = db.db("chat");
            
            dbc.collection("group_messages").updateOne({group_name: data.gr_name}, {$push : { msgs: data.mesg }});
            dbc.collection("group_messages").updateOne({group_name: data.gr_name}, {$set : { users_seen: seen_list }});

            db.close();
        });

        const index = l.indexOf(from);
        if (index > -1) {
            l.splice(index, 1);
        }
        // console.log(l);
        var obj = []
        obj.push(data.gr_name);
        obj.push(data.mesg);
        for (var j in l){
            for (var i in users){
                if (users[i] == l[j]){
                    // console.log(i);
                    io.to(i).emit("group_message_client", obj);
                }
            }
        }
        

        
	});

    socket.on('update_group', function(data){ // populate group chat
        // console.log(data);
        var groupname = data.group_n;
        var from;
        for (var i in users){
            if (users[i] == data.from){
                from = i;
            }
        }

		
        const list = new Promise(function (resolve, reject) {
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("group_messages").find({group_name: { $eq: groupname}}).toArray(function (err, result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);         
                   }
                   
                });
            
            db.close();
               
            });
        });

          list.then(arrayList => {
            // console.log(arrayList[0].msgs);
            io.to(from).emit("populate_group", arrayList[0].msgs);
          }).catch(err => console.log(err.message));
	});


    function searchdbgroup(from, user, key){
        if(user == '') 
            return;
        if(key == '') 
            return;
        
        const list = new Promise(function (resolve, reject) {
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("group_messages").find({group_name: { $eq: key}}).toArray(function (err, result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);         
                    }
                });
            db.close();
               
            });
            
        });
        var obj = {};
          list.then(result => {
            for(var i=0; i<result[0].users.length;i++){
                if(result[0].users[i] == user){
                    obj[key] = result[0].users_seen[i];
                    io.to(from).emit("seen_client_group", obj);
                }
            } 
            
            
          }).catch(err => console.log(err.message));
    }


    socket.on('update_seen_group', function(data){ //when receive message on socket
        // console.log(data[1]);
        // console.log(users_list);
        suser = data[0]
        obj = data[1];
        // console.log(data[1][0].key());
        var from;
        for (var i in users){
            if (users[i] == data[0]){
                from = i;
            }
        }
        for (var i in obj){
            var key = Object.keys(obj[i])[0];
            searchdbgroup(from, suser, key);
        }
	});

    socket.on('remove_seen_group', function(data){ //remove seen
        // console.log(data.to);
        // console.log(data.from);
        const list = new Promise(function (resolve, reject) {
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("group_messages").find({group_name: { $eq: data.to}}).toArray(function (err, result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);         
                    }
                });
            db.close();
               
            });
            
        });
        
          list.then(result => {
            var seen_list = [];
            // console.log(result[0]);
            for(var i=0; i<result[0].users.length;i++){
                // console.log(result[0].users[i]);
                // console.log(result[0].users_seen[i]);
                if(result[0].users[i] != data.from){
                    seen_list.push(result[0].users_seen[i]);
                }else{
                    seen_list.push(0);
                }
            }
            MongoClient.connect(uri, function(err, db) {
                var dbc = db.db("chat");
                dbc.collection("group_messages").updateOne({group_name: data.to}, {$set : { users_seen: seen_list }});
                db.close();
               
            });
            
          }).catch(err => console.log(err.message));
	});




});

// 44444'192.168.0.222',
http.listen(80,  () => {
	console.log('listening on *:80');
});




