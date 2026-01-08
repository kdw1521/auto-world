import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#E3EF26]/10 ${className}`} />;
}

export default function NoticeDetailLoading() {
  return (
    <div className="min-h-screen text-foreground">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="animate-pulse space-y-4 mb-10">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-28" />
        </div>

        <Card className="p-8 bg-[#1B3A4B]/30 border-2 border-[#E3EF26]/20 rounded-none">
          <div className="animate-pulse space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-8/12" />
            <Skeleton className="h-4 w-7/12" />
          </div>
        </Card>

        <div className="mt-10">
          <div className="animate-pulse">
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </main>
    </div>
  );
}
