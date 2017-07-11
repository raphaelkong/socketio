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
var socketPS;
var userSocket = {};
var userSocketId = [];
var patients = [];
var config = {};
var guid = {};
var currentIndex = 1;
var trackingId = 0;
var trackingSocketId = [];
var trackingGuid = [];
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
app.get('/ps',function(req,res){
    res.render('ps',{title: 'Vue PS'});
});
app.get('/patient',function(req,res){
    res.render('patient',{title: 'Vue Patient'});
});
httpserver = http.createServer(app);
io = socket.listen(httpserver);
// handle namespace : system and user

var patientws = io.of("/p");
var santews = io.of("/ps");

patientws.on("connection", function(socket){
    socket.patientsocketid = socket.id;
    userSocketId.push(socket.id);
    console.log('Current socket id : ' + socket.id);
    
    socket.send(JSON.stringify(
            {type:'serverMessage',message:'Welcome !'})
        
    );
    // PB : patient_connected n est pas valable puisqu'il n'y a maintenant qu'un seul namespace
    socket.emit('patient_connected',
        JSON.stringify(
            {type:'serverMessage','socketid': socket.id}
            )
        );
    socket.on("send_config",function(data){
        var config1 = {};
	var chatrooms = [] ;
	var message = {};
        socket.guid = data.guid ;
        console.log(socket.patientsocketid+ " has sent its config  guid => " +socket.guid+" orgs => "+data.orgs);
	chatrooms = data.orgs.split(',');
	console.log("Socket ID " + socket.id + " will join "+ chatrooms.length + " chat room ! : " + data.orgs);
	chatrooms.forEach(function(val,index,array){
		socket.join(val);
		message.messageroom = socket.guid+" joins room " + val;
			io.of('/p').in(val).emit('room_message', JSON.stringify(message));
			console.log("User " + socket.guid + " joins room "+val +" !");

	});
	console.log(io.sockets.adapter.rooms);
	    
        // tracking guid and other settings
                config1.guid = data.guid;
                config1.orgs = data.orgs;
                config1.socketid = socket.id;
                //patients.push(JSON.stringify(config));
                patients.push(config1);
                currentIndex ++;
        patients.forEach(function(val,index,array){
            console.log("Index "+index + " - guid : "+val.guid +" socketid = " + val.socketid);
        });
    });
    socket.on("disconnect", function(){
            console.log("Client disconnected");
            console.log("The socket id " + socket.patientsocketid + " is no more available " + socket.guid);
            console.log("The socket id " + socket.id + " is no more available");
    });


});
httpserver.listen(port,function(){
 console.log("Server started and listening on port " + port);    
});
