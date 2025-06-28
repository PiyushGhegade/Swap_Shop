import ProductGrid from "@/components/products/product-grid";

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">🕘 Recently Added Items</h1>
      <ProductGrid />
    </div>
  );
}
