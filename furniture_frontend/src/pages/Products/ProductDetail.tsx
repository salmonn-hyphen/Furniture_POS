import { Link, useParams } from "react-router";
import { products } from "../../data/products";
import { Button } from "../../components/ui/button";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import ProductCard from "../../components/Products/ProductCard";
import { Icons } from "../../components/logo";
import Autoplay from "embla-carousel-autoplay";
import { Separator } from "../../components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";
import { formatPrice } from "../../lib/utils";
import React from "react";
import RatingStar from "../../components/Products/RatingStar";
import AddToFavourite from "../../components/Products/AddToFavourite";
import { AddToCartForm } from "../../components/Products/AddToCartForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

function ProductDetail() {
  const { productId } = useParams();
  const product = products.find((product) => product.id === productId);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="container mx-auto px-4 md:px-0">
      <Button asChild variant="outline" className="mt-8">
        <Link to="/products">
          <Icons.arrowLeft /> All Products
        </Link>
      </Button>
      <section className="my-6 flex flex-col gap-16 md:flex-row md:gap-16">
        <Carousel plugins={[plugin.current]} className="w-full md:w-1/2">
          <CarouselContent>
            {product?.images.map((image) => (
              <CarouselItem key={image}>
                <div className="p-1">
                  <img
                    src={image}
                    alt={product.name}
                    className="size-full rounded-md object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-1">
            <h2 className="line-clamp-1 text-2xl font-bold">{product?.name}</h2>
            <p className="text-muted-foreground text-base">
              {formatPrice(Number(product?.price))}
            </p>
          </div>
          <Separator className="my-1.5" />
          <p className="text-muted-foreground text-base">
            {product?.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <RatingStar rating={Number(product?.rating)} />
            <AddToFavourite
              productId={String(product?.id)}
              rating={Number(product?.rating)}
            />
          </div>
          <AddToCartForm canBuy={product?.status === "active"} />
          <Separator className="mt-4" />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product?.description ??
                  "There is no description for this product"}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className="space-y-6 overflow-hidden">
        <h2 className="line-clamp-1 text-2xl font-bold">
          More Products From Furniture Shop
        </h2>
        <ScrollArea className="pb-8">
          <div className="flex gap-4">
            {products.slice(0, 4).map((item) => (
              <ProductCard
                key={item.id}
                products={item}
                className="min-w-[260px]"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}

export default ProductDetail;
