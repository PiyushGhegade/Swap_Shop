import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "wouter";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import Popup from "@/components/ui/Popup";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string[];
  seller: string | User;
}

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  rollno: string;
  avatar?: string;
}

export default function ProductDetailPage() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const fetchListing = async (id: string) => {
    try {
      const res = await axios.get(`/api/listings/${id}`);
      setListing(res.data);
      if (typeof res.data?.seller === "object") {
        setSeller(res.data.seller);
      }
      console.log("📦 [ProductDetail] Listing fetched:", res.data);
    } catch (err) {
      console.error("❌ [ProductDetail] Error fetching listing:", err);
    }
  };

  const fetchCurrentUser = async () => {
  try {
    const res = await axios.get("/api/auth/me");
    console.log("👤 [ProductDetail] Raw user response:", res.data);

    const user = res.data?.user;

    if (user) {
      const normalizedUser = {
        ...user,
        id: user._id || user.id, // ensure we have `id`
      };
      console.log("👤 [ProductDetail] Normalized current user:", normalizedUser);
      setCurrentUser(normalizedUser); // ✅ set flattened user
    } else {
      console.warn("⚠️ [ProductDetail] User not found in response");
    }
  } catch (err) {
    console.error("❌ [ProductDetail] Failed to fetch current user:", err);
  }
};

  const handleDelete = async () => {
    if (!listing) return;
    const confirmed = confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/listings/${listing._id}`);
      toast({ title: "Deleted!", description: "Listing was deleted." });
      console.log("🗑️ [ProductDetail] Listing deleted:", listing._id);
      navigate("/");
    } catch (err) {
      toast({ title: "Error", description: "Could not delete listing." });
      console.error("❌ [ProductDetail] Failed to delete listing:", err);
    }
  };

  const handleChat = async () => {
    const sellerObj = typeof listing?.seller === "object" ? listing.seller : seller;
    const sellerId = sellerObj?._id || sellerObj?.id;
    const currentUserId = currentUser?._id || currentUser?.id;

    if (!currentUser || !sellerObj || currentUserId === sellerId) {
      console.warn("⚠️ [ProductDetail] Cannot chat with self.");
      setPopupMessage("Buyer and seller cannot be the same person.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/conversations",
        {
          userId: sellerId,
          listingId: listing?._id,
        },
        { withCredentials: true }
      );
      console.log("💬 [ProductDetail] Conversation started:", res.data);
      navigate(`/messages?cid=${res.data._id}`);
    } catch (err) {
      console.error("❌ [ProductDetail] Error creating conversation:", err);
      toast({
        title: "Error",
        description: "Failed to initiate chat.",
        variant: "destructive",
      });
    }
  };

  const handleBuy = () => {
    const sellerObj = typeof listing?.seller === "object" ? listing.seller : seller;
    const sellerId = sellerObj?._id || sellerObj?.id;
    const currentUserId = currentUser?._id || currentUser?.id;

    if (currentUserId === sellerId) {
      console.warn("⚠️ [ProductDetail] Buyer is the same as seller.");
      setPopupMessage("Buyer and seller cannot be the same person.");
    } else {
      console.info("ℹ️ [ProductDetail] Buy clicked by other user");
      setPopupMessage("This function would be available in the next version.");
    }
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    const id = pathname.split("/").pop();
    if (id) fetchListing(id);
    fetchCurrentUser();
  }, []);

  if (!listing || !currentUser) return <div className="p-6 text-center">Loading...</div>;

  // Normalize seller object
  const currentUserId = currentUser?.id || currentUser?._id;
  const sellerId = typeof listing?.seller === "object" ? listing.seller?._id || listing.seller?.id : listing?.seller;

  const isOwner = currentUserId && sellerId && currentUserId === sellerId;

  console.log("📦 [ProductDetail] Listing fetched:", listing);
  console.log("👤 [ProductDetail] Current user ID:", currentUserId);
  console.log("🧑 [ProductDetail] Seller ID:", sellerId);
  console.log("🔎 [ProductDetail] isOwner =", isOwner);





  return (
  <>
    {/* 🪟 Optional popup for errors/info */}
    {popupMessage && (
      <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
    )}

    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-xl font-bold text-gray-800 mb-4">₹ {listing.price}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 📸 Product Image */}
        <div>
          {listing.images?.[0] && (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="rounded-lg w-full object-cover"
            />
          )}
        </div>

        {/* 📋 Product Info */}
        <div>
          <p className="mb-2">
            <span className="font-semibold">Description:</span>{" "}
            {listing.description}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Location:</span> {listing.location}
          </p>
          {seller && (
            <p className="mb-4">
              <span className="font-semibold">Seller:</span> {seller.name} (
              {seller.rollno})
            </p>
          )}

          {/* ✅ Conditionally render buttons */}
          {listing && currentUser && seller && (
            <>
              {isOwner ? (
                // 👤 If the logged-in user is the owner, show all three buttons
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <Button onClick={handleChat}>Chat with Seller</Button>
                  <Button onClick={handleBuy}>Buy</Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Delete Item
                  </Button>
                </div>
              ) : (
                // 🙋‍♂️ If different user, show only Chat + Buy
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <Button onClick={handleChat}>Chat with Seller</Button>
                  <Button onClick={handleBuy}>Buy</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </>
);

}
