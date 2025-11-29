import { z } from "zod";

export const productSchema = z.object({
    sku: z.string().min(1, "SKU requerido"),
    name: z.string().min(1, "Nombre requerido"),
    price: z.number().min(0, "Precio inválido"),
    coverImages: z.array(z.string().url()).default([]),
    variants: z.any().default([]), // JSON flexible
    description: z.string().optional().default(""),
    guiaTalles: z.string().optional().default(""),

    // Rubro fijo
    rubro: z.enum(["darccuir", "yatay"], {
        required_error: "Rubro requerido",
    }),

    subrubros: z.array(z.string()).default([]),

    active: z.boolean().default(true),
    stock: z.number().int().min(0).default(0),
});