var remote = 'http://sjbw0052.h2ad.local:1234';
//var remote = 'http://localhost:1234';
var socketNamespace = '/p';
var socket = io.connect(remote+socketNamespace,{'transports':['websocket']});
// Should fix multi socket opening when refresh tab, but doesn t work
// var socket = io({transports: ['websocket'], upgrade: false}).connect(remote+socketNamespace);
var guid = [];

function parseURL(url){
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;

    parser.href = decodeURI(url);
    queries = parser.search.replace(/^\?/, '').split('&');
    for(i=0; i< queries.length; i++){
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    return searchObject;
}
parsedURI=parseURL(location.search);
    var localdata = {};
    localdata.guid = parsedURI.guid;
    localdata.orgs = parsedURI.orgs;
    localdata.type = 'ps';

    socket.emit('send_config_ps',localdata);

socket.on('message',function(data){
    data = JSON.parse(data);
    console.log("Socket connected !");
    $('#messages').append('<div class="'+data.type+'">' +data.message +'</div>');
});

socket.on('room_message_to_ps', function(data){
    var message = {};
    data = JSON.parse(data);
    message.guid = localdata.guid;
    message.socketidps = socket.id;
    message.socketidpatient = data.socketid;
    message.type = 'connect';
    message.message = 'This is a private message';
    $('#messages').append('<div class="'+data.type+'">' + data.messageroom +'</div>');
    $('#messages').append('<div id='+data.guid+' class="'+data.type+'"> send private message from '+ message.guid+ ' to '+data.guid+' using this socket id ' +data.socketid+'</div>');
    $('#'+data.guid).click(function(){
        alert('sending message to '+data.guid+' using this socket : '+data.socketid);
        socket.emit('private_message_to_patient',JSON.stringify(message));
    });
});


socket.on("Client disconnected",function(data){
	data = JSON.parse(data);
	console.log(data.socket +" is no more available");
});

$(document).ready(function(){
/*    $('#messages').html=''; 
    var test = [];
    test['azerty']="azeerty";
    test['qwerty']="qwerrty";
    console.log("Testing test object :");
    console.log(test['azerty']);
    console.log(test.azerty);
    console.log(delete test.azerty);
    console.log("After delete " +test.azerty);
    console.log("=================================");
    guid.push("val1");
    guid.push("val2");
    for (i=0;i<guid.length;i++){
        console.log("Index "+ i +" : "+ guid[i]);
    }
    guid.forEach(function(val,index,array){
        console.log("current val :"+val +" current index : "+index+" current array : " +array);
        if(val === "val1"){
            array.pop(index);
        }
    });
    var inventaire = [
        {guid: '123456', socketid: 'aarrgGG', orgs: [0,1]},
        {guid: '112233', socketid: 'AAZEERs', orgs: [3,1]},
        {guid: '998876', socketid: 'ppOLLKq', orgs: [12,19]},
        
    ];
    var data = {} ;
    inventaire.forEach(function(val, index,array){
        console.log("Index "+index + " - guid : "+val.guid +" socketid = " + val.socketid);
    });
    console.log("Updating one element : guid=123456 => socket.id would be set to aaaaaa");
    inventaire[1].socketid='aaaaaaa';
    inventaire.forEach(function(val, index,array){
        console.log("Index "+index + " - guid : "+val.guid +" socketid = " + val.socketid);
    });

    console.log("Try to update an object of array");
    data.guid = '000000';
    data.socketid = '000000';

    inventaire[1] = data;
    inventaire.forEach(function(val, index,array){
        console.log("Index "+index + " - guid : "+val.guid +" socketid = " + val.socketid);
    });

    inventaire.push({guid: '999999',socketid: 'ssDDFFff'});
    inventaire.forEach(function(val, index,array){
        console.log("Index "+index + " - guid : "+val.guid);
    });
//    inventaire.splice(1,1);
    inventaire.forEach(function(val, index,array){
        console.log("Index "+index + " - guid : "+val.guid);
        $('#connected').append('<div id="'+val.guid+'">'+val.guid + ' (socket : '+val.socketid+')</div>');
        $('#'+val.guid).click(function(){
            $('#'+val.guid).slideUp();
        });
    });
    */
});

