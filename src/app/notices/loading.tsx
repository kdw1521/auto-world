import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#E3EF26]/10 ${className}`} />;
}

export default function NoticesLoading() {
  const cards = Array.from({ length: 4 });

  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="animate-pulse space-y-4 mb-12">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-5 w-2/3" />
        </div>

        <div className="mb-8">
          <div className="animate-pulse max-w-2xl">
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-[#1B3A4B]/30 border-2 border-[#E3EF26]/20 rounded-none">
              <div className="animate-pulse space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-[#E3EF26]/10 to-[#E3EF26]/5 border-2 border-[#E3EF26]/30 rounded-none">
              <div className="animate-pulse space-y-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {cards.map((_, index) => (
              <Card
                key={`notice-skeleton-${index}`}
                className="p-8 bg-[#1B3A4B]/30 border-2 border-[#E3EF26]/20 rounded-none"
              >
                <div className="animate-pulse space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <div className="pt-6 border-t border-[#E3EF26]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
