// app/api/admin/update-prices/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import * as XLSX from "xlsx";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const priceType = formData.get("priceType"); // "minorista" o "mayorista"

        if (!file) {
            return NextResponse.json(
                { error: "No se proporcionó ningún archivo" },
                { status: 400 }
            );
        }

        if (!priceType || !["minorista", "mayorista"].includes(priceType)) {
            return NextResponse.json(
                { error: "Tipo de precio inválido" },
                { status: 400 }
            );
        }

        // Convertir el archivo a buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Leer el Excel
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convertir a JSON (empezando desde la fila 6, índice 5)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: ["codigo", "descripcion", "precio"],
            range: 5, // Empieza desde la fila 6 (índice 5)
            defval: null,
        });

        // Filtrar solo las filas que tengan valores en A, B y C
        const validRows = jsonData.filter(
            (row) =>
                row.codigo != null &&
                row.codigo !== "" &&
                row.descripcion != null &&
                row.descripcion !== "" &&
                row.precio != null &&
                row.precio !== ""
        );

        if (validRows.length === 0) {
            return NextResponse.json(
                { error: "No se encontraron filas válidas en el archivo" },
                { status: 400 }
            );
        }

        // Procesar cada producto
        const results = {
            actualizados: [],
            noEncontrados: [],
            errores: [],
            total: validRows.length,
        };

        for (const row of validRows) {
            try {
                const sku = String(row.codigo).trim();
                const precio = parseFloat(row.precio);

                if (isNaN(precio)) {
                    results.errores.push({
                        sku,
                        razon: "Precio inválido",
                    });
                    continue;
                }

                // Buscar el producto por SKU
                const producto = await prisma.product.findUnique({
                    where: { sku },
                    select: { id: true, sku: true, name: true, price: true, priceWholesale: true },
                });

                if (!producto) {
                    results.noEncontrados.push({
                        sku,
                        descripcion: row.descripcion,
                    });
                    continue;
                }

                // Actualizar el precio según el tipo
                const updateData =
                    priceType === "minorista"
                        ? { price: precio }
                        : { priceWholesale: precio };

                await prisma.product.update({
                    where: { sku },
                    data: updateData,
                });

                results.actualizados.push({
                    sku,
                    nombre: producto.name,
                    precioAnterior:
                        priceType === "minorista"
                            ? producto.price
                            : producto.priceWholesale,
                    precioNuevo: precio,
                });
            } catch (error) {
                results.errores.push({
                    sku: row.codigo,
                    razon: error.message,
                });
            }
        }

        return NextResponse.json({
            success: true,
            priceType,
            results,
        });
    } catch (error) {
        console.error("Error procesando archivo:", error);
        return NextResponse.json(
            { error: "Error al procesar el archivo: " + error.message },
            { status: 500 }
        );
    }
}