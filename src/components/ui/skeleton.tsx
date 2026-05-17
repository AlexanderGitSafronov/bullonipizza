import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-secondary/50 via-secondary to-secondary/50 bg-[length:200%_100%] [animation:shimmer_2s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  );
}
