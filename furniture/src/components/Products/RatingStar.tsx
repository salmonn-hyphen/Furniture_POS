import { Icons } from "../logo";
import { cn } from "../../lib/utils";

function RatingStar({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icons.star
          key={i}
          className={cn(
            "size-4",
            rating >= i + 1 ? "text-yellow-500" : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

export default RatingStar;
