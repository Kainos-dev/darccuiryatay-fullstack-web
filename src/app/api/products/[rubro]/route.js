// app/api/products/[rubro]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// Función helper para normalizar texto (remover acentos, lowercase)
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remover acentos
}

export async function GET(request, { params }) {
    try {
        const { rubro } = await params;

        const allowedRubros = ["darccuir", "yatay"];
        if (!allowedRubros.includes(rubro)) {
            return NextResponse.json(
                { error: "Rubro inválido" },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const subrubroParam = searchParams.get("subrubro");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const search = searchParams.get("q");

        // Filtros base
        const where = {
            rubro,
            active: true,
        };

        // Filtro por subrubro (acepta slug o ID)
        if (subrubroParam) {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(subrubroParam);

            let subrubroId;

            if (isObjectId) {
                subrubroId = subrubroParam;
            } else {
                const subrubro = await prisma.subrubro.findUnique({
                    where: {
                        slug_rubro: {
                            slug: subrubroParam,
                            rubro: rubro,
                        },
                    },
                    select: { id: true },
                });
                subrubroId = subrubro?.id;
            }

            if (subrubroId) {
                where.subrubros = { has: subrubroId };
            } else if (!isObjectId) {
                return NextResponse.json({
                    productos: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                        hasMore: false,
                    },
                });
            }
        }

        // Filtro por precio
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        // 🔥 BÚSQUEDA INTELIGENTE
        if (search) {
            const normalizedSearch = normalizeText(search);
            const searchTerms = normalizedSearch.split(/\s+/).filter(Boolean);

            // Estrategia multi-nivel de búsqueda
            where.OR = [
                // 1. Coincidencia EXACTA en SKU (máxima prioridad)
                { sku: { equals: search, mode: "insensitive" } },

                // 2. SKU contiene el término
                { sku: { contains: search, mode: "insensitive" } },

                // 3. Nombre contiene el término
                { name: { contains: search, mode: "insensitive" } },

                // 4. Descripción contiene el término
                { description: { contains: search, mode: "insensitive" } },

                // 5. Nombre contiene TODAS las palabras (para búsquedas multi-palabra)
                ...(searchTerms.length > 1 ? [{
                    AND: searchTerms.map(term => ({
                        name: { contains: term, mode: "insensitive" }
                    }))
                }] : []),
            ];
        }

        // Ordenamiento inteligente
        let orderBy = { createdAt: "desc" }; // Default

        if (search) {
            // Si hay búsqueda, ordenar por relevancia
            // Prisma no soporta score directo, pero podemos usar un aggregation
            // Por ahora usamos el orden de las condiciones OR (las primeras son más relevantes)
            orderBy = [
                { updatedAt: "desc" }, // Productos recientes primero
                { price: "asc" }        // Luego por precio
            ];
        }

        // Consulta principal
        const [productos, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    coverImages: true,
                    variants: true,
                    stock: true,
                    description: true, // Incluir para highlighting después
                },
            }),
            prisma.product.count({ where }),
        ]);

        // Procesamiento de resultados
        const productosProcesados = productos.map((p) => ({
            ...p,
            coverImages: p.coverImages?.slice(0, 2) || [],
            // Opcional: agregar snippet de descripción si hay búsqueda
            ...(search && p.description ? {
                descriptionSnippet: getSnippet(p.description, search, 100)
            } : {})
        }));

        return NextResponse.json(
            {
                productos: productosProcesados,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasMore: skip + limit < total,
                },
                // Info adicional para debugging
                searchInfo: search ? {
                    query: search,
                    resultsFound: total > 0
                } : null
            },
            {
                headers: {
                    "Cache-Control": search
                        ? "private, no-cache" // No cachear búsquedas
                        : "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching productos:", error);
        return NextResponse.json(
            { error: "Error al cargar productos" },
            { status: 500 }
        );
    }
}

// Helper: Crear snippet de texto con contexto
function getSnippet(text, query, maxLength = 100) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
        return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }

    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + query.length + 30);

    let snippet = text.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
}