import Container from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types/product";

export default function ProductList({
  products,
  title,
}: {
  products: Product[];
  title?: string;
}) {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}