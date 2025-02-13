const express = require("express");
const { Client, GatewayIntentBits, AuditLogEvent } = require("discord.js");
const cors = require("cors");
const { BOT_TOKEN } = require("./config");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

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

// ✅ Get Audit Logs
app.get("/api/servers/:serverId/audit-logs", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    try {
        const logs = await guild.fetchAuditLogs({ limit: 20 });
        const logEntries = logs.entries.map(log => ({
            action: AuditLogEvent[log.action] || "Unknown",
            user: log.executor.tag,
            target: log.target?.tag || log.target?.id,
            reason: log.reason || "No reason provided"
        }));
        res.json(logEntries);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch audit logs", details: err.message });
    }
});

// ✅ Kick a Member
app.post("/api/servers/:serverId/members/:memberId/kick", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    try {
        await guild.members.kick(req.params.memberId, req.body.reason || "No reason provided");
        res.json({ success: true, message: "Member kicked successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to kick member", details: err.message });
    }
});

// ✅ Ban a Member
app.post("/api/servers/:serverId/members/:memberId/ban", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    try {
        await guild.members.ban(req.params.memberId, { reason: req.body.reason || "No reason provided" });
        res.json({ success: true, message: "Member banned successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to ban member", details: err.message });
    }
});

// ✅ Manage Roles
app.post("/api/servers/:serverId/roles", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    try {
        const role = await guild.roles.create({
            name: req.body.name,
            color: req.body.color || "#FFFFFF",
            permissions: req.body.permissions || []
        });
        res.json({ success: true, role });
    } catch (err) {
        res.status(500).json({ error: "Failed to create role", details: err.message });
    }
});

// ✅ Delete Role
app.delete("/api/servers/:serverId/roles/:roleId", async (req, res) => {
    const guild = client.guilds.cache.get(req.params.serverId);
    if (!guild) return res.status(404).json({ error: "Server not found" });

    try {
        await guild.roles.delete(req.params.roleId);
        res.json({ success: true, message: "Role deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete role", details: err.message });
    }
});

// Start Express server
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
client.login(BOT_TOKEN);
