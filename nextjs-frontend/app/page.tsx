"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Server, Hash, Crown, Shield, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface Server {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  name: string;
}

interface Message {
  id: string;
  author: string;
  content: string;
  attachment?: string;
}

export default function Home() {
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchServers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/servers");
      if (!response.ok) throw new Error("Failed to fetch servers");
      const data = await response.json();
      setServers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching servers:", error);
      setServers([]); // Reset to empty array on error
    }
  };

  const fetchChannels = async (serverId: string) => {
    try {
      setSelectedServer(serverId);
      setChannels([]);
      setMessages([]);
      setSelectedChannel(null);

      const response = await fetch(`http://localhost:5000/api/servers/${serverId}/channels`);
      if (!response.ok) throw new Error("Failed to fetch channels");
      const data = await response.json();
      setChannels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching channels:", error);
      setChannels([]); // Reset to empty array on error
    }
  };

  const fetchMessages = async (serverId: string, channelId: string, channelName: string) => {
    try {
      setLoading(true);
      setSelectedChannel({ id: channelId, name: channelName });

      const response = await fetch(`http://localhost:5000/api/servers/${serverId}/channels/${channelId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []); // Ensure messages is always an array
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-accent/5">
      {/* Brand Header */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-lg rounded-full">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium">Powered by</span>
        <span className="font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Suhaib King
        </span>
      </div>

      {/* Servers Sidebar */}
      <div className="w-[72px] bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-4 gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <Separator className="w-8 bg-white/10" />
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-4 px-3">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => fetchChannels(server.id)}
                className={`w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center group relative hover:scale-105 ${
                  selectedServer === server.id ? "bg-white/20 ring-2 ring-purple-500 ring-offset-2 ring-offset-background" : ""
                }`}
              >
                <div className="text-white/90 text-sm font-semibold">
                  {server.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 rounded-lg text-sm invisible group-hover:visible whitespace-nowrap z-10 backdrop-blur-xl border border-white/10">
                  {server.name}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Channels Sidebar */}
      <div className="w-64 bg-black/10 backdrop-blur-lg flex flex-col border-r border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            <span>Channels</span>
          </h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => fetchMessages(selectedServer!, channel.id, channel.name)}
                className={`w-full px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors ${
                  selectedChannel?.id === channel.id ? "bg-white/10 text-white" : ""
                }`}
              >
                <Hash className="w-4 h-4" />
                <span>{channel.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-black/5">
        <div className="p-4 border-b border-white/10 bg-black/10 backdrop-blur-lg">
          <h2 className="font-semibold flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-500" />
            <span>{selectedChannel?.name || "Select a channel"}</span>
          </h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-white/50 text-center py-8 flex flex-col items-center gap-4">
                <MessageSquare className="w-12 h-12" />
                {selectedChannel ? "No messages found in this channel" : "Select a channel to view messages"}
              </div>
            ) : (
              messages.map((msg, index) => (
                <Card key={index} className="flex gap-4 p-4 hover:bg-white/5 transition-colors border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {msg.author.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{msg.author}</span>
                      <span className="text-xs text-white/50">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-white/80">{msg.content}</div>
                    {msg.attachment && (
                      <div className="mt-2">
                        <img
                          src={msg.attachment}
                          alt="Attachment"
                          className="max-w-[300px] rounded-lg border border-white/10"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}