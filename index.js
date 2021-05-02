const express = require('express');
const app = express();
var session = require('express-session');
const http = require('http').createServer(app);
const url = require('url');
var io = require('socket.io')(http);
const mongo = require("mongodb");


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
        if (add==1){
            MongoClient.connect(uri, function(err, db) {
                obj={username: user, password: pass, question: quest, answer: ans, friends:[], groups:[]};
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
                if(pass == a.password){
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
                    if(answer == a.answer){
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
        MongoClient.connect(uri, function(err, db) {
            response.send("changed");
            var dbc = db.db("chat");
            dbc.collection("accounts").updateOne({username: { $eq: user}},{$set: { password : newpass}});
            db.close();
        });
    }
    
});
//CHANGE PASSWORD END



app.post("/getusername", function(request,response){ 
    response.send(request.session.username);

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
        var message_obj = {user1: data.from, user2: data.to, user1_seen: data.user1_seen, user2_seen: data.user2_seen, msgs: []}
		MongoClient.connect(uri, function(err, db) {
			var dbc = db.db("chat");
			dbc.collection("chat_messages").insertOne(message_obj)
            dbc.collection("chat_messages").updateOne({user1: data.from, user2: data.to}, {$push : { msgs: data.mesg }});
            // console.log(data.mesg);

            db.close();
		});
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
	});

    socket.on('update_chat', function(data){ //when receive message on socket
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
});


const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function fulltime(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
    + pad(months[d.getMonth()])+'-'
    + pad(d.getUTCDate())+' '
    + pad(d.getUTCHours()+3)+':'
    + pad(d.getUTCMinutes())
}
function time(d){
    function pad(n){return n<10 ? '0'+n : n}
    return pad(d.getUTCHours()+3)+':'
    + pad(d.getUTCMinutes())
}
var haha= fulltime(new Date());
console.log(haha);
console.log(haha.substr(0, haha.indexOf(' ')));


http.listen(80, () => {
	console.log('listening on *:80');
});


