// client/pages/listing-page.tsx

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ListingCard from "../components/products/ListingCard";
import Layout from "../components/layout/Layout";

interface Category {
  _id: string;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  console.log("🌐 Fetching categories from /api/categories...");
  const res = await fetch("http://localhost:5000/api/categories");
  if (!res.ok) {
    console.error("❌ Failed to fetch categories. Status:", res.status);
    throw new Error("Failed to fetch categories");
  }
  const data = await res.json();
  console.log("✅ Categories received:", data);
  return data;
};

const ListingPage = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
  queryKey: ["categories"],
  queryFn: fetchCategories,
});


  useEffect(() => {
    if (error) {
      console.error("❌ Error fetching categories:", error);
    }
    if (categories && categories.length === 0) {
      console.warn("⚠️ Categories list is empty");
    }
  }, [error, categories]);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Categories</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load categories</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="border p-4 rounded-md shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold">{category.name}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ListingPage;
