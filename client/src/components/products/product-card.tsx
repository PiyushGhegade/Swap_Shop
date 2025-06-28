import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Listing } from "@shared/schema";

interface ProductCardProps {
  listing: Listing;
}

export default function ProductCard({ listing }: ProductCardProps) {
  const timeAgo = formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true });

  const mainImage = listing.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link href={`/listing/${listing._id}`} className="block">
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="aspect-[4/3] w-full bg-gray-100">
          <img
            src={mainImage}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
            {listing.category?.name && (
              <span className="text-xs text-blue-600">{listing.category.name}</span>
            )}
          </div>
          
        </div>
        <h6 className="font-bold text-green-600 whitespace-nowrap">₹{listing.price.toFixed(2)}</h6>

          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Posted {timeAgo}</span>
            {listing.location && (
              <div className="flex items-center space-x-1">
                <i className="ri-map-pin-line text-xs text-gray-500"></i>
                <span className="text-xs text-gray-500">{listing.location}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
