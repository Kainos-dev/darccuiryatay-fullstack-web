
import Link from "next/link"

import { barlow } from "@/app/ui/fonts"

export default function BtnLogin() {
    return (
        <Link
            href="/auth/login"
            className={`${barlow.className} 
            px-5 py-2 
            text-base 
            rounded-lg 
            text-white
            border border-white/20
            hover:border-white/40
            hover:bg-white/10
            transition-all duration-300`}
        >
            Iniciar Sesión
        </Link>
    )
}


