import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  // ✅ Unread messages
  const { data: unreadMessages } = useQuery({
    queryKey: ["unreadMessages"],
    queryFn: async () => {
      if (!user) return { count: 0 };
      console.log("📨 Fetching unread messages for user:", user);
      const res = await axios.get("/api/messages/unread", {
        withCredentials: true,
      });
      console.log("✅ Unread messages response:", res.data);
      return res.data;
    },
    enabled: !!user,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    onError: (err: any) => {
      console.error("❌ Error during unread fetch:", err.response?.data || err.message);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("🔎 [Header] Search submit:", searchQuery);
      navigate(`/category?query=${encodeURIComponent(searchQuery)}`);

      setSearchQuery(""); // Optional: clear field
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };

  const getInitials = (username?: string, name?: string) =>
    (username || name || "🙂").substring(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <i className="ri-shopping-cart-line text-primary text-2xl mr-2"></i>
              <span className="text-xl font-bold text-primary">SWAP SHOP</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for items..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 text-gray-400 hover:text-primary" type="submit">
                <i className="ri-search-line text-lg"></i>
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <i className="ri-search-line text-lg"></i>
            </button>

            {user ? (
              <>
                <Link href="/messages">
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral">
                    <i className="ri-message-2-line text-lg"></i>
                    {unreadMessages?.count > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {unreadMessages.count}
                      </span>
                    )}
                  </div>
                </Link>

                <Link href="/create-listing">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral">
                    <i className="ri-add-circle-line text-lg"></i>
                  </div>
                </Link>


                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>
                          {getInitials(user.username, user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white shadow-md rounded-md border w-48">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Your Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile?tab=listings")}>
                      Your Listings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile?tab=settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default" className="ml-2">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for items..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 text-gray-400 hover:text-primary" type="submit">
                <i className="ri-search-line text-lg"></i>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
