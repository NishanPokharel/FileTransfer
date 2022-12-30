const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

//code to make public dir accessible in tne server
app.use(express.static(path.join(__dirname+"/public")));


io.on("connection", function(socket)
{
	//code that activates when sender joins
	socket.on("sender-join",function(data)
	{
		socket.join(data.uid);
	});

	//code that activates when receiver join
	socket.on("receiver-join",function(data)
	{
		socket.join(data.uid);
		socket.in(data.sender_uid).emit("init", data.uid);
	});

	//code that creates metadata for the file
	socket.on("file-meta",function(data)
	{
		socket.in(data.uid).emit("fs-meta", data.metadata);
	});

	socket.on("fs-start",function(data)
	{
		socket.in(data.uid).emit("fs-share", {});
	});
	
	socket.on("file-raw",function(data)
	{
		socket.in(data.uid).emit("fs-share", data.buffer);
	})
});

server.listen(5000);
