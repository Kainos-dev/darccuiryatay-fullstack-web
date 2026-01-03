// components/products/ZoomOverlay.jsx
'use client';

import { CldImage } from 'next-cloudinary';

/**
 * Panel de zoom cuadrado flotante centrado con ProductViewInfo
 */
export default function ZoomOverlay({ isZooming, zoomPosition, src }) {
    if (!isZooming) return null;

    return (
        <div
            className="fixed top-32 lg:left-[70%] xl:left-[65%] -translate-x-1/2 w-[500px] h-[500px] bg-white shadow-2xl border-2 border-gray-200 rounded-lg z-50 pointer-events-none hidden lg:block"
        >
            {/* Imagen con zoom */}
            <div className="relative w-full h-full overflow-hidden rounded-lg">
                <CldImage
                    src={src}
                    alt="Vista ampliada"
                    fill
                    sizes="500px"
                    className="object-cover"
                    quality="auto:best"
                    format="auto"
                    style={{
                        objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2.5)',
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                />
            </div>

            {/* Badge de zoom */}
            {/* <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 shadow-lg">
                <span className="text-base">🔍</span>
                <span>Vista ampliada</span>
            </div> */}
        </div>
    );
}