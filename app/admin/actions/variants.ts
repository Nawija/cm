// app/admin/actions/variants.ts
"use server";

import { db } from "@/lib/db";
import type { ModuleVariant } from "@/types/catalog";

export async function getVariants(
    module_id?: number
): Promise<ModuleVariant[]> {
    const rows = module_id
        ? await db`SELECT * FROM module_variants WHERE module_id = ${module_id} ORDER BY name`
        : await db`SELECT * FROM module_variants ORDER BY name`;
    return rows as ModuleVariant[];
}

export async function createVariant(
    formData: FormData
): Promise<ModuleVariant> {
    const module_id = Number(formData.get("module_id"));
    const name = String(formData.get("name") ?? "").trim();
    const attributes = formData.get("attributes")
        ? JSON.parse(String(formData.get("attributes")))
        : {};

    if (!module_id || !name) throw new Error("Brak modułu lub nazwy wariantu");

    const inserted = await db`
    INSERT INTO module_variants (module_id, name, attributes)
    VALUES (${module_id}, ${name}, ${attributes})
    RETURNING *`;

    return inserted[0] as ModuleVariant;
}

export async function updateVariant(
    formData: FormData
): Promise<ModuleVariant> {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const attributes = formData.get("attributes")
        ? JSON.parse(String(formData.get("attributes")))
        : {};

    if (!id || !name) throw new Error("Brak id lub nazwy wariantu");

    const updated = await db`
    UPDATE module_variants
    SET name = ${name}, attributes = ${attributes}
    WHERE id = ${id}
    RETURNING *`;

    return updated[0] as ModuleVariant;
}

export async function deleteVariant(
    formData: FormData
): Promise<{ success: boolean }> {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id wariantu");

    await db`DELETE FROM module_variants WHERE id = ${id}`;
    return { success: true };
}
