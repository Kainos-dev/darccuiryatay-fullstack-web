import { prisma } from "@/lib/prisma";
import { getSubrubrosRecursive } from "@/lib/getSubrubrosRecursive";
//components
import Carrousel from "@/components/ui/Carrousel"

const rubro = "yatay";
const imagesYatay = [
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760907710/Crudo_erjpm7.jpg',
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760907717/Portada_jj6hb4.jpg',
    'https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1760760946/Cemento_c8kzfa.jpg'
];

const yatayTitle = "https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1763697279/letras-yatay_hrbp3u.png"
const yatayLogo = "https://res.cloudinary.com/ddbhwo6fn/image/upload/f_auto,q_auto/v1763697294/logo-yatay-blanco_kxvqnz.png"

async function getSubrubros(rubro) {
    // Solo traer los de nivel superior (sin padre)
    return await getSubrubrosRecursive(null, rubro);
}

/* ## Cómo funciona:

1. **`SubrubroItem` es recursivo**: Se llama a sí mismo para renderizar hijos, nietos, bisnietos, etc.
2. **Indentación visual**: Cada nivel tiene más padding (`pl-4`, `pl-8`, etc.)
3. **Flechas diferentes**: 
   - `ChevronDown` para el botón principal
   - `ChevronRight` para subrubros con hijos (rota 90° al abrir)
4. **Funciona con infinitos niveles**: Mientras tu DB tenga la estructura, se renderizará

## Resultado visual:
```
Novedades ▼
  ├─ Promoción ▶
  │   ├─ Hombre
  │   └─ Mujer
  └─ Temporada ▶
      └─ Verano */

export default async function YatayPage() {
    const subrubros = await getSubrubros("yatay");

    return (
        <Carrousel
            rubro={rubro}
            images={imagesYatay}
            title={yatayTitle}
            yatayLogo={yatayLogo}
            subrubros={subrubros}
        />
    )
}