import { Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  console.log("📦 Rendering CategoryCard for:", category.name, "ID:", category._id);

  return (
    <Link href={`/category?category=${category._id}`}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${category.name} category`}
        className="flex flex-col items-center p-4 bg-[#F8F9FA] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            window.location.href = `/category?category=${category._id}`;
          }
        }}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <i className={`ri-${category.icon || "box"}-line text-xl text-primary`}></i>
        </div>
        <span className="text-sm font-medium text-center">{category.name}</span>
      </div>
    </Link>
  );
}
