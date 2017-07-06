// Presence server
//
var http = require("http");
var socket = require("socket.io");
var express = require("express");
var url = require("url");
var path = require("path");
var fs = require("fs");
var logger = require("morgan");
//var route = require("./route/routes.js");
var httpserver, app, io;
var port;
var apptitle = "presence"
var io;

port=1234;
app = express();
app.set('views',__dirname+"/views");
app.set('view engine','jade');
app.use(logger("short"));
app.use(express.static(__dirname+"/static"));
// deprecated : 
//app.use(app.router);
// we use external route management with app.use(app.router)
app.get('/',function(req,res){
 res.render('index',{title: apptitle});
});
app.get('/presence',function(req,res){
 res.render('presence',{title: apptitle});
});
httpserver = http.createServer(app);
io = socket.listen(httpserver);
// handle namespace : system and user

var systemws = io.of("/system");
var userws = io.of("/user");

systemws.on("connection", function(socket){
    socket.send(JSON.stringify(
            {type:'serverMessage',message:'Welcome !'})
    );
    socket.on("disconnect", function(socket){
        console.log("Client disconnected");
    });
    socket.on("set_name",function(data){
            console.log("set_name event : "+data.name);
            socket.nickname = data.name;
            socket.emit('name_set',data);
        socket.broadcast.emit('user_entered',data);
    });
    socket.on("join_room",function(data){
        socket.room = data.room;
        socket.join(socket.room);

        socket.in(socket.room).broadcast.emit('user_entered',{'name': socket.nickname});
    });
});
userws.on("connection",function(socket){
    socket.on("message", function(message){
        message = JSON.parse(message);
        if(message.type == "userMessage") {
            socket.nickname = message.name;
            message.nickname = socket.nickname;
            socket.broadcast.send(JSON.stringify(message));
            message.type = "myMessage";
            socket.send(JSON.stringify(message));
        }
    });

});
httpserver.listen(port,function(){
 console.log("Server started and listening on port " + port);    
});
