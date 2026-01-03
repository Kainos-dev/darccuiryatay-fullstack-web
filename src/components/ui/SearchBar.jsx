// components/ui/SearchBar.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

/**
 * SearchBar reutilizable para Home y Catálogo
 * 
 * @param {Object} props
 * @param {'home' | 'catalog'} props.mode - Modo de operación
 * @param {string} props.redirectTo - Ruta para redirigir (solo en modo 'home')
 * @param {'dark' | 'light'} props.variant - Estilo visual
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.defaultValue - Valor inicial
 */
export default function SearchBar({
    mode = 'home',
    redirectTo = '/darccuir/catalog',
    variant = 'dark',
    placeholder = 'Buscar...',
    defaultValue = ''
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(defaultValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();

        if (mode === 'home') {
            // Modo HOME: Redirigir al catálogo con búsqueda
            if (trimmedQuery) {
                router.push(`${redirectTo}?q=${encodeURIComponent(trimmedQuery)}`);
            } else {
                router.push(redirectTo);
            }
        } else {
            // Modo CATALOG: Actualizar URL manteniendo otros filtros
            const params = new URLSearchParams(searchParams.toString());

            if (trimmedQuery) {
                params.set('q', trimmedQuery);
            } else {
                params.delete('q');
            }

            // Resetear a página 1 cuando se busca
            params.set('page', '1');

            router.push(`?${params.toString()}`, { scroll: false });
        }
    };

    // Estilos según variante
    const styles = {
        dark: {
            input: 'text-white border-gray-300 focus:border-white',
            icon: 'text-white',
            placeholder: 'placeholder:text-gray-400'
        },
        light: {
            input: 'text-black border-gray-300 focus:border-black',
            icon: 'text-black',
            placeholder: 'placeholder:text-gray-500'
        }
    };

    const currentStyle = styles[variant];

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className={`w-5 h-5 ${currentStyle.icon}`} />
            </span>

            <input
                type="text"
                aria-label="Buscar productos"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`
                    w-full pl-11 pr-4 py-2.5 
                    border-b 
                    focus:ring-0 
                    transition-all outline-none
                    ${currentStyle.input}
                    ${currentStyle.placeholder}
                `}
            />
        </form>
    );
}