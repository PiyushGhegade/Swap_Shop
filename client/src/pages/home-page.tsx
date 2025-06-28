import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/products/product-grid";
import CategoriesSection from "@/components/categories/categories-section";
import { useAuth } from "@/hooks/use-auth";
import CreateListingModal from "@/components/products/create-listing-modal";
import 'remixicon/fonts/remixicon.css';

export default function HomePage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [createListingOpen, setCreateListingOpen] = useState(false);

  // ✅ Grab category & search from URL
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  const search = params.get("search") || undefined;

  const categoryId = categoryParam || undefined;

  // ✅ Log to debug
  useEffect(() => {
    console.log("🧭 [HomePage] categoryId from URL:", categoryId);
    console.log("🔍 [HomePage] search:", search);
  }, [categoryId, search]);

  const handlePostItem = () => {
    if (user) {
      setCreateListingOpen(true);
    } else {
      setLocation('/auth');
    }
  };


  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4285F4] to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">Buy & Sell on IIT Patna</h1>
              <p className="text-lg opacity-90">
                Connect with students at IIT Patna to buy and sell textbooks, furniture, tech, and more.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <Link href="/explore">
                  <Button variant="outline" className="bg-white text-primary hover:bg-[#F8F9FA]">
                    Browse Items
                  </Button>
                </Link>

                <Button variant="accent" onClick={handlePostItem}>
                  <i className="ri-add-line mr-1"></i> Post an Item
                </Button>
              </div>
            </div>
            <div className="md:w-2/5">
              <img
                src="https://www.hindchakra.com/wp-content/uploads/2022/11/SAVE_20221104_204324.jpg"
                alt="Students with laptops"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Link href="/">
              <Button variant="outline">Recently Added Items</Button>
            </Link>
          </div>
          <CategoriesSection />

        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {search
                ? `🔍 Search Results for "${search}"`
                : categoryId
                ? `📁 Category Items`
                : '🕘 Recent Listings'}
            </h2>

            {(search || categoryId) && (
              <Link href={`/category?category=${categoryId}`} className="text-primary hover:underline font-medium text-sm">
                See All
              </Link>

            )}
          </div>

          <ProductGrid categoryId={categoryId} search={search} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-bold mb-3">Got something to sell?</h2>
                <p className="text-gray-500 mb-4">
                  List your items in minutes and reach thousands of students on IIT Patna. It's quick, easy, and free!
                </p>
                <Button variant="accent" onClick={handlePostItem}>
                  <i className="ri-add-line mr-1"></i> Post an Item
                </Button>
              </div>
              <div className="md:w-1/3">
                <img
                  src="https://www.iitp.ac.in/gymkhana/img/portfolio/Hostels/cvr_1.jpg"
                  alt="Students"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Listing Modal */}
      <CreateListingModal open={createListingOpen} onOpenChange={setCreateListingOpen} />
    </div>
  );
}
