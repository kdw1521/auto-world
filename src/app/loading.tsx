import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#EAF4F4]/10 ${className}`} />;
}

export default function HomeLoading() {
  const posts = Array.from({ length: 4 });

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
          <section className="gap-8">
            <div className="animate-pulse space-y-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-5 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="animate-pulse max-w-3xl">
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="animate-pulse flex items-center gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-40" />
            </div>
          </section>
        </div>
      </div>

      <section id="feed" className="mx-auto w-full max-w-6xl px-6 -mt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {posts.map((_, index) => (
              <Card
                key={`home-post-skeleton-${index}`}
                className="rounded-none border-2 border-[#EAF4F4]/10 bg-[#161514]/40 p-8"
              >
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <div className="pt-6 border-t border-[#EAF4F4]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <aside className="relative z-10">
            <Card className="rounded-none border-2 border-[#CEF431]/20 bg-[#161514]/40 p-6 shadow-lg shadow-[#03D26F]/10">
              <div className="animate-pulse space-y-6">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`home-stat-skeleton-${index}`}
                      className="flex flex-col items-center border border-[#CEF431]/10 bg-[#014651]/30 p-3 text-center"
                    >
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="mt-2 h-3 w-12" />
                    </div>
                  ))}
                </div>
                <div className="h-px bg-[#CEF431]/20" />
                <div className="border border-[#CEF431]/30 bg-[#CEF431]/5 px-4 py-3">
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
