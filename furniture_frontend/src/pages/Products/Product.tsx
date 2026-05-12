import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import FilterProduct from "../../components/Products/FilterProduct";
import ProductCard from "../../components/Products/ProductCard";
import {
  categoryTypeQuery,
  infiniteProductsQuery,
  //queryClient,
} from "@/api/query";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

function Product() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get("categories");
  const rawType = searchParams.get("types");

  const lastFilterKey = "products:last-filters";

  //if the URL has no param , it loads the last filters from sessionStorage
  useEffect(() => {
    if (!rawCategory && !rawType) {
      const storedFilters = sessionStorage.getItem(lastFilterKey);
      if (storedFilters) {
        setSearchParams(new URLSearchParams(storedFilters), {
          replace: true,
        });
      }
    }
  }, [rawCategory, rawType, setSearchParams]);

  //if the URL has filters, it is saved into sessionStorage
  useEffect(() => {
    if (rawCategory || rawType) {
      sessionStorage.setItem(lastFilterKey, searchParams.toString());
    }
  }, [rawCategory, rawType, searchParams]);

  const selectedCategory = rawCategory
    ? decodeURIComponent(rawCategory)
        .split(",")
        .map((cat) => Number(cat.trim()))
        .filter((cat) => !isNaN(cat))
        .map((cat) => cat.toString())
    : [];
  const selectedType = rawType
    ? decodeURIComponent(rawType)
        .split(",")
        .map((type) => Number(type.trim()))
        .filter((type) => !isNaN(type))
        .map((type) => type.toString())
    : [];

  const category =
    selectedCategory.length > 0 ? selectedCategory.join(",") : null;
  const type = selectedType.length > 0 ? selectedType.join(",") : null;

  const { data: cateType } = useSuspenseQuery(categoryTypeQuery());
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    // refetch,
  } = useInfiniteQuery(infiniteProductsQuery(category, type));

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const handleFilterChange = (categories: string[], types: string[]) => {
    const newParams = new URLSearchParams();
    if (categories.length > 0)
      newParams.set("categories", encodeURIComponent(categories.join(",")));
    if (types.length > 0)
      newParams.set("types", encodeURIComponent(types.join(",")));
    //Update URL 
    setSearchParams(newParams);

    //add the  Filter Param to the session Storage if exists, and remove if not
    if (newParams.toString()) {
      sessionStorage.setItem(lastFilterKey, newParams.toString());
    } else {
      sessionStorage.removeItem(lastFilterKey);
    }

    //Cancel In-flight queries
    //queryClient.cancelQueries({ queryKey: ["products", "infinite"] });
    //clear cache
    //queryClient.removeQueries({ queryKey: ["products", "infinite"] });
    //refetch();
  };

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
        <section className="my-8 ml-4 w-full md:ml-0 lg:sticky lg:top-24 lg:w-1/5">
          <FilterProduct
            filterList={cateType}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            handleFilterChange={handleFilterChange}
          />
        </section>
        <section className="my-8 lg:ml-0 lg:h-[calc(100vh-7rem)] lg:w-4/5 lg:overflow-y-auto lg:pr-2 lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <h1 className="mb-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
            {allProducts.map((products) => (
              <ProductCard key={products.id} products={products} />
            ))}
          </div>

          <div className="my-4 flex justify-center">
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              variant={!hasNextPage ? "ghost" : "secondary"}
            >
              {isFetchingNextPage
                ? "Loading More..."
                : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
            </Button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </section>
      </section>
    </div>
  );
}

export default Product;
