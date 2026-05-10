import { useLoaderData, useNavigate } from "react-router";
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
import AddToFavorite from "../../components/Products/AddToFavorite";
import { AddToCartForm } from "../../components/Products/AddToCartForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { useSuspenseQuery } from "@tanstack/react-query";
import { oneProductQuery, productQuery } from "@/api/query";
import type { Image, Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
const imageUrl = import.meta.env.VITE_IMG_URL;

function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useLoaderData();
  const { data: productData } = useSuspenseQuery(productQuery("?limit=4"));
  const { data: productDetail } = useSuspenseQuery(oneProductQuery(productId));

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const { addItem } = useCartStore();

  const handleCart = (quantity: number) => {
    addItem({
      id: productDetail.product.id,
      name: productDetail.product.name,
      price: productDetail.product.price,
      quantity,
      image: productDetail.product.images[0].path,
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-0">
      <Button variant="outline" className="mt-8" onClick={() => navigate(-1)}>
        <Icons.arrowLeft /> All Products
      </Button>
      <section className="my-6 flex flex-col gap-16 md:flex-row md:gap-16">
        <Carousel plugins={[plugin.current]} className="w-full md:w-1/2">
          <CarouselContent>
            {productDetail.product?.images.map((image: Image) => (
              <CarouselItem key={image.id}>
                <div className="p-1">
                  <img
                    src={imageUrl + image.path}
                    alt={productDetail.product.name}
                    className="size-full rounded-md object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-1">
            <h2 className="line-clamp-1 text-2xl font-bold">
              {productDetail.product?.name}
            </h2>
            <p className="text-muted-foreground text-base">
              {formatPrice(Number(productDetail.product?.price))}
            </p>
          </div>
          <Separator className="my-1.5" />
          <p className="text-muted-foreground text-base">
            {productDetail.product?.inventory} in stock
          </p>
          <div className="flex items-center justify-between">
            <RatingStar rating={Number(productDetail.product?.rating)} />
            <AddToFavorite
              productId={String(productDetail.product?.id)}
              rating={Number(productDetail.product?.rating)}
              isFavorite={productDetail.product?.users?.length > 0}
            />
          </div>
          <AddToCartForm
            canBuy={productDetail.product?.status === "ACTIVE"}
            onHandleCart={handleCart}
            idInCart={productDetail.product.id}
          />
          <Separator className="mt-4" />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {productDetail.product?.description ??
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
            {productData.products.slice(0, 4).map((item: Product) => (
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
