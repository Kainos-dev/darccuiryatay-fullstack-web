"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCart() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { ok: false, message: "No autenticado" };
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                priceWholesale: true, 
                                images: true,
                                stock: true,
                            }
                        }
                    }
                }
            }
        });

        // Si no existe carrito, devolver vacío
        if (!cart) {
            return {
                ok: true,
                cart: { items: [] },
                total: 0
            };
        }

        // Calcular total según el rol del usuario
        const role = session.user.role;
        const total = cart.items.reduce((sum, item) => {
            const price = role === "mayorista"
                ? item.product.priceWholesale
                : item.product.price;
            return sum + (price * item.quantity);
        }, 0);

        return {
            ok: true,
            cart,
            total
        };

    } catch (error) {
        console.error("Error al obtener carrito:", error);
        return {
            ok: false,
            message: "Error al cargar el carrito"
        };
    }
}