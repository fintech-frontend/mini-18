import ProductList from "@/components/ui/ProductList";
import { mockProducts } from "@/data/products";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1269px] mx-auto px-3 sm:px-4 lg:px-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Электроинструмент
        </h1>
        <ProductList products={mockProducts} />
      </div>
    </div>
  );
}