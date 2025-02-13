"use client";

import { useState, useEffect } from "react";
import { Shield, UserPlus, UserMinus, Settings, Users, Crown, Loader2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Server {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string[];
}

interface Member {
  id: string;
  username: string;
  roles: string[];
}

export default function ManagementPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', color: '#FFFFFF' });
  const [memberAction, setMemberAction] = useState<{ type: string; memberId: string; reason: string } | null>(null);

  const fetchServers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/servers");
      const data = await response.json();
      setServers(data);
    } catch (error) {
      console.error("Error fetching servers:", error);
      toast.error("Failed to fetch servers");
    }
  };

  const handleCreateRole = async () => {
    if (!selectedServer) return;

    try {
      const response = await fetch(`http://localhost:5000/api/servers/${selectedServer}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });

      if (!response.ok) throw new Error('Failed to create role');

      toast.success('Role created successfully');
      setNewRole({ name: '', color: '#FFFFFF' });
      // Refresh roles list
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!selectedServer) return;

    try {
      const response = await fetch(`http://localhost:5000/api/servers/${selectedServer}/roles/${roleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete role');

      toast.success('Role deleted successfully');
      // Refresh roles list
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  const handleMemberAction = async () => {
    if (!memberAction || !selectedServer) return;

    try {
      const response = await fetch(`http://localhost:5000/api/servers/${selectedServer}/members/${memberAction.memberId}/${memberAction.type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: memberAction.reason })
      });

      if (!response.ok) throw new Error('Action failed');

      toast.success(`Member ${memberAction.type}ed successfully`);
    } catch (error) {
      console.error(`Error ${memberAction.type}ing member:`, error);
      toast.error(`Failed to ${memberAction.type} member`);
    } finally {
      setMemberAction(null);
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
          <Shield className="w-6 h-6 text-white" />
        </div>
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-4 px-3">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server.id)}
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

      {/* Management Interface */}
      <div className="flex-1 flex">
        {selectedServer ? (
          <Tabs defaultValue="members" className="flex-1">
            <div className="p-6">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Roles
                </TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="mt-0">
                <div className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Member Management</h2>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-white/5 border-white/10">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Member</DialogTitle>
                          </DialogHeader>
                          {/* Add member form */}
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-white/5 border-white/10">
                            <UserMinus className="w-4 h-4 mr-2" />
                            Remove Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Member</DialogTitle>
                          </DialogHeader>
                          {/* Remove member form */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {members.map((member) => (
                      <Card key={member.id} className="p-4 bg-white/5 border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {member.username.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{member.username}</h3>
                              <div className="flex gap-2 mt-1">
                                {member.roles.map((role, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 rounded-full text-xs bg-white/10"
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="roles" className="mt-0">
                <div className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Role Management</h2>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="bg-white/5 border-white/10">
                          Create Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Role</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input
                              placeholder="Enter role name"
                              value={newRole.name}
                              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Role Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={newRole.color}
                                onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                                className="w-12 h-12 p-1 bg-white/5"
                              />
                              <Input
                                value={newRole.color}
                                onChange={(e) => setNewRole({ ...newRole, color: e.target.value })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={handleCreateRole}
                            disabled={!newRole.name}
                          >
                            Create Role
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {roles.map((role) => (
                      <Card key={role.id} className="p-4 bg-white/5 border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: role.color }}
                            />
                            <h3 className="font-semibold">{role.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <UserMinus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Shield className="w-12 h-12 mx-auto text-white/50" />
              <h2 className="text-xl font-semibold">Select a Server</h2>
              <p className="text-white/50">Choose a server to manage members and roles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}