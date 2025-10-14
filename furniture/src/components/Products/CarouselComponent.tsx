import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import type { Products } from "../../types/index";
import { Link } from "react-router";
import Autoplay from "embla-carousel-autoplay";

interface ProductProps {
  products: Products[];
}

export default function CarouselComponent({ products }: ProductProps) {
  return (
    <div className="">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="flex gap-4 p-4 lg:px-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-28 rounded-md bg-transparent"
                />
                <div className="">
                  <h3 className="line-clamp-1 text-sm font-bold">
                    {product.name}
                  </h3>
                  <p className="my-2 line-clamp-2 text-sm text-gray-600">
                    {product.description}
                  </p>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-own text-sm font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
