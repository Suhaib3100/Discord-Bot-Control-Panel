const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const cors = require("cors");
const { BOT_TOKEN } = require("./config");

const app = express();
app.use(cors());
const PORT = 5000;

// Discord bot client setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

// Store bot's servers
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// ✅ Get all connected servers
app.get("/api/servers", async (req, res) => {
    const servers = client.guilds.cache.map(guild => ({
        id: guild.id,
        name: guild.name
    }));
    res.json(servers);
});

// ✅ Get all channels of a server
app.get("/api/servers/:serverId/channels", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    const channels = guild.channels.cache.map(channel => ({
        id: channel.id,
        name: channel.name,
        type: channel.type
    }));

    res.json(channels);
});

// ✅ Get all messages from a specific channel
app.get("/api/servers/:serverId/channels/:channelId/messages", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    const channel = guild.channels.cache.get(req.params.channelId);
    if (!channel || !channel.isTextBased()) return res.status(404).json({ error: "Channel not found or not a text channel" });

    try {
        let allMessages = [];
        let lastMessageId = null;
        let hasMoreMessages = true;

        while (hasMoreMessages) {
            const options = { limit: 100 };
            if (lastMessageId) {
                options.before = lastMessageId;
            }

            const messages = await channel.messages.fetch(options);
            if (messages.size === 0) {
                hasMoreMessages = false;
            } else {
                allMessages = allMessages.concat(Array.from(messages.values()));
                lastMessageId = messages.last().id;
            }
        }

        const messageData = allMessages.map(msg => ({
            author: msg.author.username,
            content: msg.content,
            attachments: msg.attachments.map(attachment => attachment.url)
        }));

        res.json(messageData);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages", details: err.message });
    }
});

// Start Express server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

client.login(BOT_TOKEN);