import type { Product } from "../../types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import { Link } from "react-router";
import { formatPrice, cn } from "../../lib/utils";
import { useCartStore } from "@/store/cartStore";

interface productProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product;
}
const imageUrl = import.meta.env.VITE_IMG_URL;

function ProductCard({ products, className }: productProps) {
  const { carts, addItem } = useCartStore();
  const cartItem = carts.find((item) => item.id === products.id);

  const handleAddToCart = () => {
    addItem({
      id: products.id,
      name: products.name,
      price: products.price,
      quantity: 1,
      image: products.images[0].path,
    });
  };
  return (
    <Card className={cn("size-full overflow-hidden rounded-lg", className)}>
      <Link to={`/products/${products.id}`} aria-label={products.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={imageUrl + products.images[0].path}
              alt=""
              className="size-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{products.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(products.price)}
            {products.discount > 0 && (
              <span className="ml-2 font-extralight line-through">
                {formatPrice(products.discount)}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-1">
        {products.status === "INACTIVE" ? (
          <Button
            size="sm"
            disabled={true}
            className="h-8 w-full rounded-sm font-bold"
            aria-label="Sold Out"
          >
            Sold Out
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-main h-8 w-full rounded-sm font-bold"
            aria-label="Add to Cart"
            onClick={handleAddToCart}
            disabled={!!cartItem}
          >
            {!cartItem ? "Add to Cart" : "Added Item"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
