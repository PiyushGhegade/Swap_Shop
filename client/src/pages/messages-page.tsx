import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import axios from "axios";
import ConversationList from "@/components/messages/conversation-list";
import MessageThread from "@/components/messages/message-thread";
import { Conversation, User } from "@shared/schema";

interface EnrichedConversation extends Conversation {
  otherUser: User;
  listing?: { title: string; id: string; price: number };
  lastMessageAt: string | Date;
}

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<EnrichedConversation | null>(null);
  const [searchString] = useSearch(); // returns a string like '?cid=xyz'

  const searchParams = new URLSearchParams(searchString);
  const cid = searchParams.get("cid");

  // 1. Fetch current user
  useEffect(() => {
  axios.get("/api/auth/me").then((res) => {
  const user = res.data.user || res.data; // 🔥 handles both `{user: {...}}` and `{...}`
  console.log("✅ Authenticated user fetched:", user);
  setCurrentUser({
    ...user,
    id: user._id || user.id, // force id
  });
});

}, []);


  // 2. Fetch all conversations
  useEffect(() => {
    axios.get("/api/conversations").then((res) => {
      setConversations(res.data);
    });
  }, []);

  // 3. If there's a ?cid=... in the URL, load that conversation directly
  useEffect(() => {
    if (cid && currentUser) {
      axios
        .get(`/api/conversations/${cid}`)
        .then((res) => {
          const convo = res.data;
          const otherUser = convo.participants.find(
            (u: User) => u._id !== currentUser._id
          );
          const enriched: EnrichedConversation = {
            ...convo,
            id: convo._id,
            otherUser,
            listing: convo.listing,
            lastMessageAt: convo.updatedAt,
          };
          setSelectedConversation(enriched);
        })
        .catch((err) => {
          console.error("Error fetching conversation by cid:", err);
        });
    }
  }, [cid, currentUser]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={(conv) => setSelectedConversation(conv)}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedConversation && currentUser ? (
          <MessageThread
            conversation={selectedConversation}
            currentUser={currentUser}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
