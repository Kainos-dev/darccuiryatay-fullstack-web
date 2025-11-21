
import Link from "next/link"

export default function BtnLogin() {
    return (
        <Link
            href="/auth/login"
            className="px-4 py-2 bg-amber-800 text-sm text-white rounded hover:bg-amber-900 transition"
        >
            Iniciar Sesión
        </Link>
    )
}