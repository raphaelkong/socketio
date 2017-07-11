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
    socket.join('h2ad');
    io.of('p').in('h2ad').emit('room_message',
        JSON.stringify(
            {type:'serverMessage','messageroom': 'new socket joins room h2ad : '+socket.id}
            )
        );
    socket.send(JSON.stringify(
            {type:'serverMessage',message:'Welcome !'})
        
    );
    if(socketPS) {
        console.log("The socket id of ps is " +socketPS); 
    }
    socket.emit('patient_connected',
        JSON.stringify(
            {type:'serverMessage','socketid': socket.id}
            )
        );
    console.log("Trying to send message to PS inside his ns");
    // nok santews.sockets.connected[socketPS].emit('message',
    //io.in('prescripteur').emit('message',
    io.of('/ps').emit('message',
            JSON.stringify(
                {type:'patientMessage','message':'hello I m a patient and i m connected through ' +socket.id}
                )
            );
    io.of('/ps').emit('update_list',
           patients
            );
                
    /*santews.broadcast.emit('patient_connected',
        JSON.stringify(
            {type:'serverMessage','socketid': socket.id}
            )
        );
*/
    socket.on("send_config",function(data){
    //    console.log(socket.id+ " has sent its config  guid => " +data.guid+ " orgs => "+data.orgs);
     //   console.log(socket.patientsocketid+ " has sent its config  guid => " +data.guid+ " orgs => "+data.orgs);
        var config1 = {};
        socket.guid = data.guid ;
        console.log(socket.patientsocketid+ " has sent its config  guid => " +socket.guid+" orgs => "+data.orgs);
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
  /*      if(guid[data.guid]) {
            console.log("Le guid est deja enregistré à la position : " + socket.currentIndex);
            console.log("Mise à jour de ses parametres");
            console.log("Ancienne socket ID : " +config.socketid + " => nouvelle : "+socket.id);
            socket.guid = data.guid;
	        config.guid = data.guid;
	        config.orgs = data.orgs;
	        config.socketid = socket.id;
            
            patients[guid.length - guid[guid.data]] = config;
        }
        else {
            console.log("New GUID : " + data.guid);
            guid[data.guid] = currentIndex;
            socket.currentIndex = currentIndex;
            trackingSocketId[socket.id]=currentIndex;
            trackingGuid[socket.id]=data.guid; 
            config.guid = data.guid;
            config.orgs = data.orgs;
            config.socketid = socket.id;
            patients.push(JSON.stringify(config));
            currentIndex ++;

            }
       
        console.log("Displaying the current patients connected");
        patients.forEach(function(val,index,array){
            var myjson = JSON.parse(array[index]);
            console.log("Index : " + index + " - Guid : " + myjson.guid +" socket id : "+myjson.socketid);
        });
        */
    });
    socket.on("disconnect", function(){
            console.log("Client disconnected");
            console.log("The socket id " + socket.patientsocketid + " is no more available " + socket.guid);
            console.log("The socket id " + socket.id + " is no more available");
            /*console.log("The index of socketid "+ socket.id + " is "+trackingSocketId[socket.id]);
            console.log("We need to remove the object from the patients array");
            console.log("Patients.length : "+patients.length);
            var idToBeDeleted = patients.length-trackingSocketId[socket.id];
            patients.splice(idToBeDeleted,1);
            trackingSocketId.splice(idToBeDeleted,1);
            console.log("GUID to be deleted : " +trackingGuid[socket.id]);

            console.log("Diplay new list : ");
            patients.forEach(function(val,index,array){
            var myjson = JSON.parse(array[index]);
            console.log("Index : " + index + " - Guid : " + myjson.guid +" socket id : "+myjson.socketid);
        });
*/
    	io.of('/ps').emit('Client disconnected',
	JSON.stringify(
		//{'socket': +socket.id})
		{'socket': socket.id})
	);
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
santews.on("connection",function(socket){
    socket.join('prescripteur');
    socketPS = socket.id;
    console.log('PS socket ID is '+socketPS);
    socket.send(JSON.stringify(
            {type:'serverMessage',message:'Connected  ! your socket id is '+socket.id})
        
    );
    socket.on("message", function(message){
        socket.send(JSON.stringify(
            {type:'serverMessage',message:'Welcome !'})
        
    );
    });

});
httpserver.listen(port,function(){
 console.log("Server started and listening on port " + port);    
});
