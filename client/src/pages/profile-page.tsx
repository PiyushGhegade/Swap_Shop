import { useEffect, useState } from "react";
import { useLocation as useRouterLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import ProfileInfo from "@/components/profile/profile-info";
import UserListings from "@/components/profile/user-listings";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [location, navigate] = useRouterLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const params = new URLSearchParams(location.split("?")[1]);
  const defaultTab = params.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams();
    newParams.set("tab", value);
    navigate(`/profile?${newParams.toString()}`, { replace: true });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log("👤 [ProfilePage] Loaded user:", user);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Profile</h1>
            <p className="text-gray-500">Manage your account and listings</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="mt-4 sm:mt-0"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing out...
              </>
            ) : (
              "Sign out"
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
         <TabsList className="grid w-full grid-cols-3 mb-8 gap-2">
          <TabsTrigger
            value="profile"
            className={`${
              activeTab === "profile"
                ? "bg-blue-600 text-white border border-blue-700 shadow focus:outline-none"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            } transition-all font-semibold py-2 rounded-md`}
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="listings"
            className={`${
              activeTab === "listings"
                ? "bg-blue-600 text-white border border-blue-700 shadow focus:outline-none"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            } transition-all font-semibold py-2 rounded-md`}
          >
            My Listings
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className={`${
              activeTab === "settings"
                ? "bg-blue-600 text-white border border-blue-700 shadow focus:outline-none"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            } transition-all font-semibold py-2 rounded-md`}
          >
            Settings
          </TabsTrigger>
        </TabsList>






          <TabsContent value="profile">
            {user && (
              <ProfileInfo
                user={{
                  id: user.id,
                  name: user.name,
                  username: user.username,
                  email: user.email,
                  rollno: user.rollno,
                  avatar: user.avatar ?? "",
                  displayName: user.displayName ?? user.name ?? "",
                  phone: user.phone ?? "",
                  hostel: user.hostel ?? "",
                  roomNumber: user.roomNumber ?? "",
                  createdAt: user.createdAt ?? "",
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="listings">
            <UserListings userId={user.id} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                  <p className="text-gray-500 mb-4">Choose which types of emails you'd like to receive</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary mr-2" />
                      New messages
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary mr-2" />
                      Activity on my listings
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary mr-2" />
                      Campus marketplace updates
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🔴 Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-4">Please enter your password to permanently delete your account.</p>

            <input
              type="password"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            {deleteError && <p className="text-sm text-red-600 mb-2">{deleteError}</p>}

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={isDeleting}
                onClick={async () => {
                  console.log("🔐 [DeleteModal] Verifying password...");
                  setIsDeleting(true);
                  setDeleteError("");

                  try {
                    const verifyRes = await fetch("/api/auth/verify-password", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ password: deletePassword }),
                    });

                    const verifyData = await verifyRes.json();
                    if (!verifyRes.ok) throw new Error(verifyData.message);

                    console.log("✅ [DeleteModal] Password verified");

                    const delRes = await fetch(`/api/users/${user.id}`, {
                      method: "DELETE",
                      credentials: "include",
                    });

                    const delData = await delRes.json();
                    if (!delRes.ok) throw new Error(delData.message);

                    console.log("🗑️ [DeleteModal] Account deleted");
                    toast({ title: "Account Deleted", description: "Your account and data were removed." });

                    logoutMutation.mutate();
                  } catch (err: any) {
                    console.error("❌ [DeleteModal] Error deleting account:", err.message);
                    setDeleteError(err.message);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
