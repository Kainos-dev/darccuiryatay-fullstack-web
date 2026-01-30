"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations/auth";
import { toast } from "sonner";

import { inter } from "@/app/ui/fonts";

// COMPONENTS
import { FormInput } from "@/components/auth/FormInput";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState("minorista");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "minorista",
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        reset({
            role: newRole,
            firstName: "",
            lastName: "",
            email: "",
        });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                let errorMessage = "Error al crear la cuenta";
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = `Error ${res.status}: ${res.statusText}`;
                }
                setError("root", { message: errorMessage });
                return;
            }

            toast.success(
                role === "mayorista"
                    ? "Tu cuenta mayorista fue creada. Un administrador la aprobará."
                    : "Cuenta creada correctamente. Revisa tu email para verificar tu cuenta."
            );

            router.push("/auth/login");
        } catch {
            setError("root", { message: "Error de conexión. Intenta de nuevo." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`${inter.className} min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6`}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="
                    w-full max-w-md
                    bg-white text-black
                    shadow-xl border border-gray-100
                    rounded-2xl
                    px-4 py-8
                    sm:px-6 sm:py-10
                    space-y-6
                "
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
                    Crear una nueva cuenta
                </h2>

                {/* BOTONES DE ROL */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleRoleChange("minorista")}
                        className={`py-2 rounded-xl text-sm font-medium transition border
                            ${role === "minorista"
                                ? "bg-brown text-white shadow-sm"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }
                        `}
                    >
                        Minorista
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRoleChange("mayorista")}
                        className={`py-2 rounded-xl text-sm font-medium transition border
                            ${role === "mayorista"
                                ? "bg-brown text-white shadow-sm"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }
                        `}
                    >
                        Mayorista
                    </button>
                </div>

                <input type="hidden" value={role} {...register("role")} />

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <FormInput
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    register={register("email")}
                    error={errors.email}
                />

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
                            id="storeName"
                            label="Nombre del local"
                            placeholder="Repuestos Juan"
                            register={register("storeName")}
                            error={errors.storeName}
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
                    className="
                        w-full py-2
                        text-sm sm:text-md
                        bg-brown hover:bg-light-brown
                        text-white font-medium
                        rounded-xl transition
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2
                    "
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin">⏳</span> Creando cuenta...
                        </>
                    ) : (
                        "Crear Cuenta"
                    )}
                </button>

                {errors.root && (
                    <p className="text-red-600 text-center text-sm">
                        {errors.root.message}
                    </p>
                )}

                <p className="text-xs text-gray-500 text-center">
                    Al registrarte, aceptas nuestros Términos y Condiciones
                </p>

                <Link
                    href="/auth/login"
                    className="block text-center text-sm text-brown hover:underline"
                >
                    ¿Ya tienes una cuenta? Inicia sesión
                </Link>
            </form>
        </div>
    );
}
