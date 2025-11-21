// components/auth/RegisterForm.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations/auth";
import { toast } from "sonner";

// COMPONENTS
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";

/* import bcrypt from "bcryptjs";
console.log(await bcrypt.hash("Flfsdh_Agdarc04", 10)); */

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState(" ");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "minorista", // o mayorista
        },
    });

    const password = watch("password");

    // Indicador de fortaleza de contraseña
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        const labels = ["Muy débil", "Débil", "Regular", "Buena", "Fuerte"];
        const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

        return {
            strength,
            label: labels[strength - 1] || "",
            color: colors[strength - 1] || "",
        };
    };

    const passwordStrength = getPasswordStrength(password);

    const onSubmit = async (data) => {
        setIsLoading(true);

        const body = role === "minorista"
            ? {
                role,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password, // obligatorio
            }
            : {
                role,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                local: data.local,
                localidad: data.localidad,

                // NO ENVIAR password (Prisma la acepta como null)
                password: null,
            };

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await res.json();


            if (!res.ok) {
                if (result.error === "El usuario ya existe") {
                    setError("email", {
                        message: "Este email ya está registrado",
                    });
                } else {
                    setError("root", {
                        message: result.message || "Error al crear la cuenta",
                    });
                }
                return;
            }


            // Registro exitoso - redirigir a verificar email
            /* router.push("/auth/verify-email?email=" + encodeURIComponent(data.email)); */
            toast.success(
                formData.role === "mayorista"
                    ? "Tu cuenta mayorista fue creada. Un administrador la aprobará."
                    : "Cuenta creada correctamente. Redirigiendo al login..."
            );


            setTimeout(() => {
                router.push("/auth/login");
            }, 1500); // delay suave
        } catch (error) {
            setError("root", {
                message: "Error de conexión. Intenta de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto mt-50 p-12 space-y-5">
            <div className="flex gap-4">
                <button
                    type="button"
                    className={`w-full py-1 px-3 border rounded-md cursor-pointer
                            ${role === "minorista" ? "border-blue-600" : "border-gray-400"}`}
                    onClick={() => setRole("minorista")}
                >
                    MINORISTA
                </button>

                <button
                    type="button"
                    className={`w-full py-1 px-3 border rounded-md cursor-pointer
                            ${role === "mayorista" ? "border-blue-600" : "border-gray-400"}`}
                    onClick={() => setRole("mayorista")}
                >
                    MAYORISTA
                </button>
            </div>

            {
                role !== " "
                    ?
                    <>
                        {/* PASO CRÍTICO: Vincular el rol al formulario */}
                        <input type="hidden" value={role} {...register("role")} />

                        {/* === Inputs comunes === */}
                        <FormInput
                            id="firstName"
                            label="Nombre"
                            placeholder="Juan"
                            register={register("firstName")}
                            error={errors.firstName}
                        />

                        <FormInput
                            id="lastName"
                            label="Apellido"
                            placeholder="Pérez"
                            register={register("lastName")}
                            error={errors.lastName}
                        />

                        <FormInput
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                            register={register("email")}
                            error={errors.email}
                        />

                        {/* === Inputs para minorista === */}
                        {role === "minorista" && (
                            <>
                                <PasswordInput
                                    id="password"
                                    label="Contraseña"
                                    register={register("password")}
                                    error={errors.password}
                                />

                                <PasswordInput
                                    id="confirmPassword"
                                    label="Confirmar contraseña"
                                    register={register("confirmPassword")}
                                    error={errors.confirmPassword}
                                />
                            </>
                        )}

                        {/* === Inputs para mayorista === */}
                        {role === "mayorista" && (
                            <>
                                <FormInput
                                    id="phone"
                                    label="Celular"
                                    placeholder="11 2345 6789"
                                    register={register("phone")}
                                    error={errors.phone}
                                />

                                <FormInput
                                    id="local"
                                    label="Nombre del local"
                                    placeholder="Repuestos Juan"
                                    register={register("local")}
                                    error={errors.local}
                                />

                                <FormInput
                                    id="localidad"
                                    label="Localidad"
                                    placeholder="Buenos Aires"
                                    register={register("localidad")}
                                    error={errors.localidad}
                                />
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                            transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin">⏳</span> Creando cuenta...
                                </>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </button>
                    </>
                    : <span className="text-center flex justify-center w-full text-red-400">Selecciona un tipo de cuenta para continuar.</span>
            }

            {errors.root && (
                <p className="text-red-600 text-center mt-2">{errors.root.message}</p>
            )}

            <p className="text-xs text-gray-500 text-center">
                Al registrarte, aceptas nuestros Términos y Condiciones
            </p>

            <Link
                href="/auth/login"
                className="block text-center text-sm text-blue-600 hover:underline"
            >
                ¿Ya tienes una cuenta? Inicia sesión aquí
            </Link>
        </form >
    );
}