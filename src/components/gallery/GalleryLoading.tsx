
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const GalleryLoading: React.FC = () => {
  const skeletonItems = Array.from({ length: 6 }); // Exibe 6 skeletons, correspondendo ao 'pageSize'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {skeletonItems.map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryLoading;
