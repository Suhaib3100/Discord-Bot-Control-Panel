"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Server, Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      const data = await response.json();
      setServers(data);
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  const fetchChannels = async (serverId: string) => {
    try {
      setSelectedServer(serverId);
      setChannels([]);
      setMessages([]);
      setSelectedChannel(null);

      const response = await fetch(`http://localhost:5000/api/servers/${serverId}/channels`);
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const fetchMessages = async (serverId: string, channelId: string, channelName: string) => {
    try {
      setLoading(true);
      setSelectedChannel({ id: channelId, name: channelName });

      const response = await fetch(`http://localhost:5000/api/servers/${serverId}/channels/${channelId}/messages`);
      const data = await response.json();
      // Ensure messages is always an array
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Reset messages to an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Servers Sidebar */}
      <div className="w-[72px] bg-card border-r flex flex-col items-center py-4 gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Server className="w-6 h-6 text-primary" />
        </div>
        <Separator className="w-8" />
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-4 px-3">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => fetchChannels(server.id)}
                className={`w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center group relative ${
                  selectedServer === server.id ? "bg-primary/30" : ""
                }`}
              >
                <div className="text-primary text-sm font-semibold">
                  {server.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover rounded text-sm invisible group-hover:visible whitespace-nowrap z-10">
                  {server.name}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-card/50 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Channels</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => fetchMessages(selectedServer!, channel.id, channel.name)}
                className={`w-full px-3 py-2 rounded-md hover:bg-accent flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${
                  selectedChannel?.id === channel.id ? "bg-accent text-foreground" : ""
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
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-card/50">
          <h2 className="font-semibold flex items-center gap-2">
            <Hash className="w-5 h-5" />
            <span>{selectedChannel?.name || "Select a channel"}</span>
          </h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                {selectedChannel ? "No messages found in this channel" : "Select a channel to view messages"}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="flex gap-4 p-4 hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">
                      {msg.author.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{msg.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">{msg.content}</div>
                    {msg.attachment && (
                      <div className="mt-2">
                        <img
                          src={msg.attachment}
                          alt="Attachment"
                          className="max-w-[300px] rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}