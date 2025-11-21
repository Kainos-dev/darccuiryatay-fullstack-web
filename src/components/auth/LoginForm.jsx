'use client'

import { useState } from "react";

export default function LoginForm({ email, setEmail, password, setPassword, onSubmit }) {

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <input
                type="email"
                placeholder="Correo electrónico"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Ingrese su contraseña"
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Iniciar sesión
            </button>
        </form>
    )
}