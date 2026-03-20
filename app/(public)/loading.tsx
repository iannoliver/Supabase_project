import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="container-shell space-y-8 py-16">
      <Skeleton className="h-72 rounded-[2rem]" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}
