"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function CartContent({ cart, total: initialTotal }) {
    const [items, setItems] = useState(cart.items);
    const [total, setTotal] = useState(initialTotal);

    const updateQuantity = async (itemId, newQuantity) => {
        // TODO: Implementar updateCartItem action
        console.log("Actualizar:", itemId, newQuantity);
    };

    const removeItem = async (itemId) => {
        // TODO: Implementar removeFromCart action
        console.log("Eliminar:", itemId);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 border rounded-lg p-4"
                    >
                        <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={100}
                            height={100}
                            className="rounded object-cover"
                        />

                        <div className="flex-1">
                            <Link
                                href={`/product/${item.product.slug}`}
                                className="font-semibold hover:text-blue-600"
                            >
                                {item.product.name}
                            </Link>

                            <p className="text-gray-600">
                                ${item.product.price}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-1 border rounded"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 border rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>

            {/* Resumen */}
            <div className="border rounded-lg p-6 h-fit">
                <h2 className="text-xl font-bold mb-4">Resumen</h2>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                    Proceder al pago
                </button>
            </div>
        </div>
    );
}