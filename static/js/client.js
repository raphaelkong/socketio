var remote = 'http://sjbw0052.h2ad.local:1234';
var socketNamespace = '/';
var socket = io.connect(remote+socketNamespace);
var socketNamespaceSystem = '/system';
var socketsystem = io.connect(remote+socketNamespaceSystem);
var socketNamespaceUser = '/user';
var socketuser = io.connect(remote+socketNamespaceUser);

var roomName = decodeURI(  (RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search)     || [, null])[1]);


function generateRandom(len){
    var text = '';
    var charset = 'abcdefgABCDEF123456';
    var i ;
    for (i=0;i<len;i++){
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}

socketuser.on('message',function(data){
    data = JSON.parse(data);
    console.log("Socket conencted !");
    $('#messages').append('<div class="'+data.type+'">' + data.nickname +' : '+data.message +'</div>');
});

if(roomName) {
    socketsystem.emit('join_room',{room: roomName});

socketsystem.on('name_set',function(data){
    socket.nickname = data.name;
    $('#nameform').hide();
    $('#messages').append('<div class="systemMessage">Hello ' +data.name +' ('+socket.nickname+')! </div>');
});
};
socketsystem.on('user_entered',function(data){
    $('#messages').append('<div class="systemMessage">A new user has joined :'+ data.name +'</div>');
});
$(document).ready(function(){
    $('#presencepatient').click(function(){
        var guid = generateRandom(16);
        window.open(remote+'/patient?guid='+guid+'&orgs=123');
    });
    $('#presenceps').click(function(){
        var guid = generateRandom(16);
        window.open(remote+'/ps?guid='+guid+'&orgs=123');
    });
});
