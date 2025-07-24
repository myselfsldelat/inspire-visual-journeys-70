import React, { useRef, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import PurposeSection from '@/components/PurposeSection';
import Gallery, { GalleryRef } from '@/components/Gallery';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import ImageModal from '@/components/ImageModal';
import HistorySection from '@/components/HistorySection';
import SponsorsSection from '@/components/SponsorsSection'; // Importando a nova seção
import { GalleryItem as GalleryItemType } from '@/data/gallery';

const Index: React.FC = () => {
  const purposeRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<GalleryRef>(null);
  
  const [selectedItem, setSelectedItem] = useState<GalleryItemType | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToRef = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleItemClick = (item: GalleryItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleNextImage = () => {
    if (galleryRef.current) {
      const nextItem = galleryRef.current.navigateToNext();
      setSelectedItem(nextItem);
    }
  };

  const handlePreviousImage = () => {
    if (galleryRef.current) {
      const prevItem = galleryRef.current.navigateToPrevious();
      setSelectedItem(prevItem);
    }
  };

  const hasNext = galleryRef.current?.hasNext() || false;
  const hasPrevious = galleryRef.current?.hasPrevious() || false;

  return (
    <div className="min-h-screen bg-gray-50">

      <HeroSection 
        onDiscoverClick={() => {
          const galleryElement = document.getElementById('gallery');
          if (galleryElement) {
            galleryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }} 
        onPurposeClick={() => scrollToRef(purposeRef)} 
      />
      
      <PurposeSection ref={purposeRef} />
      
      <HistorySection />
      
      <Gallery 
        id="gallery"
        ref={galleryRef} 
        onItemClick={handleItemClick} 
      />
      
      <CallToAction 
        onParticipateClick={() => {
           const sponsorsElement = document.getElementById('sponsors');
           if (sponsorsElement) {
             sponsorsElement.scrollIntoView({ behavior: 'smooth' });
           }
        }}
      />

      <SponsorsSection /> 
      
      <Footer />
      
      <ImageModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </div>
  );
};

export default Index;
