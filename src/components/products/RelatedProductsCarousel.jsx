// components/products/RelatedProductsCarousel.jsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { barlow } from '@/app/ui/fonts';
import ProductCard from '@/components/products/ProductCard'; // 👈 Reutilizar tu card

export default function RelatedProductsCarousel({
    products,
    title = "PRODUCTOS SIMILARES",
    itemsPerView = { mobile: 1, tablet: 2, desktop: 4 }
}) {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [currentItemsPerView, setCurrentItemsPerView] = useState(4);

    // Si no hay productos, no renderizar nada
    if (!products || products.length === 0) return null;

    // Detectar cuántos items mostrar según viewport
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCurrentItemsPerView(itemsPerView.mobile || 1);
            } else if (window.innerWidth < 1024) {
                setCurrentItemsPerView(itemsPerView.tablet || 2);
            } else {
                setCurrentItemsPerView(itemsPerView.desktop || 4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [itemsPerView]);

    // Detectar límites de scroll
    useEffect(() => {
        const checkScroll = () => {
            if (!scrollRef.current) return;

            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        };

        checkScroll();

        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            return () => container.removeEventListener('scroll', checkScroll);
        }
    }, [products]);

    const scroll = (direction) => {
        if (!scrollRef.current) return;

        const container = scrollRef.current;
        const itemWidth = container.children[0]?.offsetWidth || 0;
        const gap = 16; // gap-4 = 16px
        const scrollAmount = (itemWidth + gap) * currentItemsPerView;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="relative w-full py-12 lg:py-16 bg-gray-50 group overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Título */}
                <h2 className={`${barlow.className} text-gray-800 mb-6 lg:mb-8 text-4xl lg:text-5xl font-medium`}>
                    {title}
                </h2>

                {/* Botón izquierdo */}
                <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={`absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 
                        bg-gray-200 text-gray-800 p-3 rounded-full shadow-lg
                        hover:bg-gray-50 transition-all duration-300
                        disabled:opacity-0 disabled:pointer-events-none
                        opacity-0 group-hover:opacity-100
                        hover:scale-110 active:scale-95`}
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Contenedor del carrusel */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scroll-smooth no-scrollbar gap-4 px-1 py-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] p-4"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Botón derecho */}
                <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={`absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 
                        bg-gray-200 text-gray-800 p-3 rounded-full shadow-lg
                        hover:bg-gray-50 transition-all duration-300
                        disabled:opacity-0 disabled:pointer-events-none
                        opacity-0 group-hover:opacity-100
                        hover:scale-110 active:scale-95`}
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicadores de scroll */}
                {products.length > currentItemsPerView && (
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({
                            length: Math.ceil(products.length / currentItemsPerView)
                        }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${i === 0 && !canScrollLeft
                                        ? 'w-8 bg-gray-800'
                                        : 'w-2 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* CSS para ocultar scrollbar */}
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}