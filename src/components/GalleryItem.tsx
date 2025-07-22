
import React, { useState } from 'react';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { Camera, CalendarIcon, AlertTriangle } from 'lucide-react';

interface GalleryItemProps {
  item: GalleryItemType;
  onClick: (item: GalleryItemType) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onClick }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={() => !hasError && onClick(item)}
    >
      {/* Aspect-Ratio Box: Reserves space and acts as a placeholder */}
      <div className="aspect-w-1 aspect-h-1 xl:aspect-w-4 xl:aspect-h-3">
        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
            <AlertTriangle className="w-10 h-10 mb-2" />
            <p>Imagem não disponível</p>
          </div>
        ) : (
          <>
            {/* Skeleton Loader */}
            {!isLoaded && (
              <div className="absolute inset-0 h-full w-full animate-pulse bg-gray-200"></div>
            )}
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        )}
      </div>
      
      {/* Overlay for text content */}
      {!hasError && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            {item.date && (
              <div className="mt-1 flex items-center text-xs text-white/80">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>{item.date}</span>
              </div>
            )}
            <div className="mt-2 inline-flex items-center rounded-full bg-event-orange px-2 py-1 text-xs text-white">
              <Camera className="mr-1 h-3 w-3" />
              Ver história
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryItem;
