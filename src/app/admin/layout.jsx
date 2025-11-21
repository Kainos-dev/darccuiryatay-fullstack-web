// src/app/admin/layout.jsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
    const session = await auth();
    console.log("🚀 ~ AdminLayout ~ session:", session)

    // Verificar que existe sesión
    if (!session || !session.user) {
        redirect("/auth/login");
    }

    // Verificar que el role sea "admin"
    if (session.user.role !== "admin") {
        redirect("/"); // O mostrar un 403
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Top Navbar */}
            <nav className="w-full bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">
                    Panel de Administración
                </h1>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        {session.user.email}
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {session.user.role}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Content layout */}
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r shadow-sm p-5">
                    <ul className="flex flex-col gap-3">
                        <li className="text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition">
                            📊 Dashboard
                        </li>
                        <li className="text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition">
                            👤 Usuarios
                        </li>
                        <li className="text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition">
                            🛒 Productos
                        </li>
                        <li className="text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition">
                            📦 Pedidos
                        </li>
                        <li className="text-gray-700 font-medium hover:text-blue-600 cursor-pointer transition">
                            ⚙️ Configuración
                        </li>
                    </ul>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );

}