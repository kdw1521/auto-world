import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#EAF4F4]/10 ${className}`} />;
}

export default function PostDetailLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 md:p-12 bg-[#161514]/40 border-2 border-[#EAF4F4]/10 rounded-none">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-10 w-3/4" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="p-4 border border-[#EAF4F4]/10 bg-[#014651]/50">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-9/12" />
                <Skeleton className="h-4 w-8/12" />
              </div>
              <div className="pt-8 border-t border-[#EAF4F4]/10 flex items-center gap-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-[#023940]/30 border-2 border-[#CEF431]/20 rounded-none">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-28" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-28" />
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-[#014651]/30 border border-[#CEF431]/10">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-[#014651]/30 border border-[#CEF431]/10">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-11/12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-[#023940]/30 border-2 border-[#CEF431]/20 rounded-none">
            <div className="animate-pulse space-y-4 text-center">
              <Skeleton className="h-20 w-20 mx-auto" />
              <Skeleton className="h-5 w-28 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          </Card>

          <Card className="p-6 bg-[#023940]/30 border-2 border-[#CEF431]/20 rounded-none">
            <div className="animate-pulse space-y-4">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#CEF431]/10 border-2 border-[#CEF431]/30 rounded-none">
            <div className="animate-pulse space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
