document.addEventListener("DOMContentLoaded", () => {
    fetchServers();
});

function fetchServers() {
    fetch("http://localhost:5000/api/servers")
        .then(response => response.json())
        .then(servers => {
            const serversDiv = document.getElementById("servers");
            serversDiv.innerHTML = "";

            servers.forEach(server => {
                const btn = document.createElement("button");
                btn.textContent = server.name;
                btn.onclick = () => fetchChannels(server.id);
                serversDiv.appendChild(btn);
            });
        })
        .catch(error => console.error("Error fetching servers:", error));
}

function fetchChannels(serverId) {
    fetch(`http://localhost:5000/api/servers/${serverId}/channels`)
        .then(response => response.json())
        .then(channels => {
            const channelsDiv = document.getElementById("channels");
            channelsDiv.innerHTML = "";

            channels.forEach(channel => {
                const btn = document.createElement("button");
                btn.textContent = channel.name;
                btn.onclick = () => fetchMessages(serverId, channel.id);
                channelsDiv.appendChild(btn);
            });
        })
        .catch(error => console.error("Error fetching channels:", error));
}

function fetchMessages(serverId, channelId) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "<p>Loading messages...</p>";

    fetch(`http://localhost:5000/api/servers/${serverId}/channels/${channelId}/messages`)
        .then(response => response.json())
        .then(messages => {
            messagesDiv.innerHTML = "";

            if (messages.length === 0) {
                messagesDiv.innerHTML = "<p>No messages found.</p>";
                return;
            }

            messages.forEach(msg => {
                const msgDiv = document.createElement("div");
                msgDiv.classList.add("message");
                msgDiv.innerHTML = `<strong>${msg.author}:</strong> ${msg.content}`;

                if (msg.attachment) {
                    const img = document.createElement("img");
                    img.src = msg.attachment;
                    img.style.maxWidth = "200px";
                    msgDiv.appendChild(document.createElement("br"));
                    msgDiv.appendChild(img);
                }

                messagesDiv.appendChild(msgDiv);
            });
        })
        .catch(error => console.error("Error fetching messages:", error));
}
