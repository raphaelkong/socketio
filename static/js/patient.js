var remote = 'http://sjbw0052.h2ad.local:1234';
var socketNamespace = '/p';
var socket = io.connect(remote+socketNamespace);
var parsedURI ;

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

//var roomName = decodeURI(  (RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search)     || [, null])[1]);
socket.on('room_message', function(data){
    data = JSON.parse(data);
    console.log("Message to room " + data.messageroom);
    $('#messages').append('<div class="'+data.type+'">' + data.messageroom +'</div>');
});
socket.on('message',function(data){
    data = JSON.parse(data);
    console.log("Socket conencted !");
    console.log("Sending data to server  :" +localdata.guid + ' ' + localdata.orgs);
    socket.emit('send_config',localdata);
    $('#messages').append('<div class="'+data.type+'">' + data.message +'</div>');
});

socket.on('ps_connected',function(data){
    data = JSON.parse(data);
    $('#connected').append('<div class=\'connected\'>PS connected ! : His socketid is : '+data.socketps+'</div>');
});

socket.on('patient_connected',function(data){
    data = JSON.parse(data);
    $('#connected').append('<div class=\'connected\'>Patient connected ! : your socketid is : '+data.socketid+'</div>');
});

$(document).ready(function(){
//$(function(){
    console.log("Starting ..");
    console.log(parsedURI.guid +' ' +parsedURI.orgs);

    $('#send').click(function(){
        var data = {};
        data.guid = parsedURI.guid;
        data.orgs = parsedURI.orgs;

        console.log(data.guid);
        socketuser.send(JSON.stringify(data));
        $('#message').val('');
    });
    $('#setname').click(function(){
        socketsystem.emit('set_name',{name : $('#nickname').val()});
        console.log("Emitting set_name event : " + $('#nickname').val());
    });
});
