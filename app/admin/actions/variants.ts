"use server";

import { db } from "@/lib/db";
import type { ModuleVariant } from "@/types/catalog";

export async function getVariants(
    collection_id?: number
): Promise<ModuleVariant[]> {
    const rows = collection_id
        ? await db`SELECT * FROM module_variants WHERE collection_id = ${collection_id} ORDER BY name`
        : await db`SELECT * FROM module_variants ORDER BY name`;

    return rows as ModuleVariant[];
}

export async function createVariant(
    formData: FormData
): Promise<ModuleVariant> {
    const collection_id = Number(formData.get("collection_id"));
    const name = String(formData.get("name") ?? "").trim();

    if (!collection_id || !name) {
        throw new Error("Brak kolekcji lub nazwy wariantu");
    }

    const inserted = await db`
        INSERT INTO module_variants (collection_id, name, attributes)
        VALUES (${collection_id}, ${name}, ${JSON.stringify({})})
        RETURNING *;
    `;

    return inserted[0] as ModuleVariant;
}

export async function updateVariant(
    formData: FormData
): Promise<ModuleVariant> {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();

    if (!id || !name) throw new Error("Brak id lub nazwy");

    const updated = await db`
        UPDATE module_variants
        SET name = ${name}
        WHERE id = ${id}
        RETURNING *;
    `;

    return updated[0] as ModuleVariant;
}

export async function deleteVariant(formData: FormData) {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id");

    await db`DELETE FROM module_variants WHERE id = ${id}`;
    return { success: true };
}
