"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData) {
    const id = formData.get("id");

    await prisma.product.delete({
        where: { id },
    });

    revalidatePath("/admin/products");
}
