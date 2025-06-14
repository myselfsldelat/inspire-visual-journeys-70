
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabaseOperations } from '@/integrations/supabase/client-custom';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface HistorySectionProps {
  className?: string;
}

const HistorySection: React.FC<HistorySectionProps> = ({ className }) => {
  const { data: content, isLoading, isError, error } = useQuery({
    queryKey: ['site_content'],
    queryFn: async () => {
      const { data, error } = await supabaseOperations.getSiteContent();
      if (error) throw new Error(error.message);
      return data.reduce((acc, item) => {
        acc[item.key] = item.content;
        return acc;
      }, {} as Record<string, string>);
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <section className={cn("py-16 bg-gray-50", className)} id="history">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Skeleton className="w-full md:w-1/2 h-80 rounded-lg" />
            <div className="w-full md:w-1/2 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={cn("py-16 bg-gray-50", className)} id="history">
        <div className="container mx-auto px-4">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar a História</AlertTitle>
            <AlertDescription>
              Não foi possível buscar os dados da nossa história. Tente novamente mais tarde.
              <p className="text-xs mt-2">{error.message}</p>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 bg-gray-50", className)} id="history">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content?.history_title || 'Nossa História'}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {content?.history_subtitle || 'Mais de 10 anos de história...'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-1/2 rounded-lg shadow-lg overflow-hidden">
            <img 
              src="/lovable-uploads/74931d0c-9d05-4201-b56c-d99add7af63b.png"
              alt="Primeiro evento do Bike Night Amazonas em 2013" 
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center mb-4 text-event-orange">
              <Calendar className="mr-2" />
              <span className="font-semibold">{content?.history_event_title || '2013 - O Início'}</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{content?.history_main_title || 'Como Tudo Começou'}</h3>
            <p className="text-gray-700 mb-4">
              {content?.history_p1 || 'Em 2013...'}
            </p>
            <p className="text-gray-700 mb-4">
              {content?.history_p2 || 'Usando coletes improvisados...'}
            </p>
            <p className="text-gray-700">
              {content?.history_p3 || 'Hoje, mais de uma década depois...'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
