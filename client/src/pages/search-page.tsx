import { useEffect } from "react";
import { useLocation } from "wouter";
import ProductGrid from "@/components/products/product-grid";

export default function SearchPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query") || "";

  useEffect(() => {
    console.log("🔍 [SearchPage] Search query from URL:", query);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Search results for "{query}"</h2>
      <ProductGrid search={query} />
    </div>
  );
}
