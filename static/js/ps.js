var remote = 'http://sjbw0052.h2ad.local:1234';
//var remote = 'http://localhost:1234';
var socketNamespace = '/ps';
var socket = io.connect(remote+socketNamespace);

var roomName = decodeURI(  (RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search)     || [, null])[1]);


var guid = [];

socket.on('message',function(data){
    data = JSON.parse(data);
    console.log("Socket conencted !");
    $('#messages').append('<div class="'+data.type+'">' +data.message +'</div>');
});

socket.on('patient_connected',function(data){
    console.log("new patient !");
    data = JSON.parse(data);
    $('#connected').append('<div class=\'connected\'>Patient connected ! : your socketid is : '+data.socketid+'</div>');
});
socket.on('update_list',function(data){
    console.log("new list !");
    //data = JSON.parse(data);
    //$('#connected').append('<div class=\'connected\'>Patient connected ! : your socketid is : '+data.socketid+'</div>');
//    console.log(data);
	//console.log(data.length);
	data.forEach(function(val,index,array){
	//var myjson = JSON.parse(array[index]);
		console.log("GUID : " + val.guid);
	});

});

socket.on("Client disconnected",function(data){
	data = JSON.parse(data);
	console.log(data.socket +" is no more available");
});

$(document).ready(function(){
    $('#messages').html=''; 
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
});

