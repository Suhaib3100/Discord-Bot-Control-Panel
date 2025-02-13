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
                const serverBtn = document.createElement("button");
                serverBtn.className = "w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center group relative";
                
                const serverName = document.createElement("div");
                serverName.className = "absolute left-full ml-2 px-2 py-1 bg-popover rounded text-sm invisible group-hover:visible whitespace-nowrap z-10";
                serverName.textContent = server.name;
                
                const serverIcon = document.createElement("div");
                serverIcon.className = "text-primary text-sm font-semibold";
                serverIcon.textContent = server.name.substring(0, 2).toUpperCase();
                
                serverBtn.appendChild(serverIcon);
                serverBtn.appendChild(serverName);
                serverBtn.onclick = () => {
                    document.querySelectorAll("#servers button").forEach(btn => btn.classList.remove("bg-primary/30"));
                    serverBtn.classList.add("bg-primary/30");
                    fetchChannels(server.id);
                };
                
                serversDiv.appendChild(serverBtn);
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
                const channelBtn = document.createElement("button");
                channelBtn.className = "w-full px-3 py-2 rounded-md hover:bg-accent flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors";
                
                const hashIcon = document.createElement("span");
                hashIcon.className = "text-muted-foreground";
                hashIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="m14 3 2 18"/></svg>`;
                
                const channelName = document.createElement("span");
                channelName.textContent = channel.name;
                
                channelBtn.appendChild(hashIcon);
                channelBtn.appendChild(channelName);
                channelBtn.onclick = () => {
                    document.querySelectorAll("#channels button").forEach(btn => btn.classList.remove("bg-accent"));
                    channelBtn.classList.add("bg-accent");
                    fetchMessages(serverId, channel.id);
                };
                
                channelsDiv.appendChild(channelBtn);
            });
        })
        .catch(error => console.error("Error fetching channels:", error));
}

function fetchMessages(serverId, channelId) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = '<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>';

    fetch(`http://localhost:5000/api/servers/${serverId}/channels/${channelId}/messages`)
        .then(response => response.json())
        .then(messages => {
            messagesDiv.innerHTML = "";

            if (messages.length === 0) {
                messagesDiv.innerHTML = '<div class="text-muted-foreground text-center py-8">No messages found in this channel.</div>';
                return;
            }

            messages.forEach(msg => {
                const msgDiv = document.createElement("div");
                msgDiv.className = "flex gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors";
                
                const avatarDiv = document.createElement("div");
                avatarDiv.className = "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0";
                avatarDiv.innerHTML = `<span class="text-primary font-semibold">${msg.author.substring(0, 2).toUpperCase()}</span>`;
                
                const contentDiv = document.createElement("div");
                contentDiv.className = "flex-1 space-y-1";
                
                const headerDiv = document.createElement("div");
                headerDiv.className = "flex items-center gap-2";
                headerDiv.innerHTML = `
                    <span class="font-semibold">${msg.author}</span>
                    <span class="text-xs text-muted-foreground">${new Date().toLocaleDateString()}</span>
                `;
                
                const messageContent = document.createElement("div");
                messageContent.className = "text-sm";
                messageContent.textContent = msg.content;
                
                contentDiv.appendChild(headerDiv);
                contentDiv.appendChild(messageContent);
                
                if (msg.attachment) {
                    const attachmentDiv = document.createElement("div");
                    attachmentDiv.className = "mt-2";
                    const img = document.createElement("img");
                    img.src = msg.attachment;
                    img.className = "max-w-[300px] rounded-lg";
                    attachmentDiv.appendChild(img);
                    contentDiv.appendChild(attachmentDiv);
                }
                
                msgDiv.appendChild(avatarDiv);
                msgDiv.appendChild(contentDiv);
                messagesDiv.appendChild(msgDiv);
            });
        })
        .catch(error => console.error("Error fetching messages:", error));
}