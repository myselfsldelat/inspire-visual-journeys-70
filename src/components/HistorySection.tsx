
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
// Importando o conteúdo diretamente do nosso arquivo JSON local
import historyContent from '@/data/conteudo-historia.json';

interface HistorySectionProps {
  className?: string;
}

const HistorySection: React.FC<HistorySectionProps> = ({ className }) => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  return (
    <section 
      ref={ref}
      className={cn(
        "py-16 bg-gray-50 opacity-0 translate-y-4 transition-all duration-1000",
        { 'opacity-100 translate-y-0': isIntersecting },
        className
      )} 
      id="history"
    >
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          {/* Usando o título do nosso arquivo JSON */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{historyContent.title}</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-1/2 rounded-lg shadow-lg overflow-hidden">
            <img 
              // Usando a URL da imagem do nosso arquivo JSON
              src={historyContent.imageUrl}
              alt="Evento histórico do Bike Night Amazonas" 
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center mb-4 text-event-orange">
              <Calendar className="mr-2" />
              {/* Usando o título do evento do nosso arquivo JSON */}
              <span className="font-semibold">{historyContent.eventTitle}</span>
            </div>
            {/* Usando o título principal do nosso arquivo JSON */}
            <h3 className="text-2xl font-bold mb-4">{historyContent.mainTitle}</h3>
            {/* Mapeando e renderizando os parágrafos do nosso arquivo JSON */}
            {historyContent.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
