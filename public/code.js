(function()
{
    let receiverID;
    const socket = io();

    //generates unique id
    function generateID()
    {
        return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`
    }

    //Code for making unique room
    document.querySelector("#sender-start-con-btn").addEventListener("click",function()
    {
        let joinID = generateID();
        document.querySelector("#join-id").innerHTML = `
        <b>Room ID</b>
        <span>${joinID}</span>
        `;
        socket.emit("sender-join", 
        {
            uid:joinID
        });
    });

    //Code for initializing Socket
    socket.on("init", function(uid)
    {
        receiverID = uid;
        document.querySelector(".join-screen").classList.remove("active");
        document.querySelector(".fs-screen").classList.add("active");
    });

    //Code for taking file as input
    document.querySelector("#file-input").addEventListener("change", function (e) 
    {
        let file = e.target.files[0];
        if(!file){(function(){

            let receiverID;
            const socket = io();
        
            //generateID is declared here again as the function isnt global
            function generateID()
            {
                return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`;
            }
        
            //Code that execute when sender click start connection
            document.querySelector("#sender-start-con-btn").addEventListener("click",function()
            {
                let joinID = generateID();
                document.querySelector("#join-id").innerHTML = `
                    <b>Room ID</b>
                    <span>${joinID}</span>
                `;
                socket.emit("sender-join", 
                {
                    uid:joinID
                });
            });
        
            socket.on("init",function(uid)
            {
                receiverID = uid;
                document.querySelector(".join-screen").classList.remove("active");
                document.querySelector(".fs-screen").classList.add("active");
            });
        
            //Code that execute when we click file input/upload
            document.querySelector("#file-input").addEventListener("change",function(e)
            {
                let file = e.target.files[0];
                if(!file)
                {
                    return;		
                }
                let reader = new FileReader();
                reader.onload = function(e)
                {
                    let buffer = new Uint8Array(reader.result);
        
                    let el = document.createElement("div");
                    el.classList.add("item");
                    el.innerHTML = `
                            <div class="progress">0%</div>
                            <div class="filename">${file.name}</div>
                    `;
                    document.querySelector(".files-list").appendChild(el);
                    shareFile({
                        filename: file.name,
                        total_buffer_size:buffer.length,
                        buffer_size:32768,
                    }, buffer, el.querySelector(".progress"));
                }
                reader.readAsArrayBuffer(file);
            });
        
            //code for implementing file sharing
            function shareFile(metadata,buffer,progress_node)
            {
                socket.emit("file-meta", {
                    uid:receiverID,
                    metadata:metadata
                });
                
                socket.on("fs-share",function()
                {
                    let chunk = buffer.slice(0,metadata.buffer_size);
                    buffer = buffer.slice(metadata.buffer_size,buffer.length);
                    progress_node.innerText = Math.trunc(((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size * 100));
                    if(chunk.length != 0)
                    {
                        socket.emit("file-raw", {
                            uid:receiverID,
                            buffer:chunk
                        });
                    } 
                    else
                    {
                        console.log("Sent file successfully");
                    }
                });
            }
        })();
            return;
        }
        
        let reader = new FileReader();
        reader.onload = function(e)
        {
            let buffer = new Uint8Array(reader.result);
            let el = document.createElement("div");
            el.classList.add("item");
            el.innerHTML = ` 
                <div class = "progress">0%</div>
                <div class = "filename">${file.name}</div>
            `;
            document.querySelector(".files-list").appendChild(el);
            shareFile({
                filename:file.name,
                total_buffer_size:buffer.length,
                buffer_size:32768
            },buffer,el.querySelector(".progress"));

            // console.log(buffer);
        }
        reader.readAsArrayBuffer(file);
    });

    //code to implement sharing file
    function shareFile(metadata,buffer,progress_node)
    {
        socket.emit("file-meta",{
            uid:receiverID,
            metadata:metadata
        });
        socket.on("fs-share",function()
        {
            let chunk = buffer.slice(0,metadata.buffer_size);
            buffer = buffer.slice(metadata.buffer_size, buffer.length);
            progress_node.innerText = Math.trunc(((metadata.total_buffer_size - buffer.length) / metadata.total_buffer_size) *100) + "%";
            if(chunk.length != 0){
                socket.emit("file-raw", {
                    uid:receiverID,
                    buffer:chunk
                });
            }
        });
    }

})();