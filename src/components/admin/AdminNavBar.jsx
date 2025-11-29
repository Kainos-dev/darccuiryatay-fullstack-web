import { signOut } from "@/auth";

export default function AdminNavbar({ user }) {
    return (
        <nav className="w-full bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">
                Panel de Administración
            </h1>

            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    {user.email}
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {user.role}
                    </span>
                </div>

                <form action={async () => {
                    'use server';
                    await signOut({ redirectTo: "/" });
                }}>
                    <button
                        type="submit"
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition"
                    >
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </nav>
    );
}