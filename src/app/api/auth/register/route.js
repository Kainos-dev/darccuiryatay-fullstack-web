import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            storeName,
            localidad,
            role,
        } = body;

        // 1. verificar si existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "El usuario ya existe" },
                { status: 400 }
            );
        }

        // 2. construir objeto según role
        let userData = {
            firstName,
            lastName,
            email,
            role,
        };

        // MINORISTA → debe tener password
        if (role === "minorista") {
            if (!password) {
                return NextResponse.json(
                    { error: "La contraseña es obligatoria para minoristas" },
                    { status: 400 }
                );
            }

            const hash = await bcrypt.hash(password, 10);
            userData.password = hash;

            // Campos mayorista deben estar en null
            userData.phone = null;
            userData.storeName = null;
            userData.localidad = null;
        }

        // MAYORISTA → NO se registra con password
        if (role === "mayorista") {
            userData.password = ""; // o null, según cómo prefieras manejarlo
            userData.phone = phone ?? null;
            userData.storeName = storeName ?? null;
            userData.localidad = localidad ?? null;
        }

        // 3. Crear usuario
        await prisma.user.create({
            data: userData
        });

        return NextResponse.json(
            { message: "Usuario registrado correctamente" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return NextResponse.json(
            { error: "Error al registrar usuario" },
            { status: 500 }
        );
    }
}
