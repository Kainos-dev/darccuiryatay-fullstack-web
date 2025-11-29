"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCartSession } from "@/lib/cart-session";
import { revalidatePath } from "next/cache";

export async function addToCart(productId, quantity = 1) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        let cart;

        // ✅ CASO 1: Usuario autenticado
        if (userId) {
            cart = await prisma.cart.findUnique({
                where: { userId },
                include: { items: true }
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId }
                });
            }
        }
        // ✅ CASO 2: Usuario anónimo
        else {
            const sessionId = await getOrCreateCartSession();

            cart = await prisma.cart.findUnique({
                where: { sessionId },
                include: { items: true }
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { sessionId }
                });
            }
        }

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.items.find(
            item => item.productId === productId
        );

        if (existingItem) {
            // Actualizar cantidad
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            // Crear nuevo item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            });
        }

        revalidatePath("/cart");
        return { ok: true, message: "Producto agregado al carrito" };

    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        return { ok: false, message: "Error al agregar producto" };
    }
}