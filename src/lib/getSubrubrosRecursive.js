import { prisma } from "./prisma";

export async function getSubrubrosRecursive(parentId = null, rubro) {
    const subrubros = await prisma.subrubro.findMany({
        where: {
            parentId: parentId,
            rubro: rubro,
            active: true
        },
        orderBy: { order: 'asc' }
    });

    // Para cada subrubro, traer sus hijos recursivamente
    for (const subrubro of subrubros) {
        subrubro.children = await getSubrubrosRecursive(subrubro.id, rubro);
    }

    return subrubros;
}