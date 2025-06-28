import { useQuery } from "@tanstack/react-query";
import ProductCard from "./product-card";
import { Listing } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Typing for props
interface ProductGridProps {
  categoryId?: string;
  userId?: string;
  search?: string;
  limit?: number;
}

export default function ProductGrid({
  categoryId,
  userId,
  search,
  limit,
}: ProductGridProps) {
  // ✅ Validate categoryId
  const isValidObjectId = (id?: string) =>
    typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

  const fetchUrl = search
  ? `/api/listings/search?query=${encodeURIComponent(search)}`
  : categoryId
  ? `/api/listings/category/${categoryId}`
  : `/api/listings`;

  // ✅ LOGGING
  console.log(
    "🧭 [ProductGrid] Props - categoryId:",
    categoryId,
    "userId:",
    userId,
    "search:",
    search
  );
  console.log("🌐 [ProductGrid] Fetch URL:", fetchUrl);

  const {
    data: listings,
    isLoading,
    error,
  } = useQuery<Listing[]>({
    queryKey: ["listings", categoryId],
    queryFn: async () => {
      console.log("📡 [ProductGrid] Fetching from:", fetchUrl);

      const res = await fetch(fetchUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ [ProductGrid] Failed response body:", text);
        throw new Error(`Failed to fetch listings. Status: ${res.status}`);
      }

      const json = await res.json();
      console.log("✅ [ProductGrid] Listings fetched:", json);
      return json;
    },
    enabled: true,
  });

  if (error) {
    console.error("❌ [ProductGrid] Error fetching listings:", error);
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading listings. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(limit || 8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  const displayListings = limit && listings ? listings.slice(0, limit) : listings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayListings && displayListings.length > 0 ? (
        displayListings.map((listing) => (
          <ProductCard key={listing._id} listing={listing} />
        ))
      ) : (
        <div className="col-span-full py-8 text-center">
          <p className="text-gray-500">No listings found.</p>
          {search && (
            <p className="text-sm mt-2">Try a different search term or browse categories.</p>
          )}
          {categoryId && (
            <p className="text-sm mt-2">No listings in this category yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
