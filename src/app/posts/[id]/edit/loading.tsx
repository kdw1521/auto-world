import { Card } from "@/components/ui/card";

type SkeletonProps = {
  className: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={`bg-[#E3EF26]/10 ${className}`} />;
}

export default function EditPostLoading() {
  return (
    <div className="min-h-screen bg-[#0C342C]">
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #E3EF26 1px, transparent 1px),
              linear-gradient(to bottom, #E3EF26 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 bg-[#0C342C]/90 backdrop-blur-xl border-b border-[#E3EF26]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
              <div className="animate-pulse space-y-4">
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
            <Card className="p-8 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-9/12" />
                <Skeleton className="h-4 w-8/12" />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
              <div className="animate-pulse space-y-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
            </Card>
            <Card className="p-6 bg-[#023940]/30 border-2 border-[#E3EF26]/20 rounded-none">
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
