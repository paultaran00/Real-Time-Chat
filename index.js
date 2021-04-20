const express = require('express');
const app = express();
var session = require('express-session');
const http = require('http').createServer(app);
const url = require('url');
var io = require('socket.io');
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


app.post('/reg', function(request, response){
    
    var user = request.body.username;
    
        MongoClient.connect(uri, function(err, db) {
            var dbc = db.db("chat");
            var a = 0;
            dbc.collection("accounts").find({username: user}).toArray(function (err, result){
                console.log(result);
                a = result.length;
                if(a==1){
                    response.send("already_exist");
                }
                else{
                    response.send("succes");
                }
            });
                
            db.close();
	    });
});


app.post('/regadd', function(request, response){
    var add = request.body.add;
    var user = request.body.username;
    var pass = request.body.password;
    var quest = request.body.question;
    var ans = request.body.answer;
    if (add==1){
        MongoClient.connect(uri, function(err, db) {
            obj={username: user, password: pass, question: quest, answer: ans};
            var dbc = db.db("chat");
            dbc.collection("accounts").insertOne(obj);

            db.close();
        });
    }
    response.send("am primit");
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

    MongoClient.connect(uri, function(err, db) {
        var dbc = db.db("chat");
        dbc.collection("accounts").updateOne({username: { $eq: user}},{$set: { password : newpass}});
        db.close();
    });
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


// app.get('/reg', function(request, response){
    
//     var user=request.query.username;

//     console.log(user);
//     response.send("am primit");
// });


http.listen(80, () => {
	console.log('listening on *:80');
});


