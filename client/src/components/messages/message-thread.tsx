import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Message, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import socket from "@/lib/socket";

interface MessageThreadProps {
  conversation: {
    id: string;
    otherUser: User;
    listing?: {
      id: string;
      title: string;
      price: number;
    };
  };
  currentUser: User;
}

export default function MessageThread({ conversation, currentUser }: MessageThreadProps) {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Load initial messages
  const { isLoading } = useQuery({
    queryKey: [`/api/messages/${conversation.id}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/messages/${conversation.id}`);
      const data = await res.json();
      setMessages(data);
      return data;
    },
    enabled: !!conversation?.id,
  });

  // ✅ Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/messages/mark-read/${conversation.id}`);
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
    },
    onError: (err: any) => {
      console.error("❌ Failed to mark messages as read:", err);
    },
  });

  // ✅ Mark as read when messages load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [messages]);

  // ✅ Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const payload = {
        content,
        conversationId: conversation.id,
      };

      console.log("📤 Sending message payload:", payload);
      const res = await apiRequest("POST", `/api/messages`, payload);
      const data = await res.json();

      console.log("✅ Message sent response:", data);
      return data;
    },
    onSuccess: (msg) => {
      socket.emit("sendMessage", {
        ...msg,
        receiver: conversation.otherUser.id || conversation.otherUser._id,
      });

      setMessages((prev) => [...prev, msg]);
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (err: any) => {
      console.error("❌ Error sending message:", err);
      toast({
        title: "Error sending message",
        description: err.message || "Unknown error",
        variant: "destructive",
      });
    },
  });

  // ✅ Socket join + receive
  useEffect(() => {
    if (!conversation.id) return;
    socket.emit("join", conversation.id);

    const handleReceive = (msg: Message) => {
      if (msg.conversation === conversation.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [conversation.id]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={conversation.otherUser?.avatar} alt={conversation.otherUser?.username} />
            <AvatarFallback>
              {conversation.otherUser?.username?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">
              {conversation.otherUser?.displayName || conversation.otherUser?.username}
            </h3>
            {conversation.listing && (
              <Link
                href={`/listing/${conversation.listing.id}`}
                className="text-sm text-primary hover:underline"
              >
                View listing: {conversation.listing.title}
              </Link>
            )}
          </div>
        </div>
        {conversation.listing?.price && (
          <div className="text-right">
            <span className="text-sm font-medium">
              ₹{conversation.listing.price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const senderId = msg.sender?._id || msg.sender || msg.senderId;
            const userId = currentUser._id || currentUser.id;
            const isCurrentUser = String(senderId) === String(userId);

            return (
              <div
                key={msg._id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-3 m-1 shadow ${
                    isCurrentUser
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-300"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-right text-gray-100" : "text-left text-gray-500"
                    }`}
                  >
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className="ri-chat-1-line text-2xl text-primary"></i>
            </div>
            <p className="text-center">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type a message..."
            className="flex-1 resize-none"
            rows={2}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || messageText.trim() === ""}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <i className="ri-send-plane-fill text-lg"></i>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
