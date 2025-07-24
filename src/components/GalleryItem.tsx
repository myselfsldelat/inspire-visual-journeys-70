
import React, { useState } from 'react';
import { GalleryItem as GalleryItemType } from '@/data/gallery';
import { Camera, CalendarIcon, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg"
      onClick={() => !hasError && onClick(item)}
    >
      <div className="aspect-w-1 aspect-h-1">
        {hasError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200 text-gray-500">
            <AlertTriangle className="w-12 h-12 mb-2" />
            <p className="font-semibold">Imagem Indisponível</p>
          </div>
        ) : (
          <>
            {/* Skeleton Loader - fica visível até a imagem carregar */}
            {!isLoaded && (
              <div className="absolute inset-0 h-full w-full animate-pulse bg-gray-300"></div>
            )}
            {/* Imagem */}
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className={cn(
                'h-full w-full object-cover transition-all duration-500 group-hover:scale-110', // Efeito de zoom no hover
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        )}
      </div>
      
      {/* Overlay de Conteúdo */}
      {!hasError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="translate-y-4 transform transition-transform duration-500 group-hover:translate-y-0">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              {item.date && (
                <div className="mt-2 flex items-center text-sm text-white/90">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{item.date}</span>
                </div>
              )}
              <div className="mt-4 inline-flex items-center rounded-full bg-event-orange px-3 py-1 text-sm font-semibold text-white shadow-lg">
                <Camera className="mr-2 h-4 w-4" />
                Ver Detalhes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryItem;
