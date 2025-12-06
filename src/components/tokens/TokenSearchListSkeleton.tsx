import { Skeleton } from '../ui/skeleton';

interface TokenSearchListSkeletonProps {
  count?: number;
}

export default function TokenSearchListSkeleton({ count = 8 }: TokenSearchListSkeletonProps) {
  return (
    <div className="divide-y divide-card-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-12 h-3" />
            </div>
          </div>
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
      ))}
    </div>
  );
}
