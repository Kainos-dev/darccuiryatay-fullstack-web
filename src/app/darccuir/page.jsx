import { getSubrubrosRecursive } from "@/lib/getSubrubrosRecursive";

import Carrousel from "@/components/ui/Carrousel"

const rubro = "darccuir";
const imagesDarccuir = [
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760909471/Portada_Colores_Varios_mzbmub.jpg',
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760583671/Detalle_Suela_ricml5.jpg',
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760675900/Portada_ahk5km.jpg'
];

const darccuirTitle = "https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1763697279/letras-darccuir_ux09hk.png"
const darccuirLogo = "https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1763697298/logo-darccuir-blanco_osmcmx.png"

async function getSubrubros(rubro) {
    // Solo traer los de nivel superior (sin padre)
    return await getSubrubrosRecursive(null, rubro);
}

export default async function DarccuirPage() {
    const subrubros = await getSubrubros("darccuir");

    return (
        <Carrousel
            rubro={rubro}
            images={imagesDarccuir}
            title={darccuirTitle}
            yatayLogo={darccuirLogo}
            subrubros={subrubros}
        />
    )
}