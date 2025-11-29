import { useSession } from "next-auth/react";       //usamos esto en lugar de "auth" para manejar la session en un clientComponentn
import Image from "next/image"
import Link from "next/link"
// components : 
import BtnLogin from "./BtnLogin"
import { Search, UserRound, ShoppingCart } from "lucide-react";



export default function MainNavBar({ rubro, logo }) {
    const { data: session, status } = useSession();

    return (
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-20">
            <Image
                src={logo}
                alt={`${rubro} Logo`}
                width={125}
                height={125}
                className="mb-6 ml-8 sm:mb-8 border-4"
            />


            {/* Barra de búsqueda */}
            < div className="relative w-full max-w-md mb-4" >
                <input
                    type="text"
                    aria-label="Buscar productos"
                    placeholder="Buscar..."
                    className="w-full pl-11 pr-4 py-2.5 
                    border-b border-gray-300 
                    focus:border-white focus:ring-0 
                    transition-all outline-none text-gray-700 placeholder-gray-400"

                />

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5 text-gray-400" />
                </span>
            </div >

            <div className="flex items-center gap-8">
                <Link
                    href="/cart"
                >
                    <ShoppingCart className="w-8 h-8" />
                </Link>

                {
                    session?.user
                        ?
                        <UserRound className="w-8 h-8 text-white mr-8" />
                        :
                        <BtnLogin />
                }
            </div>
        </div>
    )
}