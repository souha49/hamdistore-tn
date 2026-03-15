import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '../lib/database.types';

interface ProductCarouselProps {
  products: Product[];
  onNavigate: (path: string) => void;
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

export function ProductCarousel({
  products,
  onNavigate,
  autoScroll = true,
  autoScrollInterval = 5000
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const itemsPerView = isMobile ? 2 : 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  useEffect(() => {
    if (!autoScroll || isHovering || products.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, isHovering, maxIndex, products.length, itemsPerView, autoScrollInterval]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      handleNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
          aria-label="Next products"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
        </button>
      )}

      <div
        ref={carouselRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out gap-3 sm:gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (isMobile ? 12 : 24) / itemsPerView}px)` }}
            >
              <ProductCard
                product={product}
                onClick={() => onNavigate(`/product/${product.id}`)}
              />
            </div>
          ))}
        </div>
      </div>

      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
