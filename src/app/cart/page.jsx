

import { getCart } from "@/actions/cart/get-cart";
import { CartContent } from "@/components/cart/CartContent";
import { redirect } from "next/navigation";

/* export const metadata = {
    title: "Carrito de Compras",
    description: "Tu carrito de compras"
}; */

export default async function CartPage() {
    const { ok, cart, total, message } = await getCart();

    if (!ok) {
        // Si no está autenticado, redirigir al login
        redirect("/auth/login?");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                Carrito de Compras
            </h1>

            {cart.items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                        Tu carrito está vacío
                    </p>
                    <a
                        href="/products"
                        className="text-blue-600 hover:underline"
                    >
                        Continuar comprando
                    </a>
                </div>
            ) : (
                <CartContent cart={cart} total={total} />
            )}
        </div>
    );
}