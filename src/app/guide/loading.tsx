import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#EAF4F4]/10 ${className}`} />;
}

export default function GuideLoading() {
  const cards = Array.from({ length: 6 });

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="animate-pulse space-y-4 mb-12">
          <div className="flex items-center gap-4">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        <Card className="rounded-none border-2 border-[#CEF431]/20 bg-[#0E3A42]/70 p-6 mb-12">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`tip-skeleton-${index}`} className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((_, index) => (
            <Card
              key={`guide-skeleton-${index}`}
              className="rounded-none border-2 border-[#CEF431]/20 bg-[#0E3A42]/70 p-6 h-full"
            >
              <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="rounded-none border-2 border-[#EF4444]/40 bg-[#4B1B1B]/50 p-6 mt-12">
          <div className="animate-pulse space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
          </div>
        </Card>

        <div className="mt-16 border-t border-[#CEF431]/20 pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
