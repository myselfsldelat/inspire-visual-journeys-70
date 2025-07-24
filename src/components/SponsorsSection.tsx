
import React from 'react';
import { Handshake, Heart } from 'lucide-react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const SponsorsSection: React.FC = () => {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  const sponsors = [
    { name: 'Apoio 1', logo: '/placeholder.svg' },
    { name: 'Apoio 2', logo: '/placeholder.svg' },
    { name: 'Apoio 3', logo: '/placeholder.svg' },
    { name: 'Apoio 4', logo: '/placeholder.svg' },
  ];

  return (
    <section 
      ref={ref}
      className={cn(
        "py-16 bg-white opacity-0 translate-y-4 transition-all duration-1000",
        { 'opacity-100 translate-y-0': isIntersecting }
      )}
      id="sponsors"
    >
      <div className="container mx-auto px-4 text-center">
        <Handshake className="mx-auto h-12 w-12 text-event-orange" />
        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Apoie Esta Causa</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          O Bike Night Amazonas é um movimento que promove saúde, comunidade e a exploração urbana sobre duas rodas. Seu apoio nos ajuda a continuar crescendo e a realizar eventos cada vez melhores.
        </p>

        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6">Nossos Parceiros Atuais</h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={sponsor.logo} alt={sponsor.name} className="h-16 w-32 object-contain grayscale opacity-60" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Faça Parte da Nossa História</h3>
          <p className="text-gray-700 mb-6">
            Temos diversas oportunidades de parceria e estamos abertos a novas ideias. Associe sua marca a um projeto que movimenta Manaus e inspira um estilo de vida mais saudável.
          </p>
          <Button size="lg" className="bg-event-green hover:bg-green-700">
            <Heart className="mr-2 h-5 w-5" />
            Quero Ser um Patrocinador
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
