
import { useState, useRef, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// O hook retorna uma "ref de callback" e o estado de interseção.
type UseIntersectionObserverResponse = [(node: HTMLElement | null) => void, boolean];

const useIntersectionObserver = (options: IntersectionObserverOptions = {}): UseIntersectionObserverResponse => {
  const { threshold = 0.1, root = null, rootMargin = '0px', triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Usamos useRef para manter a mesma instância do observer entre as renderizações
  const observer = useRef<IntersectionObserver | null>(null);

  // A ref de callback é uma forma avançada e performática de obter a referência do DOM
  const ref = useCallback((node: HTMLElement | null) => {
    // Se já temos um observer, desconectamos para limpar
    if (observer.current) {
      observer.current.disconnect();
    }

    // Criamos um novo observer e o guardamos na ref
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Se for para disparar apenas uma vez, paramos de observar o elemento
        if (triggerOnce && observer.current) {
          observer.current.unobserve(entry.target);
        }
      } else {
        // Se não for para disparar apenas uma vez, podemos resetar o estado
        if (!triggerOnce) {
          setIsIntersecting(false);
        }
      }
    }, { threshold, root, rootMargin });

    // Se o elemento do DOM existir, começamos a observá-lo
    if (node) {
      observer.current.observe(node);
    }
  }, [threshold, root, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
};

export default useIntersectionObserver;
