import FilterProduct from "../../components/Products/FilterProduct";
import PaginationBottom from "../../components/Products/PaginationBottom";
import ProductCard from "../../components/Products/ProductCard";
import { products, filterList } from "../../data/products";

function Product() {
  return (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row">
        <section className="my-8 ml-4 w-full md:ml-0 lg:w-1/5">
          <FilterProduct filterList={filterList} />
        </section>
        <section className="my-8 lg:ml-0 lg:w-4/5">
          <h1 className="mb-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} products={product} />
            ))}
          </div>
          <PaginationBottom />
        </section>
      </section>
    </div>
  );
}

export default Product;
