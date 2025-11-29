
// app/admin/layout.jsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminLayout({ children }) {
    const session = await auth();

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
            <AdminNavbar user={session.user} />

            {/* Content layout */}
            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar />

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