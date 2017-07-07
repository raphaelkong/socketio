var remote = 'http://sjbw0052.h2ad.local:1234';
var socketNamespace = '/p';
var socket = io.connect(remote+socketNamespace);

//var roomName = decodeURI(  (RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search)     || [, null])[1]);

socket.on('message',function(data){
    data = JSON.parse(data);
    console.log("Socket conencted !");
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
    $('#send').click(function(){
        var data = {
            message: $('#message').val(),
            type: 'userMessage',
            name: $('#nickname').val(),
        }
        socketuser.send(JSON.stringify(data));
        $('#message').val('');
    });
    $('#setname').click(function(){
        socketsystem.emit('set_name',{name : $('#nickname').val()});
        console.log("Emitting set_name event : " + $('#nickname').val());
    });
});
