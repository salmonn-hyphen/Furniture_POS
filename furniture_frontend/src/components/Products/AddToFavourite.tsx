import { Icons } from "../logo";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface FavouriteProps {
  productId: string;
  rating: number;
}

function AddToFavourite({
  productId,
  rating,
  className,
  ...props
}: FavouriteProps) {
  return (
    <Button
      className={cn("size-8 shrink-0", className)}
      {...props}
      variant="secondary"
      size="icon"
    >
      <Icons.heart className="size-4" />
    </Button>
  );
}

export default AddToFavourite;
