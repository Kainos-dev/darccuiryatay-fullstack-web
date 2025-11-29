'use client';

import { useState } from "react";

export default function SubrubrosManager({ initialSubrubros }) {
    const [subrubros, setSubrubros] = useState(initialSubrubros);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newSubrubro, setNewSubrubro] = useState({
        name: '',
        slug: '',
        rubro: 'darccuir',
        parentId: null,
        order: 0
    });

    // Auto-generar slug desde el nombre
    const handleNameChange = (name) => {
        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setNewSubrubro({
            ...newSubrubro,
            name,
            slug
        });
    };

    // Crear subrubro
    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/subrubros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubrubro)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error creando subrubro');
            }

            const created = await response.json();

            setSubrubros([...subrubros, created]);
            setNewSubrubro({
                name: '',
                slug: '',
                rubro: 'darccuir',
                parentId: null,
                order: 0
            });
            setIsCreating(false);
            alert('Subrubro creado exitosamente');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar subrubro
    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este subrubro?')) return;

        try {
            const response = await fetch(`/api/admin/subrubros/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error eliminando');

            setSubrubros(subrubros.filter(s => s.id !== id));
            alert('Subrubro eliminado');
        } catch (error) {
            alert('Error eliminando subrubro');
        }
    };

    // Agrupar por rubro
    const subrubrosPorRubro = {
        darccuir: subrubros.filter(s => s.rubro === 'darccuir'),
        yatay: subrubros.filter(s => s.rubro === 'yatay')
    };

    // Renderizar árbol jerárquico
    const renderSubrubroTree = (subrubro, level = 0) => {
        const children = subrubros.filter(s => s.parentId === subrubro.id);

        return (
            <div key={subrubro.id}>
                <div
                    className={`flex items-center justify-between p-3 border rounded mb-2 bg-white hover:bg-gray-50`}
                    style={{ marginLeft: `${level * 20}px` }}
                >
                    <div className="flex items-center gap-3">
                        {level > 0 && (
                            <span className="text-gray-400">└─</span>
                        )}
                        <div>
                            <p className="font-medium">{subrubro.name}</p>
                            <p className="text-xs text-gray-500">
                                /{subrubro.slug}
                                {subrubro.parent && (
                                    <span className="ml-2">
                                        (hijo de: {subrubro.parent.name})
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <span className={`
                            px-2 py-1 text-xs rounded-full
                            ${subrubro.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }
                        `}>
                            {subrubro.active ? 'Activo' : 'Inactivo'}
                        </span>
                        <button
                            onClick={() => handleDelete(subrubro.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>

                {/* Renderizar hijos recursivamente */}
                {children.map(child => renderSubrubroTree(child, level + 1))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Botón crear */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    {subrubros.length} subrubros en total
                </p>

                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {isCreating ? 'Cancelar' : '+ Crear Subrubro'}
                </button>
            </div>

            {/* Formulario de creación */}
            {isCreating && (
                <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold mb-4">Nuevo Subrubro</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre *</label>
                            <input
                                type="text"
                                required
                                value={newSubrubro.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Ej: Botas"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Slug (auto-generado)</label>
                            <input
                                type="text"
                                required
                                value={newSubrubro.slug}
                                onChange={(e) => setNewSubrubro({ ...newSubrubro, slug: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                                placeholder="botas"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Rubro *</label>
                            <select
                                value={newSubrubro.rubro}
                                onChange={(e) => setNewSubrubro({ ...newSubrubro, rubro: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="darccuir">Darccuir</option>
                                <option value="yatay">Yatay</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Subrubro Padre (opcional)</label>
                            <select
                                value={newSubrubro.parentId || ''}
                                onChange={(e) => setNewSubrubro({
                                    ...newSubrubro,
                                    parentId: e.target.value || null
                                })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="">-- Sin padre --</option>
                                {subrubros
                                    .filter(s => s.rubro === newSubrubro.rubro)
                                    .map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Orden</label>
                            <input
                                type="number"
                                value={newSubrubro.order ?? ""}
                                onChange={(e) =>
                                    setNewSubrubro({
                                        ...newSubrubro,
                                        order: e.target.value === "" ? "" : parseInt(e.target.value)
                                    })
                                }
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Creando...' : 'Crear Subrubro'}
                    </button>
                </form>
            )}

            {/* Lista de subrubros por rubro */}
            <div className="space-y-6">
                {/* Darccuir */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            Darccuir
                        </span>
                        <span className="text-sm text-gray-500">
                            ({subrubrosPorRubro.darccuir.length})
                        </span>
                    </h2>

                    {subrubrosPorRubro.darccuir.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay subrubros</p>
                    ) : (
                        <div>
                            {subrubrosPorRubro.darccuir
                                .filter(s => !s.parentId) // Solo mostrar raíz
                                .map(s => renderSubrubroTree(s))
                            }
                        </div>
                    )}
                </div>

                {/* Yatay */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            Yatay
                        </span>
                        <span className="text-sm text-gray-500">
                            ({subrubrosPorRubro.yatay.length})
                        </span>
                    </h2>

                    {subrubrosPorRubro.yatay.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay subrubros</p>
                    ) : (
                        <div>
                            {subrubrosPorRubro.yatay
                                .filter(s => !s.parentId)
                                .map(s => renderSubrubroTree(s))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}