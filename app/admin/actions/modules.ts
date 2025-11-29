// app/admin/actions/modules.ts
"use server";

import { db } from "@/lib/db";
import type { Module } from "@/types/catalog";

export async function getModules(collection_id?: number): Promise<Module[]> {
    const rows = collection_id
        ? await db`SELECT * FROM modules WHERE collection_id = ${collection_id} ORDER BY name`
        : await db`SELECT * FROM modules ORDER BY name`;
    return rows as Module[];
}

export async function createModule(formData: FormData): Promise<Module> {
    const collection_id = Number(formData.get("collection_id"));
    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const width = formData.get("width") ? Number(formData.get("width")) : null;
    const height = formData.get("height")
        ? Number(formData.get("height"))
        : null;
    const depth = formData.get("depth") ? Number(formData.get("depth")) : null;
    const extra_attributes = formData.get("extra_attributes")
        ? JSON.parse(String(formData.get("extra_attributes")))
        : {};

    if (!collection_id || !name)
        throw new Error("Brak kolekcji lub nazwy modułu");

    const inserted = await db`
    INSERT INTO modules (collection_id, name, code, category, width, height, depth, extra_attributes)
    VALUES (${collection_id}, ${name}, ${code || null}, ${
        category || null
    }, ${width}, ${height}, ${depth}, ${extra_attributes})
    RETURNING *`;

    return inserted[0] as Module;
}

export async function updateModule(formData: FormData): Promise<Module> {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const width = formData.get("width") ? Number(formData.get("width")) : null;
    const height = formData.get("height")
        ? Number(formData.get("height"))
        : null;
    const depth = formData.get("depth") ? Number(formData.get("depth")) : null;
    const extra_attributes = formData.get("extra_attributes")
        ? JSON.parse(String(formData.get("extra_attributes")))
        : {};

    if (!id || !name) throw new Error("Brak id lub nazwy modułu");

    const updated = await db`
    UPDATE modules
    SET name = ${name}, code = ${code || null}, category = ${category || null},
        width = ${width}, height = ${height}, depth = ${depth}, extra_attributes = ${extra_attributes}
    WHERE id = ${id}
    RETURNING *`;

    return updated[0] as Module;
}

export async function deleteModule(
    formData: FormData
): Promise<{ success: boolean }> {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("Brak id modułu");

    await db`DELETE FROM modules WHERE id = ${id}`;
    return { success: true };
}
