import ProductGrid from "@/components/products/product-grid";

export default function CategoryPage() {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category") || undefined;
  const searchParam = params.get("query") || undefined;

  console.log("🧭 [CategoryPage] categoryId:", categoryParam);
  console.log("🔎 [CategoryPage] search query:", searchParam);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {searchParam
          ? `🔍 Search Results for "${searchParam}"`
          : categoryParam
          ? "📁 Category Items"
          : "🕘 All Items"}
      </h1>
      <ProductGrid categoryId={categoryParam} search={searchParam} />
    </div>
  );
}
