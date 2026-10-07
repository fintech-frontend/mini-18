import { styles } from "@/styles/index.styles";
import ProductList from "@/components/ui/ProductList";
import { mockProducts } from "@/data/products";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className={styles.container}>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 ">
          Электроинструмент
        </h1>
      </div>
      <ProductList products={mockProducts} />
    </div>
  );
}