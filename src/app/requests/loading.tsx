import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#EAF4F4]/10 ${className}`} />;
}

export default function RequestsLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="animate-pulse space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-8 w-56" />
            </div>
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="animate-pulse mb-6">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <Card className="p-8 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
            <div className="animate-pulse space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <Card className="p-6 bg-[#161514]/30 border border-[#CEF431]/20 rounded-none">
              <div className="animate-pulse space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-11/12" />
                  <Skeleton className="h-3 w-10/12" />
                  <Skeleton className="h-3 w-9/12" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-[#161514]/30 border border-[#EAF4F4]/10 rounded-none">
              <div className="animate-pulse space-y-4">
                <Skeleton className="h-4 w-20" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-linear-to-br from-[#014651] to-[#161514] border border-[#CEF431]/30 rounded-none">
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
