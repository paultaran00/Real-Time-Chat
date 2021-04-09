const express = require('express');
const app = express();
var qs = require("querystring");
var session = require('express-session');
const url = require('url');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongo = require("mongodb");

app.use(express.static(__dirname + '/public'));
app.use("/public", express.static('./public/'));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/html/login.html');
});

http.listen(80, () => {
	console.log('listening on *:80');
}); 
