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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10 space-y-6 border border-gray-200">

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
                    <p className="text-gray-500 text-sm">Accede a tu cuenta para continuar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-black text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            disabled={isLoading}
                            className={`text-black w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                            ${errors.email ? "border-red-500" : "border-gray-300"}
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                            placeholder="tu@email.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-black text-sm font-medium">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                disabled={isLoading}
                                className={`text-black w-full px-4 py-2 pr-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                                ${errors.password ? "border-red-500" : "border-gray-300"}
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                disabled={isLoading}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Error general */}
                    {errors.root && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.root.message}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>

                {/* Links */}
                <div className="text-center space-y-2">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <br />
                    <Link
                        href="/auth/register"
                        className="text-sm text-gray-700 hover:underline"
                    >
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </div>

            </div>
        </div>
    );

}