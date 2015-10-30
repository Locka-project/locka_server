var socket = io.sails.connect();

socket.on('connect', function(){
	console.log("Connected...");
});