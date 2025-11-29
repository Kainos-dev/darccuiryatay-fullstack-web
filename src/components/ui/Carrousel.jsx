"use client"

import { useState, useEffect } from 'react';

import Image from 'next/image';

// components :
import MainNavBar from "./MainNavBar"
import SubrubrosNavBar from "./SubrubrosNavBar"

export default function Carrousel({ rubro, images, title, yatayLogo, subrubros }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 2500);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <section className="relative w-full h-screen max-h-screen overflow-hidden">
            {/* Imágenes del carrusel */}
            {images.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={src}
                        alt={`Hero ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        quality={90}
                    />
                </div>
            ))}

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Overlay inferior */}
            <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 md:h-20 lg:h-24 bg-linear-to-t from-white to-transparent pointer-events-none"></div>

            <MainNavBar rubro={rubro} logo={yatayLogo} />

            <SubrubrosNavBar subrubros={subrubros} />

            {/* Contenido */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
                <Image
                    src={title}
                    alt="Yatay Title"
                    width={800}
                    height={100}
                    className="mb-6 sm:mb-8 border-4"
                />
            </div>

        </section>
    )
}