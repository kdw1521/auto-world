"use client";

import { useState, useTransition } from "react";
import type { MouseEvent } from "react";
import { Heart } from "lucide-react";

import { togglePostLike } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
  className?: string;
};

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isPending) {
      return;
    }

    const prevLiked = liked;
    const prevCount = count;
    const nextLiked = !prevLiked;
    const nextCount = Math.max(0, prevCount + (prevLiked ? -1 : 1));

    setLiked(nextLiked);
    setCount(nextCount);

    startTransition(async () => {
      const result = await togglePostLike(postId);
      if (!result || "error" in result) {
        setLiked(prevLiked);
        setCount(prevCount);
        return;
      }
      setLiked(result.liked);
      setCount(result.likes);
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={liked}
      aria-label="좋아요"
      className={cn("h-7 gap-1 px-2 text-xs", className)}
    >
      <Heart
        className={cn(
          "size-4",
          liked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
        )}
      />
      <span className={liked ? "text-rose-500" : "text-muted-foreground"}>
        {count}
      </span>
    </Button>
  );
}
