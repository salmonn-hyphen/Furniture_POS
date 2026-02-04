import type { Products } from "../../types";
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

interface productProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Products;
}

function ProductCard({ products, className }: productProps) {
  return (
    <Card className={cn("size-full overflow-hidden rounded-lg", className)}>
      <Link to={`/products/${products.id}`} aria-label={products.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={products.images[0]}
              alt=""
              className="size-full object-cover"
              loading="lazy"
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
        {products.status === "sold" ? (
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
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
