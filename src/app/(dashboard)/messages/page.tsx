"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, Users } from "lucide-react";

interface MessageItem {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string; role: string };
}

interface ClientSummary {
  id: string;
  name: string;
}

export default function MessagesPage() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch client list
  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/clients?limit=100");
        const data = await res.json();
        setClients(data.clients?.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })) || []);
      } catch {
        setClients([]);
      }
    }
    loadClients();
  }, []);

  // Fetch messages for selected client
  const fetchMessages = useCallback(async () => {
    if (!selectedClient) return;
    try {
      const res = await fetch(`/api/messages?clientId=${selectedClient}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
  }, [selectedClient]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient) return;

    setSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          clientId: selectedClient,
          // TODO: use real userId from auth context
          senderId: "current-user",
        }),
      });
      setNewMessage("");
      fetchMessages();
    } catch {
      // handle error
    } finally {
      setSending(false);
    }
  }

  const selectedClientName = clients.find((c) => c.id === selectedClient)?.name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Echangez avec vos clients
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr] h-[calc(100vh-220px)]">
        {/* Client list */}
        <Card className="overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-[calc(100vh-340px)]">
              {clients.length === 0 ? (
                <p className="p-4 text-sm text-zinc-500 text-center">
                  Aucun client
                </p>
              ) : (
                clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      selectedClient === client.id
                        ? "bg-zinc-100 dark:bg-zinc-800"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold dark:bg-zinc-700">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium truncate">{client.name}</span>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="flex flex-col overflow-hidden">
          {selectedClient ? (
            <>
              <CardHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <CardTitle className="text-sm">{selectedClientName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-8 w-8 text-zinc-300 mb-2" />
                    <p className="text-sm text-zinc-500">
                      Aucun message. Commencez la conversation !
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isComptable = msg.sender.role !== "CLIENT";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isComptable ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isComptable
                              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                              : "bg-zinc-100 dark:bg-zinc-800"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isComptable
                                ? "text-zinc-300 dark:text-zinc-500"
                                : "text-zinc-400"
                            }`}
                          >
                            {msg.sender.name ?? msg.sender.email} -{" "}
                            {new Date(msg.createdAt).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ecrire un message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim() || sending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-12 w-12 text-zinc-300 mb-3" />
              <p className="text-zinc-500">
                Selectionnez un client pour voir les messages
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
