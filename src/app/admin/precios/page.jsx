// app/admin/precios/page.jsx
"use client";

import { useState } from "react";

export default function ActualizarPreciosPage() {
    const [file, setFile] = useState(null);
    const [priceType, setPriceType] = useState("minorista");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validar que sea un archivo Excel
            const validTypes = [
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ];
            if (!validTypes.includes(selectedFile.type)) {
                alert("Por favor, selecciona un archivo Excel válido (.xls o .xlsx)");
                return;
            }
            setFile(selectedFile);
            setResults(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Por favor, selecciona un archivo");
            return;
        }

        setLoading(true);
        setResults(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("priceType", priceType);

            const response = await fetch("/api/admin/update-prices", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al procesar el archivo");
            }

            setResults(data.results);
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setResults(null);
        setPriceType("minorista");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Actualizar Precios desde Excel
                    </h1>

                    {/* Mensaje de carga */}
                    {loading && (
                        <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-6 flex items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <div>
                                <p className="text-blue-900 font-semibold text-lg">
                                    Analizando archivo Excel...
                                </p>
                                <p className="text-blue-700 text-sm mt-1">
                                    Esto puede demorar unos segundos dependiendo del tamaño del archivo
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selector de tipo de precio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Lista de Precios
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="minorista"
                                        checked={priceType === "minorista"}
                                        onChange={(e) => setPriceType(e.target.value)}
                                        className="mr-2"
                                        disabled={loading}
                                    />
                                    <span className="text-gray-700">Minorista</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="mayorista"
                                        checked={priceType === "mayorista"}
                                        onChange={(e) => setPriceType(e.target.value)}
                                        className="mr-2"
                                        disabled={loading}
                                    />
                                    <span className="text-gray-700">Mayorista</span>
                                </label>
                            </div>
                        </div>

                        {/* Subida de archivo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seleccionar archivo Excel
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                disabled={loading}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                            />
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Archivo seleccionado: <strong>{file.name}</strong>
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={!file || loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? "Procesando..." : "Actualizar Precios"}
                            </button>
                            {(file || results) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 font-medium"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Resultados */}
                    {results && (
                        <div className="mt-8 space-y-6">
                            <div className="border-t pt-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Resultados
                                </h2>

                                {/* Resumen */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm text-green-600 font-medium">
                                            Actualizados
                                        </p>
                                        <p className="text-3xl font-bold text-green-700">
                                            {results.actualizados.length}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-sm text-yellow-600 font-medium">
                                            No encontrados
                                        </p>
                                        <p className="text-3xl font-bold text-yellow-700">
                                            {results.noEncontrados.length}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-600 font-medium">Errores</p>
                                        <p className="text-3xl font-bold text-red-700">
                                            {results.errores.length}
                                        </p>
                                    </div>
                                </div>

                                {/* Detalles de actualizados */}
                                {results.actualizados.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            ✅ Productos Actualizados
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-2 px-2">SKU</th>
                                                        <th className="text-left py-2 px-2">Producto</th>
                                                        <th className="text-right py-2 px-2">Anterior</th>
                                                        <th className="text-right py-2 px-2">Nuevo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results.actualizados.map((item, idx) => (
                                                        <tr key={idx} className="border-b last:border-0">
                                                            <td className="py-2 px-2 font-mono text-xs">
                                                                {item.sku}
                                                            </td>
                                                            <td className="py-2 px-2">{item.nombre}</td>
                                                            <td className="py-2 px-2 text-right text-gray-600">
                                                                ${item.precioAnterior?.toFixed(2) || "N/A"}
                                                            </td>
                                                            <td className="py-2 px-2 text-right font-semibold text-green-700">
                                                                ${item.precioNuevo.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Detalles de no encontrados */}
                                {results.noEncontrados.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            ⚠️ Productos No Encontrados
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                                            <ul className="space-y-2 text-sm">
                                                {results.noEncontrados.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between">
                                                        <span className="font-mono text-xs">{item.sku}</span>
                                                        <span className="text-gray-600">
                                                            {item.descripcion}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Detalles de errores */}
                                {results.errores.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            ❌ Errores
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                                            <ul className="space-y-2 text-sm">
                                                {results.errores.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between">
                                                        <span className="font-mono text-xs">{item.sku}</span>
                                                        <span className="text-red-600">{item.razon}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Instrucciones */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">📋 Instrucciones</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• El archivo Excel debe tener productos desde la fila 6 en adelante</li>
                        <li>• Columna A: Código del producto (SKU)</li>
                        <li>• Columna B: Descripción del producto</li>
                        <li>• Columna C: Precio</li>
                        <li>• Solo se procesarán filas con valores en las 3 columnas</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}