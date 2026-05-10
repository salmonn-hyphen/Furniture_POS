import { Icons } from "../logo";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useIsFetching, useMutation } from "@tanstack/react-query";
import api from "@/api";
import { queryClient } from "@/api/query";

interface FavoriteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  rating: number;
  isFavorite: boolean;
}

function AddToFavorite({
  productId,
  //rating,
  isFavorite,
  className,
  ...props
}: FavoriteProps) {
  const fetching = useIsFetching();
  let favorite = isFavorite;
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const data = {
        productId: +productId,
        favorite: !isFavorite,
      };
      const response = await api.patch("user/products/toggle-favorite", data);
      if (response.status !== 200) {
        console.log(response.data);
      }

      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
  if (fetching || isPending) {
    favorite = !isFavorite;
  }
  return (
    <Button
      className={cn("size-8 shrink-0", className)}
      {...props}
      variant="secondary"
      size="icon"
      onClick={() => mutate()}
      title={favorite ? "Remove from favorite" : "Add to favorite"}
    >
      {favorite ? (
        <Icons.fillHeart className="size-4 text-red-500" />
      ) : (
        <Icons.heart className="size-4 text-red-500" />
      )}
    </Button>
  );
}

export default AddToFavorite;
