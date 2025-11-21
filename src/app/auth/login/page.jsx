// components/auth/LoginForm.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/validations/auth";
import { toast } from "sonner";

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.error) {
                setError("root", {
                    message: "Email o contraseña incorrectos",
                });
                toast.error("Credenciales inválidas");
            } else if (res?.ok) {
                toast.success("Inicio de sesión exitoso");

                // ← IMPORTANTE: Forzar recarga completa
                window.location.href = "/admin";

                // O si preferís usar router (pero puede no actualizar la sesión):
                // router.push("/admin");
                // router.refresh();
            }
        } catch (error) {
            setError("root", {
                message: "Error de conexión. Verifica tu internet.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto mt-50 p-12 space-y-5">
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.email ? "border-red-500" : "border-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="tu@email.com"
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                    Contraseña
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        disabled={isLoading}
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.password ? "border-red-500" : "border-gray-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                    >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            {errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <span className="animate-spin">⏳</span>
                        Iniciando sesión...
                    </>
                ) : (
                    "Iniciar Sesión"
                )}
            </button>

            <div className="text-center space-y-2">
                <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
                <Link
                    href="/auth/register"
                    className="text-sm text-gray-700 hover:underline"
                >
                    ¿No tienes una cuenta? Regístrate
                </Link>
            </div>
        </form>
    );
}