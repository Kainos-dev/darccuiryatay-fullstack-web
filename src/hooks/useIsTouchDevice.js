// hooks/useIsTouchDevice.js
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el dispositivo es táctil
 * Retorna true si es touch, false si es desktop con cursor
 */
export function useIsTouchDevice() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Múltiples métodos de detección para mayor precisión
        const checkTouchDevice = () => {
            // Método 1: Verificar API de touch
            const hasTouch = 'ontouchstart' in window ||
                navigator.maxTouchPoints > 0;

            // Método 2: Verificar tamaño de pantalla (backup)
            const isMobileSize = window.innerWidth < 1024;

            // Método 3: Verificar pointer media query (más confiable)
            const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

            // Combinar métodos para mayor precisión
            setIsTouchDevice(hasTouch || isMobileSize || isCoarsePointer);
        };

        checkTouchDevice();

        // Re-check en resize (para casos como iPad en modo desktop)
        window.addEventListener('resize', checkTouchDevice);

        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    return isTouchDevice;
}