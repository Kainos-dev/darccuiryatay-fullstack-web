import { barlow } from "../ui/fonts"

import Carrousel from "@/components/ui/Carrousel"

const imagesYatay = [
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760907710/Crudo_erjpm7.jpg',
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760907717/Portada_jj6hb4.jpg',
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760760946/Cemento_c8kzfa.jpg'
];

const yatayTitle = "https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1763697279/letras-yatay_hrbp3u.png"
const yatayLogo = "https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1763697294/logo-yatay-blanco_kxvqnz.png"

export default function YatayPage() {
    return (
        <Carrousel images={imagesYatay} title={yatayTitle} yatayLogo={yatayLogo} />
    )
}