import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#EAF4F4]/10 ${className}`} />;
}

export default function FeedLoading() {
  const cards = Array.from({ length: 5 });

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="animate-pulse">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            <div className="space-y-4">
              {cards.map((_, index) => (
                <Card
                  key={`feed-skeleton-${index}`}
                  className="rounded-none border border-[#EAF4F4]/10 bg-[#161514]/30 p-6"
                >
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-3 border-t border-[#EAF4F4]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
