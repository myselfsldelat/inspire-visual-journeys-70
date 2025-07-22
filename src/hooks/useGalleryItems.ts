
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type GalleryItemType = Tables<'gallery_items'>;

interface UseGalleryItemsProps {
  pageSize?: number;
  initialPage?: number;
}

const useGalleryItems = ({ 
  pageSize = 6, 
  initialPage = 0 
}: UseGalleryItemsProps = {}) => {
  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { toast } = useToast();

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const fetchItems = useCallback(async (isRefresh = false, pageToFetch = currentPage) => {
    if (isRefresh) setRefreshing(true);
    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError, count } = await supabase
        .from('gallery_items')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(pageToFetch * pageSize, (pageToFetch * pageSize) + pageSize - 1);

      if (queryError) {
        throw queryError;
      }

      setItems(data || []);
      setTotalItems(count || 0);
      setCurrentPage(pageToFetch);

      if (isRefresh) {
        toast({
          title: 'Galeria Atualizada',
          description: 'As imagens mais recentes foram carregadas.',
        });
      }
    } catch (err: any) {
      console.error('Error fetching gallery items:', err);
      setError('Não foi possível carregar a galeria. Verifique sua conexão e tente novamente.');
      setItems([]);
      
      if (isRefresh) {
        toast({
          title: 'Erro ao Atualizar',
          description: 'Não foi possível buscar novas imagens.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [currentPage, pageSize, toast]);

  const goToNextPage = () => {
    if (hasNextPage) {
      fetchItems(false, currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      fetchItems(false, currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchItems(false, page);
    }
  };

  const handleImageError = (index: number) => {
    setItems(current => {
      const updated = [...current];
      const item = updated[index];
      if (item) {
        item.image = "/placeholder.svg";
      }
      return updated;
    });
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refreshing,
    fetchItems,
    handleImageError,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      goToPage,
      pageSize,
      totalItems,
    },
  };
};

export default useGalleryItems;
