"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare } from "lucide-react";

interface MessageItem {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string | null; email: string; role: string };
}

export default function PortalMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO: use real clientId from portal auth
  const clientId = "portal-client";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/messages?clientId=${clientId}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch {
        setMessages([]);
      }
    }
    load();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          clientId,
          senderId: "portal-user",
        }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      }
    } catch {
      // handle error
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Echangez avec votre expert-comptable
        </p>
      </div>

      <Card className="flex flex-col h-[calc(100vh-280px)]">
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 p-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversation avec votre comptable
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-8 w-8 text-zinc-300 mb-2" />
              <p className="text-sm text-zinc-500">
                Aucun message pour le moment. Envoyez votre premier message !
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isClient = msg.sender.role === "CLIENT";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isClient ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isClient
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        isClient
                          ? "text-zinc-300 dark:text-zinc-500"
                          : "text-zinc-400"
                      }`}
                    >
                      {msg.sender.name ?? "Comptable"} -{" "}
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
              placeholder="Ecrire un message a votre comptable..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
