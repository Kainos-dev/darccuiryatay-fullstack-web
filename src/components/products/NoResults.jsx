// components/products/NoResults.jsx
export default function NoResults({ query }) {
    return (
        <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">
                No encontramos resultados para "{query}"
            </h3>
            <p className="text-gray-600 mb-6">
                Intenta con otros términos o revisa la ortografía
            </p>
            <div className="space-x-4">
                <a href="/darccuir/catalog" className="text-blue-600 hover:underline">
                    Ver todo el catálogo
                </a>
                <a href="/" className="text-blue-600 hover:underline">
                    Volver al inicio
                </a>
            </div>
        </div>
    );
}