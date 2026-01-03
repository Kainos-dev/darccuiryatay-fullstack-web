import { cache } from 'react';
import { prisma } from '@/lib/db/prisma';

export const getSimilarProducts = cache(async (productId, rubro, options = {}) => {
    const {
        limit = 8,
        includeSubrubros = true,
        includePriceRange = true,
    } = options;

    try {
        // 1. Obtener el producto actual
        const currentProduct = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                price: true,
                subrubros: true,
                rubro: true,
            },
        });

        if (!currentProduct) return [];

        // 2. Construir filtro inteligente
        const where = {
            id: { not: productId }, // Excluir producto actual
            rubro: currentProduct.rubro,
            active: true,
        };

        // Estrategia multi-nivel de similitud
        const similarityFilters = [];

        // Nivel 1: Mismo subrubro (máxima relevancia)
        if (includeSubrubros && currentProduct.subrubros.length > 0) {
            similarityFilters.push({
                ...where,
                subrubros: {
                    hasSome: currentProduct.subrubros, // Al menos un subrubro en común
                },
            });
        }

        // Nivel 2: Rango de precio similar (±30%)
        if (includePriceRange) {
            const priceMin = currentProduct.price * 0.7;
            const priceMax = currentProduct.price * 1.3;

            similarityFilters.push({
                ...where,
                price: {
                    gte: priceMin,
                    lte: priceMax,
                },
            });
        }

        // Nivel 3: Solo mismo rubro (fallback)
        similarityFilters.push(where);

        // 3. Intentar cada nivel hasta tener suficientes productos
        let products = [];

        for (const filter of similarityFilters) {
            if (products.length >= limit) break;

            const results = await prisma.product.findMany({
                where: filter,
                take: limit - products.length,
                orderBy: [
                    { updatedAt: 'desc' }, // Productos recientes primero
                    { createdAt: 'desc' },
                ],
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    coverImages: true,
                    variants: true,
                    stock: true,
                    subrubros: true,
                },
            });

            // Evitar duplicados
            const newProducts = results.filter(
                p => !products.some(existing => existing.id === p.id)
            );

            products.push(...newProducts);
        }

        // 4. Procesar resultados (limitar imágenes)
        return products.slice(0, limit).map(p => ({
            ...p,
            coverImages: p.coverImages?.slice(0, 2) || [],
        }));

    } catch (error) {
        console.error('Error fetching similar products:', error);
        return [];
    }
});