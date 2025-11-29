// app/admin/actions/deleteProducer.ts
"use server";

import { db } from "@/lib/db";

export async function deleteProducer(
    formData: FormData
): Promise<{ success: boolean }> {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id");

    await db`DELETE FROM producers WHERE id = ${id}`;
    return { success: true };
}
