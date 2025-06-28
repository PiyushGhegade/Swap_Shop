import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Conversation } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EnrichedConversation extends Conversation {
  otherUser: {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  listing?: {
    title: string;
  };
  lastMessageAt: string | Date;
  // latestMessagePreview?: string; // optionally used
}

interface ConversationListProps {
  conversations: EnrichedConversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: EnrichedConversation) => void;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;

    const otherUserName =
      conversation.otherUser?.displayName ||
      conversation.otherUser?.username ||
      "";

    const listingTitle = conversation.listing?.title || "";

    return (
      otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-[600px] flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Conversation Items */}
      {filteredConversations.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?.id === conversation.id;
            const username = conversation.otherUser?.displayName || conversation.otherUser?.username || "User";

            return (
              
              <button
                key={String(conversation.id)}
                className={`w-full text-left p-4 border-b hover:bg-gray-100 transition-all ${
                  isSelected ? "bg-gray-200" : ""
                  }`}

                
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={conversation.otherUser?.avatar}
                      alt={username}
                    />
                    <AvatarFallback>
                      {username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{username}</h3>
                      {conversation.lastMessageAt && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 truncate">
                      {conversation.listing?.title || "No title"}
                    </p><p className="text-sm text-gray-700 font-semibold truncate">
                      {conversation.listing?.title || "No listing"}
                    </p>
                    <p className="text-xs text-gray-500 truncate italic">
                      {conversation.latestMessagePreview || "No messages yet"}
                    </p>


                    {/* Optional: Uncomment if needed */}
                    {/* <p className="text-xs text-gray-400 truncate">{conversation.latestMessagePreview}</p> */}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-gray-500 text-center">
          {searchQuery
            ? "No conversations match your search"
            : "You have not started any conversations yet"}
        </div>
      )}
    </div>
  );
}
